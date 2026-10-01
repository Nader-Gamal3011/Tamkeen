import { useState } from "react";
import { LuPill, LuPlus, LuX } from "react-icons/lu";
import { useUpdateMedication } from "../hooks/useUpdateMedication";

const AddMedicationModal = ({ onClose, onSuccess, patientId }) => {
  const { addMedication, loading } = useUpdateMedication(patientId, onSuccess);

  const [form, setForm] = useState({
    name: "",
    form: "",
    dosage: "",
    frequency: "",
    startDate: "",
  });

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };
  const handleSubmit = async () => {
    if (!form.name || !form.dosage) return;

    const success = await addMedication(form);

    if (success) {
      setForm({
        name: "",
        form: "",
        dosage: "",
        frequency: "",
        startDate: "",
      });

      onClose?.(); // 🔥 اقفل الأول
      await onSuccess?.(); // بعدين refresh
    }
  };

  const FIELDS = [
    {
      name: "name",
      label: "Medicine Name",
      type: "text",
      placeholder: "e.g. Celecoxib",
    },
    { name: "form", label: "Form", type: "text", placeholder: "e.g. Capsule" },
    {
      name: "dosage",
      label: "Dosage",
      type: "text",
      placeholder: "e.g. 200mg",
    },
    {
      name: "frequency",
      label: "Frequency",
      type: "text",
      placeholder: "e.g. Once daily",
    },
    { name: "startDate", label: "Start Date", type: "date" },
  ];

  return (
    <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-[16px] font-semibold text-slate-900">
            Add Medication
          </h3>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600">
            <LuX size={18} />
          </button>
        </div>

        <div className="flex flex-col gap-3">
          {FIELDS.map((f) => (
            <div key={f.name}>
              <label className="text-[11px] font-medium text-slate-400 uppercase mb-1 block">
                {f.label}
              </label>

              <input
                type={f.type}
                name={f.name}
                value={form[f.name]}
                onChange={handleChange}
                placeholder={f.placeholder}
                className="w-full border border-slate-200 rounded-xl px-3 py-2 text-[13px] outline-none focus:border-blue-400"
              />
            </div>
          ))}
        </div>

        <div className="flex gap-2 mt-5">
          <button
            onClick={onClose}
            className="flex-1 py-2 rounded-xl border text-slate-600">
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="flex-1 py-2 rounded-xl bg-blue-600 text-white disabled:opacity-50">
            {loading ? "Saving..." : "Add Medication"}
          </button>
        </div>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────
// Main Component
// ─────────────────────────────────────────────
const Medications = ({ data = [], patientId, refetch }) => {
  const [showModal, setShowModal] = useState(false);
  const [updatingId, setUpdatingId] = useState(null);

  const { toggleStatus } = useUpdateMedication(patientId, refetch);

  const handleToggle = async (med) => {
    try {
      setUpdatingId(med._id);
      await toggleStatus(med._id, med.status);
    } finally {
      setUpdatingId(null);
    }
  };

  const formatDate = (d) =>
    d
      ? new Date(d).toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        })
      : "—";

  const getInitials = (name = "") =>
    name
      .split(" ")
      .map((w) => w[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);

  return (
    <>
      {showModal && (
        <AddMedicationModal
          patientId={patientId}
          onClose={() => setShowModal(false)}
          onSuccess={refetch}
        />
      )}

      <div>
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <LuPill size={16} className="text-blue-500" />
            <h3 className="text-[14px] font-semibold text-slate-800">
              Current Medications
            </h3>
          </div>

          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-1.5 text-[12px] font-medium text-blue-600 bg-blue-50 px-3 py-1.5 rounded-xl">
            <LuPlus size={13} />
            Add Medication
          </button>
        </div>

        {/* Empty State */}
        {data.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-slate-400">
            <LuPill size={28} />
            <p className="text-[13px] mt-2">No medications recorded</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  {[
                    "Medicine",
                    "Form",
                    "Dosage",
                    "Frequency",
                    "Start Date",
                    "Status",
                    "Added By",
                  ].map((col) => (
                    <th
                      key={col}
                      className="text-left text-[11px] uppercase text-slate-400 pb-2">
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {data.map((med) => (
                  <tr key={med._id} className="hover:bg-slate-50">
                    <td className="py-3 text-[13px]">{med.name}</td>
                    <td className="py-3 text-[13px]">{med.form}</td>
                    <td className="py-3 text-[13px]">{med.dosage}</td>
                    <td className="py-3 text-[13px]">{med.frequency}</td>
                    <td className="py-3 text-[13px]">
                      {formatDate(med.startDate)}
                    </td>

                    {/* Status */}
                    <td className="py-3">
                      <button
                        onClick={() => handleToggle(med)}
                        disabled={updatingId === med._id}
                        className={`text-[11px] px-2 py-1 rounded-full border ${
                          med.status === "active"
                            ? "bg-green-50 text-green-700"
                            : "bg-slate-100 text-slate-500"
                        }`}>
                        {updatingId === med._id
                          ? "..."
                          : med.status === "active"
                            ? "Active"
                            : "Inactive"}
                      </button>
                    </td>

                    {/* Added By */}
                    <td className="py-3 flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-[10px]">
                        {getInitials(med.addedBy?.fullName || "")}
                      </div>
                      <span className="text-[12px]">
                        {med.addedBy?.fullName || "—"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
};

export default Medications;
