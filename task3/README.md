# Task 3 — Guild Quest Board

A single-page React dashboard for an adventurers' guild: post quests, track their status, tick off objectives and keep party notes.

## Run

```bash
npm install
npm run dev      # http://localhost:5173/react-autumn/task3/
npm run deploy   # builds and publishes to gh-pages under /task3
```

## Component tree & state

```
App               quests, nextId, filter, reversed
├── AddQuestForm  local: title, difficulty, reward (form draft)
├── Toolbar       status filter chips + Reverse (controlled via props)
└── QuestList     conditional empty state
    └── QuestCard local: progress (0–100%)
```

- **Parent state** (`App`): the list, each quest's `status`, filter and order.
- **Local state** (`QuestCard`): quest progress, changed with −/+.

## Keys, identity and state

- Cards use `key={`${quest.id}-${quest.resetCount}`}`. The key follows the quest, not its position, so filtering and reversing keep each card's progress attached to the right quest.
- **Reset progress** increments `resetCount` in App. The key changes, React treats it as a new component, unmounts the old card and mounts a fresh one with the initial `useState(0)`.
- If the key were the array index, reversing the list would leave progress at the same positions while the quests move — the wrong quest would show it.

## Re-renders

Every component logs `[render] <Name>` with `console.log`:
- typing in the add form re-renders only `AddQuestForm`;
- clicking −/+ re-renders only that `QuestCard`;
- changing filter/order/status re-renders `App` and its children.

(In development `StrictMode` renders each component twice, so logs appear doubled.)
