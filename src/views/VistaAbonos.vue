<template>
  <v-container>
      <tabla :titulo="titulo" :cabecera="cabecera" :items="abonos" @update:abonos = "cargarDatos" @delete:abono
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

import Tabla from '@/components/abonos/TablaAbonos.vue';
import { mapActions } from 'vuex';

export default {
  components: {
    Tabla
  },
  data() {
    return {
      cabecera: [
        { text: 'Id del Abono', value: 'abono_id', align: 'left', sortable: true },
        { text: 'Id del Movimiento', value: 'id_movimiento', align: 'left', sortable: true },
        { text: 'Contrato', value: 'nombre_contrato', align: 'left', sortable: true },
        { text: 'Propietario', value: 'nombre_propietario', align: 'left', sortable: true },
        { text: 'Inquilino', value: 'nombre_inquilino', align: 'left', sortable: true },
        { text: 'Fecha del Abono', value: 'abono_fecha', align: 'left', sortable: true },
        { text: 'Fecha del Movimiento', value: 'movimiento_fecha', align: 'left', sortable: true },
        { text: 'Cantidad Abonada', value: 'abonado', align: 'left', sortable: true },
        { text: 'Total movimiento', value: 'movimiento_total', align: 'left', sortable: true },
        { text: 'Descripción', value: 'abono_descripcion', align: 'left', sortable: true },
      ],
      abonos: [], // Define la propiedad abonos
      titulo: "Abonos"
    };
  }, watch: {
    // Escucha el evento 'update:inmuebles_propietarios' del componente NuevoAbono y actualiza la tabla
    '$store.getters.todosLosAbonos': {
      handler() {
        this.abonos = this.$store.getters.todosLosAbonos;
      },
      deep: true
    },
    // Escuchar delete:abono y actualizar la tabla
    'delete:abono'(abono) {
      this.abonos = this.abonos.filter(item => item.abono_id !== abono.abono_id);
      this.cargarDatos();
    }
  },
  methods: {
    ...mapActions({
      fetchAbonos: 'fetchAbonos',
    }),
    async cargarDatos() {
      try {
        await this.fetchAbonos();
        this.abonos = this.$store.getters.todosLosAbonos
      } catch (error) {
        console.error("Error al cargar abonos:", error);
      }
    }
  },
  created() {
    this.cargarDatos();
  },
};
</script>
