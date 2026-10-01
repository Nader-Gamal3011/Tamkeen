import { useAdminActivity } from "../../hooks/useAdminActivity";
import {
  LuChevronLeft,
  LuChevronRight,
  LuRefreshCw,
  LuActivity,
  LuFileText,
} from "react-icons/lu";

const ROLE_BADGE = {
  admin: "bg-red-100 text-red-700",
  doctor: "bg-blue-100 text-blue-700",
  receptionist: "bg-purple-100 text-purple-700",
  patient: "bg-green-100 text-green-700",
};

const Admin_ActivityReports = () => {
  const {
    logs,
    loading,
    error,
    page,
    setPage,
    totalPages,
    totalCount,
    activeTab,
    setActiveTab,
    refetch,
  } = useAdminActivity();

  return (
    <div className="px-7 py-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-[18px] font-bold text-slate-900">
          Activity & Reports
        </h2>
        <button
          onClick={refetch}
          className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm text-slate-600 hover:bg-slate-50">
          <LuRefreshCw size={15} />
          Refresh
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => {
            setActiveTab("activity");
            setPage(1);
          }}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-colors ${
            activeTab === "activity"
              ? "bg-blue-600 text-white"
              : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
          }`}>
          <LuActivity size={15} />
          Activity Log
        </button>
        <button
          onClick={() => {
            setActiveTab("reports");
            setPage(1);
          }}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-colors ${
            activeTab === "reports"
              ? "bg-blue-600 text-white"
              : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
          }`}>
          <LuFileText size={15} />
          System Reports
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="px-6 py-12 text-center text-slate-400">
            Loading...
          </div>
        ) : error ? (
          <div className="px-6 py-12 text-center text-red-500">{error}</div>
        ) : logs.length === 0 ? (
          <div className="px-6 py-16 text-center">
            <LuActivity size={36} className="text-slate-300 mx-auto mb-3" />
            <p className="text-slate-400 text-sm">No logs found</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {logs.map((log, index) => {
              const performedBy = log.performedBy?.fullName || "System";
              const role = log.performedBy?.role || log.role || "";
              const timestamp = log.timestamp
                ? new Date(log.timestamp).toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                : "—";

              return (
                <div
                  key={log._id || index}
                  className="flex items-start gap-4 px-6 py-4 hover:bg-slate-50/50 transition-colors">
                  <div className="w-2 h-2 rounded-full bg-blue-500 mt-2 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-slate-700">{log.action}</p>
                    <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                      <span className="text-xs text-slate-400">
                        {performedBy}
                      </span>
                      {role && (
                        <span
                          className={`px-2 py-0.5 rounded-full text-[11px] font-medium ${ROLE_BADGE[role] || "bg-slate-100 text-slate-600"}`}>
                          {role}
                        </span>
                      )}
                      <span className="text-xs text-slate-400">
                        {timestamp}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100">
            <p className="text-sm text-slate-500">
              {totalCount} total logs — Page {page} of {totalPages}
            </p>
            <div className="flex items-center gap-1">
              <button
                disabled={page <= 1}
                onClick={() => setPage((p) => p - 1)}
                className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 text-slate-500 disabled:opacity-40 hover:bg-slate-50">
                <LuChevronLeft size={16} />
              </button>
              <button
                disabled={page >= totalPages}
                onClick={() => setPage((p) => p + 1)}
                className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 text-slate-500 disabled:opacity-40 hover:bg-slate-50">
                <LuChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin_ActivityReports;
