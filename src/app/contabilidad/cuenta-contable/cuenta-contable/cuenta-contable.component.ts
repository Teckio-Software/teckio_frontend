import { Component, ElementRef, OnInit, QueryList, TemplateRef, ViewChild } from '@angular/core';

import { Anio, Mes, codigoAgrupadorDTO, cuentaContableCreacionDTO, cuentaContableDTO, cuentaContableHijoDTO } from '../tsCuentaContable';
import { CuentaContableService } from '../cuenta-contable.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTreeNestedDataSource } from '@angular/material/tree';
import { NestedTreeControl } from '@angular/cdk/tree';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { RubroService } from '../../rubro/rubro.service';
import { rubroDTO } from '../../rubro/tsRubro';
import { CodigoAgrupadorService } from '../codigo-agrupador.service';
import { SeguridadService } from 'src/app/seguridad/seguridad.service';
import { AddCuentaContableComponent } from './accions/add-cuenta-contable/add-cuenta-contable.component';
import { ro } from 'date-fns/locale';
import { faL, faSearch } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-cuenta-contable',
  templateUrl: './cuenta-contable.component.html',
  styleUrls: ['./cuenta-contable.component.css']
})
export class CuentaContableComponent implements OnInit {
  form!: FormGroup;
  selectedEmpresa: number = 0;
  codigos!: codigoAgrupadorDTO[];
  selectedTipoMoneda = 1;
  today = new Date();
  selectedMes = this.today.getMonth();
  selectedYear = this.today.getFullYear();
  NCuentas: any;
  position!: number;
  ideditaCuentaContable: number = 0;
  rubros!: rubroDTO[];
  cuentasContables!: cuentaContableDTO[]
  meses: Mes[] = [
    { id: 0, mes: 'enero' }
    , { id: 1, mes: 'febrero' }
    , { id: 2, mes: 'marzo' }
    , { id: 3, mes: 'abril' }
    , { id: 4, mes: 'mayo' }
    , { id: 5, mes: 'junio' }
    , { id: 6, mes: 'julio' }
    , { id: 7, mes: 'agosto' }
    , { id: 8, mes: 'septiembre' }
    , { id: 9, mes: 'octubre' }
    , { id: 10, mes: 'noviembre' }
    , { id: 11, mes: 'diciembre' }

  ];

  anios: Anio[] = [
    { id: 2023, anio: '2023' }
    , { id: 2024, anio: '2024' }
    , { id: 2025, anio: '2025' }
    , { id: 2026, anio: '2026' }
    , { id: 2027, anio: '2027' }
    , { id: 2028, anio: '2028' }
    , { id: 2029, anio: '2029' }
    , { id: 2030, anio: '2030' }
    , { id: 2031, anio: '2031' }
    , { id: 2032, anio: '2032' }
    , { id: 2033, anio: '2033' }
    , { id: 2034, anio: '2034' }

  ];

  TREE_DATA: cuentaContableDTO[] = [];
  treeControl = new NestedTreeControl<cuentaContableDTO>((node) => node.hijos);
  dataSource = new MatTreeNestedDataSource<cuentaContableDTO>();
  NuevoRegistro: cuentaContableDTO[] = [];
  cuentaContable: cuentaContableDTO[] = [];

  constructor(private cuentaContableService: CuentaContableService
    , private rubroService: RubroService
    , private codigoAgrupadorService: CodigoAgrupadorService
    , private _snackBar: MatSnackBar
    , private formBuilder: FormBuilder
    , private dialog: MatDialog
    , private _SeguridadEmpresa: SeguridadService
  ) {
    this.form = this.formBuilder.group({
      codigo: ['', { validators: [], },]
      , descripcion: ['', { validators: [], },]
      , idRubro: new FormControl()
      , tipoMoneda: [1, { validators: [], },]
      // , saldoInicial: ['', {validators: [],},]
      // , saldoFinal: ['', {validators: [],},]
      // , presupuesto: ['', {validators: [],},]
      , idCodigoAgrupadorSat: new FormControl()
    });
    let idEmpresa = _SeguridadEmpresa.obtenIdEmpresaLocalStorage();
    this.selectedEmpresa = Number(idEmpresa);
  }

