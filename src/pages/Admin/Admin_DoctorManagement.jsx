import { useState } from "react";
import { useAdminDoctorManagement } from "../../hooks/useAdminDoctorManagement";
import {
  LuSearch,
  LuChevronLeft,
  LuChevronRight,
  LuEye,
  LuPencil,
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

const InfoRow = ({ label, value }) => (
  <div className="flex items-start justify-between py-2 border-b border-slate-50 last:border-0">
    <span className="text-xs text-slate-400 w-36 shrink-0">{label}</span>
    <span className="text-sm text-slate-700 font-medium text-right">
      {value || "—"}
    </span>
  </div>
);

const Admin_DoctorManagement = () => {
  const {
    doctors,
    loading,
    error,
    search,
    setSearch,
    page,
    setPage,
    totalPages,
    totalCount,
    getDoctorById,
    updateDoctor,
  } = useAdminDoctorManagement();

  const [viewDoctor, setViewDoctor] = useState(null);
  const [viewLoading, setViewLoading] = useState(false);

  const [editTarget, setEditTarget] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [editError, setEditError] = useState("");
  const [editLoading, setEditLoading] = useState(false);

  const handleView = async (id) => {
    setViewLoading(true);
    const result = await getDoctorById(id);
    setViewLoading(false);
    if (result.success) setViewDoctor(result.data);
  };

  const openEdit = async (id) => {
    const result = await getDoctorById(id);
    if (!result.success) return;
    const d = result.data;
    setEditTarget(d);
    setEditForm({
      specialty: d.specialty || "",
      experience: d.experience || "",
      about: d.about || "",
      roomNumber: d.roomNumber || "",
      workType: d.workType || "fullTime",
      salary: d.salary || "",
      status: d.status || "available",
    });
    setEditError("");
  };

  const handleUpdate = async () => {
    if (!editTarget) return;
    setEditLoading(true);
    const result = await updateDoctor(editTarget._id, editForm);
    setEditLoading(false);
    if (!result.success) {
      setEditError(result.message || "Failed to update.");
      return;
    }
    setEditTarget(null);
  };

  if (viewLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="px-7 py-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-[18px] font-bold text-slate-900">
          Doctor Management
        </h2>
        <p className="text-sm text-slate-500">{totalCount} doctors</p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {/* Search */}
        <div className="flex items-center gap-3 px-6 py-4 border-b border-slate-100">
          <div className="flex items-center bg-gray-50 border border-slate-200 h-9 px-3 rounded-lg flex-1 max-w-sm">
            <LuSearch className="text-gray-400 mr-2" size={16} />
            <input
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder="Search by name..."
              className="bg-transparent outline-none text-sm placeholder:text-gray-400 w-full"
            />
          </div>
        </div>

        {/* Table */}
        {loading ? (
          <div className="px-6 py-12 text-center text-slate-400">
            Loading doctors...
          </div>
        ) : error ? (
          <div className="px-6 py-12 text-center text-red-500">{error}</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px]">
              <thead>
                <tr className="bg-gray-50 border-b border-slate-50">
                  {[
                    "Doctor",
                    "Specialty",
                    "Department",
                    "Experience",
                    "Status",
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
                {doctors.length === 0 ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-6 py-12 text-center text-slate-400 text-sm">
                      No doctors found
                    </td>
                  </tr>
                ) : (
                  doctors.map((doc, index) => {
                    const name = doc.userId?.fullName || "Unknown";
                    const dept = doc.department?.name || "—";
                    const status = doc.status || "available";
                    const statusColor =
                      status === "available"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700";

                    return (
                      <tr
                        key={doc._id || index}
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
                              <p className="text-xs text-slate-400">
                                {doc.doctorId}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm text-slate-600">
                          {doc.specialty || "—"}
                        </td>
                        <td className="px-4 py-3 text-sm text-slate-600">
                          {dept}
                        </td>
                        <td className="px-4 py-3 text-sm text-slate-600">
                          {doc.experience ? `${doc.experience} yrs` : "—"}
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${statusColor}`}>
                            <span className="w-1.5 h-1.5 rounded-full bg-current" />
                            {status}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={() => handleView(doc._id)}
                              className="w-8 h-8 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 flex items-center justify-center">
                              <LuEye size={14} className="text-slate-600" />
                            </button>
                            <button
                              onClick={() => openEdit(doc._id)}
                              className="w-8 h-8 rounded-lg border border-blue-100 bg-white hover:bg-blue-50 flex items-center justify-center">
                              <LuPencil size={14} className="text-blue-600" />
                            </button>
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

      {/* VIEW MODAL */}
      {viewDoctor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 sticky top-0 bg-white">
              <h3 className="text-lg font-bold text-slate-900">
                Doctor Profile
              </h3>
              <button
                onClick={() => setViewDoctor(null)}
                className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-slate-100 text-slate-500">
                <LuX size={18} />
              </button>
            </div>
            <div className="p-6">
              <div className="flex items-center gap-4 mb-6">
                <div
                  className={`w-14 h-14 rounded-full ${getAvatarColor(viewDoctor.userId?.fullName)} flex items-center justify-center`}>
                  <span className="text-white font-bold text-lg">
                    {getInitials(viewDoctor.userId?.fullName)}
                  </span>
                </div>
                <div>
                  <p className="text-lg font-bold text-slate-900">
                    {viewDoctor.userId?.fullName}
                  </p>
                  <p className="text-sm text-slate-500">
                    {viewDoctor.doctorId} &bull; {viewDoctor.specialty}
                  </p>
                </div>
              </div>
              <div className="space-y-0.5">
                <InfoRow label="Email" value={viewDoctor.userId?.email} />
                <InfoRow label="Phone" value={viewDoctor.userId?.phone} />
                <InfoRow
                  label="Department"
                  value={viewDoctor.department?.name}
                />
                <InfoRow label="Room" value={viewDoctor.roomNumber} />
                <InfoRow
                  label="Experience"
                  value={
                    viewDoctor.experience
                      ? `${viewDoctor.experience} years`
                      : null
                  }
                />
                <InfoRow label="Work Type" value={viewDoctor.workType} />
                <InfoRow
                  label="Salary"
                  value={
                    viewDoctor.salary
                      ? `EGP ${viewDoctor.salary?.toLocaleString()}`
                      : null
                  }
                />
                <InfoRow
                  label="License No."
                  value={viewDoctor.medicalLicenseNumber}
                />
                <InfoRow
                  label="License Expiry"
                  value={
                    viewDoctor.licenseExpiryDate
                      ? new Date(
                          viewDoctor.licenseExpiryDate,
                        ).toLocaleDateString("en-GB")
                      : null
                  }
                />
                <InfoRow label="Status" value={viewDoctor.status} />
                <InfoRow
                  label="Total Appointments"
                  value={viewDoctor.totalAppointments}
                />
                <InfoRow
                  label="Performance Score"
                  value={
                    viewDoctor.performanceScore
                      ? `${viewDoctor.performanceScore}%`
                      : null
                  }
                />
              </div>
              {viewDoctor.about && (
                <div className="mt-4 p-3 bg-slate-50 rounded-xl">
                  <p className="text-xs text-slate-400 mb-1">About</p>
                  <p className="text-sm text-slate-700">{viewDoctor.about}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* EDIT MODAL */}
      {editTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 sticky top-0 bg-white">
              <h3 className="text-lg font-bold text-slate-900">Edit Doctor</h3>
              <button
                onClick={() => setEditTarget(null)}
                className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-slate-100 text-slate-500">
                <LuX size={18} />
              </button>
            </div>
            <div className="p-6 space-y-4">
              {[
                { label: "Specialty", key: "specialty" },
                {
                  label: "Experience (years)",
                  key: "experience",
                  type: "number",
                },
                { label: "Room Number", key: "roomNumber" },
                { label: "Salary", key: "salary", type: "number" },
              ].map(({ label, key, type = "text" }) => (
                <div key={key}>
                  <label className="text-sm font-medium text-slate-700 block mb-1">
                    {label}
                  </label>
                  <input
                    type={type}
                    value={editForm[key] || ""}
                    onChange={(e) =>
                      setEditForm((f) => ({ ...f, [key]: e.target.value }))
                    }
                    className="w-full h-10 px-3 border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              ))}

              <div>
                <label className="text-sm font-medium text-slate-700 block mb-1">
                  Work Type
                </label>
                <select
                  value={editForm.workType || "fullTime"}
                  onChange={(e) =>
                    setEditForm((f) => ({ ...f, workType: e.target.value }))
                  }
                  className="w-full h-10 px-3 border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer">
                  <option value="fullTime">Full Time</option>
                  <option value="partTime">Part Time</option>
                  <option value="consultant">Consultant</option>
                </select>
              </div>

              <div>
                <label className="text-sm font-medium text-slate-700 block mb-1">
                  Status
                </label>
                <select
                  value={editForm.status || "available"}
                  onChange={(e) =>
                    setEditForm((f) => ({ ...f, status: e.target.value }))
                  }
                  className="w-full h-10 px-3 border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer">
                  <option value="available">Available</option>
                  <option value="unavailable">Unavailable</option>
                </select>
              </div>

              <div>
                <label className="text-sm font-medium text-slate-700 block mb-1">
                  About
                </label>
                <textarea
                  rows={3}
                  value={editForm.about || ""}
                  onChange={(e) =>
                    setEditForm((f) => ({ ...f, about: e.target.value }))
                  }
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500"
                />
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
    </div>
  );
};

export default Admin_DoctorManagement;
