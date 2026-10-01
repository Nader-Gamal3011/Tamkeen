import { useState, useEffect } from "react";

import { useUpdateVitals } from "../hooks/useUpdateVitals";

import {
  Activity,
  Thermometer,
  Droplets,
  HeartPulse,
  Weight,
  ClipboardPen,
  X,
} from "lucide-react";

const Vitals = ({ data, patientId, refetch }) => {
  // =========================
  // Latest Blood Pressure Record
  // =========================
  const latestBP = data?.bloodPressure?.[data?.bloodPressure?.length - 1];

  // =========================
  // Edit Modal State
  // =========================
  const [isEditing, setIsEditing] = useState(false);

  // =========================
  // Form State
  // =========================
  const [formData, setFormData] = useState({
    bloodSugar: "",
    bodyWeight: "",
    temperature: "",
    bp: "",
    heartRate: "",
  });

  // =========================
  // Sync Form With API Data
  // =========================
  useEffect(() => {
    setFormData({
      bloodSugar: data?.bloodSugar || "",
      bodyWeight: data?.bodyWeight || "",
      temperature: data?.temperature || "",
      bp: latestBP?.bp || "",
      heartRate: latestBP?.heartRate || "",
    });
  }, [data]);

  // =========================
  // Update Hook
  // =========================
  const { updateVitals, loading, error } = useUpdateVitals();

  // =========================
  // Handle Input Change
  // =========================
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // =========================
  // Handle Save
  // =========================
  const handleSave = async () => {
    try {
      await updateVitals(patientId, {
        bloodSugar: Number(formData.bloodSugar),
        bodyWeight: Number(formData.bodyWeight),
        temperature: Number(formData.temperature),

        bloodPressure: {
          bp: formData.bp,
          heartRate: Number(formData.heartRate),
        },
      });

      await refetch();

      setIsEditing(false);
    } catch (err) {
      console.log(err);
    }
  };

  // =========================
  // Vitals Cards Data
  // =========================
  const vitalsCards = [
    {
      title: "Blood Pressure",
      value: latestBP?.bp || "--/--",
      sub: latestBP?.date
        ? new Date(latestBP.date).toLocaleDateString()
        : "No records",
      icon: Activity,
      iconColor: "text-red-500",
      bg: "bg-red-50",
    },

    {
      title: "Temperature",
      value: `${data?.temperature || "--"} °C`,
      icon: Thermometer,
      iconColor: "text-blue-500",
      bg: "bg-blue-50",
    },

    {
      title: "Blood Sugar",
      value: `${data?.bloodSugar || "--"} mg/dL`,
      icon: Droplets,
      iconColor: "text-orange-500",
      bg: "bg-orange-50",
    },

    {
      title: "Body Weight",
      value: `${data?.bodyWeight || "--"} kg`,
      icon: Weight,
      iconColor: "text-indigo-500",
      bg: "bg-indigo-50",
    },

    {
      title: "Heart Rate",
      value: `${latestBP?.heartRate || "--"} bpm`,
      icon: HeartPulse,
      iconColor: "text-pink-500",
      bg: "bg-pink-50",
    },
  ];

  return (
    <>
      {/* ========================= */}
      {/* Main Card */}
      {/* ========================= */}
      <div className="">
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center">
              <ClipboardPen className="w-5 h-5 text-blue-600" />
            </div>

            <h2 className="text-[22px] font-semibold text-slate-900">
              Current Vitals (Latest)
            </h2>
          </div>

          {/* Edit Button */}
          <button
            onClick={() => setIsEditing(true)}
            className="w-10 h-10 rounded-xl border border-slate-200 flex items-center justify-center hover:bg-slate-50 transition">
            <ClipboardPen className="w-4 h-4 text-slate-500" />
          </button>
        </div>

        {/* Vitals Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {vitalsCards.map((item, index) => {
            const Icon = item.icon;

            return (
              <div
                key={index}
                className="border border-slate-100 rounded-2xl p-4 bg-slate-50">
                <div className="flex items-start justify-between mb-4">
                  <div
                    className={`w-11 h-11 rounded-xl flex items-center justify-center ${item.bg}`}>
                    <Icon className={`w-5 h-5 ${item.iconColor}`} />
                  </div>
                </div>

                <div>
                  <p className="text-[14px] text-slate-500 mb-1">
                    {item.title}
                  </p>

                  <h3 className="text-[22px] font-bold text-slate-900">
                    {item.value}
                  </h3>

                  {item.sub && (
                    <p className="text-[13px] text-slate-400 mt-1">
                      {item.sub}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ========================= */}
      {/* Edit Modal */}
      {/* ========================= */}
      {isEditing && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-2xl bg-white rounded-3xl p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold text-slate-900">
                Edit Vitals
              </h2>

              <button
                onClick={() => setIsEditing(false)}
                className="w-10 h-10 rounded-xl hover:bg-slate-100 flex items-center justify-center transition">
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>

            {/* Form */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Blood Pressure */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Blood Pressure
                </label>

                <input
                  type="text"
                  name="bp"
                  value={formData.bp}
                  onChange={handleChange}
                  disabled={loading}
                  placeholder="120/80"
                  className="w-full h-12 px-4 rounded-2xl border border-slate-200 outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-slate-100"
                />
              </div>

              {/* Heart Rate */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Heart Rate
                </label>

                <input
                  type="number"
                  name="heartRate"
                  value={formData.heartRate}
                  onChange={handleChange}
                  disabled={loading}
                  placeholder="82"
                  className="w-full h-12 px-4 rounded-2xl border border-slate-200 outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-slate-100"
                />
              </div>

              {/* Temperature */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Temperature
                </label>

                <input
                  type="number"
                  step="0.1"
                  name="temperature"
                  value={formData.temperature}
                  onChange={handleChange}
                  disabled={loading}
                  placeholder="36.7"
                  className="w-full h-12 px-4 rounded-2xl border border-slate-200 outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-slate-100"
                />
              </div>

              {/* Blood Sugar */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Blood Sugar
                </label>

                <input
                  type="number"
                  name="bloodSugar"
                  value={formData.bloodSugar}
                  onChange={handleChange}
                  disabled={loading}
                  placeholder="105"
                  className="w-full h-12 px-4 rounded-2xl border border-slate-200 outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-slate-100"
                />
              </div>

              {/* Body Weight */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Body Weight
                </label>

                <input
                  type="number"
                  name="bodyWeight"
                  value={formData.bodyWeight}
                  onChange={handleChange}
                  disabled={loading}
                  placeholder="88"
                  className="w-full h-12 px-4 rounded-2xl border border-slate-200 outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-slate-100"
                />
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="mt-5 rounded-2xl bg-red-50 border border-red-100 p-4 text-red-600 text-sm">
                {error}
              </div>
            )}

            {/* Footer */}
            <div className="flex items-center justify-end gap-3 mt-8">
              <button
                onClick={() => setIsEditing(false)}
                disabled={loading}
                className="h-12 px-5 rounded-2xl border border-slate-200 text-slate-700 font-medium hover:bg-slate-50 transition disabled:opacity-50">
                Cancel
              </button>

              <button
                onClick={handleSave}
                disabled={loading}
                className="h-12 px-6 rounded-2xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-medium transition">
                {loading ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Vitals;
