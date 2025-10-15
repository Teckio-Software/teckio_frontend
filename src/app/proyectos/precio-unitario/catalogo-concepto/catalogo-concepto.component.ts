import { ProyectoService } from './../../proyecto/proyecto.service';
import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { PrecioUnitarioService } from '../precio-unitario.service';
import { SeguridadService } from 'src/app/seguridad/seguridad.service';
import { Unidades } from '../unidades';
import { UnidadDTO } from 'src/app/facturacion/unidad/ts.unidad';
import { DatosParaImportarCatalogoGeneralDTO, precioUnitarioDTO } from '../tsPrecioUnitario';
import { precioUnitarioDetalleDTO } from '../../precio-unitario-detalle/tsPrecioUnitarioDetalle';
import { proyectoDTO } from '../../proyecto/tsProyecto';
import { MatDialog } from '@angular/material/dialog';
import {
  DataFSR,
  diasConsideradosDTO,
  factorSalarioIntegradoDTO,
  factorSalarioRealDetalleDTO,
  factorSalarioRealDTO,
  ParametrosFsrXInsumoDTO,
} from '../../fsr/tsFSR';
import { ElementRef, ChangeDetectorRef } from '@angular/core';
import { ConnectedPosition } from '@angular/cdk/overlay';
import { finalize } from 'rxjs';
import Swal from 'sweetalert2';
import { IndirectosComponent } from '../../indirectos/indirectos/indirectos.component';
import { AlertaTipo } from 'src/app/utilidades/alert/alert.component';
import { FSRService } from '../../fsr/fsr.service';
import { conceptoDTO } from 'src/app/catalogos/concepto/concepto';
import { ModalAlertComponent } from 'src/app/utilidades/modal-alert/modal-alert.component';

@Component({
  selector: 'app-catalogo-concepto',
  templateUrl: './catalogo-concepto.component.html',
  styleUrls: ['./catalogo-concepto.component.css'],
})
export class CatalogoConceptoComponent implements OnInit {
  selectedProyecto = 0;
  selectedEmpresa = 0;
  esImportacion = false;
  selectedPU = 0;
  totalSinIvaConFormato = '0.00';
  totalIvaConFormato = '0.00';
  totalConFormato = '0.00';
  selectedIndex: number = 0;
  total: number = 0;
  totalConIva: number = 0;
  matrizMostrada: boolean = false;
  contenedorCatalogoGeneral: boolean = false;
  displayCarga: string = 'none';
  Unidades: string[] = [];
  preciosUnitarios: precioUnitarioDTO[] = [];
  listaVisible: precioUnitarioDTO[] = [];
  precioUnitarioCantidadEditado!: precioUnitarioDTO;
  proyectoSelected!: proyectoDTO;
  preciosMarcados: precioUnitarioDTO[] = [];
  isOpenModalImprimir: boolean = false;
  mostrarMenu = false;
  esAutorizado: boolean = false;
  mostrarBotones: boolean = false;
  contenedorFSR: boolean = false;
  contenedorPresupuesto: boolean = true;
  selectedCantidadConFormato = '0.0000';
  selectedRendimientoConFormato = '$0.0000';
  esAsignarDetalleRendimiento = false;
  cargando = false;
  tooltipVisible = false;
  existeCensatia: boolean = true;
  existeIndirectos: boolean = true;
  isRendimineto: boolean = true;
  isOpereciones: boolean = false;
  isOpenModal: boolean = false;
  mostrarMenuAlertas = false;
  menuAbierto: precioUnitarioDTO | null = null;
  overlayPositions: ConnectedPosition[] = [
    {
      originX: 'end',
      originY: 'top',
      overlayX: 'start',
      overlayY: 'top',
      offsetX: 8,
      offsetY: -4,
    },
    {
      originX: 'end',
      originY: 'bottom',
      overlayX: 'start',
      overlayY: 'bottom',
      offsetX: 8,
      offsetY: 4,
    },
  ];
  contenedorExplosionInsumo: boolean = false;
  appRecarga: number = 0;
  porcentajePrestaciones = 0;
  diasNoLaborales = 0;
  diasPagados = 0;
  existenEstimaciones: boolean = false;
  selectedFileName: string = '';
  mensajeModal: string = '';
  dataFSR: DataFSR = {
    diasConsideradosFsiNoTrabajados: [],
    selectedEmpresa: 0,
    diasConsideradosFsiPagados: [],
    selectedProyecto: 0,
    diasNoLaborales: 0,
    diasPagados: 0,
    fsrDetalles: [],
    porcentajePrestaciones: 0,
    esAutorizado: false,
  };
  fsr: factorSalarioRealDTO = {
    id: 0,
    idProyecto: 0,
    porcentajeFsr: 0,
    esCompuesto: false,
  };
  constructor(
    private precioUnitarioService: PrecioUnitarioService,
    private _seguridadEmpresa: SeguridadService,
    private unidades: Unidades,
    private proyectoService: ProyectoService,
    public dialog: MatDialog,
    private ChangeDetectorRef: ChangeDetectorRef,
    private fsrService: FSRService,
  ) {
    let idEmpresa = _seguridadEmpresa.obtenIdEmpresaLocalStorage();
    let idProyecto = _seguridadEmpresa.obtenerIdProyectoLocalStorage();
    this.selectedProyecto = Number(idProyecto);
    this.selectedEmpresa = Number(idEmpresa);
    this.Unidades = this.unidades.Getunidades();
  }

  ngOnInit(): void {
    this.obtenerRegistros();
    this.proyectoService.obtenerXId(this.selectedPU, this.selectedEmpresa).subscribe((registro) => {
      this.proyectoSelected = registro;
    });
  }

  obtenerRegistros() {
    this.precioUnitarioService
      .obtenerEstructurado(this.selectedProyecto, this.selectedEmpresa)
      .subscribe((preciosUnitarios) => {
        console.log(preciosUnitarios);
        this.preciosUnitarios = preciosUnitarios;
        this.actualizarListaVisible();
      });
  }

  expansionDominio(precioUnitario: precioUnitarioDTO): void {
    precioUnitario.expandido = !precioUnitario.expandido;
    this.actualizarListaVisible();
  }

  exponerCantidad(precioUnitario: precioUnitarioDTO) {
    if (this.precioUnitarioCantidadEditado) {
      this.precioUnitarioCantidadEditado.cantidadEditado = false;
    }
    this.precioUnitarioCantidadEditado = precioUnitario;
    precioUnitario.cantidadEditado = true;
  }

  actualizarCantidad(precioUnitario: precioUnitarioDTO, valor: string): void {
    if (!precioUnitario.cantidadEditado) {
      return;
    }

    const valorRecortado = valor.trim();
    if (valorRecortado === '') {
      return;
    }

    const cantidad = Number(valorRecortado);
    if (!isNaN(cantidad)) {
      precioUnitario.cantidad = cantidad;
    }
  }

  mostrarMatriz(precioUnitario: precioUnitarioDTO) {
    this.selectedPU = precioUnitario.id;
    this.matrizMostrada = true;
    this.appRecarga +=1;
  }

  trackByPrecioUnitario = (_: number, item: precioUnitarioDTO) => item.id;

