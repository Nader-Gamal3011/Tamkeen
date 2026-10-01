// pages/Reception/Reception_BookingRequests.jsx
import { useState } from "react";
import { useBookingRequests } from "../../hooks/useBookingRequests";
import {
  LuChevronLeft,
  LuChevronRight,
  LuCheck,
  LuX,
  LuClock,
  LuUser,
  LuStethoscope,
  LuCalendarDays,
  LuFileText,
} from "react-icons/lu";

const getInitials = (name = "") =>
  name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

const avatarColors = [
  "bg-blue-500",
  "bg-amber-500",
  "bg-emerald-500",
  "bg-purple-500",
  "bg-rose-500",
  "bg-teal-500",
  "bg-indigo-500",
  "bg-orange-500",
];
const getAvatarColor = (name = "") => {
  let hash = 0;
  for (let i = 0; i < name.length; i++)
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return avatarColors[Math.abs(hash) % avatarColors.length];
};

const TYPE_LABEL = {
  consultation: "Consultation",
  followUp: "Follow-up",
  surgery: "Surgery",
  telemedicine: "Telemedicine",
};

const Reception_BookingRequests = () => {
  const {
    requests,
    loading,
    error,
    page,
    setPage,
    totalPages,
    totalCount,
    approveRequest,
    rejectRequest,
  } = useBookingRequests();

  // Approve modal state
  const [approveTarget, setApproveTarget] = useState(null);
  const [approveForm, setApproveForm] = useState({
    startTime: "",
    endTime: "",
  });
  const [approveError, setApproveError] = useState("");

  // Reject modal state
  const [rejectTarget, setRejectTarget] = useState(null);
  const [rejectReason, setRejectReason] = useState("");
  const [rejectError, setRejectError] = useState("");

  const [actionLoading, setActionLoading] = useState(false);

  const openApproveModal = (req) => {
    setApproveTarget(req);
    setApproveForm({
      startTime: req.startTime || "",
      endTime: "",
    });
    setApproveError("");
  };

  const openRejectModal = (req) => {
    setRejectTarget(req);
    setRejectReason("");
    setRejectError("");
  };

  const handleApprove = async () => {
    if (!approveForm.startTime || !approveForm.endTime) {
      setApproveError("Please enter both start and end time.");
      return;
    }
    setActionLoading(true);
    const result = await approveRequest(approveTarget._id, approveForm);
    setActionLoading(false);
    if (!result.success) {
      setApproveError(result.message || "Failed to approve.");
      return;
    }
    setApproveTarget(null);
  };

  const handleReject = async () => {
    if (!rejectReason.trim()) {
      setRejectError("Please enter a rejection reason.");
      return;
    }
    setActionLoading(true);
    const result = await rejectRequest(rejectTarget._id, rejectReason);
    setActionLoading(false);
    if (!result.success) {
      setRejectError(result.message || "Failed to reject.");
      return;
    }
    setRejectTarget(null);
  };

  return (
    <div className="px-7 py-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <h2 className="text-[18px] font-bold text-slate-900">
            Booking Requests
          </h2>
          <span className="inline-flex items-center gap-1 text-xs font-medium text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">
            <LuClock size={11} />
            Pending Approval
          </span>
        </div>
        <p className="text-sm text-slate-500">{totalCount} pending requests</p>
      </div>

      {/* Table Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="px-6 py-12 text-center text-slate-400">
            Loading requests...
          </div>
        ) : error ? (
          <div className="px-6 py-12 text-center text-red-500">{error}</div>
        ) : requests.length === 0 ? (
          <div className="px-6 py-16 text-center">
            <LuClock size={36} className="text-slate-300 mx-auto mb-3" />
            <p className="text-slate-400 text-sm">
              No pending booking requests
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px]">
              <thead>
                <tr className="bg-gray-50 border-b border-slate-50">
                  {[
                    "Patient",
                    "Doctor",
                    "Type",
                    "Preferred Date & Time",
                    "Notes",
                    "Requested At",
                    "Actions",
                  ].map((h) => (
                    <th
                      key={h}
                      className="text-left text-[12px] text-slate-800 font-bold px-4 py-3 uppercase whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {requests.map((req, index) => {
                  const patientName =
                    req.patientId?.userId?.fullName || "Unknown";
                  const patientCode = req.patientId?.patientId || "-";
                  const patientPhone = req.patientId?.userId?.phone || "-";
                  const doctorName = req.doctorId?.userId?.fullName || "-";
                  const doctorSpec = req.doctorId?.specialty || "";
                  const type =
                    TYPE_LABEL[req.appointmentType] ||
                    req.appointmentType ||
                    "-";
                  const preferredDate = req.date
                    ? new Date(req.date).toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })
                    : "-";
                  const preferredTime = req.startTime || "-";
                  const notes = req.notes || "-";
                  const requestedAt = req.createdAt
                    ? new Date(req.createdAt).toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    : "-";

                  return (
                    <tr
                      key={req._id || index}
                      className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div
                            className={`w-9 h-9 rounded-full ${getAvatarColor(patientName)} flex items-center justify-center shrink-0`}>
                            <span className="text-white font-semibold text-xs">
                              {getInitials(patientName)}
                            </span>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-slate-800">
                              {patientName}
                            </p>
                            <p className="text-xs text-slate-400">
                              #{patientCode} &bull; {patientPhone}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <p className="text-sm text-slate-700">{doctorName}</p>
                        {doctorSpec && (
                          <p className="text-xs text-slate-400">{doctorSpec}</p>
                        )}
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-700">
                        {type}
                      </td>
                      <td className="px-4 py-3">
                        <p className="text-sm font-medium text-slate-800">
                          {preferredDate}
                        </p>
                        <p className="text-xs text-blue-600">{preferredTime}</p>
                      </td>
                      <td
                        className="px-4 py-3 text-sm text-slate-500 max-w-[180px] truncate"
                        title={notes}>
                        <span className="inline-flex items-center gap-1">
                          <LuFileText
                            size={13}
                            className="text-slate-400 shrink-0"
                          />
                          {notes}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-xs text-slate-400">
                        {requestedAt}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => openApproveModal(req)}
                            className="inline-flex items-center gap-1 px-3 py-1.5 bg-green-600 text-white text-xs font-medium rounded-lg hover:bg-green-700 transition-colors">
                            <LuCheck size={13} />
                            Approve
                          </button>
                          <button
                            onClick={() => openRejectModal(req)}
                            className="inline-flex items-center gap-1 px-3 py-1.5 bg-red-50 text-red-600 border border-red-100 text-xs font-medium rounded-lg hover:bg-red-100 transition-colors">
                            <LuX size={13} />
                            Reject
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100">
            <p className="text-sm text-slate-500">
              Page {page} of {totalPages}
            </p>
            <div className="flex items-center gap-1">
              <button
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 text-slate-500 disabled:opacity-40 hover:bg-slate-50">
                <LuChevronLeft size={16} />
              </button>
              <button
                disabled={page >= totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 text-slate-500 disabled:opacity-40 hover:bg-slate-50">
                <LuChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* APPROVE MODAL */}
      {approveTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md mx-4 p-6">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-bold text-slate-900">
                Approve Request
              </h3>
              <button
                onClick={() => setApproveTarget(null)}
                className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-slate-100 text-slate-500">
                <LuX size={18} />
              </button>
            </div>

            {/* Request Summary */}
            <div className="bg-slate-50 rounded-xl p-4 mb-5 space-y-2">
              <div className="flex items-center gap-2">
                <LuUser size={14} className="text-slate-400" />
                <span className="text-sm text-slate-700">
                  {approveTarget.patientId?.userId?.fullName}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <LuStethoscope size={14} className="text-slate-400" />
                <span className="text-sm text-slate-700">
                  {approveTarget.doctorId?.userId?.fullName}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <LuCalendarDays size={14} className="text-slate-400" />
                <span className="text-sm text-slate-700">
                  {approveTarget.date
                    ? new Date(approveTarget.date).toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })
                    : "-"}{" "}
                  &bull; Requested: {approveTarget.startTime}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="text-sm font-medium text-slate-700 block mb-1">
                  Start Time
                </label>
                <input
                  type="time"
                  value={approveForm.startTime}
                  onChange={(e) =>
                    setApproveForm((f) => ({ ...f, startTime: e.target.value }))
                  }
                  className="w-full h-10 px-3 border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700 block mb-1">
                  End Time
                </label>
                <input
                  type="time"
                  value={approveForm.endTime}
                  onChange={(e) =>
                    setApproveForm((f) => ({ ...f, endTime: e.target.value }))
                  }
                  className="w-full h-10 px-3 border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
            </div>

            {approveError && (
              <p className="text-red-500 text-sm mb-3">{approveError}</p>
            )}

            <div className="flex items-center gap-3">
              <button
                onClick={() => setApproveTarget(null)}
                className="flex-1 h-10 border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50">
                Cancel
              </button>
              <button
                onClick={handleApprove}
                disabled={actionLoading}
                className="flex-1 h-10 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 disabled:opacity-50">
                {actionLoading ? "Approving..." : "Confirm Approval"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* REJECT MODAL */}
      {rejectTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md mx-4 p-6">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-bold text-slate-900">
                Reject Request
              </h3>
              <button
                onClick={() => setRejectTarget(null)}
                className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-slate-100 text-slate-500">
                <LuX size={18} />
              </button>
            </div>

            {/* Request Summary */}
            <div className="bg-red-50 rounded-xl p-4 mb-5 space-y-2">
              <div className="flex items-center gap-2">
                <LuUser size={14} className="text-slate-400" />
                <span className="text-sm text-slate-700">
                  {rejectTarget.patientId?.userId?.fullName}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <LuStethoscope size={14} className="text-slate-400" />
                <span className="text-sm text-slate-700">
                  {rejectTarget.doctorId?.userId?.fullName}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <LuCalendarDays size={14} className="text-slate-400" />
                <span className="text-sm text-slate-700">
                  {rejectTarget.date
                    ? new Date(rejectTarget.date).toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })
                    : "-"}{" "}
                  &bull; {rejectTarget.startTime}
                </span>
              </div>
            </div>

            <div className="mb-4">
              <label className="text-sm font-medium text-slate-700 block mb-1">
                Rejection Reason
              </label>
              <textarea
                rows={3}
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="e.g. Doctor not available on this date. Please try another date."
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-red-400"
              />
            </div>

            {rejectError && (
              <p className="text-red-500 text-sm mb-3">{rejectError}</p>
            )}

            <div className="flex items-center gap-3">
              <button
                onClick={() => setRejectTarget(null)}
                className="flex-1 h-10 border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50">
                Cancel
              </button>
              <button
                onClick={handleReject}
                disabled={actionLoading}
                className="flex-1 h-10 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 disabled:opacity-50">
                {actionLoading ? "Rejecting..." : "Confirm Rejection"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Reception_BookingRequests;
