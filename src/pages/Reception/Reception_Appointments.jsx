// pages/reception/Reception_Appointments.jsx
import { useState, useMemo } from "react";
import { useReceptionistAllAppointments } from "../../hooks/useReceptionistAllAppointments";
import { apiRequest } from "../../utils/apiClient";
import {
  LuSearch,
  LuChevronLeft,
  LuChevronRight,
  LuPlus,
  LuFilter,
  LuX,
  LuPencil,
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
  "bg-blue-500", "bg-amber-500", "bg-emerald-500", "bg-purple-500",
  "bg-rose-500", "bg-teal-500", "bg-indigo-500", "bg-orange-500",
];

const getAvatarColor = (name = "") => {
  let hash = 0;
  for (let i = 0; i < name.length; i++)
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return avatarColors[Math.abs(hash) % avatarColors.length];
};

// ✅ matches backend appointment status enum
const STATUS_BADGE = {
  scheduled: { label: "Scheduled", dot: "bg-blue-500", className: "text-blue-700 bg-blue-50" },
  waiting: { label: "Waiting", dot: "bg-amber-500", className: "text-amber-700 bg-amber-50" },
  withDoctor: { label: "With Doctor", dot: "bg-emerald-500", className: "text-emerald-700 bg-emerald-50" },
  completed: { label: "Completed", dot: "bg-green-500", className: "text-green-700 bg-green-50" },
  canceled: { label: "Canceled", dot: "bg-red-500", className: "text-red-700 bg-red-50" },
};

// ✅ matches backend appointmentType enum
const TYPE_LABEL = {
  consultation: "Consultation",
  followUp: "Follow-up",
  surgery: "Surgery",
};

const emptyForm = {
  patientId: "",
  doctorId: "",
  appointmentType: "consultation",
  date: "",
  startTime: "",
  endTime: "",
  notes: "",
};

