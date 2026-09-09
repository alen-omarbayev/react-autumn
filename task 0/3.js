// Task 3 — Arrays of Objects

const students = [
  { id: 1, name: "Anna", grade: 85 },
  { id: 2, name: "John", grade: 62 },
  { id: 3, name: "Sara", grade: 91 },
  { id: 4, name: "Mike", grade: 55 },
];

// Students with grade >= 70
const passingStudents = students.filter((s) => s.grade >= 70);

// Array of student names
const names = students.map((s) => s.name);

// Student with id = 3
const studentById3 = students.find((s) => s.id === 3);

// Student with the highest grade
const topStudent = students.reduce((best, s) => (s.grade > best.grade ? s : best));

// Average grade
const averageGrade = students.reduce((sum, s) => sum + s.grade, 0) / students.length;

// New array where every student has passed: true/false (grade >= 70 counts as passed)
const passStatus = students.map((s) => ({ ...s, passed: s.grade >= 70 }));

console.log("Passing students:", passingStudents);
console.log("Names:", names);
console.log("Student with id 3:", studentById3);
console.log("Top student:", topStudent);
console.log("Average grade:", averageGrade);
console.log("Pass status:", passStatus);
console.log("Original untouched:", students);

/*
Notes

- To keep the original objects unmodified, passStatus uses the spread operator
  ({ ...s, passed: ... }) to create a brand new object for each student instead of
  writing s.passed = ... directly on the existing object. Spread only does a
  SHALLOW copy, but since grade/name/id here are all primitives, that's enough —
  a shallow copy would not be enough if a student had a nested object/array field.

- reduce without an initial value uses the first array element as the starting
  accumulator, which works fine here since the array is guaranteed non-empty.

- filter/map/find never touch the original array or its objects, so
  "Original untouched" logs the exact same 4 objects with only id/name/grade,
  no "passed" field leaking into it.
*/
