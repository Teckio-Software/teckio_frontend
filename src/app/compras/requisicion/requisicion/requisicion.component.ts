import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { requisicionCreacionDTO, listaRequisicionDTO } from '../tsRequisicion';
import { RequisicionService } from '../requisicion.service';
import { insumoXRequisicionCreacion } from '../../insumos-requicision/insumoxrequisicion/tsInsumoXRequisicion';
import { proyectoDTO } from 'src/app/proyectos/proyecto/tsProyecto';
import { ProyectoService } from 'src/app/proyectos/proyecto/proyecto.service';
import { almacenDTO } from 'src/app/inventario/almacen/almacen';
import { AlmacenService } from 'src/app/inventario/almacen/almacen.service';
import { MatDialog } from '@angular/material/dialog';
import { SeguridadService } from 'src/app/seguridad/seguridad.service';
import Swal from 'sweetalert2';
import { CotizacionComponent } from '../../cotizacion/cotizacion/cotizacion.component';
import { ModalNewRequisicionComponent } from '../modal-new-requisicion/modal-new-requisicion.component';
import { esCotizacionFuncion } from 'src/app/safe.guard';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { AlertaTipo } from 'src/app/utilidades/alert/alert.component';
import { RequisicionDTO } from 'src/app/dashboard/types/RequisicionDTO';

@Component({
  selector: 'app-requisicion',
  templateUrl: './requisicion.component.html',
  styleUrls: ['./requisicion.component.css'],
})
export class RequisicionComponent implements OnInit {
  @ViewChild('closeModal') closeModal!: ElementRef;
  @ViewChild('textarea') textarea!: ElementRef<HTMLTextAreaElement>;
  selectedIndex: number = 0;
  veiewInsumos: boolean = false;
  esInsumos: boolean = false;
  esInsumosCotizacion: boolean = false;
  esCotizaciones: boolean = false;
  botones: boolean = false;
  seEstaCambiando: boolean = false;
  changeColor: any = null;
  descripcionTitulo: string = '';
  noRequisicion: string = '';
  insumosEstado: boolean = false;
  descripcionContent: string = '';

  isLoading: boolean = true;

  alertaSuccess: boolean = false;
  alertaMessage: string = '';
  alertaTipo: AlertaTipo = AlertaTipo.none;
  AlertaTipo = AlertaTipo;

  ngOnInit(): void {
    this.proyectoSeleccionado = true;
    this.cargarRegistros();
    this.form = this.FormBuilder.group({
      almacen: ['', { validators: [] }],
      observaciones: ['', { validators: [] }],
    });
    const hoy = new Date();
    const ayer = new Date(hoy);
    ayer.setDate(hoy.getDate() - 1);
    this.listaInsumosCrear.push({
      descripcion: '',
      unidad: '',
      cantidad: 0,
      folio: '',
      personaIniciales: '',
      denominacionBool: false,
      denominacion: 0,
      observaciones: '',
      fechaEntrega: ayer,
      idTipoInsumo: 0,
      idInsumo: 0,
      cUnitario: 0,
      cPresupuestada: 0,
      idRequisicion: 0,
    });
  }
  proyectoSeleccionado!: boolean;
  selectedEmpresa = 0;
  selectedRequisicion: number = 0;
  form!: FormGroup;
  proyectos!: proyectoDTO[];
  idProyecto: number = 0;
  idCotizacion: number = 0;
  idCotizacionparaOC: number = 0;
  idOrdenCompra: number = 0;
  idOrdenCompraParaEA: number = 0;
  idEntradaAlmacen: number = 0;
  almacenes!: almacenDTO[];
  requisiciones!: listaRequisicionDTO[];
  requisicionesReset!: listaRequisicionDTO[];
  listaInsumosCrear: insumoXRequisicionCreacion[] = [];
  requisicion: requisicionCreacionDTO = {
    idProyecto: 0,
    observaciones: '',
    listaInsumosRequisicion: [],
    residente: '',
  };
  requisicionEditada: listaRequisicionDTO = {
    id: 0,
    idProyecto: 0,
    noRequisicion: '',
    personaSolicitante: '',
    observaciones: '',
    fechaRegistro: '',
    residente: '',
    estatusRequisicion: 0,
    estatusInsumosComprados: 0,
    estatusInsumosCompradosDescripcion: '',
    estatusInsumosSurtIdos: 0,
    estatusInsumosSurtIdosDescripcion: '',
  };

