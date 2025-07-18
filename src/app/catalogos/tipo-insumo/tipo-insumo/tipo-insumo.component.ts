 import { Component, Input, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { TipoInsumoService } from '../tipo-insumo.service';
import { tipoInsumoCreacionDTO, tipoInsumoDTO } from '../tsTipoInsumo';
import { PageEvent } from '@angular/material/paginator';
import { HttpResponse } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SeguridadService } from 'src/app/seguridad/seguridad.service';
import { RouterEvent } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { DialogNewInsumoComponent } from '../dialog-new-insumo/dialog-new-insumo.component';
import { ModalAlertComponent } from 'src/app/utilidades/modal-alert/modal-alert.component';

@Component({
  selector: 'app-tipo-insumo',
  templateUrl: './tipo-insumo.component.html',
  styleUrls: ['./tipo-insumo.component.css']
})
export class TipoInsumoComponent implements OnInit {

  form!:FormGroup;
  tiposDeInsumo: tipoInsumoDTO[] = [];
  columnasAMostrar = ['descripcion', 'acciones'];
  cantidadTotalRegistros: any;
  paginaActual = 1;
  cantidadRegistrosAMostrar = 5;
  selectedEmpresa = 0;
  idEditaTipoInsumo: number = 0;

  panelActivado: boolean = false;
  tipoInsumo: tipoInsumoDTO = {
    id: 0,
    descripcion: ''
  }
  editaTipoInsumo: tipoInsumoDTO = {
    id: 0,
    descripcion: ''
  }
  length = 20;
  pageEvent!: PageEvent;
  inicioCopia = 0;
  terminoCopia = 20;
  constructor(
     private tipoInsumoService: TipoInsumoService
    , private _snackBar: MatSnackBar
    , private _SeguridadEmpresa: SeguridadService,
    public dialog: MatDialog
    ) {
        let idEmpresa = _SeguridadEmpresa.obtenIdEmpresaLocalStorage();
        this.selectedEmpresa = Number(idEmpresa);
    }  

  ngOnInit(): void {
    
    this.cargarRegistros(this.paginaActual, this.cantidadRegistrosAMostrar);
  }

  cargarRegistros(pagina: number, cantidadElementosAMostrar: any){
    this.tipoInsumoService
    .obtenerTodosSinPaginar(this.selectedEmpresa)
    .subscribe((tiposInsumo) =>{
      this.tiposDeInsumo = tiposInsumo;
    })
  }

  actualizarPaginacion(datos: PageEvent){
    this.paginaActual = datos.pageIndex + 1;
    this.cantidadRegistrosAMostrar = datos.pageSize;
    this.cargarRegistros(this.paginaActual, this.cantidadRegistrosAMostrar);
  }

  onSubmit(){
    this.editaTipoInsumo = this.form.value;
    if (typeof this.editaTipoInsumo.descripcion === 'undefined' || !this.editaTipoInsumo.descripcion || this.editaTipoInsumo.descripcion === "") {
        this._snackBar.open("Capture todos los campos", "X", {duration: 3000});
        return;
    }
    this.editaTipoInsumo.id = this.idEditaTipoInsumo;
    if (this.idEditaTipoInsumo > 0) {
      this.editaTipoInsumo.id = this.idEditaTipoInsumo;

      this.tipoInsumoService.editar(this.editaTipoInsumo, this.selectedEmpresa)
      .subscribe({
        next: () => this.cargarRegistros(this.paginaActual, this.cantidadRegistrosAMostrar),
        error: (zError: any) => console.error(zError),
      });
    }
    if (this.idEditaTipoInsumo <= 0) {
      this.tipoInsumoService.crear(this.editaTipoInsumo,this.selectedEmpresa)
      .subscribe({
        next: () => this.cargarRegistros(this.paginaActual, this.cantidadRegistrosAMostrar),
        error: (zError: any) => console.error(zError),
      });
    }
    this.idEditaTipoInsumo = 0;
    this.form.reset();
  }

  editar(element: tipoInsumoDTO){
    this.tipoInsumoService.editar(element, this.selectedEmpresa)
    .subscribe(() =>{
      
    })
  }

 

  traerParaEditar(id: number){
    if (id > 0) {
      this.idEditaTipoInsumo = id;
      if (!this.panelActivado) {
        this.panelActivado = true
      }
      this.tipoInsumoService.obtenerXId(id, this.selectedEmpresa)
      .subscribe((tipoInsumo) => {
        this.form.patchValue(tipoInsumo);
      });
    }
  }

  onKeyUp(categoria: string, row: tipoInsumoDTO, event: string) {
    this.editaTipoInsumo.id = row.id;
    this.editaTipoInsumo.descripcion = row.descripcion;
    if (typeof event === 'undefined' || !event || event === "") {
      return;
    }
    switch (categoria) {
      case "descripcion":
        this.editaTipoInsumo.descripcion = event;
        break;
      default:
        break;
    }

    this.tipoInsumoService.editar(this.editaTipoInsumo, this.selectedEmpresa)
    .subscribe(() => {});
    this.editaTipoInsumo = this.tipoInsumo;
  }

  borrar(zId: number){
    this.tipoInsumoService.borrar(zId, this.selectedEmpresa)
      .subscribe({
        next: () => this.cargarRegistros(this.paginaActual, this.cantidadRegistrosAMostrar),
        error: (zError: any) => console.error(zError),
      });
  }
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
      this.idEditaTipoInsumo = 0;
    }
  }

  limpiarFormulario(){
    this.form.reset();
    this.idEditaTipoInsumo = 0;
  }
  

  openDialogNewInsumo() {
    const dialogRef = this.dialog.open(DialogNewInsumoComponent, {
      data: {
        selectedEmpresa: this.selectedEmpresa,
        paginaActual: this.paginaActual,
        cantidadRegistrosAMostrar: this.cantidadRegistrosAMostrar
      }
    });

  dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Si el resultado es true, significa que se guardó con éxito
        this.cargarRegistros(this.paginaActual, this.cantidadRegistrosAMostrar);
      }
    });
  }

  abrirDialogo(tipoInsumoId: number): void {
    const dialogRef = this.dialog.open(ModalAlertComponent, {
        data: {
            titulo: '',
            mensaje: '¿Quieres eliminar el periodo?',
            funcionAceptarTipoInsumo: this.borrar.bind(this),
            tipoInsumoId: tipoInsumoId,
        }
    });

    dialogRef.afterClosed().subscribe((resultado: boolean) => {
        // Verifica si se realizó la eliminación para actualizar los datos si es necesario
        if (resultado) {
            this.cargarRegistros(this.paginaActual, this.cantidadRegistrosAMostrar);
        }
    });
}

cambiarPaginaCopia(e:PageEvent){
  this.pageEvent = e;
  this.length = e.length;
  this.inicioCopia = e.pageIndex * e.pageSize;
  this.terminoCopia = this.inicioCopia + e.pageSize;
}
      
}
