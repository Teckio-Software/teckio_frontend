import {
  Component,
  HostBinding,
  HostListener,
  OnInit,
  ViewChild,
} from '@angular/core';
import {
  EstimacionesDTO,
  GeneradoresXEstimacionDTO,
  PeriodoEstimacionesDTO,
  PeriodosXEstimacionDTO,
} from '../tsEstimaciones';
import { proyectoDTO } from '../../proyecto/tsProyecto';
import { EstimacionesService } from '../estimaciones.service';
import { ProyectoService } from '../../proyecto/proyecto.service';
import { SeguridadService } from 'src/app/seguridad/seguridad.service';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Observable, map, startWith } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { ModalAlertComponent } from 'src/app/utilidades/modal-alert/modal-alert.component';
import { da } from 'date-fns/locale';
import { NgbTooltip } from '@ng-bootstrap/ng-bootstrap';

import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import { image } from '../../precio-unitario/precio-unitario/imprimir-modal/types/imagen';
// import { image } from '../../precio-unitario/precio-unitario/imprimir-modal/imagen';
import { numeroALetras } from 'src/app/compras/orden-compra/NumeroALetras';
import { AlertaTipo } from 'src/app/utilidades/alert/alert.component';


@Component({
  selector: 'app-estimaciones',
  templateUrl: './estimaciones.component.html',
  styleUrls: ['./estimaciones.component.css'],
})
export class EstimacionesComponent implements OnInit {
  myControl: FormControl = new FormControl();
  options = ['One', 'Two', 'Three'];
  fechaActual = new Date();
  form!: FormGroup;
  filteredOptions: Observable<string[]> | undefined;
  totalEstimaciones: number = 0;
  totalEstimacionesConFormato: string = '';
  ivaEstimaciones: number = 0;
  ivaEstimacionesConFormato: string = '';
  totalEstimacionesConIva: number = 0;
  totalEstimacionesConIvaConFormato: string = '';
  estimaciones!: EstimacionesDTO[];
  proyectos!: proyectoDTO[];
  proyectosReset!: proyectoDTO[];
  periodos!: PeriodoEstimacionesDTO[];
  selectedProyecto: number = 0;
  selectedPeriodo: number = 0;
  selectedEmpresa: number = 0;
  nombreProyecto: string = '';
  seEstaEditandoEstimacion: boolean = false;
  periodo!: PeriodoEstimacionesDTO;
  nuevoPeriodo: PeriodoEstimacionesDTO = {
    id: 0,
    idProyecto: 0,
    fechaInicio: new Date(),
    fechaTermino: new Date(),
    numeroPeriodo: 0,
    descripcionPeriodo: '',
    esCerrada: false,
  };
  isLoading: boolean = false;
  alertMessage: string = '';
  alertType: string = '';
  isButtonDisabled: boolean = false;
  registroEditando: EstimacionesDTO = {
    id: 0,
    idPrecioUnitario: 0,
    cantidad: 0,
    cantidadConFormato: 0,
    idPadre: 0,
    idConcepto: 0,
    codigo: '',
    descripcion: '',
    unidad: '',
    costoUnitario: 0,
    costoUnitarioConFormato: '',
    importe: 0,
    importeConFormato: '',
    idProyecto: 0,
    importeDeAvance: 0,
    importeDeAvanceConFormato: '',
    porcentajeAvance: 0,
    porcentajeAvanceConFormato: '',
    porcentajeAvanceEditando: false,
    cantidadAvance: 0,
    cantidadAvanceConFormato: '',
    cantidadAvanceEditando: false,
    importeDeAvanceAcumulado: 0,
    importeDeAvanceAcumuladoConFormato: '',
    porcentajeAvanceAcumulado: 0,
    porcentajeAvanceAcumuladoConFormato: '',
    cantidadAvanceAcumulado: 0,
    cantidadAvanceAcumuladoConFormato: '',
    idPeriodo: 0,
    tipoPrecioUnitario: 0,
    porcentajeTotal: 0,
    porcentajeTotalConFormato: '',
    hijos: [],
    expandido: false,
    importeTotal: 0,
    importeTotalConFormato: '',
    cantidadAvanceTotal: 0,
    cantidadAvanceTotalConFormato: '',
  };

