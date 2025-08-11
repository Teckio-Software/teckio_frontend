import {
  ParametrosFsrDTO,
  ParametrosFsrXInsumoDTO,
  PorcentajeCesantiaEdadDTO,
} from './../../fsr/tsFSR';
import { Component, Inject } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import {
  diasConsideradosDTO,
  factorSalarioIntegradoDTO,
  factorSalarioRealDTO,
  factorSalarioRealDetalleDTO,
} from '../../fsr/tsFSR';
import { FSRService } from '../../fsr/fsr.service';
import { SeguridadService } from 'src/app/seguridad/seguridad.service';
import { map, Observable, startWith, subscribeOn } from 'rxjs';
import { th } from 'date-fns/locale';
import { EstimacionesService } from '../../estimaciones/estimaciones.service';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { proyectoDTO } from '../../proyecto/tsProyecto';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { ProyectoService } from '../../proyecto/proyecto.service';

@Component({
  selector: 'app-dialog-fsr',
  templateUrl: './dialog-fsr.component.html',
  styleUrls: ['./dialog-fsr.component.css'],
})
export class DialogFSRComponent {
  selectedEmpresa: number;
  selectedProyecto: number;

  fsi: factorSalarioIntegradoDTO = {
    id: 0,
    idProyecto: 0,
    fsi: 0,
  };
  fsr: factorSalarioRealDTO = {
    id: 0,
    idProyecto: 0,
    porcentajeFsr: 0,
    esCompuesto: false,
  };
  ParametrosFsrDTO: ParametrosFsrDTO = {
    id: 0,
    idProyecto: 0,
    riesgoTrabajo: 0,
    cuotaFija: 0,
    aplicacionExcedente: 0,
    prestacionDinero: 0,
    gastoMedico: 0,
    invalidezVida: 0,
    retiro: 0,
    prestaconSocial: 0,
    infonavit: 0,
    uma: 0,
  };
  porcentajesCesantiaEdad: PorcentajeCesantiaEdadDTO[] = [];
  parametrosXInsumo: ParametrosFsrXInsumoDTO[] = [];

  diasNoLaborales: number = 0;
  diasPagados: number = 0;
  fsrDetalles: factorSalarioRealDetalleDTO[] = [];
  diasConsideradosFsiPagados: diasConsideradosDTO[] = [];
  diasConsideradosFsiNoTrabajados: diasConsideradosDTO[] = [];

  porcentajePrestaciones: number = 0;
  existeEdicion: boolean = false;

  existenEstimaciones: boolean = false;
  selectedIndex: number = 0;

  proyectoControl = new FormControl('');
  filteredProyectos: Observable<proyectoDTO[]> = new Observable<
    proyectoDTO[]
  >();

  proyectos!: proyectoDTO[];
  nombreProyecto: string = '';
  idProyectoFiltro: number = 0;

  constructor(
    public dialogRef: MatDialogRef<DialogFSRComponent>,
    private formBuilder: FormBuilder,
    private _snackBar: MatSnackBar,
    private fsrService: FSRService,
    private _SeguridadService: SeguridadService,
    private estimacionesService: EstimacionesService,
    private proyectoService: ProyectoService,

    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    let Empresa = this._SeguridadService.obtenIdEmpresaLocalStorage();
    this.selectedEmpresa = Number(Empresa);
    let Proyecto = this._SeguridadService.obtenerIdProyectoLocalStorage();
    this.selectedProyecto = Number(Proyecto);
  }

  ngOnInit(): void {
    this.estimacionesService
      .obtenerPeriodos(this.selectedProyecto, this.selectedEmpresa)
      .subscribe((datos) => {
        if (datos.length > 0) {
          this.existenEstimaciones = true;
        }
      });
    console.log(
      'datos recibidos dias Considerados No trabajados',
      this.selectedEmpresa
    );
    console.log(
      'datos recibidos dias Considerados Pagados',
      this.diasConsideradosFsiPagados
    );
    this.ObtenerFS();
    this.calcularDias();
    this.proyectoService.obtener(this.selectedEmpresa).subscribe((datos) => {
      this.proyectos = datos;
    });
  }

