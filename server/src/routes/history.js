const express = require('express');
const router = express.Router();
const db = require('../db');
const auth = require('../middleware/auth');
const { isValidCurrencyCode, isValidAmount, sanitize } = require('../utils/validators');

// Obtener historial
router.get('/', auth, async (req, res, next) => {
    try {
        const userId = req.user.id;

        const [rows] = await db.execute(
            'SELECT * FROM conversions WHERE user_id = ? ORDER BY created_at DESC LIMIT 50',
            [userId]
        );

        const history = rows.map(row => ({
            id: row.id,
            from: row.from_currency,
            to: row.to_currency,
            amount: row.amount,
            result: row.result,
            rate: row.rate,
            date: new Date(row.created_at).toLocaleDateString(),
            timestamp: new Date(row.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }));

        res.json(history);
    } catch (error) {
        next(error);
    }
});

// Guardar actividad
router.post('/', auth, async (req, res, next) => {
    try {
        const { from, to, amount, result, rate } = req.body;
        const userId = req.user.id;

        // ── Validación estricta ──
        if (!isValidCurrencyCode(from)) {
            return res.status(400).json({ message: 'Moneda de origen inválida (debe ser código de 3 letras)' });
        }
        if (!isValidCurrencyCode(to)) {
            return res.status(400).json({ message: 'Moneda de destino inválida (debe ser código de 3 letras)' });
        }
        if (!isValidAmount(amount)) {
            return res.status(400).json({ message: 'Monto inválido (debe ser un número positivo)' });
        }

        // Asegurar que el resultado sea un número válido para MySQL (sin comas de miles)
        const numericResult = typeof result === 'string' 
            ? parseFloat(result.replace(/,/g, '')) 
            : parseFloat(result);

        const cleanRate = sanitize(String(rate));

        await db.execute(
            'INSERT INTO conversions (user_id, from_currency, to_currency, amount, result, rate) VALUES (?, ?, ?, ?, ?, ?)',
            [userId, from, to, parseFloat(amount), numericResult, cleanRate]
        );

        res.status(201).json({ message: 'Actividad guardada' });
    } catch (error) {
        next(error);
    }
});

// Vaciar historial
router.delete('/', auth, async (req, res, next) => {
    try {
        const userId = req.user.id;
        await db.execute('DELETE FROM conversions WHERE user_id = ?', [userId]);
        res.json({ message: 'Historial vaciado con éxito' });
    } catch (error) {
        next(error);
    }
});

module.exports = router;
