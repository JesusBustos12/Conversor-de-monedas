const mysql = require('mysql2');

const dbConfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
};

// Crear el pool de conexiones (el pool gestiona reconexiones automáticamente)
const pool = mysql.createPool(dbConfig);

// Exportar el pool con soporte para promesas
module.exports = pool.promise();
