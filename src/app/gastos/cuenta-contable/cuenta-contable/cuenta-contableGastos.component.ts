import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import { cuentaContableGastosService } from '../cuentaContableGastos.service';
import { PageEvent } from '@angular/material/paginator';
import { cuentaContableCreacionDTO, cuentaContableGastosDTO } from '../tsCuentaContableGastos';
import { HttpResponse } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SeguridadService } from 'src/app/seguridad/seguridad.service';
import { RouterEvent } from '@angular/router';

@Component({
  selector: 'app-cuenta-contable',
  templateUrl: './cuenta-contable.component.html',
  styleUrls: ['./cuenta-contableGastos.component.css']
})
export class CuentaContableGastosComponent {
  form!:FormGroup;
  cuentasContables: cuentaContableGastosDTO[] = [];
  cantidadTotalRegistros: any;
  paginaActual = 1;
  cantidadRegistrosAMostrar = 5;
  selectedEmpresa = 0;
  idEditaCuenta: number = 0;
  dropdown = true;
  panelActivado: boolean = false;
  cuentaContable: cuentaContableGastosDTO = {
    id: 0,
    nombre: '',
    codigo: '',
    monto_inicial: 0,
    esAcreedor: false,
    fecha_alta: new Date(),
    forma_pago_aceptable: 0,
    tipo_moneda: 0,
    estatus: 0
  }
  cuentaContableEdicion: cuentaContableGastosDTO = {
    id: 0,
    nombre: '',
    codigo: '',
    monto_inicial: 0,
    esAcreedor: false,
    fecha_alta: new Date(),
    forma_pago_aceptable: 0,
    tipo_moneda: 0,
    estatus: 0
  }
  
  constructor(private formBuilder: FormBuilder
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
      , nombre:['', {validators: [],},]
      , codigo:['', {validators: [],},]
      , estatus: ['', {validators: [],},]
      , monto_inicial:['', {validators: [],},]
      , esAcreedor:['', {validators: [],},]
      , forma_pago_aceptable:['', {validators: [],},]
      , tipo_moneda:['', {validators: [],},]
    });
    this.cargarRegistros(this.paginaActual, this.cantidadRegistrosAMostrar);
  }

  cargarRegistros(pagina: number, cantidadElementosAMostrar: any){
    this.cuentaContableService
    .obtenerPaginado()
    .subscribe((cuentacontable) =>{
      this.cuentasContables = cuentacontable;
    })
  }

  actualizarPaginacion(datos: PageEvent){
    this.paginaActual = datos.pageIndex + 1;
    this.cantidadRegistrosAMostrar = datos.pageSize;
    this.cargarRegistros(this.paginaActual, this.cantidadRegistrosAMostrar);
  }
  

  onSubmit(){
    this.cuentaContableEdicion = this.form.value;
    if (typeof this.cuentaContableEdicion.nombre === 'undefined') {
        this._snackBar.open("Capture todos los campos", "X", {duration: 3000});
        return;
    }
    this.cuentaContableEdicion.id = this.idEditaCuenta;
    if (this.idEditaCuenta > 0) {
      this.cuentaContableEdicion.id = this.idEditaCuenta;

      this.cuentaContableService.editar(this.cuentaContableEdicion, this.selectedEmpresa)
      .subscribe({
        next: () => this.cargarRegistros(this.paginaActual, this.cantidadRegistrosAMostrar),
        error: (zError: any) => console.error(zError),
      });
    }
    if (this.idEditaCuenta <= 0) {
      this.cuentaContableService.crear(this.cuentaContableEdicion,this.selectedEmpresa)
      .subscribe({
        next: () => this.cargarRegistros(this.paginaActual, this.cantidadRegistrosAMostrar),
        error: (zError: any) => console.error(zError),
      });
    }
    this.idEditaCuenta = 0;
    this.form.reset();
  }

  editar(element: cuentaContableGastosDTO){
    this.cuentaContableService.editar(element, this.selectedEmpresa)
    .subscribe(() =>{
      
    })
  }

  guardar(){
    this.cuentaContableEdicion = this.form.value;
    this.cuentaContableEdicion.estatus = 1;
    this.cuentaContableEdicion.id = 0;
    this.cuentaContableEdicion.fecha_alta = new Date();
    if (typeof this.cuentaContableEdicion.nombre === 'undefined') {
      this._snackBar.open("Capture todos los campos", "X", {duration: 3000});
      return;
    }
    this.cuentaContableService.crear(this.cuentaContableEdicion, this.selectedEmpresa)
    .subscribe( () => {
      this.cargarRegistros(this.paginaActual, this.cantidadRegistrosAMostrar);
      this.form.reset();
    });
  }


  // borrar(zId: number){
  //   this.plazaService.borrar(zId, this.selectedEmpresa)
  //     .subscribe({
  //       next: () => this.cargarRegistros(this.paginaActual, this.cantidadRegistrosAMostrar),
  //       error: (zError: any) => console.error(zError),
  //     });
  // }

  prueba(cuentaContable: cuentaContableGastosDTO){
    this.cuentaContableEdicion = cuentaContable;
  }
  editarCuenta(){
    this.cuentaContableService.editar(this.cuentaContableEdicion, this.selectedEmpresa)
    .subscribe(() => {
      this.cargarRegistros(this.paginaActual, this.cantidadRegistrosAMostrar)
      this.cuentaContableEdicion = {
        id: 0,
        nombre: '',
        codigo: '',
        monto_inicial: 0,
        esAcreedor: false,
        fecha_alta: new Date(),
        forma_pago_aceptable: 0,
        tipo_moneda: 0,
        estatus: 0
      }
    })
  }
//   filtrarDivision(event: Event) {
//     this.divisiones = this.divisionesRest;
//     const filterValue = (event.target as HTMLInputElement).value.toLocaleLowerCase();
//     this.divisiones = this.divisiones.filter((divsion) => divsion.nombre.toLocaleLowerCase().includes(filterValue));
// }
  pruebaCont() {
    this.dropdown = true;
}

  limpiarFormulario(){
    this.form.reset();
    this.idEditaCuenta = 0;
  }
}

