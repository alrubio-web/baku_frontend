<template>
  <div>
    <v-row justify = "center">
      <v-dialog v-model = "localDialog" @click:outside="cerrarDialogo">
        <v-card>
          <v-card-title>
            <span v-if = "localItem.id===0" class = "text-h5">Nuevo Movimiento Ad Hoc</span>
            <span v-else class = "text-h5">Editar Movimiento</span>
            <v-spacer></v-spacer>
            <span v-if = "localItem.id>0">ID: {{ localItem.id }}</span>
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
                        v-model="nombreContratoSeleccionado"
                        :rules = "reglasRequerido"
                        :items="contratos.map(contr => ({
                                    title: contr.nombre,
                                    value: contr.id
                                    }))"
                        item-text="nombre_contrato"
                        item-value="id_contrato"
                    >
                      <template v-slot:label>
                        <span>Nombre de Contrato (seleccionar)  <span class = "asterisco">*</span></span>
                      </template>
                    </v-select>
                  </v-col>
                  <v-col
                      cols = "12"
                      sm = "6"
                      md = "4"
                  >
                    <v-text-field
                        v-model = "localItem.fecha"
                        :rules = "reglasRequerido"
                        type = "date"
                    >
                      <template v-slot:label>
                        <span>Fecha Movimiento <span class = "asterisco">*</span></span>
                      </template>
                    </v-text-field>
                  </v-col>
                  <v-col
                      cols = "12"
                      sm = "6"
                      md = "4"
                  >
                    <v-text-field
                        label = "Tipo de movimiento"
                        v-model = "localItem.tipo"
                        type="text"
                        readonly
                    ></v-text-field>
                  </v-col>
                  <v-col
                      cols = "12"
                      sm = "6"
                      md = "4"
                  >
                    <v-text-field
                        label = "Descripción"
                        v-model = "localItem.descripcion"
                        type="text"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6" md="4">
                    <v-select
                        label = "Estado Movimiento"
                        v-model="localItem.estado"
                        :items="opcionesEstado"
                        :readonly="isReadonlyEstado"
                    >
                    </v-select>
                  </v-col>
                  <v-col
                      cols = "12"
                      sm = "6"
                      md = "4"
                  >
                    <v-text-field
                        v-model = "localItem.cantidad"
                        :rules = "reglasRequerido"
                        type="number"
                        step="0.01"
                    >
                      <template v-slot:label>
                      <span>Cantidad <span class = "asterisco">*</span></span>
                      </template>
                    </v-text-field>
                  </v-col>
                  <v-col
                      cols = "12"
                      sm = "6"
                      md = "4"
                  >
                    <v-text-field
                        label = "Porcentaje de IVA"
                        v-model = "localItem.pct_iva"
                        type="number"
                        step="0.01"
                    ></v-text-field>
                  </v-col>
                  <v-col
                      cols = "12"
                      sm = "6"
                      md = "4"
                  >
                    <v-text-field
                        label = "Porcentaje de IRPF"
                        v-model = "localItem.pct_retencion"
                        type="number"
                        step="0.01"
                    ></v-text-field>
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
      movimientos: [],
      contratos: [],
      opcionesEstado: ['anulado' , 'pendiente'],
      nombreContratoSeleccionado: '',
    };
  }, computed: {
    ...mapGetters({
      todosLosContratosVista: 'todosLosContratosVista',
      todosLosMovimientos: 'todosLosMovimientos',
    }),
    isFormValid() {
      // Validación de las reglas para cada campo.
      return [
        ...this.reglasRequerido.map(rule => rule(this.nombreContratoSeleccionado)),
        ...this.reglasRequerido.map(rule => rule(this.localItem.fecha)),
        ...this.reglasRequerido.map(rule => rule(this.localItem.cantidad)),
      ].every(result => result === true);
    },
    isReadonlyEstado() {
      return this.localItem.estado === 'abonado';
    }
  }, watch: {
    // Este watcher maneja los cambios en itemProp, que es una propiedad pasada
    // desde el componente padre y se utiliza para inicializar o actualizar los datos del formulario.
    itemProp: {
      immediate: true, deep: true, async handler(newVal) {
        // Nos aseguramos de que los datos necesarios están cargados
        await this.cargarMovimientosContratos();

        // Actualizamos localItem con los datos pasados o con un objeto predeterminado.
        this.localItem = newVal ? {...newVal} : this.defaultItem();
        // Actualizamos las selecciones y si los elementos de localItem son false o NaN, se les asigna un string vacío
        this.nombreContratoSeleccionado = this.localItem.nombre_contrato || '';
      }
    }, nombreContratoSeleccionado(newValue) {
        const contrato = this.contratos.find(contr => contr.nombre === newValue);
        this.localItem.id_contrato = contrato ? contrato.id : null;
    },
    // Watcher para el diálogo. Si hay necesidad de realizar alguna acción cuando el diálogo se abre o cierra,
    // aquí es donde se haría.
    dialog(newValue) {
      this.localDialog = newValue;
    }
  },
  methods: {
      ...mapActions(['agregarMovimiento', 'fetchMovimientos', 'fetchVistaContratos']),
      defaultItem() {
        return {
          id: 0, fecha: '', tipo: 'ad hoc', id_contrato: '', descripcion: '', cantidad: '', pct_iva: 21, pct_retencion: 19,
        };
      }, async cargarMovimientosContratos() {
        await Promise.all([this.fetchVistaContratos(), this.fetchMovimientos()]);

        this.contratos = this.todosLosContratosVista;
        this.movimientos = this.todosLosMovimientos;
      }, agregar() {
        if (this.isFormValid) {
          const movimiento = {
            id: this.localItem.id,
            fecha: this.localItem.fecha,
            tipo: this.localItem.tipo,
            id_contrato: this.localItem.id_contrato,
            descripcion: this.localItem.descripcion,
            pct_iva: this.localItem.pct_iva,
            pct_retencion: this.localItem.pct_retencion,
            cantidad: this.localItem.cantidad,
            estado: this.localItem.estado
          };
          this.agregarMovimiento(movimiento)
              .then(() => {
                this.cerrarDialogo();
                this.$emit('update:movimientos');
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

