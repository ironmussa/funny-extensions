// Build the plugin to a single ESM bundle.
//
// react / react/jsx-runtime / @funny/host stay EXTERNAL (host-provided via the
// import map). swagger-ui-dist ships a self-contained UMD bundle that mounts its
// OWN isolated React app into a DOM node — it does not use the host's React tree
// (no shared-hooks conflict), so bundling it in is fine. Its stylesheet is
// imported as text and injected at runtime.
import { build } from 'esbuild';

await build({
  entryPoints: ['src/index.tsx'],
  bundle: true,
  format: 'esm',
  jsx: 'automatic',
  loader: { '.css': 'text' },
  external: ['react', 'react/jsx-runtime', '@funny/host'],
  define: { 'process.env.NODE_ENV': '"production"' },
  outfile: 'dist/index.mjs',
  logLevel: 'info',
});
