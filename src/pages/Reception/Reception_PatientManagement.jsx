import { useState } from "react";
import { useReceptionistPatients } from "../../hooks/useReceptionistPatients";
import { Link } from "react-router-dom";
import {
  LuSearch,
  LuPlus,
  LuFilter,
  LuChevronLeft,
  LuChevronRight,
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

const TYPE_BADGE = {
  outpatient: { label: "Outpatient", className: "bg-blue-100 text-blue-700" },
  inpatient: { label: "Inpatient", className: "bg-purple-100 text-purple-700" },
};

const STATUS_BADGE = {
  inTreatment: {
    label: "In Treatment",
    className: "bg-green-100 text-green-700",
  },
  admitted: { label: "Admitted", className: "bg-blue-100 text-blue-700" },
  discharged: { label: "Discharged", className: "bg-slate-100 text-slate-700" },
};

const Reception_PatientManagement = () => {
  const {
    patients,
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
    addPatient,
  } = useReceptionistPatients();

  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    gender: "male",
    age: "",
    dateOfBirth: "",
    phone: "",
    address: "",
    occupation: "",
    bloodType: "",
    insuranceProvider: "",
    insuranceClass: "",
    patientType: "outpatient",
    emergencyContact: { name: "", phone: "", relation: "" }, // ✅ لازم يكون موجود
  });
  const [formError, setFormError] = useState("");
  const [formLoading, setFormLoading] = useState(false);

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setPage(1);
  };

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setPage(1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");
    setFormLoading(true);

    const result = await addPatient(formData);

    if (!result.success) {
      setFormError(result.message || "Failed to add patient");
      setFormLoading(false);
      return;
    }

    setShowModal(false);
    setFormData({
      fullName: "",
      email: "",
      password: "",
      gender: "male",
      age: "",
      dateOfBirth: "",
      phone: "",
      address: "",
      occupation: "",
      bloodType: "",
      insuranceProvider: "",
      insuranceClass: "",
      patientType: "outpatient",
      emergencyContact: { name: "", phone: "", relation: "" },
    });
    setFormLoading(false);
  };

