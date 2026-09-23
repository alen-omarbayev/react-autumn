"use strict";

/* ------------------------------------------------------------------
 * createTask: a closure-based factory.
 * `count` lives only inside this function's scope, so the only way
 * to read or change it is through the methods returned below.
 * Every call to createTask() creates a brand new `count` binding,
 * so separate tasks never share state.
 * ------------------------------------------------------------------ */
function createTask(name, { minMs = 500, maxMs = 2000, failRate = 0.25 } = {}) {
  let count = 0; // private — not reachable from outside this closure
  let status = "idle";
  let lastDurationMs = null;

  function run() {
    status = "running";
    const duration = Math.floor(Math.random() * (maxMs - minMs + 1)) + minMs;

    return new Promise((resolve, reject) => {
      setTimeout(() => {
        count += 1;
        lastDurationMs = duration;
        const willFail = Math.random() < failRate;
        if (willFail) {
          status = "failed";
          reject(new Error(`${name} failed after ${duration}ms`));
        } else {
          status = "completed";
          resolve({ name, duration });
        }
      }, duration);
    });
  }

  function getCount() {
    return count;
  }

  function getStatus() {
    return status;
  }

  function getLastDuration() {
    return lastDurationMs;
  }

  function reset() {
    status = "idle";
    lastDurationMs = null;
    // count is intentionally NOT reset here — it tracks total executions.
  }

  return { name, run, getCount, getStatus, getLastDuration, reset };
}

/* ------------------------------------------------------------------
 * Task registry + UI wiring
 * ------------------------------------------------------------------ */
const taskDefs = [
  { name: "Load Users" },
  { name: "Load Posts" },
  { name: "Load Comments" },
];

const tasks = taskDefs.map((def) => createTask(def.name));

const taskListEl = document.getElementById("task-list");
const allTasksBanner = document.getElementById("all-tasks-banner");
const runAllBtn = document.getElementById("run-all-btn");
const runSequentialBtn = document.getElementById("run-sequential-btn");
const runConcurrentBtn = document.getElementById("run-concurrent-btn");
const resetAllBtn = document.getElementById("reset-all-btn");
const sequentialTimeEl = document.getElementById("sequential-time");
const concurrentTimeEl = document.getElementById("concurrent-time");
const comparisonExplanationEl = document.getElementById("comparison-explanation");

function renderTasks() {
  taskListEl.innerHTML = "";
  tasks.forEach((task, index) => {
    const card = document.createElement("div");
    card.className = "task-card";
    card.dataset.index = index;

    const status = task.getStatus();
    const duration = task.getLastDuration();

    card.innerHTML = `
      <div class="task-name">${task.name}</div>
      <div class="task-status ${status}">${status}</div>
      <div class="task-meta">${duration !== null ? duration + " ms" : "—"}</div>
      <div class="task-count">runs: ${task.getCount()}</div>
      <div class="task-actions">
        <button class="btn run-one">Run</button>
      </div>
    `;

    card.querySelector(".run-one").addEventListener("click", () => runOneTask(index));

    taskListEl.appendChild(card);
  });
}

async function runOneTask(index) {
  const task = tasks[index];
  setButtonsDisabled(true);
  renderTasks();
  try {
    await task.run();
  } catch (err) {
    // failure already reflected in task.getStatus()
  }
  renderTasks();
  setButtonsDisabled(false);
}

function setButtonsDisabled(disabled) {
  [runAllBtn, runSequentialBtn, runConcurrentBtn, resetAllBtn].forEach((btn) => {
    btn.disabled = disabled;
  });
}

/* "Run All Tasks": fire every task at once, show a banner only once
 * every promise has either resolved or rejected. Promise.allSettled
 * is exactly built for "wait for everything, ignore individual failures". */
async function runAllTasks() {
  setButtonsDisabled(true);
  allTasksBanner.classList.add("hidden");
  tasks.forEach((t) => t.reset());
  renderTasks();

  const settled = tasks.map((task) =>
    task.run().finally(renderTasks)
  );

  await Promise.allSettled(settled);

  const failed = tasks.filter((t) => t.getStatus() === "failed").length;
  const completed = tasks.length - failed;
  allTasksBanner.textContent = `All tasks finished — ${completed} completed, ${failed} failed`;
  allTasksBanner.classList.remove("hidden");
  renderTasks();
  setButtonsDisabled(false);
}

