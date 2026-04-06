const STATUS_CONFIG = {
  pending:   { label: "En attente", classes: "bg-amber-100 text-amber-700" },
  confirmed: { label: "Confirmée",  classes: "bg-primary/10 text-primary-dark" },
  cancelled: { label: "Annulée",    classes: "bg-red-100 text-red-600" },
};

export default function StatusBadge({ status }) {
  const c = STATUS_CONFIG[status] ?? { label: status, classes: "bg-gray-100 text-gray-600" };
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${c.classes}`}>
      {c.label}
    </span>
  );
}
