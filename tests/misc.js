import { testStart, assert, testEnd } from "./testHelper.js";

// https://docs.godotengine.org/en/stable/tutorials/scripting/gdscript/gdscript_basics.html#classes-and-resources
// https://docs.godotengine.org/en/stable/tutorials/scripting/gdscript/gdscript_basics.html#exports
// https://docs.godotengine.org/en/stable/tutorials/scripting/gdscript/gdscript_basics.html#properties-setters-and-getters

testStart("Misc");

// Import
assert('import Player from "/scripts/Player.js";', 'const Player = preload("res://scripts/Player.gd")');
assert('const Player = import("/scripts/Player.js");', 'const Player = load("res://scripts/Player.gd")');

// String literal
assert('const POWER = 10;\nprint(`Power is = ${POWER}`)', 'const POWER = 10\nprint("Power is = {POWER}".format({ "POWER": POWER }))');
assert("`1 = ${a}, 2 = ${b}`", '"1 = {a}, 2 = {b}".format({ "a": a, "b": b })');

// Await
assert("async function main() { await a; }", "func main():\n\tawait a");

assert(`"use class_name Test extends Scene"
function test() {
  print("ok");
}`, `class_name Test extends Scene
func test():
\tprint("ok")`);

testEnd();