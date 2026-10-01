const StateDoctor = ({
  label,
  subtitle,
  value,
  icon: Icon,
  iconBg,
  iconColor,
  loading,
}) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 flex items-start justify-between flex-1 min-w-0">
      <div className="flex flex-col gap-1.5">
        <p className="text-[14px] font-medium text-slate-500">{label}</p>
        <p className="text-[28px] font-bold text-slate-900 leading-none">
          {loading ? (
            <span className="inline-block w-8 h-7 bg-slate-100 rounded animate-pulse" />
          ) : (
            (value ?? "—")
          )}
        </p>
        <p className="text-[13px] text-slate-400">{subtitle}</p>
      </div>

      <div
        className={`w-11 h-11 rounded-full ${iconBg} flex items-center justify-center shrink-0`}>
        <Icon size={20} className={iconColor} />
      </div>
    </div>
  );
};

export default StateDoctor;
