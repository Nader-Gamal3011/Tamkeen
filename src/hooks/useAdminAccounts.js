import { useState, useEffect, useCallback } from "react";
import { apiRequest } from "../utils/apiClient";

export const useAdminAccounts = () => {
    const [pendingAccounts, setPendingAccounts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalCount, setTotalCount] = useState(0);

    const fetchPending = useCallback(async () => {
        setLoading(true);
        setError("");
        try {
            const params = new URLSearchParams();
            params.append("page", page);
            params.append("limit", 10);
            const res = await apiRequest(`/admin/pending-accounts?${params.toString()}`);
            const result = await res.json();
            if (!result.success) { setError(result.message); return; }
            setPendingAccounts(result.data || []);
            setTotalPages(result.pagination?.totalPages || 1);
            setTotalCount(result.pagination?.total || 0);
        } catch (err) {
            setError(`Something went wrong: ${err.message}`);
        } finally {
            setLoading(false);
        }
    }, [page]);

    useEffect(() => { fetchPending(); }, [fetchPending]);

    const approveAccount = async (id) => {
        try {
            const res = await apiRequest(`/admin/accounts/${id}/approve`, { method: "PATCH" });
            const result = await res.json();
            if (!result.success) return { success: false, message: result.message };
            fetchPending();
            return { success: true };
        } catch (err) { return { success: false, message: err.message }; }
    };

    const rejectAccount = async (id) => {
        try {
            const res = await apiRequest(`/admin/accounts/${id}/reject`, { method: "PATCH" });
            const result = await res.json();
            if (!result.success) return { success: false, message: result.message };
            fetchPending();
            return { success: true };
        } catch (err) { return { success: false, message: err.message }; }
    };

    return {
        pendingAccounts, loading, error,
        page, setPage, totalPages, totalCount,
        approveAccount, rejectAccount,
        refetch: fetchPending,
    };
};