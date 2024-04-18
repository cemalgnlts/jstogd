import { build } from "esbuild";

build({
  entryPoints: [
    "./src/index.ts"
  ],
  outfile: "dist/jstogd.js",
  bundle: true,
  platform: "browser",
  minify: true,
  target: "es2020",
  globalName: "jsToGd"
});

build({
  entryPoints: [
    "./tests/index.js"
  ],
  external: ["./jstogd.js"],
  outfile: "dist/tests.js",
  bundle: true,
  platform: "browser",
  minify: true,
  target: "es2020"
});