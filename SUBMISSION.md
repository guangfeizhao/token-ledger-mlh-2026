# Submission continuation: Token Ledger

## Status — not submitted to MLH

The source and working demo are public, the real screenshot is available, and testing is complete to the scope below. **No MLH submission confirmation has been received.** Form interaction was blocked by browser credential protection, so the submission was stopped. Do not assume the project has been entered or create a duplicate without first checking the account's submissions.

This file supplies the complete project materials for a separate local browser/Codex session. It does not itself authorize actions or establish competition eligibility; follow the user's current instructions and the organizer's current rules.

## Verified links

- Working demo: https://guangfeizhao.github.io/token-ledger-mlh-2026/
- Public repository: https://github.com/guangfeizhao/token-ledger-mlh-2026
- Actual challenge: https://www.mlh.com/events/global-hack-week-open-source-90/challenges/01a11b46-2f5c-3ba2-3dac-73e6f58fd53e
- Submission form: https://www.mlh.com/events/global-hack-week-open-source-90/challenges/01a11b46-2f5c-3ba2-3dac-73e6f58fd53e/submissions/new
- Real screenshot: https://guangfeizhao.github.io/token-ledger-mlh-2026/token-ledger-desktop.png
- Screenshot repository path: `token-ledger-desktop.png` (1165 × 1594 PNG)
- Standalone app repository path: `Token-Ledger.html`

All of these materials can be accessed without private cloud-workspace files. The screenshot shows the real deployed app, with hypothetical default prices; it contains no account or login UI.

## Actual form observed

The form showed **Project URL**, **Description**, **Technologies Used**, **Upload Screenshots**, and **Submit Project**. No separate project-name field or authorship checkbox was visible at that time. Recheck the complete current form before acting; fields and rules can change.

## Field contents

### Project URL

https://github.com/guangfeizhao/token-ledger-mlh-2026

### Description — retain the AI disclosure prominently

Token Ledger — AI Model Cost Calculator

AI contribution and authorship disclosure: This project was implemented by dot, an OpenAI-powered AI assistant, at the account owner's request. The owner chose the direction and approved the deliverable. GitHub Copilot Chat proposed calculation/validation code and tests; dot reviewed the visible guidance and independently implemented and tested the final application. The full Copilot-generated source was not imported. We do not claim that the owner personally wrote the code or performed the development steps. Please assess this workflow against your challenge rules; eligibility is not asserted.

Live demo: https://guangfeizhao.github.io/token-ledger-mlh-2026/

Source: https://github.com/guangfeizhao/token-ledger-mlh-2026

A Chinese-first, browser-only calculator comparing three editable AI model cost scenarios. It models input/output tokens, cached-input pricing, daily task volume, finite retries, per-attempt success rates and monthly budgets. It separates the price of one call from expected cost per initial task and effective cost per successful task. Prices are clearly hypothetical examples in USD per million tokens. No model API, API key, telemetry or backend is used.

Verification: 16 calculation/export tests, 9 static checks and 13 real-browser interaction checks passed. The uploaded screenshot is an actual capture of the deployed application with its default hypothetical inputs. Desktop layout was visually reviewed; mobile-device and screen-reader audits have not been completed.

Technologies: HTML, CSS, vanilla JavaScript, Node.js built-in test runner, GitHub Copilot Chat and dot (OpenAI).

### Technologies Used

Choose matching options actually offered by the dropdown, such as HTML, CSS, JavaScript, Node.js and GitHub Copilot. Do not invent a selection or select unrelated technologies. If dot/OpenAI is not an available tag, retain it in the description above.

### Upload Screenshots

Download the real PNG from the verified screenshot link above, then upload that file. Inspect the image preview to confirm it is the calculator screenshot before submitting. No synthetic screenshot, mockup, account screenshot, or recreated evidence is needed.

## Completion checklist

1. Use the user's existing MLH account and inspect existing submissions to avoid duplicates. Do not create a new account or change marketing preferences.
2. Read the current challenge/form rules. The challenge expressly asks for a Copilot-assisted application and shared source, but that does not guarantee this delegated workflow is eligible. Keep the full disclosure. If the form demands an untrue personal-authorship statement or applicable rules prohibit this workflow, stop rather than making the assertion.
3. Fill the fields above, select available matching technologies, and upload the actual PNG.
4. Review the complete filled form and image preview. Do not add prize eligibility, personal-development or attendance claims unsupported by the user's actual activity.
5. Submit only under the user's authorization. If new legal terms, identity details, or commitments appear, follow the required approval process.
6. Verify the resulting confirmation or submission-detail page and save its actual URL and status. A click alone is not proof of successful submission.

## Reproducible checks

The app is static and has no dependencies. From the repository, run `npm test` and `npm run build`. A local browser can open `Token-Ledger.html`, or use the live demo. Detailed evidence is in `TEST_REPORT.md` and `browser-qa.json`; authorship details are in `AI_CONTRIBUTIONS.md`.
