
import { useState, useEffect } from "react";


import { useParams } from "react-router-dom";

import {apiRequest} from "../utils/apiClient"

export const usePatientDetails = () => {
    const { _id } = useParams();
    const [patientDetails, setPatientDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [trigger, setTrigger] = useState(0); 

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const res = await apiRequest(`/doctors/patients/${_id}`);
                const data = await res.json();
                if (!data.success) { setError(data.message); return; }
                setPatientDetails(data.data);
            } catch (err) {
                setError(`Something went wrong: ${err.message}`);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [_id, trigger]); 

    const refetch = () => setTrigger(t => t + 1); 

    return { patientDetails, loading, error, refetch };
};