import { useState, useEffect } from "react";
import { apiRequest } from "../utils/apiClient";

export const useAdminDoctorsSchedule = () => {
    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const fetchSchedule = async () => {
        setLoading(true);
        setError("");
        try {
            const res = await apiRequest("/admin/doctors/schedule");
            const result = await res.json();
            if (!result.success) { setError(result.message); return; }
            setDoctors(result.data || []);
        } catch (err) {
            setError(`Something went wrong: ${err.message}`);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchSchedule(); }, []);

    return { doctors, loading, error, refetch: fetchSchedule };
};