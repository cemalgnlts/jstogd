import { testStart, assert, testEnd } from "./testHelper.js";

// https://docs.godotengine.org/en/stable/tutorials/scripting/gdscript/gdscript_basics.html#functions

testStart("Functions");

assert("function name() {}", "func name():\n\tpass");
assert("function name(a, b = 1) {}", "func name(a, b := 1):\n\tpass");
assert(`function sum(a, b) {
  return a + b;
}`, `func sum(a, b):
\treturn a + b`);

// Arrow Functions
assert("const sum = (a, b = 0) => a + b", "const sum = func(a, b := 0): return a + b");

testEnd();