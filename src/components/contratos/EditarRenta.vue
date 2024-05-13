<template>
  <div>
    <v-row justify = "center">
      <v-dialog v-model = "localDialog" @click:outside="cerrarDialogo">
        <v-card>
          <v-card-title>
            <span class = "text-h5">Editar Renta</span>
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
                        :items="rentasVista.map(item => ({
                                    title: item.nombre_contrato,
                                    value: item.id_contrato
                                    }))"
                        item-text="nombre"
                        item-value="id_contrato"
                        readonly
                    >
                      <template v-slot:label>
                        <span>Contrato (seleccionar)  <span class = "asterisco">*</span></span>
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
                        :max="fechaActual()"
                        type = "date"
                    >
                      <template v-slot:label>
                        <span>Fecha Aplicable Renta <span class = "asterisco">*</span></span>
                      </template>
                    </v-text-field>
                  </v-col>
                  <v-col
                      cols = "12"
                      sm = "6"
                      md = "4"
                  >
                    <v-text-field
                        label = "Tipo Actualización"
                        v-model = "localItem.tipo_actualizacion"
                        type="text"
                    ></v-text-field>
                  </v-col>
                  <v-col
                      cols = "12"
                      sm = "6"
                      md = "4"
                  >
                    <v-text-field
                        label = "% IPC"
                        v-model = "localItem.ipc"
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
                        label = "% Tasa de Variación"
                        v-model = "localItem.tasa_variacion"
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
                        :rules = "reglasRequerido"
                        v-model = "localItem.renta"
                        type="number"
                        step="0.01"
                    >
                      <template v-slot:label>
                        <span>Renta <span class = "asterisco">*</span></span>
                      </template>
                    </v-text-field>
                    <v-btn @click="calcularRenta">Calcular Renta</v-btn>
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
import {fechaActual} from '../../utils/utilidades';

export default {
  props: {
    dialog: Boolean, itemProp: Object
  }, data() {
    return {
      localItem: this.defaultItem(),
      localDialog: false,
      reglasRequerido: [v => Validations.required(v),],
      rentasVista: [],
      nombreContratoSeleccionado: '',
    };
  }, computed: {
    ...mapGetters({
      todasLasMedidasContratos: 'todasLasMedidasContratos',
    }),
    isFormValid() {
      // Validación de las reglas para cada campo.
      return [
        ...this.reglasRequerido.map(rule => rule(this.localItem.id_contrato)),
        ...this.reglasRequerido.map(rule => rule(this.localItem.fecha)),
        ...this.reglasRequerido.map(rule => rule(this.localItem.renta)),
      ].every(result => result === true);
    }
  }, watch: {
    // Este watcher maneja los cambios en itemProp, que es una propiedad pasada
    // desde el componente padre y se utiliza para inicializar o actualizar los datos del formulario.
    itemProp: {
      immediate: true,
      deep: true,
      async handler(newVal) {
        // Nos aseguramos de que los datos necesarios están cargados
        await this.cargarRentasVista();

        // Actualizamos localItem con los datos pasados o con un objeto predeterminado.
        this.localItem = newVal ? { ...newVal } : this.defaultItem();
        // Actualizamos las selecciones y si los elementos de localItem son false o NaN, se les asigna un string vacío
        this.nombreContratoSeleccionado = this.localItem.nombre_contrato || '';
      }
    },
    nombreContratoSeleccionado(newValue) {
      const contrato = this.rentasVista.find(item => item.nombre_contrato === newValue);
      this.localItem.id_contrato = contrato ? contrato.id_contrato : null;
    },
    // Watcher para el diálogo. Si hay necesidad de realizar alguna acción cuando el diálogo se abre o cierra,
    // aquí es donde se haría.
    dialog(newValue) {
      this.localDialog = newValue;
    }
  },
  methods: {
    ...mapActions([
      'agregarRenta',
      'fetchMedidasContratos',
    ]), fechaActual(){
      return fechaActual();
    },
    defaultItem() {
      return {
        fecha: '',
        id_contrato: '',
        nombre_contrato: '',
        tipo_actualizacion: '',
        renta: '',
        ipc: '',
        tasa_variacion: ''
      };
    }, async cargarRentasVista() {
      await this.fetchMedidasContratos();

      // Actualiza la lista local con los datos obtenidos
      this.rentasVista = this.todasLasMedidasContratos;

    }, agregar() {
      if (this.isFormValid) {
        this.agregarRenta(this.localItem)
            .then(() => {
              this.cerrarDialogo();
              this.$emit('update:rentas');
            })
      } else {
        console.error("El formulario no es válido.");
      }
    }, cerrarDialogo() {
      this.$emit('update:dialog', false);
    },
    calcularRenta() {
      const ipc = parseFloat(this.localItem.ipc) || 0; // Asegúrate de que sea un número
      const tasaVariacion = parseFloat(this.localItem.tasa_variacion) || 0; // Asegúrate de que sea un número
      const rentaBase = parseFloat(this.localItem.renta) || 0; // La renta actual como base

      // Calcular la nueva renta
      let nuevaRenta = rentaBase + (rentaBase * ipc / 100) + (rentaBase * tasaVariacion / 100);
      nuevaRenta = nuevaRenta.toFixed(2); // Formatea a dos decimales

      // Actualiza el valor de renta en el modelo
      this.localItem.renta = nuevaRenta;
    }
  }, async created() {
    this.localDialog = this.dialog;
    await this.cargarRentasVista();
  }
};
</script>

