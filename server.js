const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const db = new sqlite3.Database('./database.db');

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

db.serialize(() => {
    db.run("CREATE TABLE IF NOT EXISTS employees (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, age INTEGER, position TEXT)");
});

app.get('/employees', (req, res) => {
    db.all("SELECT * FROM employees", (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(rows);
    });
});

app.post('/employees', (req, res) => {
    const { name, age, position } = req.body;
    const stmt = db.prepare("INSERT INTO employees (name, age, position) VALUES (?, ?, ?)");
    stmt.run(name, age, position, function(err) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ id: this.lastID });
    });
    stmt.finalize();
});

app.delete('/employees/:id', (req, res) => {
    const { id } = req.params;
    const stmt = db.prepare("DELETE FROM employees WHERE id = ?");
    stmt.run(id, function(err) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ deletedID: id });
    });
    stmt.finalize();
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

