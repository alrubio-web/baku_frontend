<template>
  <v-container>
    <mapa :titulo="titulo" :items="inmueblesContratos"/>
    <div class="leyenda">
      <h4>Leyenda</h4>
      <ul>
        <li><img src="http://maps.google.com/mapfiles/ms/icons/red-dot.png" alt="Saldo Negativo"> Saldo negativo de contrato</li>
        <li><img src="http://maps.google.com/mapfiles/ms/icons/green-dot.png" alt="Disponible"> Inmueble disponible</li>
        <li><img src="http://maps.google.com/mapfiles/ms/icons/blue-dot.png" alt="Alquilado con saldo positivo"> Inmueble alquilado con saldo positivo</li>
      </ul>
    </div>
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

import Mapa from '@/components/inmuebles/MapaInmuebles.vue';
import { mapActions } from 'vuex';

export default {
  components: {
    Mapa
  },
  data() {
    return {
      inmueblesContratos: [], // Define la propiedad inmuebles aquí
      titulo: "Mapa de Inmuebles",
    };
  },
  methods: {
    ...mapActions({
      fetchInmueblesContratos: 'fetchInmueblesContratos',
    }),
    async cargarDatos() {
      try {
        await this.fetchInmueblesContratos();
        this.inmueblesContratos = this.$store.getters.todosLosInmueblesContratos;
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

<style scoped>
@import "@/assets/styles/globalStyles.css";
</style>
