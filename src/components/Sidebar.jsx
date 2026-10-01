import { Link, useLocation, useNavigate } from "react-router-dom";

import { logout } from "../utils/auth";

// import icons
import {
  LuActivity,
  LuLayoutDashboard,
  LuUserRound,
  LuCalendarDays,
  LuClipboardList,
  LuLogOut,
  LuClipboardCheck,
  LuClock,
  LuUsers,
  LuUserPlus,
  LuStethoscope,
} from "react-icons/lu";

import { IoIosSettings } from "react-icons/io";

const doctorLinks = [
  { to: "/doctor", icon: LuLayoutDashboard, label: "Dashboard" },
  { to: "/doctor/appointments", icon: LuCalendarDays, label: "Appointments" },
  { to: "/doctor/settings", icon: IoIosSettings, label: "Setting" },
];

const receptionLinks = [
  { to: "/reception", icon: LuLayoutDashboard, label: "Dashboard" },
  { to: "/reception/patients", icon: LuUserRound, label: "Patient Management" },
  { to: "/reception/appoints", icon: LuCalendarDays, label: "Appointments" },
  { to: "/reception/queue", icon: LuClipboardList, label: "Queue Management" },
  {
    to: "/reception/booking-requests",
    icon: LuClipboardCheck,
    label: "Booking Requests",
  },
];

const adminLink = [
  { to: "/admin", icon: LuLayoutDashboard, label: "Dashboard" },
  { to: "/admin/pending-accounts", icon: LuClock, label: "Pending Accounts" },
  { to: "/admin/users", icon: LuUsers, label: "User Management" },
  { to: "/admin/create-staff", icon: LuUserPlus, label: "Create Staff" },
  {
    to: "/admin/doctors-schedule",
    icon: LuCalendarDays,
    label: "Doctors Schedule",
  },
  { to: "/admin/doctors", icon: LuStethoscope, label: "Doctors" },
  { to: "/admin/patients", icon: LuUsers, label: "Patients" },
  { to: "/admin/activity", icon: LuActivity, label: "Activity & Reports" },
];

const NavItem = ({ to, icon: Icon, label }) => {
  const { pathname } = useLocation();


const isRootRoute =
  to === "/admin" ||
  to === "/doctor" ||
  to === "/reception";

const active = isRootRoute
  ? pathname === to
  : pathname === to || pathname.startsWith(`${to}/`);


  return (
    <Link
      to={to}
      className={`flex items-center gap-3 px-4 py-2.5 mx-3 my-1 rounded-xl text-sm font-medium transition-all 
        ${active ? "bg-blue-600 text-white" : "text-gray-700 hover:bg-gray-100"}`}>
      <Icon size={18} />
      {label}
      {active && <span className="ml-auto text-white opacity-80">›</span>}
    </Link>
  );
};

export default function Sidebar() {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));

  const links =
    user?.role === "doctor"
      ? doctorLinks
      : user?.role === "admin"
        ? adminLink
        : receptionLinks;

  const handleLogout = () => {
    navigate("/");
    logout();
  };

  return (
    <div className="w-[280px] h-screen bg-white border-r border-gray-100 flex flex-col sticky top-0 shadow">
      <div className="head flex items-center gap-3 pb-8 border-b border-b-gray-200 px-4 pt-4">
        <div className="icon bg-[#2563EB] p-2 rounded-2xl">
          <LuActivity size={20} color="white" />
        </div>
        <div className="info">
          <h2 className="text-[17px] font-bold text-gray-900 leading-tight mb-1.5">
            Tamkeen
          </h2>
          <p className="text-[10px] font-medium text-gray-400 tracking-widest uppercase">
            RECEPTION PORTAL
          </p>
        </div>
      </div>
      <div className="list">
        <p className="text-[11px] font-semibold text-gray-400 uppercase px-4 py-4">
          main meun
        </p>
      </div>
      {links.map((link) => (
        <NavItem key={link.to} {...link} />
      ))}

      <button
        onClick={handleLogout}
        className="flex items-center gap-3 px-7 py-4 mt-auto text-sm font-medium text-gray-700 hover:text-red-500 hover:bg-gray-50 transition-colors border-t border-gray-100">
        <LuLogOut size={18} />
        Sign Out
      </button>
    </div>
  );
}
