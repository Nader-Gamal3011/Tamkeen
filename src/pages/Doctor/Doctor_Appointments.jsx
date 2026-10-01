import { STATS_CONFIG } from "../../config/statsConfig";

import { useDoctorStats } from "../../hooks/useDoctorStats";

import StateDoctor from "../../components/StateDoctor";

import { useAllAppointments } from "../../hooks/useAllApointments";

import AppointmentManagement from "../../components/AppointmentManagement";

const Doctor_Appointments = () => {
  const { data, loading } = useDoctorStats();

  const {
    allappointment,
    appointmentLoading,
    appointmentError,
  } = useAllAppointments();

  return (
    <>
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2 px-7 my-4">
        {STATS_CONFIG.map((item) => (
          <StateDoctor
            key={item.key}
            label={item.label}
            subtitle={item.subtitle}
            icon={item.icon}
            iconBg={item.iconBg}
            iconColor={item.iconColor}
            value={data?.[item.key]}
            loading={loading}
          />
        ))}
      </div>

      {/* Error */}
      {appointmentError && (
        <div className="px-7 mb-4">
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl">
            {appointmentError}
          </div>
        </div>
      )}

      {/* Loading */}
      {appointmentLoading ? (
        <div className="px-7">
          <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center text-slate-500">
            Loading appointments...
          </div>
        </div>
      ) : (
        <div className="patient-management w-full px-7">
          <AppointmentManagement
            appointments={allappointment}
          />
        </div>
      )}
    </>
  );
};

export default Doctor_Appointments;