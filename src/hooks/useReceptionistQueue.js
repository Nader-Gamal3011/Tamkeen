// hooks/useReceptionistQueue.js
import { useState, useEffect, useCallback } from "react";
import { apiRequest } from "../utils/apiClient";

export const useReceptionistQueue = () => {
    const [queues, setQueues] = useState([]); // raw response: array of queue docs (all doctors) OR single doctor's entries
    const [selectedDoctorId, setSelectedDoctorId] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const fetchQueue = useCallback(async () => {
        setLoading(true);
        setError("");
        try {
            const url = selectedDoctorId
                ? `/receptionist/queue/${selectedDoctorId}`
                : `/receptionist/queue`;

            const res = await apiRequest(url);
            const result = await res.json();

            if (!result.success) {
                setError(result.message);
                return;
            }

            // getQueueAll -> array of { doctorId, entries: [...] }
            // getQueueByDoctor -> array of entries directly
            if (selectedDoctorId) {
                // normalize to same shape as "all doctors" so the UI can treat both uniformly
                setQueues(
                    result.data?.length
                        ? [{ doctorId: null, entries: result.data }]
                        : []
                );
            } else {
                setQueues(result.data || []);
            }
        } catch (err) {
            setError(`Something went wrong: ${err.message}`);
        } finally {
            setLoading(false);
        }
    }, [selectedDoctorId]);

    useEffect(() => {
        fetchQueue();
    }, [fetchQueue]);

    const checkinPatient = async (appointmentId) => {
        try {
            const res = await apiRequest(`/receptionist/queue/${appointmentId}/checkin`, {
                method: "PATCH",
            });
            const result = await res.json();
            if (!result.success) return { success: false, message: result.message };
            fetchQueue();
            return { success: true, data: result.data };
        } catch (err) {
            return { success: false, message: err.message };
        }
    };

    const advanceStatus = async (appointmentId) => {
        try {
            const res = await apiRequest(`/receptionist/queue/${appointmentId}/status`, {
                method: "PATCH",
            });
            const result = await res.json();
            if (!result.success) return { success: false, message: result.message };
            fetchQueue();
            return { success: true, data: result.data };
        } catch (err) {
            return { success: false, message: err.message };
        }
    };

    return {
        queues,
        selectedDoctorId,
        setSelectedDoctorId,
        loading,
        error,
        checkinPatient,
        advanceStatus,
        refetch: fetchQueue,
    };
};