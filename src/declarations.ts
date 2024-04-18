import type { AssignmentPattern, ClassBody, ClassDeclaration, Declaration, ExportDefaultDeclaration, FunctionDeclaration, Identifier, ImportDeclaration, ImportSpecifier, Literal, MethodDefinition, ModuleDeclaration, PropertyDefinition, VariableDeclaration, VariableDeclarator } from "acorn";

import { decrIndent, incrIndent, parseBlock, write } from "./index.ts";

/**
 * -------- default:
 * class_name Player
 * 
 * func _init():
 *  pass
 * 
 * --------- inline:
 * class_name Player
 * 
 * func _init():
 *  pass
 * 
 * class Inline:
 *  func _init():
 *  pass
 */
let isDefaultClass = false;

const unimplemented = (type: string) => Error("Unimplemented declaration type: " + type);

export function parseDeclaration(declaration: Declaration | ModuleDeclaration) {
  switch (declaration.type) {
    case "FunctionDeclaration": functionDeclaration(declaration); break;
    case "VariableDeclaration": variableDeclaration(declaration); break;
    case "ClassDeclaration": classDeclaration(declaration); break;
    case "ImportDeclaration": importDeclaration(declaration); break;
    case "ExportNamedDeclaration": throw unimplemented(declaration.type);
    case "ExportDefaultDeclaration": exportDefaultDeclaration(declaration); break;
    case "ExportAllDeclaration": throw unimplemented(declaration.type);
  }
}

// #region FunctionDeclaration
function functionDeclaration({ id, params, body }: FunctionDeclaration) {
  write("func ");
  parseBlock(id);

  write("(");

  const paramsSize = params.length;

  for (let i = 0; i < paramsSize; i++) {
    if (params[i].type === "AssignmentPattern") assignmentPattern(params[i] as AssignmentPattern);
    else parseBlock(params[i]);

    if (i + 1 < paramsSize) write(", ");
  }

  write("):");

  parseBlock(body);
}

function assignmentPattern({ left, right }: AssignmentPattern) {
  parseBlock(left);
  write(" := ");
  parseBlock(right);
}
// #endregion

// #region VariableDeclaration
function variableDeclaration(statement: VariableDeclaration) {
  let { kind, declarations } = statement;
  const size = declarations.length;

  for (let i = 0; i < size; i++) {
    variableDeclarator(kind, declarations[i]);

    if (size > 1) write("\n");
  }
}

function variableDeclarator(kind: "var" | "let" | "const", declarator: VariableDeclarator) {
  if (kind === "let") kind = "var";

  // Hack for skipping declare kind.
  write(kind, kind.length > 0 ? " " : "");
  parseBlock(declarator.id);

  if (declarator.init && (declarator.init as Identifier).name !== "undefined") {
    write(" = ");
    parseBlock(declarator.init);
  }
}
// #endregion

// #region ClassDeclaration
function classDeclaration({ id, superClass, body }: ClassDeclaration) {
  if (id) {
    write("class" + (isDefaultClass ? "_name " : " "));
    parseBlock(id);
  }

  if (superClass) {
    write(" extends ");
    parseBlock(superClass);
  }

  if (!isDefaultClass) write(":");

  write(isDefaultClass ? "\n\n" : "\n");

  if (!isDefaultClass) incrIndent();

  classBody(body);

  if (!isDefaultClass) decrIndent();
}

function classBody({ body }: ClassBody) {
  const bodySize = body.length;

  if (bodySize === 0) {
    if (!isDefaultClass) write("pass");
    return;
  }

  let newLineBeforeMethods = false;

  for (let i = 0; i < bodySize; i++) {
    if (body[i].type === "PropertyDefinition") {
      propertyDefinition(body[i] as PropertyDefinition);
      newLineBeforeMethods = true;
    } else if (body[i].type === "MethodDefinition") {
      if (newLineBeforeMethods) write("\n");
      newLineBeforeMethods = false;

      methodDefinition(body[i] as MethodDefinition);
    }
  }
}

function propertyDefinition({ key, value, static: static_ }: PropertyDefinition) {
  write((static_ ? "static " : "") + "var ");
  parseBlock(key);

  if (value) {
    write(" = ");
    parseBlock(value);
  }

  write("\n");
}

function methodDefinition({ static: static_, key, value }: MethodDefinition) {
  write((static_ ? "static " : "") + "func ");

  if (key.type === "Identifier" && key.name === "constructor") {
    key.name = "_init";
  }

  parseBlock(key);
  parseBlock(value);
}
// #endregion

// #region ImportDeclaration
function importDeclaration({ specifiers, source }: ImportDeclaration) {
  write("const ");
  write((specifiers[0] as ImportSpecifier).local.name);
  write(" = preload(");

  let filePath = (source as Literal).value as string;
  filePath = filePath.replace(".js", ".gd");
  
  write(`"res:/${filePath}")`);
}
// #endregion

// #region ExportDefaultDeclaration
function exportDefaultDeclaration({ declaration }: ExportDefaultDeclaration) {
  if (declaration.type === "ClassDeclaration") {
    isDefaultClass = true;
  }

  parseBlock(declaration);

  isDefaultClass = false;
}
// #endregion
