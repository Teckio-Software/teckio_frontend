import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { TipoPolizaService } from '../tipo-poliza.service';
import { MatTable } from '@angular/material/table';
import { tipoPolizaCreacionDTO, tipoPolizaDTO } from '../tsTipoPoliza';
import { HttpResponse } from '@angular/common/http';
import { PageEvent } from '@angular/material/paginator';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SeguridadService } from 'src/app/seguridad/seguridad.service';

@Component({
  selector: 'app-tipo-poliza',
  templateUrl: './tipo-poliza.component.html',
  styleUrls: ['./tipo-poliza.component.css']
})
export class TipoPolizaComponent implements OnInit{
  form!: FormGroup;
  ideditaTipoPoliza: number = 0;
  selectedEmpresa: number = 0;

  panelActivado: boolean = false;
  constructor(private tipoPolizaService: TipoPolizaService
    , private _snackBar: MatSnackBar
    , private formBuilder: FormBuilder
    , private _seguridadService: SeguridadService) {
      let idEmpresa = _seguridadService.obtenIdEmpresaLocalStorage();
      this.selectedEmpresa = Number(idEmpresa);
    }

    @ViewChild('table')
    table?: MatTable<any>;
    tipoPolizas!: tipoPolizaDTO[];
    editaTipoPoliza: tipoPolizaDTO = {
      id: 0,
      codigo: '',
      descripcion: '',
      naturaleza: 0,
      posicion: 0
    };
    tipoPoliza: tipoPolizaDTO = {
      id: 0,
      codigo: '',
      descripcion: '',
      naturaleza: 0,
      posicion: 0
    };

  zvColumnasAMostrar = ['codigo', 'descripcion', 'acciones'];
  cantidadTotalRegistros: any;
  paginaActual = 1;
  cantidadRegistrosAMostrar = 10;

  isLoading: boolean = true;

  ngOnInit(): void {
    this.cargarRegistros(this.paginaActual, this.cantidadRegistrosAMostrar);
    this.form = this.formBuilder.group({
      codigo: ['', {validators: [],},]
      , descripcion: ['', {validators: [],},]
      , naturaleza: ['', {validators: [],},]
    });
  }

  cargarRegistros(pagina: number, cantidadElementosAMostrar: any){
    this.tipoPolizaService
    .obtenerPaginado(pagina, cantidadElementosAMostrar)
    .subscribe({
      next: (respuesta: HttpResponse<tipoPolizaDTO[]>) => {

        this.tipoPolizas = respuesta.body || [];

        this.cantidadTotalRegistros = respuesta.headers.get("cantidadTotalRegistros");
      },
      error: (zError: any) => {
        console.error(zError);
        this.isLoading =false;

      },
      complete:()=>{
        this.isLoading =false;
      }
    });
  }

  actualizarPaginacion(datos: PageEvent){
    this.paginaActual = datos.pageIndex + 1;
    this.cantidadRegistrosAMostrar = datos.pageSize;
    this.cargarRegistros(this.paginaActual, this.cantidadRegistrosAMostrar);
  }

  borrar(zId: number){
    this.tipoPolizaService.borrar(zId, this.selectedEmpresa)
    .subscribe({
      next: () => this.cargarRegistros(this.paginaActual, this.cantidadRegistrosAMostrar),
      error: (zError: any) => console.error(zError),
    });
  }

  editar(element: tipoPolizaDTO){
    if (typeof element.descripcion === undefined || !element.descripcion || element.descripcion === ""){
      return;
    }
    this.tipoPolizaService.editar(element, this.selectedEmpresa)
    .subscribe({
      next: () => {
        this.cargarRegistros(this.paginaActual, this.cantidadRegistrosAMostrar);
      }
    })
  }

  guardar(){
    this.editaTipoPoliza = this.form.value;
    this.editaTipoPoliza.id = 0;
    this.editaTipoPoliza.posicion = 0;
    if (typeof this.editaTipoPoliza.codigo === 'undefined' || !this.editaTipoPoliza.codigo || this.editaTipoPoliza.codigo === "" ||
        typeof this.editaTipoPoliza.descripcion === 'undefined' || !this.editaTipoPoliza.descripcion || this.editaTipoPoliza.descripcion === "" ||
        typeof this.editaTipoPoliza.naturaleza === 'undefined' || !this.editaTipoPoliza.naturaleza || this.editaTipoPoliza.naturaleza < 0
        //|| typeof this.editaRubro.posicion === 'undefined' || !this.editaRubro.posicion || this.editaRubro.posicion <= 0
        ) {
        this._snackBar.open("Capture todos los campos", "X", {duration: 3000});
        return;
    }
    this.tipoPolizaService.crear(this.editaTipoPoliza, this.selectedEmpresa)
    .subscribe({
      next: () => this.cargarRegistros(this.paginaActual, this.cantidadRegistrosAMostrar),
      error: (zError: any) => console.error(zError),
    });
    this.form.reset();
  }

  onKeyUp(categoria: string, row: tipoPolizaDTO, event: string) {

    this.editaTipoPoliza.id = row.id;
    this.editaTipoPoliza.codigo = row.codigo;
    this.editaTipoPoliza.descripcion = row.descripcion;
    if (typeof event === 'undefined' || !event || event === "") {
      return;
    }
    switch (categoria) {
      case "codigo":
        this.editaTipoPoliza.codigo = event;
        break;
        case "descripcion":
          this.editaTipoPoliza.descripcion = event;
          break;
      default:
        break;
    }

    this.tipoPolizaService.editar(this.editaTipoPoliza, this.selectedEmpresa)
    .subscribe({
      next: () => {

      }
      , error: (zError: any) => {
        console.error(zError);
      }
    });

    this.editaTipoPoliza = this.tipoPoliza;
  }

  traerParaEditar(id: number){
    if (id > 0) {
      this.ideditaTipoPoliza = id;
      if (!this.panelActivado) {
        this.panelActivado = true;
      }
      //this.empresaService.cambioId(id);
      this.tipoPolizaService.obtenerXId(id, this.selectedEmpresa)
      .subscribe((tipopoliza) => {
        this.form.patchValue(tipopoliza);
      });
    }
  }

  activaPanelCapturaRapida(){
    if (this.panelActivado) {
      this.editaTipoPoliza = this.tipoPoliza;
      this.panelActivado = false;
      //this.ideditapartidas = 0;
    }
    else{
      this.editaTipoPoliza = this.tipoPoliza;
      this.panelActivado = true;
      this.ideditaTipoPoliza = 0;
    }
  }

  limpiarFormulario(){
    this.form.reset();
    this.ideditaTipoPoliza = 0;
  }
}