  ObtenerFS() {
    this.fsrService
      .obtenerFSR(this.selectedProyecto, this.selectedEmpresa)
      .subscribe((datos) => {
        this.fsr = datos;
        console.log('este es el FSR', this.fsr);
        this.fsrService
          .obtenerFSRDetalles(this.fsr.id, this.selectedEmpresa)
          .subscribe((datos) => {
            this.fsrDetalles = datos;
            console.log('estos son los det FSR', this.fsrDetalles);
            this.fsrDetalles.push({
              id: 0,
              idFactorSalarioReal: 0,
              codigo: '',
              descripcion: '',
              porcentajeFsrdetalle: 0,
              articulosLey: '',
              idProyecto: this.selectedProyecto,
            });
            this.calcularDias();
          });
      });
    this.fsrService
      .obtenerFSI(this.selectedProyecto, this.selectedEmpresa)
      .subscribe((datos) => {
        this.fsi = datos;
        console.log('este es el FSI', this.fsi);
        this.fsrService
          .obtenerDiasNoLaborables(this.fsi.id, this.selectedEmpresa)
          .subscribe((datos) => {
            this.diasConsideradosFsiNoTrabajados = datos;
            console.log(
              'estos son los det FSI no Laborales',
              this.diasConsideradosFsiNoTrabajados
            );
            this.diasConsideradosFsiNoTrabajados.push({
              id: 0,
              codigo: '',
              descripcion: '',
              valor: 0,
              articulosLey: '',
              esLaborableOPagado: false,
              idFactorSalarioIntegrado: 0,
              idProyecto: this.selectedProyecto,
            });
            this.calcularDias();
          });
        this.fsrService
          .obtenerDiasPagados(this.fsi.id, this.selectedEmpresa)
          .subscribe((datos) => {
            this.diasConsideradosFsiPagados = datos;
            console.log(
              'estos son los det FSI Pagados',
              this.diasConsideradosFsiPagados
            );
            this.diasConsideradosFsiPagados.push({
              id: 0,
              codigo: '',
              descripcion: '',
              valor: 0,
              articulosLey: '',
              esLaborableOPagado: true,
              idFactorSalarioIntegrado: 0,
              idProyecto: this.selectedProyecto,
            });
            this.calcularDias();
          });
      });
    this.fsrService
      .obtenerParametrosFrs(this.selectedProyecto, this.selectedEmpresa)
      .subscribe((datos) => {
        this.ParametrosFsrDTO = datos;
        console.log('estos son los parametros de FSR', this.ParametrosFsrDTO);
      });

    this.fsrService
      .obtenerPorcentajeCesantiaEdad(
        this.selectedProyecto,
        this.selectedEmpresa
      )
      .subscribe((datos) => {
        this.porcentajesCesantiaEdad = datos;
        this.porcentajesCesantiaEdad.push({
          id: 0,
          idProyecto: this.selectedProyecto,
          rangoUMA: 0,
          porcentaje: 0,
        });
      });
  }

