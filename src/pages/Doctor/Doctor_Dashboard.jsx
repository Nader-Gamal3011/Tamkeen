import StateDoctor from "../../components/StateDoctor";
import { useDoctorStats } from "../../hooks/useDoctorStats";
import { STATS_CONFIG } from "../../config/statsConfig";
import PatientManagement from "../../components/PatientManagement";
import CalendarComponent from "../../components/CalendarComponent";

const Doctor_Dashboard = () => {
  const { data, loading, error } = useDoctorStats();

  const appointments = data?.appointments ?? [];

  const tableData = appointments.map((apt) => ({
    name: apt.patientId?.userId?.fullName ?? "Unknown",
    patientId: apt.patientId?.patientId ?? "-",
    type: apt.appointmentType ?? "-",
    time: `${apt.startTime ?? ""} - ${apt.endTime ?? ""}`,
    status: apt.status ?? "Pending",
    id: apt._id,
  }));
  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) return <p>{error}</p>;

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2 px-7 my-4">
        {STATS_CONFIG.map((item) => (
          <StateDoctor
            key={item.key}
            label={item.label}
            subtitle={item.subtitle}
            icon={item.icon}
            iconBg={item.iconBg}
            iconColor={item.iconColor}
            value={data[item.key]}
            loading={loading}
          />
        ))}
      </div>

      <div className="patient-management w-full px-7">
        <PatientManagement tableData={tableData} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 px-7">
        <div className="schedule">
          <CalendarComponent />
        </div>

      </div>
    </>
  );
};

export default Doctor_Dashboard;
