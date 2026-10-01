import { useState, useEffect } from "react";
import { apiRequest } from "../utils/apiClient";

export const useAllAppointments = () => {
    const [allappointment, setData] = useState([]);

    const [appointmentLoading, setLoading] = useState(true);
    const [appointmentError, setError] = useState("");

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await apiRequest("/doctors/appointments");
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

    return { allappointment, appointmentLoading, appointmentError };
};