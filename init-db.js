require('dotenv').config();
const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');

async function init() {
    console.log('🚀 Iniciando conexión a TiDB Cloud para configurar la base de datos...');
    
    // Configuración base de conexión (nos conectamos a 'test' para asegurar que podemos crear la BD)
    const baseConfig = {
        host: process.env.DB_HOST,
        port: parseInt(process.env.DB_PORT) || 4000,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD || process.env.DB_PASS,
        database: 'test',
        ssl: { rejectUnauthorized: false }
    };

    console.log(`📡 Conectando a host: ${baseConfig.host}:${baseConfig.port} como usuario ${baseConfig.user}...`);
    
    let pool;
    try {
        pool = mysql.createPool(baseConfig);
        
        // 1. Asegurar la creación de la base de datos aislada
        const targetDb = process.env.DB_NAME || 'currencyhub_db';
        console.log(`🔧 Asegurando la creación de la base de datos lógica: "${targetDb}"...`);
        await pool.execute(`CREATE DATABASE IF NOT EXISTS ${targetDb} CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`);
        console.log(`✅ Base de datos "${targetDb}" asegurada con éxito.`);
        
        // Cerrar el pool temporal
        await pool.end();

        // 2. Conectarse a la base de datos objetivo
        console.log(`📡 Conectando a la base de datos "${targetDb}" para estructurar las tablas...`);
        const dbConfig = { ...baseConfig, database: targetDb };
        pool = mysql.createPool(dbConfig);

        // 3. Leer y analizar el script SQL setup_mysql_pro.sql
        const sqlPath = path.join(__dirname, 'setup_mysql_pro.sql');
        if (!fs.existsSync(sqlPath)) {
            throw new Error(`No se encontró el archivo ${sqlPath}`);
        }

        console.log(`📖 Leyendo el esquema de base de datos de: ${sqlPath}`);
        const sqlContent = fs.readFileSync(sqlPath, 'utf8');
        
        // 1. Limpiar comentarios de bloque (/* ... */)
        // 2. Limpiar comentarios de línea (-- ...)
        const cleanedSql = sqlContent
            .replace(/\/\*[\s\S]*?\*\//g, '')
            .split('\n')
            .map(line => {
                const commentIdx = line.indexOf('--');
                return commentIdx !== -1 ? line.substring(0, commentIdx) : line;
            })
            .join('\n');

        // 3. Separar por punto y coma y filtrar comandos locales de base de datos
        const queries = cleanedSql
            .split(';')
            .map(q => q.trim())
            .filter(q => {
                if (!q) return false;
                
                const upper = q.toUpperCase();
                // Ignorar comandos locales de eliminación, creación y cambio de base de datos
                if (upper.startsWith('DROP DATABASE') || 
                    upper.startsWith('CREATE DATABASE') || 
                    upper.startsWith('USE ')) {
                    console.log(`🔍 Saltando consulta local no compatible en TiDB Cloud: ${q.split('\n')[0]}...`);
                    return false;
                }
                return true;
            });

        console.log(`📌 Encontradas ${queries.length} consultas compatibles para ejecutar.`);

        // 4. Ejecutar las consultas de creación de tablas e índices
        for (let i = 0; i < queries.length; i++) {
            const query = queries[i];
            // Mostrar la primera línea de la consulta que se ejecuta
            const firstLine = query.split('\n')[0].trim();
            console.log(`⚙️ Ejecutando consulta ${i + 1}/${queries.length}: "${firstLine}"`);
            await pool.execute(query);
        }

        console.log('🎉 ¡Base de datos inicializada de forma exitosa en TiDB Cloud con todas sus tablas e índices!');
    } catch (error) {
        console.error('❌ Error crítico al inicializar la base de datos:', error.message);
    } finally {
        if (pool) {
            await pool.end();
            console.log('🔌 Conexión con TiDB Cloud finalizada con éxito.');
        }
    }
}

init();
