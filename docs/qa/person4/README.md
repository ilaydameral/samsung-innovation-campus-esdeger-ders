# Person 4 QA evidence snapshot

Selected documents and recorded evidence from the team-provided `Kisi4_Guncel.zip` (18 October 2026). Selected source files are preserved byte for byte; `IMPORTED_FILES.json` records archive paths and SHA-256 hashes.

## Scope and results

- 81 automated test cases: 73 passed, 8 failed; the production build passed separately.
- 13 live checks were blocked because this QA environment had no API key. Eleven content/browser checks were not run.
- These records concern the contributor's snapshot, not a new test run on the current repository HEAD. Its original commit is unknown. Importing the records does not resolve failures or complete pending checks.
- Controlled invalid responses show validation boundaries, not observed live Gemini failures. Percentages are test pass rates, not model accuracy or educational effectiveness.

## Read first

- [Results](TEST_RESULTS.md), [test matrix](TEST_MATRIX.md), [bug register](BUG_REPORT.md).
- [Ethical evaluation](ETHICAL_EVALUATION.md), [known limitations](KNOWN_LIMITATIONS.md).
- [Final demo checklist](SON_DEMO_KONTROLU.md), [targeted retest sheet](HEDEFLI_RETEST.csv).
- JUnit XML, metrics, build output and environment evidence are in `evidence/`.

## Import boundary

Only supporting documents and evidence were imported. The contributor's application copy, package changes, QA tests, execution scripts and installation logs were not merged. References to scripts or contributor-added test files describe the source package, not executable instructions for this repository. Source hashes identify that package, not the current checkout.

The contributor did not have the complete Person 3 report when revising this package. Its P3-01/P3-02 entries remain EVIDENCE PENDING. The original report is now in `../person3/`; linking it does not automatically pass any content criterion. Record final-version review and retests with their actual date and version.

The later health evidence shows HTTP 200 with `model_configured=false`: server availability, not successful live generation. Earlier access-error descriptions are historical and followed by this later pre-check.
