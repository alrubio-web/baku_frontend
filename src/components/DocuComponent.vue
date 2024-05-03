<template>
  <v-container class="contenedor">
    <v-row>
      <v-col cols="12">
        <h1 class="titulo">Bienvenido</h1>
        <h4>En esta página te presentamos algunos detalles para empezar.</h4>
        <br>
        <p>Selecciona una opción:</p>
        <v-expansion-panels variant="popout" class="my-4" v-for="ruta in rutas" :key="ruta.nombre">
            <v-expansion-panel class="custom_exp_panel"
                :title="'Descripción '+ ruta.nombre"
                :text="ruta.text "
            >
              <div class="d-flex justify-center align-center">
                <router-link :to="ruta.ruta" class="link">Ir a {{ ruta.nombre }}</router-link>
              </div>
            </v-expansion-panel>
        </v-expansion-panels>
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
  data() {
    return {
      rutas: [
        { nombre: 'Contactos', ruta: '/contactos',
          text:'En esta sección podrás consultar, editar y crear nuevos contactos.' +
              ' Durante la creación de un contacto encontrarás algunos campos obligatorios como el nombre completo, DNI, etc.' +
              ' El tipo de contacto podrá ser de empresa o particular.' +
              ' Un contacto podrá ser a la vez propietario o inquilino, dependiendo de cuál de ambos roles lo vincule a los distintos contratos. ' +
              'No se permite eliminar un contacto que tenga alguna propiedad, contrato o movimiento asociado.'},
        { nombre: 'Inquilinos', ruta: '/inquilinos',
          text:'En esta sección podrás consultar los inquilinos, que son aquellos contactos cuyo Id figura como inquilino en algún contrato. ' +
              'Además, se indica el saldo de cada inquilino y la opción de enviar un aviso del estado de cuentas del inquilino a través ' +
              'de la aplicación de Whatsapp o de Whatsapp Web.' },
        { nombre: 'Inmuebles', ruta: '/inmuebles',
          text:'Módulo para la gestión de inmuebles, incluyendo operaciones de edición, creación y eliminación de inmuebles. ' +
              'Recuerda que un inmueble puede tener más de un propietario, por eso encontrarás la gestión de la propiedad ' +
              'aparte, en el módulo "Propiedades". No se permite eliminar un inmueble que tenga asociado un propietario o algún contrato.' },
        { nombre: 'Propiedades', ruta: '/propiedades',
          text:'Módulo para la gestión de propiedades, incluyendo operaciones de edición, creación y eliminación de relaciones de propiedad ' +
              'entre uno o varios propietarios y un inmueble.'},
        { nombre: 'Contratos', ruta: '/contratos',
          text:'Módulo para la gestión de contratos, tanto creación como edición. Aquí podrás determinar, además de las características ' +
              'principales de un contrato, si el contrato está activo mediante el campo "estado". Esto determinará la generación de movimientos ' +
              'automáticamente asociados al contrato. No se permite eliminar un contrato que tenga asociados algún movimiento o alguna renta.'},
        { nombre: 'Rentas', ruta: '/rentas',
          text:'Módulo para la gestión de rentas. Las rentas son elementos siempre asociados a un contrato, así que la primera renta ' +
              'se creará durante el proceso de creación del contrato. Desde este módulo se puede editar una renta existente si se indica la fecha de la misma ' +
              'o generar una actualización de renta para un contrato. Si no se especifica fecha en la actualización de la renta, se indicará por defecto ' +
              'la fecha actual.'},
        { nombre: 'Movimientos', ruta: '/movimientos',
          text:'Módulo para la gestión de movimientos. Los movimientos pueden ser de tipo periódico o ad-hoc. Se crean a partir de un contrato, a partir de los campos ' +
              'indicados en el formulario, de forma que la generación de los movimientos periódicos relacionados con el alquiler será automática. ' +
              ' También se pueden generar movimientos puntuales, o "ad-hoc", asociados al contrato en cualquier momento por conceptos ' +
              'diferentes al del propio alquiler. No se permite eliminar un movimiento cuyo estado no se modifique a "anulado" (por seguridad) ni cualquier ' +
              'movimiento que tenga un abono asociado.'},
        { nombre: 'Abonos', ruta: '/abonos',
          text:'Módulo para la gestión de abonos. Los abonos se asocian a un movimiento y muestran la relación del movimiento con algunos detalles del contrato. '+
        'Un abono no puede reasignarse pero sí eliminarse, de manera que el movimiento asociado y, por tanto, los saldos del contrato y del inquilino relacionados '  +
        'se restablecerán a su estado anterior al abono.'},
        { nombre: 'Mapa', ruta: '/mapa',
          text:'En el mapa podrás encontrar las propiedades por su ubicación y obtener con acceso rápido y visual un pequeño resumen del estatus de cada una .'},
        { nombre: 'Modelo', ruta: '/model',
          text:'En esta sección podrás entender los campos que componen las distintas tablas de la base de datos y cómo se relacionan entre ellos'},
        // Añade aquí más rutas según sea necesario
      ],
    };
  },
};
</script>