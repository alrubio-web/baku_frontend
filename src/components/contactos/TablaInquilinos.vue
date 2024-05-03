<template>
  <v-container>
    <v-text-field
        class="busqueda"
        v-model = "search"
        append-icon = "mdi-magnify"
        label = "Búsqueda"
        single-line
        hide-details
    ></v-text-field>
    <br>
    <v-card>
      <v-card-title>
        <div class = "titulo">
          {{ titulo }}
        </div>
        <v-spacer></v-spacer>
      </v-card-title>
      <!-- Tabla HTML estándar -->
      <div class = "contenedor-tabla">
        <table class = "tabla-estilo-personalizado">
          <thead>
            <tr>
              <th v-for = "header in cabecera" :key = "header.text" @click="sortBy(header.value)" class="sortable-header">
                {{ header.text }}
              </th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for = "item in filteredItems" :key = "item.id">
              <td v-for = "header in cabecera" :key = "header.value">
                {{ displayValue(item, header) }}
              </td>
              <td>
                <v-icon small @click="whatsapp(item.id)" class = "iconos">
                  mdi-whatsapp
                </v-icon>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </v-card>
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

import {mapActions} from 'vuex';
import {formatCurrency} from "@/utils/utilidades";

export default {
  props: {
    titulo: String, cabecera: Array, items: Array
  }, data() {
    return {
      search: '',
      dialog: false,
      itemSelected: {},
      sortColumn: '', // La columna actual por la que se ordena
      sortOrder: 'asc', // La dirección de la ordenación ('asc' o 'desc')
      localItems: []
    };
  }, watch: {
    items: {
      handler(newItems) {
        this.localItems = [...newItems];
      },
      deep: true,
      immediate: true,
    }
  }, computed: {
    filteredItems() {
      let items = [...this.localItems]; // Trabaja con una copia para evitar mutaciones
      if (this.search) {
        const searchLower = this.search.toLowerCase();
        items = items.filter(item => Object.values(item).some(value => value !== null && value.toString().toLowerCase().includes(searchLower)));
      }
      if (this.sortColumn) {
        items.sort((a, b) => {
          let comparison = 0;
          if (a[this.sortColumn] > b[this.sortColumn]) {
            comparison = 1;
          } else if (a[this.sortColumn] < b[this.sortColumn]) {
            comparison = -1;
          }
          return this.sortOrder === 'asc' ? comparison : comparison * -1;
        });
      }
      return items;
    },
  },  methods: {
    ...mapActions({
      fetchInquilinos: 'fetchInquilinos', estatusInquilino: 'estatusInquilino'
    }), handleUpdateDialog(value) {
      this.dialog = value; // Actualiza la propiedad dialog cuando el hijo emite el evento update:dialog
    }, formatCurrency(value) {
      return formatCurrency(value);
    }, displayValue(item, header) {
      // Maneja el formateo de la divisa en la tabla
      if (['saldo'].includes(header.value)) {
        return this.formatCurrency(item[header.value]);
      } else {
        return item[header.value];
      }
    }, sortBy(column) {
      if (this.sortColumn === column) {
        this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
      } else {
        this.sortColumn = column;
        this.sortOrder = 'asc';
      }
    },  async cargarDatos() {
      try {
        await this.fetchInquilinos();
        this.inquilinos = this.$store.getters.todosLosInquilinos // Actualiza la propiedad inquilinos con el resultado del getter
      } catch (error) {
        console.error("Error al cargar inquilinos:", error);
      }
    }, whatsapp(id) {
      this.estatusInquilino(id);
    },
  },
};
</script>

<style scoped>

@import "@/assets/styles/globalStyles.css";

</style>
