import { IoIosMale, IoMdFemale } from "react-icons/io";
import { MdEmail, MdLocalPhone, MdLocationPin } from "react-icons/md";

const STATUS_CONFIG = {
  inTreatment: {
    label: "In Treatment",
    class: "bg-green-50 text-green-700 border border-green-200",
  },
  admitted: {
    label: "Admitted",
    class: "bg-blue-50 text-blue-700 border border-blue-200",
  },
  discharged: {
    label: "Discharged",
    class: "bg-slate-100 text-slate-600 border border-slate-200",
  },
};

const PatientInformation = ({ data }) => {
  const GenderIcon = data.user.gender === "female" ? IoMdFemale : IoIosMale;
  const genderColor =
    data.user.gender === "female" ? "text-pink-400" : "text-blue-400";
  const status = STATUS_CONFIG[data.currentStatus] ?? STATUS_CONFIG.inTreatment;

  const initials = data.user.fullName
    .trim()
    .split(/\s+/)
    .map((w) => w.charAt(0).toUpperCase())
    .join("");

  return (
    <div className="flex items-start gap-5">
      {/* Avatar */}
      <div className="w-[90px] h-[90px] rounded-2xl bg-gradient-to-br from-teal-400 to-blue-500 flex items-center justify-center shrink-0">
        <span className="text-white text-[26px] font-semibold">{initials}</span>
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        {/* Name + gender */}
        <div className="flex items-center gap-2 mb-1">
          <h2 className="text-[20px] font-semibold text-slate-900">
            {data.user.fullName}
          </h2>
          <GenderIcon className={`text-[18px] ${genderColor}`} />
        </div>
        <div className="flex items-center gap-5 mb-2">
          <span className="text-[13px] text-slate-500">{data.patientId}</span>
          <span className="text-[13px] text-slate-500">{data.age} years old</span>
        </div>
        {/* Address row */}
        <div className="address flex items-center gap-5 mb-4">
          <div className="flex items-center gap-1.5 text-[13px] text-slate-500">
            <MdEmail className="text-[15px] shrink-0" />
            <span>{data.user.email}</span>
          </div>
          <div className="flex items-center gap-1.5 text-[13px] text-slate-500">
            <MdLocalPhone className="text-[15px] shrink-0" />
            <span>{data.user.phone}</span>
          </div>
          <div className="flex items-center gap-1.5 text-[13px] text-slate-500">
            <MdLocationPin className="text-[15px] shrink-0" />
            <span>{data.user.address}</span>
          </div>
        </div>

        {/* Stats row */}
        <div className="flex items-center gap-0 divide-x divide-slate-200">
          {[
            { label: "Blood Type", value: data.bloodType ?? "—" },
            { label: "Occupation", value: data.occupation ?? "—" },
            { label: "Insurance", value: data.insuranceProvider ?? "—" },
            { label: "Insurance Class", value: data.insuranceClass ?? "—" },
            { label: "Status", value: null, badge: status },
          ].map((item, i) => (
            <div key={i} className="px-4 first:pl-0">
              <p className="text-[11px] text-slate-400 uppercase tracking-wide mb-0.5">
                {item.label}
              </p>
              {item.badge ? (
                <span
                  className={`text-[12px] font-medium px-2.5 py-0.5 rounded-full ${item.badge.class}`}>
                  {item.badge.label}
                </span>
              ) : (
                <p className="text-[14px] font-medium text-slate-800">
                  {item.value}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PatientInformation;
