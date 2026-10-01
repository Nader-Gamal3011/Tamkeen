import { useState } from "react";
import { apiRequest } from "../utils/apiClient";

export const useUpdatePatientNotes = (patientId, refetch) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const normalizeError = (err) => {
    if (!err) return "Something went wrong";
    if (typeof err === "string") return err;
    return err?.message || "Something went wrong";
  };

  const addPatientNote = async ({ note, type, timestamp } = {}) => {
    try {
      setLoading(true);
      setError("");

      const payload = {
        note,
        type,
        timestamp,
      };

      const res = await apiRequest(`/doctors/patients/${patientId}/notes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!data.success) {
        setError(data.message || "Failed to add note");
        return false;
      }

      await refetch?.();
      return true;
    } catch (err) {
      setError(normalizeError(err));
      return false;
    } finally {
      setLoading(false);
    }
  };

  const updatePatientNote = async ({ noteId, note, type, timestamp } = {}) => {
    try {
      setLoading(true);
      setError("");

      const payload = {
        note,
        type,
        timestamp,
      };

      const res = await apiRequest(
        `/doctors/patients/${patientId}/notes/${noteId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      const data = await res.json();
      if (!data.success) {
        setError(data.message || "Failed to update note");
        return false;
      }

      await refetch?.();
      return true;
    } catch (err) {
      setError(normalizeError(err));
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    addPatientNote,
    updatePatientNote,
    loading,
    error,
  };
};

