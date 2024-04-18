(()=>{var m=document.getElementById("testTitle"),o=document.createElement("details"),l=0,i=0;function e(a){o=document.createElement("details");let n=document.createElement("summary");n.innerText=a,o.appendChild(n)}function r(){document.body.appendChild(o);let a=o.firstElementChild,n=a.innerHTML;o.firstElementChild.textContent=`${n} ${l}/${l+i}`,a.style.color=`#${i===0?"4caf50":"f44336"}`,i!==0&&(o.open=!0);let s=document.querySelectorAll("details:not(.inline)").length,c=document.querySelectorAll("details:not(.inline):not([open])").length;m.textContent=`Tests (${c}/${s})`,i=l=0}function p(a){let n=document.createElement("p");n.innerHTML=a,o.appendChild(n)}function t(a,n){let s;try{s=jsToGd.transpileString(a).trim()}catch(c){s=c.message}if(n===s){l++,p(`<p><font color=4caf50>[PASSED]:</font> ${a}</p>`);return}i++,p(`<details class="inline">
    <summary><font color=f44336>[FAILED]:</font> ${a}</summary>
    <table>
      <tr>
        <td>JavaScript</td>
        <td>GDScript</td>
        <td>Output</td>
      </tr>
      <tr>
        <td><pre><code>${a}</code></pre></td>
        <td><pre><code>${n}</code></pre></td>
        <td><pre><code>${s}</code></pre></td>
      </tr>
    </table>
  </details>`)}e("Varibles");t("var name","var name");t("var name = undefined","var name");t("let name = null","var name = null");t("let name = 1","var name = 1");t('const name = "var"','const name = "var"');t("const name = 'var'","const name = 'var'");t(`let a = 1
let b = 2`,`var a = 1
var b = 2`);t("let a, b",`var a
var b`);t("let a = 1, b = 2",`var a = 1
var b = 2`);t("let a = 1, b",`var a = 1
var b`);t(`let a
a = 1`,`var a
a = 1`);t(`let a = 1
let b = 2.5
let c = a + b`,`var a = 1
var b = 2.5
var c = a + b`);t(`let a
a = "str"
a = 2`,`var a
a = "str"
a = 2`);r();e("Expressions");t("2 + 2","2 + 2");t("-5","-5");t('x > 4 ? "okay" : "not okay"','"okay" if x > 4 else "not okay"');t("x","x");t("x.a","x.a");t("x > 2 || x < 5","x > 2 || x < 5");t("x == y + 2","x == y + 2");t("do_something()","do_something()");t("[1, 2, 3]","[1, 2, 3]");t("({ A: 1, B: 2 })",'{ "A": 1, "B": 2 }');t("this","self");r();e("Conditions");t('if (1 + 1 === 2) "ok"','if 1 + 1 == 2: "ok"');t(`if (1 + 1 === 2) "ok"
else "not ok"`,`if 1 + 1 == 2: "ok"
else: "not ok"`);t(`if (true) "ok"
else if(true) "also ok"
else "not ok"`,`if true: "ok"
elif true: "also ok"
else: "not ok"`);t(`let x = true ? 1 : 0
let y = 0
y < 10 ? y += 3 : -1`,`var x = 1 if true else 0
var y = 0
y += 3 if y < 10 else -1`);t(`count === 2 ? "apple" :
  count === 1 ? "pear" :
  count === 0 ? "banana" :
  "orange"`,'"apple" if count == 2 else "pear" if count == 1 else "banana" if count == 0 else "orange"');t(`if(true) {
	"ok"
}`,`if true:
	"ok"`);t(`if(true) {
	"ok"
} else {
	"not ok";
}`,`if true:
	"ok"
else:
	"not ok"`);t(`if(true) {
	"ok"
} else if(true) {
  "also ok";
} else {
	"not ok";
}`,`if true:
	"ok"
elif true:
	"also ok"
else:
	"not ok"`);t(`switch(true) {
  case 1: "ok"; break;
}`,`match true:
	1:
		"ok"`);t(`switch(x) {
  case 1:
    print("It's one!");
    break;
  case 2:
    print("It's one times two!");
    break;
  default:
    print("It's not 1 or 2. I don't care to be honest.");
}`,`match x:
	1:
		print("It's one!")
	2:
		print("It's one times two!")
	_:
		print("It's not 1 or 2. I don't care to be honest.")`);r();e("Loops");t('while(true) "ok"','while true: "ok"');t(`while(true) {
  if(true) break;
  else continue;
}`,`while true:
	if true: break
	else: continue`);t("for (let i = 0; i < 10; i++) {}",`for i in range(10):
	pass`);t("for (let i = 5; i < 10; i++) {}",`for i in range(5, 10):
	pass`);t("for (let i = 5; i < 10; i += 2) {}",`for i in range(5, 10, 2):
	pass`);t("for (let i = 10; i > 0; i--) {}",`for i in range(10, 0, -1):
	pass`);t("for (let x in [5, 7, 11]);","for x in [5, 7, 11]: pass");t("for (let x in arr);","for x in arr: pass");t("for (let x in range(3));","for x in range(3): pass");t("for (let x in 'Hello');","for x in 'Hello': pass");t(`for (let i = 0; i < 5; i++) {
  if(bool) {
    while(true) {
      break;
    }
  }
}`,`for i in range(5):
	if bool:
		while true:
			break`);r();e("Objects");t("const obj = {}","const obj = {}");t("const player = { power: 50 }",'const player = { "power": 50 }');t(`const player = {
  power: 50,
  name: "ABC",
  level: 1,
  tutorial: false
}`,`const player = {
	"power": 50,
	"name": "ABC",
	"level": 1,
	"tutorial": false
}`);t(`const obj = { "quoted": true, [computed]: true, 'key': val }`,`const obj = { "quoted": true, computed: true, 'key': val }`);t("const obj = { shortand }",'const obj = { "shortand": shortand }');r();e("Classes");t("export default class Player {}","class_name Player");t(`export default class {
  power = 10;
}`,"var power = 10");t(`export default class extends Node {
  power = 10;
}`,`extends Node

var power = 10`);t(`export default class Player extends Node {
  print() {
    print("ok");
  }
}`,`class_name Player extends Node

func print():
	print("ok")`);t(`class Test {

}`,`class Test:
	pass`);t(`class Test {
  static name = "ok";
  power = 20;
  data = { level: 1 }
}`,`class Test:
	static var name = "ok"
	var power = 20
	var data = { "level": 1 }`);t(`class Test extends Node {
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
}`,`class Test extends Node:
	var name = "ok"

	func print(name := "no name"):
		print(name)

	static func add(a, b):
		return a + b

	func getName():
		return name`);t(`export default class {
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
}`,`func _init():
	print("Constructor")

func getLogger():
	const logger = Logger.new(1)
	print(logger.level)


class Logger:
	var level = 0

	func _init():
		print("Logger:Initialized")`);r();e("Functions");t("function name() {}",`func name():
	pass`);t("function name(a, b = 1) {}",`func name(a, b := 1):
	pass`);t(`function sum(a, b) {
  return a + b;
}`,`func sum(a, b):
	return a + b`);t("const sum = (a, b = 0) => a + b","const sum = func(a, b := 0): return a + b");r();e("Misc");t('import Player from "/scripts/Player.js";','const Player = preload("res://scripts/Player.gd")');t('const Player = import("/scripts/Player.js");','const Player = load("res://scripts/Player.gd")');t("const POWER = 10;\nprint(`Power is = ${POWER}`)",`const POWER = 10
print("Power is = {POWER}".format({ "POWER": POWER }))`);t("`1 = ${a}, 2 = ${b}`",'"1 = {a}, 2 = {b}".format({ "a": a, "b": b })');t("async function main() { await a; }",`func main():
	await a`);t(`"use class_name Test extends Scene"
function test() {
  print("ok");
}`,`class_name Test extends Scene
func test():
	print("ok")`);r();e("Common");var u=`import Player from "/scripts/Player.js";

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
}`,d=`const Player = preload("res://scripts/Player.gd")
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
	const local_const = 5

	if param1 < local_const:
		print(param1)
	elif param2 > 5:
		print(param2)
	else:
		print("Fail!")

	for i in range(20):
		print(i)

	while param2 != 0:
		param2 -= 1

	match param3:
		3:
			print("param3 is 3!")
		_:
			print("param3 is not 3!")

	var local_var = param1 + 3
	return local_var

func other_something(p1, p2):
	super.something(p1, p2)

func _init():
	print("Constructed!")
	Player.new().ready()
	var lv = Something.new()
	print(lv.a)


class Something:
	var a = 10`;t(u,d);r();})();
