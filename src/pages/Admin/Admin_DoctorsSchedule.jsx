import { useAdminDoctorsSchedule } from "../../hooks/useAdminDoctorsSchedule";
import { LuRefreshCw, LuClock, LuMapPin } from "react-icons/lu";

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

const STATUS_BADGE = {
  available: { label: "Available", className: "bg-green-100 text-green-700" },
  unavailable: { label: "Unavailable", className: "bg-red-100 text-red-700" },
};

const Admin_DoctorsSchedule = () => {
  const { doctors, loading, error, refetch } = useAdminDoctorsSchedule();

  const today = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][
    new Date().getDay()
  ];

  return (
    <div className="px-7 py-4">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-[18px] font-bold text-slate-900">
            Doctors Schedule
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">Today — {today}</p>
        </div>
        <button
          onClick={refetch}
          className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm text-slate-600 hover:bg-slate-50">
          <LuRefreshCw size={15} />
          Refresh
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="px-6 py-12 text-center text-slate-400">
            Loading schedule...
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
                    "Room",
                    "Today's Hours",
                    "Status",
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
                    const name = doc.fullName || "Unknown";
                    const statusConfig = STATUS_BADGE[doc.status] || {
                      label: doc.status,
                      className: "bg-slate-100 text-slate-700",
                    };

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
                          {doc.department || "—"}
                        </td>
                        <td className="px-4 py-3">
                          <span className="inline-flex items-center gap-1 text-xs text-slate-600">
                            <LuMapPin size={12} />
                            {doc.roomNumber || "—"}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          {doc.todaySchedule ? (
                            <span className="inline-flex items-center gap-1 text-sm text-blue-600 font-medium">
                              <LuClock size={13} />
                              {doc.todaySchedule.startTime} –{" "}
                              {doc.todaySchedule.endTime}
                            </span>
                          ) : (
                            <span className="text-xs text-slate-400">
                              Off today
                            </span>
                          )}
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
    </div>
  );
};

export default Admin_DoctorsSchedule;
