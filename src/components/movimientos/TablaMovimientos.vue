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
    <NuevoMovimiento :dialog = "dialog" @update:dialog = "handleUpdateDialog" :itemProp = "itemSelected" @update:movimientos =
        "cargarDatos"/>
    <v-card>
      <v-card-title>
        <div class = "titulo">
          {{ titulo }}
        </div>
        <v-spacer></v-spacer>
        <v-btn v-if="esAdmin" color = "primary" dark class = "mb-2" @click = "nuevoItem">
          Nuevo
        </v-btn>
        <v-spacer></v-spacer>
        <v-btn v-if="esAdmin" color = "green" dark class = "mb-2" @click = "revisarMovPeriodicos">
          Revisar y Generar
        </v-btn>
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
              <td v-for="header in cabecera" :key="header.value">
                  {{ displayValue(item, header) }}
              </td>
              <td>
                <v-icon  small v-if="esAdmin" @click = "editarItem(item)" class = "iconos">
                  mdi-pencil
                </v-icon>
                <v-icon small v-if="esAdmin" @click = "eliminarItem(item)" class = "iconos">
                  mdi-delete
                </v-icon>
                <v-icon small @click = "printMov(item.id)" class = "iconos">
                  mdi-file-pdf-box
                </v-icon>
                <v-icon small @click = "drive(item.url_documento)" class = "iconos">
                  mdi-google-drive
                </v-icon>
                <v-icon small @click = "gmail(item.id)" class = "iconos">
                  mdi-gmail
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
import NuevoMovimiento from '../movimientos/NuevoMovimiento.vue';
import {formatCurrency} from '../../utils/utilidades';
import alertify from 'alertifyjs';

export default {
  components: {
    NuevoMovimiento
  }, props: {
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
    }, esAdmin() {
      return this.$store.state.rol === 'admin';
    },
  }, methods: {
    ...mapActions({
      fetchMovimientos: 'fetchMovimientos',
      eliminarMovimiento: 'eliminarMovimiento',
      mailMovimiento: 'mailMovimiento',
      imprimirMovimiento: 'imprimirMovimiento',
      revisarMovimientos: 'revisarMovimientos'
    }), formatCurrency(value) {
      return formatCurrency(value);
    }, displayValue(item, header) {
      // Maneja el formateo de la divisa en la tabla
      if (['total', 'pendiente_movimiento'].includes(header.value)) {
        return this.formatCurrency(item[header.value]);
      }
      // Demás campos:
      else {
        return item[header.value];
      }
    }, handleUpdateDialog(value) {
      this.dialog = value; // Actualiza la propiedad dialog cuando el hijo emite el evento update:dialog
    }, nuevoItem() {
      // Restablece el objeto itemSelected para un nuevo movimiento puntual o editar algunos campos de un movimiento
      this.itemSelected = {
        id: 0,
        fecha: '',
        tipo: 'ad hoc',
        id_contrato: '',
        descripcion: '',
        cantidad: '',
        pct_iva: 21,
        pct_retencion: 19,
      };
      this.dialog = true;
    }, editarItem(item) {
      // Establece itemSelected al contrato a editar y abre el diálogo
      this.itemSelected = {...item};
      this.dialog = true;
    }, eliminarItem(item) {
      this.eliminarMovimiento(item)
          .then(() => { //Manejamos los mensajes en la store
            this.cerrarDialogo();
            this.cargarDatos();
            this.$emit('delete:movimiento');
          })
          .catch(() => {
          });
    }, async revisarMovPeriodicos() {
      // Activar cursor de espera
      this.toggleCursorEspera(true);
      // Mostrar notificación de operación en curso
      alertify.notify('Revisando movimientos periódicos. Por favor espera...', 'message', 3);
      try {
        const response = await this.revisarMovimientos();
        if (response && response.data.status === 200) {
          // Mostrar éxito y configurar para desaparecer después de 5 segundos
          alertify.success(response.data.body, 5);
        } else {
          // Mostrar error y configurar para desaparecer después de 5 segundos
          alertify.error('Error al revisar movimientos.', 5);
        }
      } catch (error) {
        console.error('Error en la operación.', error);
        alertify.error('Error en la operación.', 5); // 5 segundos
      } finally {
        // Desactivar cursor de espera
        this.toggleCursorEspera(false);
      }
    }, sortBy(column) {
      if (this.sortColumn === column) {
        this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
      } else {
        this.sortColumn = column;
        this.sortOrder = 'asc';
      }
    }, drive(link){
      window.open(link, '_blank'); // Abre el enlace en una nueva pestaña
    }, async gmail(idMovimiento) {
      // Activar cursor de espera
      this.toggleCursorEspera(true);
      // Mostrar notificación de operación en curso
      alertify.notify('Preparando envío de e-mail. Por favor espera...', 'message', 3);
      try {
        const response = await this.mailMovimiento(idMovimiento);
        if (response && response.data.status === 200) {
          // Mostrar éxito y configurar para desaparecer después de 5 segundos
          alertify.success(response.data.body, 5);
        } else {
          // Mostrar error y configurar para desaparecer después de 5 segundos
          alertify.error('Error al enviar notificación.', 5);
        }
      } catch (error) {
        console.error('Error al enviar notificación.', error);
        alertify.error('Error al enviar notificación.', 5); // 5 segundos
      } finally {
        // Desactivar cursor de espera
        this.toggleCursorEspera(false);
      }
    }, async printMov(idMovimiento){
      // Activar cursor de espera
      this.toggleCursorEspera(true);
      // Mostrar notificación de operación en curso
      alertify.notify('Guardando movimiento en pdf. Por favor espera...', 'message', 3);
      try {
        const response = await this.imprimirMovimiento(idMovimiento);
        if (response && response.data.status === 200) {
          // Mostrar éxito y configurar para desaparecer después de 5 segundos
          alertify.success(response.data.body, 5);
        } else {
          // Mostrar error y configurar para desaparecer después de 5 segundos
          alertify.error('Error al guardar movimiento.', 5);
        }
      } catch (error) {
        console.error('Error: ', error);
        alertify.error('Se ha producido un error.', 5); // 5 segundos
      } finally {
        // Desactivar cursor de espera
        this.toggleCursorEspera(false);
        // No es necesario llamar a dismissAll ya que los mensajes se configuraron para desaparecer
      }
    }, toggleCursorEspera(espera) {
      if (espera) {
        document.body.classList.add('cursor-wait');
      } else {
        document.body.classList.remove('cursor-wait');
      }
    }, async cargarDatos() {
      try {
        await this.fetchMovimientos;
        this.movimientos = this.$store.getters.todosLosMovimientos;
        // Actualiza la propiedad movimientos con el resultado del getter
      } catch (error) {
        console.error("Error al cargar movimientos:", error);
      }
    }, cerrarDialogo() {
      this.dialog = false; // Esto cierra el diálogo modal
    },
  },
};
</script>

<style scoped>

@import "@/assets/styles/globalStyles.css";

</style>
