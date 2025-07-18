import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import { centroCostosDTO, centroCostosCreacionDTO } from '../tsCentro-Costos';
import { PageEvent } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { centroCostosService } from '../centro-costos.service';
import { SeguridadService } from 'src/app/seguridad/seguridad.service';

@Component({
  selector: 'app-centro-costos',
  templateUrl: './centro-costos.component.html',
  styleUrls: ['./centro-costos.component.css']
})
export class CentroCostosComponent {

  form!:FormGroup;
  centroCostos: centroCostosDTO[] = [];
  centrosdeCostos! : centroCostosDTO [];
  centroCostosRest! : centroCostosDTO [];
  cantidadTotalRegistros: any;
  paginaActual = 1;
  cantidadRegistrosAMostrar = 5;
  selectedEmpresa = 0;
  idEditaCentroCostos: number = 0;
  dropdown = true;
  panelActivado: boolean = false;
  nombrecentroCostos: string = "";
  centrocosto: centroCostosDTO = {
    id: 0,
    nombre: '',
    estatus: 0,
    codigo: '',
    fecha_alta: new Date(),
    fecha_baja: null
  }
  centroCostoEdicion: centroCostosDTO = {
    id: 0,
    nombre: '',
    estatus: 0,
    codigo: '',
    fecha_alta: new Date(),
    fecha_baja: null
  }
  
  constructor(private formBuilder: FormBuilder
    , private centroCostosService: centroCostosService
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
      , estatus:['', {validators: [],},]
    });
    this.cargarRegistros(this.paginaActual, this.cantidadRegistrosAMostrar);
  }

  cargarRegistros(pagina: number, cantidadElementosAMostrar: any){
    this.centroCostosService
    .obtenerPaginado()
    .subscribe((centrocosto) =>{
      this.centrosdeCostos = centrocosto;
    })
  }

  actualizarPaginacion(datos: PageEvent){
    this.paginaActual = datos.pageIndex + 1;
    this.cantidadRegistrosAMostrar = datos.pageSize;
    this.cargarRegistros(this.paginaActual, this.cantidadRegistrosAMostrar);
  }
  

  editar(element: centroCostosDTO){
    this.centroCostosService.editar(element, this.selectedEmpresa)
    .subscribe(() =>{
      
    })
  }

  guardar(){
    this.centroCostoEdicion = this.form.value;
    this.centroCostoEdicion.estatus = 1;
    this.centroCostoEdicion.id = 0;
    if (typeof this.centroCostoEdicion.nombre === 'undefined') {
      this._snackBar.open("Capture todos los campos", "X", {duration: 3000});
      return;
    }
    this.centroCostosService.crear(this.centroCostoEdicion, this.selectedEmpresa)
    .subscribe( () => {
      this.cargarRegistros(this.paginaActual, this.cantidadRegistrosAMostrar);
      this.form.reset();
    });
  }


  prueba(centrocosto: centroCostosDTO){
    this.centroCostoEdicion = centrocosto;
  }
  
  editarCentroCosto(){
    this.centroCostosService.editar(this.centroCostoEdicion, this.selectedEmpresa)
    .subscribe(() => {
      this.cargarRegistros(this.paginaActual, this.cantidadRegistrosAMostrar)
      this.centroCostoEdicion = {
        id: 0,
        nombre: '',
        estatus: 0,
        codigo: '',
        fecha_baja: new Date(),
        fecha_alta: new Date()
      }
    })
  }
  pruebaCont() {
    this.dropdown = true;
}

  limpiarFormulario(){
    this.form.reset();
    this.idEditaCentroCostos = 0;
  }
}
