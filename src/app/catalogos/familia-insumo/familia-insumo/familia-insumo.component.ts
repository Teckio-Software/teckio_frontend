import { ChangeDetectorRef, Component, Input, ViewChild } from '@angular/core';
import { FamiliaInsumoService } from '../familia-insumo.service';
import { MatTable } from '@angular/material/table';
import { familiaInsumoCreacionDTO, familiaInsumoDTO } from '../tsFamilia';
import { HttpResponse } from '@angular/common/http';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SeguridadService } from 'src/app/seguridad/seguridad.service';
import { MatDialog } from '@angular/material/dialog';
import { DialogNewFamilyComponent } from '../dialog-new-family/dialog-new-family.component';
import { ModalAlertComponent } from 'src/app/utilidades/modal-alert/modal-alert.component';

@Component({
  selector: 'app-familia-insumo',
  templateUrl: './familia-insumo.component.html',
  styleUrls: ['./familia-insumo.component.css']
})
export class FamiliaInsumoComponent {
  form!: FormGroup;
  @ViewChild('table')
  table?: MatTable<any>;
  selectedEmpresa = 0;
  idEditaFamiliaInsumo: number = 0;
  panelActivado: boolean = false;
  familias!: familiaInsumoDTO[];
  editaFamiliaInsumo: familiaInsumoDTO = {
    id: 0,
    descripcion: ''
  };
  @ViewChild("paginado1") paginator!: MatPaginator;
  zvColumnasAMostrar = ['descripcion', 'acciones'];
  cantidadTotalRegistros: any;
  paginaActual = 1;
  cantidadRegistrosAMostrar = 10;

    /////////* PAGINATION */////////
    paginatedFamilia: familiaInsumoDTO[] = [];
    currentPage = 1;
    pageSize = 32; // Number of items per page
    totalItems = 0;
    pages: number[] = [];
    visiblePages: number[] = [];
    totalPages = 0;

    isLoading: boolean = true;

    /////////* PAGINATION */////////

  constructor(private familiaService: FamiliaInsumoService
    , private formBuilder: FormBuilder
    , private _snackBar: MatSnackBar
    , private _SeguridadEmpresa: SeguridadService
    ,public dialog: MatDialog
    ) {
        let idEmpresa = _SeguridadEmpresa.obtenIdEmpresaLocalStorage();
        this.selectedEmpresa = Number(idEmpresa);
    }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      descripcion: ['', {validators: [],},]
    });
    this.cargarRegistros();
  }



  cargarRegistros(){
    this.familiaService.obtenerTodosSinPaginar(this.selectedEmpresa)
    .subscribe((familias) =>{
      this.familias = familias;
      this.isLoading = false;
      this.totalItems = familias.length;
      this.updatePagination();
      this.updatePaginatedData();
    })
  }

  traerParaEditar(id: number){
    if (id > 0) {
      this.idEditaFamiliaInsumo = id;
      this.panelActivado = true;
      this.familiaService.obtenerXId(id, this.selectedEmpresa)
      .subscribe({
        next: (familia) => {
          this.form.patchValue(familia);
          this.idEditaFamiliaInsumo = familia.id;
        },
        error: (zError: any) => console.error(zError),
      });
    }
  }

  onSubmit(){
    this.editaFamiliaInsumo = this.form.value;
    if (typeof this.editaFamiliaInsumo.descripcion === 'undefined' || !this.editaFamiliaInsumo.descripcion || this.editaFamiliaInsumo.descripcion === "") {
        this._snackBar.open("Capture todos los campos", "X", {duration: 3000});
        return;
    }
    if (this.idEditaFamiliaInsumo > 0) {
      this.editaFamiliaInsumo.id = this.idEditaFamiliaInsumo;
      this.familiaService.editar(this.editaFamiliaInsumo, this.selectedEmpresa)
      .subscribe({
        next: () => this.cargarRegistros(),
        error: (zError: any) => console.error(zError),
      });
    }
    if (this.idEditaFamiliaInsumo <= 0) {
      this.familiaService.crear(this.editaFamiliaInsumo, this.selectedEmpresa)
      .subscribe({
        next: () => this.cargarRegistros(),
        error: (zError: any) => console.error(zError),
      });
    }
    this.idEditaFamiliaInsumo = 0;
    this.form.reset();
  }

  actualizarPaginacion(datos: PageEvent){
    this.paginaActual = datos.pageIndex + 1;
    this.cantidadRegistrosAMostrar = datos.pageSize;
    this.cargarRegistros();
  }

  borrar(zId: number){
    this.familiaService.borrar(zId, this.selectedEmpresa)
      .subscribe({
        next: () => this.cargarRegistros(),
        error: (zError: any) => console.error(zError),
      });
  }

  onKeyUp(categoria: string, row: familiaInsumoDTO, event: string) {
    this.editaFamiliaInsumo.id = row.id;
    this.editaFamiliaInsumo.descripcion = row.descripcion;
    if (typeof event === 'undefined' || !event || event === "") {
      return;
    }
    switch (categoria) {
      case "descripcion":
        this.editaFamiliaInsumo.descripcion = event;
        break;
      default:
        break;
    }
    this.familiaService.editar(this.editaFamiliaInsumo, this.selectedEmpresa)
    .subscribe({
      next: () => {}
      , error: (zError: any) => {
        console.error(zError);
      }
    });
  }

  activaPanelCapturaRapida(){
    //Aqui se desactiva el panel
    if (this.panelActivado) {
      this.form.reset();
      this.panelActivado = false;
      this.idEditaFamiliaInsumo = 0;
    }
    //panel activado
    else{
      this.form.reset();
      this.panelActivado = true;
      this.idEditaFamiliaInsumo = 0;
    }
  }

  limpiarFormulario(){
    this.form.reset();
    this._snackBar.dismiss();
    this.idEditaFamiliaInsumo = 0;
  }

  editar(element: familiaInsumoDTO){
    this.familiaService.editar(element, this.selectedEmpresa)
    .subscribe(() =>{
      
    })
  }

 
  openDialogNewFamily(){
  const dialogOpen = this.dialog.open(DialogNewFamilyComponent , 
    {
      data: {
        selectedEmpresa: this.selectedEmpresa,
        idEditaFamiliaInsumo: this.idEditaFamiliaInsumo,
      }
    }

  )
  dialogOpen.afterClosed().subscribe((result) => {
    if (result) {
      this.cargarRegistros();
    }
  });
  }


  abrirDialogo(familiaId: number): void {
    const dialogRef = this.dialog.open(ModalAlertComponent, {
        data: {
            titulo: '',
            mensaje: '¿Quieres eliminar el periodo?',
            funcionAceptarFamilia: this.borrar.bind(this),
            familiaId: familiaId,
        }
    });

    dialogRef.afterClosed().subscribe((resultado: boolean) => {
        // Verifica si se realizó la eliminación para actualizar los datos si es necesario
        if (resultado) {
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
      this.paginatedFamilia = this.familias.slice(startIndex, endIndex);
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
