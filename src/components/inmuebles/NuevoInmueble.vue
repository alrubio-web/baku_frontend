<template>
  <div>
    <v-row justify = "center">
      <v-dialog v-model = "localDialog">
        <v-card>
          <v-card-title>
            <span v-if = "localItem.id===0" class = "text-h5">Nuevo Inmueble</span>
            <span v-else class = "text-h5">Editar Inmueble</span>
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
                  <v-col
                      cols = "12"
                      sm = "6"
                      md = "4"
                  >
                    <v-text-field
                        v-model = "localItem.nombre"
                        :rules = "reglasRequerido"
                        type = "text"
                    >
                      <template v-slot:label>
                        <span>Nombre Inmueble <span class = "asterisco">*</span></span>
                      </template>
                    </v-text-field>
                  </v-col>
                  <v-col
                      cols = "12"
                      sm = "6"
                      md = "4"
                  >
                    <v-select
                        label = "Tipo de Inmueble"
                        v-model = "localItem.tipo"
                        :items="tipoInmuebleOpciones"
                        type = "text"
                    ></v-select>
                  </v-col>
                  <v-col
                      cols = "12"
                      sm = "6"
                      md = "4"
                  >
                    <v-text-field
                        label = "Descripción"
                        v-model = "localItem.descripcion"
                        type = "text"
                    >
                    </v-text-field>
                  </v-col>
                  <v-col
                      cols = "12"
                      sm = "6"
                      md = "4"
                  >
                    <v-text-field
                        v-model = "localItem.direccion"
                        :rules = "reglasRequerido"
                        type = "text"
                    >
                      <template v-slot:label>
                        <span>Dirección <span class = "asterisco">*</span></span>
                      </template>
                    </v-text-field>
                  </v-col>
                  <v-col
                      cols = "12"
                      sm = "6"
                      md = "4"
                  >
                    <v-text-field
                        label = "Geolocalizacion"
                        v-model = "localItem.geolocalizacion"
                        type="text"
                    ></v-text-field>
                  </v-col>
                  <v-col
                      cols = "12"
                      sm = "6"
                      md = "4"
                  >
                    <v-text-field
                        label = "Ref. Catastral"
                        v-model = "localItem.referencia_catastral"
                        type="text"
                    ></v-text-field>
                  </v-col>
                  <v-col
                      cols = "12"
                      sm = "6"
                      md = "4"
                  >
                    <v-text-field
                        v-model = "localItem.fecha_adquisicion"
                        :rules = "reglasRequerido"
                        type = "date"
                    >
                      <template v-slot:label>
                        <span>Fecha Adquisición <span class = "asterisco">*</span></span>
                      </template>
                    </v-text-field>
                  </v-col>
                  <v-col
                      cols = "12"
                      sm = "6"
                      md = "4"
                  >
                    <v-text-field
                        label = "Fecha Transmisión"
                        v-model = "localItem.fecha_transmision"
                        type = "date"
                    ></v-text-field>
                  </v-col>
                  <v-col
                      cols = "12"
                      sm = "6"
                      md = "4"
                  >
                    <v-text-field
                        label = "Cálculo Amortización"
                        v-model = "localItem.precio_calculo_amoritzacion"
                        :rules = "reglasRequerido"
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
                        v-model = "localItem.precio_escriturado_transmision"
                        :rules = "reglasRequerido"
                        type="number"
                        step="0.01"
                    >
                      <template v-slot:label>
                        <span>Precio Transmisión <span class = "asterisco">*</span></span>
                      </template>
                    </v-text-field>
                  </v-col>
                  <v-col
                      cols = "12"
                      sm = "6"
                      md = "4"
                  >
                    <v-text-field
                        v-model = "localItem.valor_catastral_suelo"
                        :rules = "reglasRequerido"
                        type="number"
                        step="0.01"
                    >
                      <template v-slot:label>
                        <span>Valor Catastral Suelo <span class = "asterisco">*</span></span>
                      </template>
                    </v-text-field>
                  </v-col>
                  <v-col
                      cols = "12"
                      sm = "6"
                      md = "4"
                  >
                    <v-text-field
                        v-model = "localItem.valor_catastral"
                        :rules = "reglasRequerido"
                        type="number"
                        step="0.01"
                    >
                      <template v-slot:label>
                        <span>Valor Catastral <span class = "asterisco">*</span></span>
                      </template>
                    </v-text-field>
                  </v-col>
                  <v-col
                      cols = "12"
                      sm = "6"
                      md = "4"
                  >
                    <v-text-field
                        label = "Anotaciones"
                        v-model = "localItem.notas"
                        type="text"
                    ></v-text-field>
                  </v-col>
                  <v-col
                      cols = "12"
                      sm = "6"
                      md = "4"
                  >
                    <v-text-field
                        label = "Tamaño (m2)"
                        v-model = "localItem.tamaño_m2"
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
                        label = "Amortizaciones"
                        v-model = "localItem.total_amortizaciones"
                        type="number"
                        step="0.01"
                    ></v-text-field>
                  </v-col>
                  <v-col
                      cols = "12"
                      sm = "6"
                      md = "4"
                  >
                    <v-select
                        label = "Tipo de Adquisición"
                        v-model = "localItem.tipo_adquisicion"
                        :items="tipoAdquisicionOpciones"
                        type="text"
                    ></v-select>
                  </v-col>
                  <v-col
                      cols = "12"
                      sm = "6"
                      md = "4"
                  >
                    <v-select
                        label = "Tipo de Transmisión"
                        v-model = "localItem.tipo_transmision"
                        :items="tipoTransmisionOpciones"
                        type="text"
                    ></v-select>
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

