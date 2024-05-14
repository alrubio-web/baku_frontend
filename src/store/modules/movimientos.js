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

import apiService from '@/services/apiService';
import alertify from 'alertifyjs';
import * as utilidades from '@/utils/utilidades';

const state = {
	movimientos: [],
};

const getters = {
	todosLosMovimientos: state => state.movimientos,
};

const actions = {
	async fetchMovimientos({ commit }) {
		try {
			const response = await apiService.getMovimientos();
			// Convertir las fechas de cada inmueble
			const movimientosConFechasConvertidas = response.data.body.map(movimiento =>
				utilidades.convertirFechas(movimiento)
			);
			commit('setMovimientos', movimientosConFechasConvertidas);
		} catch (error) {
			console.error('Error al obtener contratos:', error);
		}
	},
	async agregarMovimiento({ dispatch }, movimiento) {
		alertify.confirm(
			movimiento.id === 0 ? 'Deseas agregar item?' : 'Deseas editar item?',
			async () => {
				try {
					const response = await apiService.postMovimiento(movimiento);
					if (response.status === 201) {
						alertify.success(movimiento.id === 0 ? 'Item agregado correctamente' : 'Item actualizado' +
							' correctamente');
						dispatch('fetchMovimientos');
					} else {
						alertify.error('Error al agregar el movimiento');
					}
				} catch (error) {
					console.error('Error al agregar movimiento:', error);
					alertify.error('Error al agregar movimiento.'); // Mensaje de error
				}
			},
			() => {
				alertify.error('Acción cancelada.');
			}
		);
	},
	async eliminarMovimiento({ commit }, movimiento) {
		alertify.confirm('Seguro que deseas eliminar el movimiento?',
			async () => {
				try {
					if(movimiento.estado === "anulado"){
						const response = await apiService.deleteMovimiento(movimiento.id);
						if (response.status === 200) {
							alertify.success('Item eliminado correctamente');
							commit('deleteMovimiento', movimiento.id); // Actualiza el estado
						} else {
							alertify.error('Error al eliminar el movimiento');
						}
					} else {
						alertify.error('No se puede eliminar un movimiento cuyo estado no sea "anulado" o que ' +
							'tenga un abono asociado.');
					}

				} catch (error) {
					console.error('Error al eliminar movimiento:', error);
					alertify.error('Error al eliminar movimiento.'); // Mensaje de error
				}
			},
			() => {
				alertify.error('Acción cancelada.');
			}
		);
	},
	async mailMovimiento({ dispatch }, movimientoId) {
		// Iniciar operación de envío de email
		const response = await apiService.postMailMovimiento(movimientoId);
		dispatch('fetchMovimientos');
		return response;
	},
	async imprimirMovimiento({ dispatch }, movimientoId) {
		const response = await apiService.imprimirMovimiento(movimientoId);
		dispatch('fetchMovimientos');
		return response;
	},
	async revisarMovimientos({ dispatch }) {
		const response = await apiService.revisarMovimientos();
		dispatch('fetchMovimientos');
		return response;
	},
};


const mutations = {
	setMovimientos: (state, movimientos) => (state.movimientos = movimientos),

	// setMovimientos: (state, movimientos) => (state.movimientos = movimientos),

	deleteMovimiento: (state, movimientoId) => {
		state.movimientos = state.movimientos.filter(mov => mov.id !== movimientoId);
	},

};


export default {
	state,
	getters,
	actions,
	mutations,
};