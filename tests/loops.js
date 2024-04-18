import { testStart, assert, testEnd } from "./testHelper.js";

// https://docs.godotengine.org/en/stable/tutorials/scripting/gdscript/gdscript_basics.html#while
// https://docs.godotengine.org/en/stable/tutorials/scripting/gdscript/gdscript_basics.html#loop
// https://docs.godotengine.org/en/stable/tutorials/scripting/gdscript/gdscript_advanced.html#for-while

testStart("Loops");

// While
assert('while(true) "ok"', 'while true: "ok"');
assert(`while(true) {
  if(true) break;
  else continue;
}`, `while true:
\tif true: break
\telse: continue`);

// For
assert("for (let i = 0; i < 10; i++) {}", "for i in range(10):\n\tpass");
assert("for (let i = 5; i < 10; i++) {}", "for i in range(5, 10):\n\tpass");
assert("for (let i = 5; i < 10; i += 2) {}", "for i in range(5, 10, 2):\n\tpass");
assert("for (let i = 10; i > 0; i--) {}", `for i in range(10, 0, -1):\n\tpass`);

// For in
assert("for (let x in [5, 7, 11]);", "for x in [5, 7, 11]: pass");
assert("for (let x in arr);", "for x in arr: pass");
assert("for (let x in range(3));", "for x in range(3): pass");
assert("for (let x in 'Hello');", "for x in 'Hello': pass");

// Brackets
assert(`for (let i = 0; i < 5; i++) {
  if(bool) {
    while(true) {
      break;
    }
  }
}`, `for i in range(5):
\tif bool:
\t\twhile true:
\t\t\tbreak`);

// For of

testEnd();