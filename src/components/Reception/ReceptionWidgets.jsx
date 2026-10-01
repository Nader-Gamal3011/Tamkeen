import { LuCircleAlert, LuBell, LuReceipt } from "react-icons/lu";
const statusToBadge = (status) => {
  switch (status) {
    case "Completed":
    case "completed":
      return {
        label: status,
        className: "bg-green-100 text-green-700",
      };
    case "Scheduled":
    case "scheduled":
      return {
        label: status,
        className: "bg-blue-100 text-blue-700",
      };
    case "Ongoing":
    case "inTreatment":
      return {
        label: status,
        className: "bg-purple-100 text-purple-700",
      };
    case "Cancelled":
    case "canceled":
    case "Canceled":
    case "cancelled":
      return {
        label: status,
        className: "bg-red-100 text-red-700",
      };
    case "Waiting":
    case "waiting":
      return {
        label: status,
        className: "bg-yellow-100 text-yellow-700",
      };
    default:
      return {
        label: status,
        className: "bg-slate-100 text-slate-700",
      };
  }
};

export const StatusBadge = ({ status }) => {
  const b = statusToBadge(status);
  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-medium ${b.className}`}>
      {b.label}
    </span>
  );
};

export const LiveQueueBadge = ({ status }) => {
  // expected statuses: Waiting | With Doctor | Completed
  const norm = String(status || "").toLowerCase();
  if (norm.includes("waiting"))
    return (
      <span className="px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700">
        Waiting
      </span>
    );
  if (norm.includes("doctor") || norm.includes("with doctor"))
    return (
      <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
        With Doctor
      </span>
    );
  if (norm.includes("complete"))
    return (
      <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
        Completed
      </span>
    );

  return (
    <span className="px-3 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-700">
      {status || "—"}
    </span>
  );
};

export const NotificationIcon = ({ type }) => {
  const t = String(type || "").toLowerCase();
  if (t.includes("bill") || t.includes("payment"))
    return <LuReceipt size={18} className="text-amber-600" />;
  if (t.includes("cancel"))
    return <LuCircleAlert size={18} className="text-red-600" />;
  if (t.includes("remind") || t.includes("appointment"))
    return <LuBell size={18} className="text-blue-600" />;
  return <LuBell size={18} className="text-blue-600" />;
};

export const SectionCard = ({ title, subtitle, icon: Icon, children }) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="flex items-start gap-3 px-5 py-4 border-b border-slate-100">
        {Icon && (
          <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
            <Icon size={18} className="text-blue-600" />
          </div>
        )}
        <div>
          <h3 className="text-[15px] font-bold text-slate-900">{title}</h3>
          {subtitle && (
            <p className="text-sm text-slate-500 mt-1">{subtitle}</p>
          )}
        </div>
      </div>
      <div className="p-5">{children}</div>
    </div>
  );
};
