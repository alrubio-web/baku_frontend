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
	contratos: [],
	contratosVista: [],
	medidasContratos: [],
	rentas: []
};

const getters = {
	todosLosContratos: state => state.contratos,
	todosLosContratosVista: state => state.contratosVista,
	todasLasMedidasContratos: state => state.medidasContratos,
};

const actions = {
	async fetchContratos({ commit }) {
		try {
			const response = await apiService.getContratos();
			// Convertir las fechas de cada inmueble
			const contratosConFechasConvertidas = response.data.body.map(contrato =>
				utilidades.convertirFechas(contrato)
			);
			commit('setContratos', contratosConFechasConvertidas);
		} catch (error) {
			console.error('Error al obtener contratos:', error);
		}
	},
	async fetchVistaContratos({ commit }) {
		try {
			const response = await apiService.getVistaContratos();
			// Convertir las fechas de cada inmueble
			const contratosConFechasConvertidas = response.data.body.map(contrato =>
				utilidades.convertirFechas(contrato)
			);
			commit('setContratosVista', contratosConFechasConvertidas);
		} catch (error) {
			console.error('Error al obtener contratos:', error);
		}
	},
	async agregarContrato({ dispatch }, contrato) {
		try {
			const response = await apiService.postContrato(contrato);
			// Mostrar notificación de operación en curso
			if (response.status === 201) {
				dispatch('fetchContratos');
				dispatch('fetchVistaContratos');
				return response;
			} else {
				console.error('Error al agregar el contrato');
			}
		} catch (error) {
			console.error('Error al agregar contrato:', error);
		}
	},


	async eliminarContrato({ dispatch }, { commit }, ContratoId) {
		alertify.confirm('Seguro que deseas eliminar el contrato?',
			async () => {
				try {
					const id = Number(ContratoId);
					const response = await apiService.deleteContrato(id);
					if (response.status === 200) {
						alertify.success('Item eliminado correctamente');
						commit('deleteContrato', id); // Actualiza el estado
						dispatch('fetchContratos');
						dispatch('fetchVistaContratos');
					} else {
						alertify.error('Error al eliminar el contrato');
					}
				} catch (error) {
					console.error('Error al eliminar contrato:', error);
					alertify.error('Error al eliminar contrato.'); // Mensaje de error
				}
			},
			() => {
				alertify.error('Acción cancelada.');
			}
		);
	},
	async eliminarContratoCompleto({ commit }, ContratoId) {
		alertify.confirm('<div><span class="alertify-text-red-bold">¡Atención! Esta operación es irreversible</span> y si' +
			' pulsas <span class="alertify-text-red-bold">"ok"</span> se eliminarán' +
			' todos los registros de abonos, movimientos y' +
			' rentas asociados, además del propio contrato. <span class="alertify-text-red-bold">¿Seguro que' +
			' deseas continuar?</span></div>',
			async () => {
				try {
					const id = Number(ContratoId);
					const response = await apiService.deleteContratoCompleto(id);
					if (response.status === 200) {
						alertify.success('Contrato y registros asociados eliminados correctamente');
						commit('deleteContrato', id); // Actualiza el estado
					} else {
						alertify.error('Error al eliminar el contrato');
					}
				} catch (error) {
					console.error('Error al eliminar contrato:', error);
					alertify.error('Error al eliminar contrato.'); // Mensaje de error
				}
			},
			() => {
				alertify.error('Acción cancelada.');
			}
		);
	},

	async fetchMedidasContratos({ commit }) { // vista con info rentas y contratos
		try {
			const response = await apiService.getMedidasContratos();
			const medidasConFechasConvertidas = response.data.body.map(item =>
				utilidades.convertirFechas(item)
			);

			commit('setMedidasContratos', medidasConFechasConvertidas);
		} catch (error) {
			console.error('Error al obtener medidas_contratos:', error);
		}
	},

	async fetchRentas({ commit }) {
		try {
			const response = await apiService.getRentas();
			const rentasConFechasConvertidas = response.data.body.map(item =>
				utilidades.convertirFechas(item)
			);
			commit('setRentas', rentasConFechasConvertidas);
		} catch (error) {
			console.error('Error al obtener rentas:', error);
		}
	},
	async agregarRenta({ dispatch }, renta) {
		alertify.confirm(
			'Estás a punto de editar o crear una renta, ¿deseas continuar?',
			async () => {
				try {
					const response = await apiService.postRenta(renta);
					if (response.status === 201) {
						alertify.success('Operación completada correctamente.');
						dispatch('fetchRentas');
					} else {
						alertify.error('Error en la operación');
					}
				} catch (error) {
					console.error('Error al editar/agregar renta:', error);
					alertify.error('Error al editar o crear renta.'); // Mensaje de error
				}
			},
			() => {
				alertify.error('Acción cancelada.');
			}
		);
	},
};


const mutations = {
	setContratos: (state, contratos) => (state.contratos = contratos),

	setContratosVista: (state, contratosVista) => (state.contratosVista = contratosVista),

	deleteContrato: (state, contratoId) => {
		state.contratos = state.contratos.filter(contrato => contrato.id !== contratoId);
		state.contratosVista = state.contratosVista.filter(contrato => contrato.id !== contratoId);
	},

	setMedidasContratos: (state, medidasContratos) => (state.medidasContratos = medidasContratos),

	setRentas: (state, rentas) => (state.rentas = rentas),

};


export default {
	state,
	getters,
	actions,
	mutations,
};