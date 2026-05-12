const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../db');
const { isValidEmail, isValidPassword, isValidName, sanitize } = require('../utils/validators');

// Registro
router.post('/register', async (req, res, next) => {
    try {
        const { name, email, pass, picUrl } = req.body;

        // ── Validación estricta ──
        if (!isValidName(name)) {
            return res.status(400).json({ message: 'Nombre inválido (1-100 caracteres, sin HTML)' });
        }
        if (!isValidEmail(email)) {
            return res.status(400).json({ message: 'Formato de email inválido' });
        }
        if (!isValidPassword(pass)) {
            return res.status(400).json({ message: 'Contraseña: mínimo 8 caracteres, 1 mayúscula, 1 número' });
        }

        const cleanName = sanitize(name);
        const cleanEmail = email.trim().toLowerCase();
        const cleanPicUrl = picUrl ? sanitize(picUrl) : null;

        // Verificar si existe
        const [existing] = await db.execute('SELECT id FROM users WHERE email = ?', [cleanEmail]);
        if (existing.length > 0) {
            return res.status(409).json({ message: 'El usuario ya existe' });
        }

        // Hashear pass
        const salt = await bcrypt.genSalt(12);
        const hashedPass = await bcrypt.hash(pass, salt);

        // Insertar
        const [result] = await db.execute(
            'INSERT INTO users (name, email, password, pic_url) VALUES (?, ?, ?, ?)',
            [cleanName, cleanEmail, hashedPass, cleanPicUrl]
        );

        res.status(201).json({ message: 'Usuario registrado con éxito', userId: result.insertId });
    } catch (error) {
        next(error);
    }
});

// Login
router.post('/login', async (req, res, next) => {
    try {
        const { email, pass } = req.body;

        // ── Validación estricta ──
        if (!email || typeof email !== 'string' || !pass || typeof pass !== 'string') {
            return res.status(400).json({ message: 'Email y contraseña son obligatorios' });
        }

        const cleanEmail = email.trim().toLowerCase();
        const ip = req.ip;

        const [users] = await db.execute('SELECT * FROM users WHERE email = ?', [cleanEmail]);
        if (users.length === 0) {
            await db.execute('INSERT INTO login_logs (email_attempted, status, ip_address) VALUES (?, ?, ?)', [cleanEmail, 'FAILED', ip]);
            return res.status(401).json({ message: 'Credenciales inválidas' });
        }

        const user = users[0];
        const isMatch = await bcrypt.compare(pass, user.password);

        if (!isMatch) {
            await db.execute('INSERT INTO login_logs (user_id, email_attempted, status, ip_address) VALUES (?, ?, ?, ?)', [user.id, cleanEmail, 'FAILED', ip]);
            return res.status(401).json({ message: 'Credenciales inválidas' });
        }

        // Crear Token
        const token = jwt.sign(
            { id: user.id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        // Log Éxito
        await db.execute('INSERT INTO login_logs (user_id, email_attempted, status, ip_address) VALUES (?, ?, ?, ?)', [user.id, cleanEmail, 'SUCCESS', ip]);

        res.json({
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                picUrl: user.pic_url
            }
        });
    } catch (error) {
        next(error);
    }
});

module.exports = router;