  selectedIndex: number = 0;
  totalConFormato: string = '0.00';
  appRecarga: number = 0;

  periodosXEstimacion: PeriodosXEstimacionDTO[] = [];
  @ViewChild('tooltipContent') tooltipContent!: any;
  @ViewChild(NgbTooltip) tooltip!: NgbTooltip; // Inicialización de la propiedad tooltip

  generadoresXEstimacion: GeneradoresXEstimacionDTO[] = [];
  esTon = false;
  esKg = false;
  esM = false;
  esM2 = false;
  esM3 = false;
  esPza = false;

  alertaSuccess: boolean = false;
      alertaMessage: string = '';
      alertaTipo: AlertaTipo = AlertaTipo.none;
      AlertaTipo = AlertaTipo;

  constructor(
    private estimacionesService: EstimacionesService,
    private proyectoService: ProyectoService,
    private _seguridadService: SeguridadService,
    private formBuilder: FormBuilder,
    public dialog: MatDialog
  ) {
    let idEmpresa = _seguridadService.obtenIdEmpresaLocalStorage();
    let idProyecto = _seguridadService.obtenerIdProyectoLocalStorage();
    this.selectedProyecto = Number(idProyecto);
    this.selectedEmpresa = Number(idEmpresa);
  }

  actualizaTotal(total: number) {
    this.totalConFormato = new Intl.NumberFormat('es-MX', {
      minimumFractionDigits: 2,
    }).format(total);
  }

  yourFn(event: any) {
    this.selectedIndex = event.index;
    this.appRecarga += 1;
  }

  abrirDialogo(): void {
    const dialogRef = this.dialog.open(ModalAlertComponent, {
      data: {
        selectedPeriodo: this.selectedPeriodo,
        selectedEmpresa: this.selectedEmpresa,
        selectedProyecto: this.selectedProyecto,
        titulo: '',
        mensaje: '¿Quieres eliminar el periodo?',
        funcionAceptarEstimaciones: this.eliminarPeriodo.bind(this),
      },
    });

    dialogRef.afterClosed().subscribe((resultado: boolean) => {
      // Verifica si se realizó la eliminación para actualizar los datos si es necesario
      if (resultado) {
        this.estimacionesService
          .obtenerPeriodos(this.selectedProyecto, this.selectedEmpresa)
          .subscribe((estimaciones: any[]) => {
            this.estimaciones = [];
            this.cargarPeriodos();
          });
      }
    });
  }

