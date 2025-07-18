import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { claveProdDTO,ClaveProdSATDTO , claveProdCreacionDTO } from '../tsClaveProd';
import { PageEvent } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { claveProdService } from '../claveProd.service';
import { claveProdSATService } from '../claveProdSAT.service';
import { SeguridadService } from 'src/app/seguridad/seguridad.service';
import { division1, divisionDTO } from '../../division/tsDivision';
import { divisionService } from '../../division/division.service';
import { cuentaContableGastosDTO } from '../../cuenta-contable/tsCuentaContableGastos';
import { cuentaContableGastosService } from '../../cuenta-contable/cuentaContableGastos.service';

@Component({
  selector: 'app-clave-producto',
  templateUrl: './clave-producto.component.html',
  styleUrls: ['./clave-producto.component.css']
})
export class ClaveProductoComponent {
  form!:FormGroup;
  plazas: claveProdDTO[] = [];
  clavesProdDivsion! : claveProdDTO [];
  clavesProdDivisionReset! : claveProdDTO [];
  clavesProdSAT! : ClaveProdSATDTO [];
  clavesProdSATReset! : ClaveProdSATDTO [];
  divisiones!: divisionDTO [];
  divisionesRest! : divisionDTO [];
  cuentasContables!: cuentaContableGastosDTO [];
  cuentasContablesReset!: cuentaContableGastosDTO [];
  cantidadTotalRegistros: any;
  paginaActual = 1;
  nombreDivision: string = '';
  nombreClave: string = '';
  claveProdSAT: string = '';
  nombreCuenta: string = '';
  permitir: boolean = false;
  cantidadRegistrosAMostrar = 5;
  selectedEmpresa = 0;
  idEditaclaveProd: number = 0;
  dropdown = true;
  panelActivado: boolean = false;

  claveProd: claveProdDTO = {
    id: 0,
    idClaveProd: 0,
    permitido: false,
    idDivision: 0,
    idCuentaContable: 0,
    nombreClave: '',
    claveProd: '',
    nombreDivision: '',
    nombreCuentaContable: ''
  }
  claveProdEdicion: claveProdDTO = {
    id: 0,
    idClaveProd: 0,
    permitido: false,
    idDivision: 0,
    idCuentaContable: 0,
    nombreClave: '',
    claveProd: '',
    nombreDivision: '',
    nombreCuentaContable: ''
  }
  selectedDivision = 0;
  selectedCuenta = 0;
  selectedClave = 0;
  
