DO write all slides, code and comments in ASD-STE100 (Simplified Technical English).
DO keep `AGENTS.md` and `README.md` up to date with the latest implementations.
DO regenerate the PDF with `./generate-docs.sh` after each change to a document YAML.
DO keep the talk deck and the demo script in sync — see "Keep the talk deck and the demo script in sync".
DO ask before you change the talk content — the speaker decides what goes on a slide.
DO NOT put the content of `AGENTS.md` in the presentation.
DO NOT commit, push or open a pull request without a request from the user.

## The talk

"Playwright Beyond the Happy Path — E2E tests, accessibility and MCP in practice."
An update of the Webworker Meetup Saar 11/2025 talk (`../webworker-meetup-saar-11-2025-playwright`).

- Audience: developers. The talk is code first.
- Event: **.NET User Group Karlsruhe, 24 September 2026**, DJK Ost, Karlsruhe.
  The Meetup listing uses the German title, but the deck stays English — the speaker decided this.
  The audience is .NET developers. This is why the .NET block is three slides, not one.

### Two decks

| Deck | File | Slides | Purpose |
|---|---|---|---|
| Talk deck | `playwright-beyond-the-happy-path` | 21 | The event on 2026-09-24. 48 minutes on stage, plus about 10 minutes for questions in the 60 minute slot. |
| Content pool | `playwright-content-pool` | 30 | Every slide. Not tied to an event. A new talk deck takes the slides that it needs from here. |

**Make a new slide in the pool first.** Then copy it into a talk deck. A talk deck holds no
slide that the pool does not have.

### The blocks of the talk deck

| Block | Slides | Subject |
|---|---|---|
| Frame | 1–3 | Cover, about me, the demo app |
| A · Tools and traces | 4–8 | UI mode, test folder ★, traces, artifacts in CI ★, test pyramid ★ |
| B · Mock or real | 9–13 | `page.route`, Testcontainers, Compose ★, how to choose ★, when to run ★ |
| C · Accessibility | 14 | axe-core as a gate, red to green |
| D · .NET | 15–17 | The same test in C# with xUnit, what the bindings can and cannot do, axe in C# |
| E · AI and agents | 18–19 | MCP server, the caveat |
| Close | 20–21 | Lessons learned, questions |

★ = a slide from a real project. **Personal experience is the reason for this talk.** All six
of these slides are in the talk deck. If the talk must become shorter, cut a feature slide,
not one of these.

### The 9 slides that the talk deck does not have

They stay in the pool: locators, codegen, test locks, Speedboard, isolated retries, Clock API,
ARIA snapshots, Test Agents, and the outlook. Reasons: UI mode, test locks and isolated retries
have no equivalent in .NET (the audience uses xUnit); codegen and the Clock API appear in the
C# slides; the others are a feature tour, and experience beats features here.

### Playwright Test features that .NET does not have

Slide 16 of the talk deck (`dotnet-parity`) lists the full split. The pool also has slides for
test locks and isolated retries, and both carry a caveat line. Do not remove these lines: the
audience is a .NET user group, and the claim would otherwise be wrong for them. The talk deck
does not show these two features, thus the speaker says in one sentence what they are — the
demo script has this step.

### Out of scope (the speaker decided this)

- **WebSocket mocking** — the demo app has no WebSocket feature. One line in the pool only.
- **Component testing** (1.62) — one line in the pool only.
- **WebAuthn passkeys** (1.61) — parking lot. One line in the pool only.

These three lines are on the `outlook` slide, which is in the pool and not in the talk deck.

## Documents

All three documents use the **vensas-doc-generator** (`../vensas-doc-generator`). They do
**not** use Marp any more. The old Marp deck was deleted.

```
docs/
  playwright-beyond-the-happy-path.yaml   the talk deck — type: slides, 21 slides, theme dark
  playwright-beyond-the-happy-path.pdf    generated, do not edit
  playwright-content-pool.yaml            the content pool — type: slides, 30 slides, theme dark
  playwright-content-pool.pdf             generated, do not edit
  playwright-demo-script.yaml             the stage script — type: report, 8 sections
  playwright-demo-script.pdf              generated, do not edit
  avatar.jpg                              the photo on the about-me slide
  repo-qr.png                             the QR code on the last slide
```

The three YAML files are the only source of truth. Use `generate-docs.sh` in the repository
root after each change — it makes all PDFs with one command:

