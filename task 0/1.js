// Task 1 — Variables and Data Types

const name = "Alen";
let age = 19;
let isActive = true;
const courses = ["Math", "Physics", "English"]; 
const address = { city: "Almaty", street: "Abay St." }; 


let middleName = null; 
let scholarship; 


console.log(name, typeof name);
console.log(age, typeof age); 
console.log(isActive, typeof isActive); 
console.log(courses, typeof courses); 
console.log(address, typeof address); 
console.log(middleName, typeof middleName); 
console.log(scholarship, typeof scholarship); 


const sentence = `${name} is ${age} years old, lives in ${address.city} and is currently studying ${courses.length} courses.`;
console.log(sentence);

/*
Notes

1. let vs const:
    const creates a variable whose BINDING can't be reassigned (you can't do name = "X" again).
    But if the value is an object/array (reference type), its CONTENTS can still be mutated
    (e.g. courses.push("Chemistry") works even though courses is const).
    - let creates a variable that can be reassigned freely. Both let and const are block-scoped
    (unlike var, which is function-scoped and can be redeclared/hoisted in confusing ways).

2. typeof null === "object"
    This is a long-standing bug in JavaScript (present since the very first version) kept for
    backward compatibility. null is actually a primitive, not an object, despite what typeof says.
    To properly check for null you should use `value === null`, not `typeof value === "object"`.

3. JavaScript primitive types (7 total):
    string, number, boolean, undefined, null, bigint, symbol.
    Everything else (objects, arrays, functions) is a reference type.
*/
