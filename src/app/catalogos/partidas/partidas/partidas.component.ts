import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { PartidasService } from '../partidas.service';
import { MatTable } from '@angular/material/table';
import { partidasCreacionDTO, partidasDTO } from '../partidas';
import { HttpResponse } from '@angular/common/http';
import { PageEvent } from '@angular/material/paginator';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-partidas',
  templateUrl: './partidas.component.html',
  styleUrls: ['./partidas.component.css']
})
export class PartidaComponent implements OnInit {
  form!: FormGroup;
  ideditapartidas: number = 0;

  panelActivado: boolean = false;
  constructor(private partidasService: PartidasService
    , private _snackBar: MatSnackBar
    , private formBuilder: FormBuilder) {}

  @ViewChild('table')
  table?: MatTable<any>;
  partidass!: partidasDTO[];
  editapartidas: partidasDTO = {
    id: 0,
    descripcion: '',
    observaciones: '',
    nivel: 0
  };
  partida: partidasDTO = {
    id: 0,
    descripcion: '',
    observaciones: '',
    nivel: 0
  };
  zvColumnasAMostrar = ['descripcion', 'observaciones', 'nivel', 'acciones'];
  cantidadTotalRegistros: any;
  paginaActual = 1;
  cantidadRegistrosAMostrar = 10;

  ngOnInit(): void {
    this.cargarRegistros(this.paginaActual, this.cantidadRegistrosAMostrar);
    this.form = this.formBuilder.group({
      descripcion: ['', {validators: [],},]
      , observaciones: ['', {validators: [],},]
      , nivel: ['', {validators: [],},]
    });
  }

  cargarRegistros(pagina: number, cantidadElementosAMostrar: any){
    this.partidasService
    .obtenerPaginado(pagina, cantidadElementosAMostrar)
    .subscribe({
      next: (respuesta: HttpResponse<partidasDTO[]>) => {

        this.partidass = respuesta.body || [];

        this.cantidadTotalRegistros = respuesta.headers.get("cantidadTotalRegistros");
      },
      error: (zError: any) => {
        console.error(zError);
      }
    });
  }

  actualizarPaginacion(datos: PageEvent){
    this.paginaActual = datos.pageIndex + 1;
    this.cantidadRegistrosAMostrar = datos.pageSize;
    this.cargarRegistros(this.paginaActual, this.cantidadRegistrosAMostrar);
  }

  borrar(zId: number){
    this.partidasService.borrar(zId)
    .subscribe({
      next: () => this.cargarRegistros(this.paginaActual, this.cantidadRegistrosAMostrar),
      error: (zError: any) => console.error(zError),
    });
  }

  guardar(){
    this.editapartidas = this.form.value;
    if (typeof this.editapartidas.descripcion === 'undefined' || !this.editapartidas.descripcion || this.editapartidas.descripcion === "" ||
        typeof this.editapartidas.observaciones === 'undefined' || !this.editapartidas.observaciones || this.editapartidas.observaciones === "" ||
        typeof this.editapartidas.nivel === 'undefined' || !this.editapartidas.nivel || this.editapartidas.nivel <= 0
        ) {
        this._snackBar.open("Capture todos los campos", "X", {duration: 3000});
        return;
    }
    if (this.ideditapartidas > 0) {
      this.editapartidas.id = this.ideditapartidas;
      this.partidasService.editar(this.editapartidas)
      .subscribe({
        next: () => {this.cargarRegistros(this.paginaActual, this.cantidadRegistrosAMostrar); this.ideditapartidas = 0;},
        error: (zError: any) => console.error(zError),
      });
    }
    else{
      this.partidasService.crear(this.editapartidas)
      .subscribe({
        next: () => this.cargarRegistros(this.paginaActual, this.cantidadRegistrosAMostrar),
        error: (zError: any) => console.error(zError),
      });
    }
    this.form.reset();
    this.ideditapartidas = 0;
  }

  onKeyUp(categoria: string, row: partidasDTO, event: string) {

    this.editapartidas.id = row.id;
    this.editapartidas.descripcion = row.descripcion;
    this.editapartidas.observaciones = row.observaciones;
    this.editapartidas.nivel = row.nivel;
    if (typeof event === 'undefined' || !event || event === "") {
      return;
    }
    switch (categoria) {
      case "descripcion":
        this.editapartidas.descripcion = event;
        break;
        case "observaciones":
          this.editapartidas.observaciones = event;
          break;
      case "nivel":
          this.editapartidas.nivel = Number(event);
          break;
      default:
        break;
    }

    this.partidasService.editar(this.editapartidas)
    .subscribe({
      next: () => {

      }
      , error: (zError: any) => {
        console.error(zError);
      }
    });

    this.editapartidas = this.partida;
  }

  traerParaEditar(id: number){
    if (id > 0) {
      this.ideditapartidas = id;
      if (!this.panelActivado) {
        this.panelActivado = true;
      }
      //this.empresaService.cambioId(id);
      this.partidasService.obtenerXId(id)
      .subscribe((partidas) => {
        this.form.patchValue(partidas);
      });
    }
  }

  activaPanelCapturaRapida(){
    if (this.panelActivado) {
      this.editapartidas = this.partida;
      this.panelActivado = false;
      //this.ideditapartidas = 0;
    }
    else{
      this.editapartidas = this.partida;
      this.panelActivado = true;
      this.ideditapartidas = 0;
    }
  }

  limpiarFormulario(){
    this.form.reset();
    this.ideditapartidas = 0;
  }
}
