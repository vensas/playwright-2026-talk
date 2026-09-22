# Playwright in 2026 — Talk Research & Notes

Research dossier for 2026 Playwright talks. Builds on the Webworker Meetup Saar 11/2025
talk (E2E, Testcontainers, Traces, GenAI & MCP). Everything new here is sourced — links
are inline and collected at the bottom. Claims from official Playwright docs/releases are
marked **[official]**; secondary-source or community claims are marked **[community]** and
should be double-checked before being stated as fact on stage.

> Scope: what changed in Playwright through 2026, the roadmap direction, accessibility &
> web-standards testing, exploratory testing with Playwright MCP / Test Agents, and
> capabilities worth adding to the talk that the 11/2025 deck did not cover.

---

## 1. The big picture: what Playwright became in 2026

The two dominant themes of Playwright in 2026 are **AI/agentic testing** and
**developer experience**. Playwright now ships:

- **Test Agents** — a planner / generator / healer workflow for LLM-guided test creation
  and self-healing. **[official]**
- **An official MCP server** (`@playwright/mcp`) that lets AI coding agents drive a real
  browser via the accessibility tree. **[official]**
- **ARIA snapshots** — assertions against the accessibility tree (YAML) instead of brittle
  CSS selectors. **[official]**

Sources: [What's new with Playwright in 2026 (getdecipher)](https://getdecipher.com/blog/whats-new-with-playwright-in-2026),
[Playwright AI Ecosystem 2026 (TestDino)](https://testdino.com/blog/playwright-ai-ecosystem).

---

## 2. Version-by-version: what shipped (late 2025 → 2026)

All from the official [Playwright release notes](https://playwright.dev/docs/release-notes). **[official]**

| Version | Headline features |
|---|---|
| **1.61** (latest) | **WebAuthn passkeys** via virtual authenticators — register passkeys / answer `navigator.credentials.create()` & `get()` without hardware. **Web Storage API** (`page.localStorage.setItem()`, `page.sessionStorage.items()`). `apiResponse.securityDetails()` / `serverAddr()`. New video modes (`on-all-retries`, `retain-on-first-failure`). HAR/traces now capture WebSocket requests. Ubuntu 26.04. |
| **1.60** | `tracing.startHar()` / `stopHar()` — HAR as a first-class API with `await using`. `locator.drop()` for external drag-and-drop. `expect(page).toMatchAriaSnapshot()` on Page + `boxes` option. `browser.on('context')` lifecycle events. |
| **1.59** | **Screencast API** (`page.screencast.start()`, action annotations) replaces old video recorder. `browser.bind()` — share one running browser with playwright-cli / MCP clients. `playwright-cli show` dashboard. `--debug=cli`. **`npx playwright trace`** CLI to explore traces without opening the UI. |
| **1.58** | **Timeline** in the HTML report's **Speedboard** tab (merged reports). "system" theme, editor search, reorganized network panel. |
| **1.57** | **Speedboard** — HTML report tab listing executed tests by duration to find bottlenecks. Switched from Chromium to **Chrome for Testing** builds. `webServer.wait` regex readiness patterns. |
| **1.56** | **Playwright Test Agents** — planner / generator / healer agent definitions. `page.consoleMessages()`, `page.pageErrors()`, `page.requests()`. |
| **1.55** | Codegen can auto-generate `toBeVisible()` assertions. |
| **1.54** | Cookie partitioning (`partitionKey`, CHIPS). Annotation `location`. `--user-data-dir`. |
| **1.51** | `storageState({ indexedDB: true })` — persist IndexedDB (auth tokens). **"Copy prompt"** buttons in report / trace viewer / UI mode for LLM-assisted fixing. `locator.filter({ visible: true })`. `captureGitInfo`. |
| **1.50** | Per-step `test.step(..., { timeout })`. ARIA snapshots stored in separate YAML files. |
| **1.49** | `expect(locator).toMatchAriaSnapshot()` — assert against the accessibility tree. New Chrome headless implementation. |
| **1.48** | `page.routeWebSocket()` — intercept/mock WebSocket connections. "Copy as cURL / fetch" in network panel. |
| **1.45** | **Clock API** (`page.clock.install()`, `pauseAt()`, `fastForward()`). `--fail-on-flaky-tests`. Directory upload. |

> Talk tip: the 11/2025 deck covered Traces, codegen, and MCP at a high level. Everything
> from **1.56 onward (Test Agents, Speedboard/Timeline, screencast, trace CLI, WebAuthn,
> Web Storage API)** is genuinely new material for a 2026 audience.

---

## 3. Roadmap direction (beyond current release)

Playwright does not publish a formal dated roadmap, but the trajectory from shipped releases
and Microsoft advocacy is clear: **[community]** (verify before presenting as commitment)

- **Agentic testing as a first-class citizen** — deeper Test Agents integration, more MCP
  tools, tighter self-healing loops. ([TestDino AI ecosystem](https://testdino.com/blog/playwright-ai-ecosystem))
- **Accessibility-tree-first execution** as the default interaction model for AI. ([getdecipher](https://getdecipher.com/blog/whats-new-with-playwright-in-2026))
- **Observability** — Speedboard/Timeline signal continued investment in "where does test
  time go" tooling. ([release notes](https://playwright.dev/docs/release-notes))
- Broader third-party roadmap commentary: [Playwright Roadmap 2026 (Payilagam)](https://payilagam.com/blogs/playwright-in-2026-complete-roadmap/),
  [What's new Playwright 2026 (Qaskills)](https://qaskills.sh/blog/whats-new-playwright-2026).

> ⚠️ Treat "roadmap" claims from third-party blogs as opinion, not Microsoft commitment.
> The safest on-stage framing is "direction of travel, based on what has shipped."

---

## 4. Web standards angle (new topic for the talk)

Playwright's 2026 additions map directly onto modern web-platform standards — a good hook
for a web-standards-literate audience: **[official]**

- **WebAuthn / passkeys** — virtual authenticators test the [WebAuthn](https://www.w3.org/TR/webauthn-2/)
  credential ceremonies without hardware (1.61).
- **Web Storage API** — first-class `localStorage` / `sessionStorage` access (1.61); IndexedDB
  persistence in `storageState` (1.51).
- **WebSocket** — `routeWebSocket()` mocking (1.48) + WebSocket capture in traces/HAR (1.61).
- **CHIPS / partitioned cookies** — `partitionKey` (1.54) tracks the [Cookies Having Independent
  Partitioned State](https://developers.google.com/privacy-sandbox/cookies/chips) standard.
- **ARIA / Accessibility Object Model** — ARIA snapshots and role-based locators assert against
  the [WAI-ARIA](https://www.w3.org/TR/wai-aria-1.2/) accessibility tree, not the DOM.

> Narrative: "Playwright tests the platform, not just your app" — each standard above has a
> matching Playwright primitive now.

---

## 5. Accessibility testing with `@axe-core/playwright` (new topic)

The official [Playwright accessibility guide](https://playwright.dev/docs/accessibility-testing)
uses the `@axe-core/playwright` package (the axe-core engine as a Playwright fixture). **[official]**

### Core pattern
```ts
import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('homepage has no automatically detectable a11y violations', async ({ page }) => {
  await page.goto('/');
  const results = await new AxeBuilder({ page }).analyze();
  expect(results.violations).toEqual([]);
});
```

### Key `AxeBuilder` methods **[official]**
- `.include(selector)` / `.exclude(selector)` — scope the scan. ⚠️ `exclude()` removes **all**
  rules from the element **and its descendants**.
- `.withTags(['wcag2a','wcag2aa','wcag21a','wcag21aa'])` — target specific WCAG criteria. Default
  runs a broad rule set including best-practice items beyond WCAG.
- `.disableRules(['rule-id'])` — suppress known/accepted violations.
- `.analyze()` — scans the page **in its current state** (call it after each state change).

### Reporting into Playwright
```ts
await testInfo.attach('accessibility-scan-results', {
  body: JSON.stringify(results, null, 2),
  contentType: 'application/json',
});
```
Use a **fixture** to share one AxeBuilder config (rule sets, exclusions) org-wide.

### Standards & limitations (say this on stage) **[official / community]**
- Most US products in 2026 target **WCAG 2.2 Level AA**. ([Qaskills a11y guide](https://qaskills.sh/blog/playwright-accessibility-testing-axe-complete-guide))
- Automated scans catch only a part of the WCAG issues. Pair automation with manual +
  inclusive user testing (e.g. Accessibility Insights).

  **Primary sources — verified 2026-09-22.** The earlier "~30–50%" line came from two
  community blog posts ([QA Madness](https://www.qamadness.com/a-you-oriented-guide-to-axe-core-playwright-accessibility-testing/),
  [TestDino a11y](https://testdino.com/blog/playwright-accessibility)) and matches no single
  study. The numbers that hold up:

  | Source | Figure | What it counts |
  |---|---|---|
  | [Deque](https://www.deque.com/blog/automated-testing-study-identifies-57-percent-of-digital-accessibility-issues/) — 2,000+ audits, ~13,000 pages, ~300,000 issues | **57%** | defect instances fully covered by axe automation (vendor study) |
  | [Karl Groves](https://karlgroves.com/web-accessibility-testing-what-can-be-tested-and-how/) | **25–33%** | WCAG success criteria that are reliably automatable (25% of A, 17% of AA) |
  | GDS tool audit, via [Adrian Roselli](http://adrianroselli.com/2023/01/comparing-manual-and-free-automated-wcag-reviews.html) | **30–40%** | of 142 known issues, found by the best tool |

  The figures are not in conflict: Deque counts *defects found*, Groves counts *criteria that
  can be automated at all*. A small set of automatable rules catches a large share of real
  defects, because the frequent failures (contrast, missing names, missing labels) are the
  automatable ones. The slide names the sources, thus the claim survives a question from the
  audience.

### Complement: ARIA snapshots (built-in, no plugin)
`expect(locator).toMatchAriaSnapshot()` (1.49+) and `toMatchAriaSnapshot()` on Page (1.60)
assert page structure as YAML accessibility trees — catches structural/semantic regressions
axe won't, and doubles as living a11y documentation. ([release notes](https://playwright.dev/docs/release-notes))

---

## 6. Exploratory testing with Playwright MCP & Test Agents

### 6a. Who is actually doing this

- **Debbie O'Brien** (Principal TPM, Microsoft) is the primary voice. Canonical write-up:
  ["Letting Playwright MCP Explore your site and Write your Tests"](https://dev.to/debs_obrien/letting-playwright-mcp-explore-your-site-and-write-your-tests-mf1).
  Talk: ["Supercharged Testing: AI-Powered Workflows with Playwright + MCP"](https://www.youtube.com/watch?v=Numb52aJkJw),
  NDC London (Feb 2026). Podcasts: [Test Guild](https://testguild.com/podcast/automation/a552-debbie/),
  [Modern .NET Show S08E06](https://dotnetcore.show/season-8/testing-made-easy-debbie-obrien-explains-playwright-and-its-game-changing-mcp-server/).
- **Microsoft for Developers** — official end-to-end story:
  ["The Complete Playwright End-to-End Story"](https://developer.microsoft.com/blog/the-complete-playwright-end-to-end-story-tools-ai-and-real-world-workflows).
- **Tooling ecosystem** around AI/exploratory Playwright **[community]**: TestDino (AI test
  reporting / flaky detection), ZeroStep, Octomind (autonomous flows), TestSprite (MCP-driven
  loop), AgentQL (`page.get_by_ai`), Auto Playwright (`auto()`). ([Qaskills AI gen](https://qaskills.sh/blog/ai-test-generation-playwright-2026),
  [BrowserStack guide](https://www.browserstack.com/guide/playwright-ai-test-generator)).

### 6b. Debbie O'Brien's concrete exploratory workflow **[official-ish, from her post]**

MCP configured in `.vscode/mcp.json`:
```json
{ "servers": { "playwright": { "command": "npx", "args": ["@playwright/mcp@latest"] } } }
```
A prompt file (`.github/generate_tests.prompt.md`) enforces the key rule:
> "DO NOT generate test code based on the scenario alone. DO run steps one by one using the
> tools provided by the Playwright MCP."

Then the human just says: `Explore https://debs-obrien.github.io/playwright-movies-app`
The agent navigates, discovers features (search, theme toggle, nav), interacts like a real
user, **uncovers edge cases** (her demo finds a search bug returning "Kill" instead of "Star
Wars"), then generates a TS test using role-based locators + auto-retrying assertions, saves
it to `tests/`, runs it, and iterates until green.

### 6c. Test Agents (the productized version of the above) **[official]**

[Playwright Test Agents docs](https://playwright.dev/docs/test-agents) — three agents:
- **Planner** — explores the app and produces a Markdown test plan in `specs/` (bootstrapped
  by a seed test that sets up fixtures/context).
- **Generator** — turns the plan into Playwright test files in `tests/`, verifying selectors
  and assertions live against the running app.
- **Healer** — replays failing steps, inspects current UI to find equivalent elements,
  suggests a patch, and re-runs until it passes.

Setup: `npx playwright init-agents --loop=claude` (also `--loop=copilot` etc.). Regenerate
agent definitions after every Playwright upgrade to pick up new MCP tools.

### 6d. How MCP explores: accessibility-tree-first **[official]**

The [MCP server](https://github.com/microsoft/playwright-mcp) works on **structured data, not
screenshots**. `browser_snapshot` returns the accessibility tree (roles, labels, ref ids) —
token-efficient and deterministic vs. pixel/vision approaches. 20+ core tools plus opt-in caps
(`--caps=vision` for coordinates, network mocking, storage, tracing, PDF, assertions). The repo
explicitly names *"exploratory automation, self-healing tests, or long-running autonomous
workflows"* as its sweet spot.

### 6e. The honest caveat for the audience **[community]**
AI-generated tests "can look correct and still be worthless" — hard-coded waits, brittle
selectors, missing assertions. **The differentiator is the review/hardening workflow, not the
generator.** Use MCP for discovery; codify critical paths into reviewed `.spec.ts` for CI.
([Qaskills AI gen](https://qaskills.sh/blog/ai-test-generation-playwright-2026),
[testcollab MCP](https://testcollab.com/blog/playwright-mcp))

---

## 7. Capabilities the 11/2025 talk missed (each sourced)

All **[official]** from [release notes](https://playwright.dev/docs/release-notes) unless noted.
Good "did you know?" segment.

1. **Clock API** (1.45) — control `Date`, `setTimeout`, `setInterval`; `install()`, `pauseAt()`,
   `fastForward()`. Makes time-dependent UI (countdowns, polling, token expiry) fast & deterministic.
2. **Component testing** — mount & test individual React/Vue/Svelte components in a real browser.
   ([getdecipher](https://getdecipher.com/blog/whats-new-with-playwright-in-2026))
3. **WebSocket mocking** (`routeWebSocket()`, 1.48) — mock realtime backends; relevant to the
   "Deploy or Die" live-updates demo.
4. **WebAuthn passkeys** (1.61) — test passwordless auth flows without hardware.
5. **`storageState({ indexedDB })`** (1.51) — persist IndexedDB-based auth to skip re-login.
6. **"Copy prompt" buttons** (1.51) — one-click LLM-assisted failure fixing from report/trace/UI.
7. **Trace CLI** (`npx playwright trace`, 1.59) — explore traces from the terminal; turns an
   agent into a test debugger with no UI.
8. **`browser.bind()`** (1.59) — share one live browser across playwright-cli + MCP + tools.
9. **Screencast API** (1.59) — annotated video with action overlays/chapters (better demos/repros).
10. **Speedboard + Timeline** (1.57/1.58) — find slow tests and see where wall-clock time goes.
11. **API testing / request context** — `apiResponse.securityDetails()` / `serverAddr()` (1.61)
    extend Playwright's existing API-testing story (worth a mention if not already in the deck).
12. **Codegen auto-assertions** (1.55) — codegen now scaffolds `toBeVisible()` assertions, not
    just actions.

---

## 8. Suggested talk framings (pick per audience)

- **"Playwright grew up in 2026"** — from E2E runner → agentic testing platform. Arc:
  Traces (2025 deck) → Test Agents + MCP → self-healing.
- **"Test the platform, not just your app"** — §4 web-standards angle + §5 accessibility.
- **"Exploratory testing, automated"** — Debbie O'Brien's MCP demo live, then the honest caveat
  (§6e): discovery vs. reviewed regression.
- **"Accessibility as a first-class test"** — axe + ARIA snapshots + WCAG 2.2 AA + the "only
  ~50% automatable" honesty.

> Verify before stage: anything marked **[community]**, all §3 roadmap claims, and re-check the
> latest version number the week of the talk (this dossier reflects 1.61 as latest, mid-2026).

---

## Sources

**Official (Playwright / Microsoft)**
- Release notes — https://playwright.dev/docs/release-notes
- Accessibility testing — https://playwright.dev/docs/accessibility-testing
- Test Agents — https://playwright.dev/docs/test-agents
- Playwright MCP repo — https://github.com/microsoft/playwright-mcp
- The Complete Playwright E2E Story (MS Devs) — https://developer.microsoft.com/blog/the-complete-playwright-end-to-end-story-tools-ai-and-real-world-workflows
- Debbie O'Brien — MCP explore & write tests — https://dev.to/debs_obrien/letting-playwright-mcp-explore-your-site-and-write-your-tests-mf1
- Debbie O'Brien — Supercharged Testing (NDC, video) — https://www.youtube.com/watch?v=Numb52aJkJw

**Secondary / community (verify before quoting)**
- What's new with Playwright in 2026 — https://getdecipher.com/blog/whats-new-with-playwright-in-2026
- Playwright AI Ecosystem 2026 (TestDino) — https://testdino.com/blog/playwright-ai-ecosystem
- Playwright Accessibility with Axe (Qaskills) — https://qaskills.sh/blog/playwright-accessibility-testing-axe-complete-guide
- Axe-core Playwright guide (QA Madness) — https://www.qamadness.com/a-you-oriented-guide-to-axe-core-playwright-accessibility-testing/
- Playwright Accessibility (TestDino) — https://testdino.com/blog/playwright-accessibility
- AI Test Generation with Playwright 2026 (Qaskills) — https://qaskills.sh/blog/ai-test-generation-playwright-2026
- Generating E2E Tests with AI + MCP (BrowserStack) — https://www.browserstack.com/guide/playwright-ai-test-generator
- Playwright MCP setup (testcollab) — https://testcollab.com/blog/playwright-mcp
- Playwright Roadmap 2026 (Payilagam) — https://payilagam.com/blogs/playwright-in-2026-complete-roadmap/
- What's new Playwright 2026 (Qaskills) — https://qaskills.sh/blog/whats-new-playwright-2026
- Test Guild podcast w/ Debbie O'Brien — https://testguild.com/podcast/automation/a552-debbie/
</content>
</invoke>
