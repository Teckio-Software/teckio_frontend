import { Component, EventEmitter, Inject, Input, Output, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FSRService } from '../../fsr/fsr.service';
import { PrecioUnitarioService } from '../precio-unitario.service';
import { estructuraFsiXInsummoMdODTO, estructuraFsrXInsummoMdODTO, fsiXInsumoMdODetalleDTO, fsrXInsumoMdODetalleDTO, fsrXInsumoMdODTO } from '../../fsr/tsFSR';
import { InsumoDTO, InsumoParaExplosionDTO } from 'src/app/catalogos/insumo/tsInsumo';
import { map, Observable, startWith } from 'rxjs';
import { valueOrDefault } from 'chart.js/dist/helpers/helpers.core';
import { SeguridadService } from 'src/app/seguridad/seguridad.service';
import { EstimacionesService } from '../../estimaciones/estimaciones.service';
import { precioUnitarioDTO } from '../tsPrecioUnitario';

@Component({
  selector: 'app-dialog-explosion-insumos',
  templateUrl: './dialog-explosion-insumos.component.html',
  styleUrls: ['./dialog-explosion-insumos.component.css']
})
export class DialogExplosionInsumosComponent {
  @Input() precioUnitario : precioUnitarioDTO = {
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
    esCatalogoGeneral: false
  }

  selectedProyecto: number = 0;
  selectedEmpresa: number;
  explosionInsumos: InsumoParaExplosionDTO[] = [];
  explosionInsumosReset: InsumoParaExplosionDTO[] = [];

  explosionControl = new FormControl("")
  filteredExplosion: Observable<InsumoParaExplosionDTO[]> = new Observable<InsumoParaExplosionDTO[]>();
  busqueda: string = "";
  existeEdicion: boolean = false;
  idTipoInsumoSelectedParaFiltroDeExplosion: number = 0;
  importeTotal: number = 0;
  importeTotalConFormato: string = "0.00";
  @Output() recalcular = new EventEmitter();
  existenEstimaciones: boolean = false;


  @ViewChild('dialogFactorSalarioReal', { static: true })
  dialogNuevoFactorSalarioReal!: TemplateRef<any>;

  ordenCodigo: boolean = false;
  ordenDescripcion: boolean = false;
  ordenUnidad: boolean = false;
  ordenCantidad: boolean = false;
  ordenCostoB: boolean = false;
  ordenCostoU: boolean = false;
  ordenImporte: boolean = false;


  constructor(
    // public dialogRef: MatDialogRef<DialogExplosionInsumosComponent>,
    private formBuilder: FormBuilder,
    private _snackBar: MatSnackBar,
    private fsrService: FSRService,
    private precioUnitarioService: PrecioUnitarioService,
    private _seguridadService: SeguridadService,
    private dialog: MatDialog,
    private estimacionesService: EstimacionesService,


    // @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    // this.selectedProyecto = this.data.selectedProyecto;
    // this.selectedEmpresa = this.data.selectedEmpresa;
    // this.idTipoInsumoSelectedParaFiltroDeExplosion = this.data.idTipoInsumoSelectedParaFiltroDeExplosion
    let idProyecto = _seguridadService.obtenerIdProyectoLocalStorage();
    let idEmpresa = _seguridadService.obtenIdEmpresaLocalStorage();
    this.selectedEmpresa = Number(idEmpresa);
    this.selectedProyecto = Number(idProyecto);


  }

  ngOnInit(): void {
    this.cargarExplosion();
  }

  cerrarExplosion() {
    this.recalcular.emit(this.existeEdicion);
  }

  private _filter(value: string): InsumoParaExplosionDTO[] {
    const filterValue = this._normalizeValue(String(value));


    return this.explosionInsumos.filter(explosion =>
      this._normalizeValue(explosion.descripcion).includes(filterValue)
    );
  }

  private _normalizeValue(value: string): string {
    if (value == null) {
      value = "";
    }
    return value.toLowerCase().replace(/\s/g, '');
  }

  seCreaFactorSalarioReal: boolean = false;
  fsi: estructuraFsiXInsummoMdODTO = {
    detalles: [],
    id: 0,
    diasNoLaborales: 0,
    diasPagados: 0,
    fsi: 0,
    idInsumo: 0,
    idProyecto: 0
  }

  fsr: estructuraFsrXInsummoMdODTO = {
    detalles: [],
    id: 0,
    costoDirecto: 0,
    costoFinal: 0,
    fsr: 0,
    idInsumo: 0,
    idProyecto: 0
  }