  private actualizarListaVisible(): void {
    const resultado: precioUnitarioDTO[] = [];
    this.flattenPrecios(this.preciosUnitarios, resultado);
    this.listaVisible = resultado;
    if(this.listaVisible.length <= 0){
      this.listaVisible.push({
        hijos: [],
        id: 0,
        idProyecto: 0,
        cantidad: 0,
        cantidadConFormato: '0.00',
        cantidadEditado: false,
        cantidadExcedente: 0,
        cantidadExcedenteConFormato: '',
        tipoPrecioUnitario: 0,
        costoUnitario: 0,
        porcentajeIndirecto: 0,
        porcentajeIndirectoConFormato: '',
        costoUnitarioConFormato: '',
        costoUnitarioEditado: false,
        nivel: 1,
        noSerie: 0,
        idPrecioUnitarioBase: 0,
        esDetalle: false,
        idConcepto: 0,
        codigo: '',
        descripcion: '',
        unidad: '',
        precioUnitario: 0,
        precioUnitarioConFormato: '0.00',
        precioUnitarioEditado: false,
        importe: 0,
        importeConFormato: '0.00',
        importeSeries: 0,
        importeSeriesConFormato: '0.00',
        expandido: false,
        posicion: 0,
        codigoPadre: '',
        esCatalogoGeneral: false,
        esAvanceObra: false,
        esAdicional: false,
        esSeleccionado: false
      })
    }
  }

  private flattenPrecios(
    origen: precioUnitarioDTO[] | undefined,
    acumulado: precioUnitarioDTO[],
  ): void {
    if (!origen?.length) {
      return;
    }

    for (const nodo of origen) {
      acumulado.push(nodo);

      if (nodo.expandido && nodo.hijos?.length) {
        this.flattenPrecios(nodo.hijos, acumulado);
      }
    }
  }

  yourFn(event: any) {
    this.selectedIndex = event.index;
  }

  seleccionarHijosPresupuesto(precioUnitario: precioUnitarioDTO) {
    if (precioUnitario.esSeleccionado) {
      if (precioUnitario.hijos.length > 0) {
        for (let i = 0; i < precioUnitario.hijos.length; i++) {
          precioUnitario.hijos[i].esSeleccionado = true;
          this.seleccionarHijosPresupuesto(precioUnitario.hijos[i]);
        }
      }
    } else {
      if (precioUnitario.hijos.length > 0) {
        for (let i = 0; i < precioUnitario.hijos.length; i++) {
          precioUnitario.hijos[i].esSeleccionado = false;
          this.seleccionarHijosPresupuesto(precioUnitario.hijos[i]);
        }
      }
    }
  }

  recalcularPresupuesto() {
    this.displayCarga = 'flex';
    this.precioUnitarioService
      .recalcularPresupuesto(this.selectedProyecto, this.selectedEmpresa)
      .subscribe((precios) => {
        this.preciosUnitarios = precios;
        this.total = 0;
        for (let i = 0; i < this.preciosUnitarios.length; i++) {
          this.total = this.total + this.preciosUnitarios[i].importe;
        }
        this.totalConFormato = new Intl.NumberFormat('es-MX', {
          style: 'currency',
          currency: 'MXN',
        }).format(
          this.proyectoSelected.porcentajeIva > 0
            ? this.total + (this.total * this.proyectoSelected.porcentajeIva) / 100
            : this.total,
        );
        this.totalSinIvaConFormato = new Intl.NumberFormat('es-MX', {
          style: 'currency',
          currency: 'MXN',
        }).format(this.total);
        this.totalIvaConFormato = new Intl.NumberFormat('es-MX', {
          style: 'currency',
          currency: 'MXN',
        }).format(
          this.proyectoSelected.porcentajeIva > 0
            ? (this.total * this.proyectoSelected.porcentajeIva) / 100
            : 0,
        );
        this.displayCarga = 'none';
      });
  }

  abrirModalImprimir() {
    this.isOpenModalImprimir = true;
    this.totalesConFormato();
  }

  obtenerPuSeleccionados(precios: precioUnitarioDTO[]): precioUnitarioDTO[] {
    let seleccionados: precioUnitarioDTO[] = [];
    precios.forEach((precio) => {
      let nuevoPU: precioUnitarioDTO = {
        id: 0,
        descripcion: '',
        hijos: [],
        esSeleccionado: false,
        costoUnitario: 0,
        costoUnitarioConFormato: '',
        importe: 0,
        importeConFormato: '',
        idProyecto: 0,
        cantidad: 0,
        cantidadConFormato: '',
        cantidadEditado: false,
        cantidadExcedente: 0,
        cantidadExcedenteConFormato: '',
        tipoPrecioUnitario: 0,
        porcentajeIndirecto: 0,
        porcentajeIndirectoConFormato: '',
        costoUnitarioEditado: false,
        nivel: 0,
        noSerie: 0,
        idPrecioUnitarioBase: 0,
        esDetalle: false,
        idConcepto: 0,
        codigo: '',
        unidad: '',
        precioUnitario: 0,
        precioUnitarioConFormato: '',
        precioUnitarioEditado: false,
        importeSeries: 0,
        importeSeriesConFormato: '',
        expandido: false,
        posicion: 0,
        codigoPadre: '',
        esCatalogoGeneral: false,
        esAvanceObra: false,
        esAdicional: false,
      };
      if (precio.hijos.length > 0) {
        let respuesta = this.obtenerPuSeleccionados(precio.hijos);
        nuevoPU.descripcion = precio.descripcion;
        nuevoPU.codigo = precio.codigo;

        if (respuesta.length > 0 && respuesta[0].esSeleccionado) {
          nuevoPU.hijos = respuesta;
          nuevoPU.esSeleccionado = true;
          nuevoPU.costoUnitario = respuesta.reduce(
            (acumulador, valor) => acumulador + valor.costoUnitario,
            0,
          );
          nuevoPU.costoUnitarioConFormato = new Intl.NumberFormat('es-MX', {
            minimumFractionDigits: 4,
          }).format(nuevoPU.costoUnitario);
          nuevoPU.importe = respuesta.reduce((acumulador, valor) => acumulador + valor.importe, 0);
          nuevoPU.importeConFormato = new Intl.NumberFormat('es-MX', {
            minimumFractionDigits: 4,
          }).format(nuevoPU.importe);
          seleccionados.push(nuevoPU);
        }
      }
      if (precio.tipoPrecioUnitario == 1 && precio.esSeleccionado) {
        seleccionados.push(precio);
      }
    });
    return seleccionados;
  }

