import { useEffect, useState } from "react";
import { apiRequest } from "../utils/apiClient";

export const useReceptionistAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const res = await apiRequest("/receptionist/today");
        const result = await res.json();

        if (result.success) {
          const flattenedAppointments = Object.entries(result.data)
            .flatMap(([doctorName, appointments]) =>
              appointments.map((appointment) => ({
                ...appointment,
                doctorName,
              }))
            );

          setAppointments(flattenedAppointments);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  return { appointments, loading };
};