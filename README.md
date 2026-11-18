# Nexaris — public CI runner, private source

This repository contains **no Nexaris source code, compiled IPA, Nyxian binaries, or private build logs**. It only holds a narrowly scoped GitHub Actions workflow to use public macOS runners for compiling the user's own private `SeanEmcee/Nexaris` project.

The original Nexaris repository and all of its history remain private. Its Nyxian integration has redistribution restrictions, so no compiled app or private source should be uploaded to a public artifact, public cache, or release.

## Workflow

[Open GitHub Actions](https://github.com/SeanEmcee/Nexaris-public-build/actions/workflows/nexaris-private-compile.yml)

The workflow is manual-only for the expensive macOS build. Its initial push runs only an inexpensive public Ubuntu runner check, without accessing any private source or secrets.

An actual build checks out the private Nexaris branch `feature/nexaris-unified-app` into a temporary GitHub-hosted macOS machine, uses Xcode 26.6, compiles and verifies the real Nyxian/Rap Keys app, and packages an **unsigned IPA**. No compiled source, IPA or full logs are stored as public GitHub artifacts. Logs and successful IPA output are saved as **draft releases inside the original private Nexaris repository**, provided the private-output credential is configured correctly.

### Repository Actions secrets required

Configure these in **this public build repository** at `Settings → Secrets and variables → Actions → New repository secret`. Never paste the values into a public file or chat.

**One broad token is enough to start:** add `NEXARIS_UPSTREAM_GITHUB_TOKEN` to this repository's Actions secrets. The workflow uses it for the pinned upstream compiler, private Nexaris checkout and private draft release **if it also has access to all three**. It checks for the secret before scheduling macOS.

**Safer long-term option (recommended):** use three separately scoped credentials so a token cannot access more than necessary:

1. `NEXARIS_PRIVATE_SOURCE_TOKEN` — **Contents: Read** on private `SeanEmcee/Nexaris`.
2. `NEXARIS_UPSTREAM_GITHUB_TOKEN` — **Actions: Read** access for the upstream Nyxian artifact.
3. `NEXARIS_PRIVATE_OUTPUT_TOKEN` — **Contents: Read and write** on private `SeanEmcee/Nexaris` for draft release output.

The private-source and private-output secrets override the shared token automatically when present. If you generated an all-permissions token, rotate it to narrowly scoped tokens after confirming the pipeline works. **Do not disclose the token or print it in logs.**

### Run

1. Open [Actions → Nexaris private-source compile](https://github.com/SeanEmcee/Nexaris-public-build/actions/workflows/nexaris-private-compile.yml).
2. Select **Run workflow**, branch **main**.
3. The preflight checks credentials and the regression tests on Ubuntu, then builds on `macos-26-intel` with Xcode 26.6.
4. Read the status on Actions. On success, retrieve the unsigned IPA and checksum from the **draft release inside your private Nexaris repository**. On failure, that private draft release should contain the build diagnostics if the failure happened after source checkout.

**Important:** A GitHub account-level billing/payment restriction may block even public-repository Actions jobs. The initial public-runner check determines whether GitHub permits them; a public repository does not guarantee a billing suspension is bypassed.

Source code is never pushed into this public repository. GitHub-hosted runners still temporarily process the private source during execution; administrators of this public workflow and anyone with write access to its default branch must be trusted because they can edit workflow code that receives Actions secrets. Do not accept unreviewed workflow changes.

This unsigned compilation does **not** prove app signing, physical iPhone installation, guest boot, JIT, or Globe-key keyboard activation.
