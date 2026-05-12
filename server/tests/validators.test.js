const { 
    isValidEmail, 
    isValidPassword, 
    isValidName, 
    isValidCurrencyCode, 
    isValidAmount, 
    sanitize 
} = require('../src/utils/validators');

describe('Validators Unit Tests', () => {

    describe('isValidEmail', () => {
        test('should return true for valid emails', () => {
            expect(isValidEmail('test@example.com')).toBe(true);
            expect(isValidEmail('user.name+tag@domain.co.uk')).toBe(true);
        });

        test('should return false for invalid emails', () => {
            expect(isValidEmail('invalid-email')).toBe(false);
            expect(isValidEmail('test@')).toBe(false);
            expect(isValidEmail('@domain.com')).toBe(false);
            expect(isValidEmail('')).toBe(false);
            expect(isValidEmail(null)).toBe(false);
        });
    });

    describe('isValidPassword', () => {
        test('should return true for strong passwords', () => {
            expect(isValidPassword('StrongPass123')).toBe(true);
        });

        test('should return false for weak passwords', () => {
            expect(isValidPassword('weak')).toBe(false); // too short
            expect(isValidPassword('alllowercase1')).toBe(false); // no uppercase
            expect(isValidPassword('ALLUPPERCASE1')).toBe(false); // no lowercase
            expect(isValidPassword('NoNumberPass')).toBe(false); // no number
        });
    });

    describe('isValidName', () => {
        test('should return true for valid names', () => {
            expect(isValidName('John Doe')).toBe(true);
            expect(isValidName('A')).toBe(true);
        });

        test('should return false for names with HTML or empty', () => {
            expect(isValidName('<b>Invalid</b>')).toBe(false);
            expect(isValidName('')).toBe(false);
            expect(isValidName('   ')).toBe(false);
        });
    });

    describe('isValidCurrencyCode', () => {
        test('should return true for 3-letter uppercase codes', () => {
            expect(isValidCurrencyCode('USD')).toBe(true);
            expect(isValidCurrencyCode('EUR')).toBe(true);
        });

        test('should return false for invalid codes', () => {
            expect(isValidCurrencyCode('usd')).toBe(false);
            expect(isValidCurrencyCode('US')).toBe(false);
            expect(isValidCurrencyCode('USDT')).toBe(false);
            expect(isValidCurrencyCode('123')).toBe(false);
        });
    });

    describe('isValidAmount', () => {
        test('should return true for positive numbers', () => {
            expect(isValidAmount(100)).toBe(true);
            expect(isValidAmount('50.5')).toBe(true);
        });

        test('should return false for negative or zero', () => {
            expect(isValidAmount(0)).toBe(false);
            expect(isValidAmount(-10)).toBe(false);
            expect(isValidAmount('abc')).toBe(false);
        });
    });

    describe('sanitize', () => {
        test('should strip HTML tags', () => {
            expect(sanitize('<b>Hello</b>')).toBe('Hello');
            expect(sanitize('<script>alert("xss")</script>Test')).toBe('alert("xss")Test');
        });

        test('should handle empty input', () => {
            expect(sanitize('')).toBe('');
            expect(sanitize(null)).toBe('');
        });
    });
});
