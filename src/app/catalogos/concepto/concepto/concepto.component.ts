import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { ConceptoService } from '../concepto.service';
import { MatTable } from '@angular/material/table';
import { conceptoCreacionDTO, conceptoDTO } from '../concepto';
import { HttpResponse } from '@angular/common/http';
import { PageEvent } from '@angular/material/paginator';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { especialidadDTO } from '../../especialidades/tsEspecialidad';
import { EspecialidadService } from '../../especialidades/especialidad.service';
import { SeguridadService } from 'src/app/seguridad/seguridad.service';
import { proyectoDTO } from 'src/app/proyectos/proyecto/tsProyecto';
import { ProyectoService } from 'src/app/proyectos/proyecto/proyecto.service';
import { MatDialog } from '@angular/material/dialog';
import { DialoNewConceptoComponent } from '../dialo-new-concepto/dialo-new-concepto.component';
import { ModalAlertComponent } from 'src/app/utilidades/modal-alert/modal-alert.component';

@Component({
  selector: 'app-concepto',
  templateUrl: './concepto.component.html',
  styleUrls: ['./concepto.component.css']
})
export class ConceptoComponent implements OnInit {
  form!: FormGroup;
  ideditaConcepto: number = 0;

  panelActivado: boolean = false;
  constructor(private conceptoService: ConceptoService
    , private _snackBar: MatSnackBar
    ,public dialog: MatDialog

    , private formBuilder: FormBuilder
    , private especialidadService: EspecialidadService
    , private _SeguridadEmpresa: SeguridadService
    , private proyectoService: ProyectoService){
      let idEmpresa = _SeguridadEmpresa.obtenIdEmpresaLocalStorage();
      let idProyecto = _SeguridadEmpresa.obtenerIdProyectoLocalStorage();
      this.selectedEmpresa = Number(idEmpresa);
      this.idProyecto = Number(idProyecto);
  }

  @ViewChild('table')
  table?: MatTable<any>;
  conceptos!: conceptoDTO[];
  especialidades!: especialidadDTO[];
  // selectedProyecto: number = 10;
  idProyecto: number = 0;
  selectedEmpresa = 0;
  editaConcepto: conceptoDTO = {
    id: 0,
    descripcion: '',
    unidad: '',
    codigo: '',
    idEspecialidad: 0,
    descripcionEspecialidad: '',
    idProyecto: 0,
    costoUnitario: 0,
    costoUnitarioConFormato: '$0.00'
  };
  concepto: conceptoDTO = {
    id: 0,
    descripcion: '',
    unidad: '',
    codigo: '',
    idEspecialidad: 0,
    descripcionEspecialidad: '',
    idProyecto: 0,
    costoUnitario: 0,
    costoUnitarioConFormato: '$0.00'
  };
  zvColumnasAMostrar = ['detalle', 'descripcion', 'unidad', 'agrupacion', 'acciones'];
  cantidadTotalRegistros: any;
  paginaActual = 1;
  cantidadRegistrosAMostrar = 10;
  nombreProyecto = "";
  dropdown = true;
  proyectosReset!: proyectoDTO[];
  proyectos!: proyectoDTO[];

  isLoading: boolean = true;

  selectedConcepto: number = 0;
  
  ngOnInit(): void {
    this.cargarRegistros();
    this.form = this.formBuilder.group({
      descripcion: ['', {validators: [],},]
      , unidad: ['', {validators: [],},]
      , codigo: ['', {validators: [],},]
      , idEspecialidad: new FormControl()
    });
    this.especialidadService.obtener(this.selectedEmpresa)
    .subscribe((especialidades) => {
      this.especialidades = especialidades;
    })
    this.proyectoService.obtenerTodosSinEstructurar(this.selectedEmpresa)
    .subscribe((proyectos) =>{
      this.proyectos = proyectos;
      this.proyectosReset = proyectos;
    })
  }



  cargarRegistros(){
    this.conceptoService
    .obtenerPaginado(this.idProyecto, this.selectedEmpresa)
    .subscribe((conceptos) => {
      this.conceptos = conceptos;
      this.isLoading = false
    });
  }

  actualizarPaginacion(datos: PageEvent){
    this.paginaActual = datos.pageIndex + 1;
    this.cantidadRegistrosAMostrar = datos.pageSize;
    this.cargarRegistros();
  }

  borrar(zId: number){
    this.conceptoService.borrar(zId, this.selectedEmpresa)
    .subscribe({
      next: () => this.cargarRegistros(),
      error: (zError: any) => console.error(zError),
    });
  }

