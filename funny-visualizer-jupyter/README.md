# funny-visualizer-jupyter

Jupyter notebook visualizer for [funny](https://github.com/argenisleon/funny).
Opens a `.ipynb` file as rendered cells instead of raw JSON.

## What it renders

- **Markdown cells** → rendered HTML (via [`marked`](https://marked.js.org/)).
- **Code cells** → source with the `[n]` execution-count gutter.
- **Outputs**:
  - `stream` (stdout/stderr) as text (stderr tinted red),
  - `execute_result` / `display_data` picking the richest mime — `image/png`,
    `image/jpeg`, `image/svg+xml`, `text/html`, `application/json`, `text/plain`,
  - `error` tracebacks with ANSI escape codes stripped.

A self-contained nbformat **v4** renderer — no notebook server, no heavy
notebook UI framework. Only `marked` is bundled; `react` / `@funny/host` stay
external (host-provided).

## Build & install

```bash
npm install
npm run build                      # → dist/index.mjs (~70 kB)
funny ext install .                # local, or:
funny ext install github:you/funny-visualizer-jupyter
```

Then open any `.ipynb` file in funny.

See the full guide: [docs/visualizer-plugins.md](https://github.com/argenisleon/funny/blob/master/docs/visualizer-plugins.md).
