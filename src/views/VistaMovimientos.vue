<template>
  <v-container>
      <tabla :titulo="titulo" :cabecera="cabecera" :items="movimientos" @update:movimientos = "cargarDatos" @delete:movimiento = "cargarDatos"/>
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

import Tabla from '@/components/movimientos/TablaMovimientos.vue';
import { mapActions } from 'vuex';

export default {
  components: {
    Tabla
  },
  data() {
    return {
      cabecera: [
        { text: 'Id de Movimiento', value: 'id', align: 'left', sortable: true },
        { text: 'Contrato', value: 'nombre_contrato', align: 'left', sortable: true },
        { text: 'Inquilino', value: 'nombre_inquilino', align: 'left', sortable: true },
        { text: 'Arrendador', value: 'nombre_propietario', align: 'left', sortable: true },
        { text: 'Fecha', value: 'fecha', align: 'left', sortable: true },
        { text: 'Tipo', value: 'tipo', align: 'left', sortable: true },
        { text: 'Descripción', value: 'descripcion', align: 'left', sortable: true },
        { text: 'Estado', value: 'estado', align: 'left', sortable: true },
        { text: 'Importe', value: 'total', align: 'left', sortable: true },
        { text: 'Importe Pendiente', value: 'pendiente_movimiento', align: 'left', sortable: true },
      ],
      movimientos: [], // Define la propiedad movimientos
      titulo: "Movimientos"
    };
  }, watch: {
    // Escucha el evento 'update:movimientos' y actualiza la tabla
    '$store.getters.todosLosMovimientos': {
      handler() {
        this.movimientos = this.$store.getters.todosLosMovimientos;
      },
      deep: true
    },
    // Escuchar delete:contrato y actualizar la tabla
    'delete:movimiento'(movimiento) {
      this.movimientos = this.movimientos.filter(item => {
        // Filtrar por id
        return item.id !== movimiento.id
      });
      this.cargarDatos();
    }
  },
  methods: {
    ...mapActions({
      fetchMovimientos: 'fetchMovimientos'
    }),
    async cargarDatos() {
      try {
        await this.fetchMovimientos();
        this.movimientos = this.$store.getters.todosLosMovimientos
      } catch (error) {
        console.error("Error al cargar movimientos:", error);
      }
    }
  },
  created() {
    this.cargarDatos();
  },
};
</script>