const Reception_Appointments = () => {
  const {
    appointments,
    loading,
    error,
    search,
    setSearch,
    filters,
    setFilters,
    page,
    setPage,
    totalPages,
    totalCount,
    bookAppointment,
    updateAppointment,
    cancelAppointment,
  } = useReceptionistAllAppointments();

  // ── lookup data for dropdowns ──
  const [doctors, setDoctors] = useState([]);
  const [patients, setPatients] = useState([]);
  const [lookupLoading, setLookupLoading] = useState(false);

  // ── modal state ──
  const [showBookModal, setShowBookModal] = useState(false);
  const [editingAppt, setEditingAppt] = useState(null);
  const [cancelTarget, setCancelTarget] = useState(null);
  const [formData, setFormData] = useState(emptyForm);
  const [formError, setFormError] = useState("");
  const [formLoading, setFormLoading] = useState(false);

  const loadLookups = async () => {
    setLookupLoading(true);
    try {
      const [docRes, patRes] = await Promise.all([
        apiRequest("/doctors?limit=100"),
        apiRequest("/receptionist/patients?limit=100"),
      ]);
      const docData = await docRes.json();
      const patData = await patRes.json();
      if (docData.success) setDoctors(docData.data || []);
      if (patData.success) setPatients(patData.data || []);
    } catch (err) {
      console.error("Failed to load lookups:", err);
    } finally {
      setLookupLoading(false);
    }
  };

  const openBookModal = () => {
    setFormData(emptyForm);
    setFormError("");
    setShowBookModal(true);
    if (doctors.length === 0 || patients.length === 0) loadLookups();
  };

  const openEditModal = (appt) => {
    setEditingAppt(appt);
    setFormData({
      patientId: appt.patientId?._id || "",
      doctorId: appt.doctorId?._id || "",
      appointmentType: appt.appointmentType || "consultation",
      date: appt.date ? appt.date.slice(0, 10) : "",
      startTime: appt.startTime || "",
      endTime: appt.endTime || "",
      notes: appt.notes || "",
    });
    setFormError("");
    if (doctors.length === 0 || patients.length === 0) loadLookups();
  };

  const closeModals = () => {
    setShowBookModal(false);
    setEditingAppt(null);
    setFormData(emptyForm);
    setFormError("");
  };

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setPage(1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");

    if (!formData.patientId || !formData.doctorId || !formData.date || !formData.startTime || !formData.endTime) {
      setFormError("Please fill in all required fields.");
      return;
    }

    setFormLoading(true);
    const result = editingAppt
      ? await updateAppointment(editingAppt._id, formData)
      : await bookAppointment(formData);

    if (!result.success) {
      setFormError(result.message || "Failed to save appointment");
      setFormLoading(false);
      return;
    }

    setFormLoading(false);
    closeModals();
  };

  const handleConfirmCancel = async () => {
    if (!cancelTarget) return;
    setFormLoading(true);
    const result = await cancelAppointment(cancelTarget._id);
    setFormLoading(false);
    if (result.success) setCancelTarget(null);
  };

  // client-side search across patient name / doctor name / patientId / notes
  const visibleAppointments = useMemo(() => {
    if (!search.trim()) return appointments;
    const q = search.trim().toLowerCase();
    return appointments.filter((a) => {
      const patientName = a.patientId?.userId?.fullName?.toLowerCase() || "";
      const patientCode = a.patientId?.patientId?.toLowerCase() || "";
      const doctorName = a.doctorId?.userId?.fullName?.toLowerCase() || "";
      const notes = a.notes?.toLowerCase() || "";
      return (
        patientName.includes(q) ||
        patientCode.includes(q) ||
        doctorName.includes(q) ||
        notes.includes(q)
      );
    });
  }, [appointments, search]);

  return (
    <div className="px-7 py-4">
      {/* Top Bar */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-[18px] font-bold text-slate-900">Appointments</h2>
        <p className="text-sm text-slate-500">
          Showing {visibleAppointments.length} of {totalCount} appointments
        </p>
      </div>

      {/* Table Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {/* Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-3 px-6 py-4 border-b border-slate-100">
          <div className="flex items-center bg-gray-50 border border-slate-200 h-9 px-3 rounded-lg">
            <LuSearch className="text-gray-400 mr-2" size={16} />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by patient, doctor, notes..."
              className="bg-transparent outline-none text-sm placeholder:text-gray-400 w-56"
            />
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <select
              value={filters.status}
              onChange={(e) => handleFilterChange("status", e.target.value)}
              className="h-9 px-3 bg-white border border-slate-200 rounded-lg text-sm text-slate-600 cursor-pointer">
              <option value="">All Status</option>
              <option value="scheduled">Scheduled</option>
              <option value="waiting">Waiting</option>
              <option value="withDoctor">With Doctor</option>
              <option value="completed">Completed</option>
              <option value="canceled">Canceled</option>
            </select>

            <input
              type="date"
              value={filters.date}
              onChange={(e) => handleFilterChange("date", e.target.value)}
              className="h-9 px-3 bg-white border border-slate-200 rounded-lg text-sm text-slate-600"
            />

            <button
              onClick={() => {
                setFilters({ status: "", date: "" });
                setSearch("");
                setPage(1);
              }}
              className="h-9 px-3 flex items-center gap-1.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-600 hover:bg-slate-50">
              <LuFilter size={14} />
              Filter
            </button>

            <button
              onClick={openBookModal}
              className="h-9 px-4 flex items-center gap-1.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
              <LuPlus size={15} />
              Book
            </button>
          </div>
        </div>

        {/* Table */}
        {loading ? (
          <div className="px-6 py-12 text-center text-slate-400">Loading appointments...</div>
        ) : error ? (
          <div className="px-6 py-12 text-center text-red-500">{error}</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1000px]">
              <thead>
                <tr className="bg-gray-50 border-b border-slate-50">
                  <th className="w-10 px-6 py-3">
                    <input type="checkbox" className="rounded" />
                  </th>
                  {["Patient", "Doctor", "Type", "Notes", "Date & Time", "Status", "Actions"].map((header) => (
                    <th
                      key={header}
                      className="text-left text-[12px] text-slate-800 font-bold px-4 py-3 uppercase whitespace-nowrap">
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {visibleAppointments.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-6 py-12 text-center text-slate-400 text-sm">
                      No appointments found
                    </td>
                  </tr>
                ) : (
                  visibleAppointments.map((a, index) => {
                    const patientName = a.patientId?.userId?.fullName || "Unknown";
                    const patientCode = a.patientId?.patientId || "-";
                    const doctorName = a.doctorId?.userId?.fullName || "-";
                    const doctorSpec = a.doctorId?.specialty || "";
                    const type = TYPE_LABEL[a.appointmentType] || a.appointmentType || "-";
                    const notes = a.notes || "-";
                    const date = a.date
                      ? new Date(a.date).toLocaleDateString("en-GB", {
                          day: "2-digit", month: "short", year: "numeric",
                        })
                      : "-";
                    const time = a.startTime && a.endTime ? `${a.startTime} - ${a.endTime}` : a.startTime || "";
                    const status = a.status || "scheduled";
                    const statusConfig = STATUS_BADGE[status] || {
                      label: status, dot: "bg-slate-400", className: "text-slate-700 bg-slate-100",
                    };
                    const canManage = status === "scheduled" || status === "waiting";

                    return (
                      <tr
                        key={a._id || index}
                        className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors">
                        <td className="px-6 py-3">
                          <input type="checkbox" className="rounded" />
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <div className={`w-9 h-9 rounded-full ${getAvatarColor(patientName)} flex items-center justify-center shrink-0`}>
                              <span className="text-white font-semibold text-xs">
                                {getInitials(patientName)}
                              </span>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-slate-800">{patientName}</p>
                              <p className="text-xs text-slate-400">#{patientCode}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <p className="text-sm text-slate-700">{doctorName}</p>
                          {doctorSpec && <p className="text-xs text-slate-400">{doctorSpec}</p>}
                        </td>
                        <td className="px-4 py-3 text-sm text-slate-700">{type}</td>
                        <td className="px-4 py-3 text-sm text-slate-500 max-w-[180px] truncate" title={notes}>
                          <span className="inline-flex items-center gap-1.5">
                            <LuFileText size={13} className="text-slate-400 shrink-0" />
                            {notes}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm text-slate-700">
                          {date}
                          <div className="text-xs text-slate-400">{time}</div>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${statusConfig.className}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${statusConfig.dot}`} />
                            {statusConfig.label}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          {canManage ? (
                            <div className="flex items-center gap-1.5">
                              <button
                                type="button"
                                onClick={() => openEditModal(a)}
                                title="Edit"
                                className="w-8 h-8 rounded-lg border border-blue-100 bg-white hover:bg-blue-50 flex items-center justify-center">
                                <LuPencil size={14} className="text-blue-600" />
                              </button>
                              <button
                                type="button"
                                onClick={() => setCancelTarget(a)}
                                title="Cancel"
                                className="w-8 h-8 rounded-lg border border-red-100 bg-white hover:bg-red-50 flex items-center justify-center">
                                <LuX size={14} className="text-red-600" />
                              </button>
                            </div>
                          ) : (
                            <span className="text-xs text-slate-300">—</span>
                          )}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 0 && (
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
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                <button
                  key={pageNum}
                  onClick={() => setPage(pageNum)}
                  className={`w-8 h-8 flex items-center justify-center rounded-lg text-sm font-medium transition-colors ${
                    pageNum === page ? "bg-blue-600 text-white" : "border border-slate-200 text-slate-600 hover:bg-slate-50"
                  }`}>
                  {pageNum}
                </button>
              ))}
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

      {/* Book / Edit Modal */}
      {(showBookModal || editingAppt) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 sticky top-0 bg-white">
              <h3 className="text-lg font-bold text-slate-900">
                {editingAppt ? "Edit Appointment" : "Book New Appointment"}
              </h3>
              <button
                onClick={closeModals}
                className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-slate-100 text-slate-500">
                <LuX size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="text-sm font-medium text-slate-700 block mb-1">Patient</label>
                <select
                  required
                  value={formData.patientId}
                  onChange={(e) => setFormData((f) => ({ ...f, patientId: e.target.value }))}
                  className="w-full h-10 px-3 border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer">
                  <option value="">{lookupLoading ? "Loading..." : "Select patient"}</option>
                  {patients.map((p) => (
                    <option key={p._id} value={p._id}>
                      {p.userId?.fullName} (#{p.patientId})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-sm font-medium text-slate-700 block mb-1">Doctor</label>
                <select
                  required
                  value={formData.doctorId}
                  onChange={(e) => setFormData((f) => ({ ...f, doctorId: e.target.value }))}
                  className="w-full h-10 px-3 border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer">
                  <option value="">{lookupLoading ? "Loading..." : "Select doctor"}</option>
                  {doctors.map((d) => (
                    <option key={d._id} value={d._id}>
                      {d.userId?.fullName} — {d.specialty}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-sm font-medium text-slate-700 block mb-1">Appointment Type</label>
                <select
                  value={formData.appointmentType}
                  onChange={(e) => setFormData((f) => ({ ...f, appointmentType: e.target.value }))}
                  className="w-full h-10 px-3 border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer">
                  <option value="consultation">Consultation</option>
                  <option value="followUp">Follow-up</option>
                  <option value="surgery">Surgery</option>
                </select>
              </div>

              <div>
                <label className="text-sm font-medium text-slate-700 block mb-1">Date</label>
                <input
                  type="date"
                  required
                  value={formData.date}
                  onChange={(e) => setFormData((f) => ({ ...f, date: e.target.value }))}
                  className="w-full h-10 px-3 border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-slate-700 block mb-1">Start Time</label>
                  <input
                    type="time"
                    required
                    value={formData.startTime}
                    onChange={(e) => setFormData((f) => ({ ...f, startTime: e.target.value }))}
                    className="w-full h-10 px-3 border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700 block mb-1">End Time</label>
                  <input
                    type="time"
                    required
                    value={formData.endTime}
                    onChange={(e) => setFormData((f) => ({ ...f, endTime: e.target.value }))}
                    className="w-full h-10 px-3 border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-slate-700 block mb-1">Notes</label>
                <textarea
                  rows={3}
                  value={formData.notes}
                  onChange={(e) => setFormData((f) => ({ ...f, notes: e.target.value }))}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Reason for visit, special instructions..."
                />
              </div>

              {formError && <p className="text-red-500 text-sm">{formError}</p>}

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={closeModals}
                  className="flex-1 h-10 border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50">
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={formLoading}
                  className="flex-1 h-10 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors">
                  {formLoading ? "Saving..." : editingAppt ? "Save Changes" : "Book Appointment"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Cancel Confirmation Modal */}
      {cancelTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm mx-4 p-6">
            <h3 className="text-lg font-bold text-slate-900 mb-2">Cancel Appointment?</h3>
            <p className="text-sm text-slate-500 mb-6">
              This will cancel the appointment for{" "}
              <span className="font-medium text-slate-700">
                {cancelTarget.patientId?.userId?.fullName}
              </span>{" "}
              on {cancelTarget.date ? new Date(cancelTarget.date).toLocaleDateString() : ""}. This action cannot be undone.
            </p>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setCancelTarget(null)}
                className="flex-1 h-10 border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50">
                Keep It
              </button>
              <button
                onClick={handleConfirmCancel}
                disabled={formLoading}
                className="flex-1 h-10 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 disabled:opacity-50">
                {formLoading ? "Canceling..." : "Yes, Cancel"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Reception_Appointments;