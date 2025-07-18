import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import { divisionService } from '../division.service';
import { PageEvent } from '@angular/material/paginator';
import { divisionCreacionDTO, divisionDTO } from '../tsDivision';
import { HttpResponse } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SeguridadService } from 'src/app/seguridad/seguridad.service';
import { RouterEvent } from '@angular/router';

@Component({
  selector: 'app-division',
  templateUrl: './division.component.html',
  styleUrls: ['./division.component.css']
})
export class DivisionComponent implements OnInit{

  form!:FormGroup;
  divisiones: divisionDTO[] = [];
  cantidadTotalRegistros: any;
  paginaActual = 1;
  cantidadRegistrosAMostrar = 5;
  selectedEmpresa = 0;
  idEditadivision: number = 0;
  divisionEdicion: divisionDTO = {
    id: 0,
    nombre: '',
    estatus: 0,
    codigoSAP: '',
    asignaAC: false,
    registroPatronal: ''
  }

  panelActivado: boolean = false;
  division: divisionDTO = {
    id: 0,
    nombre: '',
    estatus: 0,
    codigoSAP: '',
    asignaAC: true,
    registroPatronal: ''
    

  }
  editaDivisiones: divisionDTO = {
    id: 0,
    nombre: '',
    estatus: 0,
    codigoSAP: '',
    asignaAC: true,
    registroPatronal: ''
  }
  constructor(private formBuilder: FormBuilder
    , private divisionesService: divisionService
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
      , codigoSAP:['', {validators: [],},]
      , asignaAC:['', {validators: [],},]
      , registroPatronal:['', {validators: [],},]
    });
    this.cargarRegistros(this.paginaActual, this.cantidadRegistrosAMostrar);
  }

  cargarRegistros(pagina: number, cantidadElementosAMostrar: any){
    this.divisionesService
    .obtenerPaginado()
    .subscribe((division) =>{
      this.divisiones = division;
    })
  }

  actualizarPaginacion(datos: PageEvent){
    this.paginaActual = datos.pageIndex + 1;
    this.cantidadRegistrosAMostrar = datos.pageSize;
    this.cargarRegistros(this.paginaActual, this.cantidadRegistrosAMostrar);
  }

  onSubmit(){
    this.editaDivisiones = this.form.value;
    if (typeof this.editaDivisiones.nombre === 'undefined') {
        this._snackBar.open("Capture todos los campos", "X", {duration: 3000});
        return;
    }
    this.editaDivisiones.id = this.idEditadivision;
    if (this.idEditadivision > 0) {
      this.editaDivisiones.id = this.idEditadivision;

      this.divisionesService.editar(this.editaDivisiones, this.selectedEmpresa)
      .subscribe({
        next: () => this.cargarRegistros(this.paginaActual, this.cantidadRegistrosAMostrar),
        error: (zError: any) => console.error(zError),
      });
    }
    if (this.idEditadivision <= 0) {
      this.divisionesService.crear(this.editaDivisiones,this.selectedEmpresa)
      .subscribe({
        next: () => this.cargarRegistros(this.paginaActual, this.cantidadRegistrosAMostrar),
        error: (zError: any) => console.error(zError),
      });
    }
    this.idEditadivision = 0;
    this.form.reset();
  }

  editar(element: divisionDTO){
    this.editaDivisiones = this.form.value;
    this.editaDivisiones.id = 0;
    this.divisionesService.editar(element, this.selectedEmpresa)
    .subscribe(() =>{
      
    })
  }

  guardar(){
    this.editaDivisiones = this.form.value;
    this.editaDivisiones.id = 0;
    this.editaDivisiones.estatus = 1;
    if (typeof this.editaDivisiones.nombre === 'undefined') {
      this._snackBar.open("Capture todos los campos", "X", {duration: 3000});
      return;
    }
    this.divisionesService.crear(this.editaDivisiones, this.selectedEmpresa)
    .subscribe( () => {
      this.cargarRegistros(this.paginaActual, this.cantidadRegistrosAMostrar);
      this.form.reset();
    });
  }
prueba(divsion: divisionDTO){
  this.divisionEdicion = divsion;
  
}
editarDivison(){
  this.divisionesService.editar(this.divisionEdicion, this.selectedEmpresa)
  .subscribe(() => {
    this.cargarRegistros(this.paginaActual, this.cantidadRegistrosAMostrar)
    this.divisionEdicion = {
      id: 0,
      nombre: '',
      estatus: 0,
      codigoSAP: '',
      asignaAC: false,
      registroPatronal: ''
    }
  })
}
  

  onKeyUp(categoria: string, row: divisionDTO, event: string) {
    this.editaDivisiones.id = row.id;
    this.editaDivisiones.nombre = row.nombre;
    this.editaDivisiones.asignaAC = row.asignaAC;
    this.editaDivisiones.codigoSAP = row.codigoSAP;
    this.editaDivisiones.registroPatronal = row.registroPatronal;
    if (typeof event === 'undefined' || !event || event === "") {
      return;
    }
    switch (categoria) {
      case "nombre":
        this.editaDivisiones.nombre = event;
        break;
      default:
        break;
    }

    this.divisionesService.editar(this.editaDivisiones, this.selectedEmpresa)
    .subscribe(() => {});
    this.editaDivisiones = this.division;
  }

  // borrar(zId: number){
  //   this.tipoInsumoService.borrar(zId, this.selectedEmpresa)
  //     .subscribe({
  //       next: () => this.cargarRegistros(this.paginaActual, this.cantidadRegistrosAMostrar),
  //       error: (zError: any) => console.error(zError),
  //     });
  // }
  activaPanelCapturaRapida(){
    //Aqui se desactiva el panel
    if (this.panelActivado) {
      this.panelActivado = false;
      this.form.reset();
    }
    //Aqui se quita el panel
    else{
      this.panelActivado = true;
      this.form.reset();
      this.idEditadivision = 0;
    }
  }



  limpiarFormulario(){
    this.form.reset();
    this.idEditadivision = 0;
  }
}
