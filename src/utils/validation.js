/**
 * Baku - Sistema Integral de Gestión Inmobiliaria
 *
 * Este archivo es parte de "Baku - Sistema Integral de Gestión Inmobiliaria".
 *
 * Este código está disponible bajo la Licencia Dual:
 * - Uso no comercial bajo GNU AGPL v3.0.
 * - Uso comercial bajo Licencia Comercial (contactar al autor para más detalles).
 *
 * @author Alfredo Rubio Mariño
 * @copyright (C) 2023 Alfredo Rubio Mariño
 * @license AGPL-3.0-or-later <https://www.gnu.org/licenses/agpl-3.0.html>
 */

export function required(value) {
	return !!value || `Este campo es obligatorio`;
}

export function email(value) {
	const pattern = /.+@.+\..+/;
	return pattern.test(value) || 'El e-mail debe ser válido';
}

export function onlyNumbers(value) {
	const pattern = /^\d+$/;
	return pattern.test(value) || 'Este campo debe contener solo números';
}

export function dni(value) {
	const pattern = /^[0-9]{8}[A-Za-z]$/;
	return pattern.test(value) || 'El DNI debe tener 8 dígitos seguidos de una letra';
}

export function mobilePhone(value) {
	const pattern = /^[0-9]{9,10}$/;
	return pattern.test(value) || 'El móvil debe tener entre 9 y 10 dígitos';
}

export function phonePrefix(value) {
	const prefixes = ['+34', '+1', '+44', '+39', '+49', '+33'];
	return prefixes.includes(value) || 'El prefijo no es reconocido o no tiene el formato correcto';
}


