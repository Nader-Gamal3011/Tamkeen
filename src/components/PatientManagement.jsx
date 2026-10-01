const getInitials = (name = "") =>
  name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

const PatientManagement = ({ tableData }) => {
  const STATUS_CONFIG = {
    completed: { action: "View" },
    waiting: { action: "Start" },
    scheduled: { action: "Start" },
    withDoctor: { action: "Continue" },
    canceled: { action: "Start" },
  };
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      {/* Table Header */}
      <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
        <h2 className="text-[18px] font-bold text-slate-900">
          Patient Appointments
        </h2>
        <div className="flex items-center gap-1.5">
          <p className="text-[13px] text-slate-500">Today</p>
          <span className="text-[13px] font-medium text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-full">
            {tableData.length} total
          </span>
        </div>
      </div>
      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 border-b border-slate-50">
              {["Patient", "Type", "Time", "Status", "Action"].map(
                (ele, index) => (
                  <th
                    key={index}
                    className="text-left text-[12px] text-slate-800 font-bold px-6 py-3 uppercase">
                    {ele}
                  </th>
                ),
              )}
            </tr>
          </thead>
          {/* Body */}
          <tbody>
            {tableData.map((data, index) => (
              <tr key={index} className="border-b border-slate-100">
                <td className="px-6 py-3 text-left">
                  <div className="flex items-center gap-2">
                    <div className="w-9 h-9 rounded-full bg-amber-500 flex items-center justify-center">
                      <span className="text-white font-semibold text-sm">
                        {getInitials(data.name)}
                      </span>
                    </div>

                    <div>
                      <p className="text-slate-800">{data.name}</p>
                      <p className="text-sm text-slate-500">{data.patientId}</p>
                    </div>
                  </div>
                </td>

                <td className="px-6 py-3 text-sm text-slate-700">
                  {data.type}
                </td>

                <td className="px-6 py-3 text-sm  text-blue-600">
                  {data.time}
                </td>

                <td className="px-6 py-3">
                  <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                    {data.status}
                  </span>
                </td>

                {/* Action */}
                <td className="px-6 py-3">
                  <button className="text-sm font-medium text-blue-600 hover:text-blue-700">
                    {STATUS_CONFIG[data.status]?.action}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PatientManagement;