```sh
./generate-docs.sh              # all three documents
./generate-docs.sh slides       # only the talk deck
./generate-docs.sh pool         # only the content pool
./generate-docs.sh script       # only the demo script
./generate-docs.sh -v           # show the full generator output
```

The script finds its own directory, thus you can start it from any directory. It expects the
generator beside this repository. Set `DOC_GENERATOR_DIR` to give a different path. It prints
the page count of each PDF, and it stops with exit code 1 if a document fails.

If Puppeteer reports that it cannot find Chrome, run `npx puppeteer browsers install chrome`
in the generator repository. The script gives this hint when it sees the error.

### The demo script (type `report`)

The stage script uses document type `report`, not `training-material`. Two reasons:
the `training-material` layout prints the German labels "Aufgabe" and "Hinweis", and its
`description` field does not render Markdown. The `report` layout has no visible German text,
and `sections[].content` accepts HTML.

- Write `sections[].content` as **HTML**, not Markdown: `<ol><li>…</li></ol>` and `<code>…</code>`.
- The layout styles `ol`, `li` and inline `code`. It does **not** style `pre`. Do not use
  code blocks — put a command in inline `<code>`.
- Each section ends with a `<p><strong>Watch out:</strong> …</p>` line for the trap in that session.
- `tables` renders after all sections. The command reference at the end uses this.

### Slide YAML rules

- Deck level `theme: dark`. The theme is not set for each slide.
- A `content` slide renders its `title` as the big heading. Do **not** give a slide a `title`
  and also a `heading` block that is not the first block — this makes two headings. When the
  **first** block is a `heading`, the generator does not print the slide `title`. Thus a slide
  uses one of the two, not both.
- **The six slides from real projects carry a kicker.** They have no slide `title`. Their
  first block is a `heading` with `label: From a real project` and the title. The label prints
  above the title in small orange capitals, and the heading keeps one rule. Do not use the
  `label` of a `text` block for this — a `text` label prints a second rule below the rule of
  the title.
- Block types: `heading`, `text`, `card-grid`, `flow`, `pricing`, `stats`, `table`, `steps`,
  `box`, `list`, `callout`, `cta`, `columns`, `code`, `mermaid`, `image`.
- Each slide ends with a `callout` of variant `info`. Keep it to one or two sentences. Use
  title `Demo` when something runs on stage, and title `Walkthrough` when the speaker only
  shows and explains code.
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

## Keep the talk deck and the demo script in sync

`docs/playwright-beyond-the-happy-path.yaml` (the **talk deck**) and
`docs/playwright-demo-script.yaml` (the stage script) are **coupled**. The demo script
refers to slides by number. If you change one file and not the other, the speaker reads a
step for a slide that is no longer there.

**The content pool has no demo script.** A change in the pool alone breaks nothing. It
becomes relevant when a slide moves from the pool into the talk deck.

**After each change to the talk deck or to the script, check all five points below and
correct both files.**

| # | Coupling | What breaks if you forget |
|---|---|---|
| 1 | **Slide numbers** — the demo script writes them as `[4]`, and in each heading as "Slides 4–8" | A step points to the wrong slide |
| 2 | **The `Demo` / `Walkthrough` callout** on a slide and the step for that slide in the script | The slide promises one thing, the speaker does another |
| 3 | **Time boxes** — the minutes in each script heading, and the sum in the script intro | The talk does not fit in the 60 minute slot with questions |
| 4 | **Commands** — the `scripts` in `src/deploy-or-die-frontend/package.json` | A command on stage does not exist |
| 5 | **The command reference table** at the end of the script | The quick reference is wrong |

If you **add, remove or move a slide in the talk deck**, every later slide number changes.
Renumber the whole demo script, not only the slide that you touched.

Then generate the PDFs with one command, and look at them:

```sh
./generate-docs.sh
```

Only write a demo step that you have run. Do not promise a failure on stage that you did not
see. Example: the four integration tests write no shared row, so they do **not** reliably
conflict when you remove the test lock. The script says this.

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

- `mocked` — every spec except `deploy-integration.spec.ts`. Needs no container.
- `integration` — only `deploy-integration.spec.ts`. Needs Docker Compose.
- `firefox`, `webkit`, `mobile` — the mocked specs on other engines.

`SKIP_CONTAINERS=1` stops the container start in `tests/testcontainers.ts`. The `test:mocked`,
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
pnpm run test:mocked         # 17 tests, about 10 s, no containers (1 fails by design, see above)
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

### Container runtime

The project was made and tested on macOS with Podman. `tests/testcontainers.ts` switches to
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
