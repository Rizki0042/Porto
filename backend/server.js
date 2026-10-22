require("dotenv").config();
const express = require("express");
const cors = require("cors");
const db = require("./database");
const app = express();
const jwt = require("jsonwebtoken")

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;
const STATUS_VALID = ["Baru", "Dibaca", "Selesai"];

function validasiKontak({ nama, email, pesan }) {
  if (
    typeof nama !== "string" ||
    typeof email !== "string" ||
    typeof pesan !== "string"
  ) {
    return "Nama, email, dan pesan wajib diisi!";
  }
  const data = {
    nama: nama.trim(),
    email: email.trim(),
    pesan: pesan.trim(),
  };

  if (!data.nama || !data.email || !data.pesan) {
    return "Nama, email, dan pesan wajib diisi!";
  }

  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailValid.test(data.email)) {
    return "Format email tidak valid!";
  }

  return null;
}
function validasiId(id) {
    return /^\d+$/.test(id) &&
        Number.isSafeInteger(Number(id)) &&
        Number(id) > 0;
}
function autentikasiAdmin(req, res, next) {
    const authHeader = req.headers.authorization || "";

    const token = authHeader.startsWith("Bearer ")
        ? authHeader.slice(7).trim()
        : "";

    if (!token) {
        return res.status(401).json({
            message: "Login admin diperlukan",
        });
    }

    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET);

        if (payload.role !== "admin") {
            return res.status(403).json({
                message: "Akses ditolak",
            });
        }

        req.admin = payload;
        next();
    } catch (err) {
        return res.status(401).json({
            message: "Token tidak valid atau sudah kedaluwarsa",
        });
    }
}

app.get("/", (req, res) => {
  res.send("Backend Website berjalan!!");
});

app.get("/contact", autentikasiAdmin, async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM contact ORDER BY id DESC");
    res.status(200).json({
      message: "Data Kontak berhasil diambil!",
      data: result.rows,
    });
  } catch (err) {
    console.error("Gagal mengambil data kontak:", err.message);

    res.status(500).json({
      message: "Gagal mengambil data kontak",
    });
  }
});

app.get("/contact/count", autentikasiAdmin, async (req, res) => {
  try {
    const result = await db.query("SELECT COUNT(*) AS total FROM contact");
    res.status(200).json({
      message: "Berhasil menghitung kontak",
      total: Number(result.rows[0].total),
    });
  } catch (err) {
    console.error("Gagal menghitung kontak", err.message);

    res.status(500).json({
      message: "Gagal menghitung kontak",
    });
  }
});

app.get("/contact/latest", autentikasiAdmin, async (req, res) => {
  try {
    const result = await db.query(
      "SELECT * FROM contact ORDER BY id DESC LIMIT 5",
    );
    res.status(200).json({
      message: "Berhasil mengambil data kontak terbaru!",
      data: result.rows,
    });
  } catch (err) {
    console.error("Gagal mengambil data kontak terbaru:", err.message);

    res.status(500).json({
      message: "Gagal mengambil data kontak!",
    });
  }
});

//POST contact

app.post("/contact", async (req, res) => {
  try {
    const error = validasiKontak(req.body ?? {});

    if (error) {
      return res.status(400).json({
        message: error,
      });
    }

    const { nama, email, pesan } = req.body;

    const result = await db.query(
      `INSERT INTO contact (nama, email, pesan)
             VALUES ($1, $2, $3)
             RETURNING id`,
      [nama.trim(), email.trim(), pesan.trim()],
    );

    res.status(201).json({
      message: "Pesan berhasil disimpan!",
      id: result.rows[0].id,
    });
  } catch (err) {
    console.error("Gagal menyimpan pesan:", err.message);

    res.status(500).json({
      message: "Gagal menyimpan pesan!",
    });
  }
});

app.post("/admin/login", (req, res) => {
    const { username, password } = req.body ?? {};

    if (
        !process.env.ADMIN_USERNAME ||
        !process.env.ADMIN_PASSWORD ||
        !process.env.JWT_SECRET
    ) {
        return res.status(500).json({
            message: "Konfigurasi login admin belum lengkap",
        });
    }

    if (
        typeof username !== "string" ||
        typeof password !== "string" ||
        username !== process.env.ADMIN_USERNAME ||
        password !== process.env.ADMIN_PASSWORD
    ) {
        return res.status(401).json({
            message: "Username atau password salah",
        });
    }

    const token = jwt.sign(
        {
            role: "admin",
            username: process.env.ADMIN_USERNAME,
        },
        process.env.JWT_SECRET,
        { expiresIn: "2h" }
    );

    return res.status(200).json({
        message: "Login berhasil",
        token,
        expiresIn: 7200,
    });
});

//DELETE
app.delete("/contact/:id", autentikasiAdmin, async (req, res) => {
  try {
    const id = req.params.id;
    if (!validasiId(id)) {
      return res.status(400).json({
        message: "ID kontak tidak valid",
      });
    }
    const result = await db.query("DELETE FROM contact WHERE id = $1", [id]);

    if (result.rowCount === 0) {
      return res.status(404).json({
        message: "Data kontak tidak ditemukan",
      });
    }

    res.status(200).json({
      message: "Contact berhasil dihapus",
    });
  } catch (err) {
    console.error("Gagal menghapus data kontak:", err.message);

    res.status(500).json({
      message: "Gagal menghapus kontak",
    });
  }
});

//PUT

app.put("/contact/:id", autentikasiAdmin, async (req, res) => {
  try {
    const error = validasiKontak(req.body ?? {});

    if (error) {
      return res.status(400).json({
        message: error,
      });
    }

    const { nama, email, pesan } = req.body;
    const { id } = req.params;
    if (!validasiId(id)) {
    return res.status(400).json({
        message: "ID kontak tidak valid"
    });
}

    const result = await db.query(
      `UPDATE contact
             SET nama = $1, email = $2, pesan = $3
             WHERE id = $4`,
      [nama.trim(), email.trim(), pesan.trim(), id],
    );

    if (result.rowCount === 0) {
      return res.status(404).json({
        message: "Data kontak tidak ditemukan",
      });
    }

    res.status(200).json({
      message: "Berhasil update kontak",
    });
  } catch (err) {
    console.error("Gagal mengupdate kontak:", err.message);

    res.status(500).json({
      message: "Gagal mengupdate kontak",
    });
  }
});

//PATCH
app.patch("/contact/:id/status", autentikasiAdmin, async (req, res) => {
  try {
    const id = req.params.id;
    if (!validasiId(id)) {
    return res.status(400).json({
        message: "ID kontak tidak valid"
    });
}
    const { status } = req.body ?? {};

    if (!STATUS_VALID.includes(status)) {
      return res.status(400).json({
        message: "Status tidak valid",
      });
    }

    const result = await db.query(
      "UPDATE contact SET status = $1 WHERE id = $2",
      [status, id],
    );
    if (result.rowCount === 0) {
      return res.status(404).json({
        message: "Data kontak tidak ditemukan",
      });
    }

    res.status(200).json({
      message: "Status berhasil diubah",
    });
  } catch (err) {
    console.error("Gagal mengubah status:", err.message);

    res.status(500).json({
      message: "Gagal mengubah status data",
    });
  }
});

app.listen(PORT, () => {
    console.log(`Server berjalan di http://localhost:${PORT}`);
});