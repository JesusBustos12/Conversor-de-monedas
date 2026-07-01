const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const db = require('../db');
const auth = require('../middleware/auth');
const { isValidName, isValidEmail, isValidPassword, sanitize } = require('../utils/validators');

// Obtener usuario actual (validación de sesión)
router.get('/me', auth, async (req, res, next) => {
    try {
        const [users] = await db.execute(
            'SELECT id, name, email, pic_url, theme, lang FROM users WHERE id = ?',
            [req.user.id]
        );

        if (users.length === 0) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        const user = users[0];
        res.json({
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                picUrl: user.pic_url,
                theme: user.theme,
                lang: user.lang
            }
        });
    } catch (error) {
        next(error);
    }
});

// Actualizar Perfil
router.put('/profile', auth, async (req, res, next) => {
    try {
        const { name, email, pass, picUrl } = req.body;
        const userId = req.user.id;

        // ── Validación estricta ──
        if (!isValidName(name)) {
            return res.status(400).json({ message: 'Nombre inválido (1-100 caracteres)' });
        }
        if (!isValidEmail(email)) {
            return res.status(400).json({ message: 'Formato de email inválido' });
        }
        if (pass && !isValidPassword(pass)) {
            return res.status(400).json({ message: 'Contraseña: mínimo 8 caracteres, 1 mayúscula, 1 número' });
        }

        const cleanName = sanitize(name);
        const cleanEmail = email.trim().toLowerCase();
        const cleanPicUrl = picUrl ? sanitize(picUrl) : null;

        let query = 'UPDATE users SET name = ?, email = ?, pic_url = ?';
        let params = [cleanName, cleanEmail, cleanPicUrl];

        if (pass) {
            const salt = await bcrypt.genSalt(12);
            const hashedPass = await bcrypt.hash(pass, salt);
            query += ', password = ?';
            params.push(hashedPass);
        }

        query += ' WHERE id = ?';
        params.push(userId);

        await db.execute(query, params);

        res.json({ message: 'Perfil actualizado con éxito' });
    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ message: 'El email ya está en uso' });
        }
        next(error);
    }
});

// Actualizar Preferencias (UI)
router.put('/preferences', auth, async (req, res, next) => {
    try {
        const { theme, lang } = req.body;
        const userId = req.user.id;

        const validThemes = ['light', 'dark'];
        const validLangs = ['es', 'en', 'fr', 'pt']; // Añadir los idiomas soportados

        if (theme && !validThemes.includes(theme)) {
            return res.status(400).json({ message: 'Tema inválido' });
        }
        if (lang && !validLangs.includes(lang)) {
            return res.status(400).json({ message: 'Idioma inválido' });
        }

        let query = 'UPDATE users SET ';
        let params = [];
        let updates = [];

        if (theme) {
            updates.push('theme = ?');
            params.push(theme);
        }
        if (lang) {
            updates.push('lang = ?');
            params.push(lang);
        }

        if (updates.length > 0) {
            query += updates.join(', ') + ' WHERE id = ?';
            params.push(userId);
            await db.execute(query, params);
        }

        res.json({ message: 'Preferencias actualizadas con éxito' });
    } catch (error) {
        next(error);
    }
});

module.exports = router;
