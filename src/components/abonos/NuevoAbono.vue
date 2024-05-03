<template>
  <div>
    <v-row justify = "center">
      <v-dialog v-model = "localDialog">
        <v-card>
          <v-card-title>
            <span v-if = "localItem.abono_id===0" class = "text-h5">Nuevo Abono</span>
            <span v-else class = "text-h5">Editar Abono</span>
            <v-spacer></v-spacer>
            <span v-if = "localItem.abono_id>0">ID: {{ localItem.abono_id }}</span>
          </v-card-title>
          <v-card-text>
            <v-container>
              <v-form
                  ref = "form"
                  fast-fail
                  @submit.prevent = "agregar">
                <v-row>
                  <v-col cols="12" sm="6" md="4">
                    <v-select
                        v-model="referenciaMovimientoSeleccionado"
                        :rules = "reglasRequerido"
                        :items="movimientos_pendientes.map(mov => ({
                                    title: mov.id_desc_fecha,
                                    value: mov.id
                                    }))"
                        item-text="id_desc_fecha"
                        item-value="id"
                        :disabled="localItem.abono_id !== 0"
                    >
                      <template v-slot:label>
                        <span>Movimiento (seleccionar)  <span class = "asterisco">*</span></span>
                      </template>
                    </v-select>
                  </v-col>
                  <v-col
                      cols = "12"
                      sm = "6"
                      md = "4"
                  >
                    <v-text-field
                        v-model = "localItem.abono_fecha"
                        :rules = "reglasRequerido"
                        type = "date"
                    >
                      <template v-slot:label>
                        <span>Fecha del Abono <span class = "asterisco">*</span></span>
                      </template>
                    </v-text-field>
                  </v-col>
                  <v-col
                      cols = "12"
                      sm = "6"
                      md = "4"
                  >
                    <v-text-field
                        label = "Descripción"
                        v-model = "localItem.abono_descripcion"
                        type="text"
                    ></v-text-field>
                  </v-col>
                  <v-col
                      cols = "12"
                      sm = "6"
                      md = "4"
                  >
                    <v-text-field
                        v-model = "localItem.abonado"
                        :rules = "reglasRequerido"
                        type="number"
                        step="0.01"
                    >
                      <template v-slot:label>
                      <span>Cantidad Abonada <span class = "asterisco">*</span></span>
                      </template>
                    </v-text-field>
                  </v-col>
                </v-row>
              </v-form>
            </v-container>
            <small><span class = "asterisco">*</span> Estos campos son obligatorios</small>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
                color = "error"
                @click = "cerrarDialogo()"
            >
              Cerrar
            </v-btn>
            <v-btn
                color = "info"
                :disabled = "!isFormValid"
                @click = "agregar"
            >
              Guardar
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
import * as Validations from '@/utils/validation';

export default {
  props: {
    dialog: Boolean, itemProp: Object
  }, data() {
    return {
      localItem: this.defaultItem(),
      localDialog: false,
      reglasRequerido: [v => Validations.required(v),],
      abonos: [],
      movimientos: [],
      movimientos_pendientes: [],
      referenciaMovimientoSeleccionado: '',
    };
  }, computed: {
    ...mapGetters({
      todosLosAbonos: 'todosLosAbonos', todosLosMovimientos: 'todosLosMovimientos'
    }),
    isFormValid() {
      // Validación de las reglas para cada campo.
      return [
        ...this.reglasRequerido.map(rule => rule(this.referenciaMovimientoSeleccionado)),
        ...this.reglasRequerido.map(rule => rule(this.localItem.abono_fecha)),
        ...this.reglasRequerido.map(rule => rule(this.localItem.abonado)),
      ].every(result => result === true);
    }
  }, watch: {
    // Este watcher maneja los cambios en itemProp, que es una propiedad pasada
    // desde el componente padre y se utiliza para inicializar o actualizar los datos del formulario.
    itemProp: {
      immediate: true, deep: true, async handler(newVal) {
        // Nos aseguramos de que los datos necesarios están cargados
        await this.cargarAbonosMovimientos();

        // Actualizamos localItem con los datos pasados o con un objeto predeterminado.
        this.localItem = newVal ? {...newVal} : this.defaultItem();
        // Actualizamos las selecciones y si los elementos de localItem son false o NaN, se les asigna un string vacío
        this.referenciaMovimientoSeleccionado = this.localItem.id_desc_fecha || '';
      }
    }, referenciaMovimientoSeleccionado(newValue) {
        const movimiento = this.movimientos.find(mov => mov.id_desc_fecha === newValue);
        this.localItem.id_movimiento = movimiento ? movimiento.id : null;
    },
    // Watcher para el diálogo.
    dialog(newValue) {
      this.localDialog = newValue;
    }
  },
  methods: {
      ...mapActions(['agregarAbono', 'fetchAbonos', 'fetchMovimientos']),
      defaultItem() {
        return {
          abono_id: 0, abono_fecha: '', abonado: '', abono_descripcion: '', id_movimiento: ''
        };
      }, async cargarAbonosMovimientos() {
      await Promise.all([
        this.fetchAbonos(),
        this.fetchMovimientos(),
      ]);

      // Actualiza las listas locales con los datos obtenidos
      this.abonos = this.todosLosAbonos;
      this.movimientos = this.todosLosMovimientos
      this.movimientos_pendientes = this.todosLosMovimientos.filter(movimiento => movimiento.estado === 'pendiente');
    }, agregar() {
        if (this.isFormValid) {
          const abono = {
            id: this.localItem.abono_id,
            fecha: this.localItem.abono_fecha,
            abonado: this.localItem.abonado,
            descripcion: this.localItem.abono_descripcion,
            id_movimiento: this.localItem.id_movimiento,
          };
          this.agregarAbono(abono)
              .then(() => {
                this.cerrarDialogo();
                this.$emit('update:abonos');
              })
        } else {
          console.error("El formulario no es válido.");
        }
      }, cerrarDialogo() {
        this.$emit('update:dialog', false);
      },
    },
};
</script>

