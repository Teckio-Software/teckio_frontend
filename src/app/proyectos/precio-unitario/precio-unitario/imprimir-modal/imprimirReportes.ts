import { color, fontSize, textAlign } from '@mui/system';
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import { precioUnitarioDTO } from '../../tsPrecioUnitario';
import { image } from './imagen';
import { text } from 'stream/consumers';
import { stackClasses } from '@mui/material';

export function imprimirCompleto(
  precioUnitario: precioUnitarioDTO[],
  titulo: string,
  encabezadoIzq: string,
  encabezadoCentro: string,
  encabezadoDerecha: string,
  margenSuperior: number,
  margenInferior: number,
  margenIzquierdo: number,
  margenDerecho: number
) {
  (<any>pdfMake).addVirtualFileSystem(pdfFonts);

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

  //header
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
    [{ text: 'Proyecto', style: 'subheader' }],
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

  //tabla de partidas
  const tableBodyProyecto = [
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

      hLineWidth: (i: number, node: any) => {
        // Línea superior de la tabla
        if (i === 0) return 0.5;
        // Línea inferior del header
        if (i === 1) return 0.5;
        // Nada en el body
        return 0.5;
      },

      vLineWidth: (i: number, node: any) => {
        // 👉 Solo líneas verticales en el header
        if (node.table.body && node.table.body.length > 0) {
          // pero como queremos quitar las exteriores en el body,
          // devolvemos 0 siempre (sin importar si es borde izq/der)
          return 0.5;
        }
        return 0;
      },

      vLineColor: () => 'transparent',
    },
    table: {
      headerRows: 1,
      widths: [60, '*', 30, 60, 60, 60],
      body: tableBodyProyecto,
    },
  });

  const tableBodyProyectoContenido = [
    ...precioUnitario.map((item) => {
      return [
        { text: item.codigo, style: 'small' },
        { text: item.descripcion, style: 'small' },
        { text: '', style: 'small' },
        { text: '', style: 'small' },
        { text: '', style: 'small' },
        { text: '', style: 'small' },
      ];
    }),
  ];

  content.push({
    margin: [0, 0, 0, 0],
    layout: {
      hLineWidth: () => 0, // todas las líneas horizontales = 0
      vLineWidth: () => 0, // todas las líneas verticales = 0
    },
    table: {
      headerRows: 1,
      widths: ['*', '*', 30, 60, 60, 60],
      body: tableBodyProyectoContenido,
    },
  });

  //tabla de partidas con hijos
  const tableBodyHijos = precioUnitario.flatMap((item) =>
    item.hijos ? mapHijos(item.hijos) : []
  );

  content.push({
    margin: [0, 0, 0, 0],
    layout: {
      hLineWidth: () => 0, // todas las líneas horizontales = 0
      vLineWidth: () => 0, // todas las líneas verticales = 0
    },
    table: {
      headerRows: 1,
      widths: [60, '*', 30, 60, 60, 60],
      body: tableBodyHijos,
    },
  });

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

export function imprimirMarcado() {
  console.log('Imprimiendo marcado');
}

function mapHijos(hijos: any[], nivel = 1): any[] {
  return hijos.flatMap((hijo) => {
    const style = nivel === 1 ? 'smallColored' : 'small';
    let fila;

    if (nivel === 1) {
      // Hijo directo (azul) → solo 2 columnas
      fila = [
        { text: hijo.codigo, style },
        { text: hijo.descripcion, style },
        { text: '', style },
        { text: '', style },
        { text: '', style },
        { text: '', style },
      ];
    } else {
      // Nietos → todas las columnas
      fila = [
        { text: hijo.codigo, style },
        { text: hijo.descripcion, style },
        { text: hijo.unidad, style },
        { text: hijo.cantidadConFormato, style },
        { text: hijo.precioUnitarioConFormato, style },
        { text: hijo.importeConFormato, style },
      ];
    }

    // Recorremos recursivamente los hijos
    const subFilas = hijo.hijos ? mapHijos(hijo.hijos, nivel + 1) : [];

    // Si es hijo directo (nivel 1), agregamos una fila de total después de sus hijos
    if (nivel === 1 && hijo.hijos && hijo.hijos.length > 0) {
      // sumamos importes de los hijos

      const totalFila = [
        {
          text: `Total de ${hijo.descripcion}`,
          style: 'styleTotal',
          colSpan: 5,
          margin: [68, 0, 0, 0],
        },
        {},
        {},
        {},
        {},
        { text: hijo.importeConFormato || '0.00', style: 'styleTotal' },
      ];
      return [fila, ...subFilas, totalFila];
    }

    return [fila, ...subFilas];
  });
}
