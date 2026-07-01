const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    // Intentar leer de cookies primero, luego del header Authorization por retrocompatibilidad
    const token = req.cookies?.token || req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
        return res.status(401).json({ message: 'No hay token, autorización denegada' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        res.status(401).json({ message: 'Token no es válido' });
    }
};
