// Task 5 — Values and References

// --- Part 1: reference copy ---
const original = { name: "Alice", score: 10 };
const copy = original; // copy is NOT a new object, it's the same reference

copy.score = 20;

console.log("original:", original); // { name: "Alice", score: 20 } 
console.log("copy:", copy); // { name: "Alice", score: 20 }

// Why: objects are reference types. "copy = original" doesn't clone the object,
// it just copies the memory reference/pointer, so both variables point to the
// exact same object in memory. Mutating through one name mutates it for both.

// --- Fix: copy using spread operator ---
const original2 = { name: "Alice", score: 10 };
const properCopy = { ...original2 }; // new object with the same top-level values

properCopy.score = 99;

console.log("original2 (unchanged):", original2); // { name: "Alice", score: 10 }
console.log("properCopy (changed):", properCopy); // { name: "Alice", score: 99 }

// --- Part 2: spread with a nested object ---
const user = { name: "Alice", address: { city: "Almaty" } };
const userCopy = { ...user };

userCopy.address.city = "Astana";

console.log("user.address.city:", user.address.city); // "Astana" 
console.log("userCopy.address.city:", userCopy.address.city); // "Astana"

// Why: spread only does a SHALLOW copy. It copies top-level keys (name, address)
// into a new object, but "address" itself is still a reference to the SAME nested
// object as in the original. So user and userCopy share the same address object,
// and mutating userCopy.address.city also mutates user.address.city.

// --- Fix: deep-copy the nested object ---
const user2 = { name: "Alice", address: { city: "Almaty" } };

// Option A: manually spread the nested object too
const properUserCopy = { ...user2, address: { ...user2.address } };
properUserCopy.address.city = "Astana";

console.log("user2.address.city (unchanged):", user2.address.city); // "Almaty"
console.log("properUserCopy.address.city (changed):", properUserCopy.address.city); // "Astana"

// Option B: structuredClone for arbitrarily deep objects (no need to spread
// every nesting level by hand)
const deepCopy = structuredClone(user2);
deepCopy.address.city = "Karaganda";
console.log("user2.address.city still unchanged:", user2.address.city); // "Almaty"

/*
Notes

- Primitives (numbers, strings, booleans...) are copied BY VALUE. Objects/arrays
  are copied BY REFERENCE — assigning one variable to another just copies the
  pointer, not the data.

- { ...obj } only clones ONE level deep. Any nested object/array inside still
  points to the same memory as the original, which is the classic bug source
  ("I copied it with spread but the original still changed!").

- To fully detach nested data you need either to spread every nested level
  manually, or use structuredClone(obj) (built into modern JS/Node), or a
  library like lodash's cloneDeep for more complex/older environments.
*/
