import { useState } from "react";

import { useReceptionistStats } from "../../hooks/useReceptionistStats";
import { useReceptionistAppointments } from "../../hooks/useReceptionistAppointments";
import { useLiveQueue } from "../../hooks/useLiveQueue";
import { RECEPTION_STATS_CONFIG } from "../../config/receptionStatsConfig";
import StateDoctor from "../../components/StateDoctor";
import {
  StatusBadge,
  LiveQueueBadge,
  NotificationIcon,
} from "../../components/Reception/ReceptionWidgets";
import { Link } from "react-router-dom";
import {
  LuPlus,
  LuCalendarDays,
  LuClipboardList,
  LuChevronRight,
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

const Reception_Dashboard = () => {
  const { data, loading, error } = useReceptionistStats();

  const { appointments } = useReceptionistAppointments();

  const { liveQueue } = useLiveQueue();

  const queue = liveQueue ?? [];

  const allEntries = queue.flatMap((item) => item.entries || []);

  const [showAllQueue, setShowAllQueue] = useState(false);
  const INITIAL_QUEUE_COUNT = 5;

  const visibleQueue = showAllQueue
    ? allEntries
    : allEntries.slice(0, INITIAL_QUEUE_COUNT);

  // console.log(appointments);

  if (loading) return <p className="p-7">Loading...</p>;
  if (error) return <p className="p-7 text-red-500">{error}</p>;

  const allappointments = appointments ?? [];

  const notifications = data.notifications ?? [];

  return (
    <>
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 px-7 my-4">
        {RECEPTION_STATS_CONFIG.map((item) => {
          const subtitle = item.subtitleTemplate
            ? item.subtitleTemplate(data[item.subtitleKey])
            : item.subtitle;
          return (
            <StateDoctor
              key={item.key}
              label={item.label}
              subtitle={subtitle}
              icon={item.icon}
              iconBg={item.iconBg}
              iconColor={item.iconColor}
              value={data[item.key]}
              loading={loading}
            />
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="flex items-center gap-3 px-7 mb-4">
        <Link
          to="/reception/patients"
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
          <LuPlus size={16} />
          Add Patient
        </Link>
        <Link
          to="/reception/appoints"
          className="flex items-center gap-2 bg-white border border-slate-200 text-slate-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors">
          <LuCalendarDays size={16} />
          Book Appointment
        </Link>
        <Link
          to="/reception/queue"
          className="flex items-center gap-2 bg-white border border-slate-200 text-slate-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors">
          <LuClipboardList size={16} />
          View Queue
        </Link>
      </div>

      {/* Main Content: Appointments Table + Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 px-7 mb-6">
        {/* Appointments Table */}
        <div className="lg:col-span-3 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
            <h2 className="text-[18px] font-bold text-slate-900">
              Patient Appointments
            </h2>
            <Link
              to="/reception/appoints"
              className="text-[13px] font-medium text-blue-600 hover:text-blue-700 flex items-center gap-1">
              See all <LuChevronRight size={14} />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-slate-50">
                  {["Patient", "Doctor", "Type", "Time", "Status"].map(
                    (header) => (
                      <th
                        key={header}
                        className="text-left text-[12px] text-slate-800 font-bold px-6 py-3 uppercase">
                        {header}
                      </th>
                    ),
                  )}
                </tr>
              </thead>
              <tbody>
                {allappointments.length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-6 py-8 text-center text-slate-400 text-sm">
                      No appointments today
                    </td>
                  </tr>
                ) : (
                  appointments.map((apt, index) => {
                    const patientName =
                      apt.patientId?.userId?.fullName || "Unknown";
                    const patientCode =
                      apt.patientId?.patientId ?? apt.patientCode ?? "-";
                    const doctorName =
                      apt.doctorId?.userId?.fullName || apt.doctorName || "-";
                    const doctorSpec =
                      apt.doctorId?.specialization ??
                      apt.doctorSpecialization ??
                      "";
                    return (
                      <tr
                        key={apt._id || index}
                        className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors">
                        <td className="px-6 py-3">
                          <div className="flex items-center gap-2">
                            <div
                              className={`w-9 h-9 rounded-full ${getAvatarColor(patientName)} flex items-center justify-center`}>
                              <span className="text-white font-semibold text-xs">
                                {getInitials(patientName)}
                              </span>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-slate-800">
                                {patientName}
                              </p>
                              <p className="text-xs text-slate-400">
                                {patientCode}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-3">
                          <p className="text-sm text-slate-700">{doctorName}</p>
                          {doctorSpec && (
                            <p className="text-xs text-slate-400">
                              {doctorSpec}
                            </p>
                          )}
                        </td>
                        <td className="px-6 py-3 text-sm text-slate-700">
                          {apt.appointmentType ?? apt.type ?? "-"}
                        </td>
                        <td className="px-6 py-3 text-sm text-blue-600">
                          {apt.startTime}
                          {apt.endTime && ` - ${apt.endTime}`}
                        </td>
                        <td className="px-6 py-3">
                          <StatusBadge
                            status={apt.status || "scheduled"}
                          />{" "}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      {/* Right Sidebar: Live Queue + Notifications */}
      <div className="grid grid-cols-2 gap-4 px-7 mb-6 items-start">
        {/* Live Queue */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
            <h3 className="text-[15px] font-bold text-slate-900">Live Queue</h3>
            <Link
              to="/reception/queue"
              className="text-[13px] font-medium text-blue-600 hover:text-blue-700">
              Manage
            </Link>
          </div>
          <div className="p-4 space-y-3">
            {queue.length === 0 ? (
              <p className="text-sm text-slate-400 text-center py-4">
                No patients in queue
              </p>
            ) : (
              visibleQueue.map((q) => {
                const name = q.patientId?.userId?.fullName || "Unknown";

                const token = `A-${q._id.slice(-4)}`;
                return (
                  <div
                    key={q._id}
                    className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-13 h-13  rounded-full bg-blue-100 flex items-center justify-center">
                        <span className="text-blue-700 text-xs font-bold">
                          {token}
                        </span>
                      </div>

                      <div>
                        <p className="text-sm font-medium text-slate-800">
                          {name}
                        </p>

                        <p className="text-xs text-slate-400">
                          {q.appointmentId?.appointmentType}
                        </p>
                      </div>
                    </div>

                    <LiveQueueBadge status={q.status} />
                  </div>
                );
              })
            )}

            {allEntries.length > INITIAL_QUEUE_COUNT && (
              <div className="pt-3 flex justify-center">
                <button
                  onClick={() => setShowAllQueue((prev) => !prev)}
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                  {showAllQueue ? "Show Less" : "Show More"}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Notifications */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
            <h3 className="text-[15px] font-bold text-slate-900">
              Notifications
            </h3>
          </div>
          <div className="p-4 space-y-4">
            {notifications.length === 0 ? (
              <>
                <NotificationItem
                  icon="appointment"
                  title="Appointment Reminder"
                  message="3 appointments scheduled for tomorrow"
                  time="5m ago"
                />
                <NotificationItem
                  icon="payment"
                  title="Payment Pending"
                  message="3 patients have unpaid bills"
                  time="1h ago"
                />
                <NotificationItem
                  icon="cancel"
                  title="Cancellation"
                  message="Patient cancelled appointment"
                  time="2h ago"
                />
              </>
            ) : (
              notifications
                .slice(0, 4)
                .map((n, i) => (
                  <NotificationItem
                    key={i}
                    icon={n.type}
                    title={n.title}
                    message={n.message}
                    time={n.time}
                  />
                ))
            )}
          </div>
        </div>
      </div>
    </>
  );
};

const NotificationItem = ({ icon, title, message, time }) => (
  <div className="flex items-start gap-3">
    <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center shrink-0 mt-0.5">
      <NotificationIcon type={icon} />
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-sm font-medium text-slate-800">{title}</p>
      <p className="text-xs text-slate-400 truncate">{message}</p>
    </div>
    <span className="text-[11px] text-slate-400 whitespace-nowrap">{time}</span>
  </div>
);

export default Reception_Dashboard;
