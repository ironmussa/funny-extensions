/**
 * Minimal funny visualizer extension.
 *
 * A visualizer turns a fenced code block (```mylang) or a file preview
 * (.myext) into a rich React view. This template claims a `demo` fence and a
 * `.demo` extension and renders the content, pretty-printing it when it parses
 * as JSON. Replace the body of `DemoVisualizer` with your own rendering.
 *
 * Rules of the contract:
 *   - import ONLY from `@funny/host` and `react`
 *   - never bundle React (it's a peer dep, externalized at build — see build script)
 *   - read theme / font size from the host hooks, don't hardcode colors or px
 */
import { useFunnyFontSize, useFunnyTheme } from '@funny/host';
import type { VisualizerPlugin, VisualizerProps } from '@funny/host';

function DemoVisualizer({ source, fill }: VisualizerProps) {
  const theme = useFunnyTheme(); // 'light' | 'dark'
  const fontPx = useFunnyFontSize(); // number (px)

  let body = source;
  try {
    body = JSON.stringify(JSON.parse(source), null, 2);
  } catch {
    // Not JSON — render the raw source as-is.
  }

  return (
    <pre
      data-testid="demo-visualizer"
      style={{
        margin: 0,
        padding: '0.75rem',
        height: fill ? '100%' : undefined,
        overflow: 'auto',
        borderRadius: 8,
        fontSize: fontPx,
        // Inherit the host's theme tokens rather than hardcoding colors.
        background: theme === 'dark' ? 'hsl(0 0% 12%)' : 'hsl(0 0% 97%)',
        color: 'inherit',
      }}
    >
      {body}
    </pre>
  );
}

const plugin: VisualizerPlugin = {
  id: 'funny-visualizer-template', // stable, unique
  version: '0.1.0',
  contributes: {
    fences: ['demo'], // ```demo blocks
    fileExtensions: ['.demo'], // .demo file previews
  },
  Component: DemoVisualizer,
};

export default plugin;