  filtrarExplosion(tipo: number) {
    this.explosionInsumos = this.explosionInsumosReset;

    this.idTipoInsumoSelectedParaFiltroDeExplosion = Number(tipo);
    if (this.idTipoInsumoSelectedParaFiltroDeExplosion == 0) {
      this.filteredExplosion = this.explosionControl.valueChanges.pipe(
        startWith(this.busqueda),
        map(value => {
          const stringValue = typeof value === 'string' ? value : '';
          return this._filter(stringValue);
        })
      );
    }
    else {
      this.explosionInsumos = this.explosionInsumosReset.filter(z => z.idTipoInsumo == this.idTipoInsumoSelectedParaFiltroDeExplosion);
      this.filteredExplosion = this.explosionControl.valueChanges.pipe(
        startWith(this.busqueda),
        map(value => {
          const stringValue = typeof value === 'string' ? value : '';
          return this._filter(stringValue);
        })
      );
    }
    this.importeTotal = 0;
    this.filteredExplosion.subscribe((datos) => {
      datos.forEach((element) => {
        this.importeTotal = this.importeTotal + element.importe;
      });
    });
    this.importeTotalConFormato = new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(this.importeTotal);
  }

  filtrarTabla(event: any) {
    let texto = event.target.value;

    this.filteredExplosion = this.explosionControl.valueChanges.pipe(
      startWith(texto),
      map(value => {
        const stringValue = typeof value === 'string' ? value : '';
        return this._filter(stringValue);
      })
    );
    this.importeTotal = 0;
    this.filteredExplosion.subscribe((datos) => {
      datos.forEach((element) => {
        this.importeTotal = this.importeTotal + element.importe;
      });
    });
    this.importeTotalConFormato = new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(this.importeTotal);
  }

  cerrarDialog() {
    this.dialog.closeAll(); // Cierra el modal sin guardar
  }

  detenerCierre(event: MouseEvent) {
    event.stopPropagation();
  }

  editarInsumo(insumo: InsumoParaExplosionDTO) {
    this.existeEdicion = true;
    this.precioUnitarioService.editarDesdeExplosion(insumo, this.selectedEmpresa)
      .subscribe((respuesta) => {
        this.cargarExplosion();
        this.filtrarExplosion(this.idTipoInsumoSelectedParaFiltroDeExplosion);
      })
  }

  cargarExplosion(){
    this.estimacionesService.obtenerPeriodos(this.selectedProyecto, this.selectedEmpresa).subscribe((datos) => {
      if (datos.length > 0) {
        this.existenEstimaciones = true;
      }
    });

    if(this.precioUnitario.id == 0){
      this.precioUnitarioService.explosionDeInsumos(this.selectedProyecto, this.selectedEmpresa)
      .subscribe((explosion) => {
        this.explosionInsumos = explosion;
        this.explosionInsumosReset = explosion;
        this.filteredExplosion = this.explosionControl.valueChanges.pipe(
          startWith(''),
          map(value => {
            const stringValue = typeof value === 'string' ? value : '';
            return this._filter(stringValue);
          })
        );
        this.importeTotal = 0;
        this.filteredExplosion.subscribe((datos) => {
          datos.forEach((element) => {
            this.importeTotal = this.importeTotal + element.importe;
          });
        });
        this.importeTotalConFormato = new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(this.importeTotal);
      })
    }else{
      this.precioUnitarioService.obtenerExplosionDeInsumosXPrecioUnitario(this.precioUnitario, this.selectedEmpresa)
      .subscribe((explosion) => {
        this.explosionInsumos = explosion;
        this.explosionInsumosReset = explosion;
        this.filteredExplosion = this.explosionControl.valueChanges.pipe(
          startWith(''),
          map(value => {
            const stringValue = typeof value === 'string' ? value : '';
            return this._filter(stringValue);
          })
        );
        this.importeTotal = 0;
        this.filteredExplosion.subscribe((datos) => {
          datos.forEach((element) => {
            this.importeTotal = this.importeTotal + element.importe;
          });
        });
        this.importeTotalConFormato = new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(this.importeTotal);
      })
    }

  }



