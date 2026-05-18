const mysql = require('mysql2');

// Activar SSL si el host no es local (requisito obligatorio para TiDB Cloud)
const useSSL = process.env.DB_HOST && 
               !process.env.DB_HOST.includes('localhost') && 
               !process.env.DB_HOST.includes('127.0.0.1');

const dbConfig = {
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT) || 4000,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD || process.env.DB_PASS,
    database: process.env.DB_NAME,
    ssl: useSSL ? { rejectUnauthorized: false } : undefined,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
};

// Crear el pool de conexiones (el pool gestiona reconexiones automáticamente)
const pool = mysql.createPool(dbConfig);

// Exportar el pool con soporte para promesas
module.exports = pool.promise();
