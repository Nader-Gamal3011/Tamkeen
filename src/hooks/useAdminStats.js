// hooks/useAdminStats.js
import { useState, useEffect } from "react";
import { apiRequest } from "../utils/apiClient";

export const useAdminStats = () => {
    const [overview, setOverview] = useState(null);
    const [patientsByAge, setPatientsByAge] = useState(null);
    const [patientsByDept, setPatientsByDept] = useState([]);
    const [revenue, setRevenue] = useState([]);
    const [appointments, setAppointments] = useState(null);
    const [doctorsSchedule, setDoctorsSchedule] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [revenueYear, setRevenueYear] = useState(new Date().getFullYear());

    const fetchAll = async () => {
        setLoading(true);
        setError("");
        try {
            const [
                overviewRes,
                ageRes,
                deptRes,
                revenueRes,
                apptRes,
                docRes,
            ] = await Promise.all([
                apiRequest("/admin/stats/overview"),
                apiRequest("/admin/stats/patients-by-age"),
                apiRequest("/admin/stats/patients-by-dept"),
                apiRequest(`/admin/stats/revenue?year=${revenueYear}`),
                apiRequest("/admin/stats/appointments"),
                apiRequest("/admin/stats/doctors-schedule"),
            ]);

            const [o, a, d, r, ap, doc] = await Promise.all([
                overviewRes.json(),
                ageRes.json(),
                deptRes.json(),
                revenueRes.json(),
                apptRes.json(),
                docRes.json(),
            ]);

            if (o.success) setOverview(o.data);
            if (a.success) setPatientsByAge(a.data);
            if (d.success) setPatientsByDept(d.data);
            if (r.success) setRevenue(r.data);
            if (ap.success) setAppointments(ap.data);
            if (doc.success) setDoctorsSchedule(doc.data);
        } catch (err) {
            setError(`Failed to load stats: ${err.message}`);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchAll(); }, [revenueYear]);

    return {
        overview, patientsByAge, patientsByDept,
        revenue, appointments, doctorsSchedule,
        loading, error, revenueYear, setRevenueYear,
        refetch: fetchAll,
    };
};