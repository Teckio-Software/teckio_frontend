import {
  Component,
  EventEmitter,
  HostBinding,
  HostListener,
  OnInit,
  Output,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { PrecioUnitarioService } from '../precio-unitario.service';
import {
  detalleDesglosadoDTO,
  precioUnitarioDTO,
  precioUnitarioCopiaDTO,
  datosParaCopiarDTO,
  DatosParaCopiarArmadoDTO,
  preciosParaEditarPosicionDTO,
} from '../tsPrecioUnitario';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ProyectoService } from '../../proyecto/proyecto.service';
import { proyectoDTO } from '../../proyecto/tsProyecto';
import { MatDialog } from '@angular/material/dialog';
import { PrecioUnitarioDetalleService } from '../../precio-unitario-detalle/precio-unitario-detalle.service';
import { TipoInsumoService } from 'src/app/catalogos/tipo-insumo/tipo-insumo.service';
import { FamiliaInsumoService } from 'src/app/catalogos/familia-insumo/familia-insumo.service';
import {
  precioUnitarioDetalleCopiaDTO,
  precioUnitarioDetalleDTO,
} from '../../precio-unitario-detalle/tsPrecioUnitarioDetalle';
import { tipoInsumoDTO } from 'src/app/catalogos/tipo-insumo/tsTipoInsumo';
import { familiaInsumoDTO } from 'src/app/catalogos/familia-insumo/tsFamilia';
import { GeneradoresDTO } from '../../Generadores/tsGeneradores';
import { GeneradoresService } from '../../Generadores/generadores.service';
import { Renderer2, ElementRef } from '@angular/core';
import { SeguridadService } from 'src/app/seguridad/seguridad.service';
import {
  diasConsideradosDTO,
  factorSalarioIntegradoDTO,
  factorSalarioRealDTO,
  factorSalarioRealDetalleDTO,
} from '../../fsr/tsFSR';
import { FSRService } from '../../fsr/fsr.service';
import { BehaviorSubject, connect, Observable } from 'rxjs';
import {
  InsumoDTO,
  InsumoParaExplosionDTO,
} from 'src/app/catalogos/insumo/tsInsumo';
import { InsumoService } from 'src/app/catalogos/insumo/insumo.service';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { NgbTooltip } from '@ng-bootstrap/ng-bootstrap';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { DialogFSRComponent } from '../dialog-fsr/dialog-fsr.component';
import { DialogExplosionInsumosComponent } from '../dialog-explosion-insumos/dialog-explosion-insumos.component';
import { Unidades } from '../unidades';
import { IndirectosComponent } from '../../indirectos/indirectos/indirectos.component';
import { content } from 'html2canvas/dist/types/css/property-descriptors/content';
import { IndirectosConceptoComponent } from '../../indirectos-concepto/indirectos-concepto/indirectos-concepto.component';
import Swal from 'sweetalert2';
import { eventListeners } from '@popperjs/core';
import { ModalAlertComponent } from 'src/app/utilidades/modal-alert/modal-alert.component';
import { da, de } from 'date-fns/locale';
import { operacionesXPrecioUnitarioDetalleDTO } from '../../precio-unitario-detalle/tsOperacionesXPrecioUnitarioDetalle';
import { EstimacionesService } from '../../estimaciones/estimaciones.service';

@Component({
  selector: 'app-precio-unitario',
  templateUrl: './precio-unitario.component.html',
  styleUrls: ['./precio-unitario.component.css'],
  providers: [NgbTooltip], // Agrega NgbTooltip en la lista de providers
})
export class PrecioUnitarioComponent implements OnInit {
  @ViewChild('tooltipContent') tooltipContent!: any;
  @ViewChild('tooltipIndirecto') tooltipIndirecto!: any;



