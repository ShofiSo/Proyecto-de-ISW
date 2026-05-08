const express = require("express");
const cors = require("cors");
const pool = require("./db");

const app = express();
app.use(cors());
app.use(express.json());

/* ------------------ RUTA BASE ------------------ */
app.get("/", (req, res) => {
    res.send("API ControlGastos funcionando");
});

/* ------------------ TEST DB ------------------ */
app.get("/test-db", async (req, res) => {
    try {
        const result = await pool.query("SELECT NOW()");
        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).send("Error en la base de datos");
    }
});

/* ------------------ LOGIN ------------------ */
app.post("/login", async (req, res) => {
    try {
        const { correo, contraseña } = req.body;

        if (!correo || !contraseña) {
            return res.status(400).json({ error: "Faltan datos" });
        }

        const result = await pool.query(
            "SELECT * FROM usuarios WHERE correo = $1 AND contraseña = $2",
            [correo, contraseña]
        );

        if (result.rows.length > 0) {
            res.json({ success: true });
        } else {
            res.json({ success: false });
        }

    } catch (error) {
        console.error(error);
        res.status(500).send("Error en login");
    }
});

/* ------------------ CREAR MOVIMIENTO ------------------ */
app.post("/movimientos", async (req, res) => {
    try {
        const { tipo, monto, descripcion, fecha } = req.body;

        if (!monto || !descripcion || !fecha) {
            return res.status(400).json({ error: "Faltan datos" });
        }

        const result = await pool.query(
            "INSERT INTO movimientos (tipo, monto, descripcion, fecha) VALUES ($1, $2, $3, $4) RETURNING *",
            [tipo, monto, descripcion, fecha]
        );

        res.json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).send("Error al guardar movimiento");
    }
});

/* ------------------ OBTENER MOVIMIENTOS ------------------ */
app.get("/movimientos", async (req, res) => {
    try {
        const result = await pool.query(
            "SELECT * FROM movimientos ORDER BY id DESC"
        );
        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).send("Error al obtener movimientos");
    }
});

/* ------------------ ELIMINAR MOVIMIENTO ------------------ */
app.delete("/movimientos/:id", async (req, res) => {
    try {
        const { id } = req.params;

        await pool.query(
            "DELETE FROM movimientos WHERE id = $1",
            [id]
        );

        res.json({ mensaje: "Movimiento eliminado" });
    } catch (error) {
        console.error(error);
        res.status(500).send("Error al eliminar");
    }
});

/* ------------------ SERVIDOR ------------------ */
app.listen(3000, () => {
    console.log("Servidor corriendo en puerto 3000");
});