  nuevaCuentaContable: cuentaContableHijoDTO = {
    id: 0,
    codigo: "",
    descripcion: "",
    idRubro: 0,
    descripcionRubro: "",
    tipoMoneda: 0,
    saldoInicial: 0,
    saldoFinal: 0,
    presupuesto: 0,
    idCodigoAgrupadorSat: 0,
    descripcionCodigoAgrupadorSat: "",
    idPadre: 0,
    nivel: 0,
    hijos: [],
    expandido: false,
    existeMovimiento: false,
    existePoliza: false
  }

  nuevaCuentaContableReset: cuentaContableHijoDTO = {
    id: 0,
    codigo: "",
    descripcion: "",
    idRubro: 0,
    descripcionRubro: "",
    tipoMoneda: 0,
    saldoInicial: 0,
    saldoFinal: 0,
    presupuesto: 0,
    idCodigoAgrupadorSat: 0,
    descripcionCodigoAgrupadorSat: "",
    idPadre: 0,
    nivel: 0,
    hijos: [],
    expandido: false,
    existeMovimiento: false,
    existePoliza: false
  }

  creaCuentaContable: cuentaContableCreacionDTO = {
    codigo: "",
    descripcion: "",
    idRubro: 0,
    tipoMoneda: 0,
    saldoInicial: 0,
    saldoFinal: 0,
    presupuesto: 0,
    idCodigoAgrupadorSat: 0,
    idPadre: 0,
    nivel: 0,
    hijos: [],
    esCuentaContableEmpresa: false,
    tipoCuentaContable: 0
  }

  editaCuentaContable: cuentaContableDTO = {
    id: 0,
    codigo: '',
    descripcion: '',
    idRubro: 0,
    descripcionRubro: '',
    tipoMoneda: 0,
    saldoInicial: 0,
    saldoFinal: 0,
    presupuesto: 0,
    idCodigoAgrupadorSat: 0,
    descripcionCodigoAgrupadorSat: '',
    idPadre: 0,
    nivel: 0,
    hijos: [],
    expandido: false,
    existeMovimiento: false,
    existePoliza: false,
    seleccionado: false,
    tipoCuentaContableDescripcion: '',
    esCuentaContableEmpresa: false,
    tipoCuentaContable: 0
  }

  @ViewChild('secondDialog', { static: true })
  secondDialog!: TemplateRef<any>;
  openDialogWithTemplateRef(templateRef: TemplateRef<any>) {

    this.dialog.open(templateRef);
  }

  columnasAMostrar = ['more', 'codigo', 'descripcion', 'descripcionRubro', 'tipoMoneda', 'saldoInicial', 'saldoFinal', 'presupuesto', 'descripcionCodigoAgrupador'];

  ngOnInit(): void {
    this.cargarRegistros();
    this.cargarRubros();
    this.codigoAgrupadorService.obtenerTodosSinPaginar(this.selectedEmpresa)
      .subscribe((codigos) => {
        this.codigos = codigos;
      })
  }

  validarCodigo(codigo: string) {
    if (!Number(codigo)) {
      this._snackBar.open("Solo puede capturar números", "X", { duration: 3000 });
    }
  }

  tieneHijo = (_: number, node: cuentaContableDTO) => {
    !!node.hijos && node.hijos.length > 0;
  }

  cargarRegistros() {
    this.cuentaContableService
      .obtenerTodosSinPaginar(this.selectedEmpresa)
      .subscribe((cuentasContables) => {
        this.TREE_DATA = cuentasContables || [];
        this.cuentasContables = cuentasContables;
        this.dataSource.data = this.TREE_DATA;
      })
  }

  cargarRubros() {
    this.rubroService
      .obtenerTodos(this.selectedEmpresa)
      .subscribe((respuesta) => {
        this.rubros = respuesta;
      });
  }



  // hasChild = (_:number, node: cuentaContableDTO) =>
  //   !!node.listaHijosCuentasContables && node.listaHijosCuentasContables.length > 0;

