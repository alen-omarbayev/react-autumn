import { useState } from "react";
import { STATUSES, STATUS_LABELS } from "../data";

export default function QuestCard({ quest, onRemove, onStatusChange, onReset }) {
  // Local state — lives inside this card instance only.
  const [progress, setProgress] = useState(0);

  console.log(`[render] QuestCard #${quest.id}`, { progress });

  return (
    <li className={`quest-card status-${quest.status}`}>
      <div className="card-top">
        <h3>{quest.title}</h3>
        <button type="button" className="icon-btn" onClick={() => onRemove(quest.id)} aria-label="Remove quest">
          ✕
        </button>
      </div>

      <p className="meta">
        <span className={`badge diff-${quest.difficulty.toLowerCase()}`}>{quest.difficulty}</span>
        <span className="reward">🪙 {quest.reward}</span>
        <select
          className="status-select"
          value={quest.status}
          onChange={(e) => onStatusChange(quest.id, e.target.value)}
          aria-label="Quest status"
        >
          {STATUSES.map((s) => (
            <option key={s} value={s}>
              {STATUS_LABELS[s]}
            </option>
          ))}
        </select>
      </p>

      <div className="progress-row">
        <button type="button" className="btn" onClick={() => setProgress(progress - 25)} disabled={progress === 0}>
          −
        </button>
        <div className="progress">
          <div className="progress-fill" style={{ width: `${progress}%` }} />
        </div>
        <button type="button" className="btn" onClick={() => setProgress(progress + 25)} disabled={progress === 100}>
          +
        </button>
        <span className="progress-label">{progress}%</span>
      </div>

      {progress > 0 && (
        <button type="button" className="link-btn" onClick={() => onReset(quest.id)}>
          ↺ Reset progress
        </button>
      )}
    </li>
  );
}
