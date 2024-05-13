<template>
  <div>
    <v-row justify = "center">
      <v-dialog v-model = "localDialog" @click:outside="cerrarDialogo">
        <v-card>
          <v-card-title>
            <span v-if = "localItem.id===0" class = "text-h5">Nuevo Contrato</span>
            <span v-else class = "text-h5">Editar Contrato</span>
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
                        type="text"
                    >
                      <template v-slot:label>
                        <span>Nombre de Contrato <span class = "asterisco">*</span></span>
                      </template>
                    </v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6" md="4">
                    <v-select
                        v-model="nombreInmuebleSeleccionado"
                        :disabled="localItem.id > 0"
                        :rules = "reglasRequerido"
                        :items="filtredInmuebles.map(inm => ({
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
                  <v-col cols="12" sm="6" md="4">
                    <v-select
                        :disabled="localItem.id > 0"
                        :rules = "reglasRequerido"
                        v-model="nombreArrendadorSeleccionado"
                        :items="filtredArrendadores.map(cont => ({
                                    title: cont.nombre_completo,
                                    value: cont.id
                                    }))"
                        item-text="nombre_completo"
                        item-value="id"
                    >
                      <template v-slot:label>
                        <span>Arrendador (seleccionar)  <span class = "asterisco">*</span></span>
                      </template>
                    </v-select>
                  </v-col>
                  <v-col cols="12" sm="6" md="4">
                    <v-select
                        label="Inquilino (seleccionar)"
                        :disabled="localItem.id > 0"
                        :rules = "reglasRequerido"
                        v-model="nombreInquilinoSeleccionado"
                        :items="contactos.map(cont => ({
                                    title: cont.nombre_completo,
                                    value: cont.id
                                    }))"
                        item-text="nombre_completo"
                        item-value="id"
                    >
                      <template v-slot:label>
                        <span>Inquilino (seleccionar)  <span class = "asterisco">*</span></span>
                      </template>
                    </v-select>
                  </v-col>
                  <v-col
                      cols = "12"
                      sm = "6"
                      md = "4"
                  >
                    <v-text-field
                        v-model = "localItem.fecha_inicio"
                        :disabled="localItem.id > 0"
                        :rules = "reglasRequerido"
                        type = "date"
                    >
                      <template v-slot:label>
                        <span>Inicio Contrato <span class = "asterisco">*</span></span>
                      </template>
                    </v-text-field>
                  </v-col>
                  <v-col
                      cols = "12"
                      sm = "6"
                      md = "4"
                  >
                    <v-text-field
                        v-model = "localItem.fecha_fin"
                        :min="localItem.id > 0 ? new Date().toISOString().substring(0, 10) : null"
                        :rules = "reglasRequerido"
                        type = "date"
                    >
                      <template v-slot:label>
                        <span>Fin Contrato <span class = "asterisco">*</span></span>
                      </template>
                    </v-text-field>
                  </v-col>
                  <v-col
                      cols = "12"
                      sm = "6"
                      md = "4"
                  >
                    <v-text-field
                        label = "Deducción Fiscal"
                        v-model = "localItem.deduccion_fiscal"
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
                        label = "Fianza"
                        v-model = "localItem.fianza"
                        type="number"
                        step="0.01"
                    ></v-text-field>
                  </v-col>
                  <v-col
                      v-if="localItem.id === 0"
                      cols = "12"
                      sm = "6"
                      md = "4"
                  >
                    <v-text-field
                        :rules = "reglasRequerido"
                        :disabled="localItem.id > 0"
                        v-model = "localItem.renta"
                        type="number"
                        step="0.01"
                    >
                      <template v-slot:label>
                        <span>Renta Inicial Contrato <span class = "asterisco">*</span></span>
                      </template>
                    </v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6" md="4" v-if="localItem.id > 0">
                    <v-radio-group
                        v-model="estado"
                        :rules="reglasRequerido"
                    >
                      <v-radio :label="'Activo'" :value="true"></v-radio>
                      <v-radio :label="'Anulado'" :value="false"></v-radio>
                      <template v-slot:label>
                        <span>Estado del Contrato <span class = "asterisco">*</span></span>
                      </template>
                    </v-radio-group>
                  </v-col>
                  <v-col cols="12" sm="6" md="4">
                    <v-select
                        label="Forma de Pago (seleccionar)"
                        v-model="localItem.tipo_pago"
                        :items="opcionesTipoPago"
                    >
                    </v-select>
                  </v-col>
                  <v-col cols="12" sm="6" md="4">
                    <v-radio-group
                        label = "Sujeto a IRPF"
                        v-model="sujeto_a_IRPF"
                    >
                      <v-radio :label="'Sí'" :value="true"></v-radio>
                      <v-radio :label="'No'" :value="false"></v-radio>
                    </v-radio-group>
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
import alertify from "alertifyjs";