  crearCuentaContable(cuentaContable: cuentaContableDTO) {
    this.creaCuentaContable.idPadre = cuentaContable.id;
    this.creaCuentaContable.codigo = cuentaContable.codigo;
    this.creaCuentaContable.descripcion = cuentaContable.descripcion;
    this.creaCuentaContable.idRubro = cuentaContable.idRubro;
    this.creaCuentaContable.tipoMoneda = cuentaContable.tipoMoneda;
    this.creaCuentaContable.saldoInicial = cuentaContable.saldoInicial;
    this.creaCuentaContable.saldoFinal = cuentaContable.saldoFinal;
    this.creaCuentaContable.presupuesto = cuentaContable.presupuesto;
    this.creaCuentaContable.idCodigoAgrupadorSat = cuentaContable.idCodigoAgrupadorSat;
    this.creaCuentaContable.nivel = cuentaContable.nivel + 1;
    this.creaCuentaContable.esCuentaContableEmpresa = cuentaContable.esCuentaContableEmpresa;

    this.cuentaContableService.crear(this.creaCuentaContable, this.selectedEmpresa)
      .subscribe((cuentaContableNueva: cuentaContableDTO) => {
        cuentaContableNueva.descripcionCodigoAgrupadorSat = cuentaContable.descripcionCodigoAgrupadorSat;
        cuentaContableNueva.descripcionRubro = cuentaContable.descripcionRubro;
        cuentaContableNueva.hijos = [];
        cuentaContable.hijos.push(cuentaContableNueva);
      })
    cuentaContable.expandido = true;
  }

  addCuentaContable(node: cuentaContableDTO) {
    if (typeof node.hijos! === 'undefined' || !node.hijos) {
      node.hijos = [];
    }
  }

  creaNuevaCuentaContable() {
    this.creaCuentaContable = this.form.value;
    if (typeof this.creaCuentaContable.hijos === 'undefined') {
      this.creaCuentaContable.hijos = [];
    }
    if (typeof this.creaCuentaContable.codigo === 'undefined' || !this.creaCuentaContable.codigo || this.creaCuentaContable.codigo === "" ||
      typeof this.creaCuentaContable.descripcion === 'undefined' || !this.creaCuentaContable.descripcion || this.creaCuentaContable.descripcion === "" ||
      typeof this.creaCuentaContable.idCodigoAgrupadorSat === 'undefined' || !this.creaCuentaContable.idCodigoAgrupadorSat || this.creaCuentaContable.idCodigoAgrupadorSat <= 0 ||
      typeof this.creaCuentaContable.idRubro === 'undefined' || !this.creaCuentaContable.idRubro || this.creaCuentaContable.idRubro <= 0 ||
      typeof this.creaCuentaContable.tipoMoneda === 'undefined' || !this.creaCuentaContable.tipoMoneda || this.creaCuentaContable.tipoMoneda <= 0
    ) {
      this._snackBar.open("Capture todos los campos", "X", { duration: 3000 });
      return;
    }
    if (!Number(this.creaCuentaContable.codigo)) {
      this._snackBar.open("Solo puede capturar números en el campo código", "X", { duration: 3000 });
      return;
    }
    this.creaCuentaContable.idPadre = 0;
    this.creaCuentaContable.nivel = 1;
    this.creaCuentaContable.codigo = this.creaCuentaContable.codigo;
    this.creaCuentaContable.descripcion = this.creaCuentaContable.descripcion;
    this.creaCuentaContable.idCodigoAgrupadorSat = this.creaCuentaContable.idCodigoAgrupadorSat;
    this.creaCuentaContable.idRubro = this.creaCuentaContable.idRubro;
    this.creaCuentaContable.presupuesto = 0;
    this.creaCuentaContable.saldoInicial = 0;
    this.creaCuentaContable.saldoFinal = 0;
    this.creaCuentaContable.tipoMoneda = this.creaCuentaContable.tipoMoneda;
    this.cuentaContableService.crear(this.creaCuentaContable, this.selectedEmpresa)
      .subscribe(() => {
        this.cargarRegistros();
      });
    this.form = this.formBuilder.group({
      codigo: ['', { validators: [], },]
      , descripcion: ['', { validators: [], },]
      , idRubro: new FormControl()
      , tipoMoneda: [1, { validators: [], },]
      , idCodigoAgrupadorSat: new FormControl()
    });
  }

