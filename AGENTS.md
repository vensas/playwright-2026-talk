DO write all slides, code and comments in ASD-STE100 (Simplified Technical English).
DO keep `AGENTS.md` and `README.md` up to date with the latest implementations.
DO regenerate the PDF with `./generate-docs.sh` after each change to a document YAML.
DO ask before you change the talk content — the speaker decides what goes on a slide.
DO NOT put the content of `AGENTS.md` in the presentation.
DO NOT commit, push or open a pull request without a request from the user.

## The talk

"Playwright Beyond the Happy Path — E2E tests, accessibility and MCP in practice."
An update of the Webworker Meetup Saar 11/2025 talk (`../webworker-meetup-saar-11-2025-playwright`).

- Audience: developers. The talk is code first. The deck is English.
- **Current event: IT-Tage 2026, Frankfurt** (Kap Europa), **Wednesday 9 December 2026,
  16:00–16:45**. A 45 minute slot. The audience is broad, not only .NET developers. This is
  why the .NET block is one slide.
- Earlier event: .NET User Group Karlsruhe, 24 September 2026. That deck is finished.
  **Do not change it** — not its YAML and not its PDF.

### Three decks

| Deck | File | Slides | Purpose |
|---|---|---|---|
| Talk deck (current) | `playwright-beyond-the-happy-path-it-tage-2026-12-09` | 20 | IT-Tage, 2026-12-09. 45 minutes, including an MCP demo slot. No Demo callouts. |
| Talk deck (earlier) | `playwright-beyond-the-happy-path-dnug-ka-2026-09-24` | 21 | .NET User Group Karlsruhe, 2026-09-24. Frozen. |
| Content pool | `playwright-content-pool` | 34 | Every slide. Not tied to an event. A new talk deck takes the slides that it needs from here. |

**Make a new slide in the pool first.** Then copy it into a talk deck. A talk deck holds no
slide that the pool does not have. A talk deck can leave out the `Demo` callout of a pool
slide — the IT-Tage deck leaves out all of them. All other blocks stay the same as in the pool.

The pool has the newest text of each slide. The Karlsruhe deck has an older text of some
slides. This is correct: that deck is frozen.

### The blocks of the IT-Tage deck

| Block | Slides | Subject |
|---|---|---|
| Frame | 1–3 | Cover, about me, the demo app |
| A · Tools and traces | 4–8 | UI mode, test folder ★, traces, artifacts in CI ★, test pyramid ★ |
| B · Mock or real | 9–12 | `page.route`, how to choose ★ (with the mock-or-real box), Compose ★, when to run ★ |
| C · More pages | 13 | Two pages in one context, two users in two contexts |
| D · Accessibility | 14 | axe-core as a gate |
| E · .NET | 15 | The same test in C#, and what is Node only (`dotnet-brief`) |
| F · AI and agents | 16–18 | The caveat ★, the MCP demo slot, playwright-cli `run-code` |
| Close | 19–20 | TL;DR with four take-aways (the fourth is AI), questions |

★ = a slide from a real project. **Personal experience is the reason for this talk.** All seven
of these slides are in the talk deck. If the talk must become shorter, cut a feature slide,
not one of these. The first candidate is UI mode (slide 4).

### The slides that the IT-Tage deck does not have

They stay in the pool: locators, codegen, test locks, Speedboard, isolated retries, Clock API,
ARIA snapshots, Test Agents, the outlook, the real backend (`real-backend`; its mock-or-real box
is on `mock-or-real-choice` now), the three long .NET slides (`dotnet`,
`dotnet-parity`, `dotnet-a11y`) and the MCP comparison (`mcp`). `dotnet-brief` replaces the
.NET slides. `mcp-demo` and `cli-run-code` replace `mcp`.

### Playwright Test features that .NET does not have

The pool slide `dotnet-parity` lists the full split. `dotnet-brief` gives it in one line. The pool also has slides for
test locks and isolated retries, and both carry a caveat line. Do not remove these lines: the
audience is a .NET user group, and the claim would otherwise be wrong for them. The talk deck
does not show these two features, thus the speaker says in one sentence what they are.

### Out of scope (the speaker decided this)

- **WebSocket mocking** — the demo app has no WebSocket feature. One line in the pool only.
- **Component testing** (1.62) — one line in the pool only.
- **WebAuthn passkeys** (1.61) — parking lot. One line in the pool only.

These three lines are on the `outlook` slide, which is in the pool and not in a talk deck.

## Documents