//   console.log("API RESULT:", result);
// console.log("TOTAL:", result.pagination?.total);
// console.log("TOTAL PAGES:", result.totalPages);

  return (
    <div className="px-7 py-4">
      {/* Top Bar */}
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-slate-500">{totalCount} patients found</p>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
          <LuPlus size={16} />
          Register Patient
        </button>
      </div>

      {/* Table Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {/* Header with Search & Filters */}
        <div className="flex flex-wrap items-center justify-between gap-3 px-6 py-4 border-b border-slate-100">
          <h2 className="text-[18px] font-bold text-slate-900">
            Patient Management
          </h2>
          <div className="flex items-center gap-2 flex-wrap">
            {/* Search */}
            <div className="flex items-center bg-gray-50 border border-slate-200 h-9 px-3 rounded-lg">
              <LuSearch className="text-gray-400 mr-2" size={16} />
              <input
                type="text"
                value={search}
                onChange={handleSearchChange}
                placeholder="Search by name, ID or condition..."
                className="bg-transparent outline-none text-sm placeholder:text-gray-400 w-52"
              />
            </div>

            {/* Gender Filter */}
            <select
              value={filters.gender}
              onChange={(e) => handleFilterChange("gender", e.target.value)}
              className="h-9 px-3 bg-white border border-slate-200 rounded-lg text-sm text-slate-600 cursor-pointer">
              <option value="">All Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>

            {/* Type Filter */}
            <select
              value={filters.type}
              onChange={(e) => handleFilterChange("type", e.target.value)}
              className="h-9 px-3 bg-white border border-slate-200 rounded-lg text-sm text-slate-600 cursor-pointer">
              <option value="">All Types</option>
              <option value="outpatient">Outpatient</option>
              <option value="inpatient">Inpatient</option>
            </select>

            {/* Status Filter */}
            <select
              value={filters.status}
              onChange={(e) => handleFilterChange("status", e.target.value)}
              className="h-9 px-3 bg-white border border-slate-200 rounded-lg text-sm text-slate-600 cursor-pointer">
              <option value="">All Status</option>
              <option value="inTreatment">In Treatment</option>
              <option value="admitted">Admitted</option>
              <option value="discharged">Discharged</option>
            </select>

            <button
              onClick={() => {
                setFilters({ gender: "", type: "", status: "" });
                setSearch("");
                setPage(1);
              }}
              className="h-9 px-3 flex items-center gap-1.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-600 hover:bg-slate-50">
              <LuFilter size={14} />
              Filter
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          {loading ? (
            <div className="px-6 py-12 text-center text-slate-400">
              Loading patients...
            </div>
          ) : error ? (
            <div className="px-6 py-12 text-center text-red-500">{error}</div>
          ) : (
                <div className="overflow-x-auto w-full">
                  <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-slate-50">
                  <th className="w-10 px-6 py-3">
                    <input type="checkbox" className="rounded" />
                  </th>
                  {[
                    "Name",
                    "Gender / Age",
                    "Condition",
                    "Doctor",
                    "Patient Type",
                    "Phone",
                    "Location",
                    "Status",
                  ].map((header) => (
                    <th
                      key={header}
                      className="text-left text-[12px] text-slate-800 font-bold px-4 py-3 uppercase whitespace-nowrap">
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {patients.length === 0 ? (
                  <tr>
                    <td
                      colSpan={9}
                      className="px-6 py-12 text-center text-slate-400 text-sm">
                      No patients found
                    </td>
                  </tr>
                ) : (
                  patients.map((patient, index) => {
                    const name = patient.userId?.fullName ?? "Unknown";
                    const patientId = patient.patientId ?? patient.id ?? "-";
                    const gender =
                      patient.userId?.gender ?? patient.gender ?? "-";
                    const age = patient.age ?? "-";

                    const conditions = patient.medicalInfo?.conditions ?? [];
                    const condition =
                      conditions.length > 0
                        ? conditions.map((c) => c.name).join(", ")
                        : "-";

                    const doctorName =
                      patient.doctorId?.userId?.fullName ??
                      patient.doctorName ??
                      "-";
                    const doctorSpec =
                      patient.doctorId?.specialization ??
                      patient.doctorSpecialization ??
                      "";

                    const type = patient.patientType ?? "outpatient";
                    const typeConfig = TYPE_BADGE[type] ?? {
                      label: type,
                      className: "bg-slate-100 text-slate-700",
                    };

                    const admissionDate = patient.userId?.phone;

                    const location = patient.userId?.address ?? "—";

                    const status = patient.currentStatus ?? "inTreatment";
                    const statusConfig = STATUS_BADGE[status] ?? {
                      label: status,
                      className: "bg-slate-100 text-slate-700",
                    };

                    return (
                      <tr
                        key={patient._id || index}
                        className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors">
                        <td className="px-6 py-3">
                          <input type="checkbox" className="rounded" />
                        </td>
                        <td className="px-4 py-3">
                          <Link
                            to={`/reception/patients/${patient._id || patient.id}`}
                            className="flex items-center gap-2 group">
                            <div
                              className={`w-9 h-9 rounded-full ${getAvatarColor(name)} flex items-center justify-center`}>
                              <span className="text-white font-semibold text-xs">
                                {getInitials(name)}
                              </span>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-slate-800 group-hover:text-blue-600 transition-colors">
                                {name}
                              </p>
                              <p className="text-xs text-slate-400">
                                #{patientId}
                              </p>
                            </div>
                          </Link>
                        </td>
                        <td className="px-4 py-3 text-sm text-slate-700">
                          {gender !== "-"
                            ? gender.charAt(0).toUpperCase()
                            : "-"}{" "}
                          / {age}
                        </td>
                        <td
                          className="px-4 py-3 text-sm text-slate-700 max-w-[180px] truncate"
                          title={condition}>
                          {condition}
                        </td>
                        <td className="px-4 py-3">
                          <p className="text-sm text-slate-700">{doctorName}</p>
                          {doctorSpec && (
                            <p className="text-xs text-slate-400">
                              {doctorSpec}
                            </p>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${typeConfig.className}`}>
                            {typeConfig.label}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm text-slate-500">
                          {admissionDate}
                        </td>
                        <td className="px-4 py-3 text-sm text-slate-500">
                          {location}
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${statusConfig.className}`}>
                            <span className="w-1.5 h-1.5 rounded-full bg-current" />
                            {statusConfig.label}
                          </span>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 0 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100">
            <p className="text-sm text-slate-500">
              Showing {patients.length} of {totalCount} patients
            </p>
            <div className="flex items-center gap-1">
              <button
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 text-slate-500 disabled:opacity-40 hover:bg-slate-50">
                <LuChevronLeft size={16} />
              </button>
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

      {/* Register Patient Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 sticky top-0 bg-white">
              <h3 className="text-lg font-bold text-slate-900">
                Register New Patient
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-slate-100 text-slate-500">
                <LuX size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {/* Account Info */}
              <div>
                <label className="text-sm font-medium text-slate-700 block mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={formData.fullName}
                  onChange={(e) =>
                    setFormData((f) => ({ ...f, fullName: e.target.value }))
                  }
                  className="w-full h-10 px-3 border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter patient full name"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-slate-700 block mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    required
                    
                    onChange={(e) =>
                      setFormData((f) => ({ ...f, email: e.target.value }))
                    }
                    className="w-full h-10 px-3 border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="patient@example.com"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700 block mb-1">
                    Password
                  </label>
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={formData.password}
                    disabled
                    onChange={(e) =>
                      setFormData((f) => ({ ...f, password: e.target.value }))
                    }
                    className="w-full h-10 px-3 border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Min 6 characters"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium text-slate-700 block mb-1">
                    Gender
                  </label>
                  <select
                    value={formData.gender}
                    onChange={(e) =>
                      setFormData((f) => ({ ...f, gender: e.target.value }))
                    }
                    className="w-full h-10 px-3 border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer">
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700 block mb-1">
                    Age
                  </label>
                  <input
                    type="number"
                    required
                    min={0}
                    max={150}
                    value={formData.age}
                    onChange={(e) =>
                      setFormData((f) => ({ ...f, age: e.target.value }))
                    }
                    className="w-full h-10 px-3 border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Age"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700 block mb-1">
                    Date of Birth
                  </label>
                  <input
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={(e) =>
                      setFormData((f) => ({
                        ...f,
                        dateOfBirth: e.target.value,
                      }))
                    }
                    className="w-full h-10 px-3 border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-slate-700 block mb-1">
                    Phone
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData((f) => ({ ...f, phone: e.target.value }))
                    }
                    className="w-full h-10 px-3 border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g. 0100-000-0000"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700 block mb-1">
                    Blood Type
                  </label>
                  <select
                    value={formData.bloodType}
                    onChange={(e) =>
                      setFormData((f) => ({ ...f, bloodType: e.target.value }))
                    }
                    className="w-full h-10 px-3 border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer">
                    <option value="">Select blood type</option>
                    {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map(
                      (bt) => (
                        <option key={bt} value={bt}>
                          {bt}
                        </option>
                      ),
                    )}
                  </select>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-slate-700 block mb-1">
                  Address
                </label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) =>
                    setFormData((f) => ({ ...f, address: e.target.value }))
                  }
                  className="w-full h-10 px-3 border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Patient address"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-slate-700 block mb-1">
                  Occupation
                </label>
                <input
                  type="text"
                  value={formData.occupation}
                  onChange={(e) =>
                    setFormData((f) => ({ ...f, occupation: e.target.value }))
                  }
                  className="w-full h-10 px-3 border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g. Engineer"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-slate-700 block mb-1">
                    Insurance Provider
                  </label>
                  <input
                    type="text"
                    value={formData.insuranceProvider}
                    onChange={(e) =>
                      setFormData((f) => ({
                        ...f,
                        insuranceProvider: e.target.value,
                      }))
                    }
                    className="w-full h-10 px-3 border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g. HealthPlus"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700 block mb-1">
                    Insurance Class
                  </label>
                  <input
                    type="text"
                    value={formData.insuranceClass}
                    onChange={(e) =>
                      setFormData((f) => ({
                        ...f,
                        insuranceClass: e.target.value,
                      }))
                    }
                    className="w-full h-10 px-3 border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g. A"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-slate-700 block mb-1">
                  Patient Type
                </label>
                <select
                  value={formData.patientType}
                  onChange={(e) =>
                    setFormData((f) => ({ ...f, patientType: e.target.value }))
                  }
                  className="w-full h-10 px-3 border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer">
                  <option value="outpatient">Outpatient</option>
                  <option value="inpatient">Inpatient</option>
                </select>
              </div>

              {/* Emergency Contact */}
              <div className="border-t border-slate-100 pt-4">
                <p className="text-sm font-semibold text-slate-800 mb-3">
                  Emergency Contact
                </p>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="text-sm font-medium text-slate-700 block mb-1">
                      Name
                    </label>
                    <input
                      type="text"
                      value={formData.emergencyContact.name}
                      onChange={(e) =>
                        setFormData((f) => ({
                          ...f,
                          emergencyContact: {
                            ...f.emergencyContact,
                            name: e.target.value,
                          },
                        }))
                      }
                      className="w-full h-10 px-3 border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Contact name"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-700 block mb-1">
                      Phone
                    </label>
                    <input
                      type="tel"
                      value={formData.emergencyContact.phone}
                      onChange={(e) =>
                        setFormData((f) => ({
                          ...f,
                          emergencyContact: {
                            ...f.emergencyContact,
                            phone: e.target.value,
                          },
                        }))
                      }
                      className="w-full h-10 px-3 border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Contact phone"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-700 block mb-1">
                      Relation
                    </label>
                    <input
                      type="text"
                      value={formData.emergencyContact.relation}
                      onChange={(e) =>
                        setFormData((f) => ({
                          ...f,
                          emergencyContact: {
                            ...f.emergencyContact,
                            relation: e.target.value,
                          },
                        }))
                      }
                      className="w-full h-10 px-3 border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g. Spouse"
                    />
                  </div>
                </div>
              </div>

              {formError && <p className="text-red-500 text-sm">{formError}</p>}

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 h-10 border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50">
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={formLoading}
                  className="flex-1 h-10 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors">
                  {formLoading ? "Registering..." : "Register Patient"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Reception_PatientManagement;
