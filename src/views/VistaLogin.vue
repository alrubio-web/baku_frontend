<template>
  <v-container>
    <v-row justify = "center">
      <v-col cols = "12" sm = "8" md = "4">
        <v-card class="login">
          <v-card-title>Login</v-card-title>
          <v-card-text>
              <v-card-text>
                Para empezar debes hacer login con tu usuario de Google.
              </v-card-text>
            <v-btn  variant="elevated" color="primary" @click = "loginConGoogle">Iniciar Sesión</v-btn>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
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

export default {
  methods: {
    loginConGoogle() {
      const authUrl = 'https://baku-rental-manager-backend-7b5c1c23f750.herokuapp.com/api/authGoogle/google';
      window.location.href = authUrl;
    }
  }
};
</script>
