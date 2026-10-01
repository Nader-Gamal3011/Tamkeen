import { useEffect, useState } from "react";
import { apiRequest } from "../utils/apiClient";

import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "../styles/calendar.css";

const CalendarComponent = () => {
  const [schedule, setSchedule] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const daysMap = {
    Sun: 0,
    Mon: 1,
    Tue: 2,
    Wed: 3,
    Thu: 4,
    Fri: 5,
    Sat: 6,
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await apiRequest("/doctors/me/schedule");
        const result = await res.json();

        if (!result.success) {
          setError(result.message);
          return;
        }

        setSchedule(result.data);
      } catch (err) {
        setError(`Something went wrong ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);
  const availableDays = schedule.map((item) => daysMap[item.day]);
  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }
  return (
    <div className="mt-3">
      <Calendar
        tileClassName={({ date }) => {
          if (availableDays.includes(date.getDay())) {
            return "available-day";
          }
        }}
      />
    </div>
  );
};

export default CalendarComponent;
