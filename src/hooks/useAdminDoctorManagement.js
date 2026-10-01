import { useState, useEffect, useCallback } from "react";
import { apiRequest } from "../utils/apiClient";

export const useAdminDoctorManagement = () => {
    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalCount, setTotalCount] = useState(0);

    const fetchDoctors = useCallback(async () => {
        setLoading(true);
        setError("");
        try {
            const params = new URLSearchParams();
            if (search) params.append("search", search);
            params.append("page", page);
            params.append("limit", 10);

            const res = await apiRequest(`/doctors?${params.toString()}`);
            const result = await res.json();
            if (!result.success) { setError(result.message); return; }
            setDoctors(result.data || []);
            setTotalPages(result.pagination?.totalPages || 1);
            setTotalCount(result.pagination?.total || 0);
        } catch (err) {
            setError(`Something went wrong: ${err.message}`);
        } finally {
            setLoading(false);
        }
    }, [search, page]);

    useEffect(() => { fetchDoctors(); }, [fetchDoctors]);

    const getDoctorById = async (id) => {
        try {
            const res = await apiRequest(`/admin/doctors/${id}`);
            const result = await res.json();
            if (!result.success) return { success: false, message: result.message };
            return { success: true, data: result.data };
        } catch (err) { return { success: false, message: err.message }; }
    };

    const updateDoctor = async (id, data) => {
        try {
            const res = await apiRequest(`/admin/doctors/${id}`, {
                method: "PUT",
                body: JSON.stringify(data),
            });
            const result = await res.json();
            if (!result.success) return { success: false, message: result.message };
            fetchDoctors();
            return { success: true, data: result.data };
        } catch (err) { return { success: false, message: err.message }; }
    };

    return {
        doctors, loading, error,
        search, setSearch,
        page, setPage, totalPages, totalCount,
        getDoctorById, updateDoctor,
        refetch: fetchDoctors,
    };
};