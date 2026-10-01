import { useState } from "react";
import { useAdminAccounts } from "../../hooks/useAdminAccounts";
import {
  LuCheck,
  LuX,
  LuChevronLeft,
  LuChevronRight,
  LuClock,
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

const Admin_PendingAccounts = () => {
  const {
    pendingAccounts,
    loading,
    error,
    page,
    setPage,
    totalPages,
    totalCount,
    approveAccount,
    rejectAccount,
  } = useAdminAccounts();

  const [actionLoadingId, setActionLoadingId] = useState(null);
  const [confirmReject, setConfirmReject] = useState(null);

  const handleApprove = async (id) => {
    setActionLoadingId(id);
    await approveAccount(id);
    setActionLoadingId(null);
  };

  const handleReject = async () => {
    if (!confirmReject) return;
    setActionLoadingId(confirmReject._id);
    await rejectAccount(confirmReject._id);
    setActionLoadingId(null);
    setConfirmReject(null);
  };

  return (
    <div className="px-7 py-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <h2 className="text-[18px] font-bold text-slate-900">
            Pending Accounts
          </h2>
          <span className="inline-flex items-center gap-1 text-xs font-medium text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">
            <LuClock size={11} />
            Awaiting Approval
          </span>
        </div>
        <p className="text-sm text-slate-500">{totalCount} pending</p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="px-6 py-12 text-center text-slate-400">
            Loading...
          </div>
        ) : error ? (
          <div className="px-6 py-12 text-center text-red-500">{error}</div>
        ) : pendingAccounts.length === 0 ? (
          <div className="px-6 py-16 text-center">
            <LuClock size={36} className="text-slate-300 mx-auto mb-3" />
            <p className="text-slate-400 text-sm">No pending accounts</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px]">
              <thead>
                <tr className="bg-gray-50 border-b border-slate-50">
                  {[
                    "User",
                    "Email",
                    "Phone",
                    "Gender",
                    "Registered At",
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
                {pendingAccounts.map((account, index) => {
                  const name = account.fullName || "Unknown";
                  const isLoading = actionLoadingId === account._id;

                  return (
                    <tr
                      key={account._id || index}
                      className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div
                            className={`w-9 h-9 rounded-full ${getAvatarColor(name)} flex items-center justify-center shrink-0`}>
                            <span className="text-white font-semibold text-xs">
                              {getInitials(name)}
                            </span>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-slate-800">
                              {name}
                            </p>
                            <span className="text-xs text-purple-600 bg-purple-50 px-2 py-0.5 rounded-full">
                              {account.role}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-600">
                        {account.email}
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-600">
                        {account.phone || "—"}
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-600 capitalize">
                        {account.gender || "—"}
                      </td>
                      <td className="px-4 py-3 text-xs text-slate-400">
                        {account.createdAt
                          ? new Date(account.createdAt).toLocaleDateString(
                              "en-GB",
                              {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                              },
                            )
                          : "—"}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => handleApprove(account._id)}
                            disabled={isLoading}
                            className="inline-flex items-center gap-1 px-3 py-1.5 bg-green-600 text-white text-xs font-medium rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors">
                            <LuCheck size={13} />
                            {isLoading ? "..." : "Approve"}
                          </button>
                          <button
                            onClick={() => setConfirmReject(account)}
                            disabled={isLoading}
                            className="inline-flex items-center gap-1 px-3 py-1.5 bg-red-50 text-red-600 border border-red-100 text-xs font-medium rounded-lg hover:bg-red-100 disabled:opacity-50 transition-colors">
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
                onClick={() => setPage((p) => p - 1)}
                className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 text-slate-500 disabled:opacity-40 hover:bg-slate-50">
                <LuChevronLeft size={16} />
              </button>
              <button
                disabled={page >= totalPages}
                onClick={() => setPage((p) => p + 1)}
                className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 text-slate-500 disabled:opacity-40 hover:bg-slate-50">
                <LuChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Reject Confirm Modal */}
      {confirmReject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm mx-4 p-6">
            <h3 className="text-lg font-bold text-slate-900 mb-2">
              Reject Account?
            </h3>
            <p className="text-sm text-slate-500 mb-6">
              This will permanently delete the account of{" "}
              <span className="font-medium text-slate-700">
                {confirmReject.fullName}
              </span>{" "}
              ({confirmReject.email}). This action cannot be undone.
            </p>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setConfirmReject(null)}
                className="flex-1 h-10 border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50">
                Cancel
              </button>
              <button
                onClick={handleReject}
                disabled={actionLoadingId === confirmReject._id}
                className="flex-1 h-10 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 disabled:opacity-50">
                {actionLoadingId === confirmReject._id
                  ? "Rejecting..."
                  : "Yes, Reject"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin_PendingAccounts;
