import { useState, useEffect, useCallback } from "react";
import { apiRequest } from "../utils/apiClient";

export const useReceptionistPatients = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState({
    gender: "",
    type: "",
    status: "",
  });
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const fetchPatients = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const params = new URLSearchParams();
      if (search) params.append("search", search);
      if (filters.gender) params.append("gender", filters.gender);
      if (filters.type) params.append("type", filters.type);
      if (filters.status) params.append("status", filters.status);
      params.append("page", page);
      params.append("limit", 10);

      const res = await apiRequest(`/receptionist/patients?${params.toString()}`);
      const result = await res.json();

      if (!result.success) {
        setError(result.message);
        return;
      }

      setPatients(result.data || []);
      setTotalPages(Math.ceil((result.pagination.total || 0) / 10));
      setTotalCount(result.pagination.total || 0);
    } catch (err) {
      setError(`Something went wrong: ${err.message}`);
    } finally {
      setLoading(false);
    }
  }, [search, filters, page]);

  useEffect(() => {
    fetchPatients();
  }, [fetchPatients]);

  const addPatient = async (patientData) => {
    try {
      const res = await apiRequest("/receptionist/patients", {
        method: "POST",
        body: JSON.stringify(patientData),
      });
      const result = await res.json();

      if (!result.success) {
        return { success: false, message: result.message };
      }

      fetchPatients();
      return { success: true, data: result.data };
    } catch (err) {
      return { success: false, message: err.message };
    }
  };

  console.log("page:", page);
  console.log("totalPages:", totalPages);
  console.log("totalCount:", totalCount);

  return {
    patients,
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
    addPatient,
    refetch: fetchPatients,
  };
};
