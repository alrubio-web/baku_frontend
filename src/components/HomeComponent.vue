<template>
  <v-container>
    <h1 class="text-center">Bienvenido a Baku Rental Manager</h1>
    <br>
    <h3 class="text-center">Tu gestor de alquileres de larga duración.</h3>
  </v-container>
  <v-container class="iconos_home" fill-height>
    <v-row justify="center" align="center" wrap>
      <v-col
          v-for="ruta in rutas"
          :key="ruta.nombre"
          cols="12"
          sm="6"
          md="6"
          class="text-center"
      >
        <router-link class="link" :to="ruta.ruta">
          <v-tooltip :text="ruta.text">
            <template v-slot:activator="{ props }">
              <v-icon
                  class="icono-link"
                  size="x-large"
                  :color="
                  ruta.nombre === 'Contratos' ? '#A05E18' :
                  ruta.nombre === 'Rentas' ? '#A05E18' :
                  ruta.nombre === 'Movimientos' ? '#A05E18' :
                  ruta.nombre === 'Abonos' ? '#A05E18' :
                  ruta.nombre === 'Mapa' ? '#0F49AA' :
                  ruta.nombre === 'Documentación' ? '#0F49AA' :
                  'blue darken-2'"
                  v-bind="props">{{ ruta.icon }}</v-icon>
            </template>
          </v-tooltip>
          <div>{{ ruta.nombre }}</div>
        </router-link>
      </v-col>
    </v-row>
  </v-container>
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

export default {
  data() {
    return {
      rutas: [
        {
          nombre: 'Contactos',
          ruta: '/contactos',
          icon: 'mdi-account-group',
          text: 'Gestiona los contactos.',
        },
        {
          nombre: 'Inquilinos',
          ruta: '/inquilinos',
          icon: 'mdi-account-details',
          text: 'Gestiona los inquilinos.',
        },
        {
          nombre: 'Inmuebles',
          ruta: '/inmuebles',
          icon: 'mdi-home-variant',
          text: 'Gestiona los inmuebles.',
        },
        {
          nombre: 'Propiedades',
          ruta: '/propiedades',
          icon: 'mdi-home-variant',
          text: 'Gestiona las propiedades.',
        },
        {
          nombre: 'Contratos',
          ruta: '/contratos',
          icon: 'mdi-file-sign',
          text: 'Gestiona los contratos.',
        },
        {
          nombre: 'Rentas',
          ruta: '/rentas',
          icon: 'mdi-cash-multiple',
          text: 'Gestiona las rentas.',
        },
        {
          nombre: 'Movimientos',
          ruta: '/movimientos',
          icon: 'mdi-account-cash',
          text: 'Gestiona los movimientos.',
        },
        {
          nombre: 'Abonos',
          ruta: '/abonos',
          icon: 'mdi-cash',
          text: 'Gestiona los abonos.',
        },
        {
          nombre: 'Mapa',
          ruta: '/mapa',
          icon: 'mdi-map-marker-multiple',
          text: 'Localiza y comprueba estatus de los inmuebles en el mapa.',
        },
        {
          nombre: 'Documentación',
          ruta: '/docu',
          icon: 'mdi-file-document',
          text: 'Información de la aplicación.',
        },
      ],
    };
  },
};
</script>

<style scoped>
.contenedor {
  height: 100%;
}
</style>