All documents use the **vensas-doc-generator** (`../vensas-doc-generator`). They do
**not** use Marp any more. The old Marp deck was deleted.

```
docs/
  playwright-beyond-the-happy-path-it-tage-2026-12-09.yaml   the current talk deck — 20 slides, theme dark
  playwright-beyond-the-happy-path-it-tage-2026-12-09.pdf    generated, do not edit
  playwright-beyond-the-happy-path-dnug-ka-2026-09-24.yaml   the earlier talk deck — frozen, do not change
  playwright-beyond-the-happy-path-dnug-ka-2026-09-24.pdf    generated, frozen
  playwright-content-pool.yaml                               the content pool — 34 slides, theme dark
  playwright-content-pool.pdf                                generated, do not edit
  img/                                                       the screenshots and the meme on the slides
  avatar.jpg                                                 the photo on the about-me slide
  repo-qr.png                                                the QR code on the last slide
```

A talk deck gets an event suffix: `<name>-<event>-<date>`. The content pool has no suffix,
because there is one of it.

The YAML files are the only source of truth. Use `generate-docs.sh` in the repository
root after each change:

```sh
./generate-docs.sh              # the current talk deck and the pool
./generate-docs.sh slides       # only the current talk deck (IT-Tage)
./generate-docs.sh pool         # only the content pool
./generate-docs.sh dnug         # only the Karlsruhe deck — not part of a run with no target
./generate-docs.sh -v           # show the full generator output
```

A run with no target does not touch the Karlsruhe deck, because the generator rewrites the
YAML file each time that it runs.

The script finds its own directory, thus you can start it from any directory. It expects the
generator beside this repository. Set `DOC_GENERATOR_DIR` to give a different path. It prints
the page count of each PDF, and it stops with exit code 1 if a document fails.

If Puppeteer reports that it cannot find Chrome, run `npx puppeteer browsers install chrome`
in the generator repository. The script gives this hint when it sees the error.

### Slide YAML rules

- Deck level `theme: dark`. The theme is not set for each slide.
- A `content` slide renders its `title` as the big heading. Do **not** give a slide a `title`
  and also a `heading` block that is not the first block — this makes two headings. When the
  **first** block is a `heading`, the generator does not print the slide `title`. Thus a slide
  uses one of the two, not both.
- **The seven slides from real projects carry a kicker.** They have no slide `title`. Their
  first block is a `heading` with `label: From a real project` and the title. The label prints
  above the title in small orange capitals, and the heading keeps one rule. Do not use the
  `label` of a `text` block for this — a `text` label prints a second rule below the rule of
  the title.
- Block types: `heading`, `text`, `card-grid`, `flow`, `pricing`, `stats`, `table`, `steps`,
  `box`, `list`, `callout`, `cta`, `columns`, `code`, `mermaid`, `image`.
- **Keep the text short.** One idea per sentence. The audience reads a slide in a few seconds.
- A pool slide ends with a `callout` of variant `info`. Keep it to one or two sentences. Use
  title `Demo` when something runs on stage, and title `Walkthrough` when the speaker only
  shows and explains code. A slide from a real project ends with title `Recommendation`.
  One exception: a source footnote. The `axe` slide has a `text` block with small grey HTML
  after the callout, and it prints at the bottom of the slide.
- **The IT-Tage deck has no `Demo` callouts.** The speaker knows the demos. The commands
  stay on the pool slides. The `Recommendation` callouts stay in the deck.
- A `box` item prints its text as plain text, not HTML. A `--` in it becomes a dash.
- Do not use `style: connector` on a `box`. It pushes the value to the right edge, and the
  value wraps. A plain `box` keeps the label and the text together.
- **Images.** Put an image in a `columns` block beside the content, and give it an `alt`.
  Keep the first `heading` block and the last `callout` outside the columns. The template
  limits an image to 400 px height. Use `widths: [6, 4]` for a narrow image (the app) and
  `[4, 6]` for a wide one (UI mode, the trace viewer). Crop a screenshot to the part that
  matters, because a small UI is not readable at the back of the room.
- **The screenshots in `docs/img/` are real.** Playwright made them against the demo app: the
  app (`app-cooldown.png`, `app-boom.png`, with `page.route`), UI mode (`ui-mode.png`, from
  `--ui-port`), the trace viewer (`trace-viewer.png`, from `show-trace --port`) and the
  failed axe test in the HTML report (`axe-error.png`, from `show-report --port`, with
  `ACCESSIBLE_MODE = false`). Make them again after a visual change to the app.
  Note: UI mode deletes `test-results/` when it starts — copy a trace away first.
