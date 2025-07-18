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
}
