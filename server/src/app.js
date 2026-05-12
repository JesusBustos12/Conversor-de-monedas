const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const morgan = require('morgan');
const path = require('path');

const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const historyRoutes = require('./routes/history');

const app = express();

// ──────────────────────────────────────────
// CONFIGURACIÓN PROXY: Confiar en el proxy (Nginx) para IP real (Fix Rate Limiting)
// ──────────────────────────────────────────
app.set('trust proxy', 1);

// ──────────────────────────────────────────
// LOGGING: Registro de peticiones HTTP
// ──────────────────────────────────────────
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));

// ──────────────────────────────────────────
// SEGURIDAD: Headers HTTP (Helmet)
// ──────────────────────────────────────────
app.use(helmet({
    contentSecurityPolicy: {
        useDefaults: false,
        directives: {
            "default-src": ["'self'"],
            "script-src": ["'self'", "'unsafe-inline'"],
            "script-src-attr": ["'unsafe-inline'"],
            "style-src": ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
            "font-src": ["'self'", "https://fonts.gstatic.com"],
            "img-src": ["'self'", "data:", "https://flagcdn.com", "https://*"],
            "connect-src": [
                "'self'", 
                "https://cdn.moneyconvert.net", 
                "https://fonts.googleapis.com", 
                "https://fonts.gstatic.com", 
                "https://flagcdn.com"
            ],
            "worker-src": ["'self'"],
            "object-src": ["'none'"],
            "upgrade-insecure-requests": []
        }
    },
    crossOriginEmbedderPolicy: false,
    crossOriginResourcePolicy: { policy: "cross-origin" }
}));

// ──────────────────────────────────────────
// SEGURIDAD: CORS restringido
// ──────────────────────────────────────────
const allowedOrigins = process.env.ALLOWED_ORIGINS
    ? process.env.ALLOWED_ORIGINS.split(',')
    : ['http://localhost:3000'];

app.use(cors({
    origin: (origin, callback) => {
        // Permitir peticiones sin origin (mismo servidor, Postman en dev)
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Origen no permitido por CORS'));
        }
    },
    credentials: true
}));

// ──────────────────────────────────────────
// SEGURIDAD: Limitar tamaño del body (Fix 12)
// ──────────────────────────────────────────
app.use(express.json({ limit: '1mb' }));

// ──────────────────────────────────────────
// SEGURIDAD: Rate Limiting
// ──────────────────────────────────────────
const globalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,  // 15 minutos
    max: 100,                   // 100 peticiones por ventana
    standardHeaders: true,
    legacyHeaders: false,
    message: { message: 'Demasiadas peticiones. Inténtalo de nuevo más tarde.' }
});

const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,  // 15 minutos
    max: 10,                    // Solo 10 intentos de login/registro por ventana
    standardHeaders: true,
    legacyHeaders: false,
    message: { message: 'Demasiados intentos de autenticación. Espera 15 minutos.' }
});

app.use('/api/', globalLimiter);
app.use('/api/auth/', authLimiter);

// ──────────────────────────────────────────
// RUTAS
// ──────────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/history', historyRoutes);

// ──────────────────────────────────────────
// ARCHIVOS ESTÁTICOS (Frontend con Vite)
// ──────────────────────────────────────────
const DIST_PATH = process.env.VERCEL 
    ? path.join(process.cwd(), 'public')
    : path.join(__dirname, '../../frontend/dist');
const PUBLIC_PATH = process.env.VERCEL 
    ? path.join(process.cwd(), 'public')
    : path.join(__dirname, '../../frontend/public');

// Servir la carpeta optimizada de Vite si existe, de lo contrario usar public (legacy)
app.use(express.static(DIST_PATH));
app.use(express.static(PUBLIC_PATH));

app.get(/^(?!\/api).+/, (req, res) => {
    // Intentar servir index.html de dist primero
    const distIndex = path.join(DIST_PATH, 'index.html');
    const publicIndex = path.join(PUBLIC_PATH, 'index.html');
    
    res.sendFile(distIndex, (err) => {
        if (err) {
            res.sendFile(publicIndex);
        }
    });
});

// ──────────────────────────────────────────
// HEALTH CHECK: Endpoint para monitoreo de salud del contenedor
// ──────────────────────────────────────────
app.get('/api/health', (req, res) => res.status(200).json({ status: 'OK' }));

// ──────────────────────────────────────────
// MIDDLEWARE GLOBAL DE ERRORES (Fix 8)
// ──────────────────────────────────────────
app.use((err, req, res, next) => {
    const timestamp = new Date().toISOString();
    const status = err.status || 500;

    // Log estructurado (Fix 13)
    console.error(JSON.stringify({
        timestamp,
        level: 'ERROR',
        status,
        method: req.method,
        path: req.originalUrl,
        message: err.message,
        stack: process.env.NODE_ENV === 'production' ? undefined : err.stack
    }));

    res.status(status).json({
        message: process.env.NODE_ENV === 'production'
            ? 'Error interno del servidor'
            : err.message
    });
});

module.exports = app;
