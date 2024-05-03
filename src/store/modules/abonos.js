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
	abonos: [],
};

const getters = {
	todosLosAbonos: state => state.abonos,
};

const actions = {
	async fetchAbonos({ commit }) {
		try {
			const response = await apiService.getAbonos();
			// Convertir las fechas de cada abono
			const abonosConFechasConvertidas = response.data.body.map(abono =>
				utilidades.convertirFechas(abono)
			);
			commit('setAbonos', abonosConFechasConvertidas);
		} catch (error) {
			console.error('Error al obtener abonos:', error);
		}
	},
	async agregarAbono({ dispatch }, abono) {
		alertify.confirm(
			abono.id === 0 ? 'Deseas agregar item?' : 'Deseas editar item?',
			async () => {
				try {
					const response = await apiService.postAbono(abono);
					if (response.status === 201) {
						alertify.success(abono.id === 0 ? 'Item agregado correctamente' : 'Item actualizado' +
							' correctamente');
						dispatch('fetchAbonos');
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
	async eliminarAbono({ commit }, abonoId) {
		alertify.confirm('Seguro que deseas eliminar el abono?',
			async () => {
				try {
					const response = await apiService.deleteAbono(abonoId);
					if (response.status === 200) {
						alertify.success('Item eliminado correctamente');
						commit('deleteAbono', abonoId); // Actualiza el estado
					} else {
						alertify.error('Error al eliminar el movimiento');
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
};


const mutations = {
	setAbonos: (state, abonos) => (state.abonos = abonos),

	deleteAbono: (state, abonoId) => {
		state.abonos = state.abonos.filter(ab => ab.id !== abonoId);
	},

};


export default {
	state,
	getters,
	actions,
	mutations,
};