import QuestCard from "./QuestCard";

export default function QuestList({ quests, onRemove, onStatusChange, onReset }) {
  console.log("[render] QuestList", quests.map((q) => q.id));

  if (quests.length === 0) {
    return <p className="empty">No quests here yet.</p>;
  }

  return (
    <ul className="quest-list">
      {quests.map((quest) => (
        // Stable key = quest id → each card keeps its own local state when the
        // list is filtered or reversed. resetCount is part of the key so that
        // "Reset" gives the card a new identity and wipes its local state.
        <QuestCard
          key={`${quest.id}-${quest.resetCount}`}
          quest={quest}
          onRemove={onRemove}
          onStatusChange={onStatusChange}
          onReset={onReset}
        />
      ))}
    </ul>
  );
}
