import { useState } from "react";
import { useAdminPatientManagement } from "../../hooks/useAdminPatientManagement";
import {
  LuSearch, LuChevronLeft, LuChevronRight,
  LuEye, LuPencil, LuX,
} from "react-icons/lu";

const getInitials = (name = "") =>
  name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);

const avatarColors = [
  "bg-blue-500", "bg-amber-500", "bg-emerald-500", "bg-purple-500",
  "bg-rose-500", "bg-teal-500", "bg-indigo-500", "bg-orange-500",
];
const getAvatarColor = (name = "") => {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return avatarColors[Math.abs(hash) % avatarColors.length];
};

const InfoRow = ({ label, value }) => (
  <div className="flex items-start justify-between py-2 border-b border-slate-50 last:border-0">
    <span className="text-xs text-slate-400 w-36 shrink-0">{label}</span>
    <span className="text-sm text-slate-700 font-medium text-right">{value || "—"}</span>
  </div>
);

const STATUS_BADGE = {
  inTreatment: { label: "In Treatment", className: "bg-green-100 text-green-700" },
  admitted: { label: "Admitted", className: "bg-blue-100 text-blue-700" },
  discharged: { label: "Discharged", className: "bg-slate-100 text-slate-700" },
};

const Admin_PatientManagement = () => {
  const {
    patients, loading, error,
    search, setSearch,
    page, setPage, totalPages, totalCount,
    getPatientById, updatePatient,
  } = useAdminPatientManagement();

  const [viewPatient, setViewPatient] = useState(null);
  const [viewLoading, setViewLoading] = useState(false);

  const [editTarget, setEditTarget] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [editError, setEditError] = useState("");
  const [editLoading, setEditLoading] = useState(false);

  const handleView = async (id) => {
    setViewLoading(true);
    const result = await getPatientById(id);
    setViewLoading(false);
    if (result.success) setViewPatient(result.data);
  };

  const openEdit = async (id) => {
    const result = await getPatientById(id);
    if (!result.success) return;
    const p = result.data;
    setEditTarget(p);
    setEditForm({
      age: p.age || "",
      bloodType: p.bloodType || "",
      occupation: p.occupation || "",
      patientType: p.patientType || "outpatient",
      currentStatus: p.currentStatus || "inTreatment",
      insuranceProvider: p.insuranceProvider || "",
      insuranceClass: p.insuranceClass || "",
    });
    setEditError("");
  };

  const handleUpdate = async () => {
    if (!editTarget) return;
    setEditLoading(true);
    const result = await updatePatient(editTarget._id, editForm);
    setEditLoading(false);
    if (!result.success) { setEditError(result.message || "Failed to update."); return; }
    setEditTarget(null);
    };
    

    if (viewLoading) {
        return (
            <div>Loading...</div>
        )
    }

  return (
    <div className="px-7 py-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-[18px] font-bold text-slate-900">Patient Management</h2>
        <p className="text-sm text-slate-500">{totalCount} patients</p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {/* Search */}
        <div className="flex items-center gap-3 px-6 py-4 border-b border-slate-100">
          <div className="flex items-center bg-gray-50 border border-slate-200 h-9 px-3 rounded-lg flex-1 max-w-sm">
            <LuSearch className="text-gray-400 mr-2" size={16} />
            <input type="text" value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              placeholder="Search by name..."
              className="bg-transparent outline-none text-sm placeholder:text-gray-400 w-full"
            />
          </div>
        </div>

        {/* Table */}
        {loading ? (
          <div className="px-6 py-12 text-center text-slate-400">Loading patients...</div>
        ) : error ? (
          <div className="px-6 py-12 text-center text-red-500">{error}</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px]">
              <thead>
                <tr className="bg-gray-50 border-b border-slate-50">
                  {["Patient", "Blood Type", "Age", "Type", "Status", "Actions"].map((h) => (
                    <th key={h} className="text-left text-[12px] text-slate-800 font-bold px-4 py-3 uppercase whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {patients.length === 0 ? (
                  <tr><td colSpan={6} className="px-6 py-12 text-center text-slate-400 text-sm">No patients found</td></tr>
                ) : (
                  patients.map((patient, index) => {
                    const name = patient.userId?.fullName || "Unknown";
                    const status = patient.currentStatus || "inTreatment";
                    const statusConfig = STATUS_BADGE[status] || { label: status, className: "bg-slate-100 text-slate-700" };

                    return (
                      <tr key={patient._id || index} className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <div className={`w-9 h-9 rounded-full ${getAvatarColor(name)} flex items-center justify-center shrink-0`}>
                              <span className="text-white font-semibold text-xs">{getInitials(name)}</span>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-slate-800">{name}</p>
                              <p className="text-xs text-slate-400">#{patient.patientId}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm font-medium text-slate-700">{patient.bloodType || "—"}</td>
                        <td className="px-4 py-3 text-sm text-slate-600">{patient.age || "—"}</td>
                        <td className="px-4 py-3">
                          <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            patient.patientType === "inpatient" ? "bg-purple-100 text-purple-700" : "bg-blue-100 text-blue-700"
                          }`}>
                            {patient.patientType || "outpatient"}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${statusConfig.className}`}>
                            <span className="w-1.5 h-1.5 rounded-full bg-current" />
                            {statusConfig.label}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1.5">
                            <button onClick={() => handleView(patient._id)}
                              className="w-8 h-8 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 flex items-center justify-center">
                              <LuEye size={14} className="text-slate-600" />
                            </button>
                            <button onClick={() => openEdit(patient._id)}
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
            <p className="text-sm text-slate-500">Page {page} of {totalPages}</p>
            <div className="flex items-center gap-1">
              <button disabled={page <= 1} onClick={() => setPage((p) => p - 1)}
                className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 text-slate-500 disabled:opacity-40 hover:bg-slate-50">
                <LuChevronLeft size={16} />
              </button>
              <button disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)}
                className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 text-slate-500 disabled:opacity-40 hover:bg-slate-50">
                <LuChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* VIEW MODAL */}
      {viewPatient && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 sticky top-0 bg-white">
              <h3 className="text-lg font-bold text-slate-900">Patient Profile</h3>
              <button onClick={() => setViewPatient(null)}
                className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-slate-100 text-slate-500">
                <LuX size={18} />
              </button>
            </div>
            <div className="p-6">
              <div className="flex items-center gap-4 mb-6">
                <div className={`w-14 h-14 rounded-full ${getAvatarColor(viewPatient.userId?.fullName)} flex items-center justify-center`}>
                  <span className="text-white font-bold text-lg">{getInitials(viewPatient.userId?.fullName)}</span>
                </div>
                <div>
                  <p className="text-lg font-bold text-slate-900">{viewPatient.userId?.fullName}</p>
                  <p className="text-sm text-slate-500">#{viewPatient.patientId} &bull; {viewPatient.patientType}</p>
                </div>
              </div>
              <div className="space-y-0.5">
                <InfoRow label="Email" value={viewPatient.userId?.email} />
                <InfoRow label="Phone" value={viewPatient.userId?.phone} />
                <InfoRow label="Gender" value={viewPatient.userId?.gender} />
                <InfoRow label="Age" value={viewPatient.age} />
                <InfoRow label="Blood Type" value={viewPatient.bloodType} />
                <InfoRow label="Occupation" value={viewPatient.occupation} />
                <InfoRow label="Insurance" value={viewPatient.insuranceProvider} />
                <InfoRow label="Insurance Class" value={viewPatient.insuranceClass} />
                <InfoRow label="Status" value={viewPatient.currentStatus} />
                <InfoRow label="Conditions" value={viewPatient.medicalInfo?.conditions?.map((c) => c.name).join(", ")} />
                <InfoRow label="Allergies" value={viewPatient.medicalInfo?.allergies?.join(", ")} />
                <InfoRow label="Medications" value={`${viewPatient.medications?.length || 0} active`} />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* EDIT MODAL */}
      {editTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 sticky top-0 bg-white">
              <h3 className="text-lg font-bold text-slate-900">Edit Patient</h3>
              <button onClick={() => setEditTarget(null)}
                className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-slate-100 text-slate-500">
                <LuX size={18} />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-slate-700 block mb-1">Age</label>
                  <input type="number" value={editForm.age || ""}
                    onChange={(e) => setEditForm((f) => ({ ...f, age: e.target.value }))}
                    className="w-full h-10 px-3 border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700 block mb-1">Blood Type</label>
                  <select value={editForm.bloodType || ""}
                    onChange={(e) => setEditForm((f) => ({ ...f, bloodType: e.target.value }))}
                    className="w-full h-10 px-3 border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer">
                    <option value="">Select</option>
                    {["A+","A-","B+","B-","AB+","AB-","O+","O-"].map((bt) => (
                      <option key={bt} value={bt}>{bt}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-slate-700 block mb-1">Occupation</label>
                <input type="text" value={editForm.occupation || ""}
                  onChange={(e) => setEditForm((f) => ({ ...f, occupation: e.target.value }))}
                  className="w-full h-10 px-3 border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-slate-700 block mb-1">Patient Type</label>
                  <select value={editForm.patientType || "outpatient"}
                    onChange={(e) => setEditForm((f) => ({ ...f, patientType: e.target.value }))}
                    className="w-full h-10 px-3 border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer">
                    <option value="outpatient">Outpatient</option>
                    <option value="inpatient">Inpatient</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700 block mb-1">Status</label>
                  <select value={editForm.currentStatus || "inTreatment"}
                    onChange={(e) => setEditForm((f) => ({ ...f, currentStatus: e.target.value }))}
                    className="w-full h-10 px-3 border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer">
                    <option value="inTreatment">In Treatment</option>
                    <option value="admitted">Admitted</option>
                    <option value="discharged">Discharged</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-slate-700 block mb-1">Insurance Provider</label>
                  <input type="text" value={editForm.insuranceProvider || ""}
                    onChange={(e) => setEditForm((f) => ({ ...f, insuranceProvider: e.target.value }))}
                    className="w-full h-10 px-3 border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700 block mb-1">Insurance Class</label>
                  <input type="text" value={editForm.insuranceClass || ""}
                    onChange={(e) => setEditForm((f) => ({ ...f, insuranceClass: e.target.value }))}
                    className="w-full h-10 px-3 border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {editError && <p className="text-red-500 text-sm">{editError}</p>}

              <div className="flex items-center gap-3 pt-2">
                <button onClick={() => setEditTarget(null)}
                  className="flex-1 h-10 border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50">
                  Cancel
                </button>
                <button onClick={handleUpdate} disabled={editLoading}
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

export default Admin_PatientManagement;