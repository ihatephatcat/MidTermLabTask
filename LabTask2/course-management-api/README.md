# Lab Task 01: Course Management REST API

A simple Course Management REST API developed using NestJS and TypeScript for the Advanced Programming with Web Technology course.

## Objective

Implement REST API endpoints for course management following the NestJS Module, Controller, and Service architecture.

## Technologies Used

- Node.js
- NestJS
- TypeScript
- npm

## Project Structure

```text
course-management-api/
├── src/
│   ├── course/
│   │   ├── course.module.ts
│   │   ├── course.controller.ts
│   │   └── course.service.ts
│   ├── app.module.ts
│   ├── app.controller.ts
│   ├── app.service.ts
│   └── main.ts
├── package.json
└── README.md
```

## API Endpoints

| Method | Route       | Description               |
| ------ | ----------- | ------------------------- |
| GET    | /course     | Get all courses           |
| GET    | /course/:id | Get course by ID          |
| POST   | /course     | Create a course           |
| PUT    | /course/:id | Update a course           |
| PATCH  | /course/:id | Partially update a course |
| DELETE | /course/:id | Delete a course           |

## Expected Responses

| Method | Route     | Response                             |
| ------ | --------- | ------------------------------------ |
| GET    | /course   | Get All Courses - from Service       |
| GET    | /course/5 | Get Course with ID: 5 - from Service |
| POST   | /course   | Create Course - from Service         |
| PUT    | /course/5 | Update Course 5 - from Service       |
| PATCH  | /course/5 | Patch Course 5 - from Service        |
| DELETE | /course/5 | Delete Course 5 - from Service       |

## Installation and Execution

### 1. Install Dependencies

```bash
npm install
```

### 2. Run the Application

```bash
npm run start:dev
```

The server runs at:

http://localhost:3000

### 3. Test the API

Use a browser for GET requests or an API testing tool for all six HTTP methods.

## Testing

Run unit tests:

```bash
npm run test -- --runInBand
```

Build the project:

```bash
npm run build
```

All six API endpoints have been tested successfully.

## Architecture

The application follows the NestJS architecture:

**Module → Controller → Service**

- **Module:** Organizes the Controller and Service.
- **Controller:** Handles incoming HTTP requests.
- **Service:** Contains the methods that generate responses.

Each endpoint returns a simple string response from the Service layer, as required by the lab task.

No database or persistent course storage is implemented.
