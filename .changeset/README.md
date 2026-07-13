# Changesets

This folder is managed by [Changesets](https://github.com/changesets/changesets).

## Adding a changeset

When you make a change that should trigger a release, run:

```bash
npx changeset
```

Pick the bump type (patch / minor / major) and write a short summary. This repo
uses **fixed (lockstep) versioning** — all four published packages
(`telegramxjs`, `@telegramxjs/rest`, `@telegramxjs/builders`, `@telegramxjs/types`)
always move to the same version and publish together. Commit the generated
`.changeset/*.md` file with your PR.

## Releasing

On merge to `master`, the Release workflow opens a **"Version Packages"** PR that
bumps versions and updates changelogs. Merging that PR builds and publishes every
package to npm.
