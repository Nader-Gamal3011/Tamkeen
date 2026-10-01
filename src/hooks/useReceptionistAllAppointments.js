// hooks/useReceptionistAppointments.js
import { useState, useEffect, useCallback } from "react";
import { apiRequest } from "../utils/apiClient";

export const useReceptionistAllAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState({ status: "", date: "" });
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const fetchAppointments = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const params = new URLSearchParams();
      if (filters.status) params.append("status", filters.status);
      if (filters.date) params.append("date", filters.date);
      params.append("page", page);
      params.append("limit", 10);

      const res = await apiRequest(`/receptionist/appointments?${params.toString()}`);
      const result = await res.json();

      if (!result.success) {
        setError(result.message);
        return;
      }

      setAppointments(result.data || []);
      setTotalPages(result.pagination?.totalPages || 1);
      setTotalCount(result.pagination?.total || 0);
    } catch (err) {
      setError(`Something went wrong: ${err.message}`);
    } finally {
      setLoading(false);
    }
  }, [filters, page]);

  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments]);

  const bookAppointment = async (data) => {
    try {
      const res = await apiRequest("/receptionist/appointments", {
        method: "POST",
        body: JSON.stringify(data),
      });
      const result = await res.json();
      if (!result.success) return { success: false, message: result.message };
      fetchAppointments();
      return { success: true, data: result.data };
    } catch (err) {
      return { success: false, message: err.message };
    }
  };

  const updateAppointment = async (id, data) => {
    try {
      const res = await apiRequest(`/receptionist/appointments/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
      });
      const result = await res.json();
      if (!result.success) return { success: false, message: result.message };
      fetchAppointments();
      return { success: true, data: result.data };
    } catch (err) {
      return { success: false, message: err.message };
    }
  };

  const cancelAppointment = async (id) => {
    try {
      const res = await apiRequest(`/receptionist/appointments/${id}/cancel`, {
        method: "PATCH",
      });
      const result = await res.json();
      if (!result.success) return { success: false, message: result.message };
      fetchAppointments();
      return { success: true, data: result.data };
    } catch (err) {
      return { success: false, message: err.message };
    }
  };

  return {
    appointments,
    loading,
    error,
    search,
    setSearch,
    filters,
    setFilters,
    page,
    setPage,
    totalPages,
    totalCount,
    bookAppointment,
    updateAppointment,
    cancelAppointment,
    refetch: fetchAppointments,
  };
};