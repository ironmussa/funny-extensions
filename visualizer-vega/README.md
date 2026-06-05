# visualizer-vega

Vega-Lite / Vega visualizer for [funny](https://github.com/argenisleon/funny).
Renders ` ```vega-lite ` and ` ```vega ` fenced JSON specs as interactive charts.

````markdown
```vega-lite
{
  "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
  "data": { "values": [
    {"a": "A", "b": 28}, {"a": "B", "b": 55}, {"a": "C", "b": 43}
  ]},
  "mark": "bar",
  "encoding": {
    "x": {"field": "a", "type": "nominal"},
    "y": {"field": "b", "type": "quantitative"}
  }
}
```
````

## How it works

Bundles [`vega-embed`](https://github.com/vega/vega-embed) (which pulls in
`vega` + `vega-lite`). `embed()` auto-detects Vega-Lite vs full Vega from the
spec's `$schema`. Axis / legend / title colors are tinted to the host
foreground so labels stay legible in light and dark themes; `react` /
`@funny/host` stay external (host-provided).

## File extensions

Only fenced blocks are claimed — **not** `.vl.json` / `.vg.json`. funny resolves
a file visualizer by the file's *last* extension segment, so `.vl.json` collapses
to `json`; claiming it would hijack every `.json` file. Put your spec in a
` ```vega-lite ` block instead.

## Build & install

```bash
npm install
npm run build                      # → dist/index.mjs (~1.8 MB)
funny ext install .                # local, or:
funny ext install github:ironmussa/funny-extensions --subdir visualizer-vega
```

See the full guide: [docs/visualizer-plugins.md](https://github.com/argenisleon/funny/blob/master/docs/visualizer-plugins.md).
