// hooks/useReceptionistPatientDetails.js
import { useState, useEffect, useCallback } from "react";
import { apiRequest } from "../utils/apiClient";

export const useReceptionistPatientDetails = (id) => {
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchPatient = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    setError("");
    try {
      const res = await apiRequest(`/receptionist/patients/${id}`);
      const result = await res.json();

      if (!result.success) {
        setError(result.message);
        return;
      }

      setPatient(result.data);
    } catch (err) {
      setError(`Something went wrong: ${err.message}`);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchPatient();
  }, [fetchPatient]);

  return { patient, loading, error, refetch: fetchPatient };
};