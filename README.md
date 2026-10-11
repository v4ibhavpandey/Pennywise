# Pennywise — Personal Expense Tracker

A personal expense tracker I built for my own use with **Node.js**, **Express.js**, **Vanilla JavaScript**, and a **MySQL** database on Aiven.

> **Not deployed.** This project runs locally on my computer. There is no hosted version, so there is no live link. See [Running locally](#running-locally).

---

## What it does

Pennywise lets me note down income and expenses with a category for each, stored in a MySQL database hosted on Aiven.

### Features

- Add, edit, and delete transactions (income or expense)
- Category-based classification (Food, Travel, Bills, Salary, etc.)
- Real-time balance, total income, and total expense summary
- A SQL `JOIN` to show category names, and `SUM` with `CASE` to total income, expenses, and balance
- Responsive frontend served as static files via Express

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Runtime | Node.js |
| Framework | Express.js |
| Frontend | Vanilla JavaScript, HTML, CSS |
| Database | MySQL (hosted on Aiven Cloud) |
| Database driver | `mysql2` |
| Deployment | None (runs locally) |

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/transactions` | Fetch all transactions with category name (JOIN) |
| GET | `/api/categories` | Fetch all categories |
| GET | `/api/summary` | Get total income, expense, and balance (`SUM` with `CASE`) |
| POST | `/api/transactions` | Add a new transaction |
| PUT | `/api/transactions/:id` | Update an existing transaction |
| DELETE | `/api/transactions/:id` | Delete a transaction |

All queries use **parameterised statements** (`?` placeholders via `mysql2`) — no raw string concatenation.

---

## Database Schema

```sql
-- categories table
CREATE TABLE categories (
  category_id   INT PRIMARY KEY AUTO_INCREMENT,
  category_name VARCHAR(50) NOT NULL
);

-- transactions table
CREATE TABLE transactions (
  transaction_id   INT PRIMARY KEY AUTO_INCREMENT,
  amount           DECIMAL(10,2) NOT NULL,
  type             ENUM('income', 'expense') NOT NULL,
  category_id      INT,
  transaction_date DATE,
  note             VARCHAR(255),
  FOREIGN KEY (category_id) REFERENCES categories(category_id)
);
```

---

## Running locally

```bash
# 1. Install dependencies
npm install

# 2. Create a .env file with your MySQL credentials
DB_HOST=your-aiven-host
DB_PORT=3306
DB_USER=your-username
DB_PASSWORD=your-password
DB_NAME=pennywise

# 3. Start the server
npm start
# Runs at http://localhost:3000 (set PORT to change it)
```

---

## What I learned

- Connecting an Express server to a cloud MySQL database
- Designing two related tables with a foreign key
- Writing `JOIN` and `SUM` queries
- Using parameterised queries instead of building SQL strings

---

## Limitations & next steps

- [ ] Validate input on the server (amount, type, category)
- [ ] Verify the database's SSL certificate instead of `rejectUnauthorized: false`
- [ ] Deploy it
- [ ] Add user authentication (sessions or JWT)
- [ ] Monthly/yearly spending charts (Chart.js)
- [ ] Export transactions to CSV
- [ ] Migrate frontend to React for better state management
- [ ] Add pagination for large transaction histories

---

*Built as a practice project to learn how a Node.js server, a database, and a browser front end fit together.*
