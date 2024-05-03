<template>
  <v-container>
    <h1 class="text-center">Modelo de Datos</h1>
    <br>
    <h3 class="text-center">Aquí podrás ver cómo se relacionan los datos del modelo.</h3>
  </v-container>
  <v-container>
    <div :style="backgroundStyle" class="background-image"></div>
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
  data() {
    return {
      imagePath: require('@/assets/baku.png'),
    };
  },
  computed: {
    backgroundStyle() {
      return {
        backgroundImage: `url(${this.imagePath})`,
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center center',
        backgroundSize: 'contain',
        marginBottom: '5px',
        height: '1100px',
        width: '100%',
        opacity: '100%',
      };
    }
  }
};
</script>

<style scoped>
.contenedor {
  height: 100%;
}
</style>