import { mapActions } from 'vuex';
import * as Validations from '@/utils/validation';

export default {
  props: {
    dialog: Boolean, itemProp: Object
  }, data() {
    return {
      localItem: this.defaultItem(),
      localDialog: false,
      reglasRequerido: [v => Validations.required(v),],
      tipoInmuebleOpciones: ['-', 'Apartamento', 'Chalet', 'Chalet Adosado', 'Casa Rural', 'Nave Industrial', 'Local Comercial'],
      tipoAdquisicionOpciones: ['-', 'Compraventa', 'Donación', 'Herencia', 'Adjudicación en subasta'],
      tipoTransmisionOpciones: ['-', 'Venta', 'Donación', 'Dación en pago', 'Permuta']
    };
  }, computed: {
    isFormValid() {
      // Validación de las reglas para cada campo.
      return [
        ...this.reglasRequerido.map(rule => rule(this.localItem.nombre)),
        ...this.reglasRequerido.map(rule => rule(this.localItem.direccion)),
        ...this.reglasRequerido.map(rule => rule(this.localItem.fecha_adquisicion)),
        ...this.reglasRequerido.map(rule => rule(this.localItem.precio_escriturado_transmision)),
        ...this.reglasRequerido.map(rule => rule(this.localItem.valor_catastral_suelo)),
        ...this.reglasRequerido.map(rule => rule(this.localItem.valor_catastral))
      ].every(result => result === true);
    }
  }, watch: {
    // Este watcher maneja los cambios en itemProp, que es una propiedad pasada
    // desde el componente padre y se utiliza para inicializar o actualizar los datos del formulario.
    itemProp: {
      immediate: true,
      deep: true,
      handler(newVal) {
        // Actualizamos localItem con los datos pasados o con un objeto predeterminado.
        this.localItem = newVal ? { ...newVal } : this.defaultItem();
      }
    },
    // Este watcher es para el diálogo. Si hay necesidad de realizar alguna acción cuando el diálogo se abre o cierra,
    // aquí es donde se haría.
    dialog(newValue) {
      this.localDialog = newValue;
    }
  },
  methods: {
    ...mapActions([
      'agregarInmueble',
    ]),
    defaultItem() {
      return {
        id: 0,
        nombre: '',
        tipo: '',
        descripcion: '',
        geolocalizacion : '',
        direccion: '',
        referencia_catastral: '',
        fecha_adquisicion: '',
        fecha_transmision: '',
        precio_calculo_amoritzacion: '',
        precio_escriturado_transmision: '',
        valor_catastral_suelo: '',
        valor_catastral: '',
        notas: '',
        tamaño_m2: '',
        total_amortizaciones: '',
        tipo_adquisicion: '',
        tipo_transmision: '',
      };
    }, agregar() {
      console.log(this.isFormValid);
      if (this.isFormValid) {
        this.agregarInmueble(this.localItem)
            .then(() => {
              this.cerrarDialogo();
              this.$emit('update:inmuebles');
            })
      } else {
        console.error("El formulario no es válido.");
      }
    }, cerrarDialogo() {
      this.$emit('update:dialog', false);
    },
  }, async created() {
    this.localDialog = this.dialog;
  }
};
</script>