- The pyramid on the `pyramid` slide is HTML in a `text` block (CSS `clip-path`), not an image.
- The architecture diagram on the `demo-app` slide is HTML in a `text` block too: four tiers
  (tests, frontend, backend, database) with arrows. It replaces the stack table.
- The meme on `mock-or-real-choice` uses `widths: [5.2, 4.8]`, thus its height matches the two
  boxes on the left. The intro text sits above the columns.
- **Give a number on a slide its source.** The `axe` slide marks the claim with `*` and puts
  the sources in that footnote, with a link for each one. The links are live in the PDF.
- **Do not address the speaker in this callout.** Write a generic instruction that the
  speaker follows on stage and that a listener can also use later to do the same thing.
  Start with the command when there is one. Write "pnpm run test:ui — pick a locator with
  the mouse", not "Open UI mode and show the locator picker". Do not write "show", "tell
  the story" or "ask the audience".
- Each `Demo` was run before it went on a slide. Do not write a `Demo` that you did not run.
- **Watch the slide height.** A 16:9 slide holds about 18 lines of code plus two small
  blocks. If a slide has more, the title or the last block is cut off. Always look at the
  generated PDF page after a change.
- The generator rewrites the YAML file when it runs. It removes comments and quotation
  marks. Edit the file with a YAML parser, not with a text search for a quoted string.

## Demo project — "Deploy or Die"

A deployment game. Each deployment has a 50% success rate. After a deployment the user must
wait 30 seconds.

```
src/
  deploy-or-die-frontend/        React 19 + PrimeReact + Rspack, and the TypeScript tests
  deploy-or-die-backend/         ASP.NET Core minimal API (net10.0) + PostgreSQL 16
  deploy-or-die-dotnet-tests/    xUnit v3 + Microsoft.Playwright.Xunit.v3 (net10.0)
  deploy-or-die-apphost/         Aspire AppHost (net10.0), starts all three at once
```

### The Aspire AppHost

`src/deploy-or-die-apphost` starts PostgreSQL, the backend and the frontend with one
command (`dotnet run`, or `aspire run`). It is for a manual demo. No test needs it, and
`generate-docs.sh` does not use it. It is part of `src/deploy-or-die-backend/DeployOrDie.sln`.

- **Aspire has no Rspack resource type.** The frontend uses the generic
  `AddJavaScriptApp(...).WithPnpm()`, which runs the `dev` script — and that script starts
  `rspack serve`. `AddViteApp` is for Vite and does not fit here.
- **The ports stay fixed**: frontend 3000, backend 5000, both with `isProxied: false`. Do
  not let Aspire choose them. The frontend reads the backend URL in the browser from
  `window.BACKEND_URL` and falls back to `http://localhost:5000`, and the specs, the C#
  tests and slide 3 all name these two ports.
- `rspack.config.js` reads `process.env.PORT` and falls back to 3000, because the AppHost
  gives the port in `PORT`.
- The backend gets `ConnectionStrings__DefaultConnection` from the Aspire database
  resource. `db.Database.Migrate()` then makes the database and the schema at startup.

### Versions

| Component | Version | Note |
|---|---|---|
| `@playwright/test` | 1.63.0 | Test locks, `locator.visible()`, aria/screen trace snapshots |
| `@axe-core/playwright` | 4.13.0 | WCAG 2.2 AA scan |
| `Microsoft.Playwright.Xunit.v3` | 1.62.0 | The .NET bindings follow Node, one version behind |
| `Deque.AxeCore.Playwright` | 4.13.0 | axe-core for the C# accessibility test |
| `primereact` | 10.9.7 | Pinned below 11 — v11 is a ground-up rewrite (headless components, new theme provider, drops the classic CSS theme files). Do not bump past the 10.x line without a full re-theme |
| Backend | net10.0 | The API |
| C# tests | net10.0 | Microsoft Testing Platform |

### Two switches drive the demos

`src/deploy-or-die-frontend/src/a11yMode.ts` holds both:

- `ACCESSIBLE_MODE` — **committed as `false`**. This is intentional. With `false` the app has
  three real WCAG defects (`button-name`, `color-contrast`, `label`) and `pnpm run test:a11y`
  **fails**. The speaker sets it to `true` on stage, and the test passes. Do not "repair"
  this by setting it to `true` in the repository.
- `COOLDOWN_SECONDS` — 30. The Clock API demo depends on this value.