  appRecarga: number = 1;
  tablaCotizacion: boolean = false;
  modalCotizacion: boolean = false;
  esCotizacion!: boolean;

  @ViewChild('testInput') testInput: any;
  observacion!: string;

  /////////* PAGINATION */////////
  paginatedRequisicion: listaRequisicionDTO[] = [];
  currentPageAnterior = 1;
  currentPage = 1;
  pageSize = 10; // Number of items per page
  totalItems = 0;
  pages: number[] = [];
  visiblePages: number[] = [];
  totalPages = 0;
  /////////* PAGINATION */////////


  requisicionSeleccionada : listaRequisicionDTO = {
    id: 0,
    idProyecto: 0,
    noRequisicion: '',
    personaSolicitante: '',
    observaciones: '',
    fechaRegistro: '',
    estatusRequisicion: 0,
    estatusInsumosComprados: 0,
    estatusInsumosCompradosDescripcion: '',
    estatusInsumosSurtIdos: 0,
    estatusInsumosSurtIdosDescripcion: '',
    residente: ''
  }

  constructor(
    private proyectoService: ProyectoService,
    private _SeguridadEmpresa: SeguridadService,
    private _almacenService: AlmacenService,
    private _requisicionService: RequisicionService,
    private FormBuilder: FormBuilder,
    private dialog: MatDialog
  ) {
    let idEmpresa = _SeguridadEmpresa.obtenIdEmpresaLocalStorage();
    let idProyecto = _SeguridadEmpresa.obtenerIdProyectoLocalStorage();
    this.selectedEmpresa = Number(idEmpresa);
    this.idProyecto = Number(idProyecto);
    this.proyectoSeleccionado = false;
    this.esCotizacion = esCotizacionFuncion();
  }

  cargarRegistros() {
    this._requisicionService
      .obtenerXIdProyecto(this.selectedEmpresa, this.idProyecto)
      .subscribe((datos) => {
        this.requisiciones = datos;
        this.totalItems = this.requisiciones.length;
        this.updatePagination();
        this.updatePaginatedData();
        this.requisicionesReset = datos;
        this.isLoading = false;
      });
    this.appRecarga = this.appRecarga + 1;
  }

  abrirDialogo(): void {
    const dialogRef = this.dialog.open(ModalNewRequisicionComponent, {
      data: {
        almacenes: this.almacenes,
        listaInsumosCrear: [],
        selectedEmpresa: this.selectedEmpresa,
        idProyecto: this.idProyecto,
        titulo: '',
        mensaje: '¿Quieres eliminar el periodo?',
      },
    });
    dialogRef.afterClosed().subscribe((resultado: boolean) => {
      // Verifica si se realizó la eliminación para actualizar los datos si es necesario
      this.cargarRegistros();
    });
  }

  alerta(tipo: AlertaTipo, mensaje: string = '') {
    if (tipo === AlertaTipo.none) {
      this.cerrarAlerta();
      return;
    }

    this.alertaTipo = tipo;
    this.alertaMessage = mensaje || 'Ocurrió un error';
    this.alertaSuccess = true;

    setTimeout(() => {
      this.cerrarAlerta();
    }, 3000);
  }

  cerrarAlerta() {
    this.alertaSuccess = false;
    this.alertaTipo = AlertaTipo.none;
    this.alertaMessage = '';
  }

