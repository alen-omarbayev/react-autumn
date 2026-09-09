// Task 4 — Objects

const user = {
  id: 1,
  name: "Alen",
  age: 19,
  address: {
    city: "Almaty",
    street: "Abay St.",
  },
};

// Read the name and city
console.log("Name:", user.name);
console.log("City:", user.address.city);

// Change the age
user.age = 20;
console.log("Updated age:", user.age);

// Add an email
user.email = "alen@example.com";
console.log("After adding email:", user);

// Remove the street
delete user.address.street;
console.log("After removing street:", user);

// Get name and age using destructuring
const { name, age } = user;
console.log("Destructured:", name, age);

// Get city using nested destructuring
const {
  address: { city },
} = user;
console.log("City via nested destructuring:", city);

// Rename name to userName during destructuring
const { name: userName } = user;
console.log("Renamed:", userName);

/*
Notes

- delete only removes a key from an object; it doesn't work on array indexes the
  way splice does (it would leave a hole). Here it's used correctly since
  user.address.street is a plain object property.

- Nested destructuring `const { address: { city } } = user` pulls "city" straight
  out of the nested object without creating an intermediate "address" variable —
  if you also wanted the address object itself, you'd write
  `const { address, address: { city } } = user`.

- Renaming during destructuring (`{ name: userName }`) is useful to avoid naming
  collisions, e.g. when you already have a variable called "name" in scope
  (which in this file I do — "name" from the earlier destructuring — so renaming
  here was actually necessary, not just a style choice).
*/
