// Build the plugin to a single ESM bundle.
//
// react / react/jsx-runtime / @funny/host stay EXTERNAL (host-provided via the
// import map). `marked` (markdown → HTML for markdown cells) is bundled in.
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
