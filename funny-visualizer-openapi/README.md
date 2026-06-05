# funny-visualizer-openapi

OpenAPI / Swagger visualizer for [funny](https://github.com/argenisleon/funny).
Renders ` ```openapi ` and ` ```swagger ` fenced specs (JSON **or** YAML) as the
full interactive [Swagger UI](https://github.com/swagger-api/swagger-ui).

````markdown
```openapi
openapi: 3.0.0
info: { title: Demo API, version: 1.0.0 }
paths:
  /ping:
    get:
      summary: Health check
      responses:
        "200": { description: pong }
```
````

## How it works

Bundles [`swagger-ui-dist`](https://www.npmjs.com/package/swagger-ui-dist) and
[`js-yaml`](https://github.com/nodeca/js-yaml). swagger-ui-dist mounts its **own
isolated React app** into a DOM node, so it doesn't touch the host's React tree
(no shared-hooks conflict — `react` / `@funny/host` stay external). YAML is
parsed with js-yaml's safe `load()` (JSON is valid YAML, so both formats work).
The Swagger UI stylesheet is bundled as text and injected once.

> Heavy by nature (~2.4 MB — swagger-ui ships its own React). That's exactly why
> it's a decoupled extension and not a built-in.

## File extensions

Only fenced blocks are claimed — **not** `.openapi.yaml` / `.swagger.json`. funny
resolves a file visualizer by the file's *last* extension segment, so those
collapse to `yaml` / `json`; claiming them would hijack every YAML/JSON file.
Put your spec in a ` ```openapi ` block instead.

## Build & install

```bash
npm install
npm run build                      # → dist/index.mjs (~2.4 MB)
funny ext install .                # local, or:
funny ext install github:you/funny-visualizer-openapi
```

See the full guide: [docs/visualizer-plugins.md](https://github.com/argenisleon/funny/blob/master/docs/visualizer-plugins.md).
