import { useMemo, useState } from "react";
import {
  LuFileText,
  LuFileUp,
  LuShieldCheck,
  LuPlus,
  LuUpload,
  LuX,
} from "react-icons/lu";

const HealthReports = ({ data = [], patientId, refetch }) => {
  const reports = Array.isArray(data) ? data : [];
  const [isExpanded, setIsExpanded] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const displayedReports = useMemo(() => {
    if (isExpanded) return reports;
    return reports.slice(0, 3);
  }, [isExpanded, reports]);

  const formatDate = (d) => {
    if (!d) return "—";
    const dt = new Date(d);
    if (Number.isNaN(dt.getTime())) return "—";
    return dt.toLocaleString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // ✅ الـ fix هنا
  const getFileName = (r) => {
    if (r?.title) return r.title;
    const url = r?.fileUrl;
    if (!url) return "Report";
    return url.split("/").pop().split("?")[0];
  };

  const handleUpload = async () => {
    if (!file || !title.trim()) return;
    setLoading(true);
    setError("");
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("title", title);

      const token = localStorage.getItem("accessToken");
      const res = await fetch(
        `https://tamkeen-backend-production.up.railway.app/api/doctors/patients/${patientId}/health-reports`,
        // https://tamkeen-backend-production.up.railway.app/api
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        }
      );
      const data = await res.json();
      if (!data.success) throw new Error(data.message);
      setShowUploadModal(false);
      setFile(null);
      setTitle("");
      refetch();
    } catch (err) {
      setError(err.message || "Upload failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between gap-3 mb-5">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center">
            <LuShieldCheck className="w-5 h-5 text-blue-600" />
          </div>
          <h2 className="text-[22px] font-semibold text-slate-900">
            Health Reports
          </h2>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[12px] font-medium text-blue-600 bg-blue-50 px-3 py-1.5 rounded-xl">
            {reports.length} reports
          </span>

          <button
            type="button"
            onClick={() => setShowUploadModal(true)}
            className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-blue-600 text-white text-sm hover:bg-blue-700">
            <LuUpload size={15} />
            Upload
          </button>

          <button
            onClick={() => setIsExpanded((v) => !v)}
            className="hidden sm:inline-flex items-center gap-2 text-[12px] font-medium text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 px-3 py-1.5 rounded-xl"
            type="button">
            {isExpanded ? "Show Less" : "Show All"}
          </button>
        </div>
      </div>

      {reports.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-10 text-slate-400">
          <LuFileUp size={34} />
          <p className="text-[13px] mt-3">No health reports uploaded</p>
          <button
            type="button"
            onClick={() => setShowUploadModal(true)}
            className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 text-white">
            <LuPlus />
            Upload First Report
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {displayedReports.map((r) => {
            const url = r?.fileUrl ?? r?.url ?? r?.link ?? "";
            const filename = getFileName(r);
            const uploadedAt = r?.uploadedAt ?? r?.createdAt ?? null;
            const uploadedBy = typeof r?.uploadedBy === "object"
              ? r?.uploadedBy?.fullName
              : null;

            return (
              <div
                key={r?._id ?? `${filename}-${uploadedAt}`}
                className="border border-slate-100 bg-slate-50 rounded-2xl p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-[12px] uppercase tracking-wide text-slate-400 font-medium">
                      {filename}
                    </p>
                    {uploadedBy && (
                      <p className="text-[12px] text-slate-400 mt-0.5">
                        {uploadedBy}
                      </p>
                    )}
                    <p className="text-[13px] text-slate-600 mt-1">
                      {uploadedAt ? formatDate(uploadedAt) : "—"}
                    </p>
                  </div>

                  <div className="flex flex-col gap-2 shrink-0">
                    {url ? (
                      <a
                        href={url.includes('.') ? url : `${url}.pdf`}
                        target="_blank"
                        rel="noreferrer"
                        className="w-10 h-10 rounded-xl border border-blue-100 bg-white flex items-center justify-center text-blue-600 hover:bg-blue-50 transition"
                        title="Open report">
                        <LuFileText size={18} />
                      </a>
                    ) : (
                      <div className="w-10 h-10 rounded-xl border border-slate-200 bg-white opacity-50 flex items-center justify-center">
                        <LuFileText size={18} />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}

          {!isExpanded && reports.length > 3 && (
            <div className="flex items-center justify-center pt-2">
              <button
                onClick={() => setIsExpanded(true)}
                className="inline-flex items-center gap-2 text-[12px] font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-100 px-4 py-2 rounded-xl"
                type="button">
                <LuPlus size={14} />
                Show more
              </button>
            </div>
          )}
        </div>
      )}

      {/* UPLOAD MODAL */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg p-6">
            <div className="flex justify-between items-center mb-5">
              <h3 className="text-lg font-semibold">Upload Health Report</h3>
              <button onClick={() => setShowUploadModal(false)}>
                <LuX size={20} />
              </button>
            </div>

            {error && (
              <p className="text-sm text-red-600 mb-3">{error}</p>
            )}

            <input
              type="text"
              placeholder="Report title (e.g. Blood Test)"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border rounded-xl p-3 mb-3"
            />

            <input
              type="file"
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={(e) => setFile(e.target.files[0])}
              className="w-full border rounded-xl p-3"
            />

            <div className="flex justify-end gap-2 mt-5">
              <button
                onClick={() => setShowUploadModal(false)}
                className="px-4 py-2 border rounded-xl">
                Cancel
              </button>
              <button
                disabled={loading || !file || !title.trim()}
                onClick={handleUpload}
                className="px-4 py-2 bg-blue-600 text-white rounded-xl disabled:opacity-50">
                {loading ? "Uploading..." : "Upload"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HealthReports;