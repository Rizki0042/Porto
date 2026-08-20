const mysql = require("mysql2");

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "website"
});

db.connect((err) => {
    if (err) {
        console.log("Database Gagal Terhubung:", err);
        return;
    }

    console.log("Database Berhasil Terhubung!");
});

module.exports = db;