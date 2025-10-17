import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ProyectoService } from '../proyecto.service';
import { proyectoDTO } from '../tsProyecto';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { SeguridadService } from 'src/app/seguridad/seguridad.service';
import { DialogNewProyectoComponent } from '../dialog-new-proyecto/dialog-new-proyecto.component';

interface ProyectoDialogResult {
  action: 'create' | 'edit';
  proyecto: proyectoDTO;
}

@Component({
  selector: 'app-proyecto',
  templateUrl: './proyecto.component.html',
  styleUrls: ['./proyecto.component.css'],
})
export class ProyectoComponent implements OnInit {
  proyectoPadre!: proyectoDTO;
  nuevoProyecto: proyectoDTO = {
    id: 0,
    codigoProyecto: '',
    nombre: '',
    noSerie: 0,
    moneda: '',
    presupuestoSinIva: 0,
    tipoCambio: 0,
    presupuestoSinIvaMonedaNacional: 0,
    porcentajeIva: 0,
    presupuestoConIvaMonedaNacional: 0,
    anticipo: 0,
    codigoPostal: 0,
    domicilio: '',
    fechaInicio: new Date(),
    fechaFinal: new Date(),
    tipoProgramaActividad: 0,
    inicioSemana: 0,
    esSabado: true,
    esDomingo: true,
    idPadre: 0,
    nivel: 0,
    expandido: false,
    hijos: [],
  };
  proyectos: proyectoDTO[] = [];
  form!: FormGroup;
  selectedEmpresa = 0;
  menu1 = true;
  menu2 = false;
  seEstaCreando = false;
  /////////* PAGINATION */////////
  paginatedProyectos: proyectoDTO[] = [];
  currentPage = 1;
  pageSize = 32; // Number of items per page
  totalItems = 0;
  pages: number[] = [];
  visiblePages: number[] = [];
  totalPages = 0;

  isLoading: boolean = false;

