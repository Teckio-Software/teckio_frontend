import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import { plazaService } from '../plazas.service';
import { MatTableDataSource } from '@angular/material/table';
import { PageEvent } from '@angular/material/paginator';
import { plazaCreacionDTO, plazaDTO, divisionDTO } from '../tsPlazas';
import { HttpResponse } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SeguridadService } from 'src/app/seguridad/seguridad.service';
import { RouterEvent } from '@angular/router';
import { divisionService } from '../../division/division.service';

@Component({
  selector: 'app-plazas',
  templateUrl: './plazas.component.html',
  styleUrls: ['./plazas.component.css']
})
export class PlazasComponent {
  form!:FormGroup;
  dataInicio: divisionDTO[] = [];
  plazas: plazaDTO[] = [];
  plazasReset: plazaDTO[] = [];
  divisiones! : divisionDTO [];
  divisionesRest! : divisionDTO [];
  cantidadTotalRegistros: any;
  paginaActual = 1;
  cantidadRegistrosAMostrar = 5;
  selectedEmpresa = 0;
  idEditaplaza: number = 0;
  dropdown = true;
  panelActivado: boolean = false;
  selectedDivision: number = 0;
  nombreDivision: string = "";
  plaza: plazaDTO = {
    id: 0,
    nombrePlaza: '',
    estatus: 0,
    id_divisiones: 0,
    fecha_alta: new Date(),
    fecha_baja: new Date(),
    nombreDivision: ''
  }
  plazasEdicion: plazaDTO = {
    id: 0,
    nombrePlaza: '',
    estatus: 0,
    id_divisiones: 0,
    fecha_alta: new Date(),
    fecha_baja: new Date(),
    nombreDivision: ''
  }
  
  constructor(private formBuilder: FormBuilder
    , private plazaService: plazaService
    , private divisionService: divisionService
    , private _snackBar: MatSnackBar
    , private _SeguridadEmpresa: SeguridadService
    ) {
        let idEmpresa = _SeguridadEmpresa.obtenIdEmpresaLocalStorage();
        this.selectedEmpresa = Number(idEmpresa);
    }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      id: ['', {validators: [],},]
      , nombrePlaza:['', {validators: [],},]
      , id_divisiones:['', {validators: [],},]
      , estatus:['', {validators: [],},]
    });
    this.cargarRegistros();
  }

  cargarRegistros(){
    this.plazaService
    .obtenerPaginado()
    .subscribe((plaza) =>{
      this.plazas = plaza;
      this.plazasReset = plaza;
    })
    this.divisionService
    .obtenerTodosSinPaginar(this.selectedEmpresa)
    .subscribe((division) =>{
      this.divisiones = division;
      this.divisionesRest = division;
    })
  }

  actualizarPaginacion(datos: PageEvent){
    this.paginaActual = datos.pageIndex + 1;
    this.cantidadRegistrosAMostrar = datos.pageSize;
    this.cargarRegistros();
  }
  

  onSubmit(){
    this.plazasEdicion = this.form.value;
    if (typeof this.plazasEdicion.nombrePlaza === 'undefined') {
        this._snackBar.open("Capture todos los campos", "X", {duration: 3000});
        return;
    }
    this.plazasEdicion.id = this.idEditaplaza;
    if (this.idEditaplaza > 0) {
      this.plazasEdicion.id = this.idEditaplaza;

      this.plazaService.editar(this.plazasEdicion, this.selectedEmpresa)
      .subscribe({
        next: () => this.cargarRegistros(),
        error: (zError: any) => console.error(zError),
      });
    }
    if (this.idEditaplaza <= 0) {
      this.plazaService.crear(this.plazasEdicion,this.selectedEmpresa)
      .subscribe({
        next: () => this.cargarRegistros(),
        error: (zError: any) => console.error(zError),
      });
    }
    this.idEditaplaza = 0;
    this.form.reset();
  }

  editar(element: plazaDTO){
    this.plazaService.editar(element, this.selectedEmpresa)
    .subscribe(() =>{
      
    })
  }

  guardar(){
    this.plazasEdicion = this.form.value;
    this.plazasEdicion.id_divisiones = this.selectedDivision
    this.plazasEdicion.nombreDivision = this.nombreDivision
    this.plazasEdicion.estatus = 1;
    this.plazasEdicion.id = 0;
    if (typeof this.plazasEdicion.nombrePlaza === 'undefined') {
      this._snackBar.open("Capture todos los campos", "X", {duration: 3000});
      return;
    }
    this.plazaService.crear(this.plazasEdicion, this.selectedEmpresa)
    .subscribe( () => {
      this.cargarRegistros();
      this.form.reset();
    });
  }


  prueba(plaza: plazaDTO){
    this.plazasEdicion = plaza;
    
  }
  editarPlaza(){
    this.plazaService.editar(this.plazasEdicion, this.selectedEmpresa)
    .subscribe(() => {
      this.cargarRegistros()
      this.plazasEdicion = {
        id: 0,
        nombrePlaza: '',
        estatus: 0,
        id_divisiones: 0,
        fecha_baja: null,
        fecha_alta: new Date(),
        nombreDivision: ''
      }
    })
  }

  aplicarFiltroTabla(event: Event) {
    this.plazas = this.plazasReset;

    const filterValue = (event.target as HTMLInputElement).value;
    this.plazas = this.plazas.filter((plaza) => plaza.nombreDivision.toLocaleLowerCase().includes(filterValue));
  }

  filtrarDivision(event: Event) {
    this.divisiones = this.divisionesRest;
    const filterValue = (event.target as HTMLInputElement).value.toLocaleLowerCase();
    this.divisiones = this.divisiones.filter((division) => division.nombre.toLocaleLowerCase().includes(filterValue));
  }

  cambiarDivision(division: divisionDTO) {
    this.selectedDivision = division.id;
    this.nombreDivision = division.nombre;
    this.cargarRegistros();
  }

  pruebaCont() {
    this.dropdown = true;
}

  limpiarFormulario(){
    this.form.reset();
    this.idEditaplaza = 0;
  }
}
