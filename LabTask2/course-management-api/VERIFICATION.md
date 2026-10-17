# Lab Task 02 verification

Verified on 17 October 2026 (Asia/Dhaka) against the supplied six-page
`Lab_Task_02_NestJS.pdf` and the updated faculty lecture ZIP. The PDF determines
requirements; lecture projects supply style examples. Detailed JSON response
requirements take precedence over the PDF's inconsistent final note about strings.

## Requirement checklist

| Requirement                                    | Result       | Evidence                                                                                    |
| ---------------------------------------------- | ------------ | ------------------------------------------------------------------------------------------- |
| Extend the existing Lab Task 02 project        | PASS         | Existing NestJS application and Jest setup retained                                         |
| Preserve Lab Task 01 and existing history      | PASS         | No diff in `LabTask1/` against `0210f92`; existing commits retained                         |
| Dependencies in the correct project            | PASS         | Project manifest/lock updated; `npm ls --depth=0` verifies all required packages            |
| Compatible NestJS versions                     | PASS         | Common/core/platform-express remain 11.2.7; mapped-types 2.1.1                              |
| Global ValidationPipe                          | PASS         | `whitelist`, `forbidNonWhitelisted`, `transform` all true                                   |
| CreateCourseDto fields and required decorators | PASS         | String/nonempty rules, credits number 1-6, optional description, numeric transformation     |
| Reject blank required strings                  | PASS         | Trim transforms plus nonempty rules; HTTP tests for name/code/instructor                    |
| UpdateCourseDto uses PartialType               | PASS         | Inherits create rules; PUT/PATCH accept partial objects                                     |
| Structured service responses                   | PASS         | Full response assertions for course routes and uploads                                      |
| Module -> Controller -> Service organization   | PASS         | Constructor injection retained; controller delegates processing                             |
| All seven routes                               | PASS         | Methods, paths, status codes and JSON verified over HTTP                                    |
| Unknown fields rejected                        | PASS         | POST, PUT and PATCH reject additional properties with 400                                   |
| Invalid and missing fields rejected            | PASS         | Empty/blank strings, range violations, invalid types, missing fields and null update fields |
| Credit transformation                          | PASS         | String `"3"` becomes numeric `3`; boundaries and fractional number checked                  |
| Optional description                           | PASS         | Create response preserves description; PATCH lists it when supplied                         |
| FileInterceptor, Multer, diskStorage           | PASS         | Single `file` field with configured disk storage                                            |
| JPG/JPEG/PNG/PDF allowlist                     | PASS         | All allowed extensions and uppercase PDF tested; TXT/EXE rejected                           |
| Multer 2 MB limit                              | PASS         | Exact 2,097,152-byte file accepted; 2,097,153-byte file rejected                            |
| Invalid uploads return 400                     | PASS         | Unsupported, oversized, missing and unexpected file field requests                          |
| Runtime src/uploads directory                  | PASS         | Created on demand; source and compiled server resolve the same destination                  |
| Safe filenames and accurate response paths     | PASS         | UUID names; unique outputs; returned project-relative paths resolve to exact stored bytes   |
| Rejected-upload cleanup                        | PASS         | Upload directory contents compared before and after failures                                |
| Runtime files/secrets excluded                 | PASS         | Uploads, node_modules, dist and env files excluded; staged file/content checks              |
| Build                                          | PASS         | `npm run build`, exit 0                                                                     |
| Jest unit tests                                | PASS         | 3 suites, 12 tests passed, 0 failed                                                         |
| HTTP integration tests                         | PASS         | 2 suites, 48 tests passed, 0 failed (47 course tests and retained root-route test)          |
| Compiled server on localhost:3000              | PASS         | 23 additional live HTTP checks, 0 failed                                                    |
| Formatting and changed-code lint               | PASS         | Prettier check and ESLint check exited 0                                                    |
| Documentation and Postman collection           | PASS         | Both READMEs updated; importable 24-request collection supplied                             |
| Postman desktop execution                      | NOT VERIFIED | HTTP verification used Jest/Supertest and a compiled-server HTTP client; no UI-run claim    |

## HTTP results

| Scenario                                                | Expected and observed                                    |
| ------------------------------------------------------- | -------------------------------------------------------- |
| GET `/course`, GET `/course/5`                          | 200; exact list/ID response objects                      |
| POST valid course, optional description, string credits | 201; submitted validated data and numeric transformation |
| PUT partial course                                      | 200; submitted fields returned in `data`                 |
| PATCH partial course/description/empty object           | 200; exactly supplied fields in `updatedFields`          |
| DELETE `/course/5`                                      | 200; success message and ID                              |
| Real PDF and JPG to `/course/5/upload`                  | 201; saved bytes match uploaded bytes and returned paths |
| Allowed extension fixtures, duplicate original names    | 201; generated safe, unique filenames                    |
| Empty/blank name, blank code/instructor                 | 400; field-specific validation messages                  |
| Credits 10, 0, nonnumeric string or array               | 400; numeric/range validation messages                   |
| Missing required fields                                 | 400; all four required fields represented in errors      |
| Unknown fields and invalid field types                  | 400; descriptive validation messages                     |
| Invalid supplied PUT/PATCH fields                       | 400; inherited validation and whitelist rules            |
| Null required create fields supplied in updates         | 400; original field validation retained                  |
| TXT/EXE upload                                          | 400; supported extensions listed; no output left behind  |
| Upload over 2 MB                                        | 400; size message; partial disk output removed           |
| Missing upload or wrong multipart file key              | 400; meaningful missing/unexpected-field message         |

