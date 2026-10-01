// pages/Admin/Admin_Dashboard.jsx
import { useMemo } from "react";
import { useAdminStats } from "../../hooks/useAdminStats";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  LuUsers,
  LuCalendarDays,
  LuStethoscope,
  LuBanknote,
  LuRefreshCw,
} from "react-icons/lu";

// ── palette ─────────────────────────────────────────────────────────
const BLUE = "#3B82F6";
const INDIGO = "#6366F1";
const GREEN = "#10B981";
const AMBER = "#F59E0B";
const RED = "#EF4444";
const PURPLE = "#8B5CF6";

const DEPT_COLORS = [BLUE, INDIGO, GREEN, AMBER, RED, PURPLE];
const AGE_COLORS = [BLUE, GREEN, AMBER];

const MONTH_NAMES = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];
const DAY_NAMES = {
  1: "Sun",
  2: "Mon",
  3: "Tue",
  4: "Wed",
  5: "Thu",
  6: "Fri",
  7: "Sat",
};
const TYPE_LABELS = {
  consultation: "Consultation",
  followUp: "Follow-up",
  surgery: "Surgery",
  telemedicine: "Telemedicine",
};

// ── tiny helpers ────────────────────────────────────────────────────
const StatCard = ({ icon: Icon, label, value, sub, color = "blue" }) => {
  const colors = {
    blue: "bg-blue-50 text-blue-600",
    green: "bg-green-50 text-green-600",
    amber: "bg-amber-50 text-amber-600",
    purple: "bg-purple-50 text-purple-600",
  };
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 flex items-center gap-4">
      <div
        className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${colors[color]}`}>
        <Icon size={22} />
      </div>
      <div>
        <p className="text-xs text-slate-400 font-medium">{label}</p>
        <p className="text-2xl font-bold text-slate-900">{value ?? "—"}</p>
        {sub && <p className="text-xs text-slate-400 mt-0.5">{sub}</p>}
      </div>
    </div>
  );
};

const SectionCard = ({ title, children, action }) => (
  <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
    <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
      <h3 className="text-[15px] font-bold text-slate-900">{title}</h3>
      {action}
    </div>
    <div className="p-5">{children}</div>
  </div>
);

// ── custom tooltip ───────────────────────────────────────────────────
const ChartTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-lg px-4 py-3 text-sm">
      <p className="font-semibold text-slate-800 mb-1">{label}</p>
      {payload.map((p) => (
        <p key={p.name} style={{ color: p.color }}>
          {p.name}:{" "}
          <span className="font-medium">{p.value?.toLocaleString()}</span>
        </p>
      ))}
    </div>
  );
};

// ── main component ───────────────────────────────────────────────────
const Admin_Dashboard = () => {
  const {
    overview,
    patientsByAge,
    patientsByDept,
    revenue,
    appointments,
    doctorsSchedule,
    loading,
    error,
    revenueYear,
    setRevenueYear,
    refetch,
  } = useAdminStats();

  // ── revenue chart data ───────────────────────────────────────────
  const revenueData = useMemo(
    () =>
      (revenue || []).map((r) => ({
        month: MONTH_NAMES[r.month - 1],
        Income: r.income,
      })),
    [revenue],
  );

  // ── age pie data ─────────────────────────────────────────────────
  const ageData = useMemo(() => {
    if (!patientsByAge) return [];
    return [
      { name: "Children (0-12)", value: patientsByAge.children || 0 },
      { name: "Teens (13-17)", value: patientsByAge.teens || 0 },
      { name: "Adults (18+)", value: patientsByAge.adults || 0 },
    ].filter((d) => d.value > 0);
  }, [patientsByAge]);

  // ── dept bar data ────────────────────────────────────────────────
  const deptData = useMemo(
    () =>
      (patientsByDept || []).map((d) => ({
        name: d.department,
        Patients: d.patientCount,
        pct: d.percentage,
      })),
    [patientsByDept],
  );

  // ── appointment type pie ─────────────────────────────────────────
  const apptTypeData = useMemo(
    () =>
      (appointments?.byType || []).map((t) => ({
        name: TYPE_LABELS[t._id] || t._id,
        value: t.count,
      })),
    [appointments],
  );

  // ── appointment by day bar ───────────────────────────────────────
  const apptDayData = useMemo(
    () =>
      (appointments?.byDay || []).map((d) => ({
        day: DAY_NAMES[d._id] || d._id,
        Appointments: d.count,
      })),
    [appointments],
  );

  if (loading)
    return (
      <div className="px-7 py-4 flex items-center justify-center min-h-[60vh]">
        <p className="text-slate-400">Loading dashboard...</p>
      </div>
    );

  if (error)
    return (
      <div className="px-7 py-4">
        <p className="text-red-500">{error}</p>
      </div>
    );

  return (
    <div className="px-7 py-4 space-y-6">
      {/* ── Header ───────────────────────────────────────────────── */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[22px] font-bold text-slate-900">Dashboard</h1>
          <p className="text-sm text-slate-400 mt-0.5">
            System overview & analytics
          </p>
        </div>
        <button
          onClick={refetch}
          className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm text-slate-600 hover:bg-slate-50 transition-colors">
          <LuRefreshCw size={15} />
          Refresh
        </button>
      </div>

      {/* ── Overview Cards ───────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard
          icon={LuUsers}
          label="Total Patients"
          color="blue"
          value={overview?.totalPatients?.toLocaleString()}
        />
        <StatCard
          icon={LuStethoscope}
          label="Total Doctors"
          color="purple"
          value={overview?.totalDoctors?.toLocaleString()}
        />
        <StatCard
          icon={LuCalendarDays}
          label="Total Appointments"
          color="amber"
          value={overview?.totalAppointments?.toLocaleString()}
        />
        <StatCard
          icon={LuBanknote}
          label="Total Revenue"
          color="green"
          value={`EGP ${overview?.totalRevenue?.toLocaleString() ?? "0"}`}
          sub="Paid invoices"
        />
      </div>

      {/* ── Doctors Schedule + Age ────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Doctors availability */}
        <SectionCard title="Doctors Availability">
          {doctorsSchedule ? (
            <div className="space-y-3">
              {[
                {
                  label: "Total Doctors",
                  value: doctorsSchedule.total,
                  color: "bg-slate-200",
                },
                {
                  label: "Available",
                  value: doctorsSchedule.available,
                  color: "bg-green-500",
                },
                {
                  label: "Unavailable",
                  value: doctorsSchedule.unavailable,
                  color: "bg-red-400",
                },
              ].map(({ label, value, color }) => {
                const pct = doctorsSchedule.total
                  ? Math.round((value / doctorsSchedule.total) * 100)
                  : 0;
                return (
                  <div key={label}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-slate-600">{label}</span>
                      <span className="text-sm font-bold text-slate-800">
                        {value}
                      </span>
                    </div>
                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${color} transition-all`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-sm text-slate-400 text-center py-4">No data</p>
          )}
        </SectionCard>

        {/* Patients by Age */}
        <SectionCard title="Patients by Age">
          {ageData.length > 0 ? (
            <div className="flex flex-col items-center">
              <ResponsiveContainer width="100%" height={180}>
                <PieChart>
                  <Pie
                    data={ageData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={70}
                    innerRadius={40}>
                    {ageData.map((_, i) => (
                      <Cell key={i} fill={AGE_COLORS[i % AGE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(v, n) => [`${v} patients`, n]} />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex flex-wrap gap-3 justify-center mt-2">
                {ageData.map((d, i) => (
                  <div
                    key={d.name}
                    className="flex items-center gap-1.5 text-xs text-slate-600">
                    <span
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ background: AGE_COLORS[i] }}
                    />
                    {d.name}
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <p className="text-sm text-slate-400 text-center py-8">No data</p>
          )}
        </SectionCard>

        {/* Appointment Types */}
        <SectionCard title="Appointment Types">
          {apptTypeData.length > 0 ? (
            <div className="flex flex-col items-center">
              <ResponsiveContainer width="100%" height={180}>
                <PieChart>
                  <Pie
                    data={apptTypeData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={70}
                    innerRadius={40}>
                    {apptTypeData.map((_, i) => (
                      <Cell
                        key={i}
                        fill={DEPT_COLORS[i % DEPT_COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip formatter={(v, n) => [`${v}`, n]} />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex flex-wrap gap-3 justify-center mt-2">
                {apptTypeData.map((d, i) => (
                  <div
                    key={d.name}
                    className="flex items-center gap-1.5 text-xs text-slate-600">
                    <span
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ background: DEPT_COLORS[i] }}
                    />
                    {d.name}
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <p className="text-sm text-slate-400 text-center py-8">No data</p>
          )}
        </SectionCard>
      </div>

      {/* ── Revenue Chart ─────────────────────────────────────────── */}
      <SectionCard
        title={`Monthly Revenue — ${revenueYear}`}
        action={
          <div className="flex items-center gap-2">
            <button
              onClick={() => setRevenueYear((y) => y - 1)}
              className="w-7 h-7 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 flex items-center justify-center text-sm">
              ‹
            </button>
            <span className="text-sm font-medium text-slate-700">
              {revenueYear}
            </span>
            <button
              onClick={() => setRevenueYear((y) => y + 1)}
              disabled={revenueYear >= new Date().getFullYear()}
              className="w-7 h-7 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 flex items-center justify-center text-sm disabled:opacity-40">
              ›
            </button>
          </div>
        }>
        {revenueData.length > 0 ? (
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart
              data={revenueData}
              margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="incomeGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={BLUE} stopOpacity={0.15} />
                  <stop offset="95%" stopColor={BLUE} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis
                dataKey="month"
                tick={{ fontSize: 12, fill: "#94A3B8" }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 12, fill: "#94A3B8" }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`}
              />
              <Tooltip content={<ChartTooltip />} />
              <Area
                type="monotone"
                dataKey="Income"
                stroke={BLUE}
                strokeWidth={2}
                fill="url(#incomeGrad)"
                dot={{ r: 3, fill: BLUE }}
                activeDot={{ r: 5 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-sm text-slate-400 text-center py-8">
            No revenue data for {revenueYear}
          </p>
        )}
      </SectionCard>

      {/* ── Dept + Day Charts ─────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Patients by Department */}
        <SectionCard title="Patients by Department">
          {deptData.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart
                data={deptData}
                margin={{ top: 5, right: 10, left: 0, bottom: 30 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 11, fill: "#94A3B8" }}
                  angle={-25}
                  textAnchor="end"
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 11, fill: "#94A3B8" }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip content={<ChartTooltip />} />
                <Bar dataKey="Patients" radius={[6, 6, 0, 0]}>
                  {deptData.map((_, i) => (
                    <Cell key={i} fill={DEPT_COLORS[i % DEPT_COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-sm text-slate-400 text-center py-8">No data</p>
          )}
        </SectionCard>

        {/* Appointments by Day */}
        <SectionCard title="Appointments by Day of Week">
          {apptDayData.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart
                data={apptDayData}
                margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis
                  dataKey="day"
                  tick={{ fontSize: 12, fill: "#94A3B8" }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 12, fill: "#94A3B8" }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip content={<ChartTooltip />} />
                <Bar
                  dataKey="Appointments"
                  fill={INDIGO}
                  radius={[6, 6, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-sm text-slate-400 text-center py-8">No data</p>
          )}
        </SectionCard>
      </div>
    </div>
  );
};

export default Admin_Dashboard;
