# Lab Task 04 — Product Inventory API

**Course:** Advanced Programming with Web Technology (AWT)

## Overview

A RESTful Product Inventory API developed using NestJS, TypeORM, and PostgreSQL.

The application demonstrates CRUD operations on a single Products entity, DTO validation, database repositories, category filtering, product searching, and active/inactive status management.

## Technologies

- NestJS
- TypeScript
- PostgreSQL
- TypeORM
- class-validator and class-transformer
- Jest
- Postman

## Project Structure

```text
src/
├── products/
│   ├── dto/
│   │   ├── create-product.dto.ts
│   │   ├── update-product.dto.ts
│   │   └── partial-update-product.dto.ts
│   ├── entities/
│   │   └── products.entity.ts
│   ├── products.controller.ts
│   ├── products.service.ts
│   └── products.module.ts
├── app.module.ts
└── main.ts
```

## Database

Database name: `product_inventory_db`

The Products entity contains nine columns:

| Column      | Description                 |
| ----------- | --------------------------- |
| id          | Auto-generated primary key  |
| name        | Product name                |
| description | Optional description        |
| price       | Decimal price               |
| stock       | Available quantity          |
| category    | Product category            |
| isActive    | Active/inactive status      |
| createdAt   | Creation timestamp          |
| updatedAt   | Last modification timestamp |

All database operations use TypeORM repositories.

No entity relationships are implemented.

## API Endpoints

| Method | Endpoint                         | Description                 |
| ------ | -------------------------------- | --------------------------- |
| POST   | `/products`                      | Create a product            |
| GET    | `/products`                      | Get all products            |
| GET    | `/products/:id`                  | Get product by ID           |
| PATCH  | `/products/:id`                  | Partially update product    |
| PUT    | `/products/:id`                  | Replace product information |
| DELETE | `/products/:id`                  | Delete product              |
| GET    | `/products/category/:cat`        | Filter products by category |
| GET    | `/products/search?keyword=phone` | Search products by name     |
| PATCH  | `/products/:id/toggle`           | Toggle product status       |

## Example Request

**POST `/products`**

```json
{
  "name": "iPhone 15",
  "price": 999.99,
  "stock": 50,
  "category": "Electronics"
}
```

The API returns a structured JSON response containing the saved product, generated ID, and timestamps.

## DTO Validation

Global ValidationPipe is configured with:

- `whitelist: true`
- `forbidNonWhitelisted: true`
- `transform: true`

Validation includes required fields, data types, positive prices, non-negative stock quantities, and rejection of unknown properties.

`UpdateProductDto` inherits CreateProductDto for PUT operations.

`PartialUpdateProductDto` uses `PartialType()` for PATCH operations.

## Installation

Install dependencies:

```bash
npm install
```

Create the PostgreSQL database:

```sql
CREATE DATABASE product_inventory_db;
```

Create a `.env` file in the project root:

```dotenv
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=your_password
DB_NAME=product_inventory_db
```

Replace `your_password` with your local PostgreSQL password.

The `.env` file is excluded from Git.

## Running the Application

```bash
npm run start:dev
```

The default port is 3000.

To use port 3001 in PowerShell:

```powershell
$env:PORT = "3001"
npm run start:dev
```

## Testing

Run the unit tests:

```powershell
$env:NODE_OPTIONS = "--experimental-vm-modules"
npm run test -- --runInBand
```

Verify the build:

```bash
npm run build
```

Run ESLint:

```bash
npm run lint
```

### Verification Results

- 23 unit tests passed.
- 3 test suites passed.
- TypeScript compilation successful.
- ESLint passed without errors.
- All nine API endpoints tested manually using Postman.
- PostgreSQL CRUD operations verified.
- DTO validation and 404 error handling verified.

## Notes

- This assignment uses a single database entity.
- No authentication or entity relationships are required.
- `synchronize: true` is used for local development only.
- All database operations are handled by ProductsService.

## Repository

[MidTermLabTask](https://github.com/ihatephatcat/MidTermLabTask)
