import { useState } from "react";
import { useAdminUsers } from "../../hooks/useAdminUsers";
import {
  LuSearch,
  LuFilter,
  LuPencil,
  LuBan,
  LuX,
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

const ROLE_BADGE = {
  admin: "bg-red-100 text-red-700",
  doctor: "bg-blue-100 text-blue-700",
  receptionist: "bg-purple-100 text-purple-700",
  patient: "bg-green-100 text-green-700",
};

const STATUS_BADGE = {
  active: { label: "Active", className: "bg-green-100 text-green-700" },
  pending: { label: "Pending", className: "bg-amber-100 text-amber-700" },
  suspended: { label: "Suspended", className: "bg-red-100 text-red-700" },
};

const emptyEditForm = {
  fullName: "",
  email: "",
  phone: "",
  gender: "",
  address: "",
  status: "",
};

const Admin_UserManagement = () => {
  const {
    users,
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
    updateUser,
    suspendUser,
  } = useAdminUsers();

  const [editTarget, setEditTarget] = useState(null);
  const [editForm, setEditForm] = useState(emptyEditForm);
  const [editError, setEditError] = useState("");
  const [editLoading, setEditLoading] = useState(false);

  const [suspendTarget, setSuspendTarget] = useState(null);
  const [suspendLoading, setSuspendLoading] = useState(false);

  const openEdit = (user) => {
    setEditTarget(user);
    setEditForm({
      fullName: user.fullName || "",
      email: user.email || "",
      phone: user.phone || "",
      gender: user.gender || "",
      address: user.address || "",
      status: user.status || "",
    });
    setEditError("");
  };

  const handleUpdate = async () => {
    if (!editTarget) return;
    setEditLoading(true);
    const result = await updateUser(editTarget._id, editForm);
    setEditLoading(false);
    if (!result.success) {
      setEditError(result.message || "Failed to update.");
      return;
    }
    setEditTarget(null);
  };

  const handleSuspend = async () => {
    if (!suspendTarget) return;
    setSuspendLoading(true);
    await suspendUser(suspendTarget._id);
    setSuspendLoading(false);
    setSuspendTarget(null);
  };

  return (
    <div className="px-7 py-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-[18px] font-bold text-slate-900">
          User Management
        </h2>
        <p className="text-sm text-slate-500">{totalCount} users found</p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {/* Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-3 px-6 py-4 border-b border-slate-100">
          <div className="flex items-center bg-gray-50 border border-slate-200 h-9 px-3 rounded-lg">
            <LuSearch className="text-gray-400 mr-2" size={16} />
            <input
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder="Search by name..."
              className="bg-transparent outline-none text-sm placeholder:text-gray-400 w-48"
            />
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <select
              value={filters.role}
              onChange={(e) => {
                setFilters((f) => ({ ...f, role: e.target.value }));
                setPage(1);
              }}
              className="h-9 px-3 bg-white border border-slate-200 rounded-lg text-sm text-slate-600 cursor-pointer">
              <option value="">All Roles</option>
              <option value="admin">Admin</option>
              <option value="doctor">Doctor</option>
              <option value="receptionist">Receptionist</option>
              <option value="patient">Patient</option>
            </select>

            <select
              value={filters.status}
              onChange={(e) => {
                setFilters((f) => ({ ...f, status: e.target.value }));
                setPage(1);
              }}
              className="h-9 px-3 bg-white border border-slate-200 rounded-lg text-sm text-slate-600 cursor-pointer">
              <option value="">All Status</option>
              <option value="active">Active</option>
              <option value="pending">Pending</option>
              <option value="suspended">Suspended</option>
            </select>

            <button
              onClick={() => {
                setFilters({ role: "", status: "" });
                setSearch("");
                setPage(1);
              }}
              className="h-9 px-3 flex items-center gap-1.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-600 hover:bg-slate-50">
              <LuFilter size={14} />
              Clear
            </button>
          </div>
        </div>

        {/* Table */}
        {loading ? (
          <div className="px-6 py-12 text-center text-slate-400">
            Loading users...
          </div>
        ) : error ? (
          <div className="px-6 py-12 text-center text-red-500">{error}</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px]">
              <thead>
                <tr className="bg-gray-50 border-b border-slate-50">
                  {[
                    "User",
                    "Email",
                    "Phone",
                    "Role",
                    "Status",
                    "Joined",
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
                {users.length === 0 ? (
                  <tr>
                    <td
                      colSpan={7}
                      className="px-6 py-12 text-center text-slate-400 text-sm">
                      No users found
                    </td>
                  </tr>
                ) : (
                  users.map((user, index) => {
                    const name = user.fullName || "Unknown";
                    const statusConfig = STATUS_BADGE[user.status] || {
                      label: user.status,
                      className: "bg-slate-100 text-slate-700",
                    };

                    return (
                      <tr
                        key={user._id || index}
                        className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <div
                              className={`w-9 h-9 rounded-full ${getAvatarColor(name)} flex items-center justify-center shrink-0`}>
                              <span className="text-white font-semibold text-xs">
                                {getInitials(name)}
                              </span>
                            </div>
                            <p className="text-sm font-medium text-slate-800">
                              {name}
                            </p>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm text-slate-600">
                          {user.email}
                        </td>
                        <td className="px-4 py-3 text-sm text-slate-600">
                          {user.phone || "—"}
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${ROLE_BADGE[user.role] || "bg-slate-100 text-slate-700"}`}>
                            {user.role}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${statusConfig.className}`}>
                            <span className="w-1.5 h-1.5 rounded-full bg-current" />
                            {statusConfig.label}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-xs text-slate-400">
                          {user.createdAt
                            ? new Date(user.createdAt).toLocaleDateString(
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
                              onClick={() => openEdit(user)}
                              className="w-8 h-8 rounded-lg border border-blue-100 bg-white hover:bg-blue-50 flex items-center justify-center">
                              <LuPencil size={14} className="text-blue-600" />
                            </button>
                            {user.status !== "suspended" && (
                              <button
                                onClick={() => setSuspendTarget(user)}
                                className="w-8 h-8 rounded-lg border border-red-100 bg-white hover:bg-red-50 flex items-center justify-center">
                                <LuBan size={14} className="text-red-600" />
                              </button>
                            )}
                          </div>
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
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100">
            <p className="text-sm text-slate-500">
              Page {page} of {totalPages}
            </p>
            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (pageNum) => (
                  <button
                    key={pageNum}
                    onClick={() => setPage(pageNum)}
                    className={`w-8 h-8 flex items-center justify-center rounded-lg text-sm font-medium transition-colors ${
                      pageNum === page
                        ? "bg-blue-600 text-white"
                        : "border border-slate-200 text-slate-600 hover:bg-slate-50"
                    }`}>
                    {pageNum}
                  </button>
                ),
              )}
            </div>
          </div>
        )}
      </div>

      {/* EDIT MODAL */}
      {editTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 sticky top-0 bg-white">
              <h3 className="text-lg font-bold text-slate-900">Edit User</h3>
              <button
                onClick={() => setEditTarget(null)}
                className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-slate-100 text-slate-500">
                <LuX size={18} />
              </button>
            </div>
            <div className="p-6 space-y-4">
              {[
                { label: "Full Name", key: "fullName", type: "text" },
                { label: "Email", key: "email", type: "email" },
                { label: "Phone", key: "phone", type: "tel" },
                { label: "Address", key: "address", type: "text" },
              ].map(({ label, key, type }) => (
                <div key={key}>
                  <label className="text-sm font-medium text-slate-700 block mb-1">
                    {label}
                  </label>
                  <input
                    type={type}
                    value={editForm[key]}
                    onChange={(e) =>
                      setEditForm((f) => ({ ...f, [key]: e.target.value }))
                    }
                    className="w-full h-10 px-3 border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              ))}

              <div>
                <label className="text-sm font-medium text-slate-700 block mb-1">
                  Gender
                </label>
                <select
                  value={editForm.gender}
                  onChange={(e) =>
                    setEditForm((f) => ({ ...f, gender: e.target.value }))
                  }
                  className="w-full h-10 px-3 border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer">
                  <option value="">Select gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </div>

              <div>
                <label className="text-sm font-medium text-slate-700 block mb-1">
                  Status
                </label>
                <select
                  value={editForm.status}
                  onChange={(e) =>
                    setEditForm((f) => ({ ...f, status: e.target.value }))
                  }
                  className="w-full h-10 px-3 border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer">
                  <option value="active">Active</option>
                  <option value="pending">Pending</option>
                  <option value="suspended">Suspended</option>
                </select>
              </div>

              {editError && <p className="text-red-500 text-sm">{editError}</p>}

              <div className="flex items-center gap-3 pt-2">
                <button
                  onClick={() => setEditTarget(null)}
                  className="flex-1 h-10 border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50">
                  Cancel
                </button>
                <button
                  onClick={handleUpdate}
                  disabled={editLoading}
                  className="flex-1 h-10 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50">
                  {editLoading ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUSPEND CONFIRM MODAL */}
      {suspendTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm mx-4 p-6">
            <h3 className="text-lg font-bold text-slate-900 mb-2">
              Suspend Account?
            </h3>
            <p className="text-sm text-slate-500 mb-6">
              This will suspend{" "}
              <span className="font-medium text-slate-700">
                {suspendTarget.fullName}
              </span>
              's account. They won't be able to log in.
            </p>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSuspendTarget(null)}
                className="flex-1 h-10 border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50">
                Cancel
              </button>
              <button
                onClick={handleSuspend}
                disabled={suspendLoading}
                className="flex-1 h-10 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 disabled:opacity-50">
                {suspendLoading ? "Suspending..." : "Yes, Suspend"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin_UserManagement;
