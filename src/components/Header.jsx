import { LuSearch, LuBell } from "react-icons/lu";
import { IoSettingsOutline } from "react-icons/io5";


import { Link } from "react-router-dom";

const Header = () => {
  const user = JSON.parse(localStorage.getItem("user"));

  const { fullName, role } = user;

  const initials = fullName
    .trim()
    .split(/\s+/)
    .map((word) => word.charAt(0).toUpperCase())
    .join("");

  return (
    <div className="bg-white border-b border-gray-200 flex items-center justify-between px-7 py-3 sticky top-0 z-10">
      <div className="info  flex-1">
        <h3 className="text-[16px] font-bold text-gray-900 leading-tight">
          Dashboard
        </h3>
        <p className="text-[12px] text-gray-500">Wellcome back, {fullName}</p>
      </div>
      <div className="hidden search lg:flex flex-1 items-center bg-[#F3F4F6] h-9 px-4 rounded-full">
        <LuSearch className="text-gray-400 mr-2" />

        <input
          type="search"
          name="search"
          placeholder="Search..."
          className="flex-1 bg-transparent outline-none border-none text-sm placeholder:text-gray-400"
        />
      </div>
      <div className="setting flex items-center justify-end gap-4 flex-1">
        <button className="notification relative w-9 h-9 rounded-full flex items-center justify-center text-gray-700 bg-gray-200 hover:bg-gray-100 transition-colors">
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
          <LuBell size={20} />
        </button>
        <Link to="/doctor/settings">
          <div className="setting relative w-9 h-9 rounded-full flex items-center justify-center text-gray-700 bg-gray-200 hover:bg-gray-100 transition-colors">
            <IoSettingsOutline />
          </div>
        </Link>
        <div className="data flex items-center gap-2">
          <div className="caption w-9 h-9 bg-[#2563EB] rounded-full flex items-center justify-center">
            <p className="text-white text-[13px] font-[600]">{initials}</p>
          </div>
          <div className="name">
            <h3 className="text-[14px] font-semibold text-gray-900 leading-tight">
              {fullName}
            </h3>
            <p className="text-[12px] text-gray-500">{role}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
