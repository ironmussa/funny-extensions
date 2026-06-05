// funny visualizer plugin: Jupyter notebook (.ipynb) → rendered cells.
//
// A lightweight, self-contained nbformat v4 renderer: markdown cells via
// `marked`, code cells as source + outputs (stream text, execute_result /
// display_data with image/html/json/text mime bundles, and error tracebacks
// with ANSI stripped). Depends only on the public `react` + `@funny/host` peer
// surface. Build to ESM with `npm run build`.
import { useFunnyTheme, type VisualizerPlugin, type VisualizerProps } from '@funny/host';
import { marked } from 'marked';
import { useMemo } from 'react';

type MultilineString = string | string[];

interface NbOutput {
  output_type: 'stream' | 'execute_result' | 'display_data' | 'error';
  name?: string;
  text?: MultilineString;
  data?: Record<string, unknown>;
  ename?: string;
  evalue?: string;
  traceback?: string[];
}

interface NbCell {
  cell_type: 'markdown' | 'code' | 'raw';
  source: MultilineString;
  execution_count?: number | null;
  outputs?: NbOutput[];
}

interface Notebook {
  cells?: NbCell[];
}

const text = (s: MultilineString | undefined): string =>
  Array.isArray(s) ? s.join('') : (s ?? '');

// Jupyter tracebacks are ANSI-colored; strip the escape codes for a clean <pre>.
// eslint-disable-next-line no-control-regex
const stripAnsi = (s: string): string => s.replace(/\x1b\[[0-9;]*m/g, '');

function pickMime(data: Record<string, unknown> | undefined): { mime: string; value: string } | null {
  if (!data) return null;
  const order = [
    'image/png',
    'image/jpeg',
    'image/gif',
    'image/svg+xml',
    'text/html',
    'application/json',
    'text/markdown',
    'text/plain',
  ];
  for (const mime of order) {
    if (data[mime] != null) {
      const raw = data[mime];
      const value =
        mime === 'application/json' ? JSON.stringify(raw, null, 2) : text(raw as MultilineString);
      return { mime, value };
    }
  }
  return null;
}

function OutputView({ output }: { output: NbOutput }) {
  if (output.output_type === 'stream') {
    const isErr = output.name === 'stderr';
    return (
      <pre
        className={`m-0 overflow-auto whitespace-pre-wrap px-3 py-1.5 text-xs ${
          isErr ? 'text-destructive' : 'text-muted-foreground'
        }`}
        data-testid="ipynb-output-stream"
      >
        {text(output.text)}
      </pre>
    );
  }

  if (output.output_type === 'error') {
    return (
      <pre
        className="text-destructive m-0 overflow-auto whitespace-pre-wrap px-3 py-1.5 text-xs"
        data-testid="ipynb-output-error"
      >
        {stripAnsi((output.traceback ?? [`${output.ename}: ${output.evalue}`]).join('\n'))}
      </pre>
    );
  }

  // execute_result / display_data — render the richest available mime.
  const picked = pickMime(output.data);
  if (!picked) return null;
  const { mime, value } = picked;

  if (mime.startsWith('image/')) {
    const src =
      mime === 'image/svg+xml'
        ? `data:image/svg+xml;utf8,${encodeURIComponent(value)}`
        : `data:${mime};base64,${value.replace(/\s/g, '')}`;
    return (
      <div className="px-3 py-2" data-testid="ipynb-output-image">
        <img src={src} alt="cell output" className="max-w-full" />
      </div>
    );
  }

  if (mime === 'text/html') {
    // Notebook-authored HTML; full-trust visualizer model (same as Mermaid/DBML).
    return (
      <div
        className="ipynb-html overflow-auto px-3 py-2 text-sm"
        data-testid="ipynb-output-html"
        dangerouslySetInnerHTML={{ __html: value }}
      />
    );
  }

  return (
    <pre
      className="m-0 overflow-auto whitespace-pre-wrap px-3 py-1.5 text-xs"
      data-testid="ipynb-output-text"
    >
      {value}
    </pre>
  );
}

function CodeCell({ cell }: { cell: NbCell }) {
  const count = cell.execution_count;
  return (
    <div className="border-border overflow-hidden rounded border" data-testid="ipynb-cell-code">
      <div className="flex">
        <div className="text-muted-foreground bg-muted/40 select-none px-2 py-1.5 text-right font-mono text-xs">
          [{count ?? ' '}]
        </div>
        <pre className="m-0 flex-1 overflow-auto px-3 py-1.5 font-mono text-xs">{text(cell.source)}</pre>
      </div>
      {!!cell.outputs?.length && (
        <div className="border-border bg-card border-t">
          {cell.outputs.map((o, i) => (
            <OutputView key={i} output={o} />
          ))}
        </div>
      )}
    </div>
  );
}

function MarkdownCell({ cell }: { cell: NbCell }) {
  const html = useMemo(() => marked.parse(text(cell.source), { async: false }) as string, [cell.source]);
  return (
    <div
      className="ipynb-md text-sm leading-relaxed"
      data-testid="ipynb-cell-markdown"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

function NotebookView({ source, fill }: VisualizerProps) {
  const theme = useFunnyTheme();
  const parsed = useMemo<{ nb: Notebook | null; error: string }>(() => {
    try {
      return { nb: JSON.parse(source) as Notebook, error: '' };
    } catch (err) {
      return { nb: null, error: err instanceof Error ? err.message : String(err) };
    }
  }, [source]);

  if (parsed.error || !parsed.nb) {
    return (
      <div
        className="border-destructive/30 bg-destructive/10 text-destructive flex items-center gap-2 rounded border px-3 py-2 text-xs"
        data-testid="ipynb-error"
      >
        <span className="font-medium">Invalid notebook</span>
        <span className="text-muted-foreground">{parsed.error || 'no cells'}</span>
      </div>
    );
  }

  const cells = parsed.nb.cells ?? [];
  return (
    <div
      className="flex flex-col gap-3 overflow-auto p-1"
      data-testid="ipynb-notebook"
      data-theme={theme}
      style={{ height: fill ? '100%' : undefined }}
    >
      {cells.map((cell, i) =>
        cell.cell_type === 'code' ? (
          <CodeCell key={i} cell={cell} />
        ) : cell.cell_type === 'markdown' ? (
          <MarkdownCell key={i} cell={cell} />
        ) : null,
      )}
    </div>
  );
}

const plugin: VisualizerPlugin = {
  id: 'funny-visualizer-jupyter',
  version: '0.1.0',
  contributes: { fileExtensions: ['.ipynb'] },
  Component: NotebookView,
};

export default plugin;
