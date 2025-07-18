import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, NG_VALUE_ACCESSOR } from '@angular/forms';
import { InsumoDTO, InsumoFormDTO } from '../tsInsumo';
import { InsumoService } from '../insumo.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TipoInsumoService } from '../../tipo-insumo/tipo-insumo.service';
import { tipoInsumoDTO } from '../../tipo-insumo/tsTipoInsumo';
import { familiaInsumoDTO } from '../../familia-insumo/tsFamilia';
import { FamiliaInsumoService } from '../../familia-insumo/familia-insumo.service';
import { HttpResponse } from '@angular/common/http';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSelectChange } from '@angular/material/select';
import { SeguridadService } from 'src/app/seguridad/seguridad.service';
import { proyectoDTO } from 'src/app/proyectos/proyecto/tsProyecto';
import { ProyectoService } from 'src/app/proyectos/proyecto/proyecto.service';
import { MatDialog } from '@angular/material/dialog';
import { DialoNewInsumoComponent } from '../dialo-new-insumo/dialo-new-insumo.component';

@Component({
  selector: 'app-insumo',
  templateUrl: './insumo.component.html',
  styleUrls: ['./insumo.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: InsumoComponent,
      multi: true
    }
  ]
})
export class InsumoComponent implements OnInit {
  form!: FormGroup;
  selectedEmpresa = 0;
  idProyecto = 0;
  idEditaInsumo: number = 0;
  idTipoInsumo: number = 0;
  idFamiliaInsumo: number = 0;
  // selectedProyecto: number = 0;
  modelo: InsumoDTO ={
    id: 0,
    descripcion: '',
    unidad: '',
    codigo: '',
    idTipoInsumo: 0,
    idFamiliaInsumo: 0,
    descripcionTipoInsumo: '',
    descripcionFamiliaInsumo: '',
    idProyecto: 0,
    costoUnitario: 0,
    costoBase: 0,
    esFsrGlobal: false
  }
  editaInsumo: InsumoFormDTO ={
    id: 0,
    descripcion: '',
    unidad: '',
    codigo: '',
    idTipoInsumo: 0,
    idFamiliaInsumo: 0,
    idProyecto: 0,
    costoUnitario: 0
  }
  proyectos!: proyectoDTO[];
  tiposInsumo!: tipoInsumoDTO[];
  familiasInsumo!: familiaInsumoDTO[];
  panelActivado: boolean = false;
  insumos!: InsumoDTO[];
  columnasAMostrar = ['codigo', 'descripcion', 'unidad', 'descripciontipoinsumo', 'descripcionfamiliainsumo', 'acciones'];
  cantidadTotalRegistros: any;
  paginaActual = 1;
  cantidadRegistrosAMostrar = 10;
  nombreProyecto = "";
  dropdown = true;
  proyectosReset!: proyectoDTO[];
  length = 20;
  pageEvent!: PageEvent;
  inicioCopia = 0;
  terminoCopia = 20;
      /////////* PAGINATION */////////
      paginatedInsumos: InsumoDTO[] = [];
      currentPage = 1;
      pageSize = 32; // Number of items per page
      totalItems = 0;
      pages: number[] = [];
      visiblePages: number[] = [];
      totalPages = 0;
      /////////* PAGINATION */////////
  @ViewChild("paginado1") paginator!: MatPaginator;
  constructor(private insumoService: InsumoService
    , private _snackBar: MatSnackBar
    , private formBuilder: FormBuilder
    , private tipoInsumoService: TipoInsumoService
    , private familiaInsumoService: FamiliaInsumoService
    , private proyectoService: ProyectoService
    ,public dialog: MatDialog
    
    , private _SeguridadEmpresa: SeguridadService){
      let idEmpresa = _SeguridadEmpresa.obtenIdEmpresaLocalStorage();
      let idProyecto = _SeguridadEmpresa.obtenerIdProyectoLocalStorage();
      this.selectedEmpresa = Number(idEmpresa);
      this.idProyecto = Number(idProyecto);
    }

  ngOnInit(): void {
    // this.cambiarProyecto();
    this.form = this.formBuilder.group({
      descripcion: ['', {validators: [],},]
      , unidad: ['', {validators: [],},]
      , codigo: ['', {validators: [],},]
      , costoUnitario: ['', {validators: [],},]
      , idTipoInsumo: new FormControl()
      , idFamiliaInsumo: new FormControl()
    });
    this.tipoInsumoService.obtenerTodosSinPaginar(this.selectedEmpresa)
    .subscribe((tiposInsumo) => {
      this.tiposInsumo = tiposInsumo;
    });
    this.familiaInsumoService.obtenerTodosSinPaginar(this.selectedEmpresa)
    .subscribe((familiaInsumo) => {
      this.familiasInsumo = familiaInsumo;
    });
    this.proyectoService.obtenerTodosSinEstructurar(this.selectedEmpresa)
    .subscribe((proyectos) => {
      this.proyectos = proyectos;
      this.proyectosReset = proyectos;
    })
    this.cargarRegistros();
  }

  cambiarPaginaCopia(e:PageEvent){
    this.pageEvent = e;
    this.length = e.length;
    this.inicioCopia = e.pageIndex * e.pageSize;
    this.terminoCopia = this.inicioCopia + e.pageSize;
  }

