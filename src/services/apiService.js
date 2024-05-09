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

import axios from 'axios';

const apiClient = axios.create({
	baseURL: 'https://api.bakurentalmanager.site/api',
	withCredentials: true,
	headers: {
		'Content-Type': 'application/json'
	}
});

export default {
	logout() {
		return apiClient.post('/authGoogle/logout');
	},
	verifySession() {
		return apiClient.get('/authGoogle/session');
	},

	async getContactos() {
		return apiClient.get('/contactos');
	},
	async getInquilinos() {
		return apiClient.get('/contactos/inquilinos');
	},
	async postContacto(usuario) {
		return apiClient.post('/contactos', usuario);
	},
	async deleteContacto(usuarioId) {
		const id = Number(usuarioId);
		const data = { id: id }; // Crear el objeto
		console.log(data); // Muestra el objeto en consola para depuración
		return apiClient.delete('/contactos', { data: data });
	},

	async getInmuebles() {
		return apiClient.get('/inmuebles');
	},
	async getInmueblesContratos(){
		return apiClient.get('/inmuebles/infoInmueblesContratos');
	},
	async postInmueble(inmueble) {
		return apiClient.post('/inmuebles', inmueble);
	},
	async deleteInmueble(inmuebleId) {
		const id = Number(inmuebleId);
		const data = { id: id }; // Crear el objeto
		console.log(data); // Muestra el objeto en consola para depuración
		return apiClient.delete('/inmuebles', { data: data });
	},

	async getInmueblesPropietarios() {
		return apiClient.get('/inmuebles_propietarios');
	},
	async getInmueblesPropietariosVista() {
		return apiClient.get('/inmuebles_propietarios/detalleVista');
	},
	async postInmueblePropietario(inmueblePropietario) {
		const data = {
			id_inmueble: Number(inmueblePropietario.id_inmueble),
			id_propietario: Number(inmueblePropietario.id_propietario),
			propiedad: Number(inmueblePropietario.propiedad)
		};// Crear el objeto
		return apiClient.post('/inmuebles_propietarios', data);
	},
	async deleteInmueblePropietario(inmueblePropietario) {
		const data = {
			id_inmueble: Number(inmueblePropietario.id_inmueble),
			id_propietario: Number(inmueblePropietario.id_propietario)
		}; // Crear el objeto
		console.log(data); // Muestra el objeto en consola para depuración
		return apiClient.delete('/inmuebles_propietarios', { data: data });
	},

	async getContratos() {
		return apiClient.get('/contratos');
	},
	async getVistaContratos() {
		return apiClient.get('/contratos/vista');
	},
	async postContrato(contrato) {
		return apiClient.post('/contratos', contrato);
	},
	async deleteContrato(contratoId) {
		const id = Number(contratoId);
		const data = { id: id }; // Crear el objeto
		return apiClient.delete('/contratos/', { data: data });
	},
	async deleteContratoCompleto(contratoId) {
		const id = Number(contratoId);
		const data = { id: id }; // Crear el objeto
		return apiClient.delete('/contratos/contratoCompleto', { data: data });
	},

	async getMedidasContratos() { // Este endpoint genera la consulta a la vista medidas_contratos, que resume las rentas
		return apiClient.get('/contratos/medidas');
	},
	async getRentas() {
		return apiClient.get('/rentas');
	},
	async postRenta(renta) {
		return apiClient.post('/rentas', renta);
	},

	async getMovimientos() {
		return apiClient.get('/movimientos/vistaInforme');
	},
	async postMovimiento(movimiento) {
		return apiClient.post('/movimientos', movimiento);
	},
	async deleteMovimiento(movimientoId) {
		const id = Number(movimientoId);
		const data = { id: id }; // Crear el objeto
		return apiClient.delete('/movimientos', { data: data });
	},
	async postEstatusInquilinoWhatsapp(idInquilino) {
		const data = {
			id_inquilino: idInquilino,
		};// Crear el objeto
		return apiClient.post('/movimientos/enviarEstatus', data );
	},
	async postMailMovimiento(idMovimiento) {
		const data = {
			id_movimiento: idMovimiento,
		};// Crear el objeto
		return apiClient.post('/movimientos/enviarMailMovimiento', data );
	},
	async imprimirMovimiento(id) {
		return apiClient.get(`/movimientos/print/${id}`);
	},

	async getAbonos() {
		return apiClient.get('/abonos/vista');
	},
	async postAbono(abono) {
		return apiClient.post('/abonos', abono);
	},
	async deleteAbono(abonoId) {
		const data = {
			id: Number(abonoId),
		}; // Crear el objeto
		return apiClient.delete('/abonos', { data: data });
	},


};
