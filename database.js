
const sqlite3 = require('sqlite3').verbose();


const db = new sqlite3.Database(':memory:');


db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY,
      name TEXT,
      price REAL,
      dateOfSale TEXT,
      category TEXT,
      sold INTEGER
    )
  `);
});

module.exports = db;
