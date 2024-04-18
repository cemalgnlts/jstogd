import { testStart, assert, testEnd } from "./testHelper.js";

// https://docs.godotengine.org/en/stable/tutorials/scripting/gdscript/gdscript_basics.html#if-else-elif

testStart("Conditions");

// Shortand
assert('if (1 + 1 === 2) "ok"', 'if 1 + 1 == 2: "ok"');
assert(`if (1 + 1 === 2) "ok"
else "not ok"`, `if 1 + 1 == 2: "ok"
else: "not ok"`);
assert(`if (true) "ok"
else if(true) "also ok"
else "not ok"`, `if true: "ok"
elif true: "also ok"
else: "not ok"`);

// Ternary
assert(`let x = true ? 1 : 0
let y = 0
y < 10 ? y += 3 : -1`, `var x = 1 if true else 0
var y = 0
y += 3 if y < 10 else -1`);

assert(`count === 2 ? "apple" :
  count === 1 ? "pear" :
  count === 0 ? "banana" :
  "orange"`, `"apple" if count == 2 else "pear" if count == 1 else "banana" if count == 0 else "orange"`);

// Block statement
assert(`if(true) {
\t"ok"
}`, `if true:
\t"ok"`);

assert(`if(true) {
\t"ok"
} else {
\t"not ok";
}`, `if true:
\t"ok"
else:
\t"not ok"`);

assert(`if(true) {
\t"ok"
} else if(true) {
  "also ok";
} else {
\t"not ok";
}`, `if true:
\t"ok"
elif true:
\t"also ok"
else:
\t"not ok"`);

// Switch
assert(`switch(true) {
  case 1: "ok"; break;
}`, `match true:
\t1:
\t\t"ok"`);
assert(`switch(x) {
  case 1:
    print("It's one!");
    break;
  case 2:
    print("It's one times two!");
    break;
  default:
    print("It's not 1 or 2. I don't care to be honest.");
}`, `match x:
\t1:
\t\tprint("It's one!")
\t2:
\t\tprint("It's one times two!")
\t_:
\t\tprint("It's not 1 or 2. I don't care to be honest.")`)

testEnd();