  focus() {
    this.textarea.nativeElement.focus();
  }

  crearRequisicion() {
    this.requisicion.idProyecto = this.idProyecto;
    this.requisicion.observaciones = '';
    this.requisicion.residente = '';

    this.requisicion.listaInsumosRequisicion = [];
    this._requisicionService
      .CrearRequisicion(this.selectedEmpresa, this.requisicion)
      .subscribe((datos) => {
        if (datos.estatus) {
          this.alerta(AlertaTipo.save, datos.descripcion);
          this.cargarRegistros();

          setTimeout(() => {
            this.verInsumos(this.requisiciones[0]);
          }, 2000);
        } else {
          this.alerta(AlertaTipo.error, datos.descripcion);
        }
      });
  }

  eliminarRequisicion(id: number) {
    this._requisicionService
      .eliminar(this.selectedEmpresa, id)
      .subscribe((datos) => {
        if (datos.estatus) {
          this.veiewInsumos = false;
          this.alerta(AlertaTipo.delete, 'Requisición eliminada');
          this.cargarRegistros();
          this.insumosEstado = false;
        } else {
          this.alerta(AlertaTipo.error, datos.descripcion);
        }
      });
  }

  editarObservacion(requisicion: listaRequisicionDTO) {
    this.descripcionTitulo =
      'Agrega una descripción a la requisición seleccionada';
    this.noRequisicion = requisicion.noRequisicion;
    this.requisicionEditada = requisicion;
    this.observacion = requisicion.observaciones;
    this.testInput.nativeElement.style.display = 'flex';
  }

  editaObservacionTextArea() {
    this.requisicionEditada.observaciones = this.observacion;
    this.editarRequisicion(this.requisicionEditada);
  }

  ocultarTextArea() {
    this.descripcionTitulo = '';
    this.testInput.nativeElement.style.display = 'none';
  }

  editarRequisicion(editada: listaRequisicionDTO) {
    this.descripcionTitulo = '';
    this.noRequisicion = '';

    this._requisicionService
      .EditarRequisicion(this.selectedEmpresa, editada)
      .subscribe((datos) => {
        if (datos.estatus) {
          this.alerta(AlertaTipo.edit, datos.descripcion);
          this.testInput.nativeElement.style.display = 'none';
        } else {
          Swal.fire({
            title: 'Error',
            text: datos.descripcion,
            icon: 'error',
          });
        }
      });
  }

  limpiarRequisicion() {
    this.requisicion.idProyecto = 0;
    this.requisicion.observaciones = '';
    this.requisicion.listaInsumosRequisicion = [];
  }

  verInsumos(requisicion: listaRequisicionDTO) {
    if (requisicion.id == this.changeColor) {
      this.requisiciones = this.requisicionesReset;
      this.totalItems = this.requisiciones.length;
      this.currentPage = this.currentPageAnterior;
      this.updatePagination();
      this.updatePaginatedData();
      this.changeColor = 0;
      this.veiewInsumos = false;
      this.insumosEstado = false;
      return;
    }

    this.requisiciones = [];
    this.requisiciones.push(requisicion);
    this.totalItems = this.requisiciones.length;
    this.currentPageAnterior = this.currentPage;
    this.currentPage = 1;
    this.updatePagination();
    this.updatePaginatedData();
    this.changeColor = requisicion.id;
    this.veiewInsumos = true;
    this.selectedRequisicion = requisicion.id;
    this.appRecarga = this.appRecarga + 1;
    this.esInsumos = true;
    this.esInsumosCotizacion = false;
    this.esCotizaciones = false;
    this.botones = true;
    this.insumosEstado = true;
    this.noRequisicion = '';
    this.observacion = requisicion.observaciones;
    this.requisicionSeleccionada = requisicion;
  }


  VerInsumosRequisicion() {
    this.idCotizacion = 0;
    this.esInsumos = true;
    this.esInsumosCotizacion = false;
    this.esCotizaciones = false;
    this.appRecarga = this.appRecarga + 1;
  }

