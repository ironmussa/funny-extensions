// funny visualizer plugin: OpenAPI / Swagger spec → Swagger UI.
//
// Renders ```openapi and ```swagger fenced blocks (JSON or YAML) as the full
// interactive Swagger UI. Bundles swagger-ui-dist (a self-contained UMD that
// mounts its own isolated React app into a DOM node — no conflict with the
// host's React) + js-yaml for YAML specs. Depends only on the public `react` +
// `@funny/host` peer surface. Build to ESM with `npm run build`.
import { useFunnyTheme, type VisualizerPlugin, type VisualizerProps } from '@funny/host';
import yaml from 'js-yaml';
import { useEffect, useRef, useState } from 'react';
// @ts-expect-error — swagger-ui-dist ships no types for the bundle entry.
import SwaggerUIBundle from 'swagger-ui-dist/swagger-ui-bundle.js';
import swaggerCss from 'swagger-ui-dist/swagger-ui.css';

const OPENAPI_INLINE_HEIGHT = 600;
const STYLE_ID = 'funny-visualizer-openapi-css';

function ensureCss(): void {
  if (typeof document === 'undefined' || document.getElementById(STYLE_ID)) return;
  const el = document.createElement('style');
  el.id = STYLE_ID;
  el.textContent = swaggerCss as unknown as string;
  document.head.appendChild(el);
}

function OpenApiBlock({ source, fill }: VisualizerProps) {
  const theme = useFunnyTheme();
  const hostRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    ensureCss();
    const el = hostRef.current;
    if (!el) return;

    let spec: unknown;
    try {
      // YAML is a superset of JSON, so this parses both spec formats.
      spec = yaml.load(source);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
      return;
    }
    if (!spec || typeof spec !== 'object') {
      setError('not a valid OpenAPI/Swagger document');
      return;
    }
    setError('');

    const ui = SwaggerUIBundle({
      spec,
      domNode: el,
      deepLinking: false,
      docExpansion: 'list',
      defaultModelsExpandDepth: 0,
      tryItOutEnabled: false,
    });

    return () => {
      // Swagger UI has no public teardown; clear the node so a re-render starts
      // fresh instead of stacking instances.
      void ui;
      el.replaceChildren();
    };
  }, [source]);

  if (error) {
    return (
      <div
        className="border-destructive/30 bg-destructive/10 text-destructive flex items-center gap-2 rounded border px-3 py-2 text-xs"
        data-testid="openapi-error"
      >
        <span className="font-medium">Invalid OpenAPI spec</span>
        <span className="text-muted-foreground">{error}</span>
      </div>
    );
  }

  return (
    <div
      className="border-border overflow-auto rounded border bg-white"
      style={{ height: fill ? '100%' : OPENAPI_INLINE_HEIGHT }}
      data-theme={theme}
      data-testid="openapi-ui"
    >
      <div ref={hostRef} />
    </div>
  );
}

const plugin: VisualizerPlugin = {
  id: 'funny-visualizer-openapi',
  version: '0.1.0',
  contributes: { fences: ['openapi', 'swagger'] },
  Component: OpenApiBlock,
};

export default plugin;
