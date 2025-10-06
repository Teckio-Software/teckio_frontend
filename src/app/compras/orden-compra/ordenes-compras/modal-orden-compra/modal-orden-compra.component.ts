import { map } from 'rxjs';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import jsPDF from 'jspdf';
import { EmpresaDTO } from 'src/app/catalogos/empresas/empresa';
import { SeguridadService } from 'src/app/seguridad/seguridad.service';
import { UsuarioEmpresaService } from 'src/app/seguridad/Servicios/usuario-empresa.service';
import { ordenCompraDTO } from '../../tsOrdenCompra';
import { contratistaDTO } from 'src/app/catalogos/contratista/tsContratista';
import { ContratistaService } from 'src/app/catalogos/contratista/contratista.service';
import { da } from 'date-fns/locale';
import { ProyectoService } from 'src/app/proyectos/proyecto/proyecto.service';
import { proyectoDTO } from 'src/app/proyectos/proyecto/tsProyecto';
import { insumoXOrdenCompraDTO } from 'src/app/compras/insumoxordencompra/tsInsumoXOrdenCompra';
import { InsumoXOrdenCompraService } from 'src/app/compras/insumoxordencompra/insumoxordencompra.service';
import { numeroALetras } from '../../NumeroALetras';
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import { text } from '@fortawesome/fontawesome-svg-core';
import { style } from '@angular/animations';
import { fontSize, height, textAlign, width } from '@mui/system';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

@Component({
  selector: 'app-modal-orden-compra',
  templateUrl: './modal-orden-compra.component.html',
  styleUrls: ['./modal-orden-compra.component.css'],
})
export class ModalOrdenCompraComponent {
  @Input() isOpen: boolean = false;
  @Input() ordenCompra!: ordenCompraDTO;
  @Output() close = new EventEmitter<void>();

  empresasPertenecientes: EmpresaDTO[] = [];
  empresaSeleccionada: EmpresaDTO = {
    estatus: false,
    fechaRegistro: new Date(),
    guidEmpresa: '',
    id: 0,
    idCorporativo: 0,
    nombreComercial: '',
    rfc: '',
    sociedad: '',
    codigoPostal: '',
  };
  selectedEmpresa: number = 0;
  selectedProyecto: number = 0;
  proyevctos: proyectoDTO[] = [];
  contratistas: contratistaDTO[] = [];
  contratista: contratistaDTO = {
    id: 0,
    razonSocial: '',
    rfc: '',
    esProveedorServicio: false,
    esProveedorMaterial: false,
    representanteLegal: '',
    telefono: '',
    email: '',
    domicilio: '',
    nExterior: '',
    colonia: '',
    municipio: '',
    codigoPostal: '',
    idCuentaContable: 0,
    idIvaAcreditableContable: 0,
    idIvaPorAcreditar: 0,
    idCuentaAnticipos: 0,
    idCuentaRetencionISR: 0,
    idCuentaRetencionIVA: 0,
    idEgresosIvaExento: 0,
    idEgresosIvaGravable: 0,
    idIvaAcreditableFiscal: 0,
  };

  proyecto: proyectoDTO = {
    id: 0,
    codigoProyecto: '',
    nombre: '',
    noSerie: 0,
    moneda: '',
    presupuestoSinIva: 0,
    tipoCambio: 0,
    presupuestoSinIvaMonedaNacional: 0,
    porcentajeIva: 0,
    presupuestoConIvaMonedaNacional: 0,
    anticipo: 0,
    codigoPostal: 0,
    domicilio: '',
    fechaInicio: new Date(),
    fechaFinal: new Date(),
    tipoProgramaActividad: 0,
    inicioSemana: 0,
    esSabado: true,
    esDomingo: true,
    idPadre: 0,
    nivel: 0,
    expandido: false,
    hijos: [],
  };
  insumosXordencompras: insumoXOrdenCompraDTO[] = [];

