// pages/reception/Reception_QueueManagement.jsx
import { useState, useEffect, useMemo } from "react";
import { useReceptionistQueue } from "../../hooks/useReceptionistQueue";
import { apiRequest } from "../../utils/apiClient";
import { LuSearch, LuRefreshCw } from "react-icons/lu";

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

// ✅ matches real backend queue entry / appointment status values
const STATUS_BADGE = {
  waiting: {
    label: "Waiting",
    dot: "bg-amber-500",
    className: "text-amber-700 bg-amber-50",
  },
  withDoctor: {
    label: "With Doctor",
    dot: "bg-purple-500",
    className: "text-purple-700 bg-purple-50",
  },
  completed: {
    label: "Done",
    dot: "bg-green-500",
    className: "text-green-700 bg-green-50",
  },
};

const formatTime = (t) => t || "—";

const Reception_QueueManagement = () => {
  const {
    queues,
    selectedDoctorId,
    setSelectedDoctorId,
    loading,
    error,
    advanceStatus,
    refetch,
  } = useReceptionistQueue();

  const [doctors, setDoctors] = useState([]);
  const [search, setSearch] = useState("");
  const [actionLoadingId, setActionLoadingId] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    const loadDoctors = async () => {
      try {
        const res = await apiRequest("/doctors?limit=100");
        const data = await res.json();
        if (data.success) setDoctors(data.data || []);
      } catch (err) {
        console.error("Failed to load doctors:", err);
      }
    };
    loadDoctors();
  }, []);

  // flatten all entries from all doctor-queues into a single list for the table
  const allEntries = useMemo(() => {
    const flat = [];
    queues.forEach((q) => {
      (q.entries || []).forEach((entry) => {
        flat.push({ ...entry, _doctorFromQueue: q.doctorId });
      });
    });
    return flat;
  }, [queues]);

  const visibleEntries = useMemo(() => {
    if (!search.trim()) return allEntries;
    const q = search.trim().toLowerCase();
    return allEntries.filter((e) => {
      const name = e.patientId?.userId?.fullName?.toLowerCase() || "";
      const code = e.patientId?.patientId?.toLowerCase() || "";
      return name.includes(q) || code.includes(q);
    });
  }, [allEntries, search]);

  const counts = useMemo(() => {
    const c = { waiting: 0, withDoctor: 0, completed: 0 };
    allEntries.forEach((e) => {
      if (c[e.status] !== undefined) c[e.status]++;
    });
    return c;
  }, [allEntries]);

  const grouped = useMemo(() => {
    const g = { waiting: [], withDoctor: [], completed: [] };
    visibleEntries.forEach((e) => {
      if (g[e.status]) g[e.status].push(e);
    });
    return g;
  }, [visibleEntries]);

  const handleAdvance = async (entry) => {
    const apptId = entry.appointmentId?._id;
    if (!apptId) return;
    setActionLoadingId(apptId);
    await advanceStatus(apptId);
    setActionLoadingId(null);
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  return (
    <div className="px-7 py-4">
      {/* Top Bar */}
      <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
        <div className="flex items-center gap-2">
          <h2 className="text-[18px] font-bold text-slate-900">
            Queue Management
          </h2>
          <span className="inline-flex items-center gap-1 text-xs font-medium text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
            Live
          </span>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center bg-gray-50 border border-slate-200 h-9 px-3 rounded-lg">
            <LuSearch className="text-gray-400 mr-2" size={16} />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search patient or token..."
              className="bg-transparent outline-none text-sm placeholder:text-gray-400 w-48"
            />
          </div>

          <select
            value={selectedDoctorId}
            onChange={(e) => setSelectedDoctorId(e.target.value)}
            className="h-9 px-3 bg-white border border-slate-200 rounded-lg text-sm text-slate-600 cursor-pointer">
            <option value="">All Doctors</option>
            {doctors.map((d) => (
              <option key={d._id} value={d._id}>
                {d.userId?.fullName}
              </option>
            ))}
          </select>

          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="h-9 px-3 flex items-center gap-1.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-600 hover:bg-slate-50 disabled:opacity-50">
            <LuRefreshCw
              size={14}
              className={refreshing ? "animate-spin" : ""}
            />
            Refresh
          </button>
        </div>
      </div>

      {/* Table Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="px-6 py-12 text-center text-slate-400">
            Loading queue...
          </div>
        ) : error ? (
          <div className="px-6 py-12 text-center text-red-500">{error}</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[950px]">
              <thead>
                <tr className="bg-gray-50 border-b border-slate-50">
                  {["Patient", "Doctor", "Appointment", "Status", "Action"].map(
                    (h) => (
                      <th
                        key={h}
                        className="text-left text-[12px] text-slate-800 font-bold px-4 py-3 uppercase whitespace-nowrap">
                        {h}
                      </th>
                    ),
                  )}
                </tr>
              </thead>
              <tbody>
                {visibleEntries.length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-6 py-12 text-center text-slate-400 text-sm">
                      No patients in queue
                    </td>
                  </tr>
                ) : (
                  visibleEntries.map((entry, index) => {
                    const patientName =
                      entry.patientId?.userId?.fullName || "Unknown";
                    const patientCode = entry.patientId?.patientId || "-";
                    const doctorName =
                      entry._doctorFromQueue?.userId?.fullName ||
                      doctors.find((d) => d._id === selectedDoctorId)?.userId
                        ?.fullName ||
                      "-";
                    const doctorSpec = entry._doctorFromQueue?.specialty || "";
                    const apptTime = entry.appointmentId?.startTime;
                    const status = entry.status || "waiting";
                    const statusConfig = STATUS_BADGE[status] || {
                      label: status,
                      dot: "bg-slate-400",
                      className: "text-slate-700 bg-slate-100",
                    };
                    const apptId = entry.appointmentId?._id;
                    const isLoadingThis = actionLoadingId === apptId;

                    return (
                      <tr
                        key={entry._id || index}
                        className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <div
                              className={`w-9 h-9 rounded-full ${getAvatarColor(patientName)} flex items-center justify-center shrink-0`}>
                              <span className="text-white font-semibold text-xs">
                                {getInitials(patientName)}
                              </span>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-slate-800">
                                {patientName}
                              </p>
                              <p className="text-xs text-slate-400">
                                #{patientCode}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <p className="text-sm text-slate-700">{doctorName}</p>
                          {doctorSpec && (
                            <p className="text-xs text-slate-400">
                              {doctorSpec}
                            </p>
                          )}
                        </td>
                        <td className="px-4 py-3 text-sm text-blue-600 font-medium">
                          {formatTime(apptTime)}
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${statusConfig.className}`}>
                            <span
                              className={`w-1.5 h-1.5 rounded-full ${statusConfig.dot}`}
                            />
                            {statusConfig.label}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          {status === "completed" ? (
                            <span className="text-xs text-slate-300">
                              No action
                            </span>
                          ) : (
                            <button
                              onClick={() => handleAdvance(entry)}
                              disabled={isLoadingThis}
                              className="text-sm font-medium text-blue-600 hover:text-blue-700 disabled:opacity-50 inline-flex items-center gap-1">
                              {isLoadingThis
                                ? "..."
                                : status === "waiting"
                                  ? "Send to Doctor →"
                                  : "Mark Done →"}
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        )}

        {!loading && !error && (
          <div className="px-6 py-3 border-t border-slate-100 text-xs text-slate-500">
            {allEntries.length} patients in queue — {counts.waiting} waiting,{" "}
            {counts.withDoctor} with doctor, {counts.completed} done
          </div>
        )}
      </div>

      {/* Status Columns */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
        {/* Waiting */}
        <div className="bg-amber-50/40 border border-amber-100 rounded-2xl p-4">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-semibold text-slate-800">Waiting</p>
            <span className="text-xs font-medium text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full">
              {grouped.waiting.length}
            </span>
          </div>
          <div className="space-y-2">
            {grouped.waiting.length === 0 ? (
              <p className="text-xs text-slate-400 text-center py-4">
                No patients waiting
              </p>
            ) : (
              grouped.waiting.map((e) => (
                <div
                  key={e._id}
                  className="bg-white rounded-xl px-3 py-2 flex items-center gap-2 border border-slate-100">
                  <div
                    className={`w-7 h-7 rounded-full ${getAvatarColor(e.patientId?.userId?.fullName)} flex items-center justify-center shrink-0`}>
                    <span className="text-white font-semibold text-[10px]">
                      {getInitials(e.patientId?.userId?.fullName)}
                    </span>
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-medium text-slate-800 truncate">
                      {e.patientId?.userId?.fullName}
                    </p>
                    <p className="text-[11px] text-slate-400">
                      {e.appointmentId?.appointmentId} •{" "}
                      {formatTime(e.appointmentId?.startTime)}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* With Doctor */}
        <div className="bg-purple-50/40 border border-purple-100 rounded-2xl p-4">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-semibold text-slate-800">With Doctor</p>
            <span className="text-xs font-medium text-purple-700 bg-purple-100 px-2 py-0.5 rounded-full">
              {grouped.withDoctor.length}
            </span>
          </div>
          <div className="space-y-2">
            {grouped.withDoctor.length === 0 ? (
              <p className="text-xs text-slate-400 text-center py-4">
                No patients with doctor
              </p>
            ) : (
              grouped.withDoctor.map((e) => (
                <div
                  key={e._id}
                  className="bg-white rounded-xl px-3 py-2 flex items-center gap-2 border border-slate-100">
                  <div
                    className={`w-7 h-7 rounded-full ${getAvatarColor(e.patientId?.userId?.fullName)} flex items-center justify-center shrink-0`}>
                    <span className="text-white font-semibold text-[10px]">
                      {getInitials(e.patientId?.userId?.fullName)}
                    </span>
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-medium text-slate-800 truncate">
                      {e.patientId?.userId?.fullName}
                    </p>
                    <p className="text-[11px] text-slate-400">
                      {e.appointmentId?.appointmentId} •{" "}
                      {formatTime(e.appointmentId?.startTime)}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Done */}
        <div className="bg-green-50/40 border border-green-100 rounded-2xl p-4">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-semibold text-slate-800">Done</p>
            <span className="text-xs font-medium text-green-700 bg-green-100 px-2 py-0.5 rounded-full">
              {grouped.completed.length}
            </span>
          </div>
          <div className="space-y-2">
            {grouped.completed.length === 0 ? (
              <p className="text-xs text-slate-400 text-center py-4">
                No completed visits yet
              </p>
            ) : (
              grouped.completed.map((e) => (
                <div
                  key={e._id}
                  className="bg-white rounded-xl px-3 py-2 flex items-center gap-2 border border-slate-100">
                  <div
                    className={`w-7 h-7 rounded-full ${getAvatarColor(e.patientId?.userId?.fullName)} flex items-center justify-center shrink-0`}>
                    <span className="text-white font-semibold text-[10px]">
                      {getInitials(e.patientId?.userId?.fullName)}
                    </span>
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-medium text-slate-800 truncate">
                      {e.patientId?.userId?.fullName}
                    </p>
                    <p className="text-[11px] text-slate-400">
                      {e.appointmentId?.appointmentId} •{" "}
                      {formatTime(e.appointmentId?.startTime)}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reception_QueueManagement;
