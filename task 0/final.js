// Final Task — putting it all together

const students = [
  { id: 1, name: "Anna", age: 21, grades: [85, 90, 78] },
  { id: 2, name: "John", age: 22, grades: [55, 60, 50] },
  { id: 3, name: "Sara", age: 20, grades: [91, 95, 89] },
  { id: 4, name: "Mike", age: 23, grades: [40, 65, 58] },
  { id: 5, name: "Lena", age: 21, grades: [72, 68, 74] },
];

const PASS_THRESHOLD = 60;

// Average of a plain array of numbers
const getAverage = (grades) => grades.reduce((sum, g) => sum + g, 0) / grades.length;

// Average for a single student object
const getStudentAverage = (student) => getAverage(student.grades);

// Students whose average grade passes the threshold
const getPassedStudents = (students) =>
  students.filter((s) => getStudentAverage(s) >= PASS_THRESHOLD);

// Just the names
const getStudentNames = (students) => students.map((s) => s.name);

// Find a student by id
const findStudent = (students, id) => students.find((s) => s.id === id);

// Student with the highest average grade
const getTopStudent = (students) =>
  students.reduce((best, s) =>
    getStudentAverage(s) > getStudentAverage(best) ? s : best
  );

// Summary array: { id, name, average, passed } for every student
const studentSummaries = students.map((s) => {
  const average = getStudentAverage(s);
  return {
    id: s.id,
    name: s.name,
    average,
    passed: average >= PASS_THRESHOLD,
  };
});

console.log("All students (original, untouched):", students);
console.log("Passed students:", getPassedStudents(students));
console.log("Student names:", getStudentNames(students));
console.log("Find student id=3:", findStudent(students, 3));
console.log("Top student:", getTopStudent(students));
console.log("Student summaries:", studentSummaries);

/*
Notes

- getStudentAverage is built ON TOP OF getAverage instead of repeating the
  reduce logic — small, single-purpose functions compose well (getPassedStudents
  and getTopStudent both reuse getStudentAverage instead of recalculating grades
  inline).

- Nothing here mutates "students" or any student object: map/filter/find/reduce
  all read and return new values, and studentSummaries builds a completely new
  array of new objects rather than adding "average"/"passed" fields onto the
  existing student objects.

- getTopStudent calls getStudentAverage(s) twice per comparison in reduce (once
  for "s", once implicitly kept for "best" from the previous iteration) — for 5
  students, recalculating averages repeatedly is negligible, but on a much bigger
  dataset it would be worth pre-computing each student's average once (e.g. via
  studentSummaries) and then reducing on that instead of recalculating inside
  the loop every time.

- Threshold (60) is pulled into one named constant (PASS_THRESHOLD) instead of
  a "magic number" repeated in getPassedStudents and studentSummaries, so both
  stay in sync if the passing grade ever changes.
*/
