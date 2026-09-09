// Task 2 — Arrays

const numbers = [3, 7, 2, 10, 5];

// Multiply every number by 2
const doubled = numbers.map((n) => n * 2);

// Get numbers greater than 5
const greaterThanFive = numbers.filter((n) => n > 5);

// Find the first number greater than 5
const firstGreaterThanFive = numbers.find((n) => n > 5);

// Calculate the sum
const sum = numbers.reduce((acc, n) => acc + n, 0);

// Check whether 10 exists
const hasTen = numbers.includes(10);

console.log("Original:", numbers);
console.log("Doubled:", doubled);
console.log("Greater than 5:", greaterThanFive);
console.log("First greater than 5:", firstGreaterThanFive);
console.log("Sum:", sum);
console.log("Has 10:", hasTen);

/*
Notes

- The original array is never touched because map, filter, find, includes are all
  non-mutating: they read the array and return a new value (map/filter return a new
  array, find/includes return a single value/boolean). Methods that WOULD mutate
  (push, pop, splice, sort, reverse) were deliberately avoided.

- map always returns an array of the same length as the original (one output per
  input), while filter can return a shorter array.

- find stops iterating as soon as it hits a match and returns the value itself
  (not an array) — if nothing matches it returns undefined. includes only checks
  for existence and returns a boolean.

- reduce needed an initial value (0) for the accumulator; without it, reduce would
  use the first array element as the initial accumulator, which is less safe
  (reduce with no initial value throws on an empty array).
*/
