// hooks/useBookingRequests.js
import { useState, useEffect, useCallback } from "react";
import { apiRequest } from "../utils/apiClient";

export const useBookingRequests = () => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalCount, setTotalCount] = useState(0);

    const fetchRequests = useCallback(async () => {
        setLoading(true);
        setError("");
        try {
            const params = new URLSearchParams();
            params.append("page", page);
            params.append("limit", 10);

            const res = await apiRequest(`/receptionist/booking-requests?${params.toString()}`);
            const result = await res.json();

            if (!result.success) {
                setError(result.message);
                return;
            }

            setRequests(result.data || []);
            setTotalPages(result.pagination?.totalPages || 1);
            setTotalCount(result.pagination?.total || 0);
        } catch (err) {
            setError(`Something went wrong: ${err.message}`);
        } finally {
            setLoading(false);
        }
    }, [page]);

    useEffect(() => {
        fetchRequests();
    }, [fetchRequests]);

    const approveRequest = async (id, data) => {
        try {
            const res = await apiRequest(
                `/receptionist/booking-requests/${id}/approve`,
                {
                    method: "PATCH",
                    body: JSON.stringify(data),
                }
            );
            const result = await res.json();
            if (!result.success) return { success: false, message: result.message };
            fetchRequests();
            return { success: true };
        } catch (err) {
            return { success: false, message: err.message };
        }
    };

    const rejectRequest = async (id, reason) => {
        try {
            const res = await apiRequest(
                `/receptionist/booking-requests/${id}/reject`,
                {
                    method: "PATCH",
                    body: JSON.stringify({ reason }),
                }
            );
            const result = await res.json();
            if (!result.success) return { success: false, message: result.message };
            fetchRequests();
            return { success: true };
        } catch (err) {
            return { success: false, message: err.message };
        }
    };

    return {
        requests,
        loading,
        error,
        page,
        setPage,
        totalPages,
        totalCount,
        approveRequest,
        rejectRequest,
        refetch: fetchRequests,
    };
};