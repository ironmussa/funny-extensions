# funny-extensions

Official visualizer extensions for [funny](https://github.com/argenisleon/funny) — a web UI for orchestrating multiple Claude Code agents in parallel.

Each folder is a standalone, installable funny extension that renders a specific file type or fenced code block in the thread view. Extensions are self-contained: they bundle their own dependencies and ship a pre-built `dist/index.mjs` that funny loads directly (it never runs your build on install).

## Visualizers

| Extension | Handles | Built on |
|---|---|---|
| [`visualizer-dbml`](visualizer-dbml) | ` ```dbml `, `.dbml` | `@dbml/parse` + React Flow + dagre — interactive ER diagram |
| [`visualizer-dot`](visualizer-dot) | ` ```dot `, `.dot`, `.gv` | `@hpcc-js/wasm-graphviz` — GraphViz → SVG (wasm embedded) |
| [`visualizer-vega`](visualizer-vega) | ` ```vega-lite `, ` ```vega ` | `vega-embed` — declarative charts |
| [`visualizer-jupyter`](visualizer-jupyter) | `.ipynb` | `marked` — nbformat-v4 renderer (cells + outputs) |
| [`visualizer-openapi`](visualizer-openapi) | ` ```openapi `, ` ```swagger ` | `swagger-ui-dist` + `js-yaml` — Swagger UI |

## Build your own

Start from [`visualizer-template`](visualizer-template) — a bare-bones starter with the `@funny/host` types, a build script, and a CI workflow that fails if the committed `dist/` is stale.

## Installing an extension

```bash
# Straight from this repo (a subfolder of the monorepo)
funny ext install github:ironmussa/funny-extensions --subdir visualizer-dbml

# Or from a local checkout
funny ext install ./visualizer-dbml

# Or copy into funny's extensions dir
cp -r visualizer-dbml ~/.funny/extensions/visualizer-dbml
```

See the [visualizer plugin guide](https://github.com/argenisleon/funny/blob/master/docs/visualizer-plugins.md) in the funny repo for the full SDK reference (the `@funny/host` contract, the `VisualizerPlugin` interface, building to ESM, and the shared-React import map).

## Developing

```bash
cd visualizer-dbml
bun install
bun run build   # rebuilds dist/index.mjs
```

Commit the updated `dist/` before tagging a release — funny serves the committed bundle as-is.

## License

MIT