export default {
  props: {
    dialog: Boolean, itemProp: Object
  }, data() {
    return {
      localItem: this.defaultItem(),
      localDialog: false,
      reglasRequerido: [v => Validations.required(v),],
      contactos: [],
      inmuebles: [],
      contratos: [],
      inmueblesPropietarios: [],
      filtredInmuebles: [],
      filtredArrendadores: [],
      nombreInmuebleSeleccionado: '',
      nombreArrendadorSeleccionado: '',
      nombreInquilinoSeleccionado: '',
      estado: '',
      sujeto_a_IRPF: '',
      opcionesTipoPago: ['Transferencia Bancaria', 'Efectivo', 'Bitcoin', 'Otros'],
    };
  }, computed: {
    ...mapGetters({
      todosLosContratos: 'todosLosContratos',
      todosLosContactos: 'todosLosContactos',
      todosLosInmuebles: 'todosLosInmuebles',
      todosLosInmueblesPropietarios: "todosLosInmueblesPropietarios"
    }),
    isFormValid() {
      // Validación de las reglas para cada campo.
      return [
        ...this.reglasRequerido.map(rule => rule(this.localItem.nombre)),
        ...this.reglasRequerido.map(rule => rule(this.localItem.id_inmueble)),
        ...this.reglasRequerido.map(rule => rule(this.localItem.arrendador)),
        ...this.reglasRequerido.map(rule => rule(this.localItem.inquilino)),
        ...this.reglasRequerido.map(rule => rule(this.localItem.fecha_inicio)),
        ...this.reglasRequerido.map(rule => rule(this.localItem.fecha_fin)),
        ...this.reglasRequerido.map(rule => rule(this.localItem.estado)),
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
        await this.cargarInfo();

        // Actualizamos localItem con los datos pasados o con un objeto predeterminado.
        this.localItem = newVal ? { ...newVal } : this.defaultItem();
        // Actualizamos las selecciones y si los elementos de localItem son false o NaN, se les asigna un string vacío
        this.nombreInmuebleSeleccionado = this.localItem.nombre_inmueble || '';
        this.nombreArrendadorSeleccionado = this.localItem.nombre_arrendador || '';
        this.nombreInquilinoSeleccionado = this.localItem.nombre_inquilino || '';
        this.estado = this.localItem.estado ? true : false;
        this.sujeto_a_IRPF = this.localItem.sujeto_a_IRPF ? true : false;
      }
    },
    nombreInmuebleSeleccionado(newValue) {
      const selectedInmueble = this.inmuebles.find(inm => inm.nombre === newValue);
      if (selectedInmueble) {
        this.localItem.id_inmueble = selectedInmueble.id;

        // Filtrar arrendadores para este inmueble específico
        const propietarios = this.todosLosInmueblesPropietarios.filter(item => item.id_inmueble === selectedInmueble.id);
        this.filtredArrendadores = propietarios.map(({ id_propietario, nombre_propietario }) => ({
          id: id_propietario,
          nombre_completo: nombre_propietario
        }));
      } else {
        // Cuando no hay selección, resetea los campos dependientes
        this.localItem.id_inmueble = '';
        this.filtredArrendadores = [];
      }
    },
    nombreArrendadorSeleccionado(newValue) {
      const selectedArrendador = this.contactos.find(cont => cont.nombre_completo === newValue);
      if (selectedArrendador) {
        this.localItem.arrendador = selectedArrendador.id;

        // Filtrar inmuebles para este arrendador específico
        const inmuebles = this.todosLosInmueblesPropietarios.filter(item => item.id_propietario === selectedArrendador.id);
        this.filtredInmuebles = inmuebles.map(({ id_inmueble, nombre_inmueble }) => ({
          id: id_inmueble,
          nombre: nombre_inmueble
        }));
      } else {
        // Cuando no hay selección, resetea los campos dependientes
        this.localItem.arrendador = '';
        this.filtredInmuebles = [];
      }
    },
    nombreInquilinoSeleccionado(newValue) {
      const inquilino = this.contactos.find(cont => cont.nombre_completo === newValue);
      this.localItem.inquilino = inquilino ? inquilino.id : null;
    },
    estado(newValue) {
      this.localItem.estado = newValue;
    },
    sujeto_a_IRPF(newValue) {
      this.localItem.sujeto_a_IRPF = newValue;
    },

    // Watcher para el diálogo. Si hay necesidad de realizar alguna acción cuando el diálogo se abre o cierra,
    // aquí es donde se haría.
    dialog(newValue) {
      this.localDialog = newValue;
    }
  },
  methods: {
    ...mapActions([
      'agregarContrato',
      'fetchContactos',
      'fetchVistaContratos',
      'fetchInmuebles',
      'fetchInmueblesPropietariosVista'
    ]),
    defaultItem() {
      return {
        id: 0,
        nombre: '',
        id_inmueble: '',
        arrendador: '',
        nombre_arrendador: '',
        inquilino: '',
        nombre_inquilino: '',
        fecha_inicio: '',
        fecha_fin: '',
        deduccion_fiscal: '',
        fianza: '',
        estado: true,
        tipo_pago: '',
        sujeto_a_IRPF: true,
        notas: '',
      };
    }, async cargarInfo() {
      // Carga los contactos y la información de propietarios de inmuebles
      await Promise.all([
        this.fetchContactos(),
        this.fetchInmuebles(),
        this.fetchInmueblesPropietariosVista()
      ]);

      // Actualiza las listas locales con los datos obtenidos
      this.contratos = this.todosLosContratos;
      this.contactos = this.todosLosContactos;
      this.inmuebles = this.todosLosInmuebles;
      this.inmueblesPropietarios = this.todosLosInmueblesPropietarios;
      this.filtredInmuebles = this.inmuebles; // Inicialmente mostrar todos
      this.filtredArrendadores = this.contactos; // Inicialmente mostrar todos

    }, async agregar() {
      if (this.isFormValid) {
        this.toggleCursorEspera(true);
        this.cerrarDialogo();
        alertify.notify('Guardando contrato, generando registros de movimientos y renta, así como enviando notificación por e-mail al inquilino. Por favor' +
            'espera hasta que se complete la operación.',
            'message', 20);
        try {
          const response = await this.agregarContrato(this.localItem);
          if (response && response.data.status === 201) {
            alertify.dismissAll();
            alertify.success(this.localItem.id === 0 ? 'Nuevo contrato agregado correctamente' : 'Contrato actualizado correctamente', 3);
            this.$emit('update:contratos');
          } else {
            alertify.error('Error al crear el contrato.', 3);
          }
        } catch (error) {
          console.error('Error al enviar notificación.', error);
          alertify.error('Error al enviar notificación.', 3);
        } finally {
          this.toggleCursorEspera(false);
        }
      }
    }, cerrarDialogo() {
      this.$emit('update:dialog', false);
    }, toggleCursorEspera(espera) {
      if (espera) {
        document.body.classList.add('cursor-wait');
      } else {
        document.body.classList.remove('cursor-wait');
      }
    },
  }, async created() {
    this.localDialog = this.dialog;
    await this.cargarInfo();
  }
};
</script>

