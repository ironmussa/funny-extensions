# funny-visualizer-template

A starter template for a **funny visualizer extension** — a plugin that turns a
fenced code block (` ```demo `) or a file preview (`.demo`) into a rich React
view inside [funny](https://github.com/argenisleon/funny).

This template is meant to be **copied into its own git repository**, published to
GitHub, and installed remotely with `funny ext install github:you/your-repo`.

## What's here

```
src/index.tsx               your visualizer (a default-exported VisualizerPlugin)
types/funny-host.d.ts        ambient types for @funny/host (provided at runtime)
dist/index.mjs               the BUILT bundle funny actually loads (commit this)
package.json                 funny.client → dist/index.mjs, build/check scripts
.github/workflows/build.yml  CI: fails if the committed dist/ is stale
```

## Quick start

```bash
# 1. Copy this directory out into a new repo
cp -r examples/funny-visualizer-template ../my-funny-viz
cd ../my-funny-viz && git init

# 2. Install dev deps and build
npm install
npm run build      # → dist/index.mjs

# 3. Try it locally before publishing
funny ext install .
#    open funny, render a ```demo block or a .demo file

# 4. Commit (including dist/) and push to GitHub
git add -A && git commit -m "initial visualizer"
git remote add origin git@github.com:you/my-funny-viz.git
git push -u origin main
```

## Install from a repo

Once pushed, anyone (an admin) can install it remotely:

```bash
funny ext install github:you/my-funny-viz            # latest on default branch
funny ext install github:you/my-funny-viz#v1.0.0     # a tag or branch
funny ext install https://github.com/you/my-funny-viz.git
funny ext install github:you/monorepo --subdir packages/viz   # subdir of a monorepo
```

> **funny never builds your repo.** Like a VSCode `.vsix` or an Obsidian release
> artifact, the installer clones and copies your **pre-built** `dist/`. So always
> `npm run build` and commit `dist/` before tagging a release — the included CI
> workflow fails the build if the committed `dist/` is stale.

## The contract (don't break these)

1. Import **only** from `@funny/host` and `react`.
2. **Never bundle React** — it's a peer dependency, externalized at build time
   (`--external:react`). Bundling a second copy triggers `Invalid hook call`.
3. Read theme / font size from `useFunnyTheme()` / `useFunnyFontSize()` — don't
   hardcode colors or pixel sizes (funny respects the user's appearance setting).
4. `package.json` → `funny.client` must point at the built ESM entry.

## Security model

A visualizer runs **fully trusted** inside the host's React tree and the user's
authenticated session — installing one is like installing an npm package. That's
why **install/remove is admin-only**. Only publish and install code you trust.

See the full guide: [`docs/visualizer-plugins.md`](https://github.com/argenisleon/funny/blob/master/docs/visualizer-plugins.md).
