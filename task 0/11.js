// Task 11 — Optional Chaining and Default Values

const userWithAddress = { id: 1, name: "Anna", address: { city: "Almaty" } };
const userWithoutAddress = { id: 2, name: "John" };

// --- The problem: accessing a missing nested property directly ---
try {
  console.log(userWithoutAddress.address.city);
} catch (e) {
  console.log("Error accessing address.city directly:", e.message);
  // TypeError: Cannot read properties of undefined (reading 'city')
}

// --- Fix: optional chaining (?.) ---
console.log("userWithAddress.address?.city:", userWithAddress.address?.city); // "Almaty"
console.log("userWithoutAddress.address?.city:", userWithoutAddress.address?.city); // undefined, no crash

// --- Nullish coalescing (??) to show a fallback message ---
function getCity(user) {
  return user.address?.city ?? "City not specified";
}

console.log("getCity(userWithAddress):", getCity(userWithAddress)); // "Almaty"
console.log("getCity(userWithoutAddress):", getCity(userWithoutAddress)); // "City not specified"

// --- Comparing || vs ?? ---
const testValues = [0, "", false, null, undefined];

testValues.forEach((value) => {
  console.log(
    `value = ${JSON.stringify(value)} | value || "default" -> ${value || "default"} | value ?? "default" -> ${value ?? "default"}`
  );
});

/*
Notes

- Accessing user.address.city directly throws a TypeError when "address" is
  undefined, because you can't read a property ("city") off undefined. Optional
  chaining (?.) short-circuits and returns undefined instead of throwing, the
  moment it hits a null/undefined link in the chain.

- || (logical OR) falls back to the default for ANY "falsy" value: 0, "", false,
  null, undefined (and NaN) all trigger the "default" fallback with ||. This is
  a common source of bugs — e.g. a valid quantity of 0, or an intentionally empty
  string, would incorrectly get replaced by the default.

- ?? (nullish coalescing) only falls back for null or undefined — 0, "", and
  false are all treated as legitimate values and pass through unchanged. This
  makes ?? the safer choice specifically for "give me a default only if this is
  truly missing (null/undefined)", while || is for "give me a default whenever
  this is falsy in general."

- Combining user.address?.city ?? "City not specified" is a common real-world
  pattern: optional chaining prevents the crash on missing nested objects, and
  nullish coalescing provides a clean fallback only when the final value is
  actually null/undefined (not for other falsy values like an empty city string).
*/
