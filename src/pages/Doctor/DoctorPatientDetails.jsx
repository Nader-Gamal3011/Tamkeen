import EmergencyContact from "../../components/EmergencyContact";
import PatientInformation from "../../components/PatientInformation";
import MedicalInfo from "../../components/MedicalInfo";
import Vitals from "../../components/Vitals";
import Medications from "../../components/Medications";
import PatientNotes from "../../components/PatientNotes";
import HealthReports from "../../components/HealthReports";
import { usePatientDetails } from "../../hooks/usePatientDetails";
import PatientAppointment from "../../components/PatientAppointment";

const DoctorPatientDetails = () => {
  const { patientDetails, loading, error, refetch } = usePatientDetails();

  const patient = patientDetails;

  const patientInfoProps = {
    user: patient?.userId,
    patientId: patient?.patientId,
    age: patient?.age,
    bloodType: patient?.bloodType,
    occupation: patient?.occupation,
    insuranceProvider: patient?.insuranceProvider,
    insuranceClass: patient?.insuranceClass,
    patientType: patient?.patientType,
    currentStatus: patient?.currentStatus,
  };

  const emergencyContactProps = patient?.emergencyContact;

  const medicalInfoProps = patient?.medicalInfo;

  const vitalsProps = patient?.vitals;

  const medicationsProps = patient?.medications ?? [];

  const patientNotesProps = patient?.patientNotes ?? [];

  console.log(patientNotesProps);

  const healthReportsProps = patient?.healthReports ?? [];

  console.log(healthReportsProps);

  // const activityLogProps = patient?.activityLog ?? [];

  if (loading) {
    return <>Loading......</>;
  }
  if (error) {
    return <>Error</>;
  }

  return (
    <div className="p-6 bg-slate-50 min-h-screen">
      {/* Main Layout */}
      <div className="grid grid-cols-12 gap-2">
        {/* LEFT SECTION */}
        <div className="col-span-12 space-y-2">
          {/* Patient Info + Emergency */}
          <div className="grid grid-cols-12 gap-2">
            <div className="col-span-12 bg-white rounded-3xl p-3">
              <PatientInformation data={patientInfoProps} />
            </div>
          </div>
          <div className="grid grid-cols-12 gap-6">
            <div className="col-span-12 lg:col-span-6 bg-white rounded-3xl p-6 min-h-[250px]">
              <EmergencyContact data={emergencyContactProps} />
            </div>
            <div className="col-span-12 md:col-span-6 bg-white rounded-3xl p-6 min-h-[220px]">
              <MedicalInfo data={medicalInfoProps} />
            </div>
          </div>
          <div className="col-span-12 bg-white rounded-3xl p-6 min-h-[220px]">
            <Vitals
              data={vitalsProps}
              patientId={patient?._id}
              refetch={refetch}
            />
          </div>
          {/* Medical + Vitals */}
          <div className="grid grid-cols-12 gap-6">
            <div className="col-span-12 md:col-span-12 bg-white rounded-3xl p-6 min-h-[220px]">
              <PatientNotes
                data={patientNotesProps}
                patientId={patient?._id}
                refetch={refetch}
              />
            </div>
          </div>

          {/* Medications */}
          <div className="bg-white rounded-3xl p-6 min-h-[250px]">
            <Medications
              data={medicationsProps}
              patientId={patient?._id}
              refetch={refetch}
            />
          </div>
          <div className="bg-white rounded-3xl p-6 min-h-[350px]">
            <PatientAppointment />
          </div>

          {/* Notes + Reports */}
          <div className="grid grid-cols-12 gap-6">
            <div className="col-span-12 md:col-span-12 bg-white rounded-3xl p-6 min-h-[220px]">
              <HealthReports
                data={healthReportsProps}
                patientId={patient?._id}
                refetch={refetch}
              />
            </div>
          </div>
        </div>

        {/* RIGHT SECTION */}
        <div className="col-span-12 xl:col-span-4 space-y-2">
          {/* Appointments */}

          {/* Quick Actions */}
        </div>
      </div>
    </div>
  );
};

export default DoctorPatientDetails;
