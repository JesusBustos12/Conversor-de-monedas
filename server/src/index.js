// PRIMERO: Cargar variables de entorno ANTES de cualquier otro módulo
require('dotenv').config();

const app = require('./app');

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`==========================================`);
    console.log(`🚀 CurrencyHub Server Running`);
    console.log(`📍 Port: ${PORT}`);
    console.log(`🔗 http://localhost:${PORT}`);
    console.log(`📦 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`==========================================`);
});
