<template>
  <v-container>
      <tabla :titulo="titulo" :cabecera="cabecera" :items="contratosVista" @update:contratos = "cargarDatos" @delete:contrato = "cargarDatos"/>
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

import Tabla from '@/components/contratos/TablaContratos.vue';
import { mapActions } from 'vuex';

export default {
  components: {
    Tabla
  },
  data() {
    return {
      cabecera: [
        { text: 'Id de Contrato', value: 'id', align: 'left', sortable: true },
        { text: 'Nombre de Contrato', value: 'nombre', align: 'left', sortable: true },
        { text: 'Nombre de Inmueble', value: 'nombre_inmueble', align: 'left', sortable: true },
        { text: 'Arrendador', value: 'nombre_arrendador', align: 'left', sortable: true },
        { text: 'Inquilino', value: 'nombre_inquilino', align: 'left', sortable: true },
        { text: 'Estado del Contrato', value: 'estado', align: 'left', sortable: true },
        { text: 'Saldo de Contrato', value: 'saldo', align: 'left', sortable: true },
        { text: 'Inicio Contrato', value: 'fecha_inicio', align: 'left', sortable: true },
        { text: 'Fin Contrato', value: 'fecha_fin', align: 'left', sortable: true },
        { text: 'Deducción Fiscal', value: 'deduccion_fiscal', align: 'left', sortable: true },
        { text: 'Fianza', value: 'fianza', align: 'left', sortable: true },
        { text: 'Renta Actual Contrato', value: 'renta', align: 'left', sortable: true },
        { text: 'Estado Contrato', value: 'estado', align: 'left', sortable: true },
        { text: 'Forma de Pago', value: 'tipo_pago', align: 'left', sortable: true },
        { text: 'IRPF', value: 'sujeto_a_IRPF', align: 'left', sortable: true },
        { text: 'Anotaciones', value: 'notas', align: 'left', sortable: true },
      ],
      contratosVista: [], // Define la propiedad contratos
      titulo: "Contratos"
    };
  }, watch: {
    // Escucha el evento 'update:contratos' del componente NuevoContrato y actualiza la tabla
    '$store.getters.todosLosContratosVista': {
      handler() {
        this.contratosVista = this.$store.getters.todosLosContratosVista;
      },
      deep: true
    },
    // Escuchar delete:contrato y actualizar la tabla
    'delete:contrato'(contrato) {
      this.contratos = this.contratos.filter(item => {
        // Filtrar por id
        return item.id !== contrato.id
      });
      this.cargarDatos();
    }
  },
  methods: {
    ...mapActions({
      fetchVistaContratos: 'fetchVistaContratos'
    }),
    async cargarDatos() {
      try {
        await this.fetchVistaContratos();
        this.contratosVista = this.$store.getters.todosLosContratosVista
      } catch (error) {
        console.error("Error al cargar contratos:", error);
      }
    }
  },
  created() {
    this.cargarDatos();
  },
};
</script>
