# MidTermLabTask

Midterm lab tasks for Advanced Programming with Web Technology (AWT).

## Lab Tasks

| Lab Task    | Project                    | Technology         |
| ----------- | -------------------------- | ------------------ |
| Lab Task 01 | Course Management REST API | NestJS, TypeScript |
| Lab Task 02 | Course Validation and Material Upload API | NestJS, DTOs, Multer |
| Lab Task 03 | University System API | NestJS, Dependency Injection, forwardRef |

## Repository Structure

```text
MidTermLabTask/
├── LabTask1/
│   └── course-management-api/
├── LabTask2/
│   └── course-management-api/
├── LabTask3/
│   └── university-system-api/
└── README.md
```

Each lab task is organized in a separate folder.

## Lab Task 01

A Course Management REST API developed using NestJS.

The application implements six HTTP endpoints using GET, POST, PUT, PATCH, and DELETE methods.

For implementation details and instructions, see the README inside `LabTask1/course-management-api/`.

## Lab Task 02

Extends the copied Course Management API with DTO validation, global pipes,
structured JSON responses, and course material uploads (JPG/JPEG/PNG/PDF, up to
2 MB). Includes Jest unit tests, Supertest HTTP tests, and an importable Postman
collection. Course CRUD does not use persistent storage.

See [Lab Task 02 instructions](LabTask2/course-management-api/README.md) and
[verification results](LabTask2/course-management-api/VERIFICATION.md).

## Lab Task 03

A fresh, standalone University System API demonstrating intra-module DI
(CourseController and CourseService), inter-module DI (EnrollmentService uses
CourseService), and circular DI (EnrollmentService and NotificationService use
each other through `forwardRef()`). Includes seven HTTP endpoints, Jest and
Supertest tests, and a Postman collection verified with Newman.

See [Lab Task 03 instructions](LabTask3/university-system-api/README.md) and
[verification results](LabTask3/university-system-api/VERIFICATION.md).