  ////////////////////////////// FSR //////////////////////////////
  detallesFSIPagados: fsiXInsumoMdODetalleDTO[] = [];
  detallesFSINoTrabajados: fsiXInsumoMdODetalleDTO[] = [];
  detallesFSR: fsrXInsumoMdODetalleDTO[] = [];
  insumoSeleccionado: InsumoParaExplosionDTO = {
    cantidad: 0,
    importe: 0,
    costoUnitarioConFormato: '',
    cantidadConFormato: '',
    importeConFormato: '',
    id: 0,
    idProyecto: 0,
    descripcion: '',
    unidad: '',
    codigo: '',
    idTipoInsumo: 0,
    idFamiliaInsumo: 0,
    descripcionTipoInsumo: '',
    descripcionFamiliaInsumo: '',
    costoUnitario: 0,
    costoBase: 0,
    esFsrGlobal: false,
    costoBaseConFormato: '',
    seEstaEditandoCostoBase: false
  };

  diasNoLaborales: number = 0;
  diasPagados: number = 0;
  porcentajePrestaciones: number = 0;


  abrirFSR(registro: InsumoParaExplosionDTO) {
    if(registro.idTipoInsumo != 10000){
      return;
    }
    this.dialog.open(this.dialogNuevoFactorSalarioReal, {
      width: '20%',
      disableClose: true
    });
    this.obtenerFSR(registro);
  }

  obtenerFSR(registro: InsumoParaExplosionDTO) {
    if (registro.idTipoInsumo == 10000) {
      this.insumoSeleccionado = registro;
      this.fsrService.obtenerFSRXInsumo(registro.id, this.selectedEmpresa)
        .subscribe((registros) => {
          this.porcentajePrestaciones = 0;
          this.fsi = registros.fsi;
          this.fsr = registros.fsr;
          this.detallesFSIPagados = registros.fsi.detalles.filter(z => z.esLaborableOpagado == true);
          this.detallesFSINoTrabajados = registros.fsi.detalles.filter(z => z.esLaborableOpagado == false);

          this.detallesFSR = registros.fsr.detalles;
          this.detallesFSR.forEach((element) => {
            this.porcentajePrestaciones += element.porcentajeFsr;
          });

          this.detallesFSINoTrabajados.push({
            id: 0,
            codigo: '',
            descripcion: '',
            articulosLey: '',
            dias: 0,
            esLaborableOpagado: false,
            idFsiXInsumMdO: this.fsi.id,
            idInsumo: registro.id,
            idProyecto: registro.idProyecto
          })
          this.detallesFSIPagados.push({
            id: 0,
            codigo: '',
            descripcion: '',
            articulosLey: '',
            dias: 0,
            esLaborableOpagado: true,
            idFsiXInsumMdO: this.fsi.id,
            idInsumo: registro.id,
            idProyecto: registro.idProyecto
          })
          this.detallesFSR.push({
            id: 0,
            codigo: '',
            descripcion: '',
            articulosLey: '',
            porcentajeFsr: 0,
            idFsrXInsumoMdO: this.fsr.id,
            idInsumo: registro.id,
            idProyecto: registro.idProyecto
          })
        })
    }
  }

  crearDetalleFSI(registro: fsiXInsumoMdODetalleDTO) {
    console.log("R", registro);
    this.existeEdicion = true;
    registro.idInsumo = this.insumoSeleccionado.id;
    registro.idProyecto = this.selectedProyecto;
    if (registro.id != 0) {
      this.fsrService.editarFSIXInsumo(registro, this.selectedEmpresa)
        .subscribe((respuesta) => {
          if (respuesta.estatus == true) {
            this.obtenerFSR(this.insumoSeleccionado);
          }
        })
    } else {
      this.fsrService.crearFsiDetalleXInsumo(registro, this.selectedEmpresa)
        .subscribe((respuesta) => {
          if (respuesta.estatus == true) {
            this.obtenerFSR(this.insumoSeleccionado);
          }
        })
    }
  }

  crearDetalleFSR(registro: fsrXInsumoMdODetalleDTO) {
    this.existeEdicion = true;
    registro.idInsumo = this.insumoSeleccionado.id;
    registro.idProyecto = this.selectedProyecto;

    if (registro.id != 0) {
      this.fsrService.editarFSRXInsumo(registro, this.selectedEmpresa)
        .subscribe((respuesta) => {
          if (respuesta.estatus == true) {
            this.obtenerFSR(this.insumoSeleccionado);
          }
        })
    } else {
      this.fsrService.crearFsrDetalleXInsumo(registro, this.selectedEmpresa)
        .subscribe((respuesta) => {
          if (respuesta.estatus == true) {
            this.obtenerFSR(this.insumoSeleccionado);
          }
        })
    }
  }

