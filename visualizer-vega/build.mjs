// Build the plugin to a single ESM bundle.
//
// react / react/jsx-runtime / @funny/host stay EXTERNAL (host-provided via the
// import map — never bundle a second React). vega + vega-lite + vega-embed are
// bundled in. vega-embed's CSS is imported as text and injected at runtime.
import { build } from 'esbuild';

await build({
  entryPoints: ['src/index.tsx'],
  bundle: true,
  format: 'esm',
  jsx: 'automatic',
  loader: { '.css': 'text' },
  external: ['react', 'react/jsx-runtime', '@funny/host'],
  outfile: 'dist/index.mjs',
  logLevel: 'info',
});
