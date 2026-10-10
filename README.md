# Pennywise — Personal Finance Tracker

A full-stack personal finance tracker built with **Node.js**, **Express.js**, **Vanilla JavaScript**, and **Aiven Cloud MySQL**.

🔗 **Live Demo:** [pennywise-steel-six.vercel.app](https://pennywise-steel-six.vercel.app/)

---

## What it does

Pennywise lets you track income and expenses with category-based breakdowns, persisted in a relational MySQL database hosted on Aiven Cloud.

### Features

- Add, edit, and delete transactions (income or expense)
- Category-based classification (Food, Travel, Bills, Salary, etc.)
- Real-time balance, total income, and total expense summary
- SQL `JOIN`, `SUM`, and `GROUP BY` aggregations for financial reporting
- Responsive frontend served as static files via Express

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Runtime | Node.js |
| Framework | Express.js |
| Frontend | Vanilla JavaScript, HTML, CSS |
| Database | MySQL (hosted on Aiven Cloud) |
| ORM/Driver | `mysql2` |
| Deployment | Vercel (frontend) |

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/transactions` | Fetch all transactions with category name (JOIN) |
| GET | `/api/categories` | Fetch all categories |
| GET | `/api/summary` | Get total income, expense, and balance (SUM aggregation) |
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
node server.js
# Runs at http://localhost:3000
```

---

## What I learned

- Full-stack architecture with a decoupled frontend/backend
- Relational schema design with foreign keys
- SQL aggregation queries (`SUM`, `GROUP BY`, `JOIN`)
- Parameterised queries for SQL injection prevention
- Deploying a Node.js + MySQL app on cloud infrastructure (Aiven)

---

## Limitations & next steps

- [ ] Add user authentication (sessions or JWT)
- [ ] Monthly/yearly spending charts (Chart.js)
- [ ] Export transactions to CSV
- [ ] Migrate frontend to React for better state management
- [ ] Add pagination for large transaction histories

---

*Built as a practical project to apply full-stack and relational database skills.*
