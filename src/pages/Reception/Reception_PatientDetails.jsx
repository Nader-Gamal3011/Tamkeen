// pages/Reception/Reception_PatientDetails.jsx
import { useParams, Link } from "react-router-dom";
import { useReceptionistPatientDetails } from "../../hooks/useReceptionistPatientDetails";
import {
    LuChevronLeft,
    LuUser,
    LuPhone,
    LuMapPin,
    LuCalendarDays,
    LuHeart,
    LuThermometer,
    LuActivity,
    LuPill,
    LuFileText,
    LuClock,
    LuShieldCheck,
    LuDroplet,
} from "react-icons/lu";

const getInitials = (name = "") =>
    name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);

const calculateAge = (dob) => {
    if (!dob) return null;
    const birth = new Date(dob);
    if (Number.isNaN(birth.getTime())) return null;
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
    return age;
};

const InfoRow = ({ icon: Icon, label, value }) => (
    <div className="flex items-start gap-3 py-2.5">
        <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center shrink-0">
            <Icon size={15} className="text-slate-500" />
        </div>
        <div>
            <p className="text-xs text-slate-400">{label}</p>
            <p className="text-sm font-medium text-slate-800">{value || "—"}</p>
        </div>
    </div>
);

const SectionCard = ({ title, icon: Icon, children }) => (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="flex items-center gap-2 px-5 py-4 border-b border-slate-100">
            {Icon && <Icon size={18} className="text-blue-600" />}
            <h3 className="text-[15px] font-bold text-slate-900">{title}</h3>
        </div>
        <div className="p-5">{children}</div>
    </div>
);

const VitalCard = ({ label, value, unit, icon: Icon }) => (
    <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-center">
        <Icon size={16} className="text-slate-400 mx-auto mb-1" />
        <p className="text-lg font-bold text-slate-800">{value}</p>
        <p className="text-[11px] text-slate-400">
            {unit} &bull; {label}
        </p>
    </div>
);

// ✅ matches backend currentStatus enum
const STATUS_BADGE = {
    inTreatment: { label: "In Treatment", className: "bg-green-100 text-green-700" },
    admitted: { label: "Admitted", className: "bg-blue-100 text-blue-700" },
    discharged: { label: "Discharged", className: "bg-slate-100 text-slate-700" },
};

// ✅ matches backend patientType enum
const TYPE_BADGE = {
    outpatient: { label: "Outpatient", className: "bg-purple-100 text-purple-700" },
    inpatient: { label: "Inpatient", className: "bg-indigo-100 text-indigo-700" },
};

