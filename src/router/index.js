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

import { createRouter, createWebHistory } from 'vue-router'
import store from '../store/vuex.js';
import LoginView from '@/views/VistaLogin.vue';
import HomeComponent from "@/components/HomeComponent.vue";
import DocuComponent from "@/components/DocuComponent.vue";
import ModelComponent from "@/components/ModelComponent.vue";
import Contactos from '@/views/VistaContactos.vue';
import Inquilinos from '@/views/VistaInquilinos.vue';
import Inmuebles from "@/views/VistaInmuebles.vue";
import Propiedades from "@/views/VistaPropiedades.vue";
import Contratos from "@/views/VistaContratos.vue";
import Rentas from "@/views/VistaRentas.vue";
import Movimientos from "@/views/VistaMovimientos.vue";
import Abonos from "@/views/VistaAbonos.vue";
import Mapa from "@/views/VistaMapa.vue";

const routes = [
  {
    path: '/',
    name: 'Login',
    component: LoginView,
    meta: { title: 'Login - Baku' }
  },
  {
    path: '/home',
    name: 'Home',
    component: HomeComponent,
    meta: { requiresAuth: true, title:  'Home - Baku'  },
  },
  {
    path: '/mapa',
    name: 'Mapa',
    component: Mapa,
    meta: { requiresAuth: true, title:  'Mapa - Baku'  },
  },
  {
    path: '/contactos',
    name: 'ConsultarContactos',
    component: Contactos,
    meta: { requiresAuth: true, title:  'Contactos - Baku' }
  },
  {
    path: '/inquilinos',
    name: 'ConsultarInquilinos',
    component: Inquilinos,
    meta: { requiresAuth: true, title:  'Inquilinos - Baku' }
  },
  {
    path: '/inmuebles',
    name: 'ConsultarInmuebles',
    component: Inmuebles,
    meta: { requiresAuth: true, title:  'Inmuebles - Baku' }
  },
  {
    path: '/propiedades',
    name: 'ConsultarPropiedades',
    component: Propiedades,
    meta: { requiresAuth: true, title:  'Propiedades - Baku' }
  },
  {
    path: '/contratos',
    name: 'ConsultarContratos',
    component: Contratos,
    meta: { requiresAuth: true, title:  'Contratos - Baku' }
  },
  {
    path: '/rentas',
    name: 'ConsultarRentas',
    component: Rentas,
    meta: { requiresAuth: true, title:  'Rentas - Baku' }
  },
  {
    path: '/movimientos',
    name: 'ConsultarMovimientos',
    component: Movimientos,
    meta: { requiresAuth: true, title:  'Movimientos - Baku' }
  },
  {
    path: '/abonos',
    name: 'ConsultarAbonos',
    component: Abonos,
    meta: { requiresAuth: true, title:  'Abonos - Baku' }
  },
  {
    path: '/docu',
    name: 'Documentación',
    component: DocuComponent,
    meta: { requiresAuth: true, title:  'Docu - Baku'  },
  },
  {
    path: '/model',
    name: 'Modelo de Datos',
    component: ModelComponent,
    meta: { requiresAuth: true, title:  'Modelo - Baku'  },
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});


router.beforeEach((to, from, next) => {
  document.title = to.meta.title || 'Baku Rental Manager';
  // Comprueba si la ruta requiere autenticación y si el usuario no está autenticado
  if (to.matched.some(record => record.meta.requiresAuth) && !store.getters.isAuthenticated) {
    // Redirige al usuario a login
    next({ path: '/' });
  } else {
    // Si no necesita autenticación o si el usuario está autenticado, continúa con la ruta
    next();
  }
});

export default router;
