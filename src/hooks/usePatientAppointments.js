import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { apiRequest } from "../utils/apiClient";

export const usePatientAppointments = () => {
    const { _id } = useParams();

    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [trigger, setTrigger] = useState(0);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                setError("");

                const res = await apiRequest(`/doctors/patients/${_id}/appointments`);
                const result = await res.json();

                if (!result.success) {
                    setError(result.message);
                    return;
                }

                setAppointments(result.data ?? []);
            } catch (err) {
                setError(`Something went wrong: ${err.message}`);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [_id, trigger]);

    const refetch = () => setTrigger((t) => t + 1);

    return { appointments, loading, error, refetch };
};

