import { useEffect, useState } from "react";
import { apiRequest } from "../utils/apiClient";

export const useLiveQueue = () => {
  const [liveQueue, setLiveQueue] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const res = await apiRequest("/receptionist/queue");
        const result = await res.json();

        if (result.success) {
          setLiveQueue(result.data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  return { liveQueue, loading };
};