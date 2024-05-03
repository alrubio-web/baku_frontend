<template>
  <v-container>
      <tabla :titulo="titulo" :cabecera="cabecera" :items="contactos" @update:contactos = "cargarDatos" @delete:contacto = "cargarDatos"/>
    <v-btn color="primary" @click="cargarDatos">Actualizar Lista</v-btn>
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

import Tabla from '@/components/contactos/TablaContactos.vue';
import { mapActions } from 'vuex';

export default {
  components: {
    Tabla
  },
  data() {
    return {
      cabecera: [
        { text: 'Id', value: 'id', align: 'left', sortable: true },
        { text: 'Nombre Completo', value: 'nombre_completo', align: 'left', sortable: true },
        { text: 'Email', value: 'email', align: 'left', sortable: true },
        { text: 'DNI', value: 'dni', align: 'left', sortable: true },
        { text: 'Dirección', value: 'direccion', align: 'left', sortable: true },
        { text: 'Teléfono', value: 'telefono', align: 'left', sortable: true },
        { text: 'Móvil Whatsapp', value: 'movil_whatsapp', align: 'left', sortable: false },
        { text: 'Cuenta Corriente', value: 'cuenta_corriente', align: 'left', sortable: false },
      ],
      contactos: [], // Define la propiedad contactos aquí
      titulo: "Contactos"
    };
  },watch: {
    // Escucha el evento 'update:contactos' del componente NuevoContacto y actualiza la tabla
    '$store.getters.todosLosContactos': {
      handler() {
        this.contactos = this.$store.getters.todosLosContactos;
      },
      deep: true
    },
    // Escuchar delete:inmueble y actualizar la tabla
    'delete:contacto'(contacto) {
      this.contactos = this.contactos.filter(item => item.id !== contacto.id);
    }
  },
  methods: {
    ...mapActions({
      fetchContactos: 'fetchContactos'
    }),
    async cargarDatos() {
      try {
        await this.fetchContactos();
        this.contactos = this.$store.getters.todosLosContactos;
      } catch (error) {
        console.error("Error al cargar contactos:", error);
      }
    }
  },
  created() {
    this.cargarDatos();
  },
};
</script>