  @ViewChild(NgbTooltip) tooltip!: NgbTooltip; // Inicialización de la propiedad tooltip
  selectedIndex: number = 0;
  preciosUnitarios!: precioUnitarioDTO[];
  preciosUnitariosRefresco!: precioUnitarioDTO[];
  insumos: InsumoDTO[] = [];
  insumosReset: InsumoDTO[] = [];
  insumosUnidades: InsumoDTO[] = [];
  Unidades!: string[];
  proyectos!: proyectoDTO[];
  proyectosReset!: proyectoDTO[];
  precioUnitarioPadre!: precioUnitarioDTO;
  detalles!: precioUnitarioDetalleDTO[];
  detallesReset!: precioUnitarioDetalleDTO[];
  detallesCopia!: precioUnitarioDetalleCopiaDTO[];
  detallesCopiaPrimerNivel!: precioUnitarioDetalleCopiaDTO[];
  detallesCopiaReset!: precioUnitarioDetalleCopiaDTO[];
  tiposInsumos!: tipoInsumoDTO[];
  familiasInsumos!: familiaInsumoDTO[];
  desglosados: detalleDesglosadoDTO[] = [];
  desglosadosCopia: detalleDesglosadoDTO[] = [];
  generadores!: GeneradoresDTO[];
  nombreProyecto: string = '';
  nombreProyectoCopia: string = '';
  precioUnitarioClick!: precioUnitarioDTO;
  preciosUnitariosParaCopiar!: precioUnitarioCopiaDTO[];
  fsrDetalles!: factorSalarioRealDetalleDTO[];
  detalle!: precioUnitarioDetalleDTO;
  selectUnidadPrecioU: boolean = false;
  detalleSeleccionado: precioUnitarioDetalleDTO = {
    id: 0,
    idPrecioUnitario: 0,
    idInsumo: 0,
    esCompuesto: false,
    costoUnitario: 0,
    costoUnitarioConFormato: '',
    costoUnitarioEditado: false,
    cantidad: 0,
    cantidadConFormato: '',
    cantidadEditado: false,
    cantidadExcedente: 0,
    idPrecioUnitarioDetallePerteneciente: 0,
    codigo: '',
    descripcion: '',
    unidad: '',
    idTipoInsumo: 0,
    idFamiliaInsumo: 0,
    importe: 0,
    importeConFormato: '',
    costoBase: 0,
    costoBaseConFormato: '',
  };
  fsr: factorSalarioRealDTO = {
    id: 0,
    idProyecto: 0,
    porcentajeFsr: 0,
    esCompuesto: false
  };
  diasConsideradosFsiPagados!: diasConsideradosDTO[];
  diasConsideradosFsiNoTrabajados!: diasConsideradosDTO[];
  fsi: factorSalarioIntegradoDTO = {
    id: 0,
    idProyecto: 0,
    fsi: 0,
  };
  datosCopia: datosParaCopiarDTO = {
    registros: [],
    idPrecioUnitarioBase: 0,
    idProyecto: 0,
  };
  datosCopiaArmado: DatosParaCopiarArmadoDTO = {
    registros: [],
    idPrecioUnitarioBase: 0,
    idProyecto: 0,
  };
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
  };
  selectedProyecto = 0;
  selectedProyecto2 = 0;
  selectedPrecioUnitario = 0;
  selectedPrecioUnitarioCopia = 0;
  selectedPrecioUnitarioDetalle = 0;
  existeCaptura = false;
  seMuestraDetalle = false;
  esquemaArbol1 = true;
  esquemaArbol2 = false;
  esquemaArbol3 = false;
  esquemaArbol4 = false;
  esquemaArbol5 = false;
  esTon = false;
  esKg = false;
  esM = false;
  esM2 = false;
  esM3 = false;
  esPza = false;
  dropdown = true;
  dropdown2 = true;
  seEstaCopiando = false;
  seSeleccinaCopia = false;
  selectedEmpresa = 0;
  porcentajePrestaciones = 0;
  diasNoLaborales = 0;
  diasPagados = 0;
  total = 0;
  totalConFormato = '';
  precioUnitarioPadreCreacion: precioUnitarioDTO = {
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
  };
  seEstaCopiandoArmado = false;
  seEstaCopiandoConcepto = false;
  displayCarga: string = 'none';
  // explosionInsumos!: InsumoParaExplosionDTO[];
  explosionInsumosReset!: InsumoParaExplosionDTO[];
  precioUnitarioEditado: precioUnitarioDTO = {
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
    porcentajeIndirecto: 0,
    porcentajeIndirectoConFormato: '',
    posicion: 0,
    codigoPadre: '',
  };
  precioUnitarioDetalleEditado: precioUnitarioDetalleDTO = {
    id: 0,
    idPrecioUnitario: 0,
    idInsumo: 0,
    esCompuesto: false,
    costoUnitario: 0,
    costoUnitarioConFormato: '',
    costoUnitarioEditado: false,
    cantidad: 0,
    cantidadConFormato: '',
    cantidadEditado: false,
    cantidadExcedente: 0,
    idPrecioUnitarioDetallePerteneciente: 0,
    codigo: '',
    descripcion: '',
    unidad: '',
    idTipoInsumo: 0,
    idFamiliaInsumo: 0,
    importe: 0,
    importeConFormato: '',
    costoBase: 0,
    costoBaseConFormato: '',
  };
  seEstaEditandoRegistro = false;
  // Redimensionamiento de la tabla
  isResizing = false;
  startMouseY = 0;
  initialHeight = 0;
  seEstaEditando = false;
  pestanas = false;
  inicio = 0;
  termino = 10;
  inicioCopia = 0;
  terminoCopia = 10;
  selectedCantidad = 0;
  selectedRendimiento = 0;
  selectedCantidadConFormato = '0.0000';
  selectedRendimientoConFormato = '0.0000';
  esAsignarDetalleRendimiento = false;
  cargando = false;

  //lista operaciones por Detalle
  operaciones: operacionesXPrecioUnitarioDetalleDTO[] = [];
  isRendimineto: boolean = true;
  isOpereciones: boolean = false;
  isOpenModal: boolean = false;

  contenedorPresupuesto: boolean = true;
  contenedorExplosionInsumo: boolean = false;
  appRecarga: number = 0;
  mostrarBotones: boolean = false;
  existenEstimaciones: boolean = false;
  selectedFileName: string = '';
  mensajeModal: string = '';

  operacionGenerador: string = '';
  generadorSeleccionado: GeneradoresDTO = {
    id: 0,
    idPrecioUnitario: 0,
    codigo: '',
    ejeX: '',
    ejeY: '',
    ejeZ: '',
    cantidad: 0,
    x: 0,
    y: 0,
    z: 0,
    cantidadTotal: 0,
    cantidadOperacion: '',
  };
  @ViewChild('InputOperacionGenerador') InputOperacionGenerador: any;

  archivosCargarExcels: FileList | null = null;
  @ViewChild('dialogPresupuestoExcel', { static: true })
  dialogCargaExcel!: TemplateRef<any>;

  onMouseDown(event: MouseEvent) {
    const target = event.target as HTMLElement;

    // Verificar si el botón izquierdo del mouse está presionado y si el cursor está en el borde inferior
    if (event.button === 0 && this.isCursorAtBottomBorder(target, event)) {
      this.enableResize(event);
    }
  }

  @HostListener('document:mouseup')
  onMouseUp() {
    this.disableResize();
  }

  @HostListener('document:mousemove', ['$event'])
  onMouseMove(event: MouseEvent) {
    if (this.isResizing) {
      const target = event.currentTarget as HTMLElement | null;

      if (target) {
        const deltaY = event.clientY - this.startMouseY;
        const newHeight = Math.max(50, this.initialHeight + deltaY);

        // Ajustar solo la altura, no la anchura
      }
    }
  }

  private enableResize(event: MouseEvent) {
    const target = event.currentTarget as HTMLElement | null;

    if (target) {
      this.isResizing = true;
      this.startMouseY = event.clientY;
      this.initialHeight = target.clientHeight;

      // Configurar el estilo CSS para permitir el redimensionamiento vertical
      target.style.resize = 'vertical';
    }
  }

  private disableResize() {
    this.isResizing = false;
  }

  private isCursorAtBottomBorder(
    target: HTMLElement,
    event: MouseEvent
  ): boolean {
    const rect = target.getBoundingClientRect();
    const bottomThreshold = 10; // Umbral para considerar el borde inferior del elemento
    return event.clientY > rect.bottom - bottomThreshold;
  }

  constructor(
    private precioUnitarioService: PrecioUnitarioService,
    private proyectoService: ProyectoService,
    private precioUnitarioDetalleService: PrecioUnitarioDetalleService,
    private tipoInsumoService: TipoInsumoService,
    private familiaInsumoService: FamiliaInsumoService,
    private generadoresService: GeneradoresService,
    private _snackBar: MatSnackBar,
    private _SeguridadEmpresa: SeguridadService,
    private fsrService: FSRService,
    public dialog: MatDialog,
    private insumoService: InsumoService,
    private unidades: Unidades,
    private estimacionesService: EstimacionesService
  ) {
    let idEmpresa = _SeguridadEmpresa.obtenIdEmpresaLocalStorage();
    let idProyecto = _SeguridadEmpresa.obtenerIdProyectoLocalStorage();
    this.selectedProyecto = Number(idProyecto);
    this.selectedEmpresa = Number(idEmpresa);
    this.Unidades = this.unidades.Getunidades();
  }

  draggedItem: any;

  dragStart(event: DragEvent, precioUnitario: any) {
    this.draggedItem = precioUnitario;
    event.dataTransfer?.setData(
      'application/json',
      JSON.stringify(precioUnitario)
    );
  }

  dragOver(event: DragEvent) {
    event.preventDefault();
  }

  registrosParaMover: preciosParaEditarPosicionDTO = {
    seleccionado: {
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
    },
    destino: {
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
    },
    esSubnivel: false,
    esCopiado: false,
  };

  conceptos: precioUnitarioDTO[] = [];
  conceptosReset: precioUnitarioDTO[] = [];

  drop(event: DragEvent, destino: any) {
    event.preventDefault();

    console.log(event.clientX, 'cliente X');
    console.log(event.clientX, 'cliente Y');
    console.log(event.bubbles, 'bubbles');
    console.log(event.button, 'button');
    console.log(event.ctrlKey, 'controlKEy');

    if (this.draggedItem && this.draggedItem !== destino) {
      try {
        const data = event.dataTransfer?.getData('application/json');
        if (data) {
          this.registrosParaMover.esSubnivel = event.ctrlKey;
          const draggedData = JSON.parse(data);
          this.registrosParaMover.seleccionado = draggedData;
          this.registrosParaMover.destino = destino;
          console.log(this.registrosParaMover);

          this.draggedItem = null;

          Swal.fire({
            // imageUrl: "assets/cancelado.svg",
            // icon: "error",
            confirmButtonText: 'Cerrar',
            html: `
                        <div>
                        <div class="mb-4"><p style="margin : 0px;">¡Seleccione!</p></div>
                            <div class="flex justify-center gap-4">
                                <button id="botonCopiar" class="py-2 px-4 rounded" style="background-color: rgba(143, 204, 219, 0.59); color: rgb(53, 52, 52);">Copiar</button>
                                <button id="botonArrastrar" class="py-2 px-4 rounded" style="background-color: rgba(143, 204, 219, 0.59); color: rgb(53, 52, 52);">Mover</button>
                            </div>
                        </div>
                        `,
            imageWidth: 50,
            customClass: {
              icon: 'no-border',
              confirmButton: 'SweetAlert2ConfirmButtonError',
            },
            didOpen: () => {
              const copiar = document.getElementById('botonCopiar');
              const arrastrar = document.getElementById('botonArrastrar');

              if (copiar) {
                copiar.addEventListener('click', () => {
                  this.copiarPU();
                  Swal.close();
                });
              }
              if (arrastrar) {
                arrastrar.addEventListener('click', () => {
                  this.arrarstrarPU();
                  Swal.close();
                });
              }
            },
          });
        }
      } catch (error) {
        console.error('Error al procesar el drag and drop:', error);
      }
    }
  }

  copiarPU() {
    this.registrosParaMover.esCopiado = true;
    console.log('copiando PU ', this.registrosParaMover);
    this.precioUnitarioService
      .moverPosicion(this.registrosParaMover, this.selectedEmpresa)
      .subscribe((preciosUnitarios) => {
        this.preciosUnitarios = preciosUnitarios;
        this.total = 0;
        for (let i = 0; i < this.preciosUnitarios.length; i++) {
          this.total = this.total + this.preciosUnitarios[i].importe;
        }
        this.totalConFormato = new Intl.NumberFormat('es-MX', {
          style: 'currency',
          currency: 'MXN',
        }).format(this.total);
      });
  }
  arrarstrarPU() {
    this.registrosParaMover.esCopiado = false;
    console.log('arrastrando PU ', this.registrosParaMover);
    this.precioUnitarioService
      .moverPosicion(this.registrosParaMover, this.selectedEmpresa)
      .subscribe((preciosUnitarios) => {
        this.preciosUnitarios = preciosUnitarios;
        this.total = 0;
        for (let i = 0; i < this.preciosUnitarios.length; i++) {
          this.total = this.total + this.preciosUnitarios[i].importe;
        }
        this.totalConFormato = new Intl.NumberFormat('es-MX', {
          style: 'currency',
          currency: 'MXN',
        }).format(this.total);
      });
  }

  @ViewChild('testInput') testInput: any;
  @ViewChild('autoSumaInput') autoSumaInput: any;
  @ViewChild('descripcionInput') descripcionInput: any;
  @ViewChild('paginadoCopia') paginadoCopia: any;
  @ViewChild('paginadoBase') paginadoBase: any;
  @ViewChild('inputFiltradoCopia') inputFiltradoCopia: any;
  @ViewChild('inputFiltrado') inputFiltrado: any;

  ngOnInit(): void {
    this.estimacionesService
      .obtenerPeriodos(this.selectedProyecto, this.selectedEmpresa)
      .subscribe((datos) => {
        if (datos.length > 0) {
          this.existenEstimaciones = true;
        }
      });
    this.cambiarProyecto();
    this.proyectoService
      .obtenerTodosSinEstructurar(this.selectedEmpresa)
      .subscribe((proyectos) => {
        this.proyectos = proyectos;
        this.proyectosReset = proyectos;
      });
    this.familiaInsumoService
      .obtenerTodosSinPaginar(this.selectedEmpresa)
      .subscribe((familias) => {
        this.familiasInsumos = familias;
      });
    this.tipoInsumoService
      .obtenerTodosSinPaginar(this.selectedEmpresa)
      .subscribe((tipos) => {
        this.tiposInsumos = tipos;
      });

  }

  cargarListaConceptos(){
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
        }
      });
  }

  expansionDominio(precioUnitario: precioUnitarioDTO): void {
    precioUnitario.expandido = !precioUnitario.expandido;
  }

  cargarRegistros() {
    this.seEstaEditandoRegistro = false;
    this.total = 0;
    console.log('Aqui estoy', this.preciosUnitarios);
    this.precioUnitarioService
      .obtenerEstructurado(this.selectedProyecto, this.selectedEmpresa)
      .subscribe((preciosUnitarios) => {
        this.preciosUnitarios = preciosUnitarios;
        for (let i = 0; i < preciosUnitarios.length; i++) {
          this.total = this.total + this.preciosUnitarios[i].importe;
        }
        this.totalConFormato = new Intl.NumberFormat('es-MX', {
          style: 'currency',
          currency: 'MXN',
        }).format(this.total);
        if (preciosUnitarios.length <= 0) {
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
            costoUnitarioConFormato: '0.00',
            precioUnitarioConFormato: '0.00',
            importeConFormato: '0.00',
            importeSeriesConFormato: '0.00',
            cantidadEditado: false,
            costoUnitarioEditado: false,
            precioUnitarioEditado: false,
            porcentajeIndirecto: 0,
            porcentajeIndirectoConFormato: '',
            posicion: 0,
            codigoPadre: '',
          });
        }
        this.insumoService
          .obtenerParaAutocomplete(this.selectedProyecto, this.selectedEmpresa)
          .subscribe((insumos) => {
            this.insumos = insumos;
            this.insumosReset = insumos;
          });
        this.cargarListaConceptos();
      });
    this.esquemaArbol2 = false;
    this.esquemaArbol3 = false;
    this.pestanas = false;
    this.esquemaArbol4 = false;
    this.existeCaptura = false;
  }

  openTooltip() {
    console.log('holi');
    this.tooltip.open({ content: this.tooltipContent });
  }

  cerrarTooltip() {
    this.tooltip.close();
  }
  openTooltipIndirecto() {
    this.tooltip.open({ content: this.tooltipIndirecto });
  }

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
      costoUnitarioConFormato: '0.00',
      precioUnitarioConFormato: '0.00',
      importeConFormato: '0.00',
      importeSeriesConFormato: '0.00',
      cantidadEditado: false,
      costoUnitarioEditado: false,
      precioUnitarioEditado: false,
      porcentajeIndirecto: 0,
      porcentajeIndirectoConFormato: '',
      posicion: 0,
      codigoPadre: '',
    };
    this.testInput.nativeElement.style.display = 'none';
    this.mostrarBotones = false;
    this.precioUnitarioEditado.cantidadEditado = false;
    this.precioUnitarioEditado.costoUnitarioEditado = false;
    this.seEstaEditandoRegistro = false;
    if (precioUnitario.id == 0) {
      if (precioUnitario.nivel == 0) {
        precioUnitario.nivel = 1;
      }
      precioUnitario.idProyecto = this.selectedProyecto;
      if (precioUnitario.tipoPrecioUnitario == 0) {
        if (
          typeof precioUnitario.codigo == undefined ||
          !precioUnitario.codigo ||
          precioUnitario.codigo == '' ||
          typeof precioUnitario.descripcion == undefined ||
          !precioUnitario.descripcion ||
          precioUnitario.descripcion == ''
        ) {
          this._snackBar.open('capture todos los campos', 'X', {
            duration: 3000,
          });
          return;
        }
        this.displayCarga = 'flex';
        this.precioUnitarioService
          .crearYObtener(precioUnitario, this.selectedEmpresa)
          .subscribe((preciosUnitarios) => {
            this.preciosUnitariosRefresco = preciosUnitarios;
            this.refrescar();
            this.cargarListaConceptos();
            this.displayCarga = 'none';
          });
      } else {
        // if (typeof precioUnitario.codigo == undefined || !precioUnitario.codigo || precioUnitario.codigo == "" ||
        //     typeof precioUnitario.descripcion == undefined || !precioUnitario.descripcion || precioUnitario.descripcion == "" ||
        //     typeof precioUnitario.unidad == undefined || !precioUnitario.unidad || precioUnitario.unidad == "") {
        //     this._snackBar.open("capture todos los campos", "X", { duration: 3000 });
        //     return;
        // }
        if (
          typeof precioUnitario.codigo == undefined ||
          !precioUnitario.codigo ||
          precioUnitario.codigo == ''
        ) {
          this._snackBar.open('capture todos los campos1', 'X', {
            duration: 3000,
          });
          return;
        } else if (
          (precioUnitario.descripcion != '' && precioUnitario.unidad == '') ||
          (precioUnitario.descripcion == '' && precioUnitario.unidad != '')
        ) {
          this._snackBar.open('capture todos los campos2', 'X', {
            duration: 3000,
          });
          return;
        }
        this.displayCarga = 'flex';
        this.precioUnitarioService
          .crearYObtener(precioUnitario, this.selectedEmpresa)
          .subscribe((precioUnitario) => {
            this.preciosUnitariosRefresco = precioUnitario;
            this.refrescar();
            this.cargarListaConceptos();
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
        if (
          typeof precioUnitario.codigo == undefined ||
          !precioUnitario.codigo ||
          precioUnitario.codigo == '' ||
          typeof precioUnitario.descripcion == undefined ||
          !precioUnitario.descripcion ||
          precioUnitario.descripcion == ''
        ) {
          this._snackBar.open('capture todos los campos', 'X', {
            duration: 3000,
          });
          return;
        }
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
        if (
          typeof precioUnitario.codigo == undefined ||
          !precioUnitario.codigo ||
          precioUnitario.codigo == '' ||
          typeof precioUnitario.descripcion == undefined ||
          !precioUnitario.descripcion ||
          precioUnitario.descripcion == '' ||
          typeof precioUnitario.unidad == undefined ||
          !precioUnitario.unidad ||
          precioUnitario.unidad == ''
        ) {
          this._snackBar.open('capture todos los campos', 'X', {
            duration: 3000,
          });
          return;
        }
        this.displayCarga = 'flex';
        this.precioUnitarioService
          .editar(precioUnitario, this.selectedEmpresa)
          .subscribe((precioUnitario) => {
            this.preciosUnitariosRefresco = precioUnitario;
            this.refrescar();
            this.cargarListaConceptos();
            this.displayCarga = 'none';
          });
      }
      this.existeCaptura = false;
    }
  }

  crearPartidaAlMismoNivel(precioUnitario: precioUnitarioDTO) {
    if (this.existeCaptura == false) {
      if (precioUnitario.idPrecioUnitarioBase == 0) {
        this.preciosUnitarios.push({
          id: 0,
          idProyecto: precioUnitario.idProyecto,
          cantidad: 1,
          cantidadExcedente: 0,
          tipoPrecioUnitario: 0,
          costoUnitario: 0,
          nivel: 1,
          noSerie: precioUnitario.noSerie,
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
          costoUnitarioConFormato: '0.00',
          precioUnitarioConFormato: '0.00',
          importeConFormato: '0.00',
          importeSeriesConFormato: '0.00',
          cantidadEditado: false,
          costoUnitarioEditado: false,
          precioUnitarioEditado: false,
          porcentajeIndirecto: 0,
          porcentajeIndirectoConFormato: '',
          posicion: 0,
          codigoPadre: '',
        });
        this.precioUnitarioPadreCreacion.hijos = this.preciosUnitarios;
      } else {
        this.buscarNodo(precioUnitario.idPrecioUnitarioBase);
        this.precioUnitarioPadre.hijos.push({
          id: 0,
          idProyecto: precioUnitario.idProyecto,
          cantidad: 1,
          cantidadExcedente: 0,
          tipoPrecioUnitario: 0,
          costoUnitario: 0,
          nivel: precioUnitario.nivel,
          noSerie: precioUnitario.noSerie,
          idPrecioUnitarioBase: precioUnitario.idPrecioUnitarioBase,
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
          costoUnitarioConFormato: '0.00',
          precioUnitarioConFormato: '0.00',
          importeConFormato: '0.00',
          importeSeriesConFormato: '0.00',
          cantidadEditado: false,
          costoUnitarioEditado: false,
          precioUnitarioEditado: false,
          porcentajeIndirecto: 0,
          porcentajeIndirectoConFormato: '',
          posicion: 0,
          codigoPadre: '',
        });
        this.precioUnitarioPadreCreacion = this.precioUnitarioPadre;
      }
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

  crearSubPartida(precioUnitario: precioUnitarioDTO) {
    this.precioUnitarioPadreCreacion = precioUnitario;
    precioUnitario.expandido = true;
    if (this.existeCaptura == false) {
      if (precioUnitario.tipoPrecioUnitario != 0) {
        this.buscarNodo(precioUnitario.idPrecioUnitarioBase);
        this.precioUnitarioPadre.hijos.push({
          id: 0,
          idProyecto: precioUnitario.idProyecto,
          cantidad: 1,
          cantidadExcedente: 0,
          tipoPrecioUnitario: 0,
          costoUnitario: 0,
          nivel: this.precioUnitarioPadre.nivel + 1,
          noSerie: precioUnitario.noSerie,
          idPrecioUnitarioBase: precioUnitario.idPrecioUnitarioBase,
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
          costoUnitarioConFormato: '0.00',
          precioUnitarioConFormato: '0.00',
          importeConFormato: '0.00',
          importeSeriesConFormato: '0.00',
          cantidadEditado: false,
          costoUnitarioEditado: false,
          precioUnitarioEditado: false,
          porcentajeIndirecto: 0,
          porcentajeIndirectoConFormato: '',
          posicion: 0,
          codigoPadre: '',
        });
        this.precioUnitarioPadreCreacion = this.precioUnitarioPadre;
      } else {
        precioUnitario.hijos.push({
          id: 0,
          idProyecto: precioUnitario.idProyecto,
          cantidad: 1,
          cantidadExcedente: 0,
          tipoPrecioUnitario: 0,
          costoUnitario: 0,
          nivel: precioUnitario.nivel + 1,
          noSerie: precioUnitario.noSerie,
          idPrecioUnitarioBase: precioUnitario.id,
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
          costoUnitarioConFormato: '0.00',
          precioUnitarioConFormato: '0.00',
          importeConFormato: '0.00',
          importeSeriesConFormato: '0.00',
          cantidadEditado: false,
          costoUnitarioEditado: false,
          precioUnitarioEditado: false,
          porcentajeIndirecto: 0,
          porcentajeIndirectoConFormato: '',
          posicion: 0,
          codigoPadre: '',
        });
        this.precioUnitarioPadreCreacion = precioUnitario;
      }
      this.existeCaptura = true;
    }
  }

  crearConcepto(precioUnitario: precioUnitarioDTO) {
    precioUnitario.expandido = true;
    if (this.existeCaptura == false) {
      if (precioUnitario.tipoPrecioUnitario != 0) {
        this.buscarNodo(precioUnitario.idPrecioUnitarioBase);
        this.precioUnitarioPadre.hijos.push({
          id: 0,
          idProyecto: precioUnitario.idProyecto,
          cantidad: 0,
          cantidadExcedente: 0,
          tipoPrecioUnitario: 1,
          costoUnitario: 0,
          nivel: this.precioUnitarioPadre.nivel + 1,
          noSerie: precioUnitario.noSerie,
          idPrecioUnitarioBase: precioUnitario.idPrecioUnitarioBase,
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
          costoUnitarioConFormato: '0.00',
          precioUnitarioConFormato: '0.00',
          importeConFormato: '0.00',
          importeSeriesConFormato: '0.00',
          cantidadEditado: false,
          costoUnitarioEditado: false,
          precioUnitarioEditado: false,
          porcentajeIndirecto: 0,
          porcentajeIndirectoConFormato: '',
          posicion: 0,
          codigoPadre: '',
        });
        this.precioUnitarioPadreCreacion = this.precioUnitarioPadre;
      } else {
        precioUnitario.hijos.push({
          id: 0,
          idProyecto: precioUnitario.idProyecto,
          cantidad: 0,
          cantidadExcedente: 0,
          tipoPrecioUnitario: 1,
          costoUnitario: 0,
          nivel: precioUnitario.nivel + 1,
          noSerie: precioUnitario.noSerie,
          idPrecioUnitarioBase: precioUnitario.id,
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
          costoUnitarioConFormato: '0.00',
          precioUnitarioConFormato: '0.00',
          importeConFormato: '0.00',
          importeSeriesConFormato: '0.00',
          cantidadEditado: false,
          costoUnitarioEditado: false,
          precioUnitarioEditado: false,
          porcentajeIndirecto: 0,
          porcentajeIndirectoConFormato: '',
          posicion: 0,
          codigoPadre: '',
        });
        this.precioUnitarioPadreCreacion = precioUnitario;
      }
    }
    this.existeCaptura = true;
  }

  refrescar() {
    this.preciosUnitarios = this.preciosUnitariosRefresco;
    this.total = 0;
    for (let i = 0; i < this.preciosUnitarios.length; i++) {
      this.total = this.total + this.preciosUnitarios[i].importe;
      this.totalConFormato = new Intl.NumberFormat('es-MX', {
        style: 'currency',
        currency: 'MXN',
      }).format(this.total);
    }
  }

  refrescaHijos(
    preciosUnitariosHijos: precioUnitarioDTO[],
    preciosUnitariosHijosRefresco: precioUnitarioDTO[]
  ) {
    if (preciosUnitariosHijosRefresco.length > 0) {
      for (let i = 0; i < preciosUnitariosHijosRefresco.length; i++) {
        this.refrescaHijos(
          preciosUnitariosHijos[i].hijos,
          preciosUnitariosHijosRefresco[i].hijos
        );
        preciosUnitariosHijos[i].id = preciosUnitariosHijosRefresco[i].id;
        preciosUnitariosHijos[i].idProyecto =
          preciosUnitariosHijosRefresco[i].idProyecto;
        preciosUnitariosHijos[i].cantidad =
          preciosUnitariosHijosRefresco[i].cantidad;
        preciosUnitariosHijos[i].cantidadExcedente =
          preciosUnitariosHijosRefresco[i].cantidadExcedente;
        preciosUnitariosHijos[i].tipoPrecioUnitario =
          preciosUnitariosHijosRefresco[i].tipoPrecioUnitario;
        preciosUnitariosHijos[i].costoUnitario =
          preciosUnitariosHijosRefresco[i].costoUnitario;
        preciosUnitariosHijos[i].nivel = preciosUnitariosHijosRefresco[i].nivel;
        preciosUnitariosHijos[i].noSerie =
          preciosUnitariosHijosRefresco[i].noSerie;
        preciosUnitariosHijos[i].idPrecioUnitarioBase =
          preciosUnitariosHijosRefresco[i].idPrecioUnitarioBase;
        preciosUnitariosHijos[i].esDetalle =
          preciosUnitariosHijosRefresco[i].esDetalle;
        preciosUnitariosHijos[i].idConcepto =
          preciosUnitariosHijosRefresco[i].idConcepto;
        preciosUnitariosHijos[i].codigo =
          preciosUnitariosHijosRefresco[i].codigo;
        preciosUnitariosHijos[i].descripcion =
          preciosUnitariosHijosRefresco[i].descripcion;
        preciosUnitariosHijos[i].unidad =
          preciosUnitariosHijosRefresco[i].unidad;
        preciosUnitariosHijos[i].precioUnitario =
          preciosUnitariosHijosRefresco[i].precioUnitario;
        preciosUnitariosHijos[i].importe =
          preciosUnitariosHijosRefresco[i].importe;
        preciosUnitariosHijos[i].importeSeries =
          preciosUnitariosHijosRefresco[i].importeSeries;
      }
    }
  }

  cargarDetallesXIdPrecioUnitario(PrecioUnitario: precioUnitarioDTO) {
    let detalleVacio: precioUnitarioDetalleDTO = {
      id: 0,
      idPrecioUnitario: 0,
      idInsumo: 0,
      esCompuesto: false,
      costoUnitario: 0,
      costoUnitarioConFormato: '',
      costoUnitarioEditado: false,
      cantidad: 0,
      cantidadConFormato: '',
      cantidadEditado: false,
      cantidadExcedente: 0,
      idPrecioUnitarioDetallePerteneciente: 0,
      codigo: '',
      descripcion: '',
      unidad: '',
      idTipoInsumo: 0,
      idFamiliaInsumo: 0,
      importe: 0,
      importeConFormato: '',
      costoBase: 0,
      costoBaseConFormato: '',
    };
    this.detalleSeleccionado = detalleVacio;
    if (PrecioUnitario.id > 0) {
      if (PrecioUnitario.tipoPrecioUnitario == 0) {
        return;
      }
      console.log(this.selectedIndex);
      this.displayCarga = 'flex';
      if (PrecioUnitario.tipoPrecioUnitario == 1) {
        this.esquemaArbol2 = true;
        this.seMuestraDetalle = true;
        this.pestanas = true;
        this.esquemaArbol3 = true;
        this.esquemaArbol4 = false;
        if (PrecioUnitario.unidad.toLowerCase() == 'm' || PrecioUnitario.unidad.toLowerCase() == 'ml') {
          this.esM = true;
        } else {
          this.esM = false;
        }
        if (PrecioUnitario.unidad.toLowerCase() == 'm2') {
          this.esM2 = true;
        } else {
          this.esM2 = false;
        }
        if (PrecioUnitario.unidad.toLowerCase() == 'm3') {
          this.esM3 = true;
        } else {
          this.esM3 = false;
        }
        if (PrecioUnitario.unidad.toLowerCase() == 'kg') {
          this.esKg = true;
        } else {
          this.esKg = false;
        }
        if (PrecioUnitario.unidad.toLowerCase() == 'ton') {
          this.esTon = true;
        } else {
          this.esTon = false;
        }
        if (PrecioUnitario.unidad.toLowerCase() == 'pza') {
          this.esPza = true;
        } else {
          this.esPza = false;
        }
        this.cargarGeneradores(PrecioUnitario.id);
        this.esquemaArbol1 = false;
        this.desglosados = [];
        this.selectedPrecioUnitario = PrecioUnitario.id;
        this.desglosados.push({
          id: 0,
          idPrecioUnitario: PrecioUnitario.id,
          codigo: PrecioUnitario.codigo,
          descripcion: PrecioUnitario.descripcion,
          idDetallePerteneciente: 0,
          unidad: PrecioUnitario.unidad,
          costo: PrecioUnitario.costoUnitario,
          cantidad: PrecioUnitario.cantidad,
          cantidadConFormato: new Intl.NumberFormat('es-MX', {
            minimumFractionDigits: 4,
          }).format(PrecioUnitario.cantidad),
          costoConFormato: new Intl.NumberFormat('es-MX', {
            style: 'currency',
            currency: 'MXN',
          }).format(PrecioUnitario.costoUnitario),
        });
        if (PrecioUnitario.tipoPrecioUnitario == 1) {
          this.precioUnitarioDetalleService
            .obtenerTodos(PrecioUnitario.id, this.selectedEmpresa)
            .subscribe((detalles) => {
              this.detalles = detalles;
              this.detalles.forEach((element) => {
                element.cantidadConFormato = new Intl.NumberFormat('es-MX', {
                  minimumFractionDigits: 4,
                }).format(element.cantidad);
              });
              this.detallesReset = detalles;
              this.detalles.push({
                id: 0,
                idPrecioUnitario: 0,
                idInsumo: 0,
                esCompuesto: false,
                costoUnitario: 0,
                cantidad: 0,
                cantidadExcedente: 0,
                idPrecioUnitarioDetallePerteneciente: 0,
                codigo: '',
                descripcion: '',
                unidad: '',
                idTipoInsumo: 0,
                idFamiliaInsumo: 0,
                importe: 0,
                costoUnitarioConFormato: '0.00',
                cantidadConFormato: '0.00',
                importeConFormato: '0.00',
                costoUnitarioEditado: false,
                cantidadEditado: false,
                costoBase: 0,
                costoBaseConFormato: '0.00',
              });
              this.displayCarga = 'none';
            });
        }
      }
    }
  }

  idTipoInsumoSelected: number = 0;

  prueba10(number: number) {
    this.idTipoInsumoSelected = number;
    this.cargarDetallesXIdPrecioUnitarioCopia(
      this.precioUnitarioParaCopiar,
      this.idTipoInsumoSelected
    );
  }

  precioUnitarioParaCopiar: precioUnitarioCopiaDTO = {
    hijos: [],
    seleccionado: false,
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
  };

  cargarDetallesXIdPrecioUnitarioCopia1(
    PrecioUnitarioCopia: precioUnitarioCopiaDTO
  ) {
    this.esquemaArbol5 = true;
    this.precioUnitarioParaCopiar = PrecioUnitarioCopia;
    if (PrecioUnitarioCopia.id > 0) {
      this.desglosadosCopia = [];
      this.seMuestraDetalle = true;
      this.selectedPrecioUnitarioCopia = PrecioUnitarioCopia.id;
      this.desglosadosCopia.push({
        id: 0,
        idPrecioUnitario: PrecioUnitarioCopia.id,
        codigo: PrecioUnitarioCopia.codigo,
        descripcion: PrecioUnitarioCopia.descripcion,
        idDetallePerteneciente: 0,
        unidad: PrecioUnitarioCopia.unidad,
        costo: PrecioUnitarioCopia.costoUnitario,
        cantidad: PrecioUnitarioCopia.cantidad,
        cantidadConFormato: new Intl.NumberFormat('es-MX', {
          style: 'currency',
          currency: 'MXN',
        }).format(PrecioUnitarioCopia.cantidad),
        costoConFormato: new Intl.NumberFormat('es-MX', {
          style: 'currency',
          currency: 'MXN',
        }).format(PrecioUnitarioCopia.costoUnitario),
      });
      this.cargarDetallesXIdPrecioUnitarioCopia(
        PrecioUnitarioCopia,
        this.idTipoInsumoSelected
      );
    }
    this.seSeleccinaCopia = true;
  }

  detallesCopiaReset1: precioUnitarioDetalleCopiaDTO[] = [];

  cargarDetallesXIdPrecioUnitarioCopia(
    PrecioUnitarioCopia: precioUnitarioCopiaDTO,
    idTipoInsumo: number
  ) {
    this.displayCarga = 'flex';
    if (PrecioUnitarioCopia.id > 0) {
      this.desglosadosCopia = [];
      this.seMuestraDetalle = true;
      this.selectedPrecioUnitarioCopia = PrecioUnitarioCopia.id;
      this.desglosadosCopia.push({
        id: 0,
        idPrecioUnitario: PrecioUnitarioCopia.id,
        codigo: PrecioUnitarioCopia.codigo,
        descripcion: PrecioUnitarioCopia.descripcion,
        idDetallePerteneciente: 0,
        unidad: PrecioUnitarioCopia.unidad,
        costo: PrecioUnitarioCopia.costoUnitario,
        cantidad: PrecioUnitarioCopia.cantidad,
        cantidadConFormato: PrecioUnitarioCopia.cantidad.toLocaleString(),
        costoConFormato: PrecioUnitarioCopia.costoUnitario.toLocaleString(),
      });
      if (PrecioUnitarioCopia.tipoPrecioUnitario == 1) {
        this.precioUnitarioDetalleService
          .obtenerTodosFiltrado(
            PrecioUnitarioCopia.id,
            idTipoInsumo,
            this.selectedEmpresa
          )
          .subscribe((detalles) => {
            if (this.conceptoPadreParaImportar.tipoPrecioUnitario == 0) {
              this.detallesCopia = detalles;
              this.detallesCopia = this.detallesCopia.filter(
                (z) => z.idTipoInsumo == 10006
              );
              this.detallesCopiaReset = this.detallesCopia.filter(
                (z) => z.idTipoInsumo == 10006
              );
              this.detallesCopiaReset1 = detalles;
              this.displayCarga = 'none';
            } else {
              this.detallesCopia = detalles;
              this.detallesCopiaReset = detalles;
              this.detallesCopiaReset1 = detalles;
              this.displayCarga = 'none';
            }
            this.paginadoCopia.pageIndex = 0;
            this.inicioCopia = 0;
            this.terminoCopia = 10;
          });
      }
    }
    this.seSeleccinaCopia = true;
  }

  // cargarDetallesXIdPrecioUnitarioDetalleCopia(registro: precioUnitarioDetalleCopiaDTO){
  //     this.displayCarga = 'flex';
  //     if(registro.idTipoInsumo == 10006){
  //         this.precioUnitarioDetalleService.obtenerHijos(registro, this.selectedEmpresa)
  //         .subscribe((detalles) => {

  //         })
  //     }
  // }

  mostrarTabla3() {
    this.esquemaArbol3 = true;
    this.esquemaArbol4 = false;
  }

  mostrarTabla4() {
    this.esquemaArbol3 = false;
  }

  volverCero(detalle: precioUnitarioDetalleDTO) {
    if (detalle.esCompuesto == true) {
      detalle.costoUnitario = 0;
    }
  }

  cargarDetallesXPrecioUnitarioDetalle(detalle: precioUnitarioDetalleDTO) {
    if (detalle.id != 0) {
      this.inputFiltrado.nativeElement.value = '';
      this.seEstaEditandoRegistro = false;
      this.displayCarga = 'flex';
      if (detalle.esCompuesto == true && detalle.id > 0) {
        if (this.cargando == false) {
          this.cargando = true;
          this.precioUnitarioDetalleService
            .obtenerHijos(detalle, this.selectedEmpresa)
            .subscribe((detalles) => {
              this.inicio = 0;
              this.termino = 10;
              this.paginadoBase.pageIndex = 0;
              this.detalles = detalles;
              this.detalles.push({
                id: 0,
                idPrecioUnitario: 0,
                idInsumo: 0,
                esCompuesto: false,
                costoUnitario: 0,
                cantidad: 0,
                cantidadExcedente: 0,
                idPrecioUnitarioDetallePerteneciente: detalle.id,
                codigo: '',
                descripcion: '',
                unidad: '',
                idTipoInsumo: 0,
                idFamiliaInsumo: 0,
                importe: 0,
                costoUnitarioConFormato: '0.00',
                cantidadConFormato: '0.00',
                importeConFormato: '0.00',
                costoUnitarioEditado: false,
                cantidadEditado: false,
                costoBase: 0,
                costoBaseConFormato: '0.00',
              });
              this.desglosados.push({
                id: 0,
                idPrecioUnitario: detalle.idPrecioUnitario,
                codigo: detalle.codigo,
                descripcion: detalle.descripcion,
                unidad: detalle.unidad,
                cantidad: detalle.cantidad,
                idDetallePerteneciente: detalle.id,
                costo: detalle.costoUnitario,
                cantidadConFormato: new Intl.NumberFormat('es-MX', {
                  minimumFractionDigits: 4,
                }).format(detalle.cantidad),
                costoConFormato: new Intl.NumberFormat('es-MX', {
                  style: 'currency',
                  currency: 'MXN',
                }).format(detalle.costoUnitario),
              });
              this.displayCarga = 'none';
              this.cargando = false;
            });
        }
      }
    }
  }

  cargarDetallesXPrecioUnitarioDetalleCopia(detalle: precioUnitarioDetalleDTO) {
    if (detalle.esCompuesto == true) {
      this.inicioCopia = 0;
      this.terminoCopia = 10;
      this.displayCarga = 'flex';
      this.precioUnitarioDetalleService
        .obtenerHijos(detalle, this.selectedEmpresa)
        .subscribe((detalles) => {
          this.inicio = 0;
          this.termino = 10;
          this.detallesCopia = detalles;
          this.detallesCopiaReset = detalles;
          this.desglosadosCopia.push({
            id: 0,
            idPrecioUnitario: detalle.idPrecioUnitario,
            codigo: detalle.codigo,
            descripcion: detalle.descripcion,
            unidad: detalle.unidad,
            cantidad: detalle.cantidad,
            idDetallePerteneciente: detalle.id,
            costo: detalle.costoUnitario,
            cantidadConFormato: new Intl.NumberFormat('es-MX', {
              style: 'currency',
              currency: 'MXN',
            }).format(detalle.cantidad),
            costoConFormato: new Intl.NumberFormat('es-MX', {
              style: 'currency',
              currency: 'MXN',
            }).format(detalle.costoUnitario),
          });
          this.displayCarga = 'none';
        });
    }
  }

  cargarGeneradores(idPrecioUnitario: number) {
    this.generadoresService
      .obtenerTodos(idPrecioUnitario, this.selectedEmpresa)
      .subscribe((generadores) => {
        this.generadores = generadores;
        this.generadores.push({
          id: 0,
          idPrecioUnitario: idPrecioUnitario,
          codigo: '',
          ejeX: '',
          ejeY: '',
          ejeZ: '',
          cantidad: 0,
          x: 1,
          y: 1,
          z: 1,
          cantidadTotal: 0,
          cantidadOperacion: '',
        });
      });
  }

  crearDetalle(detalle: precioUnitarioDetalleDTO) {
    this.seEstaEditandoRegistro = false;
    detalle.idPrecioUnitario = this.selectedPrecioUnitario;
    if (detalle.id == 0) {
      if (
        typeof detalle.codigo == undefined ||
        !detalle.codigo ||
        detalle.codigo == '' ||
        typeof detalle.descripcion == undefined ||
        !detalle.descripcion ||
        detalle.descripcion == '' ||
        typeof detalle.unidad == undefined ||
        !detalle.unidad ||
        detalle.unidad == '' ||
        typeof detalle.idTipoInsumo == undefined ||
        !detalle.idTipoInsumo ||
        detalle.idTipoInsumo <= 0
      ) {
        this._snackBar.open('capture todos los campos', 'X', {
          duration: 3000,
        });
        return;
      }
      this.displayCarga = 'flex';
      this.precioUnitarioDetalleService
        .creaRegistro(detalle, this.selectedEmpresa)
        .subscribe((detalles) => {
          this.detalles = detalles;
          this.precioUnitarioService
            .obtenerEstructurado(this.selectedProyecto, this.selectedEmpresa)
            .subscribe((precios) => {
              this.preciosUnitariosRefresco = precios;
              this.refrescar();
              this.detalles.push({
                id: 0,
                idPrecioUnitario: 0,
                idInsumo: 0,
                esCompuesto: false,
                costoUnitario: 0,
                cantidad: 0,
                cantidadExcedente: 0,
                idPrecioUnitarioDetallePerteneciente:
                  detalle.idPrecioUnitarioDetallePerteneciente,
                codigo: '',
                descripcion: '',
                unidad: '',
                idTipoInsumo: 0,
                idFamiliaInsumo: 0,
                importe: 0,
                costoUnitarioConFormato: '0.00',
                cantidadConFormato: '0.00',
                importeConFormato: '0.00',
                costoUnitarioEditado: false,
                cantidadEditado: false,
                costoBase: 0,
                costoBaseConFormato: '0.00',
              });
              this.displayCarga = 'none';
            });
          this.insumoService
            .obtenerParaAutocomplete(
              this.selectedProyecto,
              this.selectedEmpresa
            )
            .subscribe((insumos) => {
              this.insumos = insumos;
              this.insumosReset = insumos;
            });
          this.cargarListaConceptos();
        });
    } else {
      if (
        typeof detalle.codigo == undefined ||
        !detalle.codigo ||
        detalle.codigo == '' ||
        typeof detalle.descripcion == undefined ||
        !detalle.descripcion ||
        detalle.descripcion == '' ||
        typeof detalle.unidad == undefined ||
        !detalle.unidad ||
        detalle.unidad == '' ||
        typeof detalle.idTipoInsumo == undefined ||
        !detalle.idTipoInsumo ||
        detalle.idTipoInsumo <= 0
      ) {
        this._snackBar.open('capture todos los campos', 'X', {
          duration: 3000,
        });
        return;
      }
      this.displayCarga = 'flex';
      this.precioUnitarioDetalleService
        .editaRegistro(detalle, this.selectedEmpresa)
        .subscribe((detalles) => {
          this.detalles = detalles;
          this.precioUnitarioService
            .obtenerEstructurado(this.selectedProyecto, this.selectedEmpresa)
            .subscribe((precios) => {
              this.preciosUnitariosRefresco = precios;
              this.refrescar();
              this.detalles.push({
                id: 0,
                idPrecioUnitario: 0,
                idInsumo: 0,
                esCompuesto: false,
                costoUnitario: 0,
                cantidad: 0,
                cantidadExcedente: 0,
                idPrecioUnitarioDetallePerteneciente:
                  detalle.idPrecioUnitarioDetallePerteneciente,
                codigo: '',
                descripcion: '',
                unidad: '',
                idTipoInsumo: 0,
                idFamiliaInsumo: 0,
                importe: 0,
                costoUnitarioConFormato: '0.00',
                cantidadConFormato: '0.00',
                importeConFormato: '0.00',
                costoUnitarioEditado: false,
                cantidadEditado: false,
                costoBase: 0,
                costoBaseConFormato: '0.00',
              });
              this.displayCarga = 'none';
            });
          this.insumoService
            .obtenerParaAutocomplete(
              this.selectedProyecto,
              this.selectedEmpresa
            )
            .subscribe((insumos) => {
              this.insumos = insumos;
              this.insumosReset = insumos;
            });
          this.cargarListaConceptos();
        });
    }
  }

  editarDetalleImporte(detalle: precioUnitarioDetalleDTO) {
    this.seEstaEditandoRegistro = false;
    detalle.idPrecioUnitario = this.selectedPrecioUnitario;
    if (
      typeof detalle.codigo == undefined ||
      !detalle.codigo ||
      detalle.codigo == '' ||
      typeof detalle.descripcion == undefined ||
      !detalle.descripcion ||
      detalle.descripcion == '' ||
      typeof detalle.unidad == undefined ||
      !detalle.unidad ||
      detalle.unidad == '' ||
      typeof detalle.idTipoInsumo == undefined ||
      !detalle.idTipoInsumo ||
      detalle.idTipoInsumo <= 0 ||
      detalle.importe == 0 ||
      detalle.costoUnitario == 0
    ) {
      this._snackBar.open('capture correctamente los campos', 'X', {
        duration: 3000,
      });
      return;
    }

    this.displayCarga = 'flex';
    this.precioUnitarioDetalleService
      .editarImporte(detalle, this.selectedEmpresa)
      .subscribe((detalles) => {
        this.detalles = detalles;
        this.precioUnitarioService
          .obtenerEstructurado(this.selectedProyecto, this.selectedEmpresa)
          .subscribe((precios) => {
            this.preciosUnitariosRefresco = precios;
            this.refrescar();
            this.detalles.push({
              id: 0,
              idPrecioUnitario: 0,
              idInsumo: 0,
              esCompuesto: false,
              costoUnitario: 0,
              cantidad: 0,
              cantidadExcedente: 0,
              idPrecioUnitarioDetallePerteneciente:
                detalle.idPrecioUnitarioDetallePerteneciente,
              codigo: '',
              descripcion: '',
              unidad: '',
              idTipoInsumo: 0,
              idFamiliaInsumo: 0,
              importe: 0,
              costoUnitarioConFormato: '0.00',
              cantidadConFormato: '0.00',
              importeConFormato: '0.00',
              costoUnitarioEditado: false,
              cantidadEditado: false,
              costoBase: 0,
              costoBaseConFormato: '0.00',
            });
            this.displayCarga = 'none';
          });
        this.insumoService
          .obtenerParaAutocomplete(this.selectedProyecto, this.selectedEmpresa)
          .subscribe((insumos) => {
            this.insumos = insumos;
            this.insumosReset = insumos;
          });
        this.cargarListaConceptos();
      });
  }

  cargarRegistroDelDesglose(desglose: detalleDesglosadoDTO) {
    this.seEstaEditandoRegistro = false;
    if (desglose.idDetallePerteneciente == 0) {
      this.displayCarga = 'flex';
      for (let i = this.desglosados.length - 1; i > 0; i--) {
        this.desglosados.pop();
      }
      this.precioUnitarioDetalleService
        .obtenerTodos(desglose.idPrecioUnitario, this.selectedEmpresa)
        .subscribe((detalles) => {
          this.inicio = 0;
          this.termino = 10;
          this.detalles = detalles;
          this.detalles.push({
            id: 0,
            idPrecioUnitario: 0,
            idInsumo: 0,
            esCompuesto: false,
            costoUnitario: 0,
            cantidad: 0,
            cantidadExcedente: 0,
            idPrecioUnitarioDetallePerteneciente: 0,
            codigo: '',
            descripcion: '',
            unidad: '',
            idTipoInsumo: 0,
            idFamiliaInsumo: 0,
            importe: 0,
            costoUnitarioConFormato: '0.00',
            cantidadConFormato: '0.00',
            importeConFormato: '0.00',
            costoUnitarioEditado: false,
            cantidadEditado: false,
            costoBase: 0,
            costoBaseConFormato: '0.00',
          });
          this.displayCarga = 'none';
        });
    } else {
      this.displayCarga = 'flex';
      for (let i = this.desglosados.length - 1; i > 0; i--) {
        if (
          this.desglosados[i].idDetallePerteneciente ==
          desglose.idDetallePerteneciente
        ) {
          i = 0;
        } else {
          this.desglosados.pop();
        }
      }
      let Detalle: precioUnitarioDetalleDTO = {
        id: desglose.idDetallePerteneciente,
        idPrecioUnitario: desglose.idPrecioUnitario,
        idInsumo: 0,
        esCompuesto: false,
        costoUnitario: 0,
        cantidad: 0,
        cantidadExcedente: 0,
        idPrecioUnitarioDetallePerteneciente: 0,
        codigo: '',
        descripcion: '',
        unidad: '',
        idTipoInsumo: 0,
        idFamiliaInsumo: 0,
        importe: 0,
        costoUnitarioConFormato: '',
        cantidadConFormato: '',
        importeConFormato: '',
        costoUnitarioEditado: false,
        cantidadEditado: false,
        costoBase: 0,
        costoBaseConFormato: '0.00',
      };
      this.precioUnitarioDetalleService
        .obtenerHijos(Detalle, this.selectedEmpresa)
        .subscribe((detalles) => {
          this.inicio = 0;
          this.termino = 10;
          this.detalles = detalles;
          this.detalles.push({
            id: 0,
            idPrecioUnitario: 0,
            idInsumo: 0,
            esCompuesto: false,
            costoUnitario: 0,
            cantidad: 0,
            cantidadExcedente: 0,
            idPrecioUnitarioDetallePerteneciente:
              Detalle.idPrecioUnitarioDetallePerteneciente,
            codigo: '',
            descripcion: '',
            unidad: '',
            idTipoInsumo: 0,
            idFamiliaInsumo: 0,
            importe: 0,
            costoUnitarioConFormato: '0.00',
            cantidadConFormato: '0.00',
            importeConFormato: '0.00',
            costoUnitarioEditado: false,
            cantidadEditado: false,
            costoBase: 0,
            costoBaseConFormato: '0.00',
          });
          this.displayCarga = 'none';
        });
    }
  }

  crearGenerador(generador: GeneradoresDTO) {
    generador.cantidadTotal =
      generador.cantidad * generador.x * generador.y * generador.z;
    if (generador.id == 0) {
      this.generadoresService
        .creaRegistro(generador, this.selectedEmpresa)
        .subscribe((generadoCreado) => {
          this.generadoresService
            .obtenerTodos(this.selectedPrecioUnitario, this.selectedEmpresa)
            .subscribe((generadores) => {
              this.generadores = generadores;
              this.generadores.push({
                id: 0,
                idPrecioUnitario: generador.idPrecioUnitario,
                codigo: '',
                ejeX: '',
                ejeY: '',
                ejeZ: '',
                cantidad: 0,
                x: 1,
                y: 1,
                z: 1,
                cantidadTotal: 0,
                cantidadOperacion: '',
              });
            });
          this.InputOperacionGenerador.nativeElement.style.display = 'none';
          this.operacionGenerador = '';
          this.precioUnitarioService
            .obtenerEstructurado(this.selectedProyecto, this.selectedEmpresa)
            .subscribe((preciosUnitarios) => {
              this.preciosUnitariosRefresco = preciosUnitarios;
              this.refrescar();
            });
        });
    } else {
      generador.cantidadOperacion = this.operacionGenerador;
      this.generadoresService
        .editaRegistro(generador, this.selectedEmpresa)
        .subscribe((generadorEditado) => {
          this.generadoresService
            .obtenerTodos(this.selectedPrecioUnitario, this.selectedEmpresa)
            .subscribe((generadores) => {
              this.generadores = generadores;
              this.generadores.push({
                id: 0,
                idPrecioUnitario: generador.idPrecioUnitario,
                codigo: '',
                ejeX: '',
                ejeY: '',
                ejeZ: '',
                cantidad: 0,
                x: 1,
                y: 1,
                z: 1,
                cantidadTotal: 0,
                cantidadOperacion: '',
              });
            });
          this.InputOperacionGenerador.nativeElement.style.display = 'none';
          this.operacionGenerador = '';

          this.precioUnitarioService
            .obtenerEstructurado(this.selectedProyecto, this.selectedEmpresa)
            .subscribe((preciosUnitarios) => {
              this.preciosUnitariosRefresco = preciosUnitarios;
              this.refrescar();
            });
        });
    }
  }

  editarCantidadGenerador() {
    this.InputOperacionGenerador.nativeElement.focus();
    this.generadorSeleccionado.cantidadOperacion = this.operacionGenerador;
    this.crearGenerador(this.generadorSeleccionado);
  }

  abrirOperacionCantidadGenerador(generador: GeneradoresDTO) {
    this.InputOperacionGenerador.nativeElement.style.display = 'flex';
    this.InputOperacionGenerador.nativeElement.focus();
    this.generadorSeleccionado = generador;
  }

  eliminarGenerador(generador: GeneradoresDTO) {
    this.generadoresService
      .eliminaRegistro(generador.id, this.selectedEmpresa)
      .subscribe(() => {
        this.generadoresService
          .obtenerTodos(this.selectedPrecioUnitario, this.selectedEmpresa)
          .subscribe((generadores) => {
            this.generadores = generadores;
            this.generadores.push({
              id: 0,
              idPrecioUnitario: generador.idPrecioUnitario,
              codigo: '',
              ejeX: '',
              ejeY: '',
              ejeZ: '',
              cantidad: 0,
              x: 1,
              y: 1,
              z: 1,
              cantidadTotal: 0,
              cantidadOperacion: '',
            });
          });
        this.precioUnitarioService
          .obtenerEstructurado(this.selectedProyecto, this.selectedEmpresa)
          .subscribe((preciosUnitarios) => {
            this.preciosUnitariosRefresco = preciosUnitarios;
            this.refrescar();
          });
      });
  }

  filtrarProyecto(event: Event) {
    this.proyectos = this.proyectosReset;
    const filterValue = (
      event.target as HTMLInputElement
    ).value.toLocaleLowerCase();
    this.proyectos = this.proyectos.filter((proyecto) =>
      proyecto.nombre.toLocaleLowerCase().includes(filterValue)
    );
  }

  cambiarProyecto() {
    this.cargarRegistros();
    this.esquemaArbol2 = false;
    this.esquemaArbol3 = false;
    this.esquemaArbol4 = false;
    this.pestanas = false;
    this.dropdown = false;
    this.dropdown2 = false;
    this.fsrService
      .obtenerFSR(this.selectedProyecto, this.selectedEmpresa)
      .subscribe((fsr) => {
        this.fsr = fsr;
        this.fsrService
          .obtenerFSRDetalles(fsr.id, this.selectedEmpresa)
          .subscribe((detalles) => {
            this.porcentajePrestaciones = 0;
            for (let i = 0; i < detalles.length; i++) {
              this.porcentajePrestaciones =
                this.porcentajePrestaciones + detalles[i].porcentajeFsrdetalle;
            }
            this.fsrDetalles = detalles;
            this.fsrDetalles.push({
              id: 0,
              idFactorSalarioReal: this.fsr.id,
              codigo: '',
              descripcion: '',
              porcentajeFsrdetalle: 0,
              articulosLey: '',
              idProyecto: 0,
            });
          });
      });
    this.fsrService
      .obtenerFSI(this.selectedProyecto, this.selectedEmpresa)
      .subscribe((fsi) => {
        this.fsi = fsi;
        this.fsrService
          .obtenerDiasNoLaborables(fsi.id, this.selectedEmpresa)
          .subscribe((dias) => {
            this.diasNoLaborales = 0;
            for (let i = 0; i < dias.length; i++) {
              this.diasNoLaborales = this.diasNoLaborales + dias[i].valor;
            }
            this.diasConsideradosFsiNoTrabajados = dias;
            this.diasConsideradosFsiNoTrabajados.push({
              id: 0,
              codigo: '',
              descripcion: '',
              valor: 0,
              articulosLey: '',
              esLaborableOPagado: false,
              idFactorSalarioIntegrado: fsi.id,
              idProyecto: 0,
            });
          });
        this.fsrService
          .obtenerDiasPagados(fsi.id, this.selectedEmpresa)
          .subscribe((dias) => {
            this.diasPagados = 0;
            for (let i = 0; i < dias.length; i++) {
              this.diasPagados = this.diasPagados + dias[i].valor;
            }
            this.diasConsideradosFsiPagados = dias;
            this.diasConsideradosFsiPagados.push({
              id: 0,
              codigo: '',
              descripcion: '',
              valor: 0,
              articulosLey: '',
              esLaborableOPagado: true,
              idFactorSalarioIntegrado: fsi.id,
              idProyecto: 0,
            });
          });
      });
  }

  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  cambiarProyectoCopia(proyecto: proyectoDTO) {
    this.displayCarga = 'flex';
    this.selectedProyecto2 = proyecto.id;
    this.nombreProyectoCopia = proyecto.nombre;
    this.precioUnitarioParaCopiar.id = 0;
    this.seSeleccinaCopia = false;
    this.definirProyecto();
  }

  definirProyecto() {
    this.precioUnitarioService
      .obtenerEstructuradosParaCopiar(
        this.selectedProyecto2,
        this.selectedEmpresa
      )
      .subscribe((preciosUnitariosParaCopiar) => {
        this.preciosUnitariosParaCopiar = preciosUnitariosParaCopiar;
        this.displayCarga = 'none';
      });
  }

  pruebaCont() {
    this.dropdown = true;
  }

  pruebaCont2(detalle: precioUnitarioDetalleDTO) {
    if (detalle.id == 0) {
      this.dropdown2 = true;
      this.detalle = detalle;
    } else {
      this.dropdown2 = false;
    }
  }

  selectUnidadPU() {
    this.selectUnidadPrecioU = true;
  }

  eliminarPU(precioUnitario: precioUnitarioDTO): void {
    const dialogRef = this.dialog.open(ModalAlertComponent, {
      data: {
        selectedPU: precioUnitario,
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
        console.log('entrando al proceso');
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
        this.cargarRegistros();
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
            costoUnitarioConFormato: '0.00',
            precioUnitarioConFormato: '0.00',
            importeConFormato: '0.00',
            importeSeriesConFormato: '0.00',
            cantidadEditado: false,
            costoUnitarioEditado: false,
            precioUnitarioEditado: false,
            porcentajeIndirecto: 0,
            porcentajeIndirectoConFormato: '',
            posicion: 0,
            codigoPadre: '',
          });
        }
        this.displayCarga = 'none';
      });
  }

  seleccionado(precioUnitario: precioUnitarioDTO) {
    this.precioUnitarioClick = precioUnitario;
  }

  @HostListener('document:keydown.Alt.1', ['$event'])
  crearMismoNivelCMD(): void {
    this.crearPartidaAlMismoNivel(this.precioUnitarioClick);
  }

  @HostListener('document:keydown.Escape', ['$event'])
  quitarSeleccion(): void {
    this.precioUnitarioSeleccionado.esDetalle = false;
    this.datosCopia.idPrecioUnitarioBase = 0;
  }

  @HostListener('document:keydown.Insert', ['$event'])
  crearConceptoCMD(): void {
    if (this.precioUnitarioClick.tipoPrecioUnitario == 0) {
      this.crearConcepto(this.precioUnitarioClick);
    }
  }

  @HostListener('document:keydown.Alt.3', ['$event'])
  crearCapituloCMD(): void {
    this.crearSubPartida(this.precioUnitarioClick);
  }

  @HostListener('document:keydown.Alt.9', ['$event'])
  eliminaCMD(): void {
    this.eliminarPrecioUnitario(this.precioUnitarioClick);
  }

  @HostListener('document:keydown.Escape', ['$event'])
  eliminarCreacion(): void {
    if (this.seEstaEditandoRegistro == true) {
      this.seEstaEditandoRegistro = false;
      this.precioUnitarioDetalleEditado.cantidadEditado = false;
      this.precioUnitarioDetalleEditado.costoUnitarioEditado = false;
    } else {
      this.precioUnitarioEditado.cantidadEditado = false;
      this.precioUnitarioEditado.costoUnitarioEditado = false;
      if (this.seEstaEditando == true) {
        this.testInput.nativeElement.style.display = 'none';
        this.mostrarBotones = false;
        this.seEstaEditando = false;
      } else {
        if (this.existeCaptura == true) {
          this.precioUnitarioPadreCreacion.hijos.pop();
          this.existeCaptura = false;
        } else {
          if (this.esquemaArbol2 == true && this.desglosados.length <= 1) {
            this.esquemaArbol2 = false;
            this.pestanas = false;
            this.esquemaArbol3 = false;
            this.esquemaArbol4 = false;
          } else {
            this.desglosados.pop();
            this.cargarRegistroDelDesglose(
              this.desglosados[this.desglosados.length - 1]
            );
          }
        }
      }
    }
  }

  seleccionarHijos(precioUnitarioCopia: precioUnitarioCopiaDTO) {
    if (precioUnitarioCopia.seleccionado == true) {
      if (precioUnitarioCopia.hijos.length > 0) {
        for (let i = 0; i < precioUnitarioCopia.hijos.length; i++) {
          precioUnitarioCopia.hijos[i].seleccionado = true;
          this.seleccionarHijos(precioUnitarioCopia.hijos[i]);
        }
      }
    } else {
      if (precioUnitarioCopia.hijos.length > 0) {
        for (let i = 0; i < precioUnitarioCopia.hijos.length; i++) {
          precioUnitarioCopia.hijos[i].seleccionado = false;
          this.seleccionarHijos(precioUnitarioCopia.hijos[i]);
        }
      }
    }
  }

  isGrid: boolean = false;
  contenedor2 = false;

  conceptoPadreParaImportar: precioUnitarioDTO = {
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
    porcentajeIndirecto: 0,
    porcentajeIndirectoConFormato: '',
    posicion: 0,
    codigoPadre: '',
  };

  importar(precioUnitario: precioUnitarioDTO) {
    if (this.detallesCopiaReset1.length > 0) {
      this.detallesCopia = this.detallesCopiaReset1;
      this.detallesCopiaReset = this.detallesCopiaReset1;
    }
    if (this.detallesCopia != undefined) {
      if (this.detallesCopia.length > 0) {
        this.seSeleccinaCopia = true;
        this.esquemaArbol5 = true;
        this.detallesCopiaReset.filter(
          (registro) => (registro.seleccionado = false)
        );
        this.detallesCopia = this.detallesCopiaReset;
      }
    }
    this.conceptoPadreParaImportar = precioUnitario;
    if (precioUnitario.tipoPrecioUnitario == 0) {
      this.seEstaCopiando = true;
      this.datosCopia.idPrecioUnitarioBase = precioUnitario.id;
      this.isGrid = true;
      this.contenedor2 = true;
      this.seEstaCopiandoConcepto = true;
      this.seEstaCopiandoArmado = true;
      this.inicioCopia = 0;
      this.terminoCopia = 10;
      this.idTipoInsumoSelected = 0;
    } else {
      this.seEstaCopiando = true;
      this.datosCopiaArmado.idPrecioUnitarioBase = precioUnitario.id;
      this.isGrid = true;
      this.contenedor2 = true;
      this.seEstaCopiandoArmado = true;
      this.seEstaCopiandoConcepto = false;
      this.inicioCopia = 0;
      this.terminoCopia = 10;
      this.idTipoInsumoSelected = 0;
    }
  }

  importarConceptoDesdePU = false;

  importarConceptoDesdeArmado(precioUnitario: precioUnitarioDTO) {
    if (this.detallesCopiaReset1.length > 0) {
      console.log('detallesCopiaReset1', this.detallesCopiaReset1);
      this.detallesCopia = this.detallesCopiaReset1.filter(
        (z) => z.idTipoInsumo == 10006
      );
      this.detallesCopiaReset = this.detallesCopia;
    }
    if (this.detallesCopia != undefined) {
      if (this.detallesCopia.length > 0) {
        this.seSeleccinaCopia = true;
        this.esquemaArbol5 = true;
        this.detallesCopiaReset.filter(
          (registro) => (registro.seleccionado = false)
        );
        this.detallesCopia = this.detallesCopiaReset;
      }
    }
    this.importarConceptoDesdePU = true;
    this.seEstaCopiando = true;
    this.datosCopiaArmado.idPrecioUnitarioBase = precioUnitario.id;
    this.isGrid = true;
    this.contenedor2 = true;
    this.seEstaCopiandoArmado = true;
    this.seEstaCopiandoConcepto = false;
    this.inicioCopia = 0;
    this.terminoCopia = 10;
    this.idTipoInsumoSelected = 0;
  }

  importar2() {
    this.isGrid = true;
    this.contenedor2 = true;
  }

  setDisplayFlex() {
    this.seSeleccinaCopia = false;
    this.esquemaArbol5 = false;
    this.isGrid = false;
    this.contenedor2 = false;
    this.seEstaCopiando = false;
  }

  importarDatos() {
    if (this.importarConceptoDesdePU) {
      this.seEstaCopiando = false;
      this.displayCarga = 'flex';
      this.datosCopiaArmado.registros = this.detallesCopiaReset.filter(
        (registro) => registro.seleccionado == true
      );
      this.datosCopiaArmado.idProyecto = this.selectedProyecto;
      this.displayCarga = 'flex';
      this.precioUnitarioService
        .copiarArmadoComoConcepto(this.datosCopiaArmado, this.selectedEmpresa)
        .subscribe((preciosUnitarios) => {
          this.importarConceptoDesdePU = false;
          this.preciosUnitarios = preciosUnitarios;
          this.displayCarga = 'none';
        });
      this.contenedor2 = false;
      this.setDisplayFlex();
      this.insumoService
        .obtenerParaAutocomplete(this.selectedProyecto, this.selectedEmpresa)
        .subscribe((insumos) => {
          this.insumos = insumos;
        });
    } else {
      if (this.seEstaCopiandoConcepto) {
        this.displayCarga = 'flex';
        this.seEstaCopiando = false;
        this.datosCopia.idProyecto = this.selectedProyecto;
        this.datosCopia.registros = this.preciosUnitariosParaCopiar;
        this.precioUnitarioService
          .copiarRegistros(this.datosCopia, this.selectedEmpresa)
          .subscribe((preciosUnitarios) => {
            this.preciosUnitarios = preciosUnitarios;
            this.displayCarga = 'none';
          });
        this.contenedor2 = false;
        this.setDisplayFlex();
        this.insumoService
          .obtenerParaAutocomplete(this.selectedProyecto, this.selectedEmpresa)
          .subscribe((insumos) => {
            this.insumos = insumos;
          });
      } else {
        this.seEstaCopiando = false;
        this.displayCarga = 'flex';
        this.datosCopiaArmado.registros = this.detallesCopiaReset.filter(
          (registro) => registro.seleccionado == true
        );
        this.datosCopiaArmado.idProyecto = this.selectedProyecto;
        this.displayCarga = 'flex';
        this.precioUnitarioService
          .copiarArmado(this.datosCopiaArmado, this.selectedEmpresa)
          .subscribe((preciosUnitarios) => {
            this.preciosUnitarios = preciosUnitarios;
            this.displayCarga = 'none';
          });
        this.contenedor2 = false;
        this.setDisplayFlex();
        this.insumoService
          .obtenerParaAutocomplete(this.selectedProyecto, this.selectedEmpresa)
          .subscribe((insumos) => {
            this.insumos = insumos;
          });
      }
    }
  }

  filtrarDetallesCopia(event: Event) {
    this.insumos = this.insumosReset;
    const filterValue = (
      event.target as HTMLInputElement
    ).value.toLocaleLowerCase();
    this.insumos = this.insumos.filter(
      (insumo) =>
        insumo.codigo.toLocaleLowerCase().includes(filterValue) ||
        insumo.descripcion.toLocaleLowerCase().includes(filterValue)
    );
  }

  filtrarArmadosCopia(event: Event) {
    this.paginadoCopia.pageIndex = 0;
    this.inicioCopia = 0;
    this.terminoCopia = 10;
    this.detallesCopia = this.detallesCopiaReset;
    const filterValue = (
      event.target as HTMLInputElement
    ).value.toLocaleLowerCase();
    this.detallesCopia = this.detallesCopia.filter(
      (detallesCopia) =>
        detallesCopia.codigo.toLocaleLowerCase().includes(filterValue) ||
        detallesCopia.descripcion.toLocaleLowerCase().includes(filterValue)
    );
  }

  filtrarArmados(event: Event) {
    this.paginadoBase.pageIndex = 0;
    this.inicio = 0;
    this.termino = 10;
    this.detalles = this.detallesReset;
    const filterValue = (
      event.target as HTMLInputElement
    ).value.toLocaleLowerCase();
    this.detalles = this.detalles.filter(
      (detalles) =>
        detalles.codigo.toLocaleLowerCase().includes(filterValue) ||
        detalles.descripcion.toLocaleLowerCase().includes(filterValue)
    );
  }

  seleccionar(precioUnitario: precioUnitarioDTO) {
    if (this.existenEstimaciones) {
      return;
    }
    if (precioUnitario.id != this.precioUnitarioSeleccionado.id) {
      precioUnitario.cantidadEditado = true;
      this.precioUnitarioSeleccionado.cantidadEditado = false;
      this.precioUnitarioSeleccionado.esDetalle = false;
      if (precioUnitario.tipoPrecioUnitario == 0) {
        this.datosCopia.idPrecioUnitarioBase = precioUnitario.id;
      }
      precioUnitario.esDetalle = true;
      precioUnitario.esDetalle = true;
      this.precioUnitarioSeleccionado = precioUnitario;
    }
  }

  // seleccionarPUCantidad(precioUnitario: precioUnitarioDTO) {
  //     this.precioUnitarioEditado.cantidadEditado = false;
  //     this.PrecioUnitarioEditadoCantidad = precioUnitario;
  //     // if (!this.seEstaEditandoRegistro) {
  //         this.precioUnitarioSeleccionado.esDetalle = false;
  //         // if(this.precioUnitarioSeleccionado.id == precioUnitario.id){
  //         //     precioUnitario.cantidadEditado = true;
  //         //     return;
  //         // }
  //         if (precioUnitario.tipoPrecioUnitario == 0) {
  //             this.datosCopia.idPrecioUnitarioBase = precioUnitario.id;
  //         }
  //         precioUnitario.esDetalle = true;
  //         precioUnitario.esDetalle = true;
  //         this.precioUnitarioSeleccionado = precioUnitario;
  //         precioUnitario.cantidadEditado = true;
  //         this.precioUnitarioEditado = precioUnitario;
  //         this.seEstaEditandoRegistro = true;
  //     // }
  // }

  seleccionarPUDetalles(detalle: precioUnitarioDetalleDTO) {
    // if(detalle.id == this.detalleSeleccionado.id){
    //     return;
    // }

    this.detalleSeleccionado.cantidadEditado = false;
    this.detalleSeleccionado.costoUnitarioEditado = false;

    this.detalleSeleccionado = detalle;

    this.detalleSeleccionado.cantidadEditado = true;
    this.detalleSeleccionado.costoUnitarioEditado = true;
  }

  // seEstaEditandoCantidadDetalle(detalle: precioUnitarioDetalleDTO) {
  //     if (!this.seEstaEditandoRegistro) {
  //         this.detalleSeleccionado = detalle;
  //         detalle.cantidadEditado = true;
  //         this.precioUnitarioDetalleEditado = detalle;
  //         this.seEstaEditandoRegistro = true;
  //     } else {
  //         if (detalle.id == this.detalleSeleccionado.id) {
  //             detalle.cantidadEditado = true;
  //         }
  //     }
  // }

  // seEstaEditandoCostoUnitarioDetalle(detalle: precioUnitarioDetalleDTO) {
  //     if (!this.seEstaEditandoRegistro) {
  //         this.detalleSeleccionado = detalle;
  //         detalle.costoUnitarioEditado = true;
  //         this.precioUnitarioDetalleEditado = detalle;
  //         this.seEstaEditandoRegistro = true;
  //     } else {
  //         if (detalle.id == this.detalleSeleccionado.id) {
  //             detalle.costoUnitarioEditado = true;
  //         }
  //     }
  // }

  crearFSRDetalle(fsrDetalle: factorSalarioRealDetalleDTO) {
    if (
      typeof fsrDetalle.codigo == undefined ||
      !fsrDetalle.codigo ||
      fsrDetalle.codigo == '' ||
      typeof fsrDetalle.descripcion == undefined ||
      !fsrDetalle.descripcion ||
      fsrDetalle.descripcion == '' ||
      typeof fsrDetalle.porcentajeFsrdetalle == undefined ||
      !fsrDetalle.porcentajeFsrdetalle
    ) {
      this._snackBar.open('capture todos los campos', 'X', { duration: 3000 });
      return;
    }
    this.fsrService
      .crearDetalleFSR(fsrDetalle, this.selectedEmpresa)
      .subscribe(() => {
        this.fsrDetalles.push({
          id: 0,
          idFactorSalarioReal: this.fsr.id,
          codigo: '',
          descripcion: '',
          porcentajeFsrdetalle: 0,
          articulosLey: '',
          idProyecto: 0,
        });
      });
  }

  crearFSIDias(dias: diasConsideradosDTO) {
    if (
      typeof dias.codigo == undefined ||
      !dias.codigo ||
      dias.codigo == '' ||
      typeof dias.descripcion == undefined ||
      !dias.descripcion ||
      dias.descripcion == '' ||
      typeof dias.valor == undefined ||
      !dias.valor
    ) {
      this._snackBar.open('capture todos los campos', 'X', { duration: 3000 });
      return;
    }
    this.fsrService.crearDiasFSI(dias, this.selectedEmpresa).subscribe(() => {
      if (dias.esLaborableOPagado == true) {
        this.diasConsideradosFsiPagados.push({
          id: 0,
          codigo: '',
          descripcion: '',
          valor: 0,
          articulosLey: '',
          esLaborableOPagado: true,
          idFactorSalarioIntegrado: this.fsi.id,
          idProyecto: this.selectedProyecto,
        });
      } else {
        this.diasConsideradosFsiNoTrabajados.push({
          id: 0,
          codigo: '',
          descripcion: '',
          valor: 0,
          articulosLey: '',
          esLaborableOPagado: false,
          idFactorSalarioIntegrado: this.fsi.id,
          idProyecto: this.selectedProyecto,
        });
      }
      this.fsrService
        .obtenerFSR(this.selectedProyecto, this.selectedEmpresa)
        .subscribe((fsr) => {
          this.fsr = fsr;
        });
      this.fsrService
        .obtenerFSI(this.selectedProyecto, this.selectedEmpresa)
        .subscribe((fsi) => {
          this.fsi = fsi;
        });
    });
  }

  private readonly auxiliar = new BehaviorSubject<boolean>(true);
  precioUnitarioEditando!: precioUnitarioDTO;
  descripcionPrecioUnitario = '';
  desplegarCampoEdicion(precioUnitario: precioUnitarioDTO) {
    if (this.existenEstimaciones) {
      return;
    }
    this.mostrarBotones = true;
    this.precioUnitarioEditando = precioUnitario;
    this.seEstaEditandoTrue().subscribe(() => {
      this.descripcionPrecioUnitario = precioUnitario.descripcion;
      this.testInput.nativeElement.style.display = 'flex';
      this.testInput.nativeElement.focus();
    });
  }
  detalleDescripcionPrecioUnitario = '';
  desplegarCampoDescripcion(detalle: precioUnitarioDetalleCopiaDTO) {
    this.detalleDescripcionPrecioUnitario = detalle.descripcion;
    this.descripcionInput.nativeElement.style.display = 'flex';
  }

  seEstaEditandoTrue(): Observable<any> {
    this.seEstaEditando = true;
    return this.auxiliar;
  }

  editarDesdeTextArea() {
    this.precioUnitarioEditando.descripcion = this.descripcionPrecioUnitario;
    this.testInput.nativeElement.style.display = 'none';
    this.mostrarBotones = false;
    this.crear(this.precioUnitarioEditando);
  }

  filtrarInsumo(event: Event) {
    this.insumos = this.insumosReset;
    const filterValue = (
      event.target as HTMLInputElement
    ).value.toLocaleLowerCase();
    this.insumos = this.insumos.filter(
      (insumo) =>
        insumo.codigo.toLocaleLowerCase().includes(filterValue) ||
        insumo.descripcion.toLocaleLowerCase().includes(filterValue)
    );
  }

  filtrarConcepto(event: Event) {
    this.conceptos = this.conceptosReset;
    const filterValue = (
      event.target as HTMLInputElement
    ).value.toLocaleLowerCase();
    this.conceptos = this.conceptos.filter(
      (concepto) =>
        concepto.codigo.toLocaleLowerCase().includes(filterValue) ||
        concepto.descripcion.toLocaleLowerCase().includes(filterValue)
    );
  }

  seleccionarInsumo(insumo: InsumoDTO) {
    console.log(insumo);
    this.detalle.codigo = insumo.codigo;
    this.detalle.descripcion = insumo.descripcion;
    this.detalle.unidad = insumo.unidad;
    this.detalle.costoUnitario = insumo.costoUnitario;
    this.detalle.idInsumo = insumo.id;
    this.detalle.idFamiliaInsumo = insumo.idFamiliaInsumo;
    this.detalle.idTipoInsumo = insumo.idTipoInsumo;
  }

  seleccionarConcepto(concepto: precioUnitarioDTO) {
    this.precioUnitarioSeleccionado.codigo = concepto.codigo;
    this.crear(this.precioUnitarioSeleccionado);
  }

  eliminarPUDetalle(detalle: precioUnitarioDetalleDTO): void {
    const dialogRef = this.dialog.open(ModalAlertComponent, {
      data: {
        selectedPUDetalle: detalle,
        titulo: '',
        mensaje: '¿Quieres eliminar el detalle?',
        funcionAceptarPUDetalle: this.eliminarDetalle.bind(this),
      },
    });
  }

  eliminarDetalle(detalle: precioUnitarioDetalleDTO) {
    this.displayCarga = 'flex';
    this.precioUnitarioDetalleService
      .eliminaRegistro(detalle.id, this.selectedEmpresa)
      .subscribe((detalles) => {
        this.detalles = detalles;
        this.detalles.push({
          id: 0,
          idPrecioUnitario: 0,
          idInsumo: 0,
          esCompuesto: false,
          costoUnitario: 0,
          cantidad: 0,
          cantidadExcedente: 0,
          idPrecioUnitarioDetallePerteneciente:
            detalle.idPrecioUnitarioDetallePerteneciente,
          codigo: '',
          descripcion: '',
          unidad: '',
          idTipoInsumo: 0,
          idFamiliaInsumo: 0,
          importe: 0,
          costoUnitarioConFormato: '0.00',
          cantidadConFormato: '0.00',
          importeConFormato: '0.00',
          costoUnitarioEditado: false,
          cantidadEditado: false,
          costoBase: 0,
          costoBaseConFormato: '0.00',
        });
        this.precioUnitarioService
          .obtenerEstructurado(this.selectedProyecto, this.selectedEmpresa)
          .subscribe((preciosUnitarios) => {
            this.preciosUnitariosRefresco = preciosUnitarios;
            this.refrescar();
            this.displayCarga = 'none';
          });
      });
  }

  partirPUDetalle(detalle: precioUnitarioDetalleDTO) {
    this.precioUnitarioDetalleService
      .partirDetalle(detalle, this.selectedEmpresa)
      .subscribe((datos) => {
        this.detalles = datos;
        this.detalles.push({
          id: 0,
          idPrecioUnitario: 0,
          idInsumo: 0,
          esCompuesto: false,
          costoUnitario: 0,
          cantidad: 0,
          cantidadExcedente: 0,
          idPrecioUnitarioDetallePerteneciente:
            detalle.idPrecioUnitarioDetallePerteneciente,
          codigo: '',
          descripcion: '',
          unidad: '',
          idTipoInsumo: 0,
          idFamiliaInsumo: 0,
          importe: 0,
          costoUnitarioConFormato: '0.00',
          cantidadConFormato: '0.00',
          importeConFormato: '0.00',
          costoUnitarioEditado: false,
          cantidadEditado: false,
          costoBase: 0,
          costoBaseConFormato: '0.00',
        });
        this.insumoService
          .obtenerParaAutocomplete(this.selectedProyecto, this.selectedEmpresa)
          .subscribe((insumos) => {
            this.insumos = insumos;
            this.insumosReset = insumos;
          });

        this.precioUnitarioService
          .obtenerEstructurado(this.selectedProyecto, this.selectedEmpresa)
          .subscribe((preciosUnitarios) => {
            this.preciosUnitariosRefresco = preciosUnitarios;
            this.refrescar();
            this.displayCarga = 'none';
          });
      });
  }

  onRightClick(event: MouseEvent, detalle: precioUnitarioDetalleDTO) {
    event.preventDefault();
  }

  selectRendimiento() {
    this.isRendimineto = true;
    this.isOpereciones = false;
  }
  selectOperaciones() {
    this.precioUnitarioDetalleService
      .obtenerOperaciones(this.detalleSeleccionado.id, this.selectedEmpresa)
      .subscribe((operaciones) => {
        this.operaciones = operaciones;
        this.operaciones.push({
          id: 0,
          idPrecioUnitarioDetalle: this.detalleSeleccionado.id,
          operacion: '',
          resultado: 0,
          descripcion: '',
        });
      });
    this.isOpereciones = true;
    this.isRendimineto = false;
  }

  crearOperacionDetalle(operacion: operacionesXPrecioUnitarioDetalleDTO) {
    if (operacion.id == 0) {
      this.precioUnitarioDetalleService
        .crearOperacion(operacion, this.selectedEmpresa)
        .subscribe((detalles) => {
          this.detalles = detalles;
          this.detalles.push({
            id: 0,
            idPrecioUnitario: 0,
            idInsumo: 0,
            esCompuesto: false,
            costoUnitario: 0,
            costoUnitarioConFormato: '0.00',
            costoUnitarioEditado: false,
            cantidad: 0,
            cantidadConFormato: '0.00',
            cantidadEditado: false,
            cantidadExcedente: 0,
            idPrecioUnitarioDetallePerteneciente: 0,
            codigo: '',
            descripcion: '',
            unidad: '',
            idTipoInsumo: 0,
            idFamiliaInsumo: 0,
            importe: 0,
            importeConFormato: '0.00',
            costoBase: 0,
            costoBaseConFormato: '0.00'
          });
          this.precioUnitarioDetalleService
            .obtenerOperaciones(
              this.detalleSeleccionado.id,
              this.selectedEmpresa
            )
            .subscribe((operaciones) => {
              this.operaciones = operaciones;
              this.operaciones.push({
                id: 0,
                idPrecioUnitarioDetalle: this.detalleSeleccionado.id,
                operacion: '',
                resultado: 0,
                descripcion: '',
              });
              this.precioUnitarioService
                .obtenerEstructurado(
                  this.selectedProyecto,
                  this.selectedEmpresa
                )
                .subscribe((precios) => {
                  this.preciosUnitariosRefresco = precios;
                  this.refrescar();
                });
              this.insumoService
                .obtenerParaAutocomplete(
                  this.selectedProyecto,
                  this.selectedEmpresa
                )
                .subscribe((insumos) => {
                  this.insumos = insumos;
                  this.insumosReset = insumos;
                });
              this.cargarListaConceptos();
            });
        });
    } else {
      this.precioUnitarioDetalleService
        .editarOperacion(operacion, this.selectedEmpresa)
        .subscribe((detalles) => {
          this.detalles = detalles;
          this.detalles.push({
            id: 0,
            idPrecioUnitario: 0,
            idInsumo: 0,
            esCompuesto: false,
            costoUnitario: 0,
            costoUnitarioConFormato: '0.00',
            costoUnitarioEditado: false,
            cantidad: 0,
            cantidadConFormato: '0.00',
            cantidadEditado: false,
            cantidadExcedente: 0,
            idPrecioUnitarioDetallePerteneciente: 0,
            codigo: '',
            descripcion: '',
            unidad: '',
            idTipoInsumo: 0,
            idFamiliaInsumo: 0,
            importe: 0,
            importeConFormato: '0.00',
            costoBase: 0,
            costoBaseConFormato: '0.00'
          })
          this.precioUnitarioDetalleService
            .obtenerOperaciones(
              this.detalleSeleccionado.id,
              this.selectedEmpresa
            )
            .subscribe((operaciones) => {
              this.operaciones = operaciones;
              this.operaciones.push({
                id: 0,
                idPrecioUnitarioDetalle: this.detalleSeleccionado.id,
                operacion: '',
                resultado: 0,
                descripcion: '',
              });
              this.precioUnitarioService
                .obtenerEstructurado(
                  this.selectedProyecto,
                  this.selectedEmpresa
                )
                .subscribe((precios) => {
                  this.preciosUnitariosRefresco = precios;
                  this.refrescar();
                });
              this.insumoService
                .obtenerParaAutocomplete(
                  this.selectedProyecto,
                  this.selectedEmpresa
                )
                .subscribe((insumos) => {
                  this.insumos = insumos;
                  this.insumosReset = insumos;
                });
              this.cargarListaConceptos();
            });
        });
    }
  }

  EliminarOperacion(operacion: operacionesXPrecioUnitarioDetalleDTO) {
    console.log('eliminando operacion');
    console.log('operaciones', this.operaciones);

    this.precioUnitarioDetalleService
      .eliminarOperacion(operacion.id, this.selectedEmpresa)
      .subscribe((detalles) => {
        this.detalles = detalles;
        this.precioUnitarioDetalleService
          .obtenerOperaciones(this.detalleSeleccionado.id, this.selectedEmpresa)
          .subscribe((operaciones) => {
            this.operaciones = operaciones;
            console.log('estas son las operaciones', this.operaciones);
            this.operaciones.push({
              id: 0,
              idPrecioUnitarioDetalle: this.detalleSeleccionado.id,
              operacion: '',
              resultado: 0,
              descripcion: '',
            });
            this.precioUnitarioService
              .obtenerEstructurado(this.selectedProyecto, this.selectedEmpresa)
              .subscribe((precios) => {
                this.preciosUnitariosRefresco = precios;
                this.refrescar();
              });
            this.insumoService
              .obtenerParaAutocomplete(
                this.selectedProyecto,
                this.selectedEmpresa
              )
              .subscribe((insumos) => {
                this.insumos = insumos;
                this.insumosReset = insumos;
              });
            this.cargarListaConceptos();
          });
      });
  }

  cambiarPagina(e: PageEvent) {
    this.inicio = e.pageIndex * e.pageSize;
    this.termino = this.inicio + e.pageSize;
  }

  cambiarPaginaCopia(e: PageEvent) {
    this.inicioCopia = e.pageIndex * e.pageSize;
    this.terminoCopia = this.inicioCopia + e.pageSize;
  }

  // cargarExplosionDeInsumos(){
  //     this.precioUnitarioService.explosionDeInsumos(this.selectedProyecto, this.selectedEmpresa)
  //     .subscribe((explosion) => {
  //         this.explosionInsumos = explosion;
  //         this.explosionInsumosReset = explosion;
  //     })
  // }

  idTipoInsumoSelectedParaFiltroDeExplosion: number = 0;

  // filtrarExplosion(){
  //     this.precioUnitarioService.explosionDeInsumos(this.selectedProyecto, this.selectedEmpresa)
  //     .subscribe((explosion) => {
  //         if(this.idTipoInsumoSelectedParaFiltroDeExplosion == 0){
  //             this.explosionInsumos = explosion;
  //         }
  //         else{
  //             this.explosionInsumos = explosion.filter(z => z.idTipoInsumo == this.idTipoInsumoSelectedParaFiltroDeExplosion);
  //         }
  //     })
  // }

  openDialogFSR() {
    const dialogOpen = this.dialog.open(DialogFSRComponent, {
      data: {
        diasConsideradosFsiNoTrabajados: this.diasConsideradosFsiNoTrabajados,
        selectedEmpresa: this.selectedEmpresa,
        diasConsideradosFsiPagados: this.diasConsideradosFsiPagados,
        selectedProyecto: this.selectedProyecto,
        diasNoLaborales: this.diasNoLaborales,
        diasPagados: this.diasPagados,
        fsrDetalles: this.fsrDetalles,
        porcentajePrestaciones: this.porcentajePrestaciones,
      },
    });
    dialogOpen.afterClosed().subscribe((respuesta) => {
      if (respuesta) {
        this.recalcularPresupuesto();
        this.precioUnitarioService
          .obtenerEstructurado(this.selectedProyecto, this.selectedEmpresa)
          .subscribe((precios) => {
            this.preciosUnitarios = precios;
            this.esquemaArbol2 = false;
            this.esquemaArbol3 = false;
            this.esquemaArbol4 = false;
            this.pestanas = false;
          });
      }
    });
  }

  openDialogExpInsumos() {
    // const dialogOpen = this.dialog.open(DialogExplosionInsumosComponent, {
    //     data: {
    //         selectedProyecto: this.selectedProyecto,
    //         selectedEmpresa: this.selectedEmpresa,
    //         idTipoInsumoSelectedParaFiltroDeExplosion: this.idTipoInsumoSelectedParaFiltroDeExplosion

    //     }
    // })
    // dialogOpen.afterClosed().subscribe((resultado: boolean) => {
    //     if(resultado){
    //         this.recalcularPresupuesto();
    //     }
    // });
    this.appRecarga += 1;
    this.contenedorPresupuesto = false;
    this.contenedorExplosionInsumo = true;
  }

  recalcular(event: Event) {
    this.contenedorPresupuesto = true;
    this.contenedorExplosionInsumo = false;
    if (event) {
      console.log('recalculando');
      this.recalcularPresupuesto();
    }
  }

  guardarRegistro(detalle: precioUnitarioDetalleDTO) {
    this.detalleSeleccionado = detalle;
    this.selectedCantidad = detalle.cantidad;
    this.selectedCantidadConFormato = new Intl.NumberFormat('es-MX', {
      minimumFractionDigits: 4,
    }).format(this.selectedCantidad);
    this.selectedRendimiento = 1 / this.selectedCantidad;
    this.selectedRendimientoConFormato = new Intl.NumberFormat('es-MX', {
      minimumFractionDigits: 4,
    }).format(this.selectedRendimiento);
    this.esAsignarDetalleRendimiento = true;
    this.isRendimineto = true;
    this.isOpereciones = false;
    this.precioUnitarioDetalleService
      .obtenerOperaciones(detalle.id, this.selectedEmpresa)
      .subscribe((operaciones) => {
        this.operaciones = operaciones;
        this.operaciones.push({
          id: 0,
          idPrecioUnitarioDetalle: detalle.id,
          operacion: '',
          resultado: 0,
          descripcion: '',
        });
      });
  }

  visibleAsignarCantidadRendimiento() {
    this.esAsignarDetalleRendimiento = !this.esAsignarDetalleRendimiento;
  }

  asignarCantidad(newValue: number) {
    this.selectedRendimiento = 1 / newValue;
  }

  asignarRendimiento(newValue: number) {
    this.selectedCantidad = 1 / newValue;
  }

  asignarCantidadDetalleRendimiento() {
    this.detalleSeleccionado.cantidad = this.selectedCantidad;
    this.cerrarTooltip();
    this.asignarCantidadDetalleRendimiento();
  }

  yourFn(event: any) {
    this.selectedIndex = event.index;
    if (this.selectedIndex == 0) {
      this.esquemaArbol3 = true;
    }
    if (this.selectedIndex == 1) {
      this.esquemaArbol4 = true;
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
        }).format(this.total);
        this.displayCarga = 'none';
      });
  }

  indirectos() {
    const dialogRef = this.dialog.open(IndirectosComponent, {});
    dialogRef.afterClosed().subscribe((resultado: boolean) => {
      this.cargarRegistros();
      // this.recalcularPresupuesto();
    });
  }

  IndirectosXConcepto(precio: precioUnitarioDTO) {
    const dialogRef = this.dialog.open(IndirectosConceptoComponent, {
      data: precio,
    });
    dialogRef.afterClosed().subscribe((resultado: boolean) => {
      this.cargarRegistros();
      // this.recalcularPresupuesto();
    });
  }

  // ediatarIndirectoPrecioUnitario(precioUnitario : precioUnitarioDTO){
  //     console.log("Este es el PU", precioUnitario);
  //     this.precioUnitarioService.editarIndirectoPrecioUnitario(precioUnitario, this.selectedEmpresa).subscribe((datos) => {

  //     });
  // }

  detallesCopiaBase: precioUnitarioDetalleCopiaDTO[] = [];

  nuevaImportacionPresupuesto() {
    this.dialog.open(this.dialogCargaExcel, {
      width: '10%',
      disableClose: true,
    });
  }
  limpiarCargarExcel() {
    this.dialog.closeAll();
    this.mensajeModal = '';
    this.selectedFileName = '';
  }
  detenerCierre(event: MouseEvent) {
    event.stopPropagation();
  }
  onFileChangeFactura(event: any) {
    const files = (event.target as HTMLInputElement).files;
    this.archivosCargarExcels = files;
    this.selectedFileName = files![0].name;
  }

  cargarPresupuestoExcel() {
    // Limpia cualquier mensaje previo
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
            this.cargarRegistros();
            this.limpiarCargarExcel();
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

  cargarPresupuestoOpus() {
    this.mensajeModal = '';

    if (!this.archivosCargarExcels || this.archivosCargarExcels.length === 0) {
      this.mensajeModal = 'No hay archivos Opus para importar';
      return;
    }

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

          if (datos.estatus) {
            // se subio
            this.cargarRegistros();
            this.limpiarCargarExcel();
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

  abrirModalCostoHorario(detalle: precioUnitarioDetalleDTO) {
    if (detalle.idTipoInsumo === 10007) {
      this.isOpenModal = true;
    }
  }

  closeModal() {
    this.isOpenModal = false;
  }
}