  limpiarFormulario() {
    this.form = this.formBuilder.group({
      codigo: ['', { validators: [], },]
      , descripcion: ['', { validators: [], },]
      , idRubro: new FormControl()
      , tipoMoneda: [1, { validators: [], },]
      , idCodigoAgrupadorSat: new FormControl()
    });
  }

  openDialogWithoutRef() {
    this.dialog.open(this.secondDialog, {
      disableClose: true
    });
  }

  onKeyUp(row: cuentaContableDTO) {
    this.editaCuentaContable.id = row.id;
    this.editaCuentaContable.codigo = row.codigo;
    this.editaCuentaContable.descripcion = row.descripcion;
    this.editaCuentaContable.idRubro = row.idRubro;
    this.editaCuentaContable.descripcionRubro = row.descripcionRubro;
    this.editaCuentaContable.tipoMoneda = row.tipoMoneda;
    this.editaCuentaContable.saldoInicial = row.saldoInicial;
    this.editaCuentaContable.saldoFinal = row.saldoFinal;
    this.editaCuentaContable.presupuesto = row.presupuesto;
    this.editaCuentaContable.idCodigoAgrupadorSat = row.idCodigoAgrupadorSat;
    this.editaCuentaContable.descripcionCodigoAgrupadorSat = row.descripcionCodigoAgrupadorSat;
    this.editaCuentaContable.idPadre = row.idPadre;
    this.editaCuentaContable.nivel = row.nivel;
    this.editaCuentaContable.esCuentaContableEmpresa = row.esCuentaContableEmpresa;
    this.editaCuentaContable.tipoCuentaContable = this.editaCuentaContable.esCuentaContableEmpresa == false ? 0 : row.tipoCuentaContable;

    this.cuentaContableService.editar(this.editaCuentaContable, this.selectedEmpresa)
      .subscribe(() => {
        this.inputDescripcion.nativeElement.focus();
        this.inputDescripcion.nativeElement.blur();
        this.cargarRegistros();
      });
  }

  @ViewChild('inputDescripcion') inputDescripcion!: ElementRef;

  public expansionDominio(cuentaContable: cuentaContableDTO): void {
    cuentaContable.expandido = !cuentaContable.expandido;
  }

  openDialogAddCuentaContable() {
    const dialogRef = this.dialog.open(AddCuentaContableComponent, {
      data: {}
    });
    dialogRef.afterClosed().subscribe((result) => {
      console.log(result);
      this.cuentaContableService.crear(result, this.selectedEmpresa)
        .subscribe(() => {
          this.cargarRegistros();
        })
    });
  }

  seleccionTipoCuenta(event: any, row: cuentaContableDTO) {
    const cuentaTipo = Number(event.target.value);

    this.editaCuentaContable.id = row.id;
    this.editaCuentaContable.codigo = row.codigo;
    this.editaCuentaContable.descripcion = row.descripcion;
    this.editaCuentaContable.idRubro = row.idRubro;
    this.editaCuentaContable.descripcionRubro = row.descripcionRubro;
    this.editaCuentaContable.tipoMoneda = row.tipoMoneda;
    this.editaCuentaContable.saldoInicial = row.saldoInicial;
    this.editaCuentaContable.saldoFinal = row.saldoFinal;
    this.editaCuentaContable.presupuesto = row.presupuesto;
    this.editaCuentaContable.idCodigoAgrupadorSat = row.idCodigoAgrupadorSat;
    this.editaCuentaContable.descripcionCodigoAgrupadorSat = row.descripcionCodigoAgrupadorSat;
    this.editaCuentaContable.idPadre = row.idPadre;
    this.editaCuentaContable.nivel = row.nivel;
    this.editaCuentaContable.esCuentaContableEmpresa = row.esCuentaContableEmpresa;
    this.editaCuentaContable.tipoCuentaContable = this.editaCuentaContable.esCuentaContableEmpresa == false ? 0 : cuentaTipo;

    this.cuentaContableService.editar(this.editaCuentaContable, this.selectedEmpresa)
      .subscribe(() => {
        this.inputDescripcion.nativeElement.focus();
        this.inputDescripcion.nativeElement.blur();
        this.cargarRegistros();
      });
  }
}