  ngOnInit(): void {
    this.cambiarProyecto();
    this.form = this.formBuilder.group({
      fechaTermino: [new Date(), { validators: [] }],
      fechaInicio: [new Date(), { validators: [] }],
    });
    this.proyectoService
      .obtenerTodosSinEstructurar(this.selectedEmpresa)
      .subscribe((proyectos) => {
        this.proyectos = proyectos;
        this.proyectosReset = proyectos;
      });
    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map((val) => this.filter(val))
    );
  }

  filter(val: string): string[] {
    return this.options.filter(
      (option) => option.toLowerCase().indexOf(val.toLowerCase()) === 0
    );
  }

  cargarPeriodos() {
    this.estimacionesService
      .obtenerPeriodos(this.selectedProyecto, this.selectedEmpresa)
      .subscribe((periodos) => {
        this.periodos = periodos;
        if (this.periodos.length > 0) {
          this.selectedPeriodo = periodos[this.periodos.length - 1].id;
          this.cargarEstimaciones();
        }
      });
  }

  cambiarProyecto() {
    this.cargarPeriodos();
    this.seEstaEditandoEstimacion = false;
  }

  // cambiarProyecto(proyecto: proyectoDTO) {
  //     if (proyecto) {
  //         this.selectedProyecto = proyecto.id;
  //         this.nombreProyecto = proyecto.nombre;
  //         this.cargarPeriodos();
  //     }
  // }

  crearPeriodo() {
    this.nuevoPeriodo.idProyecto = this.selectedProyecto;
    if(this.nuevoPeriodo.fechaTermino < this.nuevoPeriodo.fechaInicio) {
      console.log('es menor');

      this.alerta(AlertaTipo.error, 'La fecha de inicio debe ser menor a la fecha de termino.');
      this.alertMessage = 'La fecha de inicio debe ser menor a la fecha de termino.';
      this.alertType = 'error';
      this.autoCloseAlert();
      return
    }
    this.isLoading = true;
    this.isButtonDisabled = true;
    this.estimacionesService
      .crearPeriodo(this.nuevoPeriodo, this.selectedEmpresa)
      .subscribe(
        (registro) => {
          this.cargarPeriodos();
          this.alertMessage = 'Periodo creado con éxito.';
          this.alertType = 'success';
          this.isLoading = false;
          this.autoCloseAlert();
        },
        (error) => {
          this.alertMessage = 'Ocurrió un error al crear el periodo.';
          this.alertType = 'error';
          this.isLoading = false;
          this.autoCloseAlert();
        }
      );
    this.seEstaEditandoEstimacion = false;
  }
  autoCloseAlert() {
    this.isButtonDisabled = true; // Deshabilitamos el botón cuando la alerta se muestra
    setTimeout(() => {
      this.alertMessage = '';
      this.isButtonDisabled = false; // Habilitamos el botón cuando la alerta se cierra
    }, 3000); // Tiempo en milisegundos (3000ms = 3s)
  }
  expansionDominio(estimacion: EstimacionesDTO): void {
    estimacion.expandido = !estimacion.expandido;
  }

  asignarPorcentaje(estimacion: EstimacionesDTO) {
    this.totalEstimaciones = 0;
    this.ivaEstimaciones = 0;
    this.totalEstimacionesConIva = 0;
    let cantidad = (estimacion.porcentajeAvance / 100) * estimacion.cantidad;
    estimacion.cantidadAvance = cantidad;
    this.estimacionesService
      .editarEstimacion(estimacion, this.selectedEmpresa)
      .subscribe((registros) => {
        this.estimaciones = registros;
        this.seEstaEditandoEstimacion = false;
        for (let i = 0; i < this.estimaciones.length; i++) {
          this.totalEstimaciones =
            this.totalEstimaciones + this.estimaciones[i].importeDeAvance;
          this.ivaEstimaciones = this.totalEstimaciones * 0.16;
          this.totalEstimacionesConIva =
            this.totalEstimaciones + this.ivaEstimaciones;
          this.formatearTotales();
        }
      });
  }

  // cambiarProyecto(proyecto: proyectoDTO) {
  //     if (proyecto) {
  //         this.selectedProyecto = proyecto.id;
  //         this.nombreProyecto = proyecto.nombre;
  //         this.cargarPeriodos();
  //     }
  // }

  cargarEstimaciones() {
    this.totalEstimaciones = 0;
    this.ivaEstimaciones = 0;
    this.totalEstimacionesConIva = 0;
    this.periodo = this.periodos.filter((z) => z.id == this.selectedPeriodo)[0];
    this.estimacionesService
      .obtenerEstimaciones(this.selectedPeriodo, this.selectedEmpresa)
      .subscribe((estimaciones) => {
        this.estimaciones = estimaciones;
        console.log('estas son las estimaciones', this.estimaciones);
        for (let i = 0; i < this.estimaciones.length; i++) {
          this.totalEstimaciones =
            this.totalEstimaciones + this.estimaciones[i].importeDeAvance;
          this.ivaEstimaciones = this.totalEstimaciones * 0.16;
          this.totalEstimacionesConIva =
            this.totalEstimaciones + this.ivaEstimaciones;
          this.formatearTotales();
        }
      });
  }

  formatearTotales() {
    this.totalEstimacionesConFormato = new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
    }).format(this.totalEstimaciones);
    this.ivaEstimacionesConFormato = new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
    }).format(this.ivaEstimaciones);
    this.totalEstimacionesConIvaConFormato = new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
    }).format(this.totalEstimacionesConIva);
  }

  asignarCantidad(estimacion: EstimacionesDTO) {
    this.totalEstimaciones = 0;
    this.ivaEstimaciones = 0;
    this.totalEstimacionesConIva = 0;
    let porcentaje = (estimacion.cantidadAvance * 100) / estimacion.cantidad;
    estimacion.porcentajeAvance = porcentaje;
    this.estimacionesService
      .editarEstimacion(estimacion, this.selectedEmpresa)
      .subscribe((registros) => {
        this.estimaciones = registros;
        this.seEstaEditandoEstimacion = false;
        for (let i = 0; i < this.estimaciones.length; i++) {
          this.totalEstimaciones =
            this.totalEstimaciones + this.estimaciones[i].importeDeAvance;
          this.ivaEstimaciones = this.totalEstimaciones * 0.16;
          this.totalEstimacionesConIva =
            this.totalEstimaciones + this.ivaEstimaciones;
          this.formatearTotales();
        }
      });
  }

  habilitarEdicionPorcentaje(estimacion: EstimacionesDTO) {
    if (this.periodo.esCerrada != true) {
      if (this.seEstaEditandoEstimacion == false) {
        this.seEstaEditandoEstimacion = true;
        estimacion.porcentajeAvanceEditando = true;
        this.registroEditando = estimacion;
      }
    }
  }

  habilitarEdicionAvance(estimacion: EstimacionesDTO) {
    if (this.periodo.esCerrada != true) {
      if (this.seEstaEditandoEstimacion == false) {
        this.registroEditando.cantidadAvanceEditando = false;
        this.registroEditando.porcentajeAvanceEditando = false;

        estimacion.cantidadAvanceEditando = true;
        estimacion.porcentajeAvanceEditando = true;

        this.registroEditando = estimacion;
      }
    }
  }

  guardarPeriodo(periodo: PeriodoEstimacionesDTO) {
    this.periodo = periodo;
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

  @HostListener('document:keydown.Escape', ['$event'])
  quitarSeleccion(): void {
    this.registroEditando.porcentajeAvanceEditando = false;
    this.registroEditando.cantidadAvanceEditando = false;
    this.seEstaEditandoEstimacion = false;
  }

  eliminarPeriodo() {
    this.estimacionesService
      .eliminarPeriodo(this.selectedPeriodo, this.selectedEmpresa)
      .subscribe(() => {
        this.cargarPeriodos();
        this.estimaciones = [];
      });
  }

  obtenerPeriodosXEstimacion(estimacion: EstimacionesDTO) {
    this.estimacionesService
      .ObtenerPeriodosXEstimacion(estimacion.id, this.selectedEmpresa)
      .subscribe((datos) => {
        this.periodosXEstimacion = datos;
        console.log(
          'estos son los peridos por estimacion',
          this.periodosXEstimacion
        );
      });
  }

  VerGeneradores(estimacion: EstimacionesDTO) {
    this.esTon = false;
    this.esKg = false;
    this.esM = false;
    this.esM2 = false;
    this.esM3 = false;
    this.esPza = false;

    this.estimacionesService.ObtenerGeneradoresXEstimacion(estimacion.id, this.selectedEmpresa).subscribe((datos) => {
      this.generadoresXEstimacion = datos;
    });

    if (estimacion.unidad.toLowerCase() == 'm' || estimacion.unidad.toLowerCase() == 'ml') {
      this.esM = true;
    } else {
      this.esM = false;
    }
    if (estimacion.unidad.toLowerCase() == 'm2') {
      this.esM2 = true;
    } else {
      this.esM2 = false;
    }
    if (estimacion.unidad.toLowerCase() == 'm3') {
      this.esM3 = true;
    } else {
      this.esM3 = false;
    }
    if (estimacion.unidad.toLowerCase() == 'kg') {
      this.esKg = true;
    } else {
      this.esKg = false;
    }
    if (estimacion.unidad.toLowerCase() == 'ton') {
      this.esTon = true;
    } else {
      this.esTon = false;
    }
    if (estimacion.unidad.toLowerCase() == 'pza') {
      this.esPza = true;
    } else {
      this.esPza = false;
    }

    console.log("Aqui estoy");

  }

  crearGenerador(generador: GeneradoresXEstimacionDTO) {
    if(generador.cantidad <= 0 || generador.cantidad == null){
      return;
    }

    this.estimacionesService.CrearGeneradorXEstimacion(generador, this.selectedEmpresa).subscribe((datos) =>{
      this.generadoresXEstimacion = datos;

      this.estimacionesService.obtenerEstimaciones(this.selectedPeriodo, this.selectedEmpresa).subscribe((datos) => {
        this.estimaciones = datos;
      });
    });
  }

  eliminarGenerador(generador: GeneradoresXEstimacionDTO) {
    this.estimacionesService.EliminarGeneradorXEstimacion(generador.id, this.selectedEmpresa).subscribe((datos) =>{
      this.generadoresXEstimacion = datos;

      this.estimacionesService.obtenerEstimaciones(this.selectedPeriodo, this.selectedEmpresa).subscribe((datos) => {
        this.estimaciones = datos;
      });
    });
  }

  imprimir(){
    this.imprimirReporte(this.estimaciones,'','','','',30,30,30,30,true,this.totalEstimacionesConFormato,this.totalEstimacionesConIvaConFormato,this.proyectos[0],this.ivaEstimacionesConFormato, this.totalEstimacionesConIva)
  }

  imprimirReporte(
    precioUnitario: EstimacionesDTO[],
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
    totalIva: string,
    totalConIVAnumber: number
  ) {
    console.log('Anticipo: ',proyecto.anticipo+'%');
    
    (<any>pdfMake).addVirtualFileSystem(pdfFonts);
  
    let totalEnLetras: string;
  
    const content: any[] = [];

    const widths = [53, 130, 40, 51, 51, 51, 51, 51, 51, 51, 51, 51];
  
    const styles = {
      header: {
        fontSize: 10,
      },
      subheader: {
        fontSize: 6,
        bold: true,
      },
      quote: {
        italics: true,
        fontSize: 6,
      },
      small: {
        fontSize: 6,
      },
      smallCantidad: {
        fontSize: 6,
        alignment: 'right',
      },
      smallCantidadTotal: {
        fontSize: 6,
        alignment: 'right',
        bold: true,
      },
      smallBold: {
        fontSize: 6,
        textAlign: 'center',
        bold: true,
      },
      smallColored: {
        fontSize: 6,
        textAlign: 'center',
        bold: true,
        color: '#1c398e',
      },
      styleTotal: {
        fontSize: 6,
        textAlign: 'center',
        bold: true,
      },
      bold: {
        bold: true,
      },
      rounded: {
        rounded: 8,
      },
      tableHeader: {
        bold: true,
        fontSize: 10,
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
      [{ text: 'Estimaciones', style: 'subheader' }],
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
        { text: '', style: 'subheader', alignment: 'center', colSpan:4},
        { text: '', style: 'subheader', alignment: 'center'},
        { text: '', style: 'subheader', alignment: 'center'},
        { text: '', style: 'subheader', alignment: 'center'},
        { text: 'Anterior', style: 'subheader', alignment: 'center', colSpan: 2 },
        { text: '', style: 'subheader', alignment: 'center'},
        { text: 'Actual', style: 'subheader', alignment: 'center', colSpan:2},
        { text: '', style: 'subheader', alignment: 'center'},
        { text: 'Acumulado', style: 'subheader', alignment: 'center', colSpan: 3},
        { text: '', style: 'subheader', alignment: 'center' },
        { text: '', style: 'subheader', alignment: 'center' },
        { text: '', style: 'subheader', alignment: 'center' },

      ]
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
        widths: widths,
        body: tableHeader,
      },
    });

    const tableSubHeader = [
      [
        { text: 'Código', style: 'subheader', alignment: 'center' },
        { text: 'Descripción', style: 'subheader', alignment: 'center' },
        { text: 'Unidad', style: 'subheader', alignment: 'center' },
        { text: 'Cantidad', style: 'subheader', alignment: 'center' },
        { text: 'Importe', style: 'subheader', alignment: 'center' },
        { text: 'Avance', style: 'subheader', alignment: 'center' },
        { text: 'Importe', style: 'subheader', alignment: 'center' },
        { text: 'Avance', style: 'subheader', alignment: 'center' },
        { text: 'Importe', style: 'subheader', alignment: 'center' },
        { text: 'Avance', style: 'subheader', alignment: 'center' },
        { text: '%', style: 'subheader', alignment: 'center' },
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
        headerRows: 1,
        widths: widths,
        body: tableSubHeader,
      },
    });
  
    const tableBodyProyecto: any = [];
  
    precioUnitario.forEach((proyecto, index) => {
      const esPadreConHijos = proyecto.hijos?.length > 0;
  
      tableBodyProyecto.push([
        // { text: ``, style: 'small' },
        { text: proyecto.codigo, style: 'small' },
        { text: proyecto.descripcion, style: 'small', alignment: 'justify' },
        { text: proyecto.unidad, style: 'small' },
        { text: proyecto.cantidadConFormato, style: 'small', alignment: 'right'},
        { text: proyecto.importeConFormato, style: 'small',  alignment: 'right'},
        { text: proyecto.cantidadAvanceAcumuladoConFormato, style: 'small', alignment: 'right'},
        // { text: proyecto.porcentajeAvanceAcumuladoConFormato, style: 'small',},
        { text: proyecto.importeDeAvanceConFormato, style: 'small', alignment: 'right'},
        { text: proyecto.cantidadAvanceConFormato, style: 'small', alignment: 'right'},
        // { text: proyecto.porcentajeAvanceConFormato, style: 'small',},
        { text: proyecto.importeDeAvanceAcumuladoConFormato, style: 'small', alignment: 'right'},
        { text: proyecto.cantidadAvanceTotalConFormato, style: 'small', alignment: 'right'},
        { text: proyecto.porcentajeTotalConFormato, style: 'small', alignment: 'right'},
        { text: proyecto.importeTotalConFormato, style: 'small', alignment: 'right'},
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
        hLineColor: () => '#B9B9B9',
        hLineWidth: () => 0, // todas las líneas horizontales
        vLineColor: () => '#B9B9B9',
        vLineWidth: () => 0, // todas las líneas verticales
      },
      table: {
        headerRows: 0,
        widths: widths,
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
  
      // const subtotal = (Number(precio.importe) - totalMasIva).toFixed(2);
  
      // content.push({
      //   columns: [
      //     { width: '*', text: '' },
      //     {
      //       width: 'auto',
      //       table: {
      //         widths: ['auto', 'auto'],
      //         body: [
      //           [
      //             {
      //               text: `Subtotal de ${precio.codigo}`,
      //               style: 'styleTotal',
      //             },
      //             {
      //               text: `$ ${precio.importeConFormato}`,
      //               style: 'styleTotal',
      //               alignment: 'right',
      //             },
      //           ],
      //         ],
      //       },
      //       layout: {
      //         hLineColor: () => '#B9B9B9',
      //         vLineColor: () => '#B9B9B9',
      //         hLineWidth: () => 0,
      //         vLineWidth: () => 0,
      //       },
      //       margin: [0, 0, 0, 5],
      //     },
      //   ],
      // });
    });

    // content.push({
    //   columns: [
    //     { width: '*', text: '' },
    //     {
    //       width: 'auto',
    //       table: {
    //         body: [
    //           [
                
    //             {
    //               text: `Total:`,
    //               style: 'smallCantidadTotal',
    //               alignment: 'right',
    //             },
    //             { text: numeroALetras(totalConIVAnumber), style: 'smallCantidadTotal'},
    //           ],
    //         ],
    //       },
    //       layout: {
    //         hLineColor: () => '#B9B9B9',
    //         vLineColor: () => '#B9B9B9',
    //         hLineWidth: () => 0.5,
    //         vLineWidth: () => 0.5,
    //       },
    //       margin: [0, 0, 0, 5],
    //     },
    //   ],
      
    // })
  
    content.push({
      columns: [
        { width: '*', text: '' },
        { width: '*', text: '' },
        {
          width: 'auto',
          table: {
            body: [
              [
                {
                  text: 'Subtotal ',
                  style: 'smallCantidadTotal',
                },
                {
                  text: ` ${totalSinIVA}`,
                  style: 'smallCantidadTotal',
                  alignment: 'right',
                },
                {}
              ],
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
                {}
              ],
              [
                { text: 'Total', style: 'smallCantidadTotal' },
                {
                  text: ` ${totalConIVA}`,
                  style: 'smallCantidadTotal',
                  alignment: 'right',
                },
                {text: numeroALetras(totalConIVAnumber), style: 'smallCantidadTotal'}
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
  
    // if (importeConLetra) {
    //   precioUnitario.forEach((proyecto) => {
    //     totalEnLetras = numeroALetras(proyecto.costoUnitario);
  
    //     content.push({
    //       columns: [
    //         { width: '*', text: '' },
    //         {
    //           width: 'auto',
    //           table: {
    //             widths: ['auto'],
    //             body: [
    //               [
    //                 {
    //                   text: `${totalEnLetras}`,
    //                   style: 'smallBold',
    //                 },
    //               ],
    //             ],
    //           },
    //           layout: {
    //             hLineColor: () => '#B9B9B9',
    //             vLineColor: () => '#B9B9B9',
    //             hLineWidth: () => 0.5,
    //             vLineWidth: () => 0.5,
    //           },
    //           margin: [0, 5, 0, 5],
    //         },
    //       ],
    //     });
    //   });
    // }
  
    const docDefinition: any = {
      content,
      styles,
      pageMargins: [
        margenIzquierdo,
        margenSuperior,
        margenDerecho,
        margenInferior,
      ],
      pageOrientation: 'landscape'
    };
  
    pdfMake.createPdf(docDefinition).download(`Estimaciones.pdf`);
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

  cerrarAlerta() {
      this.alertaSuccess = false;
      this.alertaTipo = AlertaTipo.none;
      this.alertaMessage = '';
    }
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
      ? { fontSize: 6, bold: true, color }
      : { fontSize: 6 };

    // fila base
    const fila = [
      // { text: `${numero}`, style: 'small' },
      { text: `${numero}`+'  '+hijo.codigo, ...style },
        { text: hijo.descripcion, style: 'small', alignment: 'justify' },
        { text: hijo.unidad, style: 'small' },
        { text: hijo.cantidadConFormato, style: 'small', alignment: 'right'},
        { text: hijo.importeConFormato, style: 'small', alignment: 'right' },
        { text: hijo.cantidadAvanceAcumuladoConFormato, style: 'small', alignment: 'right'},
        // { text: hijo.porcentajeAvanceAcumuladoConFormato, style: 'small',},
        { text: hijo.importeDeAvanceConFormato, style: 'small', alignment: 'right'},
        { text: hijo.cantidadAvanceConFormato, style: 'small', alignment: 'right'},
        // { text: hijo.porcentajeAvanceConFormato, style: 'small',},
        { text: hijo.importeDeAvanceAcumuladoConFormato, style: 'small', alignment: 'right'},
        { text: hijo.cantidadAvanceTotalConFormato, style: 'small', alignment: 'right'},
        { text: hijo.porcentajeTotalConFormato, style: 'small', alignment: 'right'},
        { text: hijo.importeTotalConFormato, style: 'small', alignment: 'right'},
    ];

    // recorrer hijos recursivamente
    const subFilas = hijo.hijos ? mapHijos(hijo.hijos, nivel + 1, numero) : [];

    // fila de total si tiene hijos
    let filas = [fila, ...subFilas];
    // if (esPadreConHijos) {
    //   const totalFila = [
    //     {
    //       text: `Total de ${hijo.descripcion}  $  ${hijo.importeConFormato}`,
    //       style: 'smallCantidadTotal',
    //       alignment: 'right',
    //       colSpan: 12,
    //     },
        
    //   ];
    //   filas.push(totalFila);
    // }

    return filas;
  });

  
}
