import { useState } from "react";
import "./App.css";
import { initialQuests } from "./data";
import AddQuestForm from "./components/AddQuestForm";
import Toolbar from "./components/Toolbar";
import QuestList from "./components/QuestList";

export default function App() {
  const [quests, setQuests] = useState(initialQuests);
  const [nextId, setNextId] = useState(initialQuests.length + 1);
  const [filter, setFilter] = useState("all");
  const [reversed, setReversed] = useState(false);

  console.log("[render] App", { count: quests.length, filter, reversed });

  function addQuest(quest) {
    setQuests([...quests, { ...quest, id: nextId, status: "available", resetCount: 0 }]);
    setNextId(nextId + 1);
  }

  function removeQuest(id) {
    setQuests(quests.filter((q) => q.id !== id));
  }

  function changeStatus(id, status) {
    setQuests(quests.map((q) => (q.id === id ? { ...q, status } : q)));
  }

  // Bumping resetCount changes the card's key, so React unmounts the old
  // card and mounts a fresh one — its local state starts from scratch.
  function resetQuest(id) {
    setQuests(quests.map((q) => (q.id === id ? { ...q, resetCount: q.resetCount + 1 } : q)));
  }

  // Derived during render, never stored in state.
  const visible = quests.filter((q) => filter === "all" || q.status === filter);
  if (reversed) visible.reverse();

  return (
    <main className="app">
      <h1>⚔ Guild Quest Board</h1>
      <AddQuestForm onAdd={addQuest} />
      <Toolbar filter={filter} onFilterChange={setFilter} reversed={reversed} onReverse={() => setReversed(!reversed)} />
      <QuestList quests={visible} onRemove={removeQuest} onStatusChange={changeStatus} onReset={resetQuest} />
    </main>
  );
}