  EliminarDetFSI(registro: fsiXInsumoMdODetalleDTO) {
    this.existeEdicion = true;
    registro.idInsumo = this.insumoSeleccionado.id;
    registro.idProyecto = this.insumoSeleccionado.idProyecto;
    this.fsrService.eliminarFsiDetalleXInsumo(registro.id, this.selectedEmpresa).subscribe((datos) => {
      if (datos.estatus) {
        this.obtenerFSR(this.insumoSeleccionado);
      }
    });
  }

  EliminarDetFSR(registro: fsrXInsumoMdODetalleDTO) {
    this.existeEdicion = true;
    registro.idInsumo = this.insumoSeleccionado.id;
    registro.idProyecto = this.insumoSeleccionado.idProyecto;
    this.fsrService.eliminarFsrDetalleXInsumo(registro.id, this.selectedEmpresa).subscribe((datos) => {
      if (datos.estatus) {
        this.obtenerFSR(this.insumoSeleccionado);
      }
    });
  }

  insumoParaEditar: InsumoDTO = {
    id: 0,
    idProyecto: 0,
    descripcion: '',
    unidad: '',
    codigo: '',
    idTipoInsumo: 0,
    idFamiliaInsumo: 0,
    descripcionTipoInsumo: '',
    descripcionFamiliaInsumo: '',
    costoUnitario: 0,
    costoBase: 0,
    esFsrGlobal: false
  }

  costoBaseSeleccionado: InsumoParaExplosionDTO = {
    cantidad: 0,
    importe: 0,
    costoUnitarioConFormato: '',
    costoBaseConFormato: '',
    seEstaEditandoCostoBase: false,
    cantidadConFormato: '',
    importeConFormato: '',
    id: 0,
    idProyecto: 0,
    descripcion: '',
    unidad: '',
    codigo: '',
    idTipoInsumo: 0,
    idFamiliaInsumo: 0,
    descripcionTipoInsumo: '',
    descripcionFamiliaInsumo: '',
    costoUnitario: 0,
    costoBase: 0,
    esFsrGlobal: false
  }

  habilitarEdicionCostoBase(insumo: InsumoParaExplosionDTO) {
    if (this.existenEstimaciones) {
      return;
    }
    this.costoBaseSeleccionado.seEstaEditandoCostoBase = false;
    this.costoBaseSeleccionado = insumo;
    this.costoBaseSeleccionado.seEstaEditandoCostoBase = true;
  }

  clickFiltroCodigo(event: Event) {
    console.log("esre es el evento", event.target as HTMLElement);
    const elemento = event.target as HTMLElement;
    switch (elemento.id) {
      case "codigo":
        this.ordenCodigo = !this.ordenCodigo;
        this.explosionInsumosReset.sort((z, x) => this.ordenCodigo? z.codigo.localeCompare(x.codigo) : x.codigo.localeCompare(z.codigo));
        break;
      case "descripcion":
        this.ordenDescripcion = !this.ordenDescripcion;
        this.explosionInsumosReset.sort((z, x) => this.ordenDescripcion? z.descripcion.localeCompare(x.descripcion) : x.descripcion.localeCompare(z.descripcion));
        break;
      case "unidad":
        this.ordenUnidad = !this.ordenUnidad;
        this.explosionInsumosReset.sort((z, x) => this.ordenUnidad? z.unidad.localeCompare(x.unidad) : x.unidad.localeCompare(z.unidad));
        break;
      case "cantidad":
        this.ordenCantidad = !this.ordenCantidad;
        this.explosionInsumosReset.sort((z, x) => this.ordenCantidad? z.cantidad - x.cantidad : x.cantidad - z.cantidad);
        break;
      case "costob":
        this.ordenCostoB = !this.ordenCostoB;
        this.explosionInsumosReset.sort((z, x) => this.ordenCostoB? z.costoBase - x.costoBase : x.costoBase - z.costoBase);
        break;
      case "costou":
        this.ordenCostoU = !this.ordenCostoU;
        this.explosionInsumosReset.sort((z, x) => this.ordenCostoU? z.costoUnitario - x.costoUnitario : x.costoUnitario - z.costoUnitario);
        break;
      case "importe":
        this.ordenImporte = !this.ordenImporte;
        this.explosionInsumosReset.sort((z, x) => this.ordenImporte? z.importe - x.importe : x.importe - z.importe);
        break;
    }
    this.filtrarExplosion(this.idTipoInsumoSelectedParaFiltroDeExplosion);
  }
}
