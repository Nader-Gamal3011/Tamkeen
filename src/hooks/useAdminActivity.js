import { useState, useEffect, useCallback } from "react";
import { apiRequest } from "../utils/apiClient";

export const useAdminActivity = () => {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalCount, setTotalCount] = useState(0);
    const [activeTab, setActiveTab] = useState("activity"); // "activity" | "reports"

    const fetchLogs = useCallback(async () => {
        setLoading(true);
        setError("");
        try {
            const endpoint = activeTab === "activity"
                ? `/admin/activity?page=${page}&limit=20`
                : `/admin/reports?page=${page}&limit=20`;

            const res = await apiRequest(endpoint);
            const result = await res.json();
            if (!result.success) { setError(result.message); return; }
            setLogs(result.data || []);
            setTotalPages(result.pagination?.totalPages || 1);
            setTotalCount(result.pagination?.total || 0);
        } catch (err) {
            setError(`Something went wrong: ${err.message}`);
        } finally {
            setLoading(false);
        }
    }, [activeTab, page]);

    useEffect(() => { fetchLogs(); }, [fetchLogs]);

    return {
        logs, loading, error,
        page, setPage, totalPages, totalCount,
        activeTab, setActiveTab,
        refetch: fetchLogs,
    };
};