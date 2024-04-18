import { testStart, assert, testEnd } from "./testHelper.js";

// https://docs.godotengine.org/en/stable/tutorials/scripting/gdscript/gdscript_basics.html#expressions

testStart("Expressions");

assert("2 + 2", "2 + 2"); // Binary operation.
assert("-5", "-5"); // Unary operation.
assert('x > 4 ? "okay" : "not okay"', '"okay" if x > 4 else "not okay"'); // Ternary operation.
assert("x", "x"); // Identifier representing variable or constant.
assert("x.a", "x.a"); // Attribute access.
assert("x > 2 || x < 5", "x > 2 || x < 5"); // Comparisons and logic operators.
assert("x == y + 2", "x == y + 2"); // Equality test.
assert("do_something()", "do_something()"); // Function call.
assert("[1, 2, 3]", "[1, 2, 3]"); // Array definition.
assert("({ A: 1, B: 2 })", '{ "A": 1, "B": 2 }'); // Dictionary definition.
assert("this", "self"); // Reference to current instance.

testEnd();