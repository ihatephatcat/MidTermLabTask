# UniversitySystemAPI - Lab Task 03

A standalone NestJS application for AWT Lab Task 03: Dependency Injection.
It demonstrates intra-module, inter-module, and circular dependencies through
CourseModule, EnrollmentModule, and NotificationModule.

The implementation follows the lab PDF and the faculty's university management
lecture example: thin controllers, injectable services, constructor injection,
and explicit module imports/exports. There is no database or persistent storage.
Course and enrollment lists always return `data: []`. Notifications are returned
confirmation objects; no email or external message is sent.

## Setup and execution

Use Node.js 24 and npm. Verified with Node.js 24.19.0 and npm 12.0.2.

From the repository root:

```powershell
cd LabTask3/university-system-api
npm ci
npm run start:dev
```

The default URL is `http://localhost:3000`. To run the compiled application:

```powershell
npm run build
npm run start:prod
```

An optional `PORT` environment variable changes the port. In PowerShell:

```powershell
$env:PORT = '3103'
npm run start:prod
```

Run all npm commands inside this project. Its package.json, lockfile, Nest
configuration, and dependencies are independent of LabTask1 and LabTask2.

## Project structure

```text
university-system-api/
|-- src/
|   |-- course/
|   |   |-- course.module.ts
|   |   |-- course.controller.ts
|   |   |-- course.service.ts
|   |   |-- course.controller.spec.ts
|   |   `-- course.service.spec.ts
|   |-- enrollment/             # Same module/controller/service/test layout
|   |-- notification/           # Same module/controller/service/test layout
|   |-- app.module.ts
|   `-- main.ts
|-- test/
|   |-- app.e2e-spec.ts
|   `-- jest-e2e.json
|-- postman/
|   `-- UniversitySystemAPI.postman_collection.json
|-- package.json
|-- package-lock.json
|-- nest-cli.json
|-- tsconfig.json
|-- tsconfig.build.json
`-- VERIFICATION.md
```

The NestJS CLI created the fresh project and all three modules, controllers,
and services. The initialization command was:

```text
nest new UniversitySystemAPI --directory LabTask3/university-system-api --package-manager npm --skip-git --skip-install
```

Inside the generated project, the CLI commands were:

```text
nest generate module course
nest generate controller course
nest generate service course
nest generate module enrollment
nest generate controller enrollment
nest generate service enrollment
nest generate module notification
nest generate controller notification
nest generate service notification
```

## Dependency injection

| Part | Dependency | Configuration and behavior |
| --- | --- | --- |
| A: intra-module | CourseController -> CourseService | CourseModule provides CourseService. The controller receives it through its constructor and delegates list, lookup, and create operations. |
| B: inter-module | EnrollmentService -> CourseService | CourseModule exports CourseService. EnrollmentModule imports CourseModule. Enrollment calls `getCourseById(courseId)` and includes its response. |
| C: circular | EnrollmentService <-> NotificationService | Both modules import each other through `forwardRef()` and export their own services. Both constructors use `@Inject(forwardRef(() => OtherService))`. |

AppModule imports all three modules. Every service has `@Injectable()` and is
registered only in its own module's providers array. Application code never
constructs a service with `new`.

EnrollmentService looks up the course, then calls NotificationService to produce
an enrollment confirmation. NotificationService calls
`enrollmentService.getEnrollments()` during a check and includes that result
with a check confirmation. The check reports the empty list required by the lab;
it does not claim that a stored enrollment was found.

### Why forwardRef() is needed

The enrollment and notification modules and services refer to each other.
`forwardRef(() => OtherClass)` defers the class reference until Nest can resolve
both sides of the cycle. It is used in both module imports and both service
injections. Services call each other from methods after initialization; their
constructors only receive dependencies.

The PDF's page 6 bullet about EnrollmentModule exports conflicts with the code
directly below it. This implementation follows that code: EnrollmentModule
exports EnrollmentService, while NotificationModule exports NotificationService.

## HTTP endpoints

All request and response bodies below are JSON. POST requests use
`Content-Type: application/json`. Nest's default response status is 200 for GET
and 201 for POST.

| Method | Route | Request body | Status |
| --- | --- | --- | --- |
| GET | `/course` | None | 200 |
| GET | `/course/101` | None; `101` is supplied through `@Param('id')` | 200 |
| POST | `/course` | `{"name":"NestJS","code":"CS301"}` | 201 |
| GET | `/enrollment` | None | 200 |
| POST | `/enrollment` | `{"studentName":"John Doe","courseId":"101"}` | 201 |
| POST | `/notification/send` | `{"studentName":"John Doe","message":"Welcome!"}` | 201 |
| POST | `/notification/check` | `{"studentName":"John Doe","courseId":"101"}` | 201 |

All POST controllers use `@Body()` and delegate to the corresponding service.
Any string course ID is echoed by the demonstration lookup.

### GET /course

```json
{"message":"All courses fetched","data":[]}
```

### GET /course/101

```json
{"message":"Course fetched","id":"101"}
```

### POST /course

For the request in the table:

```json
{"message":"Course created","data":{"name":"NestJS","code":"CS301"}}
```

### GET /enrollment

```json
{"message":"All enrollments fetched","data":[]}
```

### POST /enrollment

```json
{
  "message": "Student enrolled successfully",
  "student": "John Doe",
  "course": {"message": "Course fetched", "id": "101"},
  "notification": {
    "message": "Notification sent successfully",
    "student": "John Doe",
    "content": "You have been enrolled in course 101."
  }
}
```

### POST /notification/send

```json
{
  "message": "Notification sent successfully",
  "student": "John Doe",
  "content": "Welcome!"
}
```

### POST /notification/check

```json
{
  "message": "Enrollment check completed",
  "student": "John Doe",
  "courseId": "101",
  "enrollments": {"message": "All enrollments fetched", "data": []},
  "notification": {
    "message": "Notification sent successfully",
    "student": "John Doe",
    "content": "Enrollment check completed for course 101."
  }
}
```

## Tests

```powershell
npm run build
npm run test -- --runInBand
npm run test:e2e -- --runInBand
npm run lint
```

The 15 unit/controller tests verify service responses, controller delegation,
injected response propagation, notification ordering, and the empty enrollment
list. The nine Supertest tests boot the real AppModule on an ephemeral HTTP
port, verify all seven routes, check shared providers across module boundaries
in both directions, and confirm that create/enroll calls do not persist data.

### Postman collection

Import [the collection](postman/UniversitySystemAPI.postman_collection.json)
into Postman. Set its `baseUrl` variable (default `http://localhost:3000`), start
the API, and run all seven requests. Each request has a status assertion and a
complete response-body assertion.

The collection can also run with Newman, the Postman collection runner:

```powershell
npx --yes newman run postman/UniversitySystemAPI.postman_collection.json
```

For a custom port:

```powershell
npx --yes newman run postman/UniversitySystemAPI.postman_collection.json --env-var baseUrl=http://127.0.0.1:3103
```

Newman is optional and is not a project dependency. The collection was actually
executed with Newman 6.2.3 against the compiled API: seven requests and 14
assertions passed. The Postman desktop UI was not used.

See [VERIFICATION.md](VERIFICATION.md) for the requirement checklist and results.