  totalesConFormato() {
    this.totalConIva = this.preciosUnitarios.reduce(
      (acumulado, precioUnitario) =>
        acumulado +
        (precioUnitario.importe || 0) * (1 + (this.proyectoSelected.porcentajeIva || 0) / 100),
      0,
    );

    this.preciosMarcados = this.obtenerPuSeleccionados(this.preciosUnitarios);

    this.totalConFormato = new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
    }).format(
      this.proyectoSelected.porcentajeIva > 0
        ? this.total + (this.total * this.proyectoSelected.porcentajeIva) / 100
        : this.total,
    );
    this.totalSinIvaConFormato = new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
    }).format(this.total);
    this.totalIvaConFormato = new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
    }).format(
      this.proyectoSelected.porcentajeIva > 0
        ? (this.total * this.proyectoSelected.porcentajeIva) / 100
        : 0,
    );
  }

  obtenerConceptosSeleccionados(precios: precioUnitarioDTO[]): precioUnitarioDTO[] {
    let seleccionados: precioUnitarioDTO[] = [];
    precios.forEach((precio) => {
      if (precio.hijos.length > 0) {
        let respuesta = this.obtenerConceptosSeleccionados(precio.hijos);
        seleccionados.push(...respuesta);
      }
      if (precio.tipoPrecioUnitario == 1 && precio.esSeleccionado) {
        seleccionados.push(precio);
      }
    });
    console.log(seleccionados, "UwU");
    return seleccionados;
  }

  @ViewChild('dialogPresupuestoExcel', { static: true })
  dialogCargaExcel!: TemplateRef<any>;

  nuevaImportacionPresupuesto() {
    this.dialog.open(this.dialogCargaExcel, {
      width: '10%',
      disableClose: true,
    });
  }

  parametrosXInsumo: ParametrosFsrXInsumoDTO[] = [];
  dialogRemplazarCatalogo!: TemplateRef<any>;
  IdPrecioParaExplosion: number = 0;
  fsrDetalles!: factorSalarioRealDetalleDTO[];
  diasConsideradosFsiPagados!: diasConsideradosDTO[];
  preciosRemplazoCatalogo: precioUnitarioDTO[] = [];
  selectedGenerador: number = 0;

  alertaSuccess: boolean = false;
  alertaMessage: string = '';
  alertaTipo: AlertaTipo = AlertaTipo.none;
  AlertaTipo = AlertaTipo;
  esCompuesto: boolean = false;
  diasConsideradosFsiNoTrabajados!: diasConsideradosDTO[];
  fsi: factorSalarioIntegradoDTO = {
    id: 0,
    idProyecto: 0,
    fsi: 0,
  };
  @ViewChild('dialogCatalogoRemplazar', { static: true })

  precioUnitarioSeleccionado: precioUnitarioDTO = {
    hijos: [],
    id: 0,
    idProyecto: 0,
    cantidad: 0,
    cantidadExcedente: 0,
    tipoPrecioUnitario: 0,
    costoUnitario: 0,
    nivel: 0,
    noSerie: 0,
    idPrecioUnitarioBase: 0,
    esDetalle: false,
    idConcepto: 0,
    codigo: '',
    descripcion: '',
    unidad: '',
    precioUnitario: 0,
    importe: 0,
    importeSeries: 0,
    expandido: false,
    cantidadConFormato: '',
    cantidadExcedenteConFormato: '',
    costoUnitarioConFormato: '',
    precioUnitarioConFormato: '',
    importeConFormato: '',
    importeSeriesConFormato: '',
    cantidadEditado: false,
    costoUnitarioEditado: false,
    precioUnitarioEditado: false,
    porcentajeIndirecto: 0,
    porcentajeIndirectoConFormato: '',
    posicion: 0,
    codigoPadre: '',
    esCatalogoGeneral: false,
    esAvanceObra: false,
    esAdicional: false,
    esSeleccionado: false,
  };

  precioUnitarioParaExplosion: precioUnitarioDTO = {
    hijos: [],
    id: 0,
    idProyecto: 0,
    cantidad: 0,
    cantidadConFormato: '',
    cantidadEditado: false,
    cantidadExcedente: 0,
    cantidadExcedenteConFormato: '',
    tipoPrecioUnitario: 0,
    costoUnitario: 0,
    porcentajeIndirecto: 0,
    porcentajeIndirectoConFormato: '',
    costoUnitarioConFormato: '',
    costoUnitarioEditado: false,
    nivel: 0,
    noSerie: 0,
    idPrecioUnitarioBase: 0,
    esDetalle: false,
    idConcepto: 0,
    codigo: '',
    descripcion: '',
    unidad: '',
    precioUnitario: 0,
    precioUnitarioConFormato: '',
    precioUnitarioEditado: false,
    importe: 0,
    importeConFormato: '',
    importeSeries: 0,
    importeSeriesConFormato: '',
    expandido: false,
    posicion: 0,
    codigoPadre: '',
    esCatalogoGeneral: false,
    esAvanceObra: false,
    esAdicional: false,
    esSeleccionado: false,
  };

  openDialogFSR() {
    this.matrizMostrada = false;
    this.contenedorFSR = true;
    this.contenedorPresupuesto = false;
    this.contenedorExplosionInsumo = false;

    this.dataFSR = {
      diasConsideradosFsiNoTrabajados: this.diasConsideradosFsiNoTrabajados,
      selectedEmpresa: this.selectedEmpresa,
      diasConsideradosFsiPagados: this.diasConsideradosFsiPagados,
      selectedProyecto: this.selectedProyecto,
      diasNoLaborales: this.diasNoLaborales,
      diasPagados: this.diasPagados,
      fsrDetalles: this.fsrDetalles,
      porcentajePrestaciones: this.porcentajePrestaciones,
      esAutorizado: this.esAutorizado,
    };
  }

  explosionInsumoXPrecioUnitario() {
    this.IdPrecioParaExplosion = this.precioUnitarioMenu.id;
    console.log(this.precioUnitarioMenu);

    this.precioUnitarioParaExplosion = this.precioUnitarioMenu;

    // console.log({...this.precioUnitarioParaExplosion}, 'copia');
    console.log(this.precioUnitarioParaExplosion.id);

    this.appRecarga += 1;

    this.contenedorPresupuesto = false;
    this.contenedorExplosionInsumo = true;
    this.contenedorFSR = false;
  }

  recalcular(event: Event) {
    console.log('event', event);

    this.contenedorPresupuesto = true;
    this.contenedorExplosionInsumo = false;
    this.contenedorFSR = false;
    if (event) {
      console.log('recalculando');
      this.recalcularPresupuesto();
    }
  }

  openDialogCatalogoGeneral() {
    this.displayCarga = 'flex';
    this.matrizMostrada = false;
    let seleccionados = this.obtenerConceptosSeleccionados(this.preciosUnitarios);
    console.log(seleccionados,"we")
    if (seleccionados.length > 0) {
    console.log("wwe")
      this.precioUnitarioService
        .agregarCatalogoGeneral(seleccionados, this.selectedEmpresa)
        .subscribe((datos) => {
          this.preciosRemplazoCatalogo = datos;
          if (this.preciosRemplazoCatalogo.length) {
            console.log("EWE")
            this.openDialogRemplazoCatalogo();
          }
        });
    }

    this.precioUnitarioService
      .obtenerEstructurado(0, this.selectedEmpresa)
      .pipe(finalize(() => (this.displayCarga = 'none')))
      .subscribe({
        next: (datos) => {
          this.preciosUnitarios = datos;
          this.listaVisible = datos;
          console.log(datos, "IwI")

          this.contenedorPresupuesto = true;
          this.contenedorCatalogoGeneral = true;
        },
        error: (err) => {
          console.error('Error al cargar catálogo general', err);
        },
      });
  }

  openDialogRemplazoCatalogo() {
    this.dialog.open(this.dialogRemplazarCatalogo, {
      width: '20%',
      disableClose: true,
    });
  }

  eliminarDeCatalogoGeneral() {
    let existeSeleccion = this.preciosUnitarios.filter((z) => z.esSeleccionado);
    if (existeSeleccion.length <= 0) {
      Swal.fire({
        confirmButtonText: 'Aceptar',
        html: `
              <div>
                <div class="mb-2 mt-2"><p style="margin : 0px;">No se ha seleccionado un elemento a eliminar.</p></div>
              </div>
            `,
        imageWidth: 50,
        customClass: {
          icon: 'no-border',
          cancelButton: 'SweetAlert2CancelButtonError',
          confirmButton: 'SweetAlert2ConfirmButton',
        },
      });
      return;
    }

    Swal.fire({
      confirmButtonText: 'Aceptar',
      cancelButtonText: 'Cancelar',
      showCancelButton: true,
      html: `<p>¿Desea eliminar del catálogo de conceptos generales?</p>`,
    }).then((result: { isConfirmed: any }) => {
      if (result.isConfirmed) {
        this.precioUnitarioService
          .eliminarCatalogoGeneral(existeSeleccion, this.selectedEmpresa)
          .subscribe((datos) => {
            this.precioUnitarioService
              .obtenerEstructurado(0, this.selectedEmpresa)
              .pipe(finalize(() => (this.displayCarga = 'none')))
              .subscribe({
                next: (datos) => {
                  this.preciosUnitarios = datos;

                  this.contenedorPresupuesto = true;
                  this.contenedorCatalogoGeneral = true;
                },
                error: (err) => {
                  Swal.fire({
                    confirmButtonText: 'Aceptar',
                    html: `
              <div>
                <div class="mb-2 mt-2"><p style="margin : 0px;">No se permite mover elementos dentro del catálogo general.</p></div>
              </div>
            `,
                    imageWidth: 50,
                    customClass: {
                      icon: 'no-border',
                      cancelButton: 'SweetAlert2CancelButtonError',
                      confirmButton: 'SweetAlert2ConfirmButton',
                    },
                  });
                },
              });
          });
      } else {
        this.displayCarga = 'none';
      }
      this.ChangeDetectorRef.detectChanges();
    });
  }

  regresarPU() {
    this.contenedorPresupuesto = true;
    this.contenedorCatalogoGeneral = false;
    this.obtenerRegistros();
  }

  openDialogExpInsumos() {
    this.precioUnitarioParaExplosion.id = 0;
    this.appRecarga += 1;
    this.contenedorPresupuesto = false;
    this.contenedorExplosionInsumo = true;
  }

  indirectos() {
    const dialogRef = this.dialog.open(IndirectosComponent, {});
    dialogRef.afterClosed().subscribe((resultado: boolean) => {
      this.obtenerRegistros();
      // this.recalcularPresupuesto();
    });
  }

  autorizarPresupuesto() {
    this.displayCarga = 'flex';
    this.precioUnitarioService
      .autorizarPresupuesto(this.selectedProyecto, this.selectedEmpresa)
      .subscribe((datos) => {
        this.obtenerRegistros();
        this.displayCarga = 'none';
      });
  }

  alerta(tipo: AlertaTipo, mensaje: string = '') {
    if (tipo === AlertaTipo.none) {
      this.cerrarAlerta();
      return;
    }

    this.alertaTipo = tipo;
    this.alertaMessage = mensaje || 'Ocurrió un error';
    this.alertaSuccess = true;

    setTimeout(() => {
      this.cerrarAlerta();
    }, 3000);
  }

  RemoverAutorizacionPresupuesto() {
    this.displayCarga = 'flex';
    this.precioUnitarioService
      .removerAutorizacionPresupuesto(this.selectedProyecto, this.selectedEmpresa)
      .subscribe((datos) => {
        if (datos.estatus) {
          this.obtenerRegistros();
          this.displayCarga = 'none';
        } else {
          this.displayCarga = 'none';
          this.alerta(AlertaTipo.error, datos.descripcion);
        }
      });
  }

  cerrarAlerta() {
    this.alertaSuccess = false;
    this.alertaTipo = AlertaTipo.none;
    this.alertaMessage = '';
  }

  nuevaPartidaAdicional() {
    var ultimoPU = this.preciosUnitarios[this.preciosUnitarios.length - 1];
    this.preciosUnitarios.push({
      id: 0,
      idProyecto: this.selectedProyecto,
      cantidad: 1,
      cantidadExcedente: 0,
      tipoPrecioUnitario: 0,
      costoUnitario: 0,
      nivel: 1,
      noSerie: ultimoPU.noSerie,
      idPrecioUnitarioBase: 0,
      esDetalle: false,
      idConcepto: 0,
      codigo: '',
      descripcion: '',
      unidad: '',
      precioUnitario: 0,
      importe: 0,
      importeSeries: 0,
      expandido: false,
      hijos: [],
      cantidadConFormato: '0.00',
      cantidadExcedenteConFormato: '0.00',
      costoUnitarioConFormato: '$0.00',
      precioUnitarioConFormato: '$0.00',
      importeConFormato: '$0.00',
      importeSeriesConFormato: '$0.00',
      cantidadEditado: false,
      costoUnitarioEditado: false,
      precioUnitarioEditado: false,
      porcentajeIndirecto: 0,
      porcentajeIndirectoConFormato: '',
      posicion: ultimoPU.posicion + 1,
      codigoPadre: '',
      esCatalogoGeneral: false,
      esAvanceObra: false,
      esAdicional: true,
      esSeleccionado: false,
    });
  }

  importarCatalogoDesdePu() {
    if (this.precioUnitarioSeleccionado.esAvanceObra) {
      Swal.fire({
        confirmButtonText: 'Aceptar',
        html: `
              <div>
                <div class="mb-2 mt-2"><p style="margin : 0px;">El elemento seleccionado ya ha sido autorizado.</p></div>
              </div>
            `,
        imageWidth: 50,
        customClass: {
          icon: 'no-border',
          cancelButton: 'SweetAlert2CancelButtonError',
          confirmButton: 'SweetAlert2ConfirmButton',
        },
      });
      return;
    }
    if (this.precioUnitarioSeleccionado.id === 0) {
      Swal.fire({
        confirmButtonText: 'Aceptar',
        html: `
              <div>
                <div class="mb-2 mt-2"><p style="margin : 0px;">No se ha seleccionado un campo destino.</p></div>
              </div>
            `,
        imageWidth: 50,
        customClass: {
          icon: 'no-border',
          cancelButton: 'SweetAlert2CancelButtonError',
          confirmButton: 'SweetAlert2ConfirmButton',
        },
      });
      return;
    }
    let catalogoSeleccion = this.preciosUnitarios.filter((z) => z.esSeleccionado);
    if (catalogoSeleccion.length == 0) {
      Swal.fire({
        confirmButtonText: 'Aceptar',
        html: `
              <div>
                <div class="mb-2 mt-2"><p style="margin : 0px;">No se ha seleccionado un elemento a importar.</p></div>
              </div>
            `,
        imageWidth: 50,
        customClass: {
          icon: 'no-border',
          cancelButton: 'SweetAlert2CancelButtonError',
          confirmButton: 'SweetAlert2ConfirmButton',
        },
      });
      return;
    }

    let parametros: DatosParaImportarCatalogoGeneralDTO = {
      registros: catalogoSeleccion,
      precioUnitario: this.precioUnitarioSeleccionado,
    };

    Swal.fire({
      confirmButtonText: 'Aceptar',
      cancelButtonText: 'Cancelar',
      showCancelButton: true,
      html: `<p>¿Desea importar al presupuesto?</p>`,
    }).then((result) => {
      if (result.isConfirmed) {
        this.precioUnitarioService
          .importarCatalogoAPrecioUnitario(parametros, this.selectedEmpresa)
          .subscribe((datos) => {
            this.contenedorCatalogoGeneral = false;
            this.contenedorPresupuesto = true;
            this.obtenerRegistros();
            this.recalcularPresupuesto();
          });
      }
    });
  }

  closeModal() {
    this.isOpenModal = false;
    this.isOpenModalImprimir = false;
  }

  cerrarFSR(event: Event) {
    this.contenedorFSR = false;
    this.contenedorPresupuesto = true;
    this.contenedorExplosionInsumo = false;
    if (event) {
      this.recalcularPresupuesto();
      this.precioUnitarioService
        .obtenerEstructurado(this.selectedProyecto, this.selectedEmpresa)
        .subscribe((precios) => {
          this.preciosUnitarios = precios;
        });
      this.fsrService.obtenerFSR(this.selectedProyecto, this.selectedEmpresa).subscribe((fsr) => {
        this.esCompuesto = fsr.esCompuesto;
        this.obtenerCensatia();
      });
    }
  }

  obtenerCensatia() {
    this.existeCensatia = true;
    if (!this.esCompuesto) {
      return;
    }
    this.fsrService.obtenerParametrosXInsumo(this.fsr, this.selectedEmpresa).subscribe({
      next: (datos) => {
        this.parametrosXInsumo = datos;
      },
      error: (err) => {
        //Mensaje de error
      },
      complete: () => {
        this.fsrService
          .obtenerPorcentajeCesantiaEdad(this.selectedProyecto, this.selectedEmpresa)
          .subscribe({
            next: (porcentaje) => {
              if (porcentaje.length > 0 && this.parametrosXInsumo.length > 0) {
                this.existeCensatia = true;
              } else {
                this.existeCensatia = false;
              }
            },
            error: (err) => {
              //Mensaje de error
            },
          });
      },
    });
  }

   limpiarRemplazarCatalogo() {
    this.dialog.closeAll();
  }

  cargarPresupuestoExcel() {
    this.mensajeModal = '';

    if (!this.archivosCargarExcels || this.archivosCargarExcels.length === 0) {
      this.mensajeModal = 'No hay archivos Excel para importar';
      return;
    }

    this.displayCarga = 'flex';

    this.precioUnitarioService
      .importarPresupuestoExcel(
        this.archivosCargarExcels,
        this.selectedEmpresa,
        this.selectedProyecto
      )
      .subscribe({
        next: (datos) => {
          this.displayCarga = 'none';

          if (datos.estatus) {
            this.obtenerRegistros();
            this.limpiarCargarExcel();
            this.recalcularPresupuesto();
          } else {
            this.mensajeModal =
              datos.descripcion || 'Error al procesar el archivo';
          }
        },
        error: (err) => {
          this.displayCarga = 'none';
          const msg =
            err.error?.mensaje ||
            err.error?.message ||
            err.statusText ||
            'Error desconocido al importar';
          this.mensajeModal = msg;
        },
      });
  }

  archivosCargarExcels: FileList | null = null;

  limpiarCargarExcel() {
    this.dialog.closeAll();
    this.mensajeModal = '';
    this.selectedFileName = '';
    this.tooltipVisible = false;
  }

  cargarPresupuestoOpus() {
    this.mensajeModal = '';

    if (!this.archivosCargarExcels || this.archivosCargarExcels.length === 0) {
      this.mensajeModal = 'No hay archivos Opus para importar';
      return;
    }

    this.limpiarCargarExcel();
    this.displayCarga = 'flex';

    this.precioUnitarioService
      .importarPresupuestoOpus(
        this.archivosCargarExcels,
        this.selectedEmpresa,
        this.selectedProyecto
      )
      .subscribe({
        next: (datos) => {
          this.displayCarga = 'none';

          console.log(datos, 'UwU');
          if (datos.estatus) {
            // se subio
            this.obtenerRegistros();

            this.recalcularPresupuesto();
          } else {
            // error back
            this.mensajeModal =
              datos.descripcion || 'Error al procesar el archivo OPUS';
          }
        },
        error: (err) => {
          this.displayCarga = 'none';
          const msg =
            err.error?.mensaje ||
            err.error?.message ||
            err.statusText ||
            'Error desconocido al importar OPUS';
          this.mensajeModal = msg;
        },
      });
  }

  detenerCierre(event: MouseEvent) {
    event.stopPropagation();
  }

  remplazarCatalogoGeneral() {
    let seleccionadoRemplazar = this.preciosRemplazoCatalogo.filter(
      (z) => z.esSeleccionado
    );
    if (seleccionadoRemplazar.length > 0) {
      this.precioUnitarioService
        .remplazarCatalogoGeneral(seleccionadoRemplazar, this.selectedEmpresa)
        .subscribe((datos) => {
          this.preciosRemplazoCatalogo = [];
          this.limpiarRemplazarCatalogo();
          this.precioUnitarioService
            .obtenerEstructurado(0, this.selectedEmpresa)
            .pipe(finalize(() => (this.displayCarga = 'none')))
            .subscribe({
              next: (datos) => {
                console.log("SeWe")
                this.preciosUnitarios = datos;

                this.contenedorPresupuesto = true;
                this.contenedorCatalogoGeneral = true;
              },
              error: (err) => {
                console.error('Error al cargar catálogo general', err);
              },
            });
        });
    }
  }


  onFileChangeFactura(event: any) {
    const files = (event.target as HTMLInputElement).files;
    this.archivosCargarExcels = files;
    this.selectedFileName = files![0].name;
  }


  handleClick(event: MouseEvent) {
    this.cargarPresupuestoExcel();
  }

  mostrarInfo() {
    this.tooltipVisible = true;
    setTimeout(() => {
      this.tooltipVisible = false;
    }, 5000);
  }

  preciosUnitariosRefresco:precioUnitarioDTO[] = [];

  crear(precioUnitario: precioUnitarioDTO) {
    this.precioUnitarioSeleccionado = {
      hijos: [],
      id: 0,
      idProyecto: 0,
      cantidad: 0,
      cantidadExcedente: 0,
      tipoPrecioUnitario: 0,
      costoUnitario: 0,
      nivel: 0,
      noSerie: 0,
      idPrecioUnitarioBase: 0,
      esDetalle: false,
      idConcepto: 0,
      codigo: '',
      descripcion: '',
      unidad: '',
      precioUnitario: 0,
      importe: 0,
      importeSeries: 0,
      expandido: false,
      cantidadConFormato: '0.00',
      cantidadExcedenteConFormato: '0.00',
      costoUnitarioConFormato: '$0.00',
      precioUnitarioConFormato: '$0.00',
      importeConFormato: '$0.00',
      importeSeriesConFormato: '$0.00',
      cantidadEditado: false,
      costoUnitarioEditado: false,
      precioUnitarioEditado: false,
      porcentajeIndirecto: 0,
      porcentajeIndirectoConFormato: '',
      posicion: 0,
      codigoPadre: '',
      esCatalogoGeneral: false,
      esAvanceObra: false,
      esAdicional: false,
      esSeleccionado: false,
    };
    // this.testInput.nativeElement.style.display = 'none';
    this.mostrarBotones = false;
    this.precioUnitarioSeleccionado.cantidadEditado = false;
    this.precioUnitarioSeleccionado.costoUnitarioEditado = false;
    // this.seEstaEditandoRegistro = false;
    if (precioUnitario.id == 0) {
      if (precioUnitario.nivel == 0) {
        precioUnitario.nivel = 1;
      }
      precioUnitario.idProyecto = this.selectedProyecto;
      if (precioUnitario.tipoPrecioUnitario == 0) {
        // if (
        //   typeof precioUnitario.codigo == undefined ||
        //   !precioUnitario.codigo ||
        //   precioUnitario.codigo == '' ||
        //   typeof precioUnitario.descripcion == undefined ||
        //   !precioUnitario.descripcion ||
        //   precioUnitario.descripcion == ''
        // )
        // {
        //   this._snackBar.open('capture todos los campos', 'X', {
        //     duration: 3000,
        //   }
        // );
        //   return;
        // }
        this.displayCarga = 'flex';
        this.precioUnitarioService
          .crearYObtener(precioUnitario, this.selectedEmpresa)
          .subscribe((preciosUnitarios) => {
            if (!this.contenedorCatalogoGeneral) {
              this.preciosUnitariosRefresco = preciosUnitarios;
              this.refrescar();
              this.cargarListaConceptos();
            }

            this.displayCarga = 'none';
          });
      } else {
        // if (typeof precioUnitario.codigo == undefined || !precioUnitario.codigo || precioUnitario.codigo == "" ||
        //     typeof precioUnitario.descripcion == undefined || !precioUnitario.descripcion || precioUnitario.descripcion == "" ||
        //     typeof precioUnitario.unidad == undefined || !precioUnitario.unidad || precioUnitario.unidad == "") {
        //     this._snackBar.open("capture todos los campos", "X", { duration: 3000 });
        //     return;
        // }
        // if (
        //   typeof precioUnitario.codigo == undefined ||
        //   !precioUnitario.codigo ||
        //   precioUnitario.codigo == ''
        // ) {
        //   this._snackBar.open('capture todos los campos1', 'X', {
        //     duration: 3000,
        //   });
        //   return;
        // } else if (
        //   (precioUnitario.descripcion != '' && precioUnitario.unidad == '') ||
        //   (precioUnitario.descripcion == '' && precioUnitario.unidad != '')
        // ) {
        //   this._snackBar.open('capture todos los campos2', 'X', {
        //     duration: 3000,
        //   });
        //   return;
        // }
        this.displayCarga = 'flex';
        this.precioUnitarioService
          .crearYObtener(precioUnitario, this.selectedEmpresa)
          .subscribe((precioUnitario) => {
            if (!this.contenedorCatalogoGeneral) {
              this.preciosUnitariosRefresco = precioUnitario;
              this.refrescar();
              this.cargarListaConceptos();
            }
            this.displayCarga = 'none';
          });
      }
      this.existeCaptura = false;
    } else {
      if (precioUnitario.nivel == 0) {
        precioUnitario.nivel = 1;
      }
      precioUnitario.idProyecto = this.selectedProyecto;
      if (precioUnitario.tipoPrecioUnitario == 0) {
        // if (
        //   typeof precioUnitario.codigo == undefined ||
        //   !precioUnitario.codigo ||
        //   precioUnitario.codigo == '' ||
        //   typeof precioUnitario.descripcion == undefined ||
        //   !precioUnitario.descripcion ||
        //   precioUnitario.descripcion == ''
        // ) {
        //   this._snackBar.open('capture todos los campos', 'X', {
        //     duration: 3000,
        //   });
        //   return;
        // }
        this.displayCarga = 'flex';
        this.precioUnitarioService
          .editar(precioUnitario, this.selectedEmpresa)
          .subscribe((preciosUnitarios) => {
            this.preciosUnitariosRefresco = preciosUnitarios;
            this.refrescar();
            this.cargarListaConceptos();
            this.displayCarga = 'none';
          });
      } else {
        // if (
        //   typeof precioUnitario.codigo == undefined ||
        //   !precioUnitario.codigo ||
        //   precioUnitario.codigo == '' ||
        //   typeof precioUnitario.descripcion == undefined ||
        //   !precioUnitario.descripcion ||
        //   precioUnitario.descripcion == '' ||
        //   typeof precioUnitario.unidad == undefined ||
        //   !precioUnitario.unidad ||
        //   precioUnitario.unidad == ''
        // ) {
        //   this._snackBar.open('capture todos los campos', 'X', {
        //     duration: 3000,
        //   });
        //   return;
        }
        this.displayCarga = 'flex';
        this.precioUnitarioService
          .editar(precioUnitario, this.selectedEmpresa)
          .subscribe((precioUnitario) => {
            if (!this.contenedorCatalogoGeneral) {
              this.preciosUnitariosRefresco = precioUnitario;
              this.refrescar();
              this.cargarListaConceptos();
            }
            this.displayCarga = 'none';
          });
      }
      this.existeCaptura = false;
    }

  refrescar() {
    this.preciosUnitarios = this.preciosUnitariosRefresco;
    this.total = 0;
    for (let i = 0; i < this.preciosUnitarios.length; i++) {
      this.total = this.total + this.preciosUnitarios[i].importe;
      this.totalConFormato = new Intl.NumberFormat('es-MX', {
        style: 'currency',
        currency: 'MXN',
      }).format(
        this.proyectoSelected.porcentajeIva > 0
          ? this.total +
              (this.total * this.proyectoSelected.porcentajeIva) / 100
          : this.total
      );
      this.totalSinIvaConFormato = new Intl.NumberFormat('es-MX', {
        style: 'currency',
        currency: 'MXN',
      }).format(this.total);
      this.totalIvaConFormato = new Intl.NumberFormat('es-MX', {
        style: 'currency',
        currency: 'MXN',
      }).format(
        this.proyectoSelected.porcentajeIva > 0
          ? (this.total * this.proyectoSelected.porcentajeIva) / 100
          : 0
      );
    }
  }

  conceptos: precioUnitarioDTO[] = [];
  conceptosReset: precioUnitarioDTO[] = [];

  cargarListaConceptos() {
    this.precioUnitarioService
      .obtenerConceptos(this.selectedProyecto, this.selectedEmpresa)
      .subscribe((datos) => {
        this.conceptos = datos;
        this.conceptosReset = datos;
        this.precioUnitarioSeleccionado = {
          hijos: [],
          id: 0,
          idProyecto: 0,
          cantidad: 0,
          cantidadExcedente: 0,
          tipoPrecioUnitario: 0,
          costoUnitario: 0,
          nivel: 0,
          noSerie: 0,
          idPrecioUnitarioBase: 0,
          esDetalle: false,
          idConcepto: 0,
          codigo: '',
          descripcion: '',
          unidad: '',
          precioUnitario: 0,
          importe: 0,
          importeSeries: 0,
          expandido: false,
          cantidadConFormato: '',
          cantidadExcedenteConFormato: '',
          costoUnitarioConFormato: '',
          precioUnitarioConFormato: '',
          importeConFormato: '',
          importeSeriesConFormato: '',
          cantidadEditado: false,
          costoUnitarioEditado: false,
          precioUnitarioEditado: false,
          porcentajeIndirecto: 0,
          porcentajeIndirectoConFormato: '',
          posicion: 0,
          codigoPadre: '',
          esCatalogoGeneral: false,
          esAvanceObra: false,
          esAdicional: false,
          esSeleccionado: false,
        };
      });
    this.preciosUnitarios.forEach((registro) => {
      if (registro.id == this.precioUnitarioSeleccionado.id) {
        registro.esDetalle = true;
        this.precioUnitarioSeleccionado = registro;
      }
      if (registro.tipoPrecioUnitario == 0) {
        this.buscarHijoParaSeleccionar(registro);
      }
    });
  }

  buscarHijoParaSeleccionar(precioUnitario: precioUnitarioDTO) {
    precioUnitario.hijos.forEach((registro) => {
      if (registro.id == this.precioUnitarioSeleccionado.id) {
        registro.esDetalle = true;
        registro.cantidadEditado = true;
        registro.costoUnitarioEditado = true;
        registro.precioUnitarioEditado = true;
        this.precioUnitarioSeleccionado = registro;
      }
      if (registro.tipoPrecioUnitario == 0) {
        this.buscarHijoParaSeleccionar(registro);
      }
    });
  }

  menu3PuntosEsDesplegado = false;
  precioUnitarioMenu!: precioUnitarioDTO;

  desplegarMenu(precioUnitario: precioUnitarioDTO){
    this.precioUnitarioMenu = precioUnitario;
    this.menu3PuntosEsDesplegado = !this.menu3PuntosEsDesplegado;
  }

  precioUnitarioPadreCreacion!: precioUnitarioDTO;
  existeCaptura = false;
  precioUnitarioPadre!: precioUnitarioDTO;

  crearSubPartida() {
    this.precioUnitarioPadreCreacion = this.precioUnitarioMenu;
    this.precioUnitarioMenu.expandido = true;
    if (this.existeCaptura == false) {
      if (this.precioUnitarioMenu.tipoPrecioUnitario != 0) {
        this.buscarNodo(this.precioUnitarioMenu.idPrecioUnitarioBase);
        let posicionFinal = this.precioUnitarioPadre.hijos.length;

        this.precioUnitarioPadre.hijos.push({
          id: 0,
          idProyecto: this.precioUnitarioMenu.idProyecto,
          cantidad: 1,
          cantidadExcedente: 0,
          tipoPrecioUnitario: 0,
          costoUnitario: 0,
          nivel: this.precioUnitarioPadre.nivel + 1,
          noSerie: this.precioUnitarioMenu.noSerie,
          idPrecioUnitarioBase: this.precioUnitarioMenu.idPrecioUnitarioBase,
          esDetalle: false,
          idConcepto: 0,
          codigo: '',
          descripcion: '',
          unidad: '',
          precioUnitario: 0,
          importe: 0,
          importeSeries: 0,
          expandido: false,
          hijos: [],
          cantidadConFormato: '0.00',
          cantidadExcedenteConFormato: '0.00',
          costoUnitarioConFormato: '$0.00',
          precioUnitarioConFormato: '$0.00',
          importeConFormato: '$0.00',
          importeSeriesConFormato: '$0.00',
          cantidadEditado: false,
          costoUnitarioEditado: false,
          precioUnitarioEditado: false,
          porcentajeIndirecto: 0,
          porcentajeIndirectoConFormato: '',
          posicion: posicionFinal + 1,
          codigoPadre: '',
          esCatalogoGeneral: false,
          esAvanceObra: false,
          esAdicional: this.precioUnitarioMenu.esAdicional,
          esSeleccionado: false,
        });
        this.precioUnitarioPadreCreacion = this.precioUnitarioPadre;
      } else {
        let posicionFinal = this.precioUnitarioMenu.hijos.length;
        this.precioUnitarioMenu.hijos.push({
          id: 0,
          idProyecto: this.precioUnitarioMenu.idProyecto,
          cantidad: 1,
          cantidadExcedente: 0,
          tipoPrecioUnitario: 0,
          costoUnitario: 0,
          nivel: this.precioUnitarioMenu.nivel + 1,
          noSerie: this.precioUnitarioMenu.noSerie,
          idPrecioUnitarioBase: this.precioUnitarioMenu.id,
          esDetalle: false,
          idConcepto: 0,
          codigo: '',
          descripcion: '',
          unidad: '',
          precioUnitario: 0,
          importe: 0,
          importeSeries: 0,
          expandido: false,
          hijos: [],
          cantidadConFormato: '0.00',
          cantidadExcedenteConFormato: '0.00',
          costoUnitarioConFormato: '$0.00',
          precioUnitarioConFormato: '$0.00',
          importeConFormato: '$0.00',
          importeSeriesConFormato: '$0.00',
          cantidadEditado: false,
          costoUnitarioEditado: false,
          precioUnitarioEditado: false,
          porcentajeIndirecto: 0,
          porcentajeIndirectoConFormato: '',
          posicion: posicionFinal + 1,
          codigoPadre: '',
          esCatalogoGeneral: false,
          esAvanceObra: false,
          esAdicional: this.precioUnitarioMenu.esAdicional,
          esSeleccionado: false,
        });
        this.precioUnitarioPadreCreacion = this.precioUnitarioMenu;
      }
      this.actualizarListaVisible();
      this.ChangeDetectorRef.detectChanges();
      this.existeCaptura = true;
    }
  }

  buscarNodo(id: number) {
    for (let i = 0; i < this.preciosUnitarios.length; i++) {
      if (this.preciosUnitarios[i].id == id) {
        this.precioUnitarioPadre = this.preciosUnitarios[i];
        return;
      } else {
        this.buscarNodoHijo(id, this.preciosUnitarios[i].hijos);
      }
    }
  }

  buscarNodoHijo(id: number, hijos: precioUnitarioDTO[]) {
    for (let i = 0; i < hijos.length; i++) {
      if (hijos[i].id == id) {
        this.precioUnitarioPadre = hijos[i];
        return;
      } else {
        this.buscarNodoHijo(id, hijos[i].hijos);
      }
    }
  }

  crearConcepto() {
    console.log('precio unitario concepto', this.precioUnitarioMenu);

    this.precioUnitarioMenu.expandido = true;
    if (this.existeCaptura == false) {
      if (this.precioUnitarioMenu.tipoPrecioUnitario != 0) {
        this.buscarNodo(this.precioUnitarioMenu.idPrecioUnitarioBase);
        let nuevoConcepto: precioUnitarioDTO = {
          id: 0,
          idProyecto: this.precioUnitarioMenu.idProyecto,
          cantidad: 0,
          cantidadExcedente: 0,
          tipoPrecioUnitario: 1,
          costoUnitario: 0,
          nivel: this.precioUnitarioPadre.nivel + 1,
          noSerie: this.precioUnitarioMenu.noSerie,
          idPrecioUnitarioBase: this.precioUnitarioMenu.idPrecioUnitarioBase,
          esDetalle: false,
          idConcepto: 0,
          codigo: '',
          descripcion: '',
          unidad: '',
          precioUnitario: 0,
          importe: 0,
          importeSeries: 0,
          expandido: false,
          hijos: [],
          cantidadConFormato: '0.00',
          cantidadExcedenteConFormato: '0.00',
          costoUnitarioConFormato: '$0.00',
          precioUnitarioConFormato: '$0.00',
          importeConFormato: '$0.00',
          importeSeriesConFormato: '$0.00',
          cantidadEditado: false,
          costoUnitarioEditado: false,
          precioUnitarioEditado: false,
          porcentajeIndirecto: 0,
          porcentajeIndirectoConFormato: '',
          posicion: this.precioUnitarioMenu.posicion + 1,
          codigoPadre: '',
          esCatalogoGeneral: false,
          esAvanceObra: false,
          esAdicional: this.precioUnitarioMenu.esAdicional,
          esSeleccionado: false,
        };
        // console.log('ver posiciones', this.precioUnitarioPadre.hijos);
        // this.precioUnitarioPadre.hijos = this.insertarEnPosicion(
        //   this.precioUnitarioPadre.hijos,
        //   nuevoConcepto,
        //   precioUnitario.posicion + 1
        // );
        this.precioUnitarioPadreCreacion = this.precioUnitarioPadre;
      } else {
        let posicionFinal = this.precioUnitarioMenu.hijos.length;
        this.precioUnitarioMenu.hijos.push({
          id: 0,
          idProyecto: this.precioUnitarioMenu.idProyecto,
          cantidad: 0,
          cantidadExcedente: 0,
          tipoPrecioUnitario: 1,
          costoUnitario: 0,
          nivel: this.precioUnitarioMenu.nivel + 1,
          noSerie: this.precioUnitarioMenu.noSerie,
          idPrecioUnitarioBase: this.precioUnitarioMenu.id,
          esDetalle: false,
          idConcepto: 0,
          codigo: '',
          descripcion: '',
          unidad: '',
          precioUnitario: 0,
          importe: 0,
          importeSeries: 0,
          expandido: false,
          hijos: [],
          cantidadConFormato: '0.00',
          cantidadExcedenteConFormato: '0.00',
          costoUnitarioConFormato: '$0.00',
          precioUnitarioConFormato: '$0.00',
          importeConFormato: '$0.00',
          importeSeriesConFormato: '$0.00',
          cantidadEditado: false,
          costoUnitarioEditado: false,
          precioUnitarioEditado: false,
          porcentajeIndirecto: 0,
          porcentajeIndirectoConFormato: '',
          posicion: posicionFinal + 1,
          codigoPadre: '',
          esCatalogoGeneral: false,
          esAvanceObra: false,
          esAdicional: this.precioUnitarioMenu.esAdicional,
          esSeleccionado: false,
        });
        this.precioUnitarioPadreCreacion = this.precioUnitarioMenu;
      }
    }
    this.existeCaptura = true;
    this.actualizarListaVisible();
  }

  partirConcepto() {
    this.displayCarga = 'flex';
    this.precioUnitarioService
      .partirConcepto(this.precioUnitarioMenu, this.selectedEmpresa)
      .subscribe((datos) => {
        this.preciosUnitariosRefresco = datos;
        this.refrescar();
        this.cargarListaConceptos();
        this.displayCarga = 'none';
      });
  }


  eliminarPU(): void {
      const dialogRef = this.dialog.open(ModalAlertComponent, {
        data: {
          selectedPU: this.precioUnitarioMenu,
          titulo: '',
          mensaje: '¿Quieres eliminar?',
          funcionAceptarPU: this.eliminarPrecioUnitario.bind(this),
        },
      });
    }

    eliminarPrecioUnitario(precioUnitario: precioUnitarioDTO) {
        this.displayCarga = 'flex';
        this.precioUnitarioService
          .eliminar(precioUnitario.id, this.selectedEmpresa)
          .subscribe((preciosUnitarios) => {
            if (!preciosUnitarios.estatus) {
              Swal.fire({
                imageUrl: 'assets/cancelado.svg',
                // icon: "error",
                confirmButtonText: 'Cerrar',
                html: `
                            <div>
                            <p style="margin : 0px;">${preciosUnitarios.descripcion}</p>
                            </div>
                            `,
                imageWidth: 50,
                customClass: {
                  icon: 'no-border',
                  confirmButton: 'SweetAlert2ConfirmButtonError',
                },
              });
            }
            // this.preciosUnitariosRefresco = preciosUnitarios;
            this.obtenerRegistros();
            if (this.preciosUnitarios.length == 0) {
              this.preciosUnitarios.push({
                id: 0,
                idProyecto: 0,
                cantidad: 1,
                cantidadExcedente: 0,
                tipoPrecioUnitario: 0,
                costoUnitario: 0,
                nivel: 0,
                noSerie: 0,
                idPrecioUnitarioBase: 0,
                esDetalle: false,
                idConcepto: 0,
                codigo: '',
                descripcion: '',
                unidad: '',
                precioUnitario: 0,
                importe: 0,
                importeSeries: 0,
                expandido: false,
                hijos: [],
                cantidadConFormato: '0.00',
                cantidadExcedenteConFormato: '0.00',
                costoUnitarioConFormato: '$0.00',
                precioUnitarioConFormato: '$0.00',
                importeConFormato: '$0.00',
                importeSeriesConFormato: '$0.00',
                cantidadEditado: false,
                costoUnitarioEditado: false,
                precioUnitarioEditado: false,
                porcentajeIndirecto: 0,
                porcentajeIndirectoConFormato: '',
                posicion: 0,
                codigoPadre: '',
                esCatalogoGeneral: false,
                esAvanceObra: false,
                esAdicional: false,
                esSeleccionado: false,
              });
            }
            this.displayCarga = 'none';
          });
      }

    importar() {
    // if (this.detallesCopiaReset1.length > 0) {
    //   this.detallesCopia = this.detallesCopiaReset1;
    //   this.detallesCopiaReset = this.detallesCopiaReset1;
    // }
    // if (this.detallesCopia != undefined) {
    //   if (this.detallesCopia.length > 0) {
    //     this.seSeleccinaCopia = true;
    //     this.esquemaArbol5 = true;
    //     this.detallesCopiaReset.filter(
    //       (registro) => (registro.seleccionado = false)
    //     );
    //     this.detallesCopia = this.detallesCopiaReset;
    //   }
    // }
    // this.conceptoPadreParaImportar = precioUnitario;
    // if (precioUnitario.tipoPrecioUnitario == 0) {
    //   this.seEstaCopiando = true;
    //   this.datosCopia.idPrecioUnitarioBase = precioUnitario.id;
    //   this.isGrid = true;
    //   this.contenedor2 = true;
    //   this.seEstaCopiandoConcepto = true;
    //   this.seEstaCopiandoArmado = true;
    //   this.inicioCopia = 0;
    //   this.terminoCopia = 10;
    //   this.idTipoInsumoSelected = 0;
    // } else {
    //   this.seEstaCopiando = true;
    //   this.datosCopiaArmado.idPrecioUnitarioBase = precioUnitario.id;
    //   this.isGrid = true;
    //   this.contenedor2 = true;
    //   this.seEstaCopiandoArmado = true;
    //   this.seEstaCopiandoConcepto = false;
    //   this.inicioCopia = 0;
    //   this.terminoCopia = 10;
    //   this.idTipoInsumoSelected = 0;
    // }
  }

  importarConceptoDesdeArmado() {
    // if (this.detallesCopiaReset1.length > 0) {
    //   this.detallesCopia = this.detallesCopiaReset1.filter(
    //     (z) => z.idTipoInsumo == 10006
    //   );
    //   this.detallesCopiaReset = this.detallesCopia;
    // }
    // if (this.detallesCopia != undefined) {
    //   if (this.detallesCopia.length > 0) {
    //     this.seSeleccinaCopia = true;
    //     this.esquemaArbol5 = true;
    //     this.detallesCopiaReset.filter(
    //       (registro) => (registro.seleccionado = false)
    //     );
    //     this.detallesCopia = this.detallesCopiaReset;
    //     this.actualizarTotales();
    //   }
    // }
    // this.importarConceptoDesdePU = true;
    // this.seEstaCopiando = true;
    // this.datosCopiaArmado.idPrecioUnitarioBase = precioUnitario.id;
    // this.isGrid = true;
    // this.contenedor2 = true;
    // this.seEstaCopiandoArmado = true;
    // this.seEstaCopiandoConcepto = false;
    // this.inicioCopia = 0;
    // this.terminoCopia = 10;
    // this.idTipoInsumoSelected = 0;
  }

  autorizarPartida() {
    this.precioUnitarioService
      .autorizarXPrecioUnitario(this.precioUnitarioMenu, this.selectedEmpresa)
      .subscribe((datos) => {
        this.actualizarTotales();
        this.obtenerRegistros();
      });
  }

  actualizarTotales() {
    const totalSinIva = this.preciosUnitarios.reduce(
      (acumulado, precioUnitario) => acumulado + (precioUnitario.importe || 0),
      0
    );

    const totalConIva = this.preciosUnitarios.reduce(
      (acumulado, precioUnitario) =>
        acumulado +
        (precioUnitario.importe || 0) *
          (1 + (this.proyectoSelected.porcentajeIva || 0) / 100),
      0
    );

    console.log(totalConIva);

    this.totalSinIvaConFormato = totalSinIva.toLocaleString('es-MX', {
      style: 'currency',
      currency: 'MXN',
    });
    this.totalConFormato = totalConIva.toLocaleString('es-MX', {
      style: 'currency',
      currency: 'MXN',
    });
  }
}
