import { LuCalendarDays, LuUsers, LuClipboardList } from "react-icons/lu";

export const RECEPTION_STATS_CONFIG = [
  {
    key: "todayAppointments",
    label: "Today's Appointments",
    subtitleKey: "completedToday",
    subtitleTemplate: (val) => `${val} completed today`,
    icon: LuCalendarDays,
    iconBg: "bg-blue-100",
    iconColor: "text-blue-500",
  },
  {
    key: "totalPatients",
    label: "Total Patients",
    subtitle: "Active patient records",
    icon: LuUsers,
    iconBg: "bg-green-100",
    iconColor: "text-green-500",
  },
  {
    key: "inQueue",
    label: "In Queue",
    subtitle: "Patients currently waiting",
    icon: LuClipboardList,
    iconBg: "bg-orange-100",
    iconColor: "text-orange-500",
  },
];
