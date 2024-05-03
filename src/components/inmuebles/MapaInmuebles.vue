<template>
  <v-container>
        <div class = "titulo">
          {{ titulo }}
        </div>
        <div class="contenedor-mapa">
          <div ref="map" style="height: 100%"></div>
        </div>
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

/* global google */
import { mapActions } from 'vuex';
import { formatCurrency } from '../../utils/utilidades';

export default {
  components: {},
  props: {
    titulo: String, cabecera: Array, items: Array
  },
  data() {
    return {
      search: '',
      dialog: false,
      itemSelected: {},
      localItems: [],
      inmueblesContratos: [],
      googleMap: null,
      rutaContratos: '/contratos',
      rutaInquilinos: '/inquilinos'
    };
  },
  watch: {
    items: {
      handler(newItems) {
        this.localItems = [...newItems];
      },
      deep: true,
      immediate: true,
    }
  },
  mounted() {
    // Solo cargar el script de Google Maps si aún no se ha cargado
    if (!window.google || !window.google.maps) {
      let script = document.createElement('script');
      script.async = true;
      script.defer = true;
      script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.VUE_APP_GOOGLE_MAPS_API_KEY}`;
      document.head.appendChild(script);
      script.onload = () => {
        this.initMap();
        this.cargarDatos(); // Asegurar que los datos se carguen después de que el mapa esté listo
      };
      script.onerror = error => console.error("Error loading Google Maps API script:", error);
    } else {
      this.initMap();
      this.cargarDatos();
    }
  },
  methods: {
    ...mapActions({
      fetchInmueblesContratos: 'fetchInmueblesContratos',
    }),
    formatCurrency(value) {
      return formatCurrency(value);
    },
    navegar(ruta) {
      this.drawer = false; // Cierra el menú de navegación después de la navegación
      this.$router.push(ruta);
    },
    initMap() {
      this.googleMap = new google.maps.Map(this.$refs.map, {
        center: { lat: 39.63354967548963, lng: 2.6576633437406234 },
        zoom: 11,
        mapId: "d6d721ae6da18895",
      });
      this.cargarDatos();
    },
    async loadMarkers() {
      this.inmueblesContratos.forEach(inmueble => {
        if (inmueble.geolocalizacion_inmueble) {
          const [lat, lng] = inmueble.geolocalizacion_inmueble.split(',').map(Number);
          const position = new google.maps.LatLng(lat, lng);

          // Crear un marcador estándar
          const marker = new google.maps.Marker({
            map: this.googleMap,
            position: position,
            title: "Inmueble: " + inmueble.nombre_inmueble
          });

          // Construir el contenido de InfoWindow
          let contentString = `<h5>Nombre Inmueble: ${inmueble.nombre_inmueble}</h5>`;
          contentString += inmueble.descripcion_inmueble ? `<p>Descripción: ${inmueble.descripcion_inmueble}</p>` : '';
          contentString += `<p>Estado: ${inmueble.estado_inmueble}</p>`;
          contentString += inmueble.nombre_propietario ? `<p>Propietario: ${inmueble.nombre_propietario}</p>` : '';
          contentString += inmueble.nombre_inquilino ? `<p>Inquilino: ${inmueble.nombre_inquilino}</p>` : '';
          contentString += inmueble.fecha_inicio_contrato ? `<p>Fecha Inicio Contrato: ${inmueble.fecha_inicio_contrato}</p>` : '';
          contentString += inmueble.fecha_fin_contrato ? `<p>Fecha Fin Contrato: ${inmueble.fecha_fin_contrato}</p>` : '';
          contentString += inmueble.estado_inmueble === 'alquilado' ? `<p>Saldo del Contrato: ${formatCurrency(inmueble.saldo)}</p>` : '';
          contentString += `<p><a href="https://maps.google.com/?q=${lat},${lng}" target="_blank">Ver en Google Maps</a></p>`;
          contentString += `<p><a href="#" id="navegarContratos">Haz click para ir a Contratos</a></p>`;
          contentString += `<p><a href="#" id="navegarInquilinos">Haz click para ir a Inquilinos</a></p>`;

          // Crear y configurar InfoWindow
          const infoWindow = new google.maps.InfoWindow({
            content: contentString
          });

          // Agregar el evento click al marcador para abrir el InfoWindow
          marker.addListener('click', () => {
            infoWindow.open({
              map: this.googleMap,
              anchor: marker,
              shouldFocus: true
            });
            // manejamos el evento click sobre los enlaces a contratos e inquilinos
            google.maps.event.addListenerOnce(infoWindow, 'domready', () => {
              // Nos aseguramos de que el enlace interno de Vue tiene el ID correcto y solo añade el manejador de eventos a ese enlace
              document.getElementById('navegarContratos').addEventListener('click', (e) => {
                e.preventDefault();  // Previene que el navegador siga el enlace
                this.navegar(this.rutaContratos);
              });
              document.getElementById('navegarInquilinos').addEventListener('click', (e) => {
                e.preventDefault();  // Previene que el navegador siga el enlace
                this.navegar(this.rutaInquilinos);
              });
            });
          });
        }
      });
    },
    async cargarDatos() {
      try {
        await this.fetchInmueblesContratos();
        this.inmueblesContratos = this.$store.getters.todosLosInmueblesContratos;
        this.loadMarkers(); // Recargar los marcadores cuando los datos están listos
      } catch (error) {
        console.error("Error al cargar inmuebles:", error);
      }
    },
    cerrarDialogo() {
      this.dialog = false;
    },
  },
};
</script>



<style scoped>
@import "@/assets/styles/globalStyles.css";
</style>
