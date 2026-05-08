const { Pool } = require("pg");

const pool = new Pool({
    user: "postgres",
    host: "localhost",
    database: "controlgastos",
    password: "1234", 
    port: 5432,
});

pool.connect((err, client, release) => {
    if (err) {
        return console.error("Error al conectar a la BD", err.stack);
    }
    console.log("Conectado a PostgreSQL");
    release();
});

module.exports = pool;