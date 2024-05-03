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

import { format, parseISO } from 'date-fns';

//Utilizamos esta función en varios archivos de la store de vuex para tratar todos los campos
// de fecha que devuelve el backend y mostrarlas en las tablas con el formato deseado
export function convertirFechas(objeto) {
	for (const clave in objeto) {
		if (Object.prototype.hasOwnProperty.call(objeto, clave)) {
			const valor = objeto[clave];
			// Verifica si es una fecha en formato ISO 8601
			if (typeof valor === 'string' && valor.match(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/)) {
				// Convierte a objeto Date y luego a formato local
				const fecha = parseISO(valor);
				objeto[clave] = format(fecha, 'yyyy-MM-dd');
			}
		}
	}
	return objeto;
}

export function fechaActual() {
	const ahora = new Date();
	return format(ahora, 'yyyy-MM-dd');
}

export function formatCurrency(value, locale = 'es-ES', currency = 'EUR') {
	const formatter = new Intl.NumberFormat(locale, {
		style: 'currency',
		currency: currency,
	});
	return formatter.format(value);
}
