<template>
  <div>
    <v-row justify = "center">
      <v-dialog v-model = "localDialog" @click:outside="cerrarDialogo">
        <v-card>
          <v-card-title>
            <span class = "text-h5">Eliminar Contrato y Todos sus Registros</span>
            <v-spacer></v-spacer>
          </v-card-title>
          <v-card-text>
            <v-container>
              <v-form
                  ref = "form"
                  fast-fail
                  @submit.prevent = "eliminarCompleto">
                <v-row>
                  <v-col cols="12" sm="6" md="4">
                    <v-select
                        v-model="nombreContratoSeleccionado"
                        :items="contratos.map(cont => ({
                                    title: cont.nombre,
                                    value: cont.id
                                    }))"
                        item-text="nombre"
                        item-value="id"
                    >
                      <template v-slot:label>
                        <span>Seleccionar Contrato para Eliminar</span>
                      </template>
                    </v-select>
                  </v-col>
                </v-row>
              </v-form>
            </v-container>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
                color = "info"
                @click = "cerrarDialogo()"
            >
              Cerrar
            </v-btn>
            <v-btn
                color = "error"
                @click = "eliminarCompleto"
            >
              Eliminar Contrato y Registros
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-row>
  </div>
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

import { mapActions, mapGetters } from 'vuex';

export default {
  props: {
    dialog: Boolean, itemProp: Object
  }, data() {
    return {
      localItem: this.defaultItem(),
      localDialog: false,
      contratos: [],
      nombreContratoSeleccionado:''
    };
  }, computed: {
    ...mapGetters({
      todosLosContratos: 'todosLosContratos',
    }),
    isFormValid() {
      // Validación de las reglas para cada campo.
      return this.nombreContratoSeleccionado !== '';
    }
  }, watch: {
    // Este watcher maneja los cambios en itemProp, que es una propiedad pasada
    // desde el componente padre y se utiliza para inicializar o actualizar los datos del formulario.
    itemProp: {
      immediate: true,
      deep: true,
      async handler(newVal) {
        // Nos aseguramos de que los datos necesarios están cargados
        await this.cargarInfo();
        // Actualizamos localItem con los datos pasados o con un objeto predeterminado.
        this.localItem = newVal ? { ...newVal } : this.defaultItem();
        // Actualizamos las selecciones y si los elementos de localItem son false o NaN, se les asigna un string vacío
        this.nombreContratoSeleccionado = this.localItem.nombre || '';
      }
    },
    nombreContratoSeleccionado(newValue) {
      const selectedContrato = this.contratos.find(cont => cont.nombre === newValue);
      if (selectedContrato) {
        this.localItem.id = selectedContrato.id;
      } else {
        // Cuando no hay selección, resetea los campos dependientes
        this.localItem.id = '';
      }
    },
    // Watcher para el diálogo. Si hay necesidad de realizar alguna acción cuando el diálogo se abre o cierra,
    // aquí es donde se haría.
    dialog(newValue) {
      this.localDialog = newValue;
    }
  },
  methods: {
    ...mapActions([
      'eliminarContratoCompleto', 'fetchContratos'
    ]),
    defaultItem() {
      return {
        id: 0,
        nombre: ''
      };
    },
    eliminarCompleto() {
      if(this.isFormValid) {
        this.eliminarContratoCompleto(this.localItem.id)
            .then(() => {
              this.cargarInfo();
              this.cerrarDialogo();
              this.$emit('delete:contrato');
            })
            .catch(() => {
            });
      }
    },
    async cargarInfo() {
      await this.fetchContratos();
      this.contratos = this.todosLosContratos;
    },
    cerrarDialogo() {
      this.$emit('update:dialog', false);
    },
    async created() {
      this.localDialog = this.dialog;
      await this.cargarInfo();
    }
  },
};
</script>

