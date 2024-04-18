import { testStart, assert, testEnd } from "./testHelper.js";

// https://docs.godotengine.org/en/stable/tutorials/scripting/gdscript/gdscript_basics.html#classes

testStart("Common");

const input = `import Player from "/scripts/Player.js";

export default class MyClass extends BaseClass {
  a = 5;
  s = "Hello";
  arr = [1, 2, 3];
  dict = {"key": "value", 2: 3};
  other_dict = {key: "value", other_key: 2};
  typed_var;
  inferred_type = "String";

  ANSWER = 42;
  THE_NAME = "Charly";

  v2 = Vector2(1, 2);
  v3 = Vector3(1, 2, 3);

  some_function(param1, param2, param3) {
    const local_const = 5;

    if (param1 < local_const) {
      print(param1);
    } else if (param2 > 5) {
      print(param2);
    } else {
       print("Fail!");
    }

    for (let i = 0; i < 20; i++) {
      print(i);
    }

    while (param2 != 0) {
      param2 -= 1;
    }

    switch(param3) {
      case 3:
        print("param3 is 3!");
        break;
      default:
        print("param3 is not 3!");
    }

    let local_var = param1 + 3;
    return local_var;
  }

  other_something(p1, p2) {
    super.something(p1, p2)
  }

  constructor() {
    print("Constructed!")
    new Player().ready()
    var lv = Something.new()
    print(lv.a)
  }
}

class Something {
  a = 10
}`;

const expect = `const Player = preload("res://scripts/Player.gd")
class_name MyClass extends BaseClass

var a = 5
var s = "Hello"
var arr = [1, 2, 3]
var dict = { "key": "value", 2: 3 }
var other_dict = { "key": "value", "other_key": 2 }
var typed_var
var inferred_type = "String"
var ANSWER = 42
var THE_NAME = "Charly"
var v2 = Vector2(1, 2)
var v3 = Vector3(1, 2, 3)

func some_function(param1, param2, param3):
\tconst local_const = 5

\tif param1 < local_const:
\t\tprint(param1)
\telif param2 > 5:
\t\tprint(param2)
\telse:
\t\tprint("Fail!")

\tfor i in range(20):
\t\tprint(i)

\twhile param2 != 0:
\t\tparam2 -= 1

\tmatch param3:
\t\t3:
\t\t\tprint("param3 is 3!")
\t\t_:
\t\t\tprint("param3 is not 3!")

\tvar local_var = param1 + 3
\treturn local_var

func other_something(p1, p2):
\tsuper.something(p1, p2)

func _init():
\tprint("Constructed!")
\tPlayer.new().ready()
\tvar lv = Something.new()
\tprint(lv.a)


class Something:
\tvar a = 10`;

assert(input, expect);

testEnd();