### Test projects

`playwright.config.ts` divides the tests into projects:

- `mocked` — every spec except `deploy-integration.spec.ts`. Needs no container. This includes
  `multiple-pages.spec.ts` (slide 13): two tabs in one context, and two users in two contexts.
- `integration` — only `deploy-integration.spec.ts`. Needs Docker Compose.
- `firefox`, `webkit`, `mobile` — the mocked specs on other engines.

The `tests/` folder holds only the specs. The test infrastructure is in `playwright/`: the
global setup and teardown, `testcontainers.ts` and `docker-compose.integration.yml`.

`SKIP_CONTAINERS=1` stops the container start in `playwright/testcontainers.ts`. The `test:mocked`,
`test:a11y`, `test:clock` and `test:retries` scripts set it, because the container start needs about 30 seconds.

`test:retries` passes `--retries=2` on the command line. Do **not** use `CI=1` for this: the
config sets `reuseExistingServer: !process.env.CI`, so with `CI=1` Playwright refuses to start
while the dev server already runs on port 3000 — which it always does on stage.

### Commands

```sh
# Frontend and TypeScript tests
cd src/deploy-or-die-frontend
pnpm install
pnpm run dev                 # the app on http://localhost:3000
pnpm run test:mocked         # 19 tests, about 10 s, no containers (1 fails by design, see above)
pnpm run test:a11y           # the accessibility demo
pnpm run test:clock          # the Clock API demo
pnpm run test:retries        # the isolated-retries demo (1 red on purpose)
pnpm run test:integration    # 4 tests against the real backend, about 4 min
pnpm run test:ui             # UI mode
pnpm run test:report         # the HTML report with Speedboard and Timeline

# C# tests — the frontend must run on port 3000
cd src/deploy-or-die-dotnet-tests/DeployOrDie.E2E.Tests
dotnet test                  # 5 tests, 1 red by design
```

`global.json` in `src/deploy-or-die-dotnet-tests` selects the Microsoft Testing Platform
runner. Without it, `dotnet test` fails on the .NET 10 SDK, because xunit.v3 v4 does not
support the VSTest target.

The C# tests need their own browser download:

```sh
pwsh bin/Debug/net10.0/playwright.ps1 install chromium
```

### The playwright-cli snippet

`src/deploy-or-die-frontend/agent-snippets/cooldown.js` is the code on the `cli-run-code`
slide. It mocks the API, installs the clock, deploys, and runs the 30 second cooldown in one
call. The app must run on port 3000:

```sh
npm install -g @playwright/cli@latest
cd src/deploy-or-die-frontend
playwright-cli open http://localhost:3000
playwright-cli run-code --filename=agent-snippets/cooldown.js
# {"during":"Next deploy in 30s","after":"Deploy Now 🚀"}
```

The snippet waits for the answer before it moves the clock, and it uses `runFor`, not
`fastForward`: `fastForward` jumps over the interval ticks, and there is no retrying `expect`
outside the test runner.

The MCP demo slot (`mcp-demo`) uses the MCP server that comes with Playwright:
`npx playwright mcp` (1.63.0, the same version as the tests).

### Container runtime

The project was made and tested on macOS with Podman. `playwright/testcontainers.ts` switches to
`podman compose` when Testcontainers fails, and it disables Ryuk for Podman.

### Known issue: Firefox fails from an editor's integrated terminal (macOS)

The bundled Firefox from `npx playwright install firefox` fails every launch with "Could not
find profile folder" when the shell it runs in belongs to an app without macOS Full Disk
Access — for example VS Code's integrated terminal. It works fine from a terminal app that
already has Full Disk Access (for example Ghostty). This is
[microsoft/playwright#42768](https://github.com/microsoft/playwright/issues/42768): the
bundled Firefox shares its app-data folder with the real Firefox, and macOS TCC protects
that folder — access is granted per responsible app, not per user.

Fix: System Settings → Privacy & Security → Full Disk Access → enable your editor's app (for
example "Visual Studio Code"), or run `pnpm run test` from a terminal that already has the
grant. Not a project bug, and the `firefox` project is not part of the stage demo.

## Research notes

`docs/playwright-2026-talk.md` is a research file. **It stops at Playwright 1.61.** Versions
1.62 and 1.63 are not in it, but they are in the talk. Check the release notes before you
use a version claim from that file.

`docs/playwright-talk-abstract-de.md` holds the German abstract for the call for papers. The
abstract stays German. The slides are English.
