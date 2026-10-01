import { useState, useEffect } from "react";
import { apiRequest } from "../utils/apiClient";

export const useReceptionistStats = () => {
  const [data, setData] = useState({
    todayAppointments: 0,
    completedToday: 0,
    inQueue: 0,
    totalPatients: 0,
    pendingBills: 0,
    todayRevenue: 0,
    withDoctor: 0,
    cancelledToday: 0,
    currentlyAdmitted: 0,
    appointments: [],
    queue: [],
    notifications: [],
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await apiRequest("/receptionist/stats");
        const result = await res.json();

        if (!result.success) {
          setError(result.message);
          return;
        }

        setData(result.data);
      } catch (err) {
        setError(`Something went wrong: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { data, loading, error };
};