const Reception_PatientDetails = () => {
    const { id } = useParams();
    const { patient, loading, error } = useReceptionistPatientDetails(id);

    if (loading) return <p className="p-7 text-slate-400">Loading patient details...</p>;
    if (error) return <p className="p-7 text-red-500">{error}</p>;
    if (!patient) return <p className="p-7 text-slate-400">Patient not found</p>;

    const user = patient.userId || {};
    const name = user.fullName ?? "Unknown";
    const gender = user.gender ?? "-";
    const age = patient.age ?? calculateAge(user.dateOfBirth) ?? "-";
    const phone = user.phone ?? "-";
    const address = user.address ?? "-";
    const patientId = patient.patientId ?? "-";

    const patientType = patient.patientType ?? "outpatient";
    const typeConfig = TYPE_BADGE[patientType] ?? { label: patientType, className: "bg-slate-100 text-slate-700" };

    const status = patient.currentStatus ?? "inTreatment";
    const statusConfig = STATUS_BADGE[status] ?? { label: status, className: "bg-slate-100 text-slate-700" };

    const createdAt = patient.createdAt
        ? new Date(patient.createdAt).toLocaleDateString("en-US", {
            day: "numeric", month: "long", year: "numeric",
        })
        : "—";

    const bloodType = patient.bloodType ?? "—";
    const occupation = patient.occupation ?? "—";
    const insuranceProvider = patient.insuranceProvider ?? "—";
    const insuranceClass = patient.insuranceClass ?? "—";

    const emergencyContact = patient.emergencyContact ?? {};

    const conditions = patient.medicalInfo?.conditions ?? [];
    const allergies = patient.medicalInfo?.allergies ?? [];

    const vitals = patient.vitals ?? {};
    const latestBP = vitals.bloodPressure?.length
        ? vitals.bloodPressure[vitals.bloodPressure.length - 1]
        : null;

    const medications = patient.medications ?? [];
    const notes = patient.patientNotes ?? [];
    const healthReports = patient.healthReports ?? [];

    return (
        <div className="px-7 py-4">
            {/* Back Button */}
            <Link
                to="/reception/patients"
                className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-blue-600 mb-4 transition-colors">
                <LuChevronLeft size={16} />
                Back to Patients
            </Link>

            {/* Patient Header */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 mb-4">
                <div className="flex items-start gap-4 flex-wrap">
                    <div className="w-16 h-16 rounded-full bg-blue-500 flex items-center justify-center shrink-0">
                        <span className="text-white font-bold text-lg">{getInitials(name)}</span>
                    </div>
                    <div className="flex-1 min-w-[200px]">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                            <h1 className="text-xl font-bold text-slate-900">{name}</h1>
                            <span className={`px-3 py-0.5 rounded-full text-xs font-medium ${statusConfig.className}`}>
                                {statusConfig.label}
                            </span>
                            <span className={`px-3 py-0.5 rounded-full text-xs font-medium ${typeConfig.className}`}>
                                {typeConfig.label}
                            </span>
                        </div>
                        <p className="text-sm text-slate-500">
                            Patient ID: #{patientId} &bull; {gender !== "-" ? gender.charAt(0).toUpperCase() + gender.slice(1) : "-"} / {age} years
                        </p>
                        <p className="text-xs text-slate-400 mt-1">Registered on {createdAt}</p>
                    </div>
                    <div className="text-right">
                        <p className="text-sm text-slate-500">Blood Type</p>
                        <p className="text-lg font-bold text-slate-800">{bloodType}</p>
                    </div>
                </div>
            </div>

            {/* Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                {/* Left Column */}
                <div className="space-y-4">
                    {/* Personal Information */}
                    <SectionCard title="Personal Information" icon={LuUser}>
                        <InfoRow icon={LuUser} label="Full Name" value={name} />
                        <InfoRow icon={LuUser} label="Gender / Age" value={`${gender} / ${age} years`} />
                        <InfoRow icon={LuPhone} label="Phone" value={phone} />
                        <InfoRow icon={LuMapPin} label="Address" value={address} />
                        <InfoRow icon={LuUser} label="Occupation" value={occupation} />
                        <InfoRow icon={LuCalendarDays} label="Registration Date" value={createdAt} />
                    </SectionCard>

                    {/* Insurance */}
                    <SectionCard title="Insurance" icon={LuShieldCheck}>
                        <InfoRow icon={LuShieldCheck} label="Provider" value={insuranceProvider} />
                        <InfoRow icon={LuShieldCheck} label="Class" value={insuranceClass} />
                    </SectionCard>

                    {/* Emergency Contact */}
                    <SectionCard title="Emergency Contact" icon={LuPhone}>
                        <InfoRow icon={LuUser} label="Name" value={emergencyContact.name} />
                        <InfoRow icon={LuPhone} label="Phone" value={emergencyContact.phone} />
                        <InfoRow icon={LuUser} label="Relation" value={emergencyContact.relation} />
                    </SectionCard>
                </div>

                {/* Middle Column */}
                <div className="space-y-4">
                    {/* Vitals */}
                    <SectionCard title="Latest Vitals" icon={LuHeart}>
                        {vitals.bloodSugar || vitals.bodyWeight || vitals.temperature || latestBP ? (
                            <div className="grid grid-cols-2 gap-3">
                                <VitalCard
                                    label="Blood Pressure"
                                    value={latestBP?.bp ?? "—"}
                                    unit="mmHg"
                                    icon={LuHeart}
                                />
                                <VitalCard
                                    label="Heart Rate"
                                    value={latestBP?.heartRate ?? "—"}
                                    unit="bpm"
                                    icon={LuActivity}
                                />
                                <VitalCard
                                    label="Temperature"
                                    value={vitals.temperature ?? "—"}
                                    unit="°C"
                                    icon={LuThermometer}
                                />
                                <VitalCard
                                    label="Blood Sugar"
                                    value={vitals.bloodSugar ?? "—"}
                                    unit="mg/dL"
                                    icon={LuDroplet}
                                />
                                <VitalCard
                                    label="Weight"
                                    value={vitals.bodyWeight ?? "—"}
                                    unit="kg"
                                    icon={LuUser}
                                />
                            </div>
                        ) : (
                            <p className="text-sm text-slate-400 text-center py-4">No vitals recorded</p>
                        )}
                    </SectionCard>

                    {/* Medical Info */}
                    <SectionCard title="Medical Information" icon={LuActivity}>
                        <div className="mb-4">
                            <p className="text-xs text-slate-400 mb-2">Conditions</p>
                            {conditions.length === 0 ? (
                                <p className="text-sm text-slate-400">No known conditions</p>
                            ) : (
                                <div className="space-y-2">
                                    {conditions.map((c) => (
                                        <div key={c._id} className="p-2.5 bg-slate-50 rounded-lg border border-slate-100">
                                            <p className="text-sm font-medium text-slate-800">{c.name}</p>
                                            {c.detail && <p className="text-xs text-slate-500 mt-0.5">{c.detail}</p>}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                        <div>
                            <p className="text-xs text-slate-400 mb-2">Allergies</p>
                            {allergies.length === 0 ? (
                                <p className="text-sm text-slate-400">No known allergies</p>
                            ) : (
                                <div className="flex flex-wrap gap-1.5">
                                    {allergies.map((a, i) => (
                                        <span key={i} className="px-2.5 py-1 bg-red-50 text-red-700 text-xs font-medium rounded-full">
                                            {a}
                                        </span>
                                    ))}
                                </div>
                            )}
                        </div>
                    </SectionCard>

                    {/* Medications */}
                    <SectionCard title="Current Medications" icon={LuPill}>
                        {medications.length === 0 ? (
                            <p className="text-sm text-slate-400 text-center py-4">No medications prescribed</p>
                        ) : (
                            <div className="space-y-3">
                                {medications.map((med) => (
                                    <div key={med._id} className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                                        <div className="flex items-center justify-between">
                                            <p className="text-sm font-medium text-slate-800">{med.name}</p>
                                            <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${med.status === "active" ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-500"
                                                }`}>
                                                {med.status}
                                            </span>
                                        </div>
                                        <p className="text-xs text-slate-500 mt-1">
                                            {med.dosage} &bull; {med.frequency} &bull; {med.form}
                                        </p>
                                        {med.startDate && (
                                            <p className="text-xs text-slate-400 mt-0.5">
                                                Since {new Date(med.startDate).toLocaleDateString("en-US", {
                                                    day: "numeric", month: "short", year: "numeric",
                                                })}
                                            </p>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </SectionCard>
                </div>

                {/* Right Column */}
                <div className="space-y-4">
                    {/* Notes */}
                    <SectionCard title="Medical Notes" icon={LuFileText}>
                        {notes.length === 0 ? (
                            <p className="text-sm text-slate-400 text-center py-4">No notes available</p>
                        ) : (
                            <div className="space-y-3">
                                {notes.map((note) => (
                                    <div key={note._id} className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                                        <p className="text-xs text-slate-400 font-medium mb-1">{note.doctorName}</p>
                                        <p className="text-sm text-slate-700">{note.note}</p>
                                        {note.createdAt && (
                                            <p className="text-xs text-slate-400 mt-1.5 flex items-center gap-1">
                                                <LuClock size={12} />
                                                {new Date(note.createdAt).toLocaleDateString("en-US", {
                                                    day: "numeric", month: "short", year: "numeric",
                                                    hour: "2-digit", minute: "2-digit",
                                                })}
                                            </p>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </SectionCard>

                    {/* Health Reports */}
                    <SectionCard title="Health Reports" icon={LuShieldCheck}>
                        {healthReports.length === 0 ? (
                            <p className="text-sm text-slate-400 text-center py-4">No reports uploaded</p>
                        ) : (
                            <div className="space-y-2">
                                {healthReports.map((r) => (
                                    <a>
                                        key={r._id}
                                        href={r.fileUrl}
                                        target="_blank"
                                        rel="noreferrer"
                    className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100 hover:bg-blue-50 transition-colors"
                                        <div className="flex items-center gap-2 min-w-0">
                                            <LuFileText size={16} className="text-blue-600 shrink-0" />
                                            <div className="min-w-0">
                                                <p className="text-sm font-medium text-slate-800 truncate">{r.title}</p>
                                                <p className="text-xs text-slate-400">{r.size}</p>
                                            </div>
                                        </div>
                                    </a>
                                ))}
                            </div>
                        )}
                    </SectionCard>

                    {/* Activity Log */}
                    <SectionCard title="Activity Log" icon={LuClock}>
                        {patient.activityLog?.length === 0 || !patient.activityLog ? (
                            <p className="text-sm text-slate-400 text-center py-4">No activity recorded</p>
                        ) : (
                            <div className="space-y-3">
                                {patient.activityLog.map((log) => (
                                    <div key={log._id} className="flex gap-2.5">
                                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 shrink-0" />
                                        <div>
                                            <p className="text-sm text-slate-700">{log.action}</p>
                                            <p className="text-xs text-slate-400 mt-0.5">
                                                {new Date(log.timestamp).toLocaleDateString("en-US", {
                                                    day: "numeric", month: "short", year: "numeric",
                                                    hour: "2-digit", minute: "2-digit",
                                                })}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </SectionCard>
                </div>
            </div>
        </div>
    );
};

export default Reception_PatientDetails;