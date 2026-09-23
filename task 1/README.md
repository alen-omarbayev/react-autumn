# JS Runtime & Async Playground

A small vanilla HTML/CSS/JS project built to practice closures, the call stack,
Promises, `async`/`await`, and the event loop.

Open `index.html` in a browser — no build step, no dependencies.

## What's inside

- **Tasks** — `Load Users`, `Load Posts`, `Load Comments`, each created with a
  `createTask(name)` closure factory. Each task has a name, status
  (idle/running/completed/failed), an execution count, and its last loading
  time.
- **Run All Tasks** — runs every task concurrently and shows
  `"All tasks finished — X completed, Y failed"` only once every task has
  settled (resolved or rejected).
- **Sequential vs Concurrent** — runs the same three tasks first one-by-one
  with `await`, then resets and runs them together with `Promise.allSettled`,
  measuring and displaying both total times.
- **Event Loop Demo** — a self-contained example mixing `console.log`
  (rendered to the page instead, so it's visible without opening devtools),
  two `setTimeout` calls, two `Promise.resolve().then()` calls, and one
  `async` function, logging the real execution order.

---

## How the closure keeps the task counter private

```js
function createTask(name, options) {
  let count = 0; // lives only in this function's scope
  ...
  function run() { ... count += 1; ... }
  function getCount() { return count; }
  return { name, run, getCount, getStatus, getLastDuration, reset };
}
```

`count` is a local variable of `createTask`. It is never attached to the
returned object and never exposed directly — the only way to read or change
it is through the closures `run` and `getCount`, which keep a reference to
that specific variable in memory even after `createTask` has returned. Because
each call to `createTask("Load Users")` / `createTask("Load Posts")` /
`createTask("Load Comments")` creates a **new** function execution context,
each task gets its **own** `count` binding — incrementing `Load Users`'s
counter has no effect on `Load Posts`'s counter. There is no shared or global
counter anywhere in the code.

## How the call stack works (one example)

Look at `runOneTask(index)`:

```js
async function runOneTask(index) {
  const task = tasks[index];
  setButtonsDisabled(true);   // pushed, runs, popped
  renderTasks();               // pushed, runs, popped
  try {
    await task.run();          // task.run() pushed, runs (schedules a
  } catch (err) {}              // setTimeout, returns a pending Promise),
  renderTasks();                // popped — then runOneTask suspends here
  setButtonsDisabled(false);
}
```

When the click handler calls `runOneTask`, a new frame for `runOneTask` is
pushed onto the call stack. Inside it, `setButtonsDisabled` and `renderTasks`
are pushed, executed to completion, and popped in strict last-in-first-out
order. When `task.run()` is called, its frame is pushed; internally it
immediately calls `new Promise(...)` and `setTimeout(...)`, which just
*registers* a timer with the browser and returns right away — `task.run()`'s
frame is popped almost instantly, long before the timer fires. Because
`task.run()` returned a *pending* Promise, the `await` inside `runOneTask`
suspends that function and pops it off the call stack too, freeing the stack
completely. The stack is empty and the page stays responsive while the timer
counts down in the background. Only when the timer fires does the JS engine
push a **new** call stack frame for the `setTimeout` callback, which resolves
or rejects the Promise, which in turn eventually resumes `runOneTask` after
its `await`.

## How JavaScript can continue while `setTimeout` is waiting

`setTimeout` is not a JavaScript-engine feature — it's provided by the host
environment (the browser). Calling `setTimeout(callback, delay)` just hands
the callback and the delay off to the browser's timer system and returns
immediately; it does **not** block the call stack. The browser keeps its own
timer running outside of JS execution. Meanwhile the call stack empties out
and the event loop keeps pulling other work (other click handlers, UI
rendering, etc.) — this is exactly why `renderTasks()`, button clicks, and
other tasks' timers can all keep working in parallel while one task's
`setTimeout` is still pending. When the timer expires, the browser doesn't
interrupt any currently-running JS — it puts the callback into the **task
queue**, and the event loop only pulls it onto the (now-empty) call stack
once the stack is clear and all pending microtasks have run.

## Predicted vs actual Event Loop output

The demo (`runEventLoopDemo` in `script.js`):

```js
logStep("script start");

setTimeout(() => logStep("setTimeout 0ms callback"), 0);
setTimeout(() => logStep("setTimeout 50ms callback"), 50);

Promise.resolve().then(() => logStep("Promise.resolve().then() #1"));
Promise.resolve().then(() => logStep("Promise.resolve().then() #2"));

async function eventLoopDemoAsyncFn() {
  logStep("async fn: before await");
  await Promise.resolve();
  logStep("async fn: after await");
}
eventLoopDemoAsyncFn();

logStep("script end");
```

**Predicted output (reasoned out before running), using
Call Stack → Microtask Queue → Task Queue → Event Loop:**

1. `script start` — runs synchronously on the call stack.
2. Both `setTimeout` calls just register timers with the browser and return
   immediately; their callbacks go to the **task (macrotask) queue** once
   their delay elapses — they do *not* run yet.
3. Both `Promise.resolve().then()` calls attach callbacks that get queued in
   the **microtask queue** immediately (since the promise is already
   resolved) — but microtasks only run after the current synchronous code
   finishes, not yet.
4. `eventLoopDemoAsyncFn()` is called: everything before the first `await`
   runs **synchronously**, so `async fn: before await` logs immediately, on
   the same call-stack pass as `script start`. Then `await Promise.resolve()`
   suspends the function and schedules its continuation as a microtask.
5. `script end` runs synchronously, since it's after the (now-suspended)
   async call, back on the original stack.
6. **Call stack is now empty.** The event loop drains the entire **microtask
   queue** before touching the task queue: `then() #1`, `then() #2`, then
   `async fn: after await` (queued last, after the other two).
7. Only now does the event loop move to the **task queue**: the `0ms` timer
   callback fires first (registered first, shortest delay), then the `50ms`
   one.

So the predicted order is:

```
1. script start
2. async fn: before await
3. script end
4. Promise.resolve().then() #1
5. Promise.resolve().then() #2
6. async fn: after await
7. setTimeout 0ms callback
8. setTimeout 50ms callback
```

**Actual output**, shown live in the "Event Loop Demo" panel after clicking
the button, matches this order exactly every run, because nothing in the
demo is random. `async fn: before await` logs before `script end` simply
because it's synchronous code that runs earlier in source order (the
function call happens before the `logStep("script end")` line); everything
up to and including `script end` runs on the very first, uninterrupted pass
through the call stack. After that the ordering guarantee kicks in: the
entire microtask queue is always fully drained before the *next* macrotask
is allowed to start, which is why both `.then()` callbacks and the resumed
async function beat both timers, even the `0ms` one. Predicted and actual
output are identical.

