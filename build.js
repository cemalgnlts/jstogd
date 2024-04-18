import { build } from "esbuild";

build({
  entryPoints: [
    "./src/index.ts"
  ],
  outfile: "dist/jstogd.min.js",
  platform: "browser",
  bundle: true,
  minify: true,
  target: "es2020",
  globalName: "jsToGd"
});

build({
  entryPoints: [
    "./src/index.ts"
  ],
  outfile: "dist/jstogd.esm.js",
  platform: "browser",
  format: "esm",
  bundle: true,
  minify: true,
  target: "es2020"
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