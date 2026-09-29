export const STATUSES = ["available", "active", "completed"];

export const STATUS_LABELS = {
  available: "Available",
  active: "In progress",
  completed: "Completed",
};

export const DIFFICULTIES = ["Easy", "Medium", "Hard"];

export const initialQuests = [
  { id: 1, title: "Clear the Goblin Den", difficulty: "Easy", reward: 120, status: "active", resetCount: 0 },
  { id: 2, title: "Slay the Ember Drake", difficulty: "Hard", reward: 950, status: "available", resetCount: 0 },
  { id: 3, title: "Find the Lighthouse Keeper", difficulty: "Medium", reward: 300, status: "available", resetCount: 0 },
  { id: 4, title: "Deliver the Royal Letter", difficulty: "Easy", reward: 80, status: "completed", resetCount: 0 },
];