  /////////* PAGINATION */////////

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      id: ['', { validators: [] }],
      codigoProyecto: ['', { validators: [] }], //
      nombre: ['', { validators: [] }], //
      noSerie: [1, { validators: [] }], //
      moneda: ['MXN', { validators: [] }],
      presupuestoSinIva: [0, { validators: [] }], //
      tipoCambio: ['', { validators: [] }], //
      presupuestoSinIvaMonedaNacional: ['', { validators: [] }],
      porcentajeIva: ['', { validators: [] }], //
      presupuestoConIvaMonedaNacional: [0, { validators: [] }],
      anticipo: ['', { validators: [] }], //
      codigoPostal: ['', { validators: [] }], //
      domicilio: ['', { validators: [] }], //
      fechaInicio: ['', { validators: [] }], //
      fechaFinal: ['', { validators: [] }], //
      tipoProgramaActividad: ['', { validators: [] }], //
      inicioSemana: ['', { validators: [] }], //
      esSabado: [false, { validators: [] }], //
      esDomingo: [false, { validators: [] }], //
      idPadre: ['', { validators: [] }], //
      nivel: ['', { validators: [] }], //
    });
    this.cargarRegistros();
  }

  constructor(
    private proyectoService: ProyectoService,
    private _snackBar: MatSnackBar,
    private formBuilder: FormBuilder,

    private dialog: MatDialog,
    private _SeguridadEmpresa: SeguridadService,
  ) {
    let idEmpresa = _SeguridadEmpresa.obtenIdEmpresaLocalStorage();
    this.selectedEmpresa = Number(idEmpresa);
  }

  cargarRegistros() {
    this.isLoading = true;
    this.proyectoService.obtener(this.selectedEmpresa).subscribe((proyectos) => {
      this.proyectos = proyectos;
      this.totalItems = proyectos.length;
      this.updatePagination();
      this.updatePaginatedData();
    });
    this.isLoading = false;
  }

  expansionDominio(proyecto: proyectoDTO): void {
    proyecto.expandido = !proyecto.expandido;
  }

  crearProyecto(padre: proyectoDTO) {
    if (this.seEstaCreando == false) {
      padre.hijos.unshift({
        id: 0,
        codigoProyecto: '',
        nombre: '',
        noSerie: padre.noSerie,
        moneda: padre.moneda,
        presupuestoSinIva: 0,
        tipoCambio: padre.tipoCambio,
        presupuestoSinIvaMonedaNacional: 0,
        porcentajeIva: 0,
        presupuestoConIvaMonedaNacional: 0,
        anticipo: 0,
        codigoPostal: padre.codigoPostal,
        domicilio: padre.domicilio,
        fechaInicio: padre.fechaInicio,
        fechaFinal: padre.fechaFinal,
        tipoProgramaActividad: padre.tipoProgramaActividad,
        inicioSemana: padre.inicioSemana,
        esSabado: padre.esSabado,
        esDomingo: padre.esDomingo,
        idPadre: padre.id,
        nivel: 0,
        expandido: false,
        hijos: [],
      });
      padre.expandido = true;
      this.proyectoPadre = padre;
      this.seEstaCreando = true;
    }
  }

  crear(proyecto: proyectoDTO) {
    if (
      typeof proyecto.nombre == undefined ||
      !proyecto.nombre ||
      proyecto.nombre == '' ||
      typeof proyecto.codigoProyecto == undefined ||
      !proyecto.codigoProyecto ||
      proyecto.codigoProyecto == '' ||
      typeof proyecto.anticipo == undefined ||
      !proyecto.anticipo
    ) {
      this._snackBar.open('Capture todos los campos', 'X', { duration: 3000 });
      return;
    }
    let proyectoGuardado = proyecto;
    this.proyectoService.crearYObtener(proyecto, this.selectedEmpresa).subscribe((proyecto) => {
      proyectoGuardado = proyecto;
      this.proyectoPadre.hijos.shift();
      this.proyectoPadre.hijos.push(proyectoGuardado);
    });
    this.seEstaCreando = false;
  }

  guardar() {
    this.nuevoProyecto = this.form.value;
    this.nuevoProyecto.id = 0;
    this.nuevoProyecto.nivel = 0;
    this.nuevoProyecto.presupuestoSinIvaMonedaNacional = 0;
    this.nuevoProyecto.nivel = 1;
    this.nuevoProyecto.idPadre = 0;
    this.nuevoProyecto.inicioSemana = 1;
    this.nuevoProyecto.anticipo = 0;
    this.nuevoProyecto.tipoProgramaActividad = 1;
    this.nuevoProyecto.tipoCambio = 0;
    this.nuevoProyecto.esSabado = true;
    this.nuevoProyecto.esDomingo = true;
    this.nuevoProyecto.noSerie = 1;
    this.nuevoProyecto.porcentajeIva = 16;
    this.nuevoProyecto.moneda = 'MXN';
    this.proyectoService.crear(this.nuevoProyecto, this.selectedEmpresa).subscribe(() => {
      this.cargarRegistros();
    });
    this.form.value.reset();
  }

  mostrarMenu1() {
    this.menu1 = true;
    this.menu2 = false;
  }

  mostrarMenu2() {
    this.menu2 = true;
    this.menu1 = false;
  }
  openDialogNewProyecto() {
    const dialogRef = this.dialog.open(DialogNewProyectoComponent, {
      data: {
        menu1: this.menu1,
        selectedEmpresa: this.selectedEmpresa,
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      this.handleDialogResult(result);
    });
  }

  private handleDialogResult(result: ProyectoDialogResult | boolean | undefined) {
    if (result === undefined || result === false) {
      return;
    }

    if (typeof result === 'boolean') {
      if (result) {
        this.cargarRegistros();
      }
      return;
    }

    if (result.action === 'create') {
      this.proyectos = [result.proyecto, ...this.proyectos];
      this.totalItems = this.proyectos.length;
      this.currentPage = 1;
      this.updatePagination();
      this.updatePaginatedData();
      return;
    }

    if (result.action === 'edit') {
      const index = this.proyectos.findIndex((proyecto) => proyecto.id === result.proyecto.id);

      if (index === -1) {
        this.cargarRegistros();
        return;
      }

      this.proyectos[index] = { ...this.proyectos[index], ...result.proyecto };
      this.updatePaginatedData();
    }
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

    this.visiblePages = Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);

    if (this.totalPages < 5) {
      this.visiblePages = this.pages;
    }
  }

  updatePaginatedData() {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.paginatedProyectos = this.proyectos.slice(startIndex, endIndex);
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

  eliminarProyecto(proyecto: proyectoDTO) {
    const idProyecto = proyecto.id;
    this.proyectoService.eliminar(idProyecto, this.selectedEmpresa).subscribe(() => {
      this.cargarRegistros();
    });
  }

  editarProyecto(proyecto: proyectoDTO) {
    const dialogRef = this.dialog.open(DialogNewProyectoComponent, {
      data: {
        menu1: this.menu1,
        selectedEmpresa: this.selectedEmpresa,
        proyecto: proyecto,
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      this.handleDialogResult(result);
    });
  }
}
