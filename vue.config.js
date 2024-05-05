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

/* Configuración para desarrollo local
const fs = require('fs');
const { defineConfig } = require('@vue/cli-service');


// Carga las variables de entorno desde el archivo .env
require('dotenv').config();

module.exports = defineConfig({
  transpileDependencies: true,
  devServer: {
    https: {
      key: fs.readFileSync(process.env.CERT_KEY_FILE),
      cert: fs.readFileSync(process.env.CERT_FILE),
    }
  }
});
 */

// Configuración para despliegue
const { defineConfig } = require('@vue/cli-service');

module.exports = defineConfig({
  transpileDependencies: true,
  devServer: {
    allowedHosts: [
      '.herokuapp.com', // Permite todos los subdominios de herokuapp.com
      'baku-rental-manager-frontend-fd6687d31d88.herokuapp.com' // Permite el host específico de tu app
    ]
  }
});


