// Build the plugin to a single ESM bundle.
//
// react / react/jsx-runtime / @funny/host stay EXTERNAL (the funny host provides
// those at runtime via its import map — never bundle a second React). The
// @hpcc-js/wasm-graphviz dep embeds its wasm as base64, so it bundles into one
// self-contained file with no side-loaded .wasm to serve.
import { build } from 'esbuild';

await build({
  entryPoints: ['src/index.tsx'],
  bundle: true,
  format: 'esm',
  jsx: 'automatic',
  external: ['react', 'react/jsx-runtime', '@funny/host'],
  outfile: 'dist/index.mjs',
  logLevel: 'info',
});
