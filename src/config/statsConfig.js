import {
  LuClock,
  LuStethoscope,
  LuCircleCheck,
} from "react-icons/lu";

import { TbUsers } from "react-icons/tb";

export const STATS_CONFIG = [
  {
    key: "total",
    label: "Today's Appointments",
    subtitle: "Active queue list",
    icon: TbUsers,
    iconBg: "bg-blue-100",
    iconColor: "text-blue-500",
  },
  {
    key: "scheduled",
    label: "Waiting",
    subtitle: "Not yet called",
    icon: LuClock,
    iconBg: "bg-yellow-100",
    iconColor: "text-yellow-500",
  },
  {
    key: "withDoctor",
    label: "With Doctor",
    subtitle: "In consultation",
    icon: LuStethoscope,
    iconBg: "bg-teal-100",
    iconColor: "text-teal-500",
  },
  {
    key: "completed",
    label: "Completed",
    subtitle: "Done today",
    icon: LuCircleCheck,
    iconBg: "bg-green-100",
    iconColor: "text-green-500",
  },
];
