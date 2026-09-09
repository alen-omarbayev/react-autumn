// Task 10 — Destructuring, Spread and Rest

const numbers = [10, 20, 30, 40];

// First two values using destructuring
const [first, second] = numbers;
console.log("first:", first, "second:", second);

const user = { id: 1, name: "Anna", age: 21 };

// Get name and age using destructuring
const { name, age } = user;
console.log("name:", name, "age:", age);

// Add 50 to a new copy of the numbers array (original untouched)
const numbersWith50 = [...numbers, 50];
console.log("numbers (original):", numbers);
console.log("numbersWith50:", numbersWith50);

// Create a new user with age 22 (without modifying the original)
const olderUser = { ...user, age: 22 };
console.log("user (original):", user);
console.log("olderUser:", olderUser);

// Add an email without modifying the original user
const userWithEmail = { ...user, email: "anna@example.com" };
console.log("userWithEmail:", userWithEmail);
console.log("user still has no email:", user);

// Combine two arrays using spread
const moreNumbers = [50, 60, 70];
const combined = [...numbers, ...moreNumbers];
console.log("combined:", combined);

// sum(...numbers) — rest parameter, accepts any number of arguments
function sum(...values) {
  return values.reduce((total, n) => total + n, 0);
}

console.log("sum(1, 2):", sum(1, 2)); // 3
console.log("sum(1, 2, 3, 4):", sum(1, 2, 3, 4)); // 10

/*
Notes

Spread and rest use the exact same "..." syntax, but do opposite jobs depending
on where they appear:

- SPREAD "expands"/unpacks an existing array or object into individual elements —
  used when BUILDING a new array/object or passing multiple arguments:
  [...numbers, 50], { ...user, age: 22 }, [...numbers, ...moreNumbers].

- REST "collects"/packs multiple individual values INTO a single array — used in
  a function's parameter list (or in destructuring) to gather "everything else":
  function sum(...values) collects every argument passed into sum() into one
  array called "values", however many arguments there are.

So spread is for spreading OUT (destination: array/object literal or call
arguments), rest is for gathering IN (destination: a single array, typically
in a function signature or destructuring pattern like const [a, ...rest] = arr).
*/
