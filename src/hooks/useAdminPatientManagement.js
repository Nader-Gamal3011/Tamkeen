import { useState, useEffect, useCallback } from "react";
import { apiRequest } from "../utils/apiClient";

export const useAdminPatientManagement = () => {
    const [patients, setPatients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalCount, setTotalCount] = useState(0);

    const fetchPatients = useCallback(async () => {
        setLoading(true);
        setError("");
        try {
            const params = new URLSearchParams();
            if (search) params.append("search", search);
            params.append("page", page);
            params.append("limit", 10);

            const res = await apiRequest(`/admin/patients`);
            const result = await res.json();
            if (!result.success) { setError(result.message); return; }
            setPatients(result.data || []);
            setTotalPages(result.pagination?.totalPages || 1);
            setTotalCount(result.pagination?.total || 0);
        } catch (err) {
            setError(`Something went wrong: ${err.message}`);
        } finally {
            setLoading(false);
        }
    }, [search, page]);

    useEffect(() => { fetchPatients(); }, [fetchPatients]);

    const getPatientById = async (id) => {
        try {
            const res = await apiRequest(`/admin/patients/${id}`);
            const result = await res.json();
            if (!result.success) return { success: false, message: result.message };
            return { success: true, data: result.data };
        } catch (err) { return { success: false, message: err.message }; }
    };

    const updatePatient = async (id, data) => {
        try {
            const res = await apiRequest(`/admin/patients/${id}`, {
                method: "PUT",
                body: JSON.stringify(data),
            });
            const result = await res.json();
            if (!result.success) return { success: false, message: result.message };
            fetchPatients();
            return { success: true, data: result.data };
        } catch (err) { return { success: false, message: err.message }; }
    };

    return {
        patients, loading, error,
        search, setSearch,
        page, setPage, totalPages, totalCount,
        getPatientById, updatePatient,
        refetch: fetchPatients,
    };
};