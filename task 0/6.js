// Task 6 — Functions

// isEven — normal function syntax
function isEven(number) {
  return number % 2 === 0;
}

// isEven rewritten as an arrow function
const isEvenArrow = (number) => number % 2 === 0;

// getFullName
function getFullName(firstName, lastName) {
  return `${firstName} ${lastName}`;
}

// calculatePrice
const calculatePrice = (price, quantity) => price * quantity;

// calculateDiscount
const calculateDiscount = (price, percent) => price - (price * percent) / 100;

// getMax
const getMax = (a, b) => (a > b ? a : b);

console.log("isEven(4):", isEven(4));
console.log("isEven(7):", isEven(7));
console.log("isEvenArrow(4):", isEvenArrow(4));
console.log("getFullName:", getFullName("Alen", "Omarbaev"));
console.log("calculatePrice(100, 3):", calculatePrice(100, 3));
console.log("calculateDiscount(200, 15):", calculateDiscount(200, 15));
console.log("getMax(8, 5):", getMax(8, 5));

/*
Notes

- function isEven(...) is hoisted (its full definition, not just the name, is
  moved to the top of the scope), so it can technically be called before its
  declaration in the file. const isEvenArrow = (...) => ... is NOT hoisted in
  that way — only the "const" binding is hoisted (into the temporal dead zone),
  so calling isEvenArrow before its line would throw a ReferenceError.

- A normal function also has its own "this" binding (depends on how it's called),
  while an arrow function captures "this" lexically from its surrounding scope.
  For simple pure calculations like these it doesn't matter, but it matters a lot
  for things like object methods or event handlers.

- calculateDiscount uses price - (price * percent) / 100 rather than a separate
  "discountAmount" variable — kept it as one expression since these are meant to
  be short single-purpose helpers.
*/
