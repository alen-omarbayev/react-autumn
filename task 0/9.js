// Task 9 — Closure

function createCounter() {
  let count = 0;
  return function () {
    count += 1;
    return count;
  };
}

const counter = createCounter();
console.log("counter():", counter()); // 1
console.log("counter():", counter()); // 2
console.log("counter():", counter()); // 3

// Another, independent counter
const counter2 = createCounter();
console.log("counter2():", counter2()); // 1 (its own count, not continuing from counter)
console.log("counter():", counter()); // 4 (the first counter is unaffected by counter2)

// --- createAdder ---
function createAdder(value) {
  return function (n) {
    return n + value;
  };
}

const addFive = createAdder(5);
console.log("addFive(10):", addFive(10)); // 15
console.log("addFive(20):", addFive(20)); // 25

/*
Notes

- Each call to createCounter() creates a brand new "count" variable in a brand
  new function execution context. The returned inner function forms a closure
  over THAT specific "count", not a shared one — that's why counter and counter2
  count completely independently of each other.

- Why the inner function can still access outer variables:
  When a function is defined, it keeps a reference to the "lexical environment"
  (the scope) it was created in, not just the code. Normally that outer scope
  would be destroyed once createCounter()/createAdder() finishes running, but
  because the returned inner function still references "count" (or "value"),
  JavaScript keeps that variable alive in memory instead of garbage-collecting
  it. This combination of a function + its remembered outer scope is exactly
  what a "closure" is. It's why addFive keeps remembering value = 5 forever,
  even though createAdder already finished executing long before addFive(10)
  is called.
*/
