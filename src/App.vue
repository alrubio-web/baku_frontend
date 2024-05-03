<template>
  <v-app>
    <v-app-bar app color="primary" dark>
      <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
      <v-btn icon @click="navegar('Home')">
        <v-icon>mdi-home</v-icon>
      </v-btn>
      <v-toolbar-title class="toolbar-title-mobile">Baku Rental Manager</v-toolbar-title>
      <template v-if="usuario">
        Usuario: {{ usuario }}
        <v-btn @click="logout">Cerrar Sesión</v-btn>
      </template>
    </v-app-bar>
    <v-navigation-drawer v-model="drawer" app>
      <v-list>
        <v-list-item v-for="ruta in rutas" :key="ruta.nombre" @click="navegar(ruta.ruta)">
          <v-list-item-title>{{ ruta.nombre }}</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-img :style="logoStyle"><v-container class="contenido"><router-view/></v-container></v-img>
    <footer class="footer">
      <div>{{ new Date().getFullYear() }} — <v-icon>mdi-copyright</v-icon><strong>Baku</strong></div>
    </footer>
  </v-app>
</template>

<script>
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

import { mapGetters, mapActions } from 'vuex';

export default {
  name: 'App',
  data() {
    return {
      drawer: false, // Define la propiedad 'drawer' aquí
      logoPath: require('@/assets/logo_completo.png'),
      rutas: [
        { nombre: 'Home', ruta: '/home' },
        { nombre: 'Contactos', ruta: '/contactos' },
        { nombre: 'Inquilinos', ruta: '/inquilinos' },
        { nombre: 'Inmuebles', ruta: '/inmuebles' },
        { nombre: 'Propiedades', ruta: '/propiedades' },
        { nombre: 'Contratos', ruta: '/contratos' },
        { nombre: 'Rentas', ruta: '/rentas' },
        { nombre: 'Movimientos', ruta: '/movimientos' },
        { nombre: 'Mapa', ruta: '/mapa' },
        { nombre: 'Documentación', ruta: '/docu' },
      ],
    };
  },
  methods: {
    ...mapActions({ performLogout: 'logout' }),
    navegar(ruta) {
      this.drawer = false; // Cierra el menú de navegación después de la navegación
      this.$router.push(ruta);
    },
    logout() {
      this.performLogout().then(() => {
        this.drawer = false; // Nos aseguramos de cerrar el menú si también está abierto
        this.$router.push('/');
      });
    }
  },
  created() {
    this.$store.dispatch('initAuth');
  },
  computed: {
    ...mapGetters(['usuarioActual']),
    usuario() {
      return this.usuarioActual;
    },
    logoStyle() {
      return {
        background: `url(${this.logoPath}) no-repeat right top`,
        //Definimos estilo como fondo para que no condicione la posición de los demás elementos
        backgroundSize: '30vh',
        marginTop: '60px'
      };
    },
  }
};
</script>

<style scoped>
@import "@/assets/styles/globalStyles.css";

</style>

