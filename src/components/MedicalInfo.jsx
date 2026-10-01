import { ClipboardPlus, ShieldAlert } from "lucide-react";


const MedicalInfo = ({ data }) => {
  const conditions = data?.conditions || [];
  const allergies = data?.allergies || [];

  return (
    <div className="">
      {/* Header */}
      <div className="flex items-center justify-between gap-2 mb-5">
        <div className="flex items-center gap-4">
          <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center">
            <ClipboardPlus className="w-5 h-5 text-blue-600" />
          </div>

          <h2 className="text-[22px] font-semibold text-slate-900">
            Medical Info
          </h2>
        </div>
      </div>

      {/* Content */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Conditions */}
        <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100 min-h-[180px]">
          <div className="flex items-center gap-2 mb-5">
            <ClipboardPlus className="w-5 h-5 text-blue-600" />

            <h3 className="text-[18px] font-semibold text-slate-900">
              Conditions
            </h3>
          </div>

          {conditions.length > 0 ? (
            <div className="space-y-4">
              {conditions.map((condition) => (
                <div key={condition._id} className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-blue-600 mt-2" />

                  <div>
                    <p className="text-[17px] font-semibold text-slate-900">
                      {condition.name}
                    </p>

                    <p className="text-[15px] text-slate-500 mt-1">
                      {condition.detail}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-slate-400 text-sm">No conditions recorded</p>
          )}
        </div>

        {/* Allergies */}
        <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100 min-h-[180px]">
          <div className="flex items-center gap-2 mb-5">
            <ShieldAlert className="w-5 h-5 text-blue-600" />

            <h3 className="text-[18px] font-semibold text-slate-900">
              Allergies
            </h3>
          </div>

          {allergies.length > 0 ? (
            <div className="space-y-3">
              {allergies.map((allergy, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-red-500" />

                  <p className="text-[15px] text-slate-700">{allergy}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="h-full flex items-center justify-center">
              <p className="text-[15px] text-slate-400">
                No allergies recorded
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MedicalInfo;
