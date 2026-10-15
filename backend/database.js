const { Pool } = require("pg");

// const db = new Pool({
//     host: "localhost",
//     port: 5432,
//     user: "postgres",
//     password: process.env.DB_PASSWORD,
//     database: "portofolio"
// });
// DB ONLINE VIA NEON
const db = new Pool({
    connectionString: process.env.DATABASE_URL,
});

db.on("error", (err) => {
    console.error("Unexpected database error:", err.message);
});

db.query("SELECT 1")
    .then(() => {
        // console.log("Database PostgreSQL berhasil terhubung!");
        console.log("Database Neon berhasil terhubung!");
    })
    .catch((err) => {
        // console.error("Database gagal terhubung:", err.message);
        console.log("Database Neon Gagal terhubung!:", err.message);
    });

module.exports = db;
