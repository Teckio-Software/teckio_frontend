import { color, fontSize, textAlign } from '@mui/system';
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import { precioUnitarioDTO } from '../../tsPrecioUnitario';
import { image } from './imagen';
import { text } from 'stream/consumers';
import { stackClasses } from '@mui/material';
import { log } from 'console';
import { numeroALetras } from 'src/app/compras/orden-compra/NumeroALetras';
import { proyectoDTO } from 'src/app/proyectos/proyecto/tsProyecto';

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
  importeConLetra: boolean,
  totalSinIVA: string,
  totalConIVA: string,
  proyecto: proyectoDTO,
  totalIva: string
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
      { text: 'Clave', style: 'subheader', alignment: 'center' },
      { text: 'Descripción', style: 'subheader', alignment: 'center' },
      { text: 'Unidad', style: 'subheader', alignment: 'center' },
      { text: 'Cantidad', style: 'subheader', alignment: 'center' },
      { text: 'P.U.', style: 'subheader', alignment: 'center' },
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

  precioUnitario.forEach((proyecto, index) => {
    const esPadreConHijos = proyecto.hijos?.length > 0;

    tableBodyProyecto.push([
      { text: ``, style: 'small' },
      { text: proyecto.codigo, style: 'small' },
      { text: proyecto.descripcion, style: 'small', alignment: 'justify' },
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

  precioUnitario.forEach((precio) => {
    const totalMasIva: number = Number(
      (Number(precio.importe) * 0.16).toFixed(2)
    );

    const subtotal = (Number(precio.importe) - totalMasIva).toFixed(2);

    content.push({
      columns: [
        { width: '*', text: '' },
        {
          width: 'auto',
          table: {
            widths: ['auto', 'auto'],
            body: [
              [
                {
                  text: `Subtotal de ${precio.codigo}`,
                  style: 'styleTotal',
                },
                {
                  text: `$ ${precio.importeConFormato}`,
                  style: 'styleTotal',
                  alignment: 'right',
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
  });

  content.push({
    columns: [
      {
        table: {
          body: [
            [
              {
                text: 'IVA ' + proyecto.porcentajeIva + '%',
                style: 'smallCantidadTotal',
              },
              {
                text: ` ${totalIva}`,
                style: 'smallCantidadTotal',
                alignment: 'right',
              },
            ],
            [
              { text: 'Total', style: 'smallCantidadTotal' },
              {
                text: `$ ${totalConIVA}`,
                style: 'smallCantidadTotal',
                alignment: 'right',
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

  if (importeConLetra) {
    precioUnitario.forEach((proyecto) => {
      totalEnLetras = numeroALetras(proyecto.costoUnitario);

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
            margin: [0, 5, 0, 5],
          },
        ],
      });
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

function mapHijos(hijos: any[], nivel = 1, prefijo = ''): any[] {
  return hijos.flatMap((hijo, index) => {
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

    const numero = prefijo ? `${prefijo}.${index + 1}` : `${index + 1}`;

    const style = esPadreConHijos
      ? { fontSize: 8, bold: true, color }
      : { fontSize: 8 };

    // fila base
    const fila = [
      { text: `${numero}`, style: 'small' },
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
        text: esPadreConHijos ? '' : ` $ ${hijo.precioUnitarioConFormato}`,
        style: { ...style, alignment: 'right' },
      },
      {
        text: esPadreConHijos ? '' : ` $ ${hijo.importeConFormato}`,
        style: { ...style, alignment: 'right' },
      },
    ];

    // recorrer hijos recursivamente
    const subFilas = hijo.hijos ? mapHijos(hijo.hijos, nivel + 1, numero) : [];

    // fila de total si tiene hijos
    let filas = [fila, ...subFilas];
    if (esPadreConHijos) {
      const totalFila = [
        {}, // esta queda sola
        {
          text: `Total de ${hijo.descripcion}  $  ${hijo.importeConFormato}`,
          style: 'smallCantidadTotal',
          alignment: 'right',
          colSpan: 6,
        },
        {},
        {},
        {},
        {},
        {}, // placeholders que ocupa el colspan
      ];
      filas.push(totalFila);
    }

    return filas;
  });
}
