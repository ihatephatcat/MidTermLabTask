# Lab Task 02: Course Management REST API

Extends Lab Task 01 with validated request DTOs, structured JSON responses, and
course material uploads. Uses NestJS 11, TypeScript, Express, class-validator,
class-transformer, mapped-types, Multer, Jest, and Supertest.

## Structure

```text
src/
  course/
    dto/
      create-course.dto.ts
      update-course.dto.ts
    course.controller.ts
    course.service.ts
    course.module.ts
    course-upload.options.ts
    upload-size.filter.ts
  uploads/                     # Created at runtime; ignored by Git
  app.module.ts
  main.ts
test/                          # HTTP integration tests
postman/                       # Importable request collection
```

The module wires the controller and service. Controllers extract request data
and delegate to services; DTOs and the global ValidationPipe validate input.
Upload options configure disk storage and file restrictions. A small route-scoped
exception filter converts Nest's oversized-file error from 413 to the required 400.
The generated root Hello World endpoint is preserved.

## Install and run

Use Node.js 20 or newer and run commands **inside this project**, rather than at
the repository root:

```powershell
cd LabTask2/course-management-api
npm ci
npm run start:dev
```

Default URL: `http://localhost:3000`. The existing `PORT` environment override is
preserved. To run the compiled application from this project directory:

```powershell
npm run build
npm run start:prod
```

## Endpoints

| Method | Route                | Success | Response fields                           |
| ------ | -------------------- | ------- | ----------------------------------------- |
| GET    | `/course`            | 200     | `message`, `data: []`                     |
| GET    | `/course/:id`        | 200     | `message`, `id`                           |
| POST   | `/course`            | 201     | `message`, validated `data`               |
| PUT    | `/course/:id`        | 200     | `message`, `id`, validated `data`         |
| PATCH  | `/course/:id`        | 200     | `message`, `id`, `updatedFields`          |
| DELETE | `/course/:id`        | 200     | `message`, `id`                           |
| POST   | `/course/:id/upload` | 201     | `message`, `courseId`, `filename`, `path` |

## DTO validation

Global validation enables `whitelist`, `forbidNonWhitelisted`, and `transform`.
Unknown JSON fields produce HTTP 400.

| Field         | Required on create | Validation                                         |
| ------------- | ------------------ | -------------------------------------------------- |
| `name`        | Yes                | String, trimmed, nonempty                          |
| `code`        | Yes                | String, trimmed, nonempty; no invented code format |
| `instructor`  | Yes                | String, trimmed, nonempty                          |
| `credits`     | Yes                | Number from 1 through 6, inclusive                 |
| `description` | No                 | Optional string                                    |

`@Type(() => Number)` converts numeric strings such as `"3"` to `3`. Credits use
`@IsNumber()`, so fractional values in range are accepted. This uses JavaScript
numeric conversion, rather than strict JSON-number-only input.

`UpdateCourseDto` extends `PartialType(CreateCourseDto)`. Both PUT and PATCH accept
partial bodies, including `{}`, as specified by the assignment. The
`skipNullProperties: false` option validates explicitly supplied null values for
required create fields. The description retains `@IsOptional()` behavior, which
also skips validation for null. PATCH reports only supplied, defined fields.

Example create request:

```json
{
  "name": "NestJS Fundamentals",
  "code": "CS101",
  "instructor": "John Doe",
  "credits": 3,
  "description": "Introduction to NestJS"
}
```

Example validation response for an empty name with otherwise valid fields:

```json
{
  "message": ["name should not be empty"],
  "error": "Bad Request",
  "statusCode": 400
}
```

## Upload course materials

Send `multipart/form-data` with one file under the field name **file**:

```powershell
curl.exe -X POST http://localhost:3000/course/5/upload -F "file=@C:/path/to/notes.pdf"
```

- Allowed extensions: `.jpg`, `.jpeg`, `.png`, `.pdf` (case-insensitive).
- Maximum size: 2 MB = 2,097,152 bytes, inclusive.
- UUID filenames preserve the normalized extension and avoid client paths.
- Files are stored in this project's `src/uploads/` during development and when
  running the compiled build. The directory is created when a valid upload arrives.
- `path` is a project-relative stored-file path, for example
  `src/uploads/550e8400-e29b-41d4-a716-446655440000.pdf`. This includes the `src/`
  prefix so it directly identifies the actual location shown in the assignment.
- Unsupported extensions, oversized files, missing files, and unexpected file
  fields return HTTP 400 with descriptive messages. Multer removes partial output
  from rejected oversized uploads.

## Tests and Postman

```powershell
npm run build
npm run test -- --runInBand
npm run test:e2e -- --runInBand
npx eslint src/main.ts src/course test/course.e2e-spec.ts
```

Unit tests cover service responses and controller delegation. HTTP tests exercise
all seven routes, DTO transformation, validation failures, upload bytes and paths,
unique names, size boundaries, and rejected-upload cleanup. They use temporary
localhost ports and delete only files created by their own run.

Import `postman/Course-Management-Lab02.postman_collection.json` into Postman.
It contains 24 requests with status and JSON-message assertions. `baseUrl` defaults
to `http://localhost:3000`; `courseId` defaults to `5`. For multipart requests, set
the `pdfFile`, `jpgFile`, `txtFile`, `exeFile`, and `oversizedFile` collection
variables to local absolute paths, or select files in the form-data editor. The
oversized fixture must exceed 2,097,152 bytes. Allow those local paths in Postman's
file settings if required. Run the server before sending requests.

The collection is supplied for manual review; verification was performed using
Jest/Supertest and actual HTTP requests against the compiled server. A Postman UI
run is not claimed. See `VERIFICATION.md` for the recorded results.

## Limitations and dependency warnings

There is no database or persistent course CRUD state. Course methods return the
assignment's response objects; GET continues to return an empty course list.
Course IDs remain strings and do not require a stored course to exist. Uploaded
files persist on disk, but this lab does not serve or download them.

Upload validation checks filename extensions and size. It does not inspect file
signatures, authenticate users, or scan file contents. This is a local lab exercise.

At verification, `npm audit` reported 20 moderate findings in the development/test
dependency chain, originating in `sprintf-js` through Jest-related packages.
`npm audit --omit=dev` reported zero vulnerabilities. Forced dependency changes
were avoided to preserve the existing NestJS/Jest setup. npm also blocked optional
install scripts for `@parcel/watcher` and `unrs-resolver`; build and tests passed
without enabling them.
