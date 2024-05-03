<template>
  <v-container>
      <tabla :titulo="titulo" :cabecera="cabecera" :items="inmuebles" @update:inmuebles = "cargarDatos" @delete:inmueble = "cargarDatos"/>
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

import Tabla from '@/components/inmuebles/TablaInmuebles.vue';
import { mapActions } from 'vuex';

export default {
  components: {
    Tabla
  },
  data() {
    return {
      cabecera: [
        { text: 'Id', value: 'id', align: 'left', sortable: true },
        { text: 'Nombre Inmueble', value: 'nombre', align: 'left', sortable: true },
        { text: 'Tipo', value: 'tipo', align: 'left', sortable: true },
        { text: 'Descripción', value: 'descripcion', align: 'left', sortable: true },
        { text: 'Dirección', value: 'direccion', align: 'left', sortable: true },
        { text: 'Ref. Catastral', value: 'referencia_catastral', align: 'left', sortable: true },
        { text: 'F. Adquisición', value: 'fecha_adquisicion', align: 'left', sortable: true },
        { text: 'F. Transmisión', value: 'fecha_transmision', align: 'left', sortable: true },
        { text: 'Precio Amortización', value: 'precio_calculo_amoritzacion', align: 'left', sortable: true },
        { text: 'Precio Esc. Transmisión', value: 'precio_escriturado_transmision', align: 'left', sortable: true },
        { text: 'Valor Catastral Suelo', value: 'valor_catastral_suelo', align: 'left', sortable: true },
        { text: 'Valor Catastral', value: 'valor_catastral', align: 'left', sortable: true },
        { text: 'Notas', value: 'notas', align: 'left', sortable: true },
        { text: 'Tamaño m2', value: 'tamaño_m2', align: 'left', sortable: true },
        { text: 'TTL. Amortizaciones', value: 'total_amortizaciones', align: 'left', sortable: true },
        { text: 'Tipo Adquisición', value: 'tipo_adquisicion', align: 'left', sortable: true },
        { text: 'Tipo Transmisión', value: 'tipo_transmision', align: 'left', sortable: true },
        { text: 'Valor Catastral Construcción', value: 'valor_catastral_construccion', align: 'left', sortable: true },
        { text: 'Proporción Valor Construcción', value: 'proporcion_valor_construccion', align: 'left', sortable: true },
      ],
      inmuebles: [], // Define la propiedad inmuebles aquí
      titulo: "Inmuebles"
    };
  }, watch: {
    // Escucha el evento 'update:inmuebles' del componente NuevoInmueble y actualiza la tabla
    '$store.getters.todosLosInmuebles': {
      handler() {
        this.inmuebles = this.$store.getters.todosLosInmuebles;
      },
      deep: true
    },
    // Escuchar delete:inmueble y actualizar la tabla
    'delete:inmueble'(inmueble) {
      this.inmuebles = this.inmuebles.filter(item => item.id !== inmueble.id);
    }
  },
  methods: {
    ...mapActions({
      fetchInmuebles: 'fetchInmuebles',
    }),
    async cargarDatos() {
      try {
        await this.fetchInmuebles();
        this.inmuebles = this.$store.getters.todosLosInmuebles;
      } catch (error) {
        console.error("Error al cargar inmuebles:", error);
      }
    }
  },
  created() {
    this.cargarDatos();
  },
};
</script>
