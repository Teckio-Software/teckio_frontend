import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { tipoPolizaDTO } from '../../tipos-polizas/tsTipoPoliza';
import { cuentaContableDTO } from '../../cuenta-contable/tsCuentaContable';
import { PolizaFolioCodigoDTO, polizaDTO } from '../tsPoliza';
import { polizaDetalleDTO } from '../../poliza-detalle/tsPolizaDetalle';
import { TipoPolizaService } from '../../tipos-polizas/tipo-poliza.service';
import { CuentaContableService } from '../../cuenta-contable/cuenta-contable.service';
import { PolizaService } from '../poliza.service';
import { PolizaDetalleService } from '../../poliza-detalle/poliza-detalle.service';
import { SeguridadService } from 'src/app/seguridad/seguridad.service';
import { EmpresaService } from 'src/app/catalogos/empresas/empresa.service';
import { EmpresaDTO } from 'src/app/catalogos/empresas/empresa';
import { MatDialog } from '@angular/material/dialog';
import { NewPolizaComponent } from './acciones/new-poliza/new-poliza.component';

@Component({
  selector: 'app-poliza',
  templateUrl: './poliza.component.html',
  styleUrls: ['./poliza.component.css'],
})
export class PolizaComponent implements OnInit {
  form!: FormGroup;
  formDetalles!: FormGroup;
  empresas!: EmpresaDTO[];
  tiposPolizas!: tipoPolizaDTO[];
  cuentasContables!: cuentaContableDTO[];
  polizas!: polizaDTO[];
  polizasDetalles: polizaDetalleDTO[] = [];
  polizasDetallesCreacion: polizaDetalleDTO[] = [];
  agregar: boolean = false;
  tieneDetalle: boolean = false;
  espacioBlanco: string = '  ';
  isOpen: boolean = false;
  isInfoOpen: boolean = false;

  constructor(
    private empresaService: EmpresaService,
    private dialog: MatDialog,
    private tipoPolizaService: TipoPolizaService,
    private cuentaContableService: CuentaContableService,
    private polizaService: PolizaService,
    private polizaDetalleService: PolizaDetalleService,
    private _snackBar: MatSnackBar,
    private formBuilder: FormBuilder,
    private _SeguridadEmpresa: SeguridadService
  ) {
    let idEmpresa = _SeguridadEmpresa.obtenIdEmpresaLocalStorage();
    this.selectedEmpresa = Number(idEmpresa);
  }

  selectedEmpresa: number = 0;
  selectedPoliza: number = 0;
  folio: string = '';
  numeroPoliza: string = '';
  fechaAlta: string = new Date().toLocaleDateString('en-GB');
  totalHaberCreacion: number = 0;
  totalDebeCreacion: number = 0;
  totalHaber: number = 0;
  totalDebe: number = 0;
  folioYNumeroPoliza: PolizaFolioCodigoDTO = {
    folio: '',
    numeroPoliza: '',
  };

  polizaSeleccionada!: polizaDTO;

  polizaCreacion: polizaDTO = {
    id: 0,
    idTipoPoliza: 0,
    folio: '',
    numeroPoliza: '',
    fechaAlta: new Date(),
    fechaPoliza: new Date(),
    concepto: '',
    estatus: 0,
    observaciones: '',
    origenDePoliza: 0,
    esPolizaCierre: false,
    detalles: [],
  };

  polizaCreacionReset: polizaDTO = {
    id: 0,
    idTipoPoliza: 0,
    folio: '',
    numeroPoliza: '',
    fechaAlta: new Date(),
    fechaPoliza: new Date(),
    concepto: '',
    estatus: 0,
    observaciones: '',
    origenDePoliza: 0,
    esPolizaCierre: false,
    detalles: [],
  };

  polizaObtencionFolio: polizaDTO = {
    id: 0,
    idTipoPoliza: 0,
    folio: '',
    numeroPoliza: '',
    fechaAlta: new Date(),
    fechaPoliza: new Date(),
    concepto: '',
    estatus: 0,
    observaciones: '',
    origenDePoliza: 0,
    esPolizaCierre: false,
    detalles: [],
  };

  polizaDetalleCreacion: polizaDetalleDTO = {
    id: 0,
    idPoliza: 0,
    idCuentaContable: 0,
    concepto: '',
    debe: 0,
    haber: 0,
    cuentaContableCodigo: '',
  };

