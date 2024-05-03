<template>
  <v-container>
      <tabla :titulo="titulo" :cabecera="cabecera" :items="inquilinos"/>
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

import Tabla from '@/components/contactos/TablaInquilinos.vue';
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
        { text: 'Saldo', value: 'saldo', align: 'left', sortable: false },
      ],
      inquilinos: [], // Define la propiedad contactos aquí
      titulo: "Inquilinos"
    };
  },
  methods: {
    ...mapActions({
      fetchInquilinos: 'fetchInquilinos'
    }),
    async cargarDatos() {
      try {
        await this.fetchInquilinos();
        this.inquilinos = this.$store.getters.todosLosInquilinos;
      } catch (error) {
        console.error("Error al cargar inquilinos:", error);
      }
    }
  },
  created() {
    this.cargarDatos();
  },
};
</script>
