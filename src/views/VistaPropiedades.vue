<template>
  <v-container>
      <tabla :titulo="titulo" :cabecera="cabecera" :items="inmueblesPropietarios" @update:inmuebles_propietarios = "cargarDatos" @delete:inmueble_propietario
          = "cargarDatos"/>
    <v-btn color="primary" @click="cargarDatos">Actualizar Lista</v-btn>
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

import Tabla from '@/components/inmuebles/TablaPropiedades.vue';
import { mapActions } from 'vuex';

export default {
  components: {
    Tabla
  },
  data() {
    return {
      cabecera: [
        { text: 'Nombre de Propietario', value: 'nombre_propietario', align: 'left', sortable: true },
        { text: 'Nombre de Inmueble', value: 'nombre_inmueble', align: 'left', sortable: true },
        { text: 'Id de Inmueble', value: 'id_inmueble', align: 'left', sortable: true },
        { text: 'Id de Propietario', value: 'id_propietario', align: 'left', sortable: true },
        { text: 'Porcentaje de Propiedad', value: 'propiedad', align: 'left', sortable: true },
      ],
      inmueblesPropietarios: [], // Define la propiedad inmueblesPropietarios
      titulo: "Propiedades"
    };
  }, watch: {
    // Escucha el evento 'update:inmuebles_propietarios' del componente NuevaPropiedad y actualiza la tabla
    '$store.getters.todosLosInmueblesPropietarios': {
      handler() {
        this.inmueblesPropietarios = this.$store.getters.todosLosInmueblesPropietarios;
      },
      deep: true
    },
    // Escuchar delete:inmueble_propietario y actualizar la tabla
    'delete:inmueble_propietario'(inmueblePropietario) {
      this.inmueblesPropietarios = this.inmueblesPropietarios.filter(item => {
        // Filtrar por id_inmueble e id_propietario
        return item.id_inmueble !== inmueblePropietario.id_inmueble &&
            item.id_propietario !== inmueblePropietario.id_propietario;
      });
      this.cargarDatos();
    }
  },
  methods: {
    ...mapActions({
      fetchInmueblesPropietarios: 'fetchInmueblesPropietariosVista',
    }),
    async cargarDatos() {
      try {
        await this.fetchInmueblesPropietarios;
        this.inmueblesPropietarios = this.$store.getters.todosLosInmueblesPropietarios
      } catch (error) {
        console.error("Error al cargar propiedadaes:", error);
      }
    }
  },
  created() {
    this.cargarDatos();
  },
};
</script>
