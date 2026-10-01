import { FaPersonCirclePlus } from "react-icons/fa6";

const EmergencyContact = ({ data }) => {
  // console.log(emergencyContactProps);

  return (
    <div className="flex-1 min-w-0">
      <div className="head flex items-center justify-between border-b border-slate-200 pb-3">
        <div className="flex items-center gap-4">
          <FaPersonCirclePlus size={25} className="text-blue-400" />
          <h2 className="font-semibold text-[18px]">Emergency Contact</h2>
        </div>
      </div>
      <div className="info">
        <div className="name flex items-center gap-30 my-4">
          <p className="text-[14px] font-medium">Name</p>
          <h3 className="text-[16px] font-semibold">{data?.name || "undefined"}</h3>
        </div>
        <div className="phone flex items-center gap-30 my-4">
          <p className="text-[14px] font-medium">phone</p>
          <h3 className="text-[16px] font-semibold">{data?.phone || "undefined"}</h3>
        </div>
        <div className="relation flex items-center gap-30 my-4">
          <p className="text-[14px] font-medium">Relation</p>
          <h3 className="text-[16px] font-semibold">{data?.relation || "undefined" }</h3>
        </div>
      </div>
    </div>
  );
};

export default EmergencyContact;
