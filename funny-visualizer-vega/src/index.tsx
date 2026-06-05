// funny visualizer plugin: Vega-Lite / Vega → chart.
//
// Bundles vega + vega-lite + vega-embed; depends only on the public `react` +
// `@funny/host` peer surface. Renders ```vega-lite and ```vega fenced JSON
// specs. (File extensions like `.vl.json` aren't claimed: funny resolves a file
// visualizer by the LAST extension segment, so `.vl.json` collapses to `json` —
// claiming it would hijack every .json file. Use a fenced block instead.)
import { useFunnyTheme, type VisualizerPlugin, type VisualizerProps } from '@funny/host';
import { useEffect, useRef, useState } from 'react';
// vega-embed bundles vega + vega-lite and self-injects its own stylesheet (the
// ⋯ actions menu) at runtime, so there's no separate CSS to ship.
import embed, { type Result, type VisualizationSpec } from 'vega-embed';

const VEGA_INLINE_HEIGHT = 360;

// Tint axis/legend/title text to the host foreground so labels stay legible in
// both themes (Vega defaults to dark-on-light).
function themedConfig(theme: 'light' | 'dark') {
  const fg = theme === 'dark' ? '#e5e7eb' : '#1f2937';
  const grid = theme === 'dark' ? '#374151' : '#e5e7eb';
  return {
    background: 'transparent',
    axis: { labelColor: fg, titleColor: fg, gridColor: grid, domainColor: grid, tickColor: grid },
    legend: { labelColor: fg, titleColor: fg },
    title: { color: fg },
    view: { stroke: 'transparent' },
  };
}

function VegaBlock({ source, fill }: VisualizerProps) {
  const theme = useFunnyTheme();
  const hostRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const el = hostRef.current;
    if (!el) return;

    let spec: VisualizationSpec;
    try {
      spec = JSON.parse(source) as VisualizationSpec;
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
      return;
    }
    setError('');

    let result: Result | undefined;
    let cancelled = false;
    embed(el, spec, {
      actions: { export: true, source: false, compiled: false, editor: false },
      renderer: 'svg',
      config: themedConfig(theme),
    })
      .then((r) => {
        if (cancelled) r.finalize();
        else result = r;
      })
      .catch((err) => {
        if (!cancelled) setError(err instanceof Error ? err.message : String(err));
      });

    return () => {
      cancelled = true;
      result?.finalize();
    };
  }, [source, theme]);

  if (error) {
    return (
      <div
        className="border-destructive/30 bg-destructive/10 text-destructive flex items-center gap-2 rounded border px-3 py-2 text-xs"
        data-testid="vega-error"
      >
        <span className="font-medium">Invalid Vega spec</span>
        <span className="text-muted-foreground">{error}</span>
      </div>
    );
  }

  return (
    <div
      ref={hostRef}
      data-testid="vega-chart"
      className="border-border flex items-center justify-center overflow-auto rounded border bg-card p-3"
      style={{ height: fill ? '100%' : VEGA_INLINE_HEIGHT }}
    />
  );
}

const plugin: VisualizerPlugin = {
  id: 'funny-visualizer-vega',
  version: '0.1.0',
  contributes: { fences: ['vega-lite', 'vegalite', 'vega'] },
  Component: VegaBlock,
};

export default plugin;
