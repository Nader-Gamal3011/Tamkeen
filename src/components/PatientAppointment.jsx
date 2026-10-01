import { usePatientAppointments } from "../hooks/usePatientAppointments";

const PatientAppointment = () => {
  const { appointments, loading, error } = usePatientAppointments();

  if (loading) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-6 text-center text-slate-500">
        Loading appointment history...
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl">
        {error}
      </div>
    );
  }

  if (!appointments?.length) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-6 text-center text-slate-500">
        No appointments found.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-slate-800">
          Appointment History
        </h3>
        <span className="text-sm text-slate-500">
          {appointments.length} record(s)
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="bg-slate-50 text-slate-600">
              <th className="text-left px-3 py-2 font-medium">Type</th>
              <th className="text-left px-3 py-2 font-medium">Date</th>
              <th className="text-left px-3 py-2 font-medium">Time</th>
              <th className="text-left px-3 py-2 font-medium">Status</th>
              <th className="text-left px-3 py-2 font-medium">Queue</th>
              <th className="text-left px-3 py-2 font-medium">Invoice</th>
            </tr>
          </thead>
          <tbody>
            {appointments.map((appt) => (
              <tr
                key={appt._id ?? appt.appointmentId}
                className="border-t border-slate-100">
                <td className="px-3 py-3 text-slate-700">
                  {appt.appointmentType}
                </td>
                <td className="px-3 py-3 text-slate-700">
                  {appt.date ? new Date(appt.date).toLocaleDateString() : "-"}
                </td>
                <td className="px-3 py-3 text-slate-700">
                  {appt.startTime ?? "-"} - {appt.endTime ?? "-"}
                </td>
                <td className="px-3 py-3">
                  <span
                    className={
                      appt.status === "completed"
                        ? "inline-flex items-center rounded-full bg-green-50 text-green-700 px-3 py-1"
                        : appt.status === "cancelled"
                          ? "inline-flex items-center rounded-full bg-red-50 text-red-700 px-3 py-1"
                          : "inline-flex items-center rounded-full bg-slate-50 text-slate-700 px-3 py-1"
                    }>
                    {appt.status}
                  </span>
                </td>
                <td className="px-3 py-3 text-slate-700">
                  {appt.queueNumber ?? "-"}
                </td>
                <td className="px-3 py-3 text-slate-700">
                  {appt.invoiceId ?? "-"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="space-y-3">
        {appointments.map((appt) => (
          <div
            key={`note-${appt._id ?? appt.appointmentId}`}
            className="rounded-2xl border border-slate-200 p-4 bg-white">
            <div className="flex items-center justify-between gap-3">
              <div className="font-medium text-slate-800">
                {appt.appointmentType} • {appt.appointmentId}
              </div>
              <div className="text-xs text-slate-500">
                {appt.date ? new Date(appt.date).toLocaleString() : "-"}
              </div>
            </div>
            <div className="mt-2 text-slate-700">
              <span className="font-semibold">Notes:</span> {appt.notes ?? "-"}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PatientAppointment;
