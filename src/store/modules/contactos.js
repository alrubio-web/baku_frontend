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

const state = {
	contactos: [],
	inquilinos: []
};

const getters = {
	todosLosContactos: state => state.contactos,
	todosLosInquilinos: state => state.inquilinos,
};

const actions = {
	async fetchContactos({ commit }) {
		try {
			const response = await apiService.getContactos();
			commit('setContactos', response.data.body);
		} catch (error) {
			console.error('Error al obtener contactos:', error);
		}
	},
	async agregarContacto({ dispatch }, contacto) {
		alertify.confirm(
			contacto.id === 0 ? 'Deseas agregar item?' : 'Deseas editar item?',
			async () => {
				try {
					const response = await apiService.postContacto(contacto);
					if (response.status === 201) {
						alertify.success(contacto.id === 0 ? 'Item agregado correctamente' : 'Item actualizado correctamente');
						dispatch('fetchContactos');
					} else {
						alertify.error('Error al agregar el contacto');
					}
				} catch (error) {
					console.error('Error al agregar contacto:', error);
					alertify.error('Error al agregar contacto.'); // Mensaje de error
				}
			},
			() => {
				alertify.error('Acción cancelada.');
			}
		);
	},
	async eliminarContacto({ commit }, contactoId) {
		alertify.confirm('Seguro que deseas eliminar el contacto?',
			async () => {
				try {
					const id = Number(contactoId);
					const response = await apiService.deleteContacto(id);
					if (response.status === 200) {
						alertify.success('Item eliminado correctamente');
						commit('deleteContacto', id); // Actualiza el estado
					} else {
						alertify.error('Error al eliminar el contacto');
					}
				} catch (error) {
					console.error('Error al agregar contacto:', error);
					alertify.error('Error al eliminar contacto.'); // Mensaje de error
				}
			},
			() => {
				alertify.error('Acción cancelada.');
			}
		);
	},
	async fetchInquilinos({ commit }) {
		try {
			const response = await apiService.getInquilinos();
			commit('setInquilinos', response.data.body);
		} catch (error) {
			console.error('Error al obtener contactos:', error);
		}
	},
	async estatusInquilino({ dispatch }, contactoId) {
		alertify.confirm('¿Seguro que deseas enviar notificación?',
			async () => {
				try {
					const response = await apiService.postEstatusInquilinoWhatsapp(contactoId);
					dispatch('fetchInquilinos');
					if (response.data.status === 200) {
						alertify.success('Continúa a enlace de whatsapp para enviar notificación.');
						const whatsappLink = response.data.body;
						window.open(whatsappLink, '_blank'); // Abre el enlace en una nueva pestaña
					} else {
						alertify.error('Error al enviar notificación.');
					}
				} catch (error) {
					console.error('Error al enviar notificación:', error);
					alertify.error('Error al enviar notificación.'); // Mensaje de error
				}
			},
			() => {
				alertify.error('Acción cancelada.');
			}
		);
	},

};


const mutations = {
	setContactos: (state, contactos) => (state.contactos = contactos),

	setInquilinos: (state, inquilinos) => (state.inquilinos = inquilinos),

	deleteContacto: (state, contactoId) => {
		state.contactos = state.contactos.filter(contacto => contacto.id !== contactoId);
	}
};


export default {
	state,
	getters,
	actions,
	mutations,
};
