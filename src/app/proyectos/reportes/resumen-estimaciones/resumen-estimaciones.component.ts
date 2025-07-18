import { Component, EventEmitter, Output } from '@angular/core';
import { ReportesService } from '../reportes.service';
import { SeguridadService } from 'src/app/seguridad/seguridad.service';
import { EstimacionesDTO, PeriodoResumenDTO } from '../../estimaciones/tsEstimaciones';
import { EstimacionesService } from '../../estimaciones/estimaciones.service';
import { FormControl, FormGroup } from '@angular/forms';
import { formatDate } from '@angular/common';

@Component({
  selector: 'app-resumen-estimaciones',
  templateUrl: './resumen-estimaciones.component.html',
  styleUrls: ['./resumen-estimaciones.component.css']
})
export class ResumenEstimacionesComponent {

  @Output() total = new EventEmitter();

  changeColor: any = null;
  ocultarTablaDetalles: boolean = false;

  selectedEmpresa: number = 0;
  selectedProyecto: number = 0;
  periodos : PeriodoResumenDTO[] = [];
  periodosReset : PeriodoResumenDTO[] = [];
  estimaciones : EstimacionesDTO[] = [];
  totalPeridos : number = 0;
  totalConFormato : string = "0.00";

  /////////* PAGINATION */////////
  // paginatedProyectos: proyectoDTO[] = [];
  currentPage = 1;
  pageSize = 32; // Number of items per page
  totalItems = 0;
  pages: number[] = [];
  visiblePages: number[] = [];
  totalPages = 0;
  /////////* PAGINATION */////////


  /////////* PAGINATION */////////

  range = new FormGroup({
    start: new FormControl,
    end: new FormControl,
  });

  fechaInicio !: Date | string;
  fechaFin !: Date | string;

  constructor(
    private _reporteService: ReportesService,
    private _seguridadService: SeguridadService,
    private _estimacionesService : EstimacionesService
  ) {
    let idEmpresa = _seguridadService.obtenIdEmpresaLocalStorage();
    let idProyecto = _seguridadService.obtenerIdProyectoLocalStorage();
    this.selectedProyecto = Number(idProyecto);
    this.selectedEmpresa = Number(idEmpresa);
  }

  ngOnInit(): void {
    this._reporteService.ObtenerPeridosConImporteTotal(this.selectedEmpresa, this.selectedProyecto).subscribe((datos) => {
      this.periodosReset = datos;
      this.periodos = datos;
      this.calcularTotal();
    })
  }

  calcularTotal(){
    this.updatePagination();
    this.updatePaginatedData();
    this.totalItems = this.periodos.length;
    this.totalPeridos = 0;
    this.periodos.forEach((element) => {
      this.totalPeridos += element.importe;
    });
    this.totalConFormato = new Intl.NumberFormat('es-MX', { minimumFractionDigits: 2 }).format(this.totalPeridos);

  }

  VerDetalles(idPerido : number){
    this.ocultarTablaDetalles = true;
  this.changeColor = idPerido;
    this._estimacionesService.obtenerEstimacionesXReportes(idPerido, this.selectedEmpresa).subscribe((datos) => {
      this.estimaciones = datos;
    });
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
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

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePaginatedData();
      this.updateVisiblePages();
    }
  }

  updatePagination() {
    this.totalPages = Math.ceil(this.totalItems / this.pageSize);
    this.pages = Array.from({ length: this.totalPages }, (_, i) => i + 1);
    this.updateVisiblePages();
  }

  updatePaginatedData() {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    // this.paginatedProyectos = this.proyectos.slice(startIndex, endIndex);
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

  getPaginationInfo() {
    return `Página ${this.currentPage} de ${this.totalPages}`;
  }

  clickButtonFiltro() {
    if ((typeof this.range.get("start")?.value != 'undefined' && this.range.get("start")?.value != null) && (typeof this.range.get("end")?.value != 'undefined' && this.range.get("end")?.value != null)) {
      this.fechaInicio = formatDate(this.range.get("start")?.value, 'yyyy-MM-dd', 'en_US');
      this.fechaFin = formatDate(this.range.get("end")?.value, 'yyyy-MM-dd', 'en_US');
      var peridosFiltrados = this.periodosReset.filter(z => formatDate(z.fechaInicio, 'yyyy-MM-dd', 'en_US')  >= this.fechaInicio && formatDate(z.fechaTermino, 'yyyy-MM-dd', 'en_US') <= this.fechaFin);
      this.periodos = peridosFiltrados;
    }else{
      this.periodos = this.periodosReset;
    }
    this.calcularTotal();
  }

  limpiarFiltro() { 
    this.range.reset();
    this.clickButtonFiltro();
  }





}
