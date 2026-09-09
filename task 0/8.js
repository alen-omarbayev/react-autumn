// Task 8 — Scope

const message = "global";

function showMessage() {
  const message = "function";
  console.log("inside function, before if:", message); // "function"

  if (true) {
    const message = "block";
    console.log("inside if block:", message); // "block"
  }

  console.log("inside function, after if:", message); // "function" (block one is gone)
}

showMessage();
console.log("outside function:", message); // "global"

// --- var / let / const inside a block ---
{
  var varVariable = "I am var";
  let letVariable = "I am let";
  const constVariable = "I am const";
}

console.log("varVariable outside block:", varVariable); // works! "I am var"

try {
  console.log(letVariable);
} catch (e) {
  console.log("letVariable outside block:", e.message); // ReferenceError: letVariable is not defined
}

try {
  console.log(constVariable);
} catch (e) {
  console.log("constVariable outside block:", e.message); // ReferenceError: constVariable is not defined
}

/*
Notes

- Global scope: variables declared outside any function/block (like the top-level
  "message") — accessible from anywhere in the file/program, including inside
  every nested function and block (unless shadowed by a local variable of the
  same name, as happens here).

- Function scope: a new "message" declared inside showMessage() only exists
  within that function. It shadows the global "message" for the whole function
  body, and disappears once the function finishes running.

- Block scope: a new "message" declared with let/const inside the `if { }` block
  only exists within that block (between its `{` and `}`). Once execution leaves
  the if-block, that "message" is gone and the function-scoped one is visible
  again.

- var vs let vs const:
  * var is FUNCTION-scoped (or global if declared outside any function), not
    block-scoped — that's why varVariable is still accessible after the block
    ends. var declarations are also hoisted and initialized to undefined at the
    top of their scope, and can be redeclared.
  * let is BLOCK-scoped, can be reassigned, cannot be redeclared in the same
    scope, and is not accessible before its declaration line (temporal dead zone) —
    hence the ReferenceError for letVariable outside the block.
  * const is also BLOCK-scoped like let, but cannot be reassigned after
    initialization (though, as seen in earlier tasks, object/array contents it
    points to can still be mutated). Same ReferenceError outside the block.
*/
