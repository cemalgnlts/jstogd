import { testStart, assert, testEnd } from "./testHelper.js";

// https://docs.godotengine.org/en/stable/tutorials/scripting/gdscript/gdscript_basics.html#class-dictionary

testStart("Objects");

assert("const obj = {}", "const obj = {}");
assert("const player = { power: 50 }", 'const player = { "power": 50 }');
assert(`const player = {
  power: 50,
  name: "ABC",
  level: 1,
  tutorial: false
}`, `const player = {
\t"power": 50,
\t"name": "ABC",
\t"level": 1,
\t"tutorial": false
}`);
assert('const obj = { "quoted": true, [computed]: true, \'key\': val }', 'const obj = { "quoted": true, computed: true, \'key\': val }');
assert("const obj = { shortand }", 'const obj = { "shortand": shortand }');

testEnd();