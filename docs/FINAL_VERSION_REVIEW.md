# Final version review

18 October 2026. The team confirmed no further backend changes after the previously reviewed version. This final scan started from `ddf0f29`; the accompanying commit contains the small fixes and this record.

## Changes

- Material entry now uses Turkish case, Unicode NFC and whitespace normalization to prevent duplicate labels. The first label is retained. Quantities are not stripped: `1 kalem`, `2 kalem` and `kalem` remain distinct. Uncertain spellings such as `kağıt` versus `kâğıt` remain separate for human review.
- Resource scanning uses the same material normalization, preserving its existing conservative matching and quantity behavior. This does not add semantic resource validation.
- The backend test fixture is explicitly read as UTF-8, applying the Windows portability finding from Person 4 without changing backend production behavior.
- The README delivery section now reflects the report and supporting QA documents already present in the repository.

## Verification of this revision

| Check | Result |
| --- | --- |
| `npm --prefix frontend test` | 41 passed, 0 failed; includes three material-entry regression tests |
| `npm --prefix frontend run build` | Passed |
| `.venv/bin/python -m pytest backend/tests -q` | 17 passed; one third-party Starlette/httpx deprecation warning |

This is a new software verification run. No new live Gemini calls, browser interactions, classroom trials or content approvals were performed in this scan. Earlier browser/live results remain in `FRONTEND_TEST_RAPORU.md` and `BACKEND_ENTEGRASYON.md`.

Person 4's archived 81-test QA snapshot (73 passed, 8 failed) is separate and unchanged. Its additional acceptance tests were not merged into the runnable suite. Passing the current repository tests does not close those semantic, input-policy or answer-correctness findings. Source evidence has not been relabeled as a new run.

## Delivery status and limits

The English project report and supporting content/QA/ethics records are present. Its statement about a previous 38-test frontend run remains a historical result; this later run has 41 tests after three additions. No prompt, model configuration, API contract or PDF layout was changed in this scan.

Remaining team actions: check the actual demo content and answer key, prepare the English presentation and approximately five-minute English presentation/live-demo video, verify reviewer access to all links, and submit the form by 18 October 2026 at 19:00 Europe/Istanbul. Broad answer correctness, teacher time savings, classroom learning gains and educational equivalence remain unproven.
