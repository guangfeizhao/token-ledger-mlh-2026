# Test report

Verified on 2026-10-13 UTC using Node.js 24.19.0.

- 16 calculation/export tests passed
- 9 static checks passed
- JavaScript syntax checks passed
- Single-file build completed
- Source archive and bundled files checked for consistency

The calculation suite covers cached-input and output pricing, numeric strings, missing/blank/negative/nonfinite inputs, integer/range limits, zero/100% success rates, no/maximum retries, zero/100% cache, zero usage/prices, zero and over-budget scenarios, extremely small budgets, unsafe magnitudes, coercion errors, small success probabilities, and browser-global export. One property test checks 88 success-rate/retry combinations.

Reference scenario: 2,000 input tokens, 500 output tokens, 40% cached input, input/cached/output prices of USD 1/0.1/4 per million tokens, 80% per-attempt success, 2 retries, 1,000 initial tasks per day and 30 days:

- Attempt cost: USD 0.00328
- Expected attempts: 1.24
- Eventual success: 99.2%
- Initial-task cost: USD 0.0040672
- Daily cost: USD 4.0672
- Monthly cost: USD 122.016
- Effective cost per successful task: USD 0.0041

## Current limits

Browser interaction and visual testing, screen-reader testing, mobile rendering verification, and application screenshots are pending. Static presence checks do not prove actual accessibility or rendered layout quality.
