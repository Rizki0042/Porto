const express = require("express");
const cors = require("cors");
const db = require("./database");

const app = express();

app.use(cors());
app.use(express.json());

const PORT = 3000;

app.get("/", (req, res) => {
    res.send("Backend Website berjalan!!");
});

//POST contact
app.post("/contact", (req, res) => {
    const { nama, email, pesan } = req.body;

    const sql = `
    INSERT INTO contact (nama, email, pesan)
    VALUES(?, ?, ?)`;

    db.query(sql, [nama, email, pesan], (err, result) => {
        if (err) {
            console.log(err);
            return res.status(500).json({
                message: "Gagal menyimpan pesan"
            });
        }

        res.status(201).json({
            message: "Pesan berhasil dikirim!",
            data: {
                id : result.insertId,
                nama,
                email,
                pesan
            }
        });
    });
});

app.get("/contact", (req, res) => {
    const sql = "SELECT * FROM contact";

    db.query(sql, (err, results) => {
        if (err) {
            console.log(err);
            return res.status(500).json({
                message: "Gagal mengambil data kontak"
            });
        }

        res.status(200).json({
            message: "Data kontak berhasil diambil!",
            data: results
        });
    });
});

app.listen(PORT, () => {
    console.log(`Server berjalan di https://localhost: ${PORT}`);
});