const express = require("express");
const cors = require("cors");
const db = require("./db");

const app = express();

app.use(cors());
app.use(express.json());



app.use(express.static("public"));

app.get("/api/transactions", (req, res) => {
    const sql = `
        SELECT
            t.transaction_id,
            t.amount,
            t.type,
            t.transaction_date,
            t.note,
            c.category_name
        FROM transactions t
        JOIN categories c
            ON t.category_id = c.category_id
        ORDER BY t.transaction_id DESC;
    `;

    db.query(sql, (err, results) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ error: "Database error" });
        }

        res.json(results);
    });
});

app.get("/api/categories", (req, res) => {
    const sql = "SELECT * FROM categories ORDER BY category_name";

    db.query(sql, (err, results) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ error: "Database error" });
        }

        res.json(results);
    });
});

app.post("/api/transactions", (req, res) => {
    const { amount, type, category_id, note } = req.body;

    const sql = `
        INSERT INTO transactions
        (amount, type, category_id, transaction_date, note)
        VALUES (?, ?, ?, CURDATE(), ?)
    `;

    db.query(sql, [amount, type, category_id, note], (err, result) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ error: "Database error" });
        }

        res.status(201).json({
            message: "Transaction added",
            transaction_id: result.insertId
        });
    });
});

app.get("/api/summary", (req, res) => {
    const sql = `
        SELECT
            SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END) AS total_income,
            SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END) AS total_expense,
            SUM(CASE WHEN type = 'income' THEN amount ELSE -amount END) AS balance
        FROM transactions;
    `;

    db.query(sql, (err, results) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ error: "Database error" });
        }

        res.json(results[0]);
    });
});

app.delete("/api/transactions/:id", (req, res) => {
    const transactionId = req.params.id;

    const sql = "DELETE FROM transactions WHERE transaction_id = ?";

    db.query(sql, [transactionId], (err, result) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ error: "Database error" });
        }

        res.json({ message: "Transaction deleted" });
    });
});

app.put("/api/transactions/:id", (req, res) => {
    const transactionId = req.params.id;
    const { amount, type, category_id, note } = req.body;

    const sql = `
        UPDATE transactions
        SET amount = ?, type = ?, category_id = ?, note = ?
        WHERE transaction_id = ?
    `;

    db.query(
        sql,
        [amount, type, category_id, note, transactionId],
        (err, result) => {
            if (err) {
                console.log(err);
                return res.status(500).json({ error: "Database error" });
            }

            res.json({ message: "Transaction updated" });
        }
    );
});

app.listen(3000, () => {
    console.log("Pennywise server is running at http://localhost:3000");
});