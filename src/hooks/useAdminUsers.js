import { useState, useEffect, useCallback } from "react";
import { apiRequest } from "../utils/apiClient";

export const useAdminUsers = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [search, setSearch] = useState("");
    const [filters, setFilters] = useState({ role: "", status: "" });
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalCount, setTotalCount] = useState(0);

    const fetchUsers = useCallback(async () => {
        setLoading(true);
        setError("");
        try {
            const params = new URLSearchParams();
            if (search) params.append("search", search);
            if (filters.role) params.append("role", filters.role);
            if (filters.status) params.append("status", filters.status);
            params.append("page", page);
            params.append("limit", 10);

            const res = await apiRequest(`/admin/users?${params.toString()}`);
            const result = await res.json();
            if (!result.success) { setError(result.message); return; }
            setUsers(result.data || []);
            setTotalPages(result.pagination?.totalPages || 1);
            setTotalCount(result.pagination?.total || 0);
        } catch (err) {
            setError(`Something went wrong: ${err.message}`);
        } finally {
            setLoading(false);
        }
    }, [search, filters, page]);

    useEffect(() => { fetchUsers(); }, [fetchUsers]);

    const updateUser = async (id, data) => {
        try {
            const res = await apiRequest(`/admin/users/${id}`, {
                method: "PUT",
                body: JSON.stringify(data),
            });
            const result = await res.json();
            if (!result.success) return { success: false, message: result.message };
            fetchUsers();
            return { success: true, data: result.data };
        } catch (err) { return { success: false, message: err.message }; }
    };

    const suspendUser = async (id) => {
        try {
            const res = await apiRequest(`/admin/users/${id}`, { method: "DELETE" });
            const result = await res.json();
            if (!result.success) return { success: false, message: result.message };
            fetchUsers();
            return { success: true };
        } catch (err) { return { success: false, message: err.message }; }
    };

    return {
        users, loading, error,
        search, setSearch,
        filters, setFilters,
        page, setPage, totalPages, totalCount,
        updateUser, suspendUser,
        refetch: fetchUsers,
    };
};