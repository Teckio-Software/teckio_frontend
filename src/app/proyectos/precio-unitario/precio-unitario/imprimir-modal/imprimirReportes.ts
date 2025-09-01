import { color, fontSize, textAlign } from '@mui/system';
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import { precioUnitarioDTO } from '../../tsPrecioUnitario';
import { image } from './imagen';
import { text } from 'stream/consumers';
import { stackClasses } from '@mui/material';
import { log } from 'console';
import { numeroALetras } from 'src/app/compras/orden-compra/NumeroALetras';

export function imprimirReporte(
  precioUnitario: precioUnitarioDTO[],
  titulo: string,
  encabezadoIzq: string,
  encabezadoCentro: string,
  encabezadoDerecha: string,
  margenSuperior: number,
  margenInferior: number,
  margenIzquierdo: number,
  margenDerecho: number,
  importeConLetra: boolean
) {
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
            text: [{ text: `${encabezadoIzq}`, bold: true }],
            style: 'header',
            alignment: 'left',
          },
        ],
      },
      {
        stack: [
          {
            text: [{ text: `${encabezadoCentro}`, bold: true }],
            style: 'header',
            alignment: 'center',
          },
        ],
      },
      {
        stack: [
          {
            text: [{ text: `${encabezadoDerecha}`, bold: true }],
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
    [{ text: titulo, style: 'small' }],
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
      { text: 'Clave', style: 'subheader' },
      { text: 'Descripción', style: 'subheader' },
      { text: 'Unidad', style: 'subheader' },
      { text: 'Cantidad', style: 'subheader' },
      { text: 'P.U.', style: 'subheader' },
      { text: 'Total', style: 'subheader' },
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
      widths: [60, '*', 30, 60, 60, 60],
      body: tableHeader,
    },
  });

  const tableBodyProyecto: any = [];

  precioUnitario.forEach((proyecto) => {
    const esPadreConHijos = proyecto.hijos?.length > 0;

    tableBodyProyecto.push([
      { text: proyecto.codigo, style: 'small' },
      { text: proyecto.descripcion, style: 'small' },
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
      const filasHijos = mapHijos(proyecto.hijos);
      filasHijos.forEach((filaHijo) => tableBodyProyecto.push(filaHijo));
    }
  });

  content.push({
    margin: [0, 0, 0, 0],
    layout: {
      hLineWidth: () => 0, // todas las líneas horizontales = 0
      vLineWidth: () => 0, // todas las líneas verticales = 0
    },
    table: {
      headerRows: 0, // ya pusimos header aparte
      widths: [60, '*', 30, 60, 60, 60],
      body: tableBodyProyecto,
    },
  });

  content.push({
    text: '\n',
  });

  precioUnitario.forEach((proyecto) => {
    const totalMasIva: number = Number(
      (Number(proyecto.importe) * 0.16).toFixed(2)
    );

    const subtotal = (Number(proyecto.importe) - totalMasIva).toFixed(2);

    content.push({
      text: `Subtotal de ${proyecto.codigo}  $  ${subtotal}`,
      style: 'styleTotal',
      colSpan: 5,
      margin: [0, 0, 0, 0],
      alignment: 'right',
    });
  });

  content.push({
    text: '\n',
  });

  precioUnitario.forEach((proyecto) => {
    const totalMasIva: number = Number(
      (Number(proyecto.importe) * 0.16).toFixed(2)
    );

    content.push(
      {},
      {},
      {},
      {},
      {},
      {
        text: `IVA 16%  $  ${totalMasIva}`,
        style: 'smallCantidadTotal',
      }
    );
  });

  content.push({
    text: '\n',
  });

  precioUnitario.forEach((proyecto) => {
    content.push(
      {},
      {},
      {},
      {},
      {},
      {
        text: `Total  $  ${proyecto.costoUnitarioConFormato}`,
        style: 'smallCantidadTotal',
      }
    );
  });

  content.push({
    text: '\n',
  });

  if (importeConLetra) {
    precioUnitario.forEach((proyecto) => {
      totalEnLetras = numeroALetras(proyecto.costoUnitario);
      content.push(
        {},
        {},
        {},
        {},
        {},
        {
          text: `${totalEnLetras}`,
          style: 'smallCantidadTotal',
        }
      );
    });
  }

  const docDefinition: any = {
    content,
    styles,
    pageMargins: [
      margenIzquierdo,
      margenSuperior,
      margenDerecho,
      margenInferior,
    ],
  };

  pdfMake.createPdf(docDefinition).download();
}

function mapHijos(hijos: any[], nivel = 1): any[] {
  return hijos.flatMap((hijo) => {
    let color = '#000000';
    if (hijo.hijos?.length > 0) {
      switch (nivel) {
        case 1:
          color = '#1c398e'; // azul
          break;
        case 2:
          color = '#0b8f5c'; // verde
          break;
        case 3:
          color = '#e67e22'; // naranja
          break;
        default:
          color = '#7f8c8d'; // gris
      }
    }

    const esPadreConHijos = hijo.hijos?.length > 0;

    // asignar estilo
    const style = esPadreConHijos
      ? { fontSize: 8, bold: true, color }
      : { fontSize: 8 };

    // fila base (ojo: si tiene hijos → celdas numéricas vacías)
    const fila = [
      { text: hijo.codigo, ...style, margin: [0, 0, 0, 0] },
      { text: hijo.descripcion, ...style, margin: [0, 0, 0, 0] },
      { text: esPadreConHijos ? '' : hijo.unidad, ...style },
      {
        text: esPadreConHijos ? '' : ` $ ${hijo.cantidadConFormato}`,
        style: { ...style, alignment: 'right' },
      },
      {
        text: esPadreConHijos ? '' : ` $ ${hijo.precioUnitarioConFormato}`,
        style: { ...style, alignment: 'right' },
      },
      {
        text: esPadreConHijos ? '' : ` $ ${hijo.importeConFormato}`,
        style: { ...style, alignment: 'right' },
      },
    ];

    // recorrer hijos recursivamente
    const subFilas = hijo.hijos ? mapHijos(hijo.hijos, nivel + 1) : [];

    // fila de total si tiene hijos
    let filas = [fila, ...subFilas];
    if (esPadreConHijos) {
      const totalFila = [
        {
          text: `Total de ${hijo.descripcion}`,
          style: 'styleTotal',
          colSpan: 5,
          margin: [0, 0, 0, 0],
        },
        {},
        {},
        {},
        {},
        { text: ` $ ${hijo.importeConFormato}`, style: 'smallCantidadTotal' },
      ];
      filas.push(totalFila);
    }

    return filas;
  });
}

export function imprimirMarcado(puMarcado: precioUnitarioDTO[]) {}
