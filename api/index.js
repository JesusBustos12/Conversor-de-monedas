require('dotenv').config();
const app = require('../server/src/app');

// Vercel Serverless Functions requieren que se exporte la app de Express,
// a diferencia de los servidores tradicionales que usan app.listen()
module.exports = app;