  constructor(
    private _UsuarioEmpresa: UsuarioEmpresaService,
    private _SeguridadService: SeguridadService,
    private _ContratistaService: ContratistaService,
    private _proyectoService: ProyectoService,
    public _insumoXOrdenCompraService: InsumoXOrdenCompraService
  ) {
    const IdEmpresa = _SeguridadService.obtenIdEmpresaLocalStorage();
    this.selectedEmpresa = Number(IdEmpresa);
    const IdProyecto = _SeguridadService.obtenerIdProyectoLocalStorage();
    this.selectedProyecto = Number(IdProyecto);
  }

  ngOnInit() {
    this._UsuarioEmpresa.obtenEmpresasPorUsuario().subscribe((empresas) => {
      this.empresasPertenecientes = empresas;
      this.empresasPertenecientes.forEach((element) => {
        if (element.id == this.selectedEmpresa) {
          this.empresaSeleccionada = element;
        }
      });
    });

    this._proyectoService
      .obtenerTodosSinEstructurar(this.selectedEmpresa)
      .subscribe((datos) => {
        this.proyevctos = datos;
        this.proyecto = this.proyevctos.filter(
          (z) => z.id == this.selectedProyecto
        )[0];
      });

    this._ContratistaService
      .obtenerTodos(this.selectedEmpresa)
      .subscribe((datos) => {
        this.contratistas = datos;
        console.log(this.contratistas, 'EwE');

        this.contratistas.forEach((element) => {
          console.log(this.ordenCompra.idContratista, 'Sewe');
          if (element.id == this.ordenCompra.idContratista) {
            console.log('entrando', element);

            this.contratista.id = element.id;
            this.contratista.representanteLegal = element.representanteLegal;
            this.contratista.telefono = element.telefono;
            this.contratista.email = element.email;
            this.contratista.codigoPostal = element.codigoPostal;
            this.contratista.representanteLegal = element.representanteLegal;
            this.contratista.rfc = element.rfc;
            this.contratista.domicilio = element.domicilio;
          }
        });
      });
    this.cargarRegistros();
  }

  closeModal() {
    this.close.emit();
  }
  idEmpresaInput: number = 0;
  idOrdenCompraInput: number = 0;

  subtotal: number = 0;
  subtotalConFormato: string = '0.00';
  iva: number = 0;
  ivaConFormato: string = '0.00';
  total: number = 0;
  totalConFormato: string = '0.00';

  totalEnLetras: string = '';