  polizaDetalleResetCreacion: polizaDetalleDTO = {
    id: 0,
    idPoliza: 0,
    idCuentaContable: 0,
    concepto: '',
    debe: 0,
    haber: 0,
    cuentaContableCodigo: '',
  };

  // Nueva propiedad para almacenar los datos de la base de datos para el autocompletado
  datosBaseDeDatos: string[] = [
    'Registro1',
    'Registro2',
    'Registro3' /* ... */,
  ];

  isLoading: boolean = true;

  // Función para autocompletar el dropdown
  autocompleteDropdown(event: Event) {
    const inputTexto: string = (
      event.target as HTMLInputElement
    ).value.toLowerCase();
    const dropdown = document.getElementById('dropdown') as HTMLSelectElement;
    dropdown.innerHTML = '';

    const resultados = this.datosBaseDeDatos.filter((registro) =>
      registro.toLowerCase().includes(inputTexto)
    );

    resultados.forEach((resultado) => {
      const option = document.createElement('option');
      option.value = resultado;
      dropdown.appendChild(option);
    });
  }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      id: [0, { validators: [] }],
      idTipoPoliza: ['', { validators: [] }],
      folio: [this.folio, { validators: [] }],
      numeroPoliza: [this.numeroPoliza, { validators: [] }],
      fechaAlta: [this.fechaAlta, { validators: [] }],
      fechaPoliza: ['', { validators: [] }],
      concepto: ['', { validators: [] }],
      estatus: ['', { validators: [] }],
      observaciones: ['', { validators: [] }],
      origenDePoliza: ['', { validators: [] }],
      esPolizaCierre: ['', { validators: [] }],
    });
    this.form.controls['folio'].disable();
    this.form.controls['numeroPoliza'].disable();
    this.form.controls['fechaAlta'].disable();
    this.tipoPolizaService
      .obtenerTodosSinPaginar(this.selectedEmpresa)

      .subscribe((tiposPolizas) => {
        this.tiposPolizas = tiposPolizas;
      });
    this.cargarPolizas();

    this.cuentaContableService
      .obtenerAsignables(this.selectedEmpresa)
      .subscribe((cuentasContables) => {
        this.cuentasContables = cuentasContables;
      });
    this.polizasDetallesCreacion.push({
      id: 0,
      idPoliza: 0,
      idCuentaContable: 0,
      concepto: '',
      debe: 0,
      haber: 0,
      cuentaContableCodigo: '',
    });
  }

  cargarRegistros() {
    this.polizaService
      .obtenerTodosXEmpresa(this.selectedEmpresa)
      .subscribe((polizas) => {
        this.polizas = polizas;
      });
  }

  cargarRegistrosDetalles(idSelectedPoliza: number) {
    console.log('UwU');
    this.selectedPoliza = idSelectedPoliza;
    this.polizaDetalleService
      .obtenerDetallesPoliza(this.selectedPoliza, this.selectedEmpresa)
      .subscribe((detalles) => {
        this.polizasDetalles = detalles;
        this.tieneDetalle = true;
        this.totalDebe = 0;
        this.totalHaber = 0;
        this.polizasDetalles.forEach((detalle) => {
          this.totalDebe = Number(this.totalDebe) + Number(detalle.debe);
          this.totalHaber = Number(this.totalHaber) + Number(detalle.haber);
        });
      });
  }

  agregarDetalle(polizaDetalle: polizaDetalleDTO) {
    if (
      typeof polizaDetalle.concepto === 'undefined' ||
      !polizaDetalle.concepto ||
      polizaDetalle.concepto === '' ||
      (polizaDetalle.debe != 0 && polizaDetalle.haber != 0) ||
      (polizaDetalle.debe <= 0 && polizaDetalle.haber <= 0) ||
      typeof polizaDetalle.idCuentaContable === 'undefined' ||
      !polizaDetalle.idCuentaContable ||
      polizaDetalle.idCuentaContable < 0
    ) {
      this._snackBar.open('Capture correctamente los datos', 'X', {
        duration: 3000,
      });
      return;
    }
    if (
      (this.polizasDetallesCreacion[this.polizasDetallesCreacion.length - 1]
        .concepto === '' &&
        this.polizasDetallesCreacion[this.polizasDetallesCreacion.length - 1]
          .idCuentaContable === 0) ||
      (this.polizasDetallesCreacion[this.polizasDetallesCreacion.length - 1]
        .debe <= 0 &&
        this.polizasDetallesCreacion[this.polizasDetallesCreacion.length - 1]
          .haber <= 0) ||
      (this.polizasDetallesCreacion[this.polizasDetallesCreacion.length - 1]
        .debe != 0 &&
        this.polizasDetallesCreacion[this.polizasDetallesCreacion.length - 1]
          .haber != 0)
    ) {
      return;
    } else {
      this.polizasDetallesCreacion.push({
        id: 0,
        idPoliza: 0,
        idCuentaContable: 0,
        concepto: '',
        debe: 0,
        haber: 0,
        cuentaContableCodigo: '',
      });
    }
    this.totalDebeCreacion = 0;
    this.totalHaberCreacion = 0;
    this.polizasDetallesCreacion.forEach((detalle) => {
      this.totalDebeCreacion =
        Number(this.totalDebeCreacion) + Number(detalle.debe);
      this.totalHaberCreacion =
        Number(this.totalHaberCreacion) + Number(detalle.haber);
    });
  }

  obtenerFolio() {
    this.polizaObtencionFolio.fechaPoliza = this.form.value['fechaPoliza'];
    this.polizaObtencionFolio.idTipoPoliza = this.form.value['idTipoPoliza'];
    if (
      typeof this.polizaObtencionFolio.fechaPoliza === 'undefined' ||
      !this.polizaObtencionFolio.fechaPoliza ||
      this.polizaObtencionFolio.fechaPoliza.toString() === '' ||
      typeof this.polizaObtencionFolio.idTipoPoliza === 'undefined' ||
      !this.polizaObtencionFolio.idTipoPoliza ||
      this.polizaObtencionFolio.idTipoPoliza < 0
    ) {
      return;
    }
    this.polizaService
      .obtenerFolioNumeroPoliza(this.polizaObtencionFolio, this.selectedEmpresa)
      .subscribe((folioYNumeroPoliza) => {
        this.folioYNumeroPoliza = folioYNumeroPoliza;
        this.folio = this.folioYNumeroPoliza.folio;
        this.numeroPoliza = this.folioYNumeroPoliza.numeroPoliza;
        this.form.controls['folio'].patchValue(this.folio);
        this.form.controls['numeroPoliza'].patchValue(this.numeroPoliza);
      });
  }

  guardar() {
    this.form.controls['numeroPoliza'].enable();
    this.form.controls['fechaAlta'].enable();
    this.form.controls['folio'].enable();
    this.polizaCreacion = this.form.value;
    this.polizaCreacion.fechaAlta = new Date();
    this.form.controls['numeroPoliza'].disable();
    this.form.controls['fechaAlta'].disable();
    this.form.controls['folio'].disable();
    this.polizaCreacion.estatus = 1;
    this.polizaCreacion.origenDePoliza = 1;
    this.polizaCreacion.esPolizaCierre = false;
    this.polizaCreacion.detalles = this.polizasDetallesCreacion;
    if (
      typeof this.polizaCreacion.folio === 'undefined' ||
      !this.polizaCreacion.folio ||
      this.polizaCreacion.folio === '' ||
      typeof this.polizaCreacion.numeroPoliza === 'undefined' ||
      !this.polizaCreacion.numeroPoliza ||
      this.polizaCreacion.numeroPoliza === '' ||
      typeof this.polizaCreacion.fechaAlta === 'undefined' ||
      !this.polizaCreacion.fechaAlta ||
      typeof this.polizaCreacion.fechaPoliza === 'undefined' ||
      !this.polizaCreacion.fechaPoliza ||
      typeof this.polizaCreacion.concepto === 'undefined' ||
      !this.polizaCreacion.concepto ||
      this.polizaCreacion.concepto === '' ||
      typeof this.polizaCreacion.estatus === 'undefined' ||
      !this.polizaCreacion.estatus ||
      this.polizaCreacion.estatus <= 0 ||
      typeof this.polizaCreacion.origenDePoliza === 'undefined' ||
      !this.polizaCreacion.origenDePoliza ||
      this.polizaCreacion.origenDePoliza <= 0
    ) {
      this._snackBar.open('Capture todos los campos', 'X', { duration: 3000 });
      return;
    }
    if (this.totalDebeCreacion !== this.totalHaberCreacion) {
      this._snackBar.open('La póliza no cuadra', 'X', { duration: 3000 });
      return;
    }
    if (this.polizaCreacion.id > 0) {
      this.polizaService
        .editar(this.polizaCreacion, this.selectedEmpresa)
        .subscribe({
          next: () => {
            this.cargarRegistros();
            if (this.tieneDetalle) {
              this.cargarRegistrosDetalles(this.selectedPoliza);
            }
          },
          error: (zError: any) => {
            console.error(zError);
          },
        });
    } else {
      this.polizaService
        .crear(this.polizaCreacion, this.selectedEmpresa)
        .subscribe({
          next: () => {
            this.cargarRegistros();
          },
          error: (zError: any) => {
            console.error(zError);
          },
        });
    }
    this.form.reset();
    this.polizasDetallesCreacion = [];
    this.polizasDetallesCreacion.push({
      id: 0,
      idPoliza: 0,
      idCuentaContable: 0,
      concepto: '',
      debe: 0,
      haber: 0,
      cuentaContableCodigo: '',
    });
    this.polizaCreacion.fechaAlta = new Date(this.form.value['fechaAlta']);
  }

  cargarPolizas() {
    this.polizaService
      .obtenerTodosXEmpresa(this.selectedEmpresa)
      .subscribe((polizas) => {
        this.polizas = polizas;
        this.isLoading = false;
      });
  }

  reiniciaHaber(polizaDetalle: polizaDetalleDTO) {
    this.totalDebeCreacion = 0;
    this.totalHaberCreacion = 0;
    polizaDetalle.haber = 0;
    this.polizasDetallesCreacion.forEach((detalle) => {
      this.totalDebeCreacion =
        Number(this.totalDebeCreacion) + Number(detalle.debe);
      this.totalHaberCreacion =
        Number(this.totalHaberCreacion) + Number(detalle.haber);
    });
  }

  reiniciaDebe(polizaDetalle: polizaDetalleDTO) {
    this.totalDebeCreacion = 0;
    this.totalHaberCreacion = 0;
    polizaDetalle.debe = 0;
    this.polizasDetallesCreacion.forEach((detalle) => {
      this.totalDebeCreacion =
        Number(this.totalDebeCreacion) + Number(detalle.debe);
      this.totalHaberCreacion =
        Number(this.totalHaberCreacion) + Number(detalle.haber);
    });
  }

  cancelarPoliza(poliza: polizaDTO) {
    poliza.detalles = [];
    this.polizaService.cancelar(poliza, this.selectedEmpresa).subscribe({
      next: () => {
        this.cargarRegistros();
        if (this.tieneDetalle) {
          this.cargarRegistrosDetalles(this.selectedPoliza);
        }
      },
      error: (zError: any) => {
        console.error(zError);
      },
    });
  }

  editar(element: polizaDTO) {
    this.form.patchValue(element);
    this.polizaDetalleService
      .obtenerDetallesPoliza(element.id, this.selectedEmpresa)
      .subscribe((detalles) => {
        this.polizasDetallesCreacion = detalles;
        this.totalDebeCreacion = 0;
        this.totalHaberCreacion = 0;
        this.polizasDetallesCreacion.forEach((detalle) => {
          this.totalDebeCreacion =
            Number(this.totalDebeCreacion) + Number(detalle.debe);
          this.totalHaberCreacion =
            Number(this.totalHaberCreacion) + Number(detalle.haber);
        });
        // this.polizasDetallesCreacion.push({
        //     id: 0,
        //     idPoliza: 0,
        //     idCuentaContable: 0,
        //     cuentaContableCodigo: '',
        //     concepto: '',
        //     debe: 0,
        //     haber: 0
        // });
      });
  }

  oprnDialogNewPoliza() {
    const dialogRef = this.dialog.open(NewPolizaComponent, {
      data: {},
    });
    dialogRef.afterClosed().subscribe(() => {
      this.polizaService
        .obtenerTodosXEmpresa(this.selectedEmpresa)
        .subscribe((polizas) => {
          this.polizas = polizas;
        });
    });
  }

  openModal(poliza: polizaDTO) {
    console.log('Poliza Modal Component', poliza);
    console.log('Detalles de la póliza:', poliza.detalles);

    this.tieneDetalle = true;
    this.selectedPoliza = poliza.id;
    this.polizaCreacion = poliza;
    this.polizasDetalles = poliza.detalles;
    this.isOpen = true;

    this.cargarRegistrosDetalles(poliza.id);
  }

  closeModal() {
    this.isOpen = false;
  }
}
