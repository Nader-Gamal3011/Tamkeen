import { useState } from "react";
import { useAdminCreateStaff } from "../../hooks/useAdminCreateStaff";
import { LuUserPlus, LuStethoscope, LuUser } from "react-icons/lu";

const emptyDoctorForm = {
  fullName: "",
  email: "",
  password: "",
  phone: "",
  gender: "male",
  dateOfBirth: "",
  address: "",
  specialty: "",
  department: "",
  experience: "",
  about: "",
  roomNumber: "",
  workType: "fullTime",
  salary: "",
  medicalLicenseNumber: "",
  licenseExpiryDate: "",
};

const emptyReceptionistForm = {
  fullName: "",
  email: "",
  password: "",
  phone: "",
  gender: "male",
  dateOfBirth: "",
  address: "",
};

const InputField = ({
  label,
  value,
  onChange,
  type = "text",
  placeholder = "",
  required = false,
}) => (
  <div>
    <label className="text-sm font-medium text-slate-700 block mb-1">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      required={required}
      className="w-full h-10 px-3 border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500"
    />
  </div>
);

const Admin_CreateStaff = () => {
  const { createDoctor, createReceptionist } = useAdminCreateStaff();

  const [activeTab, setActiveTab] = useState("doctor");
  const [doctorForm, setDoctorForm] = useState(emptyDoctorForm);
  const [receptionistForm, setReceptionistForm] = useState(
    emptyReceptionistForm,
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    const result =
      activeTab === "doctor"
        ? await createDoctor(doctorForm)
        : await createReceptionist(receptionistForm);

    setLoading(false);

    if (!result.success) {
      setError(result.message || "Failed to create account.");
      return;
    }

    setSuccess(
      `${activeTab === "doctor" ? "Doctor" : "Receptionist"} account created successfully!`,
    );
    if (activeTab === "doctor") setDoctorForm(emptyDoctorForm);
    else setReceptionistForm(emptyReceptionistForm);
  };

  return (
    <div className="px-7 py-4">
      <h2 className="text-[18px] font-bold text-slate-900 mb-4">
        Create Staff Account
      </h2>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => {
            setActiveTab("doctor");
            setError("");
            setSuccess("");
          }}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-colors ${
            activeTab === "doctor"
              ? "bg-blue-600 text-white"
              : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
          }`}>
          <LuStethoscope size={16} />
          New Doctor
        </button>
        <button
          onClick={() => {
            setActiveTab("receptionist");
            setError("");
            setSuccess("");
          }}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-colors ${
            activeTab === "receptionist"
              ? "bg-blue-600 text-white"
              : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
          }`}>
          <LuUser size={16} />
          New Receptionist
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Common Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField
              label="Full Name"
              required
              value={
                activeTab === "doctor"
                  ? doctorForm.fullName
                  : receptionistForm.fullName
              }
              onChange={(e) =>
                activeTab === "doctor"
                  ? setDoctorForm((f) => ({ ...f, fullName: e.target.value }))
                  : setReceptionistForm((f) => ({
                      ...f,
                      fullName: e.target.value,
                    }))
              }
            />
            <InputField
              label="Email"
              type="email"
              required
              value={
                activeTab === "doctor"
                  ? doctorForm.email
                  : receptionistForm.email
              }
              onChange={(e) =>
                activeTab === "doctor"
                  ? setDoctorForm((f) => ({ ...f, email: e.target.value }))
                  : setReceptionistForm((f) => ({
                      ...f,
                      email: e.target.value,
                    }))
              }
            />
            <InputField
              label="Password"
              type="password"
              required
              placeholder="Min 6 characters"
              value={
                activeTab === "doctor"
                  ? doctorForm.password
                  : receptionistForm.password
              }
              onChange={(e) =>
                activeTab === "doctor"
                  ? setDoctorForm((f) => ({ ...f, password: e.target.value }))
                  : setReceptionistForm((f) => ({
                      ...f,
                      password: e.target.value,
                    }))
              }
            />
            <InputField
              label="Phone"
              value={
                activeTab === "doctor"
                  ? doctorForm.phone
                  : receptionistForm.phone
              }
              onChange={(e) =>
                activeTab === "doctor"
                  ? setDoctorForm((f) => ({ ...f, phone: e.target.value }))
                  : setReceptionistForm((f) => ({
                      ...f,
                      phone: e.target.value,
                    }))
              }
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium text-slate-700 block mb-1">
                Gender
              </label>
              <select
                value={
                  activeTab === "doctor"
                    ? doctorForm.gender
                    : receptionistForm.gender
                }
                onChange={(e) =>
                  activeTab === "doctor"
                    ? setDoctorForm((f) => ({ ...f, gender: e.target.value }))
                    : setReceptionistForm((f) => ({
                        ...f,
                        gender: e.target.value,
                      }))
                }
                className="w-full h-10 px-3 border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer">
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>
            <InputField
              label="Date of Birth"
              type="date"
              value={
                activeTab === "doctor"
                  ? doctorForm.dateOfBirth
                  : receptionistForm.dateOfBirth
              }
              onChange={(e) =>
                activeTab === "doctor"
                  ? setDoctorForm((f) => ({
                      ...f,
                      dateOfBirth: e.target.value,
                    }))
                  : setReceptionistForm((f) => ({
                      ...f,
                      dateOfBirth: e.target.value,
                    }))
              }
            />
            <InputField
              label="Address"
              value={
                activeTab === "doctor"
                  ? doctorForm.address
                  : receptionistForm.address
              }
              onChange={(e) =>
                activeTab === "doctor"
                  ? setDoctorForm((f) => ({ ...f, address: e.target.value }))
                  : setReceptionistForm((f) => ({
                      ...f,
                      address: e.target.value,
                    }))
              }
            />
          </div>

          {/* Doctor-only Fields */}
          {activeTab === "doctor" && (
            <>
              <div className="border-t border-slate-100 pt-4">
                <p className="text-sm font-semibold text-slate-800 mb-3">
                  Professional Information
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <InputField
                    label="Specialty"
                    required
                    placeholder="e.g. Cardiologist"
                    value={doctorForm.specialty}
                    onChange={(e) =>
                      setDoctorForm((f) => ({
                        ...f,
                        specialty: e.target.value,
                      }))
                    }
                  />
                  <InputField
                    label="Experience (years)"
                    type="number"
                    placeholder="e.g. 10"
                    value={doctorForm.experience}
                    onChange={(e) =>
                      setDoctorForm((f) => ({
                        ...f,
                        experience: e.target.value,
                      }))
                    }
                  />
                  <InputField
                    label="Room Number"
                    placeholder="e.g. A-201"
                    value={doctorForm.roomNumber}
                    onChange={(e) =>
                      setDoctorForm((f) => ({
                        ...f,
                        roomNumber: e.target.value,
                      }))
                    }
                  />
                  <InputField
                    label="Salary"
                    type="number"
                    placeholder="e.g. 25000"
                    value={doctorForm.salary}
                    onChange={(e) =>
                      setDoctorForm((f) => ({ ...f, salary: e.target.value }))
                    }
                  />
                  <InputField
                    label="Medical License Number"
                    placeholder="e.g. ML-12345"
                    value={doctorForm.medicalLicenseNumber}
                    onChange={(e) =>
                      setDoctorForm((f) => ({
                        ...f,
                        medicalLicenseNumber: e.target.value,
                      }))
                    }
                  />
                  <InputField
                    label="License Expiry Date"
                    type="date"
                    value={doctorForm.licenseExpiryDate}
                    onChange={(e) =>
                      setDoctorForm((f) => ({
                        ...f,
                        licenseExpiryDate: e.target.value,
                      }))
                    }
                  />
                  <InputField
                    label="Employment Start Date"
                    type="date"
                    value={doctorForm.employmentStartDate}
                    onChange={(e) =>
                      setDoctorForm((f) => ({
                        ...f,
                        employmentStartDate: e.target.value,
                      }))
                    }
                  />
                  <div>
                    <label className="text-sm font-medium text-slate-700 block mb-1">
                      Work Type
                    </label>
                    <select
                      value={doctorForm.workType}
                      onChange={(e) =>
                        setDoctorForm((f) => ({
                          ...f,
                          workType: e.target.value,
                        }))
                      }
                      className="w-full h-10 px-3 border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer">
                      <option value="fullTime">Full Time</option>
                      <option value="partTime">Part Time</option>
                      <option value="consultant">Consultant</option>
                    </select>
                  </div>
                </div>
                <div className="mt-4">
                  <label className="text-sm font-medium text-slate-700 block mb-1">
                    About
                  </label>
                  <textarea
                    rows={3}
                    value={doctorForm.about}
                    onChange={(e) =>
                      setDoctorForm((f) => ({ ...f, about: e.target.value }))
                    }
                    placeholder="Brief description about the doctor..."
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </>
          )}

          {error && <p className="text-red-500 text-sm">{error}</p>}
          {success && (
            <p className="text-green-600 text-sm font-medium">{success}</p>
          )}

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center gap-2 px-6 h-10 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors">
              <LuUserPlus size={16} />
              {loading
                ? "Creating..."
                : activeTab === "doctor"
                  ? "Create Doctor Account"
                  : "Create Receptionist Account"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Admin_CreateStaff;
