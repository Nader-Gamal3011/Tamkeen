import { useState } from "react";
import { apiRequest } from "../utils/apiClient";

export const useUpdateVitals = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const updateVitals = async (patientId, vitalsData) => {
        try {
            setLoading(true);
            setError("");

            const response = await apiRequest(
                `/doctors/patients/${patientId}/vitals`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(vitalsData),
                }
            );

            const data = await response.json();

            if (!data.success) {
                throw new Error(data.message || "Failed to update vitals");
            }

            return data;
        } catch (err) {
            setError(err.message || "Something went wrong");
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return {
        updateVitals,
        loading,
        error,
    };
};