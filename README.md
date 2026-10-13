# Token Ledger · AI 模型成本计算器

A dependency-free, Chinese-first calculator for AI workflow costs: tokens, cached inputs, retries, success rates and monthly budgets.

## AI contribution and authorship disclosure

This project was implemented by **dot, an OpenAI-powered AI assistant, on the account owner's instructions**. The owner selected the project direction and approved the resulting deliverable. It is **not represented as code personally written by the owner**.

GitHub Copilot Chat was actually used to propose a JavaScript calculation/validation implementation and tests. dot reviewed the visible explanation and validation schema, then independently implemented the final application and tests. The complete Copilot-generated source file was not imported. See [AI_CONTRIBUTIONS.md](AI_CONTRIBUTIONS.md).

This disclosure does not establish eligibility for any competition. Organizers decide whether this workflow meets their rules.

## Try it

Download `Token-Ledger.html` and open it in a browser. It is a complete offline single-file app; no installation, API key or server is required. Alternatively, clone/download the repository and open `index.html` with its neighboring assets intact.

## Features

- Compare three editable hypothetical model scenarios
- Input/output token costs in **USD per million tokens**
- Cached-input pricing and cache-hit percentage
- Daily initial-task count, billing days and monthly budget
- Per-model success rate and shared finite retry limit
- Per-attempt, per-task, per-success, daily and monthly costs
- Expected attempts, eventual success probability and over-budget warnings
- Explicit invalid-input feedback and reset-to-example action

**All default prices are hypothetical examples, not live quotes.** No actual model API is called. Inputs remain in the current page; there is no telemetry, network request or persistence.

## Calculation assumptions

Every attempt consumes the same average input/output tokens and cache ratio. Attempts succeed independently. A task stops on success or after `retries + 1` attempts.

`attemptCost = (inputTokens × ((1 − h) × inputPrice + h × cachePrice) + outputTokens × outputPrice) / 1,000,000`

With per-attempt success probability `p`, expected attempts are the sum of `(1 − p)^k` for `k = 0…retries`. The eventual success probability is `1 − (1 − p)^(retries + 1)`.

The effective cost per successful task includes spending on unsuccessful tasks. When eventual success is zero, this result is undefined and displayed as “—”. Nonzero monthly budgets must be at least USD 0.01, and nonzero success rates at least 0.000001%.

Cache writes, tool calls, storage, taxes, minimum charges, batch discounts and tiered pricing are not included. Actual invoices may differ.

## Develop and test

Only Node.js is needed for tests/build; there are no npm dependencies.

```sh
npm test
npm run build
```

`build.cjs` bundles the local CSS and JavaScript into `Token-Ledger.html`.

16 calculation/export tests and 9 static checks passed. Browser interaction/visual testing is still pending; static checks are not a complete accessibility audit. See [TEST_REPORT.md](TEST_REPORT.md).

## Technology

HTML, CSS, vanilla JavaScript and Node.js's built-in test runner. No runtime backend, external assets, analytics, accounts or credentials are used by the app.
