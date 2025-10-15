import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, type OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Logs } from './ts.auditorias';
import { AuditoriaService } from './auditorias.service';
import { SeguridadService } from '../seguridad.service';
import { ImagenService } from 'src/app/utilidades/imagen.service';

@Component({
  selector: 'app-auditorias',
  templateUrl: './auditorias.component.html',
  styleUrls: ['./auditorias.component.css'],
})
export class AuditoriasComponent implements OnInit {

  constructor(
    private _seguridadService: SeguridadService,
    private _auditoriaService: AuditoriaService,
    private _imagenService: ImagenService
  ){
    let IdEmpresa = _seguridadService.obtenIdEmpresaLocalStorage();
    this.selectedEmpresa = Number(IdEmpresa);
  }

  fechaInicio: string = '';
  fechaFin: string = '';
  filtroNivel: string = '';
  filtroTexto: string = '';
  filtrarMetodo: boolean = false;
  filtrarDescripcion: boolean = false;
  filtrarDbContext: boolean = false;
  filtrarUsuario: boolean = false;

  mostrarListaUsuario: boolean = false;
  // nombreUsuario: string = '';
  listaLogs: Logs[] = [];
  listaLogsReset: Logs[] = [];
  listaUsuarios: string[] = [];
  listaUsuariosReset: string[] = [];


  isLoading: boolean = false;

  selectedEmpresa: number = 0;

  /////////* PAGINATION */////////
    paginatedLogs: Logs[] = [];
    currentPage = 1;
    pageSize = 32; // Number of items per page
    totalItems = 0;
    pages: number[] = [];
    visiblePages: number[] = [];
    totalPages = 0;

    ////////////////

  ngOnInit(): void { 
    this.obtenerAuditorias();
  }

  obtenerAuditorias(){
    this.isLoading = true;
    this._auditoriaService.obtenerTodos(this.selectedEmpresa).subscribe({next:(datos) => {
      this.listaLogs = datos;
      this.listaLogsReset = datos;
      // this.listaUsuarios = [
      //     ...new Set(this.listaLogs.map((z) => z.nombreUsuario.toString())),
      //   ];
      //   this.listaUsuariosReset = [
      //     ...new Set(this.listaLogs.map((z) => z.nombreEmpresa.toString())),
      //   ];
        this.totalItems = this.listaLogs.length;
        this.updatePagination();
        this.updatePaginatedData();
      this.isLoading = false;
    }, error: () => {
      this.isLoading = false;
    }});
  }

  seleccionNivel(event: any) {
    this.filtroNivel = event.target.value;
    this.filtrarLogs();
  }

  // filtrarUsuario(event: Event) {
  //   const filterValue = (
  //     event.target as HTMLInputElement
  //   ).value.toLocaleLowerCase();
  //   this.nombreUsuario = filterValue;
  //   this.listaUsuarios = this.listaUsuariosReset.filter((z) =>
  //     z.toLocaleLowerCase().includes(filterValue)
  //   );
  //   this.filtrarLogs();
  // }

  filtrarXTexto(){
    this.filtrarLogs();
  }

  // seleccionarUsuario(usuario: string) {
  //   this.nombreUsuario = usuario;
  //   this.mostrarListaUsuario = false;
  //   this.filtrarLogs();
  // }

  filtrarLogs(){
    this.listaLogs = this.listaLogsReset;
    
    if(this.filtroNivel!=''){
      this.listaLogs = this.listaLogs.filter((z) => z.nivel == this.filtroNivel);
    }

    if(this.filtroTexto!='' && (this.filtrarMetodo || this.filtrarDescripcion || this.filtrarDbContext || this.filtrarUsuario)){
      this.listaLogs = this.listaLogs.filter((z) => (z.nombreUsuario.toLowerCase().includes(this.filtroTexto) && this.filtrarUsuario) || (z.metodo.toLowerCase().includes(this.filtroTexto) && this.filtrarMetodo) || (z.descripcion.toLowerCase().includes(this.filtroTexto) && this.filtrarDescripcion) || (z.dbContext.toLowerCase().includes(this.filtroTexto) && this.filtrarDbContext));
    }
    
    const start = this.parseISOToLocal(this.fechaInicio);
    const end = this.parseISOToLocal(this.fechaFin);

    if (start) start.setHours(0, 0, 0, 0);
    if (end) end.setHours(23, 59, 59, 999);

    this.listaLogs = this.listaLogs.filter((z) => {
      const d = this.toDate(z.fecha);
      if (!d) return false;
      return (!start || d >= start) && (!end || d <= end);
    });
    this.updatePagination();
    this.updatePaginatedData();
  }

  private toDate(val: Date | string | null | undefined): Date | null {
    if (!val) return null;
    return val instanceof Date ? val : new Date(val);
  }

  private parseISOToLocal(iso: string): Date | null {
    if (!iso) return null;
    const [y, m, d] = iso.split('-').map(Number);
    return new Date(y, m - 1, d); // ← local, sin saltos por zona
  }

  limpiarFiltros(){
    // this.nombreUsuario = '';
    this.filtrarMetodo = false;
    this.filtrarDescripcion = false;
    this.filtrarDbContext = false;
    this.filtrarUsuario = false;
    this.filtroTexto = '';
    this.filtroNivel = '';
    this.fechaInicio = '';
    this.fechaFin = '';
    this.filtrarLogs();
  }

  ////////////* PAGINACIÓN *//////////////////

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
    this.paginatedLogs = this.listaLogs.slice(startIndex, endIndex);
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

  // /////////////provisional para las imagenes
  // obtenerImagen(){
  //   this._imagenService.obtenerImagen(this.selectedEmpresa, 1).subscribe((res) => {
  //     console.log(res.base64);
  //   });
  // }

  

  // /////////////////////////

}
