import { useState } from "react";
import { DIFFICULTIES } from "../data";

export default function AddQuestForm({ onAdd }) {
  // Form draft is local to this component — typing here does not re-render App.
  const [title, setTitle] = useState("");
  const [difficulty, setDifficulty] = useState(DIFFICULTIES[0]);
  const [reward, setReward] = useState(100);

  console.log("[render] AddQuestForm");

  function handleSubmit(e) {
    e.preventDefault();
    if (!title.trim()) return;
    onAdd({ title: title.trim(), difficulty, reward: Math.max(0, Number(reward) || 0) });
    setTitle("");
  }

  return (
    <form className="add-form" onSubmit={handleSubmit}>
      <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="New quest title…" />
      <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)} aria-label="Difficulty">
        {DIFFICULTIES.map((d) => (
          <option key={d}>{d}</option>
        ))}
      </select>
      <input
        className="reward-input"
        type="number"
        min="0"
        step="10"
        value={reward}
        onChange={(e) => setReward(e.target.value)}
        aria-label="Reward in gold"
      />
      <button type="submit" className="btn btn-primary" disabled={!title.trim()}>
        Add
      </button>
    </form>
  );
}
