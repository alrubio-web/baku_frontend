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

import { createStore } from 'vuex';
import contactos from './modules/contactos';
import inmuebles from './modules/inmuebles';
import contratos from './modules/contratos';
import  movimientos from './modules/movimientos';
import  abonos from './modules/abonos';
import apiService from '@/services/apiService';
import router from '@/router';

const store = createStore({
	modules: {
		contactos,
		inmuebles,
		contratos,
		movimientos,
		abonos
	},
	state: {
		usuario: null,
		rol: null,
		token: null,
		tokenGoogle: null,
	},
	mutations: {
		SET_USUARIO(state, { usuario, rol }) {
			state.usuario = usuario;
			state.rol = rol;
			// Guardar en localStorage
			localStorage.setItem('usuario', JSON.stringify(usuario));
			localStorage.setItem('rol', rol);
		},
		SET_TOKEN(state, token) {
			state.token = token;
			localStorage.setItem('token', token);
		},
		SET_TOKEN_GOOGLE(state, tokenGoogle) {
			state.tokenGoogle = tokenGoogle;
			localStorage.setItem('tokenGoogle', tokenGoogle);
		},
		LOGOUT(state) {
			state.usuario = null;
			state.rol = null;
			state.token = null;
			state.tokenGoogle = null;
			localStorage.removeItem('usuario');
			localStorage.removeItem('rol');
			localStorage.removeItem('token');
			localStorage.removeItem('tokenGoogle');
		},
		SET_AUTHENTICATED(state, isAuthenticated) {
			state.isAuthenticated = isAuthenticated;
		},
	},
	actions: {
		async initAuth({ commit, getters }) {
			try {
				const response = await apiService.verifySession();
				if (response.data.isAuthenticated) {
					const userName = getters.getCookie('userName');
					const userRol = getters.getCookie('userRol');
					commit('SET_USUARIO', { usuario: decodeURIComponent(userName), rol: decodeURIComponent(userRol) });
					commit('SET_AUTHENTICATED', true);

					// Redirecciona al usuario a la página de inicio
					router.push('/home');

				} else {
					commit('LOGOUT');
					// En caso de error, redirige al usuario a la página de login
					router.push('/');
				}
			} catch (error) {
				console.error('Error verificando la sesión:', error);
				commit('LOGOUT');
			}
		},
		async logout({ commit }) {
			try {
				// Llama al backend para cerrar sesión allí también
				await apiService.logout();

				// Limpia el estado y el localStorage
				commit('LOGOUT'); // Llama a la mutación LOGOUT para limpiar el estado

			} catch (error) {
				console.error('Error during logout:', error);
				commit('LOGOUT'); // Asegúrate de limpiar el estado incluso si hay un error
			}
		},
	},
	getters: {
		isAuthenticated(state) {
			return state.isAuthenticated;
		},
		usuarioActual(state) {
			return state.usuario;
		},
		getCookie: () => (name) => {
			const value = `; ${document.cookie}`;
			const parts = value.split(`; ${name}=`);
			if (parts.length === 2) return parts.pop().split(';').shift();
		},
	}
});

export default store;
