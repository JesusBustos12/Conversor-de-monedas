// Cargar variables de entorno
require('dotenv').config();

// Importar la aplicación Express configurada
const app = require('./server/src/app');

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
