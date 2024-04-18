import { type ExpressionStatement, type ForInStatement, type ForStatement, type Identifier, type IfStatement, type Literal, type ReturnStatement, type Statement, type SwitchCase, type SwitchStatement, type VariableDeclarator, type WhileStatement } from "acorn";

import { decrIndent, incrIndent, parseBlock, write } from "./index.ts";

let isIfUsed = false;

const unimplemented = (type: string) => Error("Unimplemented statement type: " + type);

export function parseStatement(statement: Statement) {
  switch (statement.type) {
    case "ExpressionStatement": expressionStatement(statement); break;
    case "BlockStatement": blockStatement(statement.body); break;
    case "EmptyStatement": write("pass"); break;
    case "DebuggerStatement": throw unimplemented(statement.type);
    case "WithStatement": throw unimplemented(statement.type);
    case "ReturnStatement": returnStatement(statement); break;
    case "LabeledStatement": throw unimplemented(statement.type);
    case "BreakStatement": write("break"); break;
    case "ContinueStatement": write("continue"); break;
    case "IfStatement": ifStatement(statement); break;
    case "SwitchStatement": switchStatement(statement); break;
    case "ThrowStatement": throw unimplemented(statement.type);
    case "TryStatement": throw unimplemented(statement.type);
    case "WhileStatement": whileStatement(statement); break;
    case "DoWhileStatement": throw unimplemented(statement.type);
    case "ForStatement": forStatement(statement); break;
    case "ForInStatement": forInStatement(statement); break;
    case "ForOfStatement": throw unimplemented(statement.type);
  }
}

// #region ExpressionStatement
function expressionStatement({ expression, directive }: ExpressionStatement) {
  if (!directive) {
    parseBlock(expression);
  } else if (directive) {
    const raw = directive.replace("use ", "");

    parseBlock({
      type: "Literal",
      value: raw,
      raw: raw
    });
  }
}
// #endregion

// #region BlockStatement
function blockStatement(body: Statement[]) {
  incrIndent();

  const bodySize = body.length;

  for (let i = 0; i < bodySize; i++) {
    write("\n");

    // New line before IfStatement.
    if (i > 0 && body[i].type == "IfStatement") write("\n");

    parseBlock(body[i]);
  }

  if (body.length === 0) {
    write("\n");
    write("pass");
  }

  decrIndent();

  write("\n");
}
// #endregion

// #ReturnStatement
function returnStatement({ argument }: ReturnStatement) {
  write("return");

  if (argument) {
    write(" ");
    parseBlock(argument);
  }
}
// #endregion

// #region WhileStatement
function whileStatement({ test, body }: WhileStatement) {
  write("while ");
  parseBlock(test);

  write(body.type !== "BlockStatement" ? ": " : ":");

  parseBlock(body);
}
// #endregion

// #region SwitchStatement
function switchStatement({ discriminant, cases }: SwitchStatement) {
  write("match ");
  parseBlock(discriminant);
  write(":");
  write("\n");

  incrIndent();
  switchCase(cases);
  decrIndent();
}

function switchCase(cases: SwitchCase[]) {
  const caseSize = cases.length;

  for (let i = 0; i < caseSize; i++) {
    const { consequent, test } = cases[i];
    const conSize = consequent.length;

    if (test && test.type) parseBlock(test);
    else write("_");

    write(":");
    write("\n");

    incrIndent();

    for (let j = 0; j < conSize; j++) {
      if (consequent[j].type === "BreakStatement") continue;

      parseBlock(consequent[j]);
      write("\n");
    }

    decrIndent();
  }
}
// #endregion

// #region IfStatment
function ifStatement({ test, consequent, alternate }: IfStatement) {
  // Block the extra space before the elif block.
  if (isIfUsed && consequent.type !== "BlockStatement") write("\n");

  // Leave a new line before the if statement.
  write((isIfUsed ? "el" : "") + "if ");
  parseBlock(test);
  write(":");

  // If it is a single line if, leave a space after the colon, 
  // if not, there is no need for a space.
  if (consequent.type !== "BlockStatement") write(" ");

  parseBlock(consequent);

  isIfUsed = true;

  if (alternate) {
    // Manual \n for else
    if (alternate.type !== "IfStatement" && alternate.type !== "BlockStatement") write("\n");

    if (alternate.type === "BlockStatement") write("else:", (consequent.type !== "BlockStatement") ? " " : "");
    else if (alternate.type !== "IfStatement") write("else: ");

    parseBlock(alternate);
  }

  isIfUsed = false;
}
// #endregion

// #region ForStatement
function forStatement({ init, test, update, body }: ForStatement) {
  let varName = "_";
  let numStart = 0;
  let numMax = 0;
  let numIncr = 1; // ++

  if (init) {
    if (init.type !== "VariableDeclaration") throw Error("ForStatment 'init' param require 'VariableDeclaration'.");

    const { name, value } = parseVariableDeclaration(init.declarations[0]);

    varName = name;
    numStart = value;
  }

  if (test && test.type === "BinaryExpression") {
    const right = test.right as Literal;

    numMax = right.value as number;
  }

  if (update) {
    if (update.type === "UpdateExpression") {
      const { operator } = update;

      if (operator === "--") numIncr = -1;
    } else if (update.type === "AssignmentExpression") {
      const { operator, right } = update;
      const { value } = right as Literal;

      if (operator === "+=") numIncr = value as number;
      else if (operator === "-=") numIncr = -value! as number;
    }
  }

  const params = [];

  if (numStart !== 0) params.push(numStart);
  if (numMax !== 0 || (numStart > numMax)) params.push(numMax);
  if (numIncr !== 1) params.push(numIncr);

  write("for ", varName, " in ", "range(", params.join(", "), "):");

  if (body.type !== "BlockStatement") write(" ");

  parseBlock(body);
}

function parseVariableDeclaration({ id, init }: VariableDeclarator) {
  return {
    name: (id as Identifier).name,
    value: (init as Literal).value as number ?? 0
  };
}
// #endregion

// #region
function forInStatement({ left, right, body }: ForInStatement) {
  if (left.type === "VariableDeclaration") {
    // @ts-expect-error Hack for skipping variable kind name write.
    left.kind = "";
  }

  write("for ");
  parseBlock(left);
  write(" in ");
  parseBlock(right);

  write(body.type !== "BlockStatement" ? ": " : ":");

  parseBlock(body);
}
// #endregion