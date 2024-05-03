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
	inmuebles: [],
	inmueblesPropietarios: [],
	informacionInmueblesContratos: []
};

const getters = {
	todosLosInmuebles: state => state.inmuebles,
	todosLosInmueblesPropietarios: state => state.inmueblesPropietarios,
	todosLosInmueblesContratos: state => state.informacionInmueblesContratos
};

const actions = {
	async fetchInmuebles({ commit }) {
		try {
			const response = await apiService.getInmuebles();
			// Convertir las fechas de cada inmueble
			const inmueblesConFechasConvertidas = response.data.body.map(inmueble =>
				utilidades.convertirFechas(inmueble)
			);
			commit('setInmuebles', inmueblesConFechasConvertidas);
		} catch (error) {
			console.error('Error al obtener inmuebles:', error);
		}
	},
	async fetchInmueblesContratos({ commit }) {
		try {
			const response = await apiService.getInmueblesContratos();
			// Convertir las fechas de cada inmueble
			const itemsConFechasConvertidas = response.data.body.map(inmueble =>
				utilidades.convertirFechas(inmueble)
			);
			commit('setInmueblesContratos', itemsConFechasConvertidas);
		} catch (error) {
			console.error('Error al obtener información:', error);
		}
	},
	async agregarInmueble({ dispatch }, inmueble) {
		alertify.confirm(
			inmueble.id === 0 ? 'Deseas agregar item?' : 'Deseas editar item?',
			async () => {
				try {
					const response = await apiService.postInmueble(inmueble);
					if (response.status === 201) {
						alertify.success(inmueble.id === 0 ? 'Item agregado correctamente' : 'Item actualizado' +
							' correctamente');
						dispatch('fetchInmuebles');
					} else {
						alertify.error('Error al agregar el inmueble');
					}
				} catch (error) {
					console.error('Error al agregar inmueble:', error);
					alertify.error('Error al agregar inmueble.'); // Mensaje de error
				}
			},
			() => {
				alertify.error('Acción cancelada.');
			}
		);
	},
	async eliminarInmueble({ commit }, InmuebleId) {
		alertify.confirm('Seguro que deseas eliminar el inmueble?',
			async () => {
				try {
					const id = Number(InmuebleId);
					const response = await apiService.deleteInmueble(id);
					if (response.status === 200) {
						alertify.success('Item eliminado correctamente');
						commit('deleteInmueble', id); // Actualiza el estado
					} else {
						alertify.error('Error al eliminar el inmueble');
					}
				} catch (error) {
					console.error('Error al agregar inmueble:', error);
					alertify.error('Error al eliminar inmueble.'); // Mensaje de error
				}
			},
			() => {
				alertify.error('Acción cancelada.');
			}
		);
	},

	async fetchInmueblesPropietariosVista({ commit }) {
		try {
			const response = await apiService.getInmueblesPropietariosVista();
			commit('setInmueblesPropietarios', response.data.body);
		} catch (error) {
			console.error('Error al obtener inmuebles_propietarios:', error);
		}
	},
	async agregarInmueblePropietario({ dispatch }, inmueble_propietario) {
		// En lugar de llamar al commit y utilizar la mutación del estado
		// directamente, utilizamos dispatch y llamamos a fetchInmueblesPropietariosVista
		// para recargar toda la información con todos los campos de la vista.
		alertify.confirm(
			'¿Deseas continuar con la agregación o modificación del item?',
			async () => {
				try {
					const response = await apiService.postInmueblePropietario(inmueble_propietario);
					if (response.status === 201) {
						alertify.success('Operación realizada correctamente');
						dispatch('fetchInmueblesPropietariosVista');
					} else {
						alertify.error('Se ha producido un error');
					}
				} catch (error) {
					console.error('Se ha producido un error:', error);
					alertify.error('Se ha producido un error.');
				}
			},
			() => {
				alertify.error('Acción cancelada.');
			}
		);
	},
	async eliminarInmueblePropietario({ commit }, inmueblePropietario) {
		alertify.confirm('Seguro que deseas eliminar este registro?',
			async () => {
				try {
					const response = await apiService.deleteInmueblePropietario(inmueblePropietario);
					if (response.status === 200) {
						alertify.success('Item eliminado correctamente');
						commit('deleteInmueblePropietario', inmueblePropietario); // Actualiza el estado
					} else {
						alertify.error('Error al eliminar el registro');
					}
				} catch (error) {
					console.error('Error al eliminar el registro:', error);
					alertify.error('Error al eliminar el registro.');
				}
			},
			() => {
				alertify.error('Acción cancelada.');
			}
		);
	},
};


const mutations = {
	setInmuebles: (state, inmuebles) => (state.inmuebles = inmuebles),

	setInmueblesContratos: (state, inmueblesContratos) => (state.informacionInmueblesContratos = inmueblesContratos),

	deleteInmueble: (state, inmuebleId) => {
		state.inmuebles = state.inmuebles.filter(inmueble => inmueble.id !== inmuebleId);
	},

	setInmueblesPropietarios: (state, inmueblesPropietarios) => (state.inmueblesPropietarios = inmueblesPropietarios),

	deleteInmueblePropietario: (state, inmueblePropietario) => {
		state.inmueblesPropietarios = state.inmueblesPropietarios.filter(inmProp =>
			!(Number(inmProp.id_inmueble) === Number(inmueblePropietario.id_inmueble) && Number(inmProp.id_propietario) === Number(inmueblePropietario.id_propietario))
		);
	}

};


export default {
	state,
	getters,
	actions,
	mutations,
};