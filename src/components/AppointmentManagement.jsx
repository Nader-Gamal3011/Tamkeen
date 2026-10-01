import { useMemo, useState } from "react";

import { Link } from "react-router-dom";

import { FiSearch, FiChevronLeft, FiChevronRight } from "react-icons/fi";

const getInitials = (name = "") =>
  name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

const getAvatarColor = (name = "") => {
  const colors = [
    "bg-red-500",
    "bg-blue-500",
    "bg-green-500",
    "bg-purple-500",
    "bg-pink-500",
    "bg-orange-500",
    "bg-cyan-500",
    "bg-indigo-500",
    "bg-teal-500",
    "bg-amber-500",
  ];

  const index =
    name.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0) %
    colors.length;

  return colors[index];
};

const STATUS_CONFIG = {
  completed: {
    action: "View",
    style: "bg-green-100 text-green-700",
  },

  scheduled: {
    action: "View",
    style: "bg-blue-100 text-blue-700",
  },

  waiting: {
    action: "View",
    style: "bg-yellow-100 text-yellow-700",
  },

  inTreatment: {
    action: "View",
    style: "bg-purple-100 text-purple-700",
  },

  canceled: {
    action: "",
    style: "bg-red-100 text-red-700",
  },
};

const AppointmentManagement = ({ appointments = [] }) => {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(1);

  const ITEMS_PER_PAGE = 5;

  // Filter + Search
  const filteredAppointments = useMemo(() => {
    return appointments.filter((appointment) => {
      const patientName =
        appointment?.patientId?.userId?.fullName?.toLowerCase() || "";

      const appointmentId = appointment?.appointmentId?.toLowerCase() || "";

      const matchesSearch =
        patientName.includes(search.toLowerCase()) ||
        appointmentId.includes(search.toLowerCase());

      const matchesStatus =
        statusFilter === "all" ? true : appointment.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [appointments, search, statusFilter]);

  // Pagination
  const totalPages = Math.ceil(filteredAppointments.length / ITEMS_PER_PAGE);

  const paginatedAppointments = filteredAppointments.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE,
  );

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 px-6 py-5 border-b border-slate-100">
        <div>
          <h2 className="text-[18px] font-bold text-slate-900">
            Patient Appointments
          </h2>

          <p className="text-sm text-slate-500 mt-1">
            Manage all today appointments
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          {/* Search */}
          <div className="relative">
            <FiSearch
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              type="text"
              placeholder="Search patient..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="w-full sm:w-[240px] pl-9 pr-4 py-2 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-blue-100 text-sm"
            />
          </div>

          {/* Filter */}
          <div className="relative">
            <FiChevronLeft
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setPage(1);
              }}
              className="pl-9 pr-8 py-2 rounded-xl border border-slate-200 text-sm outline-none focus:ring-2 focus:ring-blue-100 appearance-none bg-white">
              <option value="all">All Status</option>
              <option value="scheduled">Scheduled</option>
              <option value="completed">Completed</option>
              <option value="waiting">Waiting</option>
              <option value="inTreatment">In Treatment</option>
              <option value="canceled">Canceled</option>
            </select>
          </div>
        </div>
      </div>

      {/* Desktop Table */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-100">
              {[
                "Patient",
                "Appointment ID",
                "Type",
                "Time",
                "Queue",
                "Status",
                "Action",
              ].map((item) => (
                <th
                  key={item}
                  className="text-left text-[12px] text-slate-800 font-bold px-6 py-3 uppercase">
                  {item}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {paginatedAppointments.map((appointment) => {
              const patientName =
                appointment?.patientId?.userId?.fullName || "Unknown";

              const patientCode = appointment?.patientId?.patientId;

              const statusConfig = STATUS_CONFIG[appointment.status] || {};

              return (
                <tr
                  key={appointment._id}
                  className="border-b border-slate-100 hover:bg-slate-50 transition">
                  {/* Patient */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center ${getAvatarColor(
                          patientName,
                        )}`}>
                        <span className="text-white font-semibold text-sm">
                          {getInitials(patientName)}
                        </span>
                      </div>

                      <div>
                        <p className="text-sm font-medium text-slate-800">
                          {patientName}
                        </p>

                        <p className="text-xs text-slate-500">{patientCode}</p>
                      </div>
                    </div>
                  </td>

                  {/* Appointment ID */}
                  <td className="px-6 py-4 text-sm text-slate-700">
                    {appointment.appointmentId}
                  </td>

                  {/* Type */}
                  <td className="px-6 py-4 text-sm text-slate-700 capitalize">
                    {appointment.appointmentType}
                  </td>

                  {/* Time */}
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-blue-600">
                        {appointment.startTime} - {appointment.endTime}
                      </span>

                      <span className="text-xs text-slate-500">
                        {new Date(appointment.date).toLocaleDateString()}
                      </span>
                    </div>
                  </td>

                  {/* Queue */}
                  <td className="px-6 py-4 text-sm text-slate-700">
                    #{appointment.queueNumber}
                  </td>

                  {/* Status */}
                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${statusConfig.style}`}>
                      {appointment.status}
                    </span>
                  </td>

                  {/* Action */}
                  <td className="px-6 py-4">
                    <Link
                      to={`/doctor/patients/${appointment.patientId._id}`}
                      className="text-sm font-medium text-blue-600 hover:text-blue-700 transition">
                      {statusConfig.action}
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100">
        <p className="text-sm text-slate-500">
          Showing{" "}
          <span className="font-medium text-slate-700">
            {paginatedAppointments.length}
          </span>{" "}
          of{" "}
          <span className="font-medium text-slate-700">
            {filteredAppointments.length}
          </span>
        </p>

        <div className="flex items-center gap-2">
          <button
            disabled={page === 1}
            onClick={() => setPage((prev) => prev - 1)}
            className="w-9 h-9 rounded-xl border border-slate-200 flex items-center justify-center disabled:opacity-40">
            <FiChevronLeft size={18} />
          </button>

          <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center text-sm font-medium">
            {page}
          </div>

          <button
            disabled={page === totalPages || totalPages === 0}
            onClick={() => setPage((prev) => prev + 1)}
            className="w-9 h-9 rounded-xl border border-slate-200 flex items-center justify-center disabled:opacity-40">
            <FiChevronRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AppointmentManagement;
