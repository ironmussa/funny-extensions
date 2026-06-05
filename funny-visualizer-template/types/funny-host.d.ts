/**
 * Ambient type shim for `@funny/host`.
 *
 * The host SDK is provided by funny at runtime (via an import map) and is NOT
 * published to npm, so a standalone extension repo can't `npm install` it. This
 * shim mirrors the frozen `@funny/host` surface so `tsc` type-checks offline;
 * esbuild externalizes the real module at build time (`--external:@funny/host`).
 *
 * Keep this in sync with funny's `packages/host/src/index.ts`.
 */
declare module '@funny/host' {
  import type { ComponentType } from 'react';

  export interface VisualizerProps {
    /** Source text to render: fenced-block contents, or full file contents. */
    source: string;
    /** True when rendered as a full file-preview pane rather than an inline block. */
    fill?: boolean;
  }

  export interface VisualizerContributes {
    fences?: string[];
    fileExtensions?: string[];
  }

  export interface VisualizerManifest {
    id: string;
    version: string;
    contributes: VisualizerContributes;
  }

  export interface VisualizerPlugin extends VisualizerManifest {
    Component: ComponentType<VisualizerProps>;
  }

  /** React hook: the host's resolved theme. */
  export function useFunnyTheme(): 'light' | 'dark';
  /** React hook: the host's active prose font size in pixels. */
  export function useFunnyFontSize(): number;
}
