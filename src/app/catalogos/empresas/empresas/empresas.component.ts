import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { EmpresaService } from '../empresa.service';
import { Corporativo, Empresa, EmpresaDTO, ParametroEmpresa } from '../empresa';
import { UtilidadesService } from 'src/app/utilidades/utilidades.service';
import { EmpresaParametroService } from 'src/app/catalogos/empresas/empresa-parametro.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CorporativoService } from '../../corporativo/corporativo.service';
import { corporativo } from 'src/app/seguridad/usuario-multi-empresa/tsUsuarioMultiEmpresa';
import { UsuarioCorporativoService } from 'src/app/seguridad/Servicios/usuario-corporativo.service';
import { EditCompaniesComponent } from '../acciones/edit-companies/edit-companies.component';

@Component({
  selector: 'app-empresas',
  templateUrl: './empresas.component.html',
  styleUrls: ['./empresas.component.css']
})
export class EmpresasComponent implements OnInit {
  selectedEmpresa: number = 0;
  empresa!: EmpresaDTO[];
  empresaReset: EmpresaDTO[] = [];
  empresaFormulario!: FormGroup;
  dataInicio: EmpresaDTO[] = [];
  listaCorporativos: corporativo[] = [];
  selectedCorporativo: number = 0;
  //diferenciaMax! : DiferenciaMaxDTO[];
  @ViewChild(MatPaginator) paginacionTabla!: MatPaginator;
  /////////* PAGINATION */////////
  paginatedempresas: EmpresaDTO[] = [];
  currentPage = 1;
  pageSize = 20; // Number of items per page
  totalItems = 0;
  pages: number[] = [];
  visiblePages: number[] = [];
  totalPages = 0;
  /////////* PAGINATION */////////

  constructor(
    private dialog: MatDialog,
    private _empresaServicio: EmpresaService,
    private _UsuarioCorporativoService: UsuarioCorporativoService,
    private fb: FormBuilder
  ) {
    this.empresaFormulario = this.fb.group({
      nombreComercial: ['', Validators.required],
      rfc: ['', Validators.required],
      estatus: true,
      idCorporativo: ['', Validators.required],
      sociedad: ['', Validators.required],
    });
  }

  obtenerCorporativos(){
    this._UsuarioCorporativoService.obtenCorporativosPertenecientes().subscribe((datos) => {
      this.listaCorporativos = datos;
      if (datos.length > 0) {
        this.selectedCorporativo = datos[0].id;
        this.obtenerEmpresa(this.selectedCorporativo);
      }
    });
  }

  obtenerEmpresa(idCorporativo: number) {
    this._empresaServicio.ObtenXIdCorporativo(idCorporativo)
    .subscribe((datos) => {
      this.empresa = datos;
      this.empresaReset = datos;
      this.totalItems = datos.length;
      this.updatePagination();
      this.updatePaginatedData();
    });
  }

  ngOnInit(): void {
    this.obtenerCorporativos();
  }

  aplicarFiltroTabla(event: string) {
    this.empresa = this.empresaReset.filter((empresa) => {
      return empresa.nombreComercial.toLowerCase().includes(event.toLowerCase());
    });
    this.updatePagination();
    this.updatePaginatedData();
  }

  openModalNuevaEmpresa(){
    if (this.selectedCorporativo <= 0) {
      return;
    }
    this.dialog
      .open(EditCompaniesComponent, {
        disableClose: true,
        width: '50%',
        data: {idCorporativo: this.selectedCorporativo}
      })
      .afterClosed()
      .subscribe(() => {
        this.obtenerEmpresa(this.selectedCorporativo);
      });
  }

  openModalEditarEmpresa(empresa: EmpresaDTO){
    if (this.selectedCorporativo <= 0) {
      return;
    }
    this.dialog
      .open(EditCompaniesComponent, {
        disableClose: true,
        width: '50%',
        data: empresa
      })
      .afterClosed()
      .subscribe(() => {
        this.obtenerEmpresa(this.selectedCorporativo);
      });
  }

  /////////* PAGINATION */////////
  //#region Paginacion
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
    this.paginatedempresas = this.empresa.slice(startIndex, endIndex);
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
  //#endregion
  ///////////* PAGINATION */////////

}
