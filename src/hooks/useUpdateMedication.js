import { useState } from "react";
import { apiRequest } from "../utils/apiClient";



export const useUpdateMedication = (patientId, refetch) => {


    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    // ── Add Medication ─────────────────────────
    const addMedication = async (medicationData) => {
        try {
            setLoading(true);
            setError("");

            const res = await apiRequest(
                `/doctors/patients/${patientId}/medications`,
                {
                    method: "POST", headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(medicationData),
                }
            );

            const data = await res.json();

            if (!data.success) {
                setError(data.message || "Failed to add medication");
                return false;
            }

            await refetch();;
            return true;
        } catch (err) {
            setError(err.message);
            return false;
        } finally {
            setLoading(false);
        }
    };

    // ── Update Medication ──────────────────────
    const updateMedication = async (medId, updateData) => {
        try {
            setLoading(true);
            setError("");
            const res = await apiRequest(
                `/doctors/patients/${patientId}/medications/${medId}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(updateData),
                }
            );
            const data = await res.json();
            if (!data.success) {
                setError(data.message || "Failed to update medication");
                return false;
            }
            await refetch();
            return true;
        } catch (err) {
            setError(err.message);
            return false;
        } finally {
            setLoading(false);
        }
    };

    // ── Toggle Status ───────────────────────────
    const toggleStatus = async (medId, currentStatus) => {
        const newStatus = currentStatus === "active" ? "discontinued" : "active";
        return updateMedication(medId, { status: newStatus });
    };

    return {
        addMedication,
        updateMedication,
        toggleStatus,
        loading,
        error,
    };
};