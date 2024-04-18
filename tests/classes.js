import { testStart, assert, testEnd } from "./testHelper.js";

// https://docs.godotengine.org/en/stable/tutorials/scripting/gdscript/gdscript_basics.html#classes

testStart("Classes");

assert("export default class Player {}", "class_name Player");

assert(`export default class {
  power = 10;
}`, "var power = 10");

assert(`export default class extends Node {
  power = 10;
}`, "extends Node\n\nvar power = 10");

assert(`export default class Player extends Node {
  print() {
    print("ok");
  }
}`, `class_name Player extends Node\n
func print():
\tprint("ok")`);

// Inline.
assert(`class Test {

}`, `class Test:
\tpass`);

assert(`class Test {
  static name = "ok";
  power = 20;
  data = { level: 1 }
}`, `class Test:
\tstatic var name = "ok"
\tvar power = 20
\tvar data = { "level": 1 }`)

assert(`class Test extends Node {
  name = "ok";

  print(name = "no name") {
    print(name);
  }

  static add(a, b) {
    return a + b
  }

  getName() {
    return name;
  }
}`, `class Test extends Node:
\tvar name = "ok"

\tfunc print(name := "no name"):
\t\tprint(name)

\tstatic func add(a, b):
\t\treturn a + b

\tfunc getName():
\t\treturn name`);

// Default & inline
assert(`export default class {
  constructor() {
    print("Constructor");
  }

  getLogger() {
    const logger = new Logger(1);
    print(logger.level);
  }
}

class Logger {
  level = 0;

  constructor() {
    print("Logger:Initialized");
  }
}`, `func _init():
\tprint("Constructor")

func getLogger():
\tconst logger = Logger.new(1)
\tprint(logger.level)


class Logger:
\tvar level = 0

\tfunc _init():
\t\tprint("Logger:Initialized")`);

testEnd();