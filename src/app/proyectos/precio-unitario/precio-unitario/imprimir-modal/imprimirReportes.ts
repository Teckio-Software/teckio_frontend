import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import { precioUnitarioDTO } from '../../tsPrecioUnitario';
import { image } from './types/imagen';

import { numeroALetras } from 'src/app/compras/orden-compra/NumeroALetras';
import { proyectoDTO } from 'src/app/proyectos/proyecto/tsProyecto';
import { Reporte } from './types/reporte';

/**
 * Imprime un reporte de presupuesto en formato PDF.
 *
 * @param {Reporte} reporte Información del presupuesto a imprimir.
 * @returns {void} No devuelve nada, descarga el archivo PDF.
 */
export function imprimirReporte(reporte: Reporte): void {
  (<any>pdfMake).addVirtualFileSystem(pdfFonts);

  let totalEnLetras: string;

  const content: any[] = [];

  const styles = {
    header: {
      fontSize: 10,
    },
    subheader: {
      fontSize: 8,
      bold: true,
    },
    quote: {
      italics: true,
      fontSize: 8,
    },
    small: {
      fontSize: 8,
    },
    smallCantidad: {
      fontSize: 8,
      alignment: 'right',
    },
    smallCantidadTotal: {
      fontSize: 8,
      alignment: 'right',
      bold: true,
    },

    smallBold: {
      fontSize: 8,
      textAlign: 'center',
      bold: true,
    },
    smallColored: {
      fontSize: 8,
      textAlign: 'center',
      bold: true,
      color: '#1c398e',
    },
    styleTotal: {
      fontSize: 8,
      textAlign: 'center',
      bold: true,
    },
    bold: {
      bold: true,
    },
    rounded: {
      rounded: 10,
    },
    tableHeader: {
      bold: true,
      fontSize: 12,
      color: 'black',
    },
  };

  //imagen
  content.push({
    columns: [
      {
        stack: [
          {
            image: image,
            width: 60,
            height: 60,
            alignment: 'right',
          },
        ],
      },
    ],
  });

  content.push({
    text: '\n',
  });

  content.push({
    columns: [
      {
        stack: [
          {
            text: [{ text: `${reporte.encabezadoIzq}`, bold: true }],
            style: 'header',
            alignment: 'left',
          },
        ],
      },
      {
        stack: [
          {
            text: [{ text: `${reporte.encabezadoCentro}`, bold: true }],
            style: 'header',
            alignment: 'center',
          },
        ],
      },
      {
        stack: [
          {
            text: [{ text: `${reporte.encabezadoDerecha}`, bold: true }],
            style: 'header',
            alignment: 'right',
          },
        ],
      },
    ],
  });

  content.push({
    text: '\n',
  });

  //tabla de proyecto - header y contenido
  const tableBodyProject = [
    [{ text: 'Presupuesto', style: 'subheader' }],
    [{ text: reporte.titulo, style: 'small' }],
  ];

  content.push({
    margin: [0, 10, 0, 10],
    layout: {
      hLineColor: () => '#B9B9B9',
      vLineColor: () => '#B9B9B9',
      hLineWidth: () => 0.5,
      vLineWidth: () => 0.5,
    },
    table: {
      headerRows: 1,
      widths: ['*'],
      body: tableBodyProject,
      style: 'tableHeader',
    },
  });

  // Header de la tabla
  const tableHeader = [
    [
      { text: 'Clave', style: 'subheader', alignment: 'center' },
      { text: 'Descripción', style: 'subheader', alignment: 'center' },
      { text: 'Unidad', style: 'subheader', alignment: 'center' },
      { text: 'Cantidad', style: 'subheader', alignment: 'center' },
      {
        text: reporte.imprimirConCostoDirecto ? 'Costo Directo' : 'P.U.',
        style: 'subheader',
        alignment: 'center',
      },
      { text: 'Total', style: 'subheader', alignment: 'center' },
    ],
  ];

  content.push({
    margin: [0, 0, 0, 0],
    layout: {
      hLineColor: () => '#B9B9B9',
      hLineWidth: () => 0.5, // todas las líneas horizontales
      vLineColor: () => '#B9B9B9',
      vLineWidth: () => 0.5, // todas las líneas verticales
    },
    table: {
      headerRows: 1,
      widths: [85, '*', 30, 60, 60, 60],
      body: tableHeader,
    },
  });

  const tableBodyProyecto: any = [];

  reporte.precioUnitario.forEach((proyecto: precioUnitarioDTO) => {
    const esPadreConHijos = proyecto.hijos?.length > 0;

    tableBodyProyecto.push([
      {
        text: '',
      },
      {
        text: proyecto.codigo,
        style: esPadreConHijos ? { fontSize: 8, bold: true } : { fontSize: 8 },
      },
      {
        text: proyecto.descripcion,
        style: esPadreConHijos ? { fontSize: 8, bold: true } : { fontSize: 8 },
        alignment: 'justify',
      },
      { text: esPadreConHijos ? '' : proyecto.unidad || '', style: 'small' },
      {
        text: esPadreConHijos ? '' : proyecto.cantidadConFormato || '',
        style: 'small',
      },
      {
        text: esPadreConHijos ? '' : proyecto.precioUnitarioConFormato || '',
        style: 'small',
      },
      {
        text: esPadreConHijos ? '' : proyecto.importeConFormato || '',
        style: 'small',
      },
    ]);

    // filas de hijos
    if (proyecto.hijos?.length > 0) {
      const filasHijos = mapHijos(proyecto.hijos, 0, '', reporte);
      filasHijos.forEach((filaHijo: precioUnitarioDTO) => tableBodyProyecto.push(filaHijo));
    }
  });

  content.push({
    margin: [0, 0, 0, 0],
    layout: {
      hLineWidth: () => 0, // todas las líneas horizontales
      vLineWidth: () => 0, // todas las líneas verticales
    },
    table: {
      headerRows: 0,
      widths: [20, 60, '*', 30, 60, 60, 60],
      body: tableBodyProyecto,
    },
  });

  content.push({
    text: '\n',
  });

  const tablaBody = [];

  // subtotales
  reporte.precioUnitario.forEach((precio: precioUnitarioDTO) => {
    const subtotal: number = precio.costoUnitario * precio.cantidad;

    const subtotalconFormato: string = new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
    }).format(subtotal);

    const subtotalConIva = precio.importe * (1 + reporte.proyecto.porcentajeIva / 100);

    const subtotalConIvaConFormato: string = new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
    }).format(subtotalConIva);

    tablaBody.push([
      { text: `Subtotal de ${precio.codigo}`, style: 'styleTotal' },
      {
        text: `${
          reporte.imprimirConCostoDirecto
            ? subtotalconFormato
            : reporte.imprimirConPrecioUnitario
              ? precio.importeConFormato
              : '$ ' + precio.precioUnitarioConFormato
        }`,
        style: 'styleTotal',
        alignment: 'right',
      },
    ]);
  });

  if (
    reporte.imprimirImpuesto &&
    !reporte.imprimirConCostoDirecto &&
    !reporte.imprimirConPrecioUnitario
  ) {
    tablaBody.push([
      {
        text: 'IVA ' + reporte.proyecto.porcentajeIva + '%',
        style: 'smallCantidadTotal',
      },
      {
        text: reporte.totalIva,
        style: 'smallCantidadTotal',
        alignment: 'right',
      },
    ]);
  }

  const totalCostoDirecto: number = reporte.precioUnitario.reduce(
    (acc: number, precio: precioUnitarioDTO) => acc + precio.costoUnitario,
    0,
  );

  const totalCostoDirectoConFormato: string = new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
  }).format(totalCostoDirecto);

  const totalConIva: number = reporte.precioUnitario.reduce(
    (acc: number, precio: precioUnitarioDTO) =>
      acc + precio.importe * (1 + reporte.proyecto.porcentajeIva / 100),
    0,
  );

  const totalSeleccionadoFormateado: string = reporte.imprimirConCostoDirecto
    ? totalCostoDirectoConFormato
    : reporte.imprimirConPrecioUnitario
      ? reporte.totalSinIva
      : reporte.totalConIVA;

  const totalSeleccionadoNumerico: number = reporte.imprimirConCostoDirecto
    ? totalCostoDirecto
    : reporte.imprimirConPrecioUnitario
      ? reporte.total
      : totalConIva;

  tablaBody.push([
    { text: 'Total', style: 'smallCantidadTotal' },
    {
      text: totalSeleccionadoFormateado,
      style: 'smallCantidadTotal',
      alignment: 'right',
    },
  ]);

  content.push({
    columns: [
      { width: '*', text: '' },
      {
        width: 'auto',
        table: {
          widths: ['auto', 'auto'],
          body: tablaBody,
        },
        layout: {
          hLineColor: () => '#B9B9B9',
          vLineColor: () => '#B9B9B9',
          hLineWidth: () => 0.5,
          vLineWidth: () => 0.5,
        },
        margin: [0, 0, 0, 0],
      },
    ],
  });

  if (reporte.importeConLetra) {
    totalEnLetras = numeroALetras(totalSeleccionadoNumerico);

    content.push({
      columns: [
        { width: '*', text: '' },
        {
          width: 'auto',
          table: {
            widths: ['auto'],
            body: [
              [
                {
                  text: `${totalEnLetras}`,
                  style: 'smallBold',
                },
              ],
            ],
          },
          layout: {
            hLineColor: () => '#B9B9B9',
            vLineColor: () => '#B9B9B9',
            hLineWidth: () => 0.5,
            vLineWidth: () => 0.5,
          },
          margin: [0, 0, 0, 5],
        },
      ],
    });
  }

  const docDefinition: any = {
    content,
    styles,
    pageMargins: [
      reporte.margenIzquierdo,
      reporte.margenSuperior,
      reporte.margenDerecho,
      reporte.margenInferior,
    ],
  };

  pdfMake.createPdf(docDefinition).download(`Presupuesto ${reporte.titulo}.pdf`);
}

