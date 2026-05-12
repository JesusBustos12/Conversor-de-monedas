/**
 * validators.js - Funciones de validación reutilizables para el backend
 */

/**
 * Valida un email con regex estricta
 */
function isValidEmail(email) {
    if (!email || typeof email !== 'string') return false;
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email.trim()) && email.length <= 255;
}

/**
 * Valida una contraseña (mínimo 8 chars, 1 mayúscula, 1 minúscula, 1 número)
 */
function isValidPassword(pass) {
    if (!pass || typeof pass !== 'string') return false;
    return pass.length >= 8 && pass.length <= 128 && /[A-Z]/.test(pass) && /[a-z]/.test(pass) && /[0-9]/.test(pass);
}

/**
 * Valida un nombre (no vacío, longitud razonable, sin HTML)
 */
function isValidName(name) {
    if (!name || typeof name !== 'string') return false;
    const trimmed = name.trim();
    return trimmed.length >= 1 && trimmed.length <= 100 && !/<[^>]*>/.test(trimmed);
}

/**
 * Valida un código de moneda (3 letras mayúsculas)
 */
function isValidCurrencyCode(code) {
    if (!code || typeof code !== 'string') return false;
    return /^[A-Z]{3}$/.test(code);
}

/**
 * Valida un monto numérico positivo
 */
function isValidAmount(amount) {
    const num = parseFloat(amount);
    return !isNaN(num) && num > 0 && num <= 999999999999;
}

/**
 * Sanitiza un string básico (elimina tags HTML)
 */
function sanitize(str) {
    if (!str || typeof str !== 'string') return '';
    return str.replace(/<[^>]*>/g, '').trim();
}

module.exports = {
    isValidEmail,
    isValidPassword,
    isValidName,
    isValidCurrencyCode,
    isValidAmount,
    sanitize
};