  onTipoInsumoChange(ob: MatSelectChange) {
    this.idTipoInsumo = ob.value;
  }

  onFamiliaInsumoChange(ob: MatSelectChange) {
    this.idFamiliaInsumo = ob.value;
  }

  cargarRegistros(){
    this.insumoService
    .obtenerPaginado(this.idProyecto, this.selectedEmpresa)
    .subscribe((insumos) => {
      this.insumos = insumos;
      this.totalItems = insumos.length;
      this.updatePagination();
      this.updatePaginatedData();
    });
  }

  actualizarPaginacion(datos: PageEvent){
    this.paginaActual = datos.pageIndex + 1;
    this.cantidadRegistrosAMostrar = datos.pageSize;
    this.cargarRegistros();
  }

  onKeyUp(categoria: string, row: InsumoDTO, event: string) {
    this.editaInsumo.id = row.id;
    this.editaInsumo.descripcion = row.descripcion;
    this.editaInsumo.unidad = row.unidad;
    this.editaInsumo.codigo = row.codigo;
    this.editaInsumo.idTipoInsumo = row.idTipoInsumo;
    this.editaInsumo.idFamiliaInsumo = row.idFamiliaInsumo;
    if (typeof event === 'undefined' || !event || event === "") {
      return;
    }
    switch (categoria) {
      case "descripcion":
        this.editaInsumo.descripcion = event;
        break;
      case "unidad":
        this.editaInsumo.unidad = event;
        break;
      case "codigo":
          this.editaInsumo.codigo = event;
          break;
      default:
        break;
    }
    this.insumoService.editar(this.editaInsumo, this.selectedEmpresa)
    .subscribe(() => {});
  }

  traerParaEditar(id: number){
    if (id > 0) {
      this.idEditaInsumo = id;
      if (!this.panelActivado) {
        this.panelActivado = true;
      }
      this.insumoService.obtenerXId(id, this.selectedEmpresa)
      .subscribe((insumo) => {
        this.form.patchValue(insumo);
      });
    }
  }

  borrar(zId: number){
    this.insumoService.borrar(zId, this.selectedEmpresa)
    .subscribe({
      next: () => this.cargarRegistros(),
      error: (zError: any) => console.error(zError),
    });
  }

  activaPanelCapturaRapida(){
    //Aqui se desactiva el panel
    if (this.panelActivado) {
      this.editaInsumo = this.modelo;
      this.panelActivado = false;
      this.form.reset();
    }
    //Aqui se activa el panel
    else{
      this.editaInsumo = this.modelo;
      this.panelActivado = true;
      this.idEditaInsumo = 0;
      this.form.reset();
    }
  }

  limpiarFormulario(){
    this.form.reset();
    this.idEditaInsumo = 0;
  }
  
  editar(insumo: InsumoDTO){
    this.insumoService.editar(insumo, this.selectedEmpresa)
    .subscribe(() => {
      
    })
  }

  // cambiarProyecto(){
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

  openDialogNewInsumo(){
    const dialogOpen = this.dialog.open(DialoNewInsumoComponent,
      {
        data: {
          tiposInsumo: this.tiposInsumo,
          familiasInsumo: this.familiasInsumo,
          idProyecto : this.idProyecto,
          // selectedProyecto: this.selectedProyecto,
          idEditaInsumo: this.idEditaInsumo,
          selectedEmpresa: this.selectedEmpresa,
        }
      }
    );
    dialogOpen.afterClosed().subscribe((result) => {
      if (result) {
        this.cargarRegistros();
        
      }
    });
  }

  
    /////////* PAGINATION */////////

    updatePagination() {
      this.totalPages = Math.ceil(this.totalItems / this.pageSize);
      this.pages = Array.from({ length: this.totalPages }, (_, i) => i + 1);
      this.updateVisiblePages();
    }
  
    updateVisiblePages() {
      const startPage = Math.max(1, this.currentPage - 2);
      const endPage = Math.min(this.totalPages, startPage + 4);
  
      this.visiblePages = Array.from(
        { length: endPage - startPage + 1 },
        (_, i) => startPage + i
      );
  
      if (this.totalPages < 5) {
        this.visiblePages = this.pages;
      }
    }
  
    updatePaginatedData() {
      const startIndex = (this.currentPage - 1) * this.pageSize;
      const endIndex = startIndex + this.pageSize;
      this.paginatedInsumos = this.insumos.slice(startIndex, endIndex);
    }
  
    previousPage() {
      if (this.currentPage > 1) {
        this.currentPage--;
        this.updatePaginatedData();
        this.updateVisiblePages();
      }
    }
  
    nextPage() {
      if (this.currentPage < this.totalPages) {
        this.currentPage++;
        this.updatePaginatedData();
        this.updateVisiblePages();
      }
    }
  
    goToPage(page: number) {
      if (page >= 1 && page <= this.totalPages) {
        this.currentPage = page;
        this.updatePaginatedData();
        this.updateVisiblePages();
      }
    }
  
    getPaginationInfo() {
      return `Página ${this.currentPage} de ${this.totalPages}`;
    }
    ///////////* PAGINATION */////////
}
