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

import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import store from './store/vuex.js';

import 'alertifyjs/build/css/alertify.css'; // Importa el CSS básico de AlertifyJS
import 'alertifyjs/build/css/themes/default.css'; // Importa el tema por defecto
import '@mdi/font/css/materialdesignicons.css'

//Vuetify
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import './assets/styles/globalStyles.css';

const vuetify = createVuetify({
	components,
	directives,
})

const app = createApp(App);

app.use(router);
app.use(store);
app.use(vuetify);

store.dispatch('initAuth');

app.mount('#app');

