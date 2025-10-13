import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import { precioUnitarioDTO } from '../../tsPrecioUnitario';
import { image } from './types/imagen';

import { numeroALetras } from 'src/app/compras/orden-compra/NumeroALetras';
import { proyectoDTO } from 'src/app/proyectos/proyecto/tsProyecto';
import { Reporte } from './types/reporte';
import { style } from '@angular/animations';
import { de } from 'date-fns/locale';

/**
 * Imprime un reporte de presupuesto en formato PDF.
 *
 * @param {Reporte} reporte Información del presupuesto a imprimir.
 * @returns {void} No devuelve nada, descarga el archivo PDF.
 */
export function imprimirReporteAnalisisPU(reporte: Reporte) {
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
    smallRight: {
      fontSize: 8,
      alignment: 'right',
    },
    smallCenter: {
      fontSize: 8,
      alignment: 'center',
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
  reporte.precioUnitario.forEach((pu, index) => {
    //imagen
  content.push({
    columns: [
      {
        stack: [
          {
            image: reporte.base64!=''? reporte.base64: image,
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
    [{ text: 'Análisis de precios unitarios', style: 'subheader' }],
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


    content.push({
    columns: [
        { width: '70%', text: `Clave: ${pu.codigo}`, style: 'small' },
        { width: '15%', text: 'Unidad :', style: 'small'},
        {width: '15%', text: `${pu.unidad}`, style: 'smallCenter'},
    ],
  });
  content.push({
    columns: [
        { width: '70%', text: pu.descripcion, style: 'small' },
        { width: '15%', text: 'Cantidad :\nPrecio unitario :\nTotal :', style: 'small'},
        {width: '15%', text: `${pu.cantidadConFormato}\n${pu.precioUnitarioConFormato}\n${pu.importeConFormato}`, style: 'smallRight'},        
    ],
  });

  const tableHeader = [
    [
      { text: 'C Clave', style: 'subheader', alignment: 'center' },
      { text: 'Descripción', style: 'subheader', alignment: 'center' },
      { text: 'Unidad', style: 'subheader', alignment: 'center' },
      { text: 'Cantidad', style: 'subheader', alignment: 'center' },
      {
        text: 'Costo unitario',
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
      widths: [70, '*', 30, 60, 60, 60],
      body: tableHeader,
    },
  });

  content.push({
  text: 'Conceptos', style: 'subheader',
  });

  const tableBodyProyecto: any = [];

  var detalles = reporte.detallesPrecioUnitario.filter(
      (detalle) => detalle.idPrecioUnitario === pu.id
    )
    detalles.forEach(detalle => {
      tableBodyProyecto.push([
      {
        text: (detalle.esCompuesto ? '+ ' : '  '),
        style: { fontSize: 8 },
      },
      {
        text: detalle.codigo,
        style: detalle.esCompuesto ? { fontSize: 8, color: '#1c398e' } : { fontSize: 8 },
      },
      {
        text: detalle.descripcion,
        style: { fontSize: 8 },
        
      },
      { text: detalle.unidad || '', style: 'small' },
      {
        text: detalle.cantidadConFormato || '',
        style: detalle.esCompuesto ? { fontSize: 8, color: '#1c398e', alignment: 'right' } : { fontSize: 8, alignment: 'right' },
      },
      {
        text: `$${detalle.costoBaseConFormato}` || '',
        style: {fontSize: 8, color: '#1c398e', alignment: 'right'},
      },
      {
        text: `${(detalle.importeConFormato)}` || '',
        style: 'smallRight',
      },
    ]);
    });

    content.push({
    margin: [0, 0, 0, 0],
    layout: {
      hLineWidth: () => 0, // todas las líneas horizontales
      vLineWidth: () => 0, // todas las líneas verticales
    },
    table: {
      headerRows: 0,
      widths: [10, 60, '*', 30, 60, 60, 60],
      body: tableBodyProyecto,
    },
  });

  content.push({
  text: 'Total de conceptos', style: 'subheader',
  });

  // Formatear con separadores de miles y dos decimales
const formato = new Intl.NumberFormat('es-ES', {
minimumFractionDigits: 2,
maximumFractionDigits: 2,
});

  let IndirectoPorcentaje = reporte.indirectos.find(i=>i.codigo === '001')?.porcentaje;
  if(IndirectoPorcentaje == undefined){
    IndirectoPorcentaje = 0
  }
  let IndirectoPorcentajeConFormato = reporte.indirectos.find(i=>i.codigo === '001')?.porcentajeConFormato;
  if(IndirectoPorcentajeConFormato == undefined || IndirectoPorcentajeConFormato == null || IndirectoPorcentajeConFormato == ''){
    IndirectoPorcentajeConFormato = '0.00%'
  }
  let FinanciamientoPorcentaje = reporte.indirectos.find(i=>i.codigo === '002')?.porcentaje;
  if(FinanciamientoPorcentaje == undefined){
    FinanciamientoPorcentaje = 0
  }
  let FinanciamientoPorcentajeConFormato = reporte.indirectos.find(i=>i.codigo === '002')?.porcentajeConFormato;
  if(FinanciamientoPorcentajeConFormato == undefined || FinanciamientoPorcentajeConFormato == null || FinanciamientoPorcentajeConFormato == ''){
    FinanciamientoPorcentajeConFormato = '0.00%'
  }
  let UtilidadPorcentajeConFormato = reporte.indirectos.find(i=>i.codigo === '003')?.porcentajeConFormato;
  if(UtilidadPorcentajeConFormato == undefined || UtilidadPorcentajeConFormato == null || UtilidadPorcentajeConFormato == ''){
    UtilidadPorcentajeConFormato = '0.00%'
  }
  let UtilidadPorcentaje = reporte.indirectos.find(i=>i.codigo === '003')?.porcentaje;
  if(UtilidadPorcentaje == undefined){
    UtilidadPorcentaje = 0
  }
  let CargosAdicionalesPorcentaje = reporte.indirectos.find(i=>i.codigo === '004')?.porcentaje;
  if(CargosAdicionalesPorcentaje == undefined){
    CargosAdicionalesPorcentaje = 0
  }
  let CargosAdicionalesPorcentajeConFormato = reporte.indirectos.find(i=>i.codigo === '004')?.porcentajeConFormato;
  if(CargosAdicionalesPorcentajeConFormato == undefined || CargosAdicionalesPorcentajeConFormato == null || CargosAdicionalesPorcentajeConFormato == ''){
    CargosAdicionalesPorcentajeConFormato = '0.00%'
  }
  const indirectos = (IndirectoPorcentaje/100)*pu.precioUnitario;
  const indirectosConFormato = formato.format(indirectos); 
  const financiamientos = (FinanciamientoPorcentaje/100)*pu.precioUnitario;
  const financiamientosConFormato = formato.format(financiamientos);
  const utilidad = (UtilidadPorcentaje/100)*pu.precioUnitario;
  const utilidadConFormato = formato.format(utilidad);
  const cargosAdicionales = (CargosAdicionalesPorcentaje/100)*pu.precioUnitario;
  const cargosAdicionalesConFormato = formato.format(cargosAdicionales);
  const cantidadIva = pu.precioUnitario * (reporte.proyecto.porcentajeIva / 100);  
  const cantidadIvaConFormato = formato.format(cantidadIva); 
  const subtotal = pu.precioUnitario + indirectos+utilidad+cargosAdicionales+financiamientos;
  const subtotalConFormato = formato.format(subtotal); 
  const total = subtotal + cantidadIva;
  const totalConFormato = formato.format(total); 

  content.push({
    columns: [
      { width: '*', text: '' },
      {
        width: 'auto',
        table: {
          body: [
            // booleano de iva opcional
            // ...(reporte.imprimirImpuesto
            //   ? [
            //       [
            //         {
            //           text: 'IVA ' + reporte.proyecto.porcentajeIva + '%',
            //           style: 'smallCantidadTotal',
            //         },
            //         {
            //           text: ` ${reporte.totalIva}`,
            //           style: 'smallCantidadTotal',
            //           alignment: 'right',
            //         },
            //       ],
            //     ]
            //   : []),
              [
                { text: 'Costo directo', style: 'smallCantidadTotal'},
                { text: pu.precioUnitarioConFormato, style: 'smallCantidadTotal'}
              ],
              [
                { text: `Indirectos(${IndirectoPorcentajeConFormato})`, style: 'smallCantidadTotal'},
                { text: `$${indirectosConFormato}`, style: 'smallCantidadTotal'}
              ],
              [
                { text: `Financiamiento(${FinanciamientoPorcentajeConFormato})`, style: 'smallCantidadTotal'},
                { text: `$${financiamientosConFormato}`, style: 'smallCantidadTotal'}
              ],
              [
                { text: `Utilidad(${UtilidadPorcentajeConFormato})`, style: 'smallCantidadTotal'},
                { text: `$${utilidadConFormato}`, style: 'smallCantidadTotal'}
              ],
              [
                { text: `Cargos adicionales(${CargosAdicionalesPorcentajeConFormato})`, style: 'smallCantidadTotal'},
                { text: `$${cargosAdicionalesConFormato}`, style: 'smallCantidadTotal'}
              ],
            [
              { text: 'Precio unitario', style: 'smallCantidadTotal' },
              {
                text: `${pu.precioUnitarioConFormato}`,
                style: 'smallCantidadTotal',
                alignment: 'right',
              },
            ],
            [
                { text: 'Subtotal', style: 'smallCantidadTotal'},
                { text: `$${subtotalConFormato}`, style: 'smallCantidadTotal'}
              ],
            [
              { text: `IVA(${reporte.proyecto.porcentajeIva})%`, style: 'smallCantidadTotal' },
              {
                text: `$${cantidadIvaConFormato}`,
                style: 'smallCantidadTotal',
                alignment: 'right',
              },
            ],
            [
              { text: 'Total', style: 'smallCantidadTotal' },
              {
                text: `$${totalConFormato}`,
                style: 'smallCantidadTotal',
                alignment: 'right',
              },
            ],
          ],
        },
        layout: {
          hLineColor: () => '#fff',
          vLineColor: () => '#fff',
          hLineWidth: () => 0,
          vLineWidth: () => 0,
        },
        margin: [0, 0, 0, 0],
      },
    ],
  });

  if (reporte.importeConLetra) {
    totalEnLetras = numeroALetras(total);

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
            hLineColor: () => '#fff',
            vLineColor: () => '#fff',
            hLineWidth: () => 0,
            vLineWidth: () => 0,
          },
          margin: [0, 0, 0, 5],
        },
      ],
    });
  }

  if(reporte.precioUnitario[index+1]!=null){
    content.push([
      {text: '', pageBreak: 'after'},
    ])
  }

  });

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

  pdfMake
    .createPdf(docDefinition)
    .download(`Análisis de precio unitario${reporte.titulo}.pdf`);
}

export function imprimirReporteManoObra(reporte: Reporte) {
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
    smallRight: {
      fontSize: 8,
      alignment: 'right',
    },
    smallCenter: {
      fontSize: 8,
      alignment: 'center',
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
            image: reporte.base64!=''? reporte.base64: image,
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
    [{ text: 'Presupuesto de mano de obra', style: 'subheader' }],
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

  const tableHeader = [
    [
      { text: 'Clave', style: 'subheader', alignment: 'center' },
      { text: 'Descripción', style: 'subheader', alignment: 'center' },
      { text: 'Unidad', style: 'subheader', alignment: 'center' },
      { text: 'Cantidad', style: 'subheader', alignment: 'center' },
      {
        text: 'Precio unitario',
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
      widths: [70, '*', 30, 60, 60, 60],
      body: tableHeader,
    },
  });
  let tableBodyProyecto: any = [];
  reporte.preciosUnitariosManoObra.preciosUnitarios.forEach((pu, index) => {
  if(pu.detalles.length>0){
    tableBodyProyecto.push([
      {
        text: pu.codigo,
        style: 'small',
      },
      {
        text: pu.descripcion,
        style: 'smallColored',
        alignment: 'justify',
      },
      { text:'', style: 'small'},
      { text:'', style: 'small'},
      { text:'', style: 'small'},
      { text:'', style: 'small'},
      ]);
    // var detalles = reporte.preciosUnitariosManoObra.filter((detalle) => detalle.idPrecioUnitario === pu.id)
    var detalles = pu.detalles;
      // content.push({
      //   text: pu.descripcion, style: 'subheader',
      // });
      detalles.forEach(detalle => {
      tableBodyProyecto.push([
      {
        text: detalle.codigo,
        style: { fontSize: 8 },
      },
      {
        text: detalle.descripcion,
        style: { fontSize: 8 },
        alignment: 'justify',
      },
      { text: detalle.unidad || '', style: 'small' },
      {
        text: detalle.cantidadConFormato || '',
        style: { fontSize: 8, alignment: 'right' },
      },
      {
        text: `${detalle.costoUnitarioConFormato}` || '',
        style: {fontSize: 8, color: '#1c398e', alignment: 'right'},
      },
      {
        text: `${(detalle.importeConFormato)}` || '',
        style: 'smallRight',
      },
      ]);
      content.push({
        margin: [0, 0, 0, 0],
        layout: {
          hLineWidth: () => 0, // todas las líneas horizontales
          vLineWidth: () => 0, // todas las líneas verticales
        },
        table: {
          headerRows: 0,
          widths: [70, '*', 30, 60, 60, 60],
          body: tableBodyProyecto,
        },
      });
    tableBodyProyecto = [];
    });
    content.push({
      columns: [
        { width: '*', text: `Total de ${pu.descripcion}`, style: 'smallColored' },
        {
          width: 'auto',
          table: {
            widths: ['auto'],
            body: [
              [
                {
                  text: pu.totalConFormatoDePU,
                  style: 'smallColored',
                },
              ],
            ],
          },
          layout: {
            hLineColor: () => '#fff',
            vLineColor: () => '#fff',
            hLineWidth: () => 0,
            vLineWidth: () => 0,
          },
          margin: [0, 0, 0, 5],
        },
      ],
    });

      // Formatear con separadores de miles y dos decimales
    const formato = new Intl.NumberFormat('es-ES', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
    });
  }
  });
  content.push({
      columns: [
        { width: '*', text: 'Total de Presupuesto', style: 'smallBold' },
        {
          width: 'auto',
          table: {
            widths: ['auto'],
            body: [
              [
                {
                  text: reporte.preciosUnitariosManoObra.totalConFormato,
                  style: 'smallBold',
                },
              ],
            ],
          },
          layout: {
            hLineColor: () => '#fff',
            vLineColor: () => '#fff',
            hLineWidth: () => 0,
            vLineWidth: () => 0,
          },
          margin: [0, 0, 0, 5],
        },
      ],
    });
  if (reporte.importeConLetra) {
    totalEnLetras = numeroALetras(reporte.preciosUnitariosManoObra.total);

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
            hLineColor: () => '#fff',
            vLineColor: () => '#fff',
            hLineWidth: () => 0,
            vLineWidth: () => 0,
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

  pdfMake
    .createPdf(docDefinition)
    .download(`Presupuesto de mano de obra${reporte.titulo}.pdf`);
}

export function imprimirReporte(reporte: Reporte) {
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
