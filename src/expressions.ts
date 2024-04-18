import type { ArrayExpression, ArrowFunctionExpression, AssignmentExpression, AssignmentPattern, AwaitExpression, BinaryExpression, CallExpression, ConditionalExpression, Expression, FunctionExpression, Identifier, ImportExpression, Literal, LogicalExpression, MemberExpression, NewExpression, ObjectExpression, Property, TemplateLiteral, UnaryExpression, UpdateExpression } from "acorn";

import { decrIndent, incrIndent, parseBlock, write } from "./index.ts";

const unimplemented = (type: string) => Error("Unimplemented expression type: " + type);

export function parseExpression(expression: Expression) {
  switch (expression.type) {
    case "Identifier": write(expression.name); break;
    case "Literal": literal(expression); break;
    case "ThisExpression": write("self"); break;

    case "ArrayExpression": arrayExpression(expression); break;
    case "ObjectExpression": objectExpression(expression); break;
    case "FunctionExpression": functionExpression(expression); break;
    case "UnaryExpression": unaryExpression(expression); break;
    case "UpdateExpression": updateExpression(expression); break;
    case "BinaryExpression": binaryExpression(expression); break;
    case "AssignmentExpression": assignmentExpression(expression); break;
    case "LogicalExpression": logicalExpression(expression); break;
    case "MemberExpression": memberExpression(expression); break;
    case "ConditionalExpression": conditionalExpression(expression); break;
    case "CallExpression": callExpression(expression); break;
    case "NewExpression": newExpression(expression); break;
    case "SequenceExpression": throw unimplemented(expression.type);
    case "ArrowFunctionExpression": arrowFunctionExpression(expression); break;
    case "YieldExpression": throw unimplemented(expression.type);
    case "TemplateLiteral": templateLiteral(expression); break;
    case "TaggedTemplateExpression": throw unimplemented(expression.type);
    case "ClassExpression": throw unimplemented(expression.type);
    case "MetaProperty": throw unimplemented(expression.type);
    case "AwaitExpression": awaitExpression(expression); break;
    case "ChainExpression": throw unimplemented(expression.type);
    case "ImportExpression": importExpression(expression); break;
    case "ParenthesizedExpression": throw unimplemented(expression.type);
  }
}

// #region Literal
function literal({ raw }: Literal) {
  if (!raw) return undefined;

  return write(raw);
}
// #endregion

// #region ArrayExpression
function arrayExpression({ elements }: ArrayExpression) {
  write("[");

  const elementSize = elements.length;

  for (let i = 0; i < elementSize; i++) {
    parseBlock(elements[i]);

    if (i + 1 < elementSize) write(", ")
  }

  write("]");
}
// #endregion

// #region ObjectExpression
function objectExpression({ properties }: ObjectExpression) {
  const propSize = properties.length;

  if (propSize === 0) {
    write("{}");

    return;
  }

  // If there are more than 3 keys, make multiple rows.
  /**
   * { a: 1, b: 2, c: 3 }
   * -------------------
   * {
   *  a: 1,
   *  b: 2,
   *  c: 3
   *  d: 4
   * }
   */

  if (properties.length > 3) {
    write("{");
    write("\n");
  } else {
    write("{ ");
  }

  if (properties.length > 3) incrIndent();

  for (let i = 0; i < propSize; i++) {
    if (properties[i].type === "Property") property(properties[i] as Property);

    if (i + 1 < propSize) {
      write(",");

      if (properties.length > 3) write("\n");
      else write(" ");
    }
  }

  if (properties.length > 3) {
    decrIndent();
    write("\n}");
  } else {
    write(" }");
  }
}

function property({ key, value, computed, method }: Property) {
  if (method || value.type === "FunctionExpression" || value.type === "ArrowFunctionExpression") {
    throw Error("You cannot use methods inside objects. eg. const obj = { method() {}, anotherMet: () => {}, another: function() {} }");
  }

  if (!computed && (key.type !== "Literal" || key.type === "Literal" && !key.raw)) write('"');

  parseBlock(key);

  if (!computed && (key.type !== "Literal" || key.type === "Literal" && !key.raw)) write('"');

  write(": ");
  parseBlock(value);
}
// #endregion

// #region FunctionExpression
function functionExpression({ params, body }: FunctionExpression) {
  write("(");

  const paramsSize = params.length;

  for (let i = 0; i < paramsSize; i++) {
    if (params[i].type === "AssignmentPattern") assignmentPattern(params[i] as AssignmentPattern);
    else parseBlock(params[i]);

    if (i + 1 < paramsSize) write(", ");
  }

  write("):");

  parseBlock(body);

  write("\n");
}

