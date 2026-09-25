/**
 * StatsCard — displays a single metric on the dashboard/analytics.
 */
const StatsCard = ({ label, value, icon: Icon, color = "text-accent-green", sub }) => (
  <div className="rounded-xl border border-bg-border bg-bg-card p-5">
    <div className="flex items-center justify-between">
      <p className="text-sm font-medium text-text-secondary">{label}</p>
      {Icon && (
        <div className={`rounded-lg p-2 ${color} bg-opacity-10`}>
          <Icon size={18} className={color} />
        </div>
      )}
    </div>
    <p className={`mt-3 text-3xl font-bold ${color}`}>{value}</p>
    {sub && <p className="mt-1 text-xs text-text-muted">{sub}</p>}
  </div>
);

export default StatsCard;
