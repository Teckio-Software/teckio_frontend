import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { rubroDTO } from '../tsRubro';
import { RubroService } from '../rubro.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpResponse } from '@angular/common/http';
import { PageEvent } from '@angular/material/paginator';
import { SeguridadService } from 'src/app/seguridad/seguridad.service';
import { MatDialog } from '@angular/material/dialog';
import { DialogNewRubroComponent } from '../dialog-new-rubro/dialog-new-rubro.component';
import { faL } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-rubro',
  templateUrl: './rubro.component.html',
  styleUrls: ['./rubro.component.css']
})
export class RubroComponent implements OnInit {
  form!: FormGroup;
  selectedEmpresa: number = 0;
  idEditaRubro: number = 0;
  modelo: rubroDTO ={
    id: 0,
    descripcion: '',
    naturalezaRubro: 0,
    tipoReporte: 0,
    posicion: 0
  }
  editaRubro: rubroDTO ={
    id: 0,
    descripcion: '',
    naturalezaRubro: 0,
    tipoReporte: 0,
    posicion: 0
  }
  panelActivado: boolean = false;
  rubros!: rubroDTO[];
  Ejemplo!: rubroDTO[];
  cantidadTotalRegistros: any;
  paginaActual = 1;
  cantidadRegistrosAMostrar = 10;
  columnasAMostrar = ['descripcion', 'naturalezaRubro', 'incluidoReporte', 'acciones'];

  isLoading: boolean = true;

  constructor(private rubroService: RubroService
    , private _snackBar: MatSnackBar
    , private formBuilder: FormBuilder
    ,public dialog: MatDialog
    
    , private _SeguridadEmpresa: SeguridadService){
      let idEmpresa = _SeguridadEmpresa.obtenIdEmpresaLocalStorage();
      this.selectedEmpresa = Number(idEmpresa);
    }
  ngOnInit(): void {
    this.form = this.formBuilder.group({
      id: ['', {validators: [],},]
      , descripcion: ['', {validators: [],},]
      , naturalezaRubro: ['', {validators: [],},]
      , tipoReporte: ['', {validators: [],},]
      , posicion: ['', {validators: [],},]
    });
    this.cargarRegistros();
  }

  cargarRegistros(){
    this.rubroService
    .obtenerTodos(this.selectedEmpresa)
    .subscribe((respuesta) => {
      this.rubros = respuesta;
      this.isLoading = false;
    });
  }

  actualizarPaginacion(datos: PageEvent){
    this.paginaActual = datos.pageIndex + 1;
    this.cantidadRegistrosAMostrar = datos.pageSize;
    this.cargarRegistros();
  }

  onKeyUp(categoria: string, row: rubroDTO, event: string) {
    this.editaRubro.id = row.id;
    this.editaRubro.descripcion = row.descripcion;
    this.editaRubro.naturalezaRubro = row.naturalezaRubro;
    this.editaRubro.tipoReporte = row.tipoReporte;
    this.editaRubro.posicion = row.posicion;
    if (typeof event === 'undefined' || !event || event === "") {
      return;
    }
    switch (categoria) {
      case "descripcion":
        this.editaRubro.descripcion = event;
        break;
      default:
        break;
    }
    this.rubroService.editar(this.editaRubro, this.selectedEmpresa) 
    .subscribe(() => {});
  }

  editar(element: rubroDTO){
    if (typeof element.descripcion === undefined || !element.descripcion || element.descripcion === ""){
      return;
    }
    this.rubroService.editar(element, this.selectedEmpresa)
    .subscribe({
      next: () => {
        this.cargarRegistros();
      }
    })
  }

  guardar(){
    this.editaRubro = this.form.value;
    this.editaRubro.id = 0;
    this.editaRubro.posicion = 0;
    if (typeof this.editaRubro.descripcion === 'undefined' || !this.editaRubro.descripcion || this.editaRubro.descripcion === "" ||
        typeof this.editaRubro.naturalezaRubro === 'undefined' || !this.editaRubro.naturalezaRubro || this.editaRubro.naturalezaRubro <= 0 ||
        typeof this.editaRubro.tipoReporte === 'undefined' || !this.editaRubro.tipoReporte || this.editaRubro.tipoReporte <= 0
        //|| typeof this.editaRubro.posicion === 'undefined' || !this.editaRubro.posicion || this.editaRubro.posicion <= 0
        ) {
        this._snackBar.open("Capture todos los campos", "X", {duration: 3000});
        return;
    }
    this.rubroService.crear(this.editaRubro, this.selectedEmpresa)
    .subscribe({
      next: () => this.cargarRegistros(),
      error: (zError: any) => console.error(zError),
    });
    this.form.reset();
    this.idEditaRubro = 0;
  }

  traerParaEditar(id: number){
    if (id > 0) {
      this.idEditaRubro = id;
      if (!this.panelActivado) {
        this.panelActivado = true;
      }
      this.rubroService.obtenerXId(id, this.selectedEmpresa)
      .subscribe((especialidad) => {
        this.form.patchValue(especialidad);
      });
    }
  }

  borrar(zId: number){
    this.rubroService.borrar(zId, this.selectedEmpresa)
    .subscribe({
      next: () => this.cargarRegistros(),
      error: (zError: any) => console.error(zError),
    });
  }

  activaPanelCapturaRapida(){
    //Aqui se desactiva el panel
    if (this.panelActivado) {
      this.editaRubro = this.modelo;
      this.panelActivado = false;
      this.form.reset();
    }
    //Aqui se activa el panel
    else{
      this.editaRubro = this.modelo;
      this.panelActivado = true;
      this.idEditaRubro = 0;
      this.form.reset();
    }
  }

  limpiarFormulario(){
    this.form.reset();
    this.idEditaRubro = 0;
  }
  openDialogNewRubro(){
    const dialogRef = this.dialog.open(DialogNewRubroComponent, {
      data: {
        selectedEmpresa: this.selectedEmpresa,
        idEditaRubro: this.idEditaRubro
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.cargarRegistros();
      }
    });
  }
}