/**
 * Mapea un array de hijos (con posible propiedad de "hijos" recursiva)
 * a un array de filas para una tabla PDF Make.
 *
 * @param hijos Array de hijos a mapear.
 * @param nivel Nivel de anidamiento actual (opcional, default = 0).
 * @param prefijo Prefijo para el numero de la fila (opcional, default = '').
 * @returns Un array de filas para la tabla.
 */
function mapHijos(
  hijos: precioUnitarioDTO[],
  nivel: number = 0,
  prefijo: string = '',
  reporte: Reporte,
): any[] {
  return hijos.flatMap((hijo: precioUnitarioDTO, index: number) => {
    let color = '#000000';
    if (hijo.hijos?.length > 0) {
      switch (nivel) {
        case 0:
          color = '#1c398e'; // azul
          break;
        case 1:
          color = '#0b8f5c'; // verde
          break;
        case 2:
          color = '#e67e22'; // naranja
          break;
        default:
          color = '#7f8c8d'; // gris
      }
    }

    const esPadreConHijos = hijo.hijos?.length > 0;
    const numero = prefijo ? `${prefijo}.${index + 1}` : `${index + 1}`;
    const style = esPadreConHijos ? { fontSize: 8, bold: true, color } : { fontSize: 8 };

    const selectedProyectoIva = reporte.proyecto.porcentajeIva;

    let total: number = 0;
    const costoDirecto = hijo.costoUnitario * hijo.cantidad;
    const precioUnitario = hijo.precioUnitario * hijo.cantidad;
    const precioUnitarioMasIVA =
      hijo.precioUnitario * hijo.cantidad * (1 + selectedProyectoIva / 100);
    const totalMasIva = hijo.precioUnitario + precioUnitarioMasIVA;

    if (reporte.imprimirConCostoDirecto) {
      total = costoDirecto;
    } else if (reporte.imprimirConPrecioUnitario) {
      total = precioUnitario;
    } else if (reporte.imprimirConPrecioUnitarioIVA) {
      total = totalMasIva;
    }

    // fila base
    const fila = [
      { text: `${numero}`, ...style },
      { text: hijo.codigo, ...style },
      { text: hijo.descripcion, ...style, alignment: 'justify' },
      {
        text: esPadreConHijos ? '' : hijo.unidad,
        ...style,
        alignment: 'right',
      },
      {
        text: esPadreConHijos ? '' : ` $ ${hijo.cantidadConFormato}`,
        style: { ...style, alignment: 'right' },
      },
      {
        text: esPadreConHijos
          ? ''
          : reporte.imprimirConCostoDirecto
            ? `${hijo.costoUnitarioConFormato}`
            : `${hijo.precioUnitarioConFormato}`,
        style: { ...style, alignment: 'right' },
      },
      {
        text: esPadreConHijos ? '' : ` $ ${total.toFixed(2)}`,
        style: { ...style, alignment: 'right' },
      },
    ];

    // recorrer hijos recursivamente
    const subFilas = hijo.hijos ? mapHijos(hijo.hijos, nivel + 1, numero, reporte) : [];

    // fila de total si tiene hijos
    let filas = [fila, ...subFilas];
    if (esPadreConHijos) {
      const totalFila = [
        {},
        {
          text: `Total de ${hijo.descripcion}  $  ${hijo.importeConFormato}`,
          style: { fontSize: 8, bold: true, color },
          alignment: 'right',
          colSpan: 6,
        },
        {},
        {},
        {},
        {},
        {},
      ];
      filas.push(totalFila);
    }

    return filas;
  });
}