  constructor(private formBuilder: FormBuilder
    , private claveProdService: claveProdService
    , private claveProdSATService: claveProdSATService
    , private divisionService: divisionService
    , private cuentaContableService: cuentaContableGastosService
    , private _snackBar: MatSnackBar
    , private _SeguridadEmpresa: SeguridadService
    ) {
        let idEmpresa = _SeguridadEmpresa.obtenIdEmpresaLocalStorage();
        this.selectedEmpresa = Number(idEmpresa);
    }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      id: ['', {validators: [],},]
      , idClaveProd:['', {validators: [],},]
      , idDivision:['', {validators: [],},]
      , idCuentaContable:['', {validators: [],},]
      , permitido:['', {validators: [],},]
      , nombreClave:['', {validators: [],},]
      , nombreDivision:['', {validators: [],},]
      , nombreCuentaContable:['', {validators: [],},]
    });
    this.cargarRegistros();
  }

  cargarRegistros(){
    this.claveProdService
    .obtenerPaginado(this.paginaActual, this.cantidadRegistrosAMostrar, this.selectedEmpresa)
    .subscribe((claveProd) =>{
      this.clavesProdDivsion = claveProd;
      this.clavesProdDivisionReset = claveProd;
    })
    
    this.claveProdSATService
    .obtenerTodosSinPaginar(this.selectedEmpresa)
    .subscribe((claveSAT) =>{
      this.clavesProdSAT = claveSAT;
      this.clavesProdSATReset = claveSAT;
    })
    
    this.cuentaContableService.obtenerTodosSinPaginar(this.selectedEmpresa)
    .subscribe((cuentasContables) => {
      this.cuentasContables = cuentasContables;
      this.cuentasContablesReset = cuentasContables;
    })

    this.divisionService.obtenerPaginado()
            .subscribe((division) => {
                this.divisiones = division;
                this.divisionesRest = this.divisiones;
            });
  }

  actualizarPaginacion(datos: PageEvent){
    this.paginaActual = datos.pageIndex + 1;
    this.cantidadRegistrosAMostrar = datos.pageSize;
    this.cargarRegistros();
  }
  
  guardar(){
    this.claveProdEdicion= this.form.value;
    this.claveProdEdicion.id = 0;
    this.claveProdEdicion.idClaveProd = this.selectedClave;
    this.claveProdEdicion.claveProd = this.claveProdSAT;
    this.claveProdEdicion.idCuentaContable = this.selectedCuenta;
    this.claveProdEdicion.idDivision = this.selectedDivision;
    this.claveProdEdicion.nombreClave = this.nombreClave;
    this.claveProdEdicion.nombreCuentaContable = this.nombreCuenta;
    this.claveProdEdicion.nombreDivision = this.nombreDivision;    
    if (typeof this.claveProdEdicion.idClaveProd === 'undefined') {
      this._snackBar.open("Capture todos los campos", "X", {duration: 3000});
      return;
    }
    this.claveProdService.crearRelacion(this.claveProdEdicion, this.selectedEmpresa)
    .subscribe( () => {
      this.cargarRegistros();
      this.form.reset();
    });
  }


  prueba(centrocosto: claveProdDTO){
    this.claveProdEdicion = centrocosto;
    
  }

  pruebaCont() {
    this.dropdown = true;
  }

  aplicarFiltroTabla(event: Event) {
    this.clavesProdDivsion = this.clavesProdDivisionReset;
    const filterValue = (event.target as HTMLInputElement).value;
    this.clavesProdDivsion = this.clavesProdDivsion.filter((clave) => clave.nombreDivision.toLocaleLowerCase().includes(filterValue));
  }


  filtrarDivision(event: Event) {
    this.divisiones = this.divisionesRest;
    const filterValue = (event.target as HTMLInputElement).value.toLocaleLowerCase();
    this.divisiones = this.divisiones.filter((division) => division.nombre.toLocaleLowerCase().includes(filterValue));
  }

  filtrarCuenta(event: Event) {
    this.cuentasContables = this.cuentasContablesReset;
    const filterValue = (event.target as HTMLInputElement).value.toLocaleLowerCase();
    this.cuentasContables = this.cuentasContables.filter((cuenta) => cuenta.nombre.toLocaleLowerCase().includes(filterValue));
  }
  filtrarClave(event: Event) {
    this.clavesProdSAT = this.clavesProdSATReset;
    const filterValue = (event.target as HTMLInputElement).value.toLocaleLowerCase();
    this.clavesProdSAT = this.clavesProdSAT.filter((claves) => claves.nombre.toLocaleLowerCase().includes(filterValue));
}

cambiarDivision(division: divisionDTO) {
  this.selectedDivision = division.id;
  this.nombreDivision = division.nombre;
  this.cargarRegistros();
}
cambiarCuenta(cuenta: cuentaContableGastosDTO) {
  this.selectedCuenta = cuenta.id;
  this.nombreCuenta = cuenta.nombre;
  this.cargarRegistros();
}
cambiarClave(clave: ClaveProdSATDTO) {
  this.selectedClave = clave.id;
  this.nombreClave = clave.nombre;
  this.cargarRegistros();
}

  limpiarFormulario(){
    this.form.reset();
    this.idEditaclaveProd = 0;
  }
}