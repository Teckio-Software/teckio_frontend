import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import { image } from '../../precio-unitario/precio-unitario/imprimir-modal/types/imagen';
import { ReporteContratoDTO } from './ReporteContrato';
import { detalleXContratoParaTablaDTO } from '../tsContratos';
import { de } from 'date-fns/locale';
import { numeroALetras } from 'src/app/compras/orden-compra/NumeroALetras';

type TablaFila = any[];

const NUMBER_FORMATTER = new Intl.NumberFormat('es-MX', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export function imprimirReporteContratoPdf(reporte: ReporteContratoDTO) {
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
      columns: [
        {
          stack: [
            {
              text: [
                { text:  reporte.tipoContrato + ": ", bold: true },
                { text: reporte.contratista },
              ],
              alignment: 'left',
              style: 'header',
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

  let importeAnticipoConFormato = new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
  }).format(reporte.contrato.importeAnticipo)


  //tabla contrato header
  const COLUMN_WIDTHS_contrato = [20, "*", "*", "*", "*", "*"];

  const tableHeaderContrato = [
    [
      { text: 'No.', style: 'subheader', alignment: 'center' },
      { text: 'Facha Alta', style: 'subheader', alignment: 'center' },
      { text: 'Anticipo', style: 'subheader', alignment: 'center' },
      { text: 'Porcentaje IVA', style: 'subheader', alignment: 'center' },
      { text: 'Estatus', style: 'subheader', alignment: 'center' },
      { text: 'Importe', style: 'subheader', alignment: 'center' },
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
      widths: COLUMN_WIDTHS_contrato,
      body: tableHeaderContrato,
      style: 'tableHeader'
    },
  });

  const tableHeaderContratoBody = [
    [
      { text: reporte.contrato.numeroDestajo, style: 'small', alignment: 'left' },
      { text: reporte.contrato.fechaRegistro, style: 'small', alignment: 'left' },
      {
        table: {
          widths: ['50%', '50%'], // cada columna ocupa la mitad del ancho
          body: [[
            { text: reporte.contrato.anticipoConFormato, style: 'small', alignment: 'right' },
            { text: importeAnticipoConFormato, style: 'small', alignment: 'right' }
          ]]
        },
      layout: 'noBorders', // quita los bordes de la tabla interna
      },
      { text: reporte.contrato.ivaConFormato, style: 'small', alignment: 'right' },
      { text: reporte.contrato.estatus === 0 ? "Capturado" : reporte.contrato.estatus === 1 ? "Autorizado" : reporte.contrato.estatus === 1 ? "Cerrado" : "Cancelado", style: 'small', alignment: 'left' },
      { text: reporte.contrato.importeTotalConFormato, style: 'small', alignment: 'right' },
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
      widths: COLUMN_WIDTHS_contrato,
      body: tableHeaderContratoBody,
    },
  });


  // Header de la tabla
  const COLUMN_WIDTHS = [120, "*", 30, 60, 70, 40, 40, 45, 55];

  const tableHeader = [
    [
      { text: 'Clave', style: 'subheader', alignment: 'center' },
      { text: 'Descripcion', style: 'subheader', alignment: 'center' },
      { text: 'Unidad', style: 'subheader', alignment: 'center' },
      { text: 'Cantidad', style: 'subheader', alignment: 'center' },
      { text: 'Importe', style: 'subheader', alignment: 'center' },
      { text: 'Asignado', style: 'subheader', alignment: 'center' },
      { text: '%FA', style: 'subheader', alignment: 'center' },
      { text: 'Acumulado', style: 'subheader', alignment: 'center' },
      { text: 'Importe Des.', style: 'subheader', alignment: 'center' },
    ],
  ];


  content.push({
    margin: [0, 10, 0, 10],
    layout: {
      hLineColor: () => '#B9B9B9',
      hLineWidth: () => 0.5, // todas las líneas horizontales
      vLineColor: () => '#B9B9B9',
      vLineWidth: () => 0.5, // todas las líneas verticales
    },
    table: {
      widths: COLUMN_WIDTHS,
      body: tableHeader,
    },
  });

  const tableBodyProyecto: any = [];

  let totalImporteDestajo = 0;

  reporte.detallesContrato.forEach((detalle: detalleXContratoParaTablaDTO) => {
    const esPadreConHijos = detalle.hijos?.length > 0;

    tableBodyProyecto.push([
      {
        text: detalle.codigo,
        style: esPadreConHijos ? { fontSize: 8, bold: true } : { fontSize: 8 },
      },
      {
        text: detalle.descripcion,
        style: esPadreConHijos ? { fontSize: 8, bold: true } : { fontSize: 8 },
        alignment: 'justify',
      },
      {
        text: esPadreConHijos ? '' : detalle.unidad || '',
        style: 'small',
        alignment: 'right',
      },
      {
        text: esPadreConHijos ? '' : detalle.cantidadConFormato || '',
        style: 'small',
        alignment: 'right',
      },
      {
        text: esPadreConHijos ? '' : detalle.importeConFormato || '',
        style: 'small',
        alignment: 'right',
      },
      {
        text: esPadreConHijos ? '' : detalle.porcentajeDestajoConFormato || '',
        style: 'small',
        alignment: 'right',
      },
      {
        text: esPadreConHijos ? '' : detalle.factorDestajoConFormato || '',
        style: 'small',
        alignment: 'right',
      },
      {
        text: esPadreConHijos ? '' : detalle.porcentajeDestajoAcumuladoConFormato || '',
        style: 'small',
        alignment: 'right',
      },
      {
        text: esPadreConHijos ? '' : detalle.importeDestajoConFormato || '',
        style: 'small',
        alignment: 'right',
      },
    ]);

    // filas de hijos
    if (detalle.hijos?.length > 0) {
      const filasHijos = mapHijos(detalle.hijos, 0, '', reporte);
      filasHijos.forEach((filaHijo: detalleXContratoParaTablaDTO) => tableBodyProyecto.push(filaHijo));
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
      widths: COLUMN_WIDTHS,
      body: tableBodyProyecto,
    },
  });

  content.push({
    text: '\n',
  });

  const tablaBody = [];

  // // subtotales
  // reporte.detallesContrato.forEach((detalle: detalleXContratoParaTablaDTO) => {
  //   const subtotal: number = detalle.costoUnitario * detalle.cantidad;

  //   const subtotalconFormato: string = new Intl.NumberFormat('es-MX', {
  //     style: 'currency',
  //     currency: 'MXN',
  //   }).format(subtotal);

  //   const subtotalConIva = detalle.importe * (1 + reporte.contrato.iva / 100);

  //   const subtotalConIvaConFormato: string = new Intl.NumberFormat('es-MX', {
  //     style: 'currency',
  //     currency: 'MXN',
  //   }).format(subtotalConIva);

  //   tablaBody.push([
  //     { text: `Subtotal de ${detalle.codigo}`, style: 'styleTotal' },
  //     {
  //       text: `${
  //         detalle.importeConFormato
  //       }`,
  //       style: 'styleTotal',
  //       alignment: 'right',
  //     },
  //   ]);
  // });

  // if (
  //   reporte.imprimirImpuesto &&
  //   !reporte.imprimirConCostoDirecto &&
  //   !reporte.imprimirConPrecioUnitario
  // ) {
  //   tablaBody.push([
  //     {
  //       text: 'IVA ' + reporte.proyecto.porcentajeIva + '%',
  //       style: 'smallCantidadTotal',
  //     },
  //     {
  //       text: reporte.totalIva,
  //       style: 'smallCantidadTotal',
  //       alignment: 'right',
  //     },
  //   ]);
  // }


  tablaBody.push([
    { text: 'Total', style: 'smallCantidadTotal' },
    {
      text: reporte.contrato.importeTotalConFormato,
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

  if (true) {
    totalEnLetras = numeroALetras(reporte.contrato.importeTotal);

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
    pageOrientation: 'landscape'
  };

  pdfMake.createPdf(docDefinition).download(`${reporte.titulo}.pdf`);
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
  hijos: detalleXContratoParaTablaDTO[],
  nivel: number = 0,
  prefijo: string = '',
  reporte: ReporteContratoDTO,
): any[] {
  return hijos.flatMap((hijo: detalleXContratoParaTablaDTO, index: number) => {
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

    const selectedProyectoIva = reporte.contrato.iva;

    let total: number = 0;
    const costoDirecto = hijo.costoUnitario * hijo.cantidad;
    const precioUnitario = hijo.costoUnitario * hijo.cantidad;
    const precioUnitarioMasIVA =
      hijo.costoUnitario * hijo.cantidad * (1 + selectedProyectoIva / 100);
    const totalMasIva = hijo.costoUnitario + precioUnitarioMasIVA;

    // if (reporte.imprimirConCostoDirecto) {
    //   total = costoDirecto;
    // } else if (reporte.imprimirConPrecioUnitario) {
    //   total = precioUnitario;
    // } else if (reporte.imprimirConPrecioUnitarioIVA) {
    //   total = totalMasIva;
    // }

    // fila base
    const fila = [
      { text: hijo.codigo, ...style },
      { text: hijo.descripcion, ...style, alignment: 'justify' },
      {
        text: esPadreConHijos ? '' : hijo.unidad,
        ...style,
        alignment: 'right',
      },
      {
        text: esPadreConHijos ? '' : `${hijo.cantidadConFormato}`,
        style: { ...style, alignment: 'right' },
      },
      {
        text: esPadreConHijos
          ? ''
          :`${hijo.importeConFormato}`,
        style: { ...style, alignment: 'right' },
      },
      {
        text: esPadreConHijos
          ? ''
          :`${hijo.porcentajeDestajoConFormato}`,
        style: { ...style, alignment: 'right' },
      },

      {
        text: esPadreConHijos
          ? ''
          :`${hijo.factorDestajoConFormato}`,
        style: { ...style, alignment: 'right' },
      },

      {
        text: esPadreConHijos
          ? ''
          :`${hijo.porcentajeDestajoAcumuladoConFormato}`,
        style: { ...style, alignment: 'right' },
      },

      {
        text: esPadreConHijos
          ? ''
          :`${hijo.importeDestajoConFormato}`,
        style: { ...style, alignment: 'right' },
      },
    ];

    // recorrer hijos recursivamente
    const subFilas = hijo.hijos ? mapHijos(hijo.hijos, nivel + 1, numero, reporte) : [];

    // fila de total si tiene hijos
    let filas = [fila, ...subFilas];
    // if (esPadreConHijos) {
    //   const totalFila = [
    //     {},
    //     {
    //       text: `Total de ${hijo.descripcion}  $  ${hijo.importeConFormato}`,
    //       style: { fontSize: 8, bold: true, color },
    //       alignment: 'right',
    //       colSpan: 7,
    //     },
    //     {},
    //     {},
    //     {},
    //     {},
    //     {},
    //     {},
    //     {},
    //   ];
    //   filas.push(totalFila);
    // }

    return filas;
  });
}





