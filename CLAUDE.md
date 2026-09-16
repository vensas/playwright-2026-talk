> **Sync Notice:** This file is mirrored in `AGENTS.md`. When updating this file, also update `AGENTS.md` to keep instructions consistent across AI assistants.

DO write all slides, code and comments in ASD-STE100 (Simplified Technical English).
DO keep `AGENTS.md`, `CLAUDE.md` and `README.md` up to date with the latest implementations.
DO regenerate the PDF with `./generate-docs.sh` after each change to a document YAML.
DO keep the deck and the demo script in sync — see "Keep the deck and the demo script in sync".
DO ask before you change the talk content — the speaker decides what goes on a slide.
DO NOT put the content of `CLAUDE.md` in the presentation.
DO NOT commit, push or open a pull request without a request from the user.

## The talk

"Playwright Beyond the Happy Path — E2E tests, accessibility and MCP in practice."
An update of the Webworker Meetup Saar 11/2025 talk (`../webworker-meetup-saar-11-2025-playwright`).

- Audience: developers. The talk is code first.
- Length: 45 to 60 minutes. The current deck plans for about 53 minutes.
- Structure: 24 slides. One slide for each talking point, and a demo for each slide.
- The demos run as 6 continuous sessions, one for each block. Each slide is a beat in its session.
- Event: **.NET User Group Karlsruhe, 24 September 2026**, DJK Ost, Karlsruhe.
  The Meetup listing uses the German title, but the deck stays English — the speaker decided this.
  The audience is .NET developers. This is why the .NET block is three slides, not one.

### The 6 blocks

| Block | Slides | Subject |
|---|---|---|
| Frame | 1–3 | Cover, what changed since 2025, the demo app |
| A · Fundamentals | 4–7 | Locators and auto-wait, UI mode, codegen, traces |
| B · Mock or real | 8–12 | `page.route`, Testcontainers, test locks, Speedboard, isolated retries |
| C · Time control | 13 | Clock API |
| D · Accessibility | 14–15 | axe-core, ARIA snapshots |
| E · .NET | 16–18 | The same test in C# with xUnit, what the bindings can and cannot do, axe in C# |
| F · AI and agents | 19–21 | MCP server, Test Agents, the caveat |
| Close | 22–24 | Lessons learned, outlook, questions |

### Playwright Test features that .NET does not have

Slides 10 (test locks) and 12 (isolated retries) carry a caveat line, because both are
**Playwright Test** features. The .NET bindings have no equivalent — there the runner is
xUnit. Slide 17 lists the full split. Do not remove these lines: the audience is a .NET
user group, and the claim would otherwise be wrong for them.

### Out of scope (the speaker decided this)

- **WebSocket mocking** — the demo app has no WebSocket feature. One line on slide 21 only.
- **Component testing** (1.62) — one line on slide 21 only.
- **WebAuthn passkeys** (1.61) — parking lot. One line on slide 21 only.

## Documents

Both documents use the **vensas-doc-generator** (`../vensas-doc-generator`). They do **not**
use Marp any more. The old Marp deck was deleted.

```
slides/
  playwright-beyond-the-happy-path.yaml   the deck — type: slides, 24 slides, theme dark
  playwright-beyond-the-happy-path.pdf    generated, do not edit
  playwright-demo-script.yaml             the stage script — type: report, 8 sections
  playwright-demo-script.pdf              generated, do not edit
```

The two YAML files are the only source of truth. Use `generate-docs.sh` in the repository
root after each change — it makes both PDFs with one command:

```sh
./generate-docs.sh              # both documents
./generate-docs.sh slides       # only the deck
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
- A `content` slide renders its `title` as the big heading. Do **not** also start `blocks`
  with a `heading` block — this makes two headings.
- Block types: `heading`, `text`, `card-grid`, `flow`, `pricing`, `stats`, `table`, `steps`,
  `box`, `list`, `callout`, `cta`, `columns`, `code`, `mermaid`, `image`.
- Each slide ends with a `callout` of variant `info`. This is the stage instruction for
  that slide. Keep it to one or two sentences. Use title `Demo` when something runs on
  stage, and title `Walkthrough` when the speaker only shows and explains code. Every
  slide from 2 to 21 is a `Demo` — each one was run before it went on a slide.
- **Watch the slide height.** A 16:9 slide holds about 18 lines of code plus two small
  blocks. If a slide has more, the title or the last block is cut off. Always look at the
  generated PDF page after a change.
- The generator rewrites the YAML file when it runs. It removes comments and quotation
  marks. Edit the file with a YAML parser, not with a text search for a quoted string.

## Keep the deck and the demo script in sync

`slides/playwright-beyond-the-happy-path.yaml` (the deck) and
`slides/playwright-demo-script.yaml` (the stage script) are **coupled**. The demo script
refers to slides by number. If you change one file and not the other, the speaker reads a
step for a slide that is no longer there.

**After each change to either file, check all five points below and correct both files.**

| # | Coupling | What breaks if you forget |
|---|---|---|
| 1 | **Slide numbers** — the demo script writes them as `[4]`, and in each heading as "Slides 4–7" | A step points to the wrong slide |
| 2 | **The `Demo` / `Walkthrough` callout** on a slide and the step for that slide in the script | The slide promises one thing, the speaker does another |
| 3 | **Time boxes** — the minutes in each script heading, and the sum in the script intro | The talk does not fit in 45 to 60 minutes |
| 4 | **Commands** — the `scripts` in `src/deploy-or-die-frontend/package.json` | A command on stage does not exist |
| 5 | **The command reference table** at the end of the script | The quick reference is wrong |

If you **add, remove or move a slide**, every later slide number changes. Renumber the whole
demo script, not only the slide that you touched.

Then generate **both** PDFs with one command, and look at both:

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
  deploy-or-die-frontend/        React 18 + PrimeReact + Rspack, and the TypeScript tests
  deploy-or-die-backend/         ASP.NET Core minimal API (net9.0) + PostgreSQL 16
  deploy-or-die-dotnet-tests/    xUnit v3 + Microsoft.Playwright.Xunit.v3 (net10.0)
```

### Versions

| Component | Version | Note |
|---|---|---|
| `@playwright/test` | 1.63.0 | Test locks, `locator.visible()`, aria/screen trace snapshots |
| `@axe-core/playwright` | 4.13.0 | WCAG 2.2 AA scan |
| `Microsoft.Playwright.Xunit.v3` | 1.62.0 | The .NET bindings follow Node, one version behind |
| `Deque.AxeCore.Playwright` | 4.13.0 | axe-core for the C# accessibility test |
| Backend | net9.0 | The API |
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

## Research notes

`docs/playwright-2026-talk.md` is a research file. **It stops at Playwright 1.61.** Versions
1.62 and 1.63 are not in it, but they are in the talk. Check the release notes before you
use a version claim from that file.

`docs/playwright-talk-abstract-de.md` holds the German abstract for the call for papers. The
abstract stays German. The slides are English.