## Tasks vs microtasks

- **Microtasks** (Promise `.then`/`.catch`/`.finally` callbacks, `async`
  function continuations after `await`) are drained **completely**, one
  queue, after every single synchronous script/callback finishes, *before*
  the event loop is allowed to render or pick up the next macrotask. If a
  microtask enqueues another microtask, that one runs too, in the same
  "cycle."
- **Tasks / macrotasks** (`setTimeout`/`setInterval` callbacks, UI events,
  network callbacks) each run **one at a time** — after each macrotask, the
  event loop drains microtasks again, and only then may it move to
  rendering/the next macrotask.
- Practical consequence visible in the demo: even a `setTimeout(fn, 0)` — the
  *shortest possible* delay — always runs **after** every microtask queued
  before it, no matter how many microtasks there are. This is why both
  `Promise.resolve().then()` calls and the resumed `async` function log
  before either `setTimeout` callback, even though the timers were
  registered first in the source.

## Handling multiple Promises and errors

- Each task's `run()` returns a `Promise` that **rejects** (via a randomly
  chosen `failRate`) to simulate real API failures, instead of always
  resolving.
- **Run All Tasks** and **Run Concurrent** use `Promise.allSettled(...)`
  rather than `Promise.all(...)`, specifically because `Promise.all` would
  reject and short-circuit as soon as the *first* task fails, hiding the
  results of the others. `allSettled` always waits for every promise to
  settle (fulfilled or rejected) and gives back the outcome of each one, which
  is exactly the "show Completed/Failed for every task" behavior the UI
  needs.
- Individual task failures are caught locally (`try { await task.run() }
  catch (err) { ... }` in sequential mode, `.finally()` + status inspection
  in concurrent mode) so one task rejecting never crashes the whole run or
  leaves the UI stuck — the task's own `status` (set inside `createTask`)
  is what drives the "Completed"/"Failed" badge either way.

## Sequential vs concurrent execution

```js
// sequential
for (const task of tasks) {
  await task.run();      // next task doesn't even START until this settles
}

// concurrent
await Promise.allSettled(tasks.map(task => task.run()));
```

- **Sequential**: `task.run()` isn't even *called* for `Load Posts` until the
  `await` for `Load Users` has settled, so no timer for the second task
  starts until the first one's timer has already finished. Total time ≈ the
  **sum** of each task's random delay (e.g. ~500+1200+900 ≈ 2600ms).
- **Concurrent**: `tasks.map(task => task.run())` calls `run()` for *all*
  three tasks synchronously, in the same call-stack pass, so all three
  `setTimeout` timers are registered essentially simultaneously and count
  down in parallel in the browser. Total time ≈ the **max** of the three
  delays (e.g. max(500,1200,900) ≈ 1200ms), plus a hair of overhead.
- The comparison panel in the app measures both with `performance.now()` and
  displays the real numbers — concurrent is reliably faster whenever there's
  more than one task, because independent I/O-bound waits (here, simulated
  with `setTimeout`) can overlap instead of stacking up.
