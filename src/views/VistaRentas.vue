<template>
  <v-container>
      <tabla :titulo="titulo" :cabecera="cabecera" :items="rentasVista" @update:rentas = "cargarDatos" @delete:renta = "cargarDatos"/>
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

import Tabla from '@/components/contratos/TablaRentas.vue';
import { mapActions } from 'vuex';

export default {
  components: {
    Tabla
  },
  data() {
    return {
      cabecera: [
        { text: 'Id de Contrato', value: 'id_contrato', align: 'left', sortable: true },
        { text: 'Nombre de Contrato', value: 'nombre_contrato', align: 'left', sortable: true },
        { text: 'Fecha Inicial', value: 'fecha_renta_inicial', align: 'left', sortable: true },
        { text: 'Renta Inicial', value: 'renta_inicial', align: 'left', sortable: true },
        { text: 'Fecha Anterior', value: 'fecha_renta_anterior', align: 'left', sortable: true },
        { text: 'Renta Anterior', value: 'renta_anterior', align: 'left', sortable: true },
        { text: 'Fecha Actual', value: 'fecha', align: 'left', sortable: true },
        { text: 'Renta Actual', value: 'renta', align: 'left', sortable: true },
        { text: 'Tipo Actualización de Renta', value: 'tipo_actualizacion', align: 'left', sortable: true },
        { text: 'Últ. %Valor IPC', value: 'ipc', align: 'left', sortable: true },
        { text: 'Últ. %Tasa de Variación', value: 'tasa_variacion', align: 'left', sortable: true },
        { text: '%Var. vs Renta Anterior', value: 'variacion_porcentual_renta', align: 'left', sortable: true },
      ],
      rentasVista: [], // Define la propiedad rentasVista
      titulo: "Rentas"
    };
  }, watch: {
    // Escucha el evento 'update:contratos' del componente NuevoContrato y actualiza la tabla
    '$store.getters.todosLosContratosVista': {
      handler() {
        this.rentasVista = this.$store.getters.todasLasMedidasContratos;
      },
      deep: true
    },
    // Escuchar delete:renta y actualizar la tabla
    'delete:renta'(renta) {
      this.rentasVista = this.rentasVista.filter(item => {
        return !(Number(item.id) === Number(renta.id) && item.fecha === renta.fecha)
      });
      this.cargarDatos();
    }
  },
  methods: {
    ...mapActions({
      fetchMedidasContratos: 'fetchMedidasContratos'
    }),
    async cargarDatos() {
      try {
        await this.fetchMedidasContratos();
        this.rentasVista = this.$store.getters.todasLasMedidasContratos
      } catch (error) {
        console.error("Error al cargar las rentas:", error);
      }
    }
  },
  created() {
    this.cargarDatos();
  },
};
</script>
