<template>
  <div>
    <v-row justify = "center">
      <v-dialog v-model = "localDialog" @click:outside="cerrarDialogo">
        <v-card>
          <v-card-title>
            <span class = "text-h5">Gestión de Propiedad</span>
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
                        v-model="nombrePropietarioSeleccionado"
                        :rules = "reglasRequerido"
                        :items="contactos.map(contacto => ({
                                    title: contacto.nombre_completo,
                                    value: contacto.id
                                    }))"
                        item-text="nombre_completo"
                        item-value="id"
                    >
                      <template v-slot:label>
                        <span>Propietario (seleccionar)  <span class = "asterisco">*</span></span>
                      </template>
                    </v-select>
                  </v-col>
                  <v-col cols="12" sm="6" md="4">
                    <v-select
                        v-model="nombreInmuebleSeleccionado"
                        :rules = "reglasRequerido"
                        :items="inmuebles.map(inm => ({
                                    title: inm.nombre,
                                    value: inm.id
                                    }))"
                        item-text="nombre"
                        item-value="id"
                    >
                      <template v-slot:label>
                        <span>Inmueble (seleccionar)  <span class = "asterisco">*</span></span>
                      </template>
                    </v-select>
                  </v-col>
                  <v-col
                      cols = "12"
                      sm = "6"
                      md = "4"
                  >
                    <v-text-field
                        label = "Porcentaje de Propiedad"
                        v-model = "localItem.propiedad"
                        :rules = "reglasRequerido"
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
      contactos: [],
      inmueblesPropietarios: [],
      inmuebles: [],
      nombrePropietarioSeleccionado: '',
      nombreInmuebleSeleccionado: ''
    };
  }, computed: {
    ...mapGetters({
      todosLosContactos: 'todosLosContactos',
      todosLosInmueblesPropietarios: 'todosLosInmueblesPropietarios',
      todosLosInmuebles: 'todosLosInmuebles'
    }),
    isFormValid() {
      // Validación de las reglas para cada campo.
      return [
        ...this.reglasRequerido.map(rule => rule(this.localItem.propiedad)),
        ...this.reglasRequerido.map(rule => rule(this.localItem.id_inmueble)),
        ...this.reglasRequerido.map(rule => rule(this.localItem.id_propietario)),
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
        await this.cargarContactosPropiedades();

        // Actualizamos localItem con los datos pasados o con un objeto predeterminado.
        this.localItem = newVal ? { ...newVal } : this.defaultItem();
        // Actualizamos las selecciones y si los elementos de localItem son false o NaN, se les asigna un string vacío
        this.nombreInmuebleSeleccionado = this.localItem.nombre_inmueble || '';
        this.nombrePropietarioSeleccionado = this.localItem.nombre_propietario || '';
      }
    },
    nombreInmuebleSeleccionado(newValue) {
      const inmueble = this.inmuebles.find(inm => inm.nombre === newValue);
      this.localItem.id_inmueble = inmueble ? inmueble.id : null;
    },
    nombrePropietarioSeleccionado(newValue) {
      const propietario = this.contactos.find(cont => cont.nombre_completo === newValue);
      this.localItem.id_propietario = propietario ? propietario.id : null;
    },
    // Watcher para el diálogo. Si hay necesidad de realizar alguna acción cuando el diálogo se abre o cierra,
    // aquí es donde se haría.
    dialog(newValue) {
      this.localDialog = newValue;
    }
  },
  methods: {
    ...mapActions([
      'agregarInmueblePropietario',
      'fetchContactos',
      'fetchInmueblesPropietariosVista',
      'fetchInmuebles'
    ]),
    defaultItem() {
      return {
        nombre_propietario: '',
        nombre_inmueble: '',
        id_inmueble: '',
        id_propietario: '',
        propiedad: ''
      };
    }, async cargarContactosPropiedades() {
      // Carga los contactos y la información de propietarios de inmuebles
      await Promise.all([
        this.fetchContactos(),
        this.fetchInmueblesPropietariosVista(),
        this.fetchInmuebles()
      ]);

      // Actualiza las listas locales con los datos obtenidos
      this.contactos = this.todosLosContactos;
      this.inmueblesPropietarios = this.todosLosInmueblesPropietarios;
      this.inmuebles = this.todosLosInmuebles;

    }, agregar() {
      console.log(this.isFormValid);
      if (this.isFormValid) {
        this.agregarInmueblePropietario(this.localItem)
            .then(() => {
              this.cerrarDialogo();
              this.$emit('update:inmuebles_propietarios');
            })
      } else {
        console.error("El formulario no es válido.");
      }
    }, cerrarDialogo() {
      this.$emit('update:dialog', false);
    },
  }, async created() {
    this.localDialog = this.dialog;
    await this.cargarContactosPropiedades();
  }
};
</script>

