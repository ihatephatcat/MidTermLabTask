# Lab Task 03 verification

Verified on 23 October 2026 (Asia/Dhaka).

## Environment and scope

- Project: `LabTask3/university-system-api` (UniversitySystemAPI).
- Node.js 24.19.0; npm 12.0.2.
- NestJS core 11.2.7; Nest CLI 11.0.24; TypeScript 5.9.3.
- Existing baseline: `f259d04c7ded82ebec02870faf44676ad86d290e`.
- Git branch: `main`.
- Confirmed remote: `https://github.com/ihatephatcat/MidTermLabTask.git`.
- The lab PDF was read visually across all eight pages. The supplied faculty
  archive's university management example was inspected for DI conventions.

## Requirement checklist

| Requirement | Verified evidence |
| --- | --- |
| Fresh standalone project | Nest CLI scaffold with its own package.json, lockfile, source, tests, and configuration. No files copied from earlier labs and no nested Git repository created. |
| Required CLI generation | CLI generated all three modules, controllers, and services. Commands are recorded in README.md. |
| AppModule registration | Imports CourseModule, EnrollmentModule, and NotificationModule. |
| Module -> Controller -> Service | Each route delegates to its constructor-injected service; business logic is in services. |
| Injectable providers | All three services use `@Injectable()`; each module provides only its own service. |
| Constructor injection | No manual service construction in application code. |
| Course methods and routes | Required response messages and shapes verified for GET /course, GET /course/101, and POST /course. |
| Param/body decorators | Course lookup uses `@Param('id')`; all POST handlers use `@Body()`. |
| Course export/import | CourseModule exports CourseService; EnrollmentModule imports CourseModule. |
| Enrollment methods and routes | GET /enrollment returns the required empty list. POST /enrollment calls CourseService and returns its response. |
| Enrollment -> Notification | Enrollment calls sendNotification after the course lookup and includes the returned confirmation. |
| Notification -> Enrollment | checkEnrollmentAndNotify calls getEnrollments and includes its result and a notification confirmation. |
| Circular module imports | EnrollmentModule and NotificationModule both import the other with forwardRef(). |
| Circular service injection | Both constructor parameters use `@Inject(forwardRef(() => OtherService))`. |
| Export ownership | EnrollmentModule exports EnrollmentService; NotificationModule exports NotificationService. |
| Startup | Compiled application logged successful module initialization, seven mapped routes, and successful startup with no circular DI errors. |
| Shared providers | HTTP test retrieves each service strictly from its owning module and spies on those instances to prove calls cross the module boundaries in both directions. |
| No persistence or unrelated features | Course/enrollment lists remain empty after create/enroll requests. No database, authentication, extra API routes, or external notification transport added. |
| Build and tests | Build, TypeScript check, 15 unit/controller tests, nine HTTP/DI tests, and lint passed. |
| Postman request coverage | Importable collection executed with Newman 6.2.3: seven requests and 14 assertions, zero failures. |
| Documentation | Project README includes setup, structure, DI explanations, forwardRef(), all request/response examples, testing, and collection instructions. Root README adds Lab Task 03 and preserves prior lab documentation. |
| Prior labs and history | `git diff --quiet f259d04 -- LabTask1 LabTask2` passed; baseline remains an ancestor of HEAD. |
| Repository cleanliness | Changes are limited to LabTask3 and root README. Existing ignore rules exclude dependencies, build outputs, coverage, and environment files. No credentials or temporary reports are tracked. |

The PDF's page 6 bullet naming NotificationService as an EnrollmentModule export
conflicts with the example immediately below it. The example and the requested
architecture were followed: EnrollmentModule exports its own EnrollmentService.

## Commands actually executed

All npm commands ran in the new project directory.

| Command | Result |
| --- | --- |
| `npm install` | Succeeded; 678 packages added; audit reported zero vulnerabilities. |
| `npm run build` | Passed. |
| `npm run test -- --runInBand` | Six suites, 15 tests passed. |
| `npm run test:e2e -- --runInBand` | One suite, nine tests passed. |
| `npm run lint` | Passed without errors or warnings. |
| `npx tsc --noEmit --incremental false` | Passed, including test source files. |
| `node dist/main.js` with PORT=3103 | Started successfully; stopped after the collection run. |
| `npx --yes newman run postman/UniversitySystemAPI.postman_collection.json --env-var baseUrl=http://127.0.0.1:3103` | Seven requests and 14 assertions passed; zero failures. |
| `git diff --check f259d04` | Passed. |
| `git diff --quiet f259d04 -- LabTask1 LabTask2` | Passed; no changes to either earlier lab. |

The Newman execution also exported a temporary JSON report outside the repository
for inspection. The collection verifies each full response body and HTTP status.
Postman's desktop UI was not used; the actual execution was through Newman.

## Results for all seven HTTP endpoints

Each endpoint passed both Supertest and Newman response assertions. The README
contains the complete JSON request/response examples used by the collection.

| Endpoint | HTTP | Verified response |
| --- | --- | --- |
| GET /course | 200 | `{"message":"All courses fetched","data":[]}` |
| GET /course/101 | 200 | `{"message":"Course fetched","id":"101"}` |
| POST /course | 201 | Course created, with name NestJS and code CS301. |
| GET /enrollment | 200 | `{"message":"All enrollments fetched","data":[]}` |
| POST /enrollment | 201 | Student John Doe; CourseService response for ID 101; NotificationService confirmation. |
| POST /notification/send | 201 | Confirmation for John Doe with content Welcome! |
| POST /notification/check | 201 | Student John Doe, course ID 101, getEnrollments response, and check notification confirmation. |

## Circular dependency verification

The tests import the real modules and initialize AppModule. EnrollmentService
receives CourseService and NotificationService from Nest. A POST enrollment
request invokes the actual exported CourseService and NotificationService
instances. A POST notification check invokes the actual exported
EnrollmentService instance. Unit tests also replace dependency return values
with distinct responses and verify that those exact responses propagate.

Both sides of the service cycle are therefore exercised, along with both
forwardRef module imports. Successful compiled startup provides a separate
check of the production module graph.

## Development commits

| Commit | Message |
| --- | --- |
| aad4c3d | Initialize standalone University System NestJS project |
| 52f7c7b | Implement CourseModule and intra-module dependency injection |
| cfd40d8 | Implement EnrollmentModule and inter-module dependency injection |
| 8c8b292 | Implement notifications and resolve circular dependency with forwardRef |
| c33b615 | Verify required routes and DI with Jest, Supertest, and Postman collection |

The final documentation commit follows these implementation and test commits.
Existing history was preserved. The authorized push destination is origin/main;
the final completion response reports the actual push result.

## Limitations

This is the assignment's stateless demonstration. It does not persist courses
or enrollments, validate course existence against storage, or deliver external
notifications. Missing/invalid body validation is outside this lab's scope;
the documented valid request bodies were tested. No implementation blockers
remain.
