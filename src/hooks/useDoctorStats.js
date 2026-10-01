import { useState, useEffect } from "react";
import { apiRequest } from "../utils/apiClient";

export const useDoctorStats = () => {
    const [data, setData] = useState({
        total: 0,
        completed: 0,
        withDoctor: 0,
        waiting: 0,
        queued: 0,
    });

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await apiRequest("/doctors/appointments/today");
                const result = await res.json();

                if (!result.success) {
                    setError(result.message);
                    return;
                }

                setData(result.data);
            } catch (err) {
                setError(`Something went wrong ${err.message}`);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    return { data, loading, error };
};