  guardar(){
    this.editaConcepto = this.form.value;
    this.editaConcepto.descripcionEspecialidad = "";
    if (typeof this.editaConcepto.descripcion === 'undefined' || !this.editaConcepto.descripcion || this.editaConcepto.descripcion === "" ||
        typeof this.editaConcepto.unidad === 'undefined' || !this.editaConcepto.unidad || this.editaConcepto.unidad === "" ||
        typeof this.editaConcepto.codigo === 'undefined' || !this.editaConcepto.codigo || this.editaConcepto.codigo === ""
        ) {
        this._snackBar.open("Capture todos los campos", "X", {duration: 3000});
        return;
    }
    this.conceptoService.crear({
      codigo: this.editaConcepto.codigo,
      descripcion: this.editaConcepto.descripcion,
      unidad: this.editaConcepto.unidad,
      idEspecialidad: this.editaConcepto.idEspecialidad,
      costoUnitario: this.editaConcepto.costoUnitario,
      idProyecto: this.idProyecto
    }, this.selectedEmpresa)
    .subscribe(() => {
      this.conceptoService.obtenerPaginado(this.idProyecto, this.selectedEmpresa)
      .subscribe((conceptos) => {
        this.conceptos = conceptos;
      })
    });
    this.form.reset();
    this.ideditaConcepto = 0;
  }

  onKeyUp(categoria: string, row: conceptoDTO, event: string) {

    this.editaConcepto.id = row.id;
    this.editaConcepto.descripcion = row.descripcion;
    this.editaConcepto.unidad = row.unidad;
    this.editaConcepto.codigo = row.codigo;
    this.editaConcepto.idEspecialidad = row.idEspecialidad;
    if (typeof event === 'undefined' || !event || event === "") {
      return;
    }
    switch (categoria) {
      case "descripcion":
        this.editaConcepto.descripcion = event;
        break;
      case "unidad":
        this.editaConcepto.unidad = event;
        break;
      case "codigo":
          this.editaConcepto.codigo = event;
          break;
      case "agrupacion":
          //this.editaConcepto.idEspecialidad = (Number)event;
          break;
      default:
        break;
    }

    this.conceptoService.editar(this.editaConcepto, this.selectedEmpresa)
    .subscribe({
      next: () => {

      }
      , error: (zError: any) => {
        console.error(zError);
      }
    });

    this.editaConcepto = this.concepto;
  }

  traerParaEditar(id: number){
    if (id > 0) {
      this.ideditaConcepto = id;
      if (!this.panelActivado) {
        this.panelActivado = true;
      }
      //this.empresaService.cambioId(id);
      this.conceptoService.obtenerXId(id, this.selectedEmpresa)
      .subscribe((concepto) => {
        this.form.patchValue(concepto);
      });
    }
  }

  activaPanelCapturaRapida(){
    if (this.panelActivado) {
      this.editaConcepto = this.concepto;
      this.panelActivado = false;
      //this.ideditapartidas = 0;
    }
    else{
      this.editaConcepto = this.concepto;
      this.panelActivado = true;
      this.ideditaConcepto = 0;
    }
  }

  limpiarFormulario(){
    this.form.reset();
    this.ideditaConcepto = 0;
  }

  editar(concepto: conceptoDTO){
    this.conceptoService.editar(concepto, this.selectedEmpresa)
    .subscribe(() =>{

    })
  }

  selectConcepto(id: number){
    this.selectedConcepto = id;
  }

  // cambiarProyecto(proyecto: proyectoDTO){
  //   this.selectedProyecto = this.idProyecto;
  //   this.nombreProyecto = proyecto.nombre;
  //   this.cargarRegistros();
  // }

  filtrarProyecto(event: Event){
    this.proyectos = this.proyectosReset;
    const filterValue = (event.target as HTMLInputElement).value.toLocaleLowerCase();
    this.proyectos = this.proyectos.filter((proyecto) => proyecto.nombre.toLocaleLowerCase().includes(filterValue));
  }

  pruebaCont(){
    this.dropdown = true;
  }
  openDialogNewConcepto(){
    const dialogRef = this.dialog.open(DialoNewConceptoComponent,
      {
        data: {
          especialidades: this.especialidades,
          idProyecto: this.idProyecto,
          // selectedProyecto: this.selectedProyecto,
          selectedEmpresa: this.selectedEmpresa,
          conceptos: this.conceptos,
          ideditaConcepto: this.ideditaConcepto
        }
      }
    );
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.cargarRegistros();
        
      }
    });
  }

  abrirDialogo(conceptoId: number): void {
    const dialogRef = this.dialog.open(ModalAlertComponent, {
        data: {
            titulo: '',
            mensaje: '¿Quieres eliminar el periodo?',
            funcionAceptarConcepto: this.borrar.bind(this),
            conceptoId: conceptoId,
        }
    });

    dialogRef.afterClosed().subscribe((resultado: boolean) => {
        // Verifica si se realizó la eliminación para actualizar los datos si es necesario
        if (resultado) {
          this.cargarRegistros();

        }
    });
}
}