/* ------------------------------------------------------------------
 * Sequential vs concurrent comparison
 * ------------------------------------------------------------------ */
async function runSequential() {
  setButtonsDisabled(true);
  tasks.forEach((t) => t.reset());
  renderTasks();

  const start = performance.now();
  for (const task of tasks) {
    try {
      await task.run();
    } catch (err) {
      // keep going even if one task fails
    }
    renderTasks();
  }
  const elapsed = Math.round(performance.now() - start);

  sequentialTimeEl.textContent = `${elapsed} ms`;
  updateExplanation();
  setButtonsDisabled(false);
}

async function runConcurrent() {
  setButtonsDisabled(true);
  tasks.forEach((t) => t.reset());
  renderTasks();

  const start = performance.now();
  await Promise.allSettled(tasks.map((task) => task.run().finally(renderTasks)));
  const elapsed = Math.round(performance.now() - start);

  concurrentTimeEl.textContent = `${elapsed} ms`;
  updateExplanation();
  setButtonsDisabled(false);
}

function updateExplanation() {
  const seq = sequentialTimeEl.textContent;
  const conc = concurrentTimeEl.textContent;
  if (seq === "—" || conc === "—") return;
  comparisonExplanationEl.textContent =
    `Sequential took ${seq} because each "await" blocks the next task from starting ` +
    `until the previous one settles, so the total time is roughly the SUM of every ` +
    `task's random delay. Concurrent took ${conc} because all setTimeout timers are ` +
    `started together on the call stack before anything yields, so they all run in ` +
    `parallel behind the scenes and the total time is roughly the MAX of the individual delays.`;
}

/* ------------------------------------------------------------------
 * Event Loop demo
 * ------------------------------------------------------------------ */
const eventLoopLog = document.getElementById("eventloop-log");
const runEventLoopBtn = document.getElementById("run-eventloop-btn");

function logStep(text) {
  const li = document.createElement("li");
  li.innerHTML = `<span class="label">${eventLoopLog.children.length + 1}.</span>${text}`;
  eventLoopLog.appendChild(li);
}

async function eventLoopDemoAsyncFn() {
  logStep("async fn: before await (sync, runs on call stack immediately)");
  await Promise.resolve();
  logStep("async fn: after await (resumes as a microtask)");
}

function runEventLoopDemo() {
  eventLoopLog.innerHTML = "";
  runEventLoopBtn.disabled = true;

  // 1. Synchronous
  logStep("script start (sync, call stack)");

  // 2. Macrotask (task queue), longer delay
  setTimeout(() => {
    logStep("setTimeout 0ms callback (task queue)");
  }, 0);

  // 3. Macrotask (task queue), even after a 0ms one queued later
  setTimeout(() => {
    logStep("setTimeout 50ms callback (task queue)");
  }, 50);

  // 4. Microtask
  Promise.resolve().then(() => {
    logStep("Promise.resolve().then() #1 (microtask queue)");
  });

  // 5. Another microtask, chained
  Promise.resolve().then(() => {
    logStep("Promise.resolve().then() #2 (microtask queue)");
  });

  // 6. async function - runs sync part immediately, awaits produce microtasks
  eventLoopDemoAsyncFn();

  // 7. Synchronous
  logStep("script end (sync, call stack)");

  setTimeout(() => {
    runEventLoopBtn.disabled = false;
  }, 60);
}

/* ------------------------------------------------------------------
 * Wire up buttons
 * ------------------------------------------------------------------ */
runAllBtn.addEventListener("click", runAllTasks);
runSequentialBtn.addEventListener("click", runSequential);
runConcurrentBtn.addEventListener("click", runConcurrent);
resetAllBtn.addEventListener("click", () => {
  tasks.forEach((t) => t.reset());
  sequentialTimeEl.textContent = "—";
  concurrentTimeEl.textContent = "—";
  comparisonExplanationEl.textContent = "";
  allTasksBanner.classList.add("hidden");
  renderTasks();
});
runEventLoopBtn.addEventListener("click", runEventLoopDemo);

renderTasks();
