// funny visualizer plugin: GraphViz/DOT → SVG diagram.
//
// Fully decoupled from funny's core — bundles its own @hpcc-js/wasm-graphviz
// (Graphviz compiled to wasm, embedded as base64) and depends only on the
// public `react` + `@funny/host` peer surface. Renders ```dot fences and
// .dot / .gv files. Build to ESM with `npm run build`.
import { useFunnyTheme, type VisualizerPlugin, type VisualizerProps } from '@funny/host';
import { Graphviz } from '@hpcc-js/wasm-graphviz';
import { useEffect, useRef, useState } from 'react';

const DOT_INLINE_HEIGHT = 420;

// Graphviz.load() resolves the wasm once; cache the promise so every block
// reuses the same instance instead of re-decoding the wasm per render.
let graphvizPromise: Promise<Graphviz> | null = null;
function loadGraphviz(): Promise<Graphviz> {
  graphvizPromise ??= Graphviz.load();
  return graphvizPromise;
}

function DotBlock({ source, fill }: VisualizerProps) {
  const theme = useFunnyTheme();
  const [svg, setSvg] = useState<string>('');
  const [error, setError] = useState<string>('');
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cancelled = false;
    setError('');
    loadGraphviz()
      .then((graphviz) => {
        if (cancelled) return;
        try {
          setSvg(graphviz.layout(source, 'svg', 'dot'));
        } catch (err) {
          setError(err instanceof Error ? err.message : String(err));
          setSvg('');
        }
      })
      .catch((err) => {
        if (!cancelled) setError(err instanceof Error ? err.message : String(err));
      });
    return () => {
      cancelled = true;
    };
  }, [source]);

  // Make the rendered SVG scale to the container rather than its intrinsic size.
  useEffect(() => {
    const el = hostRef.current?.querySelector('svg');
    if (!el) return;
    el.removeAttribute('width');
    el.removeAttribute('height');
    el.style.maxWidth = '100%';
    el.style.maxHeight = '100%';
    el.style.height = '100%';
  }, [svg]);

  if (error) {
    return (
      <div
        className="border-destructive/30 bg-destructive/10 text-destructive flex items-center gap-2 rounded border px-3 py-2 text-xs"
        data-testid="dot-error"
      >
        <span className="font-medium">Invalid DOT</span>
        <span className="text-muted-foreground">{error}</span>
      </div>
    );
  }

  return (
    <div
      ref={hostRef}
      data-testid="dot-diagram"
      className="border-border flex items-center justify-center overflow-auto rounded border bg-card p-2"
      style={{
        height: fill ? '100%' : DOT_INLINE_HEIGHT,
        // DOT graphs render dark-on-light; in dark mode invert lightly so edges
        // and text stay legible without restyling every node.
        filter: theme === 'dark' ? 'invert(0.9) hue-rotate(180deg)' : undefined,
      }}
      // The SVG comes from Graphviz (our bundled wasm), not user HTML.
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}

const plugin: VisualizerPlugin = {
  id: 'funny-visualizer-dot',
  version: '0.1.0',
  contributes: { fences: ['dot', 'graphviz'], fileExtensions: ['.dot', '.gv'] },
  Component: DotBlock,
};

export default plugin;
