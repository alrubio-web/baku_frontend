<template>
  <div>
    <v-row justify = "center">
      <v-dialog v-model = "localDialog" @click:outside="cerrarDialogo">
        <v-card>
          <v-card-title>
            <span v-if = "localItem.id===0" class = "text-h5">Nuevo Contacto</span>
            <span v-else class = "text-h5">Editar Contacto</span>
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
                    <v-select
                        v-model = "localItem.tipo_contacto"
                        :items="tipoContactoOpciones"
                        :rules = "reglasRequerido"
                        type = "text"
                    >
                      <template v-slot:label>
                        <span>Tipo Contacto <span class = "asterisco">*</span></span>
                      </template>
                    </v-select>
                  </v-col>
                  <v-col
                      cols = "12"
                      sm = "6"
                      md = "4"
                  >
                    <v-text-field
                        v-model = "localItem.nombre_completo"
                        :rules = "reglasRequerido"
                        type = "text"
                    >
                      <template v-slot:label>
                        <span>Nombre Completo <span class = "asterisco">*</span></span>
                      </template>
                    </v-text-field>
                  </v-col>
                  <v-col
                      cols = "12"
                      sm = "6"
                      md = "4"
                  >
                    <v-text-field
                        label = "Alias"
                        v-model = "localItem.apodo"
                        type = "text"
                    ></v-text-field>
                  </v-col>
                  <v-col
                      cols = "12"
                      sm = "6"
                      md = "4"
                  >
                    <v-text-field
                        v-model = "localItem.email"
                        :rules = "reglasEmail"
                        type = "email"
                    >
                      <template v-slot:label>
                        <span>e-mail <span class = "asterisco">*</span></span>
                      </template>
                    </v-text-field>
                  </v-col>
                  <v-col
                      cols = "12"
                      sm = "6"
                      md = "4"
                  >
                    <v-text-field
                        v-model = "localItem.dni"
                        :rules = "reglasDNI"
                        type = "text"
                    >
                      <template v-slot:label>
                        <span>DNI/CIF <span class = "asterisco">*</span></span>
                      </template>
                    </v-text-field>
                  </v-col>
                  <v-col
                      cols = "12"
                      sm = "6"
                      md = "4"
                  >
                    <v-text-field
                        label = "Dirección"
                        v-model = "localItem.direccion"
                        type = "text"
                    ></v-text-field>
                  </v-col>
                  <v-col
                      cols = "12"
                      sm = "6"
                      md = "4"
                  >
                    <v-text-field
                        label = "Teléfono Fijo"
                        v-model = "localItem.telefono"
                        type = "number"
                    ></v-text-field>
                  </v-col>
                  <v-col
                      cols = "12"
                      sm = "6"
                      md = "4"
                  >
                    <v-text-field
                        v-model = "localItem.prefijo_pais_movil"
                        :rules = "reglasPrefijo"
                        type = "text"
                    >
                      <template v-slot:label>
                        <span>Prefijo País (+...) <span class = "asterisco">*</span></span>
                      </template>
                    </v-text-field>
                  </v-col>
                  <v-col
                      cols = "12"
                      sm = "6"
                      md = "4"
                  >
                    <v-text-field
                        v-model = "localItem.movil"
                        :rules = "reglasMovil"
                        type = "number"
                    >
                      <template v-slot:label>
                        <span>Móvil <span class = "asterisco">*</span></span>
                      </template>
                    </v-text-field>
                  </v-col>
                  <v-col
                      cols = "12"
                      sm = "6"
                      md = "4"
                  >
                    <v-text-field
                        label = "Observaciones"
                        v-model = "localItem.notas"
                        type = "text"
                    ></v-text-field>
                  </v-col>
                  <v-col
                      cols = "12"
                      sm = "6"
                      md = "4"
                  >
                    <v-text-field
                        label = "Cuenta Corriente"
                        v-model = "localItem.cuenta_corriente"
                        type = "text"
                    ></v-text-field>
                  </v-col>
                  <v-col
                      cols = "12"
                      sm = "6"
                      md = "4"
                  >
                    <v-text-field
                        label = "Nombre Fiscal"
                        v-model = "localItem.nombre_fiscal"
                        type = "text"
                    ></v-text-field>
                  </v-col>
                  <v-col
                      cols = "12"
                      sm = "6"
                      md = "4"
                  >
                    <v-text-field
                        label = "Token Telegram"
                        v-model = "localItem.telegram_token"
                        type = "text"
                    ></v-text-field>
                  </v-col>
                  <v-col
                      cols = "12"
                      sm = "6"
                      md = "4"
                  >
                    <v-text-field
                        label = "Telegram Chat Id"
                        v-model = "localItem.telegram_chat_id"
                        type = "text"
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

import {mapActions} from 'vuex';
import * as Validations from '@/utils/validation';

export default {
  props: {
    dialog: Boolean, itemProp: Object
  }, data() {
    return {
      localItem: this.defaultItem(),
      localDialog: false,
      reglasRequerido: [v => Validations.required(v),],
      reglasEmail: [v => Validations.required(v), v => Validations.email(v),],
      reglasDNI: [v => Validations.required(v), v => Validations.dni(v),],
      reglasPrefijo: [v => Validations.required(v), v => Validations.phonePrefix(v),],
      reglasMovil: [v => Validations.required(v), v => Validations.mobilePhone(v),],
      tipoContactoOpciones: ['Particular', 'Empresa'],
    };
  }, computed: {
    isFormValid() {
      // Validación de las reglas para cada campo.
      return [
        ...this.reglasRequerido.map(rule => rule(this.localItem.nombre_completo)),
        ...this.reglasRequerido.map(rule => rule(this.localItem.tipo_contacto)),
        ...this.reglasEmail.map(rule => rule(this.localItem.email)),
        ...this.reglasDNI.map(rule => rule(this.localItem.dni)),
        ...this.reglasPrefijo.map(rule => rule(this.localItem.prefijo_pais_movil)),
        ...this.reglasMovil.map(rule => rule(this.localItem.movil))
      ].every(result => result === true);
    }
  }, watch: {
    itemProp: {
      deep: true, immediate: true, handler(newVal) {
        if (newVal) {
          // Si newVal tiene un id, es una edición, de lo contrario, es un nuevo contacto
          this.localItem = newVal && newVal.id ? {...newVal} : this.defaultItem();
        }
      }
    }, dialog(newValue) {
      this.localDialog = newValue;
    }, localItem: {
      deep: true, handler() {
        // manejar aquí cualquier acción si localItem cambia
      }
    }
  }, methods: {
    ...mapActions({
      agregarContacto: 'agregarContacto',
    }), defaultItem() {
      return {
        id: 0, // Para nuevo item se define el default item con id cero
        tipo_contacto: '',
        nombre_completo: '',
        apodo: '',
        email: '',
        dni: '',
        direccion: '',
        telefono: '',
        prefijo_pais_movil: '+34',
        movil: '',
        notas: '',
        cuenta_corriente: '',
        nombre_fiscal: '',
        telegram_token: '',
        telegram_chat_id: '',
      };
    }, agregar() {
      console.log(this.isFormValid);
      if (this.isFormValid) {
        this.agregarContacto(this.localItem)
            .then(() => {
              this.cerrarDialogo();
              this.$emit('update:contactos');
            })
      } else {
        console.error("El formulario no es válido.");
      }
    }, cerrarDialogo() {
      this.$emit('update:dialog', false);
    },
  }, created() {
    this.localDialog = this.dialog;
  }
};
</script>

