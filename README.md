# Playwright Beyond the Happy Path

Slides and demo project for the 2026 Playwright talk.
**.NET User Group Karlsruhe · 24 September 2026.**
An update of the [Webworker Meetup Saar 11/2025 talk](../webworker-meetup-saar-11-2025-playwright).

**E2E tests, accessibility and MCP in practice.** Sven Hennessen · vensas GmbH

## Repository structure

```
├── docs/
│   ├── playwright-beyond-the-happy-path-dnug-ka-2026-09-24.yaml   the talk deck, input
│   ├── playwright-beyond-the-happy-path-dnug-ka-2026-09-24.pdf    the talk deck, 21 slides
│   ├── playwright-content-pool.yaml                               the content pool, input
│   ├── playwright-content-pool.pdf                                the content pool, 30 slides
│   ├── playwright-demo-script.yaml                                the stage script, input
│   ├── playwright-demo-script.pdf                                 the stage script, 4 pages
│   ├── playwright-2026-talk.md                                    research notes (stops at 1.61)
│   └── playwright-talk-abstract-de.md                             German abstract for the CfP
├── src/
│   ├── deploy-or-die-frontend/                 React app and the TypeScript tests
│   ├── deploy-or-die-backend/                  ASP.NET Core API and PostgreSQL
│   ├── deploy-or-die-dotnet-tests/             the same tests in C# with xUnit
│   └── deploy-or-die-apphost/                  Aspire AppHost, starts all three at once
└── generate-docs.sh                            makes all three PDFs
```

## Slides and demo script

Three documents, all made with the [vensas-doc-generator](../vensas-doc-generator):

| Document | Type | Content |
|---|---|---|
| `playwright-beyond-the-happy-path-dnug-ka-2026-09-24` | `slides` | **The talk deck** for 24 September 2026. 21 slides, about 48 minutes, plus about 10 minutes for questions. |
| `playwright-content-pool` | `slides` | **The content pool.** All 30 slides, not tied to an event. A talk deck takes the slides that it needs from here. |
| `playwright-demo-script` | `report` | The stage script for the **talk deck**. The demos as 6 sessions, with brief steps and a command reference. |

Make a new slide in the pool first, then copy it into a talk deck.

The YAML files are the single source of truth. One command generates all PDFs:

```sh
./generate-docs.sh              # all three documents
./generate-docs.sh slides       # only the talk deck
./generate-docs.sh pool         # only the content pool
./generate-docs.sh script       # only the demo script
```

The script expects the [vensas-doc-generator](../vensas-doc-generator) beside this
repository. Set `DOC_GENERATOR_DIR` to give a different path.

The demo script refers to slides of the talk deck by number. **If you change the talk deck,
correct the demo script too** — see the checklist in `AGENTS.md`. The content pool has no
demo script.

## Demo project: "Deploy or Die"

A deployment game. Each deployment has a 50% success rate. After a deployment you must wait
30 seconds — this cooldown is the subject of the Clock API demo.

### Frontend and TypeScript tests

```sh
cd src/deploy-or-die-frontend
pnpm install
npx playwright install chromium

pnpm run dev                 # the app on http://localhost:3000
pnpm run test:mocked         # 17 tests, about 10 s, no containers
pnpm run test:integration    # 4 tests against the real backend, about 4 min
pnpm run test:ui             # UI mode
pnpm run test:report         # the HTML report with Speedboard and Timeline
```

### Backend

The integration tests start the backend and PostgreSQL with Docker Compose. To run the
backend alone:

```sh
cd src/deploy-or-die-backend
docker compose up -d
cd DeployOrDie.Api && dotnet run     # the API on http://localhost:5000
```

### All three at once, with Aspire

The Aspire AppHost starts PostgreSQL, the backend and the frontend together. Use it for a
manual demo — the tests do not need it.

```sh
cd src/deploy-or-die-apphost
dotnet run                           # or: aspire run
```

The ports stay the same as above: the frontend on 3000, the backend on 5000. The dashboard
prints its own URL with a login token. Aspire stops the containers again when you stop it.

### C# tests

The frontend must run on port 3000.

```sh
cd src/deploy-or-die-dotnet-tests/DeployOrDie.E2E.Tests
dotnet build
pwsh bin/Debug/net10.0/playwright.ps1 install chromium
dotnet test                  # 5 tests, 1 red by design
```

## One test fails on purpose

Both `pnpm run test:mocked` and the C# `dotnet test` report **one failed test**: the WCAG scan in
`tests/accessibility.spec.ts`. This is intentional and it is the accessibility demo.

`src/deploy-or-die-frontend/src/a11yMode.ts` holds the switch:

```ts
export const ACCESSIBLE_MODE = false;
```

With `false` the deploy form has three real WCAG defects:

| axe-core rule | Defect | WCAG |
|---|---|---|
| `label` | The environment field has no label | 4.1.2 |
| `button-name` | The history button has only an icon and no name | 4.1.2 |
| `color-contrast` | The hint text has a contrast of 1.9:1, and 4.5:1 is needed | 1.4.3 |

Set the value to `true` and all 17 tests pass. This is the red to green step on stage.

## Versions

| Component | Version |
|---|---|
| `@playwright/test` | 1.63.0 |
| `@axe-core/playwright` | 4.13.0 |
| `Microsoft.Playwright.Xunit.v3` | 1.62.0 |
| `Deque.AxeCore.Playwright` | 4.13.0 |
| Backend | .NET 10 |
| C# tests | .NET 10, Microsoft Testing Platform |

## Note

Made and tested on macOS with Podman. The Testcontainers network behaviour can be different
with Docker.

The bundled Firefox fails with "Could not find profile folder" when run from a terminal app
without macOS Full Disk Access (for example VS Code's integrated terminal) — see the note in
`AGENTS.md`. The `firefox` project is not part of the stage demo.
