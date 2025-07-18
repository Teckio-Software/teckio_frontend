import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { especialidadDTO } from '../tsEspecialidad';
import { MatSnackBar } from '@angular/material/snack-bar';
import { EspecialidadService } from '../especialidad.service';
import { HttpResponse } from '@angular/common/http';
import { PageEvent } from '@angular/material/paginator';
import { SeguridadService } from 'src/app/seguridad/seguridad.service';
import { DialogNewEspecialidadComponent } from '../dialog-new-especialidad/dialog-new-especialidad.component';
import { MatDialog } from '@angular/material/dialog';
import { ModalAlertComponent } from 'src/app/utilidades/modal-alert/modal-alert.component';

@Component({
  selector: 'app-especialidades',
  templateUrl: './especialidades.component.html',
  styleUrls: ['./especialidades.component.css'],
})
export class EspecialidadesComponent implements OnInit {
  form!: FormGroup;
  selectedEmpresa = 0;
  idEditaEspecialidad: number = 0;
  modelo: especialidadDTO = {
    id: 0,
    descripcion: '',
    codigo: '',
  };
  editaEspecialidad: especialidadDTO = {
    id: 0,
    descripcion: '',
    codigo: '',
  };
  panelActivado: boolean = false;
  especialidades!: especialidadDTO[];
  paginaActual = 1;
  cantidadRegistrosAMostrar = 10;

  /////////* PAGINATION */////////
  paginatedEspecialidad: especialidadDTO[] = [];
  currentPage = 1;
  pageSize = 32; // Number of items per page
  totalItems = 0;
  pages: number[] = [];
  visiblePages: number[] = [];
  totalPages = 0;
  /////////* PAGINATION */////////

  constructor(
    private especialidadService: EspecialidadService,
    private _snackBar: MatSnackBar,
    private formBuilder: FormBuilder,
    public dialog: MatDialog,

    private _SeguridadEmpresa: SeguridadService
  ) {
    let idEmpresa = _SeguridadEmpresa.obtenIdEmpresaLocalStorage();
    this.selectedEmpresa = Number(idEmpresa);
  }
  columnasAMostrar = ['codigo', 'descripcion', 'acciones'];
  ngOnInit(): void {
    this.form = this.formBuilder.group({
      codigo: ['', { validators: [] }],
      descripcion: ['', { validators: [] }],
    });
    this.cargarRegistros();
  }


  cargarRegistros() {
    this.especialidadService
      .obtener(this.selectedEmpresa)
      .subscribe((especialidades) => {
        this.especialidades = especialidades;
        this.totalItems = especialidades.length;
        this.updatePagination();
        this.updatePaginatedData();
      });
  }

  actualizarPaginacion(datos: PageEvent) {
    this.paginaActual = datos.pageIndex + 1;
    this.cantidadRegistrosAMostrar = datos.pageSize;
    this.cargarRegistros();
  }

  onKeyUp(categoria: string, row: especialidadDTO, event: string) {
    this.editaEspecialidad.id = row.id;
    this.editaEspecialidad.codigo = row.codigo;
    this.editaEspecialidad.descripcion = row.descripcion;
    if (typeof event === 'undefined' || !event || event === '') {
      return;
    }
    switch (categoria) {
      case 'codigo':
        this.editaEspecialidad.codigo = event;
        break;
      case 'descripcion':
        this.editaEspecialidad.descripcion = event;
        break;
      default:
        break;
    }
    this.especialidadService
      .editar(this.editaEspecialidad, this.selectedEmpresa)
      .subscribe(() => {});
  }

  traerParaEditar(id: number) {
    if (id > 0) {
      this.idEditaEspecialidad = id;
      if (!this.panelActivado) {
        this.panelActivado = true;
      }
      this.especialidadService
        .obtenerXId(id, this.selectedEmpresa)
        .subscribe((especialidad) => {
          this.form.patchValue(especialidad);
        });
    }
  }

  borrar(zId: number) {
    this.especialidadService.borrar(zId, this.selectedEmpresa).subscribe({
      next: () => this.cargarRegistros(),
      error: (zError: any) => console.error(zError),
    });
  }

  activaPanelCapturaRapida() {
    //Aqui se desactiva el panel
    if (this.panelActivado) {
      this.editaEspecialidad = this.modelo;
      this.panelActivado = false;
      this.form.reset();
    }
    //Aqui se activa el panel
    else {
      this.editaEspecialidad = this.modelo;
      this.panelActivado = true;
      this.idEditaEspecialidad = 0;
      this.form.reset();
    }
  }

  limpiarFormulario() {
    this.form.reset();
    this.idEditaEspecialidad = 0;
  }

  editar(especialidad: especialidadDTO) {
    this.especialidadService
      .editar(especialidad, this.selectedEmpresa)
      .subscribe(() => {});
  }
  openDialogNewEspecialidades() {
    const dialogRef = this.dialog.open(DialogNewEspecialidadComponent, {
      data: {
        idEditaEspecialidad: this.idEditaEspecialidad,
        selectedEmpresa: this.selectedEmpresa,
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      this.cargarRegistros();
    });
  }
  abrirDialogo(especialidadId: number): void {
    const dialogRef = this.dialog.open(ModalAlertComponent, {
      data: {
        titulo: '',
        mensaje: '¿Quieres eliminar el periodo?',
        funcionAceptarEspecialidad: this.borrar.bind(this),
        especialidadId: especialidadId,
      },
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
    this.paginatedEspecialidad = this.especialidades.slice(
      startIndex,
      endIndex
    );
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
