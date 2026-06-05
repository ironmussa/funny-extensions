// src/index.tsx
import { useFunnyFontSize, useFunnyTheme } from "@funny/host";
import { jsx } from "react/jsx-runtime";
function DemoVisualizer({ source, fill }) {
  const theme = useFunnyTheme();
  const fontPx = useFunnyFontSize();
  let body = source;
  try {
    body = JSON.stringify(JSON.parse(source), null, 2);
  } catch {
  }
  return /* @__PURE__ */ jsx(
    "pre",
    {
      "data-testid": "demo-visualizer",
      style: {
        margin: 0,
        padding: "0.75rem",
        height: fill ? "100%" : void 0,
        overflow: "auto",
        borderRadius: 8,
        fontSize: fontPx,
        // Inherit the host's theme tokens rather than hardcoding colors.
        background: theme === "dark" ? "hsl(0 0% 12%)" : "hsl(0 0% 97%)",
        color: "inherit"
      },
      children: body
    }
  );
}
var plugin = {
  id: "funny-visualizer-template",
  // stable, unique
  version: "0.1.0",
  contributes: {
    fences: ["demo"],
    // ```demo blocks
    fileExtensions: [".demo"]
    // .demo file previews
  },
  Component: DemoVisualizer
};
var index_default = plugin;
export {
  index_default as default
};