  calcularDias() {
    console.log('aqui ando');
    this.porcentajePrestaciones = 0;
    this.diasPagados = 0;
    this.diasNoLaborales = 0;
    this.fsrDetalles.forEach((element) => {
      this.porcentajePrestaciones += element.porcentajeFsrdetalle;
    });
    this.diasConsideradosFsiNoTrabajados.forEach((element) => {
      this.diasNoLaborales += element.valor;
    });
    this.diasConsideradosFsiPagados.forEach((element) => {
      this.diasPagados += element.valor;
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
    this.existeEdicion = true;
    if (dias.id <= 0) {
      this.fsrService.crearDiasFSI(dias, this.selectedEmpresa).subscribe(() => {
        this.ObtenerFS();
        this.calcularDias();
      });
    } else {
      this.fsrService
        .editarDiasFSI(dias, this.selectedEmpresa)
        .subscribe(() => {
          this.ObtenerFS();
          this.calcularDias();
        });
    }
  }

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
    this.existeEdicion = true;
    if (fsrDetalle.id <= 0) {
      this.fsrService
        .crearDetalleFSR(fsrDetalle, this.selectedEmpresa)
        .subscribe(() => {
          this.ObtenerFS();
          this.calcularDias();
        });
    } else {
      this.fsrService
        .editarDetalleFSR(fsrDetalle, this.selectedEmpresa)
        .subscribe(() => {
          this.ObtenerFS();
          this.calcularDias();
        });
    }
  }

  EliminarDetFSI(dias: diasConsideradosDTO) {
    this.existeEdicion = true;
    this.fsrService
      .eliminarDetalleFSI(dias.id, this.selectedEmpresa)
      .subscribe(() => {
        this.ObtenerFS();
        this.calcularDias();
      });
  }

  EliminarDetFSR(fsrDetalle: factorSalarioRealDetalleDTO) {
    this.existeEdicion = true;
    this.fsrService
      .eliminarDetalleFSR(fsrDetalle.id, this.selectedEmpresa)
      .subscribe(() => {
        this.ObtenerFS();
        this.calcularDias();
      });
  }

  EsCompuesto() {
    console.log('cambiado es compuesto', this.fsr);
    this.existeEdicion = true;
    this.fsrService
      .FsrEsCompuesto(this.fsr, this.selectedEmpresa)
      .subscribe((datos) => {
        this.ObtenerFS();
        this.calcularDias();
      });
  }

  crearParametro() {
    this.existeEdicion = true;
    if (this.ParametrosFsrDTO.id == 0) {
      this.ParametrosFsrDTO.idProyecto = this.selectedProyecto;

      this.fsrService
        .crearParametrosFsr(this.ParametrosFsrDTO, this.selectedEmpresa)
        .subscribe((datos) => {
          this.ObtenerFS();
          this.calcularDias();
        });
    } else {
      this.fsrService
        .editarParametrosFsr(this.ParametrosFsrDTO, this.selectedEmpresa)
        .subscribe((datos) => {
          this.ObtenerFS();
          this.calcularDias();
        });
    }
  }

  crearPorcentajeCensantiaEdad(porcentaje: PorcentajeCesantiaEdadDTO) {
    this.existeEdicion = true;
    if (porcentaje.id == 0) {
      porcentaje.idProyecto = this.selectedProyecto;
      this.fsrService
        .crearRangoPorcentajeCesantiaEdad(porcentaje, this.selectedEmpresa)
        .subscribe((datos) => {
          this.ObtenerFS();
          this.calcularDias();
        });
    } else {
      this.fsrService
        .editarRangoPorcentajeCesantiaEdad(porcentaje, this.selectedEmpresa)
        .subscribe((datos) => {
          this.ObtenerFS();
          this.calcularDias();
        });
    }
  }

  cargarParametrosXInsumo() {
    this.fsrService
      .obtenerParametrosXInsumo(this.fsr, this.selectedEmpresa)
      .subscribe((datos) => {
        this.parametrosXInsumo = datos;
        console.log('parametrso x Insumo', this.parametrosXInsumo);
      });
  }

  actualizarCostoBaseInsumo(insumo: ParametrosFsrXInsumoDTO) {
    this.existeEdicion = true;
    this.fsrService
      .actualizarCostoBaseInsumo(insumo, this.selectedEmpresa)
      .subscribe((datos) => {
        this.cargarParametrosXInsumo();
      });
  }

  cerrarDialog() {
    this.dialogRef.close(this.existeEdicion); // Cierra el modal sin guardar
  }

  detenerCierre(event: MouseEvent) {
    console.log('afuera');
    event.stopPropagation();
  }

  seleccionarIndex(event: MatTabChangeEvent) {
    this.selectedIndex = event.index;
    if (this.selectedIndex == 2) {
      this.cargarParametrosXInsumo();
    }
  }

  selectionChangeProyecto(event: MatAutocompleteSelectedEvent) {
    const selectedProyecto = event.option.value;

    this.proyectoControl.setValue(selectedProyecto.nombre);
    const exixteProyecto = this.proyectos.filter(
      (e) => e.nombre === selectedProyecto.nombre
    );
    if (exixteProyecto.length > 0) {
      const idProyecto = selectedProyecto.id;
    }

    this.nombreProyecto = exixteProyecto[0].nombre;
    this.idProyectoFiltro = exixteProyecto[0].id;
  }

  importarFsr() {
    console.log('este es el proyecto seleccionado', this.idProyectoFiltro);
    if (this.idProyectoFiltro <= 0) {
      console.log('Alerta de seleccione un proyecto');
    } else {
      this.fsrService
        .importarFsr(
          this.selectedProyecto,
          this.idProyectoFiltro,
          this.selectedEmpresa
        )
        .subscribe((datos) => {
          this.existeEdicion = true;
          this.nombreProyecto = "";
          this.idProyectoFiltro = 0;
          this.ObtenerFS();
          this.calcularDias();
          this.cargarParametrosXInsumo();
        });
    }
  }

  reiniciarFiltro() {
    this.filteredProyectos = this.proyectoControl.valueChanges.pipe(
      startWith(''),
      map((value) => {
        const stringValue = typeof value === 'string' ? value : '';
        return this._filter(stringValue);
      })
    );
  }

  reiniciarProyecto(event: any) {
    this.idProyectoFiltro = 0;
  }

  private _filter(value: string): proyectoDTO[] {
    const filterValue = this._normalizeValue(String(value));

    return this.proyectos.filter((proyecto) =>
      this._normalizeValue(proyecto.nombre).includes(filterValue)
    );
  }

  private _normalizeValue(value: string): string {
    return value.toLowerCase().replace(/\s/g, '');
  }
}
