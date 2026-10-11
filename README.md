# Inventory and Data Management System

A RESTful backend service built using Node.js, Express.js, and MongoDB (Mongoose) designed for inventory catalog tracking, stock adjustments, pagination, and aggregation-based reporting.

---

## Features

- **Schema Validation & Virtual Fields:** Strict Mongoose schemas with dynamic calculations (`stockValue = price * quantity`).
- **CRUD Operations:** Complete endpoints to create, read, update, and delete inventory records.
- **Filtering & Pagination:** Query-string pagination (`page`, `limit`) and category-based filtering.
- **Stock Tracking:** Real-time stock increments and decrements via `PATCH`.
- **Reporting & Aggregation:**
  - Low-stock alert detection (`quantity <= reorderLevel`).
  - Category-level summary report via MongoDB aggregation pipeline.

---

## Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB
- **Object Data Modeling (ODM):** Mongoose
- **Environment Configuration:** dotenv

---

## Project Structure

```text
inventory-assignment/
├── model/
│   └── product.model.js
├── routes/
│   └── product.route.js
├── .env
├── .gitignore
├── db.js
├── package.json
└── server.js
