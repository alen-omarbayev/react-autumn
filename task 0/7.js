// Task 7 — Functions as Values

const add = (a, b) => a + b;
const multiply = (a, b) => a * b;

// calculate takes another function as its "operation" argument
function calculate(a, b, operation) {
  return operation(a, b);
}

console.log("calculate(5, 3, add):", calculate(5, 3, add)); // 8
console.log("calculate(5, 3, multiply):", calculate(5, 3, multiply)); // 15

/*
Notes

- Can functions be stored in variables?
  Yes. In JavaScript, functions are "first-class citizens" — they are just
  values, like numbers or strings. That's exactly what `const add = (a, b) => ...`
  does: it stores a function value in the variable "add".

- Can functions be passed to other functions?
  Yes, that's the whole point of this task. calculate(a, b, operation) receives
  "add" or "multiply" as its third argument and calls it internally via
  operation(a, b). A function passed like this is usually called a "callback",
  and calculate itself is a "higher-order function" because it takes a function
  as a parameter.

- Difference between `add` and `add()`:
  `add` (no parentheses) refers to the FUNCTION ITSELF as a value — you can store
  it, pass it around, log it, but it doesn't run.
  `add()` (with parentheses) actually CALLS/INVOKES the function immediately and
  gives you its return value instead of the function.
  That's why calculate(5, 3, add) passes the function so calculate can call it
  later — passing add(5, 3) instead would call it too early (before calculate even
  runs) and pass the resulting number (8) as the third argument, which would then
  break since calculate tries to call a number like operation(a, b).
*/
