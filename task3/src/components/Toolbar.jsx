import { STATUSES, STATUS_LABELS } from "../data";

const FILTERS = ["all", ...STATUSES];

export default function Toolbar({ filter, onFilterChange, reversed, onReverse }) {
  console.log("[render] Toolbar");

  return (
    <div className="toolbar">
      {FILTERS.map((f) => (
        <button
          key={f}
          type="button"
          className={`chip ${filter === f ? "chip-active" : ""}`}
          onClick={() => onFilterChange(f)}
        >
          {f === "all" ? "All" : STATUS_LABELS[f]}
        </button>
      ))}
      <button type="button" className={`chip reverse ${reversed ? "chip-active" : ""}`} onClick={onReverse}>
        ⇅ Reverse
      </button>
    </div>
  );
}