  generarPdf() {
    (<any>pdfMake).addVirtualFileSystem(pdfFonts);

    const content: any[] = [];

    const image =
      'data:image/png;base64,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';

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
        textAlign: 'center',
      },
      smallBold: {
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

    const fecha = format(
      new Date(this.ordenCompra.fechaRegistro),
      "dd 'de' MMMM 'de' yyyy",
      { locale: es }
    );

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
                { text: 'Orden de compra: ', bold: true },
                { text: `${this.ordenCompra.noOrdenCompra}` },
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
              text: [{ text: 'Fecha: ', bold: true }, { text: `${fecha}` }],
              style: 'header',
              alignment: 'left',
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
              text: [
                { text: 'Empresa: ', bold: true },
                { text: this.empresaSeleccionada.nombreComercial + '       ' },
                { text: 'Ciudad: ', bold: true },
                { text: 'Metepec       ' },
                { text: 'RFC: ', bold: true },
                { text: this.empresaSeleccionada.rfc + '       ' },
                { text: 'C.P.: ', bold: true },
                { text: this.empresaSeleccionada.codigoPostal },
              ],
              style: 'header',
              alignment: 'left',
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
                { text: 'Domicilio: ', bold: true },
                { text: `${this.proyecto.domicilio}` },
              ],
              style: 'header',
              alignment: 'left',
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
              text: [
                { text: 'Contratista: ', bold: true },
                { text: `${this.contratista.representanteLegal}       ` },
                { text: 'Ciudad: ', bold: true },
                { text: 'Metepec        ' },
                { text: 'RFC: ', bold: true },
                { text: `${this.empresaSeleccionada.rfc}       ` },
                { text: 'C.P.: ', bold: true },
                { text: `${this.empresaSeleccionada.codigoPostal}` },
              ],
              style: 'header',
              alignment: 'left',
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
                { text: 'Domicilio: ', bold: true },
                { text: `${this.contratista.domicilio}` },
              ],
              style: 'header',
              alignment: 'left',
            },
          ],
        },
      ],
    });

    const tableBodyProject = [
      [{ text: 'Proyecto', style: 'subheader' }],
      [{ text: this.proyecto.codigoProyecto, style: 'small' }],
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

    const tableBodyInsumos = [
      [
        { text: 'Código', style: 'subheader' },
        { text: 'Descripción', style: 'subheader' },
        { text: 'Unidad', style: 'subheader' },
        { text: 'Cantidad', style: 'subheader' },
        { text: 'P.U.', style: 'subheader' },
        { text: 'Importe', style: 'subheader' },
      ],

      ...this.insumosXordencompras.map((insumos) => {
        return [
          { text: insumos.codigo, style: 'small' },
          { text: insumos.descripcion, style: 'small' },
          { text: insumos.unidad, style: 'small' },
          { text: Number(insumos.cantidad).toFixed(4), style: 'small' },
          { text: `$${Number(insumos.precioUnitario).toFixed(2)}`, style: 'small' },
          { text: `$${Number(insumos.importeSinIva).toFixed(2)}`, style: 'small' },
        ];
      }),
    ];

    content.push({
      margin: [0, 10, 0, 10],
      layout: {
        hLineColor: () => '#B9B9B9',
        vLineColor: () => '#B9B9B9',
        hLineWidth: (i: number, node: any) => {
          return i === 0 || i === 1 || i === node.table.body.length ? 0.5 : 0;
        },
        vLineWidth: () => 0.5,
      },
      table: {
        headerRows: 1,
        widths: [60, '*', 50, 60, 50, 60],
        body: tableBodyInsumos,
        style: 'tableHeader',
      },
    });
    const observacionesTexto = this.ordenCompra.observaciones || '';
    const lineasObservacion = observacionesTexto.split('\n').length;

    const tableBodyObservaciones = [
      [
        {
          text: 'Observaciones',
          style: 'subheader',
        },
      ],
      [
        {
          text: observacionesTexto,
          style: 'small',
          margin: [0, 5, 0, 5],
        },
      ],
    ];

    const totalFilasTotales = 4;
    if (lineasObservacion < totalFilasTotales) {
      const filasExtra = totalFilasTotales - lineasObservacion;
      for (let i = 0; i < filasExtra; i++) {
        tableBodyObservaciones.push([
          { text: ' ', margin: [0, 1], style: 'small' },
        ]);
      }
    }

    const numeroDeFilas = tableBodyInsumos.length;

    let margenTop = 90;

    if (numeroDeFilas <= 2) {
      margenTop = 300;
    } else if (numeroDeFilas <= 5) {
      margenTop = 250;
    } else if (numeroDeFilas <= 8) {
      margenTop = 200;
    } else {
      margenTop = 10;
    }

    content.push({
      margin: [0, margenTop, 0, 10],
      columns: [
        {
          width: '69%',
          stack: [
            {
              layout: {
                hLineColor: () => '#B9B9B9',
                vLineColor: () => '#B9B9B9',
                hLineWidth: (i: number, node: any) => {
                  return i === 0 || i === 1 || i === node.table.body.length
                    ? 0.5
                    : 0;
                },
                vLineWidth: () => 0.5,
              },
              table: {
                headerRows: 1,
                widths: ['*'],
                body: tableBodyObservaciones,
                style: 'tableHeader',
              },
            },
          ],
          alignment: 'left',
        },
        {
          width: '2%',
          stack: [
            {
              text: `\n`,
            },
          ],
        },
        {
          width: '29%',
          layout: {
            hLineColor: () => '#B9B9B9',
            vLineColor: () => '#B9B9B9',
            hLineWidth: () => 0.5,
            vLineWidth: () => 0.5,
          },
          table: {
            widths: ['*'],
            body: [
              [
                {
                  text: [
                    { text: 'SUBTOTAL: $', bold: true },
                    { text: `${this.subtotalConFormato} MXN` },
                  ],
                  style: 'small',
                },
              ],
              [
                {
                  text: [{ text: 'DESCUENTO: $', bold: true }, { text: '0.00' }],
                  style: 'small',
                },
              ],
              [
                {
                  text: [
                    { text: '+16% IVA.: $', bold: true },
                    { text: `${this.ivaConFormato}` },
                  ],
                  style: 'small',
                },
              ],
              [
                {
                  text: [
                    { text: `-0 % Ret I.S.R: $`, bold: true },
                    { text: `0.00` },
                  ],
                  style: 'small',
                },
              ],
              [
                {
                  text: [
                    { text: `-0 % Ret IVA: $`, bold: true },
                    { text: `0.00` },
                  ],
                  style: 'small',
                },
              ],
              [
                {
                  text: [
                    { text: 'TOTAL: $', bold: true },
                    { text: `${this.totalConFormato}` },
                  ],
                  style: 'small',
                },
              ],
            ],
          },
          alignment: 'right',
        },
      ],
    });

    content.push({
      margin: [0, 0, 0, 0],

      columns: [
        {
          stack: [
            {
              layout: {
                hLineColor: () => '#B9B9B9',
                vLineColor: () => '#B9B9B9',
                hLineWidth: () => 0.5,
                vLineWidth: () => 0.5,
              },
              table: {
                headerRows: 1,
                widths: ['*'],
                body: [[{ text: `${this.totalEnLetras}`, style: 'smallBold' }]],
              },
            },
          ],
          alignment: 'left',
        },
      ],
    });

    content.push({
      margin: [0, 5, 0, 0],
      columns: [
        {
          stack: [
            {
              layout: {
                hLineColor: () => '#B9B9B9',
                vLineColor: () => '#B9B9B9',
                hLineWidth: () => 0.5,
                vLineWidth: () => 0.5,
              },
              table: {
                headerRows: 1,
                widths: ['*', '*', '*'],
                body: [
                  [
                    {
                      text: 'Elaboró',
                      style: 'smallBold',
                      alignment: 'center',
                    },
                    { text: 'Revisó', style: 'smallBold', alignment: 'center' },
                    {
                      text: 'Autorizó',
                      style: 'smallBold',
                      alignment: 'center',
                    },
                  ],
                  [
                    { text: '\n\n', style: 'small' },
                    { text: '\n\n', style: 'small' },
                    { text: '\n\n', style: 'small' },
                  ],
                ],
              },
            },
          ],
          alignment: 'left',
        },
      ],
    });

    const docDefinition: any = {
      content,
      styles,
    };

    pdfMake
      .createPdf(docDefinition)
      .download(this.ordenCompra.noOrdenCompra + '_' + fecha);
    //.download(this.ordenCompra.noOrdenCompra);
  }

  cargarRegistros() {
    this.subtotal = 0;
    this.iva = 0;
    this.total;
    this.insumosXordencompras = [];
    if (this.selectedEmpresa != 0) {
      if (this.ordenCompra.id > 0) {
        this._insumoXOrdenCompraService
          .ObtenXIdOrdenCompra(this.selectedEmpresa, this.ordenCompra.id)
          .subscribe((datos) => {
            this.subtotal = 0;
            this.total = 0;
            this.iva = 0;
            this.insumosXordencompras = datos;
            this.insumosXordencompras.forEach((element) => {
              this.subtotal = this.subtotal + element.importeSinIva;
              this.total = this.total + element.importeConIva;
              this.iva =
                this.iva + (element.importeConIva - element.importeSinIva);
            });
            this.totalConFormato = new Intl.NumberFormat('es-MX', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            }).format(this.total);
            this.subtotalConFormato = new Intl.NumberFormat('es-MX', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            }).format(this.subtotal);
            this.ivaConFormato = new Intl.NumberFormat('es-MX', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            }).format(this.iva);
            this.totalEnLetras = numeroALetras(this.total);
          });
      }
      // else if (this.idCotizacionInput > 0){
      //   this._insumoXOrdenCompraService.ObtenXIdCotizacion(this.idEmpresaInput, this.idCotizacionInput)
      //     .subscribe((datos) => {
      //       this.insumosXordencompras = datos;
      //     });
      // }else{
      //   this._insumoXOrdenCompraService.ObtenXIdRequisicion(this.idEmpresaInput, this.idRequisicionInput)
      //     .subscribe((datos) => {
      //       this.insumosXordencompras = datos;
      //     });
      // }
    }
  }
}
