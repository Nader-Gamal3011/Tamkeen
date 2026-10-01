import { useEffect, useMemo, useState } from "react";
import { apiRequest } from "../utils/apiClient";

import {
  LuCalendarClock,
  LuCircleCheck,
  LuMapPin,
  LuPhone,
  LuStethoscope,
} from "react-icons/lu";
import { MdEmail } from "react-icons/md";

const daysOrder = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function StatCard({ label, value, subtitle, icon: Icon, iconBg, iconColor }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 flex items-start justify-between flex-1 min-w-0">
      <div className="flex flex-col gap-1.5">
        <p className="text-[14px] font-medium text-slate-500">{label}</p>
        <p className="text-[28px] font-bold text-slate-900 leading-none">
          {value}
        </p>
        {subtitle ? (
          <p className="text-[13px] text-slate-400">{subtitle}</p>
        ) : null}
      </div>

      <div
        className={`w-11 h-11 rounded-full ${iconBg} flex items-center justify-center shrink-0`}>
        {Icon ? <Icon size={20} className={iconColor} /> : null}
      </div>
    </div>
  );
}

export default function DoctorSetting() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await apiRequest("/doctors/me");
        const data = await res.json();
        if (!data.success) {
          setError(data.message || "Failed to load profile");
          return;
        }
        setProfile(data.data);
      } catch (e) {
        setError(e?.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const maxPerDay = useMemo(() => {
    const mm = profile?.maxAppointmentsPerDay;
    if (!mm) return { min: "—", max: "—" };
    return { min: mm.min ?? "—", max: mm.max ?? "—" };
  }, [profile]);

  const scheduleRows = useMemo(() => {
    const schedule = profile?.schedule || [];
    const map = new Map(schedule.map((s) => [s.day, s]));
    return daysOrder
      .filter((d) => map.has(d))
      .map((d) => {
        const s = map.get(d);
        return { day: d, ...s };
      });
  }, [profile]);

  if (loading) return <p className="px-7 py-5">Loading...</p>;
  if (error)
    return (
      <div className="px-7 py-5">
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl">
          {error}
        </div>
      </div>
    );

  if (!profile)
    return (
      <div className="px-7 py-5">
        <p className="text-slate-600">No profile data.</p>
      </div>
    );

  const user = profile.userId;

  return (
    <div className="p-6 bg-slate-50 min-h-screen">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-5 px-2">
        <div>
          <h1 className="text-[24px] font-bold text-slate-900">
            Doctor Settings
          </h1>
          <p className="text-[14px] text-slate-500 mt-1">
            Manage your profile, availability & performance overview
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span
            className={`text-[12px] font-medium px-3 py-1 rounded-full border ${
              profile.status === "available"
                ? "bg-green-50 text-green-700 border-green-200"
                : "bg-slate-100 text-slate-600 border-slate-200"
            }`}>
            {profile.status || "—"}
          </span>
        </div>
      </div>

      {/* Top stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 px-2">
        <StatCard
          label="Appointments / Day"
          value={`${maxPerDay.min} - ${maxPerDay.max}`}
          subtitle="Your daily capacity"
          icon={LuCalendarClock}
          iconBg="bg-blue-100"
          iconColor="text-blue-500"
        />
        <StatCard
          label="Specialty"
          value={profile.specialty || "—"}
          subtitle={
            profile.department?.name
              ? `Department: ${profile.department.name}`
              : "—"
          }
          icon={LuStethoscope}
          iconBg="bg-teal-100"
          iconColor="text-teal-500"
        />
        <StatCard
          label="Performance"
          value={profile.performanceScore ?? "—"}
          subtitle="Score"
          icon={LuCircleCheck}
          iconBg="bg-green-100"
          iconColor="text-green-500"
        />
        <StatCard
          label="Satisfaction"
          value={profile.patientSatisfaction ?? "—"}
          subtitle="Patient rating"
          icon={LuCircleCheck}
          iconBg="bg-pink-100"
          iconColor="text-pink-500"
        />
      </div>

      {/* Profile + Schedule */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-4 px-2">
        {/* Profile card */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-teal-400 to-blue-500 flex items-center justify-center shrink-0">
                <span className="text-white text-[22px] font-semibold">
                  {(user?.fullName || "")
                    .trim()
                    .split(/\s+/)
                    .filter(Boolean)
                    .map((w) => w[0])
                    .join("")
                    .slice(0, 2)
                    .toUpperCase()}
                </span>
              </div>
              <div className="min-w-0">
                <h2 className="text-[18px] font-bold text-slate-900 truncate">
                  {user?.fullName || "—"}
                </h2>
                <p className="text-[13px] text-slate-500 mt-1">
                  Doctor ID: {profile.doctorId || "—"}
                </p>
                <p className="text-[13px] text-slate-500 mt-1">
                  Room: {profile.roomNumber || "—"}
                </p>
              </div>
            </div>

            <div className="mt-5 space-y-3">
              <div className="flex items-center gap-3 text-slate-700">
                <MdEmail className="text-[18px] text-blue-500" />
                <span className="text-[13px]">{user?.email || "—"}</span>
              </div>
              <div className="flex items-center gap-3 text-slate-700">
                <LuPhone className="text-[18px] text-blue-500" />
                <span className="text-[13px]">{user?.phone || "—"}</span>
              </div>
              <div className="flex items-center gap-3 text-slate-700">
                <LuMapPin className="text-[18px] text-blue-500" />
                <span className="text-[13px]">
                  {user?.address || profile?.department?.name || "—"}
                </span>
              </div>

              <div className="pt-3 border-t border-slate-100">
                <h3 className="text-[14px] font-semibold text-slate-800">
                  About
                </h3>
                <p className="text-[13px] text-slate-600 mt-1 leading-6">
                  {profile.about || "—"}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 grid grid-cols-2 gap-3">
                <div>
                  <p className="text-[11px] uppercase text-slate-400 font-medium">
                    Experience
                  </p>
                  <p className="text-[14px] font-semibold text-slate-800 mt-1">
                    {profile.experience ?? "—"} years
                  </p>
                </div>
                <div>
                  <p className="text-[11px] uppercase text-slate-400 font-medium">
                    Work Type
                  </p>
                  <p className="text-[14px] font-semibold text-slate-800 mt-1">
                    {profile.workType || "—"}
                  </p>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100">
                <p className="text-[11px] uppercase text-slate-400 font-medium">
                  Medical License
                </p>
                <p className="text-[14px] font-semibold text-slate-800 mt-1">
                  {profile.medicalLicenseNumber || "—"}
                </p>
                <p className="text-[13px] text-slate-600 mt-1">
                  Exp:{" "}
                  {profile.licenseExpiryDate
                    ? new Date(profile.licenseExpiryDate).toLocaleDateString()
                    : "—"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Schedule card */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <div className="flex items-center justify-between gap-3 mb-4">
              <div className="flex items-center gap-3">
                <LuCalendarClock className="text-blue-600" size={18} />
                <h3 className="text-[18px] font-bold text-slate-900">
                  Availability Schedule
                </h3>
              </div>
              <span className="text-[12px] font-medium text-slate-500">
                Days you are accepting appointments
              </span>
            </div>

            {scheduleRows.length === 0 ? (
              <div className="py-10 text-center">
                <p className="text-slate-400 text-[14px]">No schedule found.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-100">
                      {["Day", "Start", "End", "Slots (approx)"].map((h) => (
                        <th
                          key={h}
                          className="text-left text-[12px] text-slate-800 font-bold px-6 py-3 uppercase">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {scheduleRows.map((row) => (
                      <tr
                        key={row._id || row.day}
                        className="border-b border-slate-100 hover:bg-slate-50 transition">
                        <td className="px-6 py-4 text-sm font-medium text-slate-800">
                          {row.day}
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-700">
                          {row.startTime || "—"}
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-700">
                          {row.endTime || "—"}
                        </td>
                        <td className="px-6 py-4 text-sm text-blue-600">
                          {maxPerDay.min}-{maxPerDay.max}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-5">
              <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                <p className="text-[11px] uppercase text-slate-400 font-medium">
                  Total Appointments
                </p>
                <p className="text-[18px] font-bold text-slate-900 mt-1">
                  {profile.totalAppointments ?? "—"}
                </p>
              </div>
              <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                <p className="text-[11px] uppercase text-slate-400 font-medium">
                  Total Patients
                </p>
                <p className="text-[18px] font-bold text-slate-900 mt-1">
                  {profile.totalPatients ?? "—"}
                </p>
              </div>
              <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                <p className="text-[11px] uppercase text-slate-400 font-medium">
                  Efficiency
                </p>
                <p className="text-[18px] font-bold text-slate-900 mt-1">
                  {profile.appointmentEfficiency ?? "—"}
                </p>
              </div>
            </div>

            <div className="mt-6 text-[13px] text-slate-500">
              Note: This page is read-only for now (no update endpoints were
              provided).
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