  VerInsumosCotizacion() {
    this.idCotizacion = 0;
    this.esInsumos = false;
    this.esInsumosCotizacion = true;
    this.esCotizaciones = false;
    this.appRecarga = this.appRecarga + 1;
  }

  VerCotizaciones() {
    this.esInsumos = false;
    this.esInsumosCotizacion = false;
    this.esCotizaciones = true;
    this.appRecarga = this.appRecarga + 1;
  }

  AgregarCotizacion(idR: number) {
    this.selectedRequisicion = idR;
    this.appRecarga = this.appRecarga + 1;
    this.tablaCotizacion = false;
    this.modalCotizacion = true;
  }

  insumosXcotizacion(idCotizacion: number) {
    this.idCotizacion = idCotizacion;
    this.selectedIndex = 2;
    this.appRecarga = this.appRecarga + 1;
  }

  ordenesCompras(idCotizacion: number) {
    this.idCotizacionparaOC = idCotizacion;
    this.selectedIndex = 2;
    this.appRecarga = this.appRecarga + 1;
  }

  insumosOrdenesCompras(idOrdenCompra: number) {
    this.idOrdenCompra = idOrdenCompra;
    this.selectedIndex = 4;
    this.appRecarga = this.appRecarga + 1;
  }

  entradasAlmacen(idOrdenCompra: number) {
    this.idOrdenCompraParaEA = idOrdenCompra;
    this.selectedIndex = 4;
    this.appRecarga = this.appRecarga + 1;
  }

  insumosEntradaAlmacen(idEntradaAlmacen: number) {
    this.idEntradaAlmacen = idEntradaAlmacen;
    this.selectedIndex = 6;
    this.appRecarga = this.appRecarga + 1;
  }

  // removerValoresIdOC(nuevoValor:number){
  //   this.idOrdenCompra = nuevoValor;
  //   this.idCotizacionparaOC = nuevoValor;
  //   this.appRecarga = this.appRecarga + 1;
  //   this.selectedIndex = 4;
  // }

  removerValoresIdC(nuevoValor: number) {
    this.idCotizacionparaOC = nuevoValor;
    this.appRecarga = this.appRecarga + 1;
    this.selectedIndex = 3;
  }

  removerIdCotizacion(nuevoValor: number) {
    this.idCotizacion = nuevoValor;
    this.selectedIndex = 2;
    this.appRecarga = this.appRecarga + 1;
  }

  removerValoresIdOCparaEA(nuevoValor: number) {
    this.idOrdenCompraParaEA = nuevoValor;
    this.appRecarga = this.appRecarga + 1;
    this.selectedIndex = 4;
  }

  // removerValoresIdEAparaIEA(nuevoValor:number){
  //   this.idEntradaAlmacen = nuevoValor;
  //   this.appRecarga = this.appRecarga + 1;
  //   this.selectedIndex = 6;
  // }

  ModalCotizacion(idRequisicion: listaRequisicionDTO) {
    idRequisicion.idProyecto = this.idProyecto;
    this.dialog
      .open(CotizacionComponent, {
        data: idRequisicion,
      })
      .afterClosed()
      .subscribe((resultado) => {
        this.recargar(1);
      });
  }

  cambio(event: MatTabChangeEvent) {
    this.selectedIndex = event.index;
  }

  yourFn(event: any) {
    this.selectedIndex = event.index;
  }

  recargar(recarga: number) {
    this.appRecarga += recarga;
    this.cargarRegistros();
  }

  refresh(refrescar: number) {
    this.cargarRegistros;
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
    this.paginatedRequisicion = this.requisiciones.slice(startIndex, endIndex);
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

  regresarARequisiciones(){
    this.veiewInsumos = false;
    this.cargarRegistros();
    this.insumosEstado = false;
  }
  ///////////* PAGINATION */////////
}