function assignmentPattern({ left, right }: AssignmentPattern) {
  parseBlock(left);
  write(" := ");
  parseBlock(right);
}
// #endregion

// #region UnaryExpression
function unaryExpression({ operator, argument }: UnaryExpression) {
  write(operator);
  parseBlock(argument);
}
// #endregion

// #region UpdateExpression
function updateExpression({ prefix, operator, argument }: UpdateExpression) {
  if (prefix) write(operator);

  parseBlock(argument);

  if (!prefix) write(operator);
}
// #endregion

// #region LogicalExpression
function logicalExpression({ left, operator, right }: LogicalExpression) {
  parseBlock(left);
  write(" ", operator, " ");
  parseBlock(right);
}
// #endregion

// #region BinaryExpression
function binaryExpression({ left, operator, right }: BinaryExpression) {
  if (operator === "===") operator = "==";
  else if (operator === "!==") operator = "!="

  parseBlock(left);
  write(" ", operator, " ");
  parseBlock(right);
}
//#endregion

// #region AssignmentExpression
function assignmentExpression({ left, operator, right }: AssignmentExpression) {
  parseBlock(left);
  write(" ", operator, " ");
  parseBlock(right);
}
//#endregion

// #region MemberExpression
function memberExpression({ object, property, computed }: MemberExpression) {
  if (object.type === "Super") write("super");
  else parseBlock(object);

  write(computed ? "[" : ".");
  parseBlock(property);

  if (computed) write("]");
}
// #endregion

// #region ConditionalExpression
function conditionalExpression({ test, consequent, alternate }: ConditionalExpression) {
  parseBlock(consequent);
  write(" if ")
  parseBlock(test);
  write(" else ");
  parseBlock(alternate);
}
//#endregion

// #region CallExpression
function callExpression({ arguments: args, callee }: CallExpression) {
  const argSize = args.length;

  parseBlock(callee);
  write("(");

  for (let i = 0; i < argSize; i++) {
    parseBlock(args[i]);

    if (i + 1 < argSize) write(", ");
  }

  write(")");
}
//#endregion

// #region NewExpression
function newExpression({ callee, arguments: args }: NewExpression) {
  parseBlock(callee);
  write(".new(");

  const argsSize = args.length;

  for (let i = 0; i < argsSize; i++) {
    parseBlock(args[i]);

    if (i + 1 < argsSize) write(", ");
  }

  write(")");
}
// #endregion

// #region ArrowFunctionExpression
function arrowFunctionExpression({ params, body }: ArrowFunctionExpression) {
  write("func(")

  const paramsSize = params.length;

  for (let i = 0; i < paramsSize; i++) {
    if (params[i].type === "AssignmentPattern") assignmentPattern(params[i] as AssignmentPattern);
    else parseBlock(params[i]);

    if (i + 1 < paramsSize) write(", ");
  }

  write("): ");

  if (body.type !== "BlockStatement") write("return ");

  parseBlock(body);
}
// #endregion

// #region TemplateLiteral
function templateLiteral({ expressions, quasis }: TemplateLiteral) {
  write('"');

  const quasisSize = quasis.length;

  for (let i = 0; i < quasisSize; i++) {
    const { value: { raw }, tail } = quasis[i];

    write(raw);

    if (!tail) {
      const ident = expressions[i];

      if (ident.type !== "Identifier") throw Error("Only variable allowed: print(`VAR = ${variable}.`)");

      write("{")
      write(ident.name);
      write("}");
    }
  }

  const params = (expressions as Identifier[]).map((expr: Identifier) => `"${expr.name}": ${expr.name}`).join(", ");

  write('".format({ ', params, ' })');
}
// #endregion

// #region AwaitExpression
function awaitExpression({ argument }: AwaitExpression) {
  write("await ");
  parseBlock(argument);
}
// #endregion

// #region ImportExpression
function importExpression({ source }: ImportExpression) {
  write("load(",);

  if (source.type === "Literal") {
    if (source.value) source.value = source.value.toString().replace("/", "res://").replace(".js", ".gd");
    if (source.raw) source.raw = source.raw.replace("/", "res://").replace(".js", ".gd");
  }

  parseBlock(source);

  write(")");
}
//#endregion