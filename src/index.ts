import type { Statement, Expression, Declaration, ModuleDeclaration } from "acorn";

import { Parser } from "acorn";

import { parseStatement } from "./statements.ts";
import { parseExpression } from "./expressions.ts";
import { parseDeclaration } from "./declarations.ts";

const code: string[] = [];

export let indent = "";

export function transpileString(input: string) {
  code.length = 0;
  indent = "";

  const data = Parser.parse(input, {
    ecmaVersion: "latest",
    sourceType: "module"
  });

  const bodySize = data.body.length;

  for (let i = 0; i < bodySize; i++) {
    parseBlock(data.body[i]);
    write("\n");
  }

  code.push(""); // Line feed.

  const codeStr = code.join("");
  code.length = 0;

  return codeStr;
}

export function parseBlock(block: unknown) {
  if ((block as Statement).type.endsWith("Statement")) parseStatement(block as Statement);
  else if ((block as Declaration).type.endsWith("Declaration")) parseDeclaration(block as Declaration | ModuleDeclaration);
  else parseExpression(block as Expression);
}

export function incrIndent() {
  indent += "\t";
}

export function decrIndent() {
  indent = indent.slice(1);
}

export function write(...items: Array<string | undefined>) {
  // Apply the tab character only to the first character of the new line.
  if (indent.length > 0 && code[code.length - 1] === "\n" && items[0] !== "\n") code.push(indent);

  code.push(items.join(""));
}
