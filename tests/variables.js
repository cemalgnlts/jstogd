import { testStart, assert, testEnd } from "./testHelper.js";

// https://docs.godotengine.org/en/stable/tutorials/scripting/gdscript/gdscript_basics.html#variables

testStart("Varibles");

// var
assert("var name", "var name");
assert("var name = undefined", "var name");

// let
assert("let name = null", "var name = null");
assert("let name = 1", "var name = 1");

// const
assert('const name = "var"', 'const name = "var"');
assert("const name = 'var'", "const name = 'var'");

// multiple
assert(`let a = 1
let b = 2`, `var a = 1
var b = 2`);
assert("let a, b", `var a
var b`);
assert("let a = 1, b = 2", `var a = 1
var b = 2`);
assert("let a = 1, b", `var a = 1
var b`);

// assignment
assert(`let a
a = 1`, `var a
a = 1`);
assert(`let a = 1
let b = 2.5
let c = a + b`, `var a = 1
var b = 2.5
var c = a + b`);
assert(`let a
a = "str"
a = 2`, `var a
a = "str"
a = 2`);

testEnd();