Totals: **60 Jest tests passed, 0 failed**, plus **23 live HTTP checks passed,
0 failed** against the compiled server. Build, formatting and changed-code lint
passed. The live server was stopped after testing. Generated upload files were
removed; only test-owned files were deleted.

The 23 live checks include all seven routes, a real supplied PDF and a temporary
valid JPEG, the required invalid scenarios, numeric transformation and optional
description. These also verify the actual bootstrap's global pipe configuration.
The temporary HTTP driver and image fixture were kept outside the repository.

## Cleanup and dependency findings

The root `package.json`, `package-lock.json` and `node_modules/` were untracked,
created together, and matched the exact mistaken dependency list. They were
moved into a recoverable temporary backup named
`codex-awt-root-npm-backup-20261017`; root npm artifacts are no longer present.
Deletion was blocked by automatic approval review, so reversible relocation was
used. No unrelated data was deleted.

The pre-existing untracked `LabTask1.zip` is unchanged. Its exact filename is
excluded locally through `.git/info/exclude` to keep it outside the submission
without adding a shared ignore rule for user archives.

All required runtime and development dependencies resolve inside Lab Task 02.
The full audit reported **20 moderate** findings in the development/test chain,
originating in `sprintf-js` (unbounded precision denial of service). The
production-only audit reported **0 vulnerabilities**. No forced audit fix or
unrelated upgrades were applied. Optional install scripts for `@parcel/watcher`
and `unrs-resolver` were blocked by npm; build and tests passed without them.

Git checks exclude dependency directories, build output, runtime uploads and
credentials from the submission. No database or credentials were introduced.

## New commits and delivery

File inventory (all paths below are relative to the repository root):

| Change   | File                                                                                     | Purpose                                                          |
| -------- | ---------------------------------------------------------------------------------------- | ---------------------------------------------------------------- |
| Modified | `.gitignore`                                                                             | Exclude runtime uploads and coverage across lab directories      |
| Modified | `README.md`                                                                              | Add Lab Task 02 while preserving Lab Task 01 documentation       |
| Modified | `LabTask2/course-management-api/README.md`                                               | Setup, endpoints, validation, upload, tests and limitations      |
| Added    | `LabTask2/course-management-api/VERIFICATION.md`                                         | Requirement checklist and verification evidence                  |
| Modified | `LabTask2/course-management-api/package.json`                                            | Required compatible dependencies                                 |
| Modified | `LabTask2/course-management-api/package-lock.json`                                       | Reproducible dependency resolutions                              |
| Modified | `LabTask2/course-management-api/src/main.ts`                                             | Global input validation                                          |
| Added    | `LabTask2/course-management-api/src/course/dto/create-course.dto.ts`                     | Required and optional course fields with validation              |
| Added    | `LabTask2/course-management-api/src/course/dto/update-course.dto.ts`                     | PartialType update validation                                    |
| Modified | `LabTask2/course-management-api/src/course/course.controller.ts`                         | DTO bodies and seventh upload route                              |
| Modified | `LabTask2/course-management-api/src/course/course.service.ts`                            | Structured responses and missing-file handling                   |
| Modified | `LabTask2/course-management-api/src/course/course.module.ts`                             | Existing module retained; formatting corrected                   |
| Added    | `LabTask2/course-management-api/src/course/course-upload.options.ts`                     | Storage destination, safe names, extension filter and size limit |
| Added    | `LabTask2/course-management-api/src/course/upload-size.filter.ts`                        | Assignment-required 400 for oversized files                      |
| Modified | `LabTask2/course-management-api/src/course/course.controller.spec.ts`                    | Controller delegation checks                                     |
| Modified | `LabTask2/course-management-api/src/course/course.service.spec.ts`                       | Service response and missing-file checks                         |
| Added    | `LabTask2/course-management-api/test/course.e2e-spec.ts`                                 | Course HTTP and disk-upload behavior                             |
| Added    | `LabTask2/course-management-api/postman/Course-Management-Lab02.postman_collection.json` | 24 importable requests and status/message assertions             |

Existing initialization commit `0210f92` was retained. Implementation milestones:

- `eabf6b6` - Add Lab Task 02 validation dependencies and course DTOs
- `2a018dd` - Validate course requests and return structured API responses
- `2b86feb` - Implement validated course material uploads with disk storage
- `a005fa9` - Add course HTTP integration tests and Postman request collection

This report and READMEs are finalized in a separate documentation commit. Final
push confirmation and its exact commit hash are recorded in the delivery message
after checking the remote, rather than claimed before the push occurs.

Target: existing `origin`, `ihatephatcat/MidTermLabTask`, branch `main`. No history
rewriting, force push, new repository or additional NestJS application is used.

## Remaining limits

No required API feature remains unimplemented or untested. A Postman UI session
has not been executed; the importable collection needs local file selections for
upload requests. The requested automated HTTP equivalent has passed.

As required, there is no persistent course storage or database. Upload checking
is by extension and size, without content-signature verification. Returned paths
include `src/` to identify the actual assignment-specified storage location.
Numeric conversion and optional-description null handling follow the DTO
decorators described in the README. Development dependency audit findings remain.
