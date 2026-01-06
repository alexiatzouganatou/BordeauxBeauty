require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');

const app = express();
app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME
});

db.connect(err => {
  if (err) {
    console.error('DB error:', err);
    return;
  }
  console.log('✅ MySQL connected');
});

app.post('/book', (req, res) => {
  const { name, phone, service, date, time, message } = req.body;

  if (!name || !phone || !service || !date || !time) {
    return res.json({ ok: false, error: 'Λείπουν πεδία' });
  }

  const checkSql = `
    SELECT id FROM ${process.env.DB_TABLE}
    WHERE date=? AND time=?
  `;

  db.query(checkSql, [date, time], (err, rows) => {
    if (rows.length > 0) {
      return res.json({
        ok: false,
        error: 'Η ώρα δεν είναι διαθέσιμη'
      });
    }

    const insertSql = `
      INSERT INTO ${process.env.DB_TABLE}
      (name, phone, service, date, time, message)
      VALUES (?, ?, ?, ?, ?, ?)
    `;

    db.query(
      insertSql,
      [name, phone, service, date, time, message || null],
      err => {
        if (err) {
          return res.json({ ok: false, error: 'DB error' });
        }

        res.json({ ok: true });
      }
    );
  });
});

app.listen(process.env.PORT, () => {
  console.log(`🚀 Server running on http://localhost:${process.env.PORT}`);
});
