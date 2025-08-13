import {
  InsumoXProductoYServicioConjuntoDTO,
  InsumoXProductoYServicioDTO,
} from './../../facturacion/insumoxproductoyservicio/ts.insumoxproductoyservicio';
import { Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import {
  ProductoYServicioConjunto,
  ProductoYServicioDTO,
} from '../productos/productos';
import { ProductoYServicioService } from '../productoyservicio.service';
import { SeguridadService } from 'src/app/seguridad/seguridad.service';
import { UnidadService } from '../../facturacion/unidad/unidad.service';
import { UnidadSatService } from '../../facturacion/unidadSat/unidad-sat.service';
import { CategoriaProductoServicioService } from '../../facturacion/categoria-producto-servicio/categoria-producto-servicio.service';
import { SubcategoriaProductoServicioService } from '../../facturacion/subcategoria-producto-servicio/subcategoria-producto-servicio.service';
import { ProductoServicioSatService } from '../../facturacion/producto-servicio-sat/producto-servicio-sat.service';
import { ProductoServicioSat } from 'src/app/facturacion/producto-servicio-sat/ts.producto-servicio-sat';
import { UnidadDTO } from 'src/app/facturacion/unidad/ts.unidad';
import { UnidadSatDTO } from 'src/app/facturacion/unidadSat/ts.unidad-sat';
import { CategoriaProductoServicioDTO } from 'src/app/facturacion/categoria-producto-servicio/ts.categoria-producto-servicio';
import { SubcategoriaProductoServicio } from 'src/app/facturacion/subcategoria-producto-servicio/ts.subcategoria-producto-servicio';
import { AlertaTipo } from 'src/app/utilidades/alert/alert.component';
import { InsumoService } from 'src/app/catalogos/insumo/insumo.service';
import { InsumoDTO } from 'src/app/catalogos/insumo/tsInsumo';
import { InsumoXProductoYServicioService } from 'src/app/facturacion/insumoxproductoyservicio/insumoxproductoyservicio.service';

@Component({
  selector: 'app-productos-servicios',
  templateUrl: './productos-servicios.component.html',
})
export class ProductosServiciosComponent {
  constructor(
    private _productoYServicioService: ProductoYServicioService,
    private _seguridadService: SeguridadService,
    private _unidadService: UnidadService,
    private _unidadSatService: UnidadSatService,
    private _categoriaProdSerservice: CategoriaProductoServicioService,
    private _subcategoriaProdSerservice: SubcategoriaProductoServicioService,
    private _productoServicioSatService: ProductoServicioSatService,
    private _insumoService: InsumoService,
    private _insumoXProdySerService: InsumoXProductoYServicioService,
    private elementRef: ElementRef
  ) {
    let IdEmpresa = _seguridadService.obtenIdEmpresaLocalStorage();
    this.selectedEmpresa = Number(IdEmpresa);
  }

  listaProductosYServicios: ProductoYServicioConjunto[] = [];
  listaInsumosXProductoYServicio: InsumoXProductoYServicioConjuntoDTO[] = [];
  listaProductosYServiciosSat: ProductoServicioSat[] = [];
  listaProductosYServiciosSatAux: ProductoServicioSat[] = [];
  listaUnidades: UnidadDTO[] = [];
  listaUnidadesSat: UnidadSatDTO[] = [];
  listaCategorias: CategoriaProductoServicioDTO[] = [];
  listaSubcategorias: SubcategoriaProductoServicio[] = [];

  unidadesFiltradas: UnidadDTO[] = [];
  productoyServFiltrados: ProductoServicioSat[] = [];
  unidadSATFiltradas: UnidadSatDTO[] = [];
  categoriaFiltradas: CategoriaProductoServicioDTO[] = [];
  subcategoriaFiltradas: SubcategoriaProductoServicio[] = [];
  listaInsumosFiltrados: InsumoDTO[] = [];
  listaInsumos: InsumoDTO[] = [];
  alertaTipo: AlertaTipo = AlertaTipo.none;
  AlertaTipo = AlertaTipo;

  insumoXProductoYServicio: InsumoXProductoYServicioDTO = {
    id: 0,
    idProductoYservicio: 0,
    idInsumo: 0,
    cantidad: 0,
  };

  productoServicio: ProductoYServicioDTO = {
    id: 0,
    codigo: '',
    descripcion: '',
    idUnidad: 0,
    idProductoYservicioSat: 0,
    idUnidadSat: 0,
    idCategoriaProductoYServicio: 0,
    idSubategoriaProductoYServicio: 0,
  };

  selectedEmpresa: number = 0;
  alertaMessage: string = '';
  textoBusquedaUnidad: string = '';
  textoBusquedaPyS: string = '';
  textoBusquedaSAT: string = '';
  textoCategoria: string = '';
  textoSubCategoria: string = '';
  textoInsumo: string = '';

  mostrarListaUnidades: boolean = false;
  mostrarListaProductosYServicios: boolean = false;
  mostrarListaUnidadesSat: boolean = false;
  mostrarListaCategorias: boolean = false;
  mostrarListaSubCategorias: boolean = false;
  mostrarListaInsumos: boolean = false;
  isModalAddOpen: boolean = false;
  isModalInfoOpen: boolean = false;
  alertaSuccess: boolean = false;

  ngOnInit() {
    this.CargarProductosYServicios();
    this.cargarUnidades();
    this.cargarUnidadesSat();
    this.cargarProdYSerSat();
    this.cargarCategoriasProdSer();
    this.cargarSubcategoriasProdSer();
    this.cargarInsumos();
  }

  // unidad
  cargarUnidades() {
    this._unidadService.ObtenerTodos(this.selectedEmpresa).subscribe((resp) => {
      this.listaUnidades = resp;
    });
  }

  abrirLista() {
    this.unidadesFiltradas = [...this.listaUnidades];
    this.cerrarTodasListas();
    this.mostrarListaUnidades = true;
  }

  filtrarUnidades(event: Event) {
    const valor = (event.target as HTMLInputElement).value.toLowerCase();
    this.textoBusquedaUnidad = valor;
    this.unidadesFiltradas = this.listaUnidades.filter((u) =>
      u.descripcion.toLowerCase().includes(valor)
    );
    this.mostrarListaUnidades = true;
  }

  seleccionarUnidad(unidad: UnidadDTO) {
    this.textoBusquedaUnidad = unidad.descripcion;
    this.productoServicio.idUnidad = unidad.id;
    this.unidadesFiltradas = [];
    this.mostrarListaUnidades = false;
  }

  //producto y servicio
  cargarProdYSerSat() {
    this._productoServicioSatService
      .ObtenerTodos(this.selectedEmpresa)
      .subscribe((resp) => {
        this.listaProductosYServiciosSat = resp;
        //muestra 100 resultados
        this.listaProductosYServiciosSatAux =
          this.listaProductosYServiciosSat.slice(0, 100);
      });
  }

  abrirListaProductoyServ() {
    this.productoyServFiltrados = [...this.listaProductosYServiciosSatAux];
    this.cerrarTodasListas();
    this.mostrarListaProductosYServicios = true;
  }

  filtrarProductosYServicios(event: Event) {
    const valor = (event.target as HTMLInputElement).value.toLowerCase();
    this.textoBusquedaPyS = valor;
    this.productoyServFiltrados = this.listaProductosYServiciosSatAux.filter(
      (p) => p.descripcion.toLowerCase().includes(valor)
    );
    this.mostrarListaProductosYServicios = true;
  }

  seleccionarProductoServicio(productoServicio: ProductoServicioSat) {
    this.textoBusquedaPyS = productoServicio.descripcion;
    this.productoServicio.idProductoYservicioSat = productoServicio.id;
    this.productoyServFiltrados = [];
    this.mostrarListaProductosYServicios = false;
  }

  //unidad sat
  cargarUnidadesSat() {
    this._unidadSatService
      .ObtenerTodos(this.selectedEmpresa)
      .subscribe((resp) => {
        this.listaUnidadesSat = resp;
      });
  }

  abrirListaUnidadesSat() {
    this.unidadSATFiltradas = [...this.listaUnidadesSat];
    this.cerrarTodasListas();
    this.mostrarListaUnidadesSat = true;
  }

  filtrarUnidadesSat(event: Event) {
    const valor = (event.target as HTMLInputElement).value.toLowerCase();
    this.textoBusquedaSAT = valor;
    this.unidadSATFiltradas = this.listaUnidadesSat.filter((u) =>
      u.nombre.toLowerCase().includes(valor)
    );
    this.mostrarListaUnidadesSat = true;
  }

  seleccionarUnidadSat(unidad: UnidadSatDTO) {
    this.textoBusquedaSAT = unidad.nombre;
    this.productoServicio.idUnidadSat = unidad.id;
    this.unidadSATFiltradas = [];
    this.mostrarListaUnidadesSat = false;
  }

  //categoria
  cargarCategoriasProdSer() {
    this._categoriaProdSerservice
      .ObtenerTodos(this.selectedEmpresa)
      .subscribe((resp) => {
        this.listaCategorias = resp;
      });
  }

  abrirListaCategoria() {
    this.categoriaFiltradas = [...this.listaCategorias];
    this.cerrarTodasListas();
    this.mostrarListaCategorias = true;
  }

  filtrarCategorias(event: Event) {
    const valor = (event.target as HTMLInputElement).value.toLowerCase();
    this.textoCategoria = valor;
    this.categoriaFiltradas = this.listaCategorias.filter((c) =>
      c.descripcion.toLowerCase().includes(valor)
    );
    this.mostrarListaCategorias = true;
  }

  seleccionarCategoria(categoria: CategoriaProductoServicioDTO) {
    this.textoCategoria = categoria.descripcion;
    this.productoServicio.idCategoriaProductoYServicio = categoria.id;
    this.categoriaFiltradas = [];
    this.mostrarListaCategorias = false;
  }

  //subcategoria
  cargarSubcategoriasProdSer() {
    this._subcategoriaProdSerservice
      .ObtenerTodos(this.selectedEmpresa)
      .subscribe((resp) => {
        this.listaSubcategorias = resp;
      });
  }

  abrirListaSubCategoria() {
    this.subcategoriaFiltradas = [...this.listaSubcategorias];
    this.cerrarTodasListas();
    this.mostrarListaSubCategorias = true;
  }

  filtrarSubCategorias(event: Event) {
    const valor = (event.target as HTMLInputElement).value.toLowerCase();
    this.textoSubCategoria = valor;
    this.subcategoriaFiltradas = this.listaSubcategorias.filter((c) =>
      c.descripcion.toLowerCase().includes(valor)
    );
    this.mostrarListaSubCategorias = true;
  }

  seleccionarSubCategoria(subcategoria: SubcategoriaProductoServicio) {
    this.textoSubCategoria = subcategoria.descripcion;
    this.productoServicio.idSubategoriaProductoYServicio = subcategoria.id;
    this.subcategoriaFiltradas = [];
    this.mostrarListaSubCategorias = false;
  }

  CargarProductosYServicios() {
    this._productoYServicioService
      .obtenerConjuntos(this.selectedEmpresa)
      .subscribe((resp) => {
        this.listaProductosYServicios = resp;
      });
  }

  abrirModal(tipoModal: string) {
    if (tipoModal === 'informacion') {
      this.isModalInfoOpen = true;
    } else {
      this.isModalAddOpen = true;
    }
  }

  cerrarModal() {
    this.isModalAddOpen = false;
    this.isModalInfoOpen = false;
    this.textoBusquedaUnidad = '';
    this.textoBusquedaPyS = '';
    this.textoBusquedaSAT = '';
    this.textoCategoria = '';
    this.textoSubCategoria = '';
    this.textoInsumo = '';
    this.cerrarTodasListas();
  }

  cerrarTodasListas() {
    this.mostrarListaUnidades = false;
    this.mostrarListaProductosYServicios = false;
    this.mostrarListaUnidadesSat = false;
    this.mostrarListaCategorias = false;
    this.mostrarListaSubCategorias = false;
    this.mostrarListaInsumos = false;
  }

  detenerCierre(event: MouseEvent) {
    event.stopPropagation();
  }

  crear() {
    console.log(this.productoServicio);
    this._productoYServicioService
      .crear(this.selectedEmpresa, this.productoServicio)
      .subscribe((resp) => {
        if (resp.estatus) {
          this.alerta(AlertaTipo.save, resp.descripcion);
          this.cerrarModal();
          this.CargarProductosYServicios();
        } else {
          this.alerta(AlertaTipo.error, resp.descripcion);
        }
      });
  }

  crearInsumoXProductoyServicio(
    insumoXProductoYServicio: InsumoXProductoYServicioDTO
  ) {
    this._insumoXProdySerService
      .crear(this.selectedEmpresa, insumoXProductoYServicio)
      .subscribe((resp) => {
        if (resp.estatus) {
          this.alerta(AlertaTipo.save, resp.descripcion);
        } else {
          this.alerta(AlertaTipo.error, resp.descripcion);
        }
      });
  }

  eliminarInsumoXProductoyServicio(id: number) {
    this._insumoXProdySerService
      .eliminar(this.selectedEmpresa, id)
      .subscribe((resp) => {
        if (resp.estatus) {
          this.alerta(AlertaTipo.save, resp.descripcion);
        } else {
          this.alerta(AlertaTipo.error, resp.descripcion);
        }
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

  cargarInsumos() {
    this._insumoService.obtenerTodos(this.selectedEmpresa).subscribe({
      next: (resp) => {
        this.listaInsumos = resp;
        console.log(this.listaInsumos);
      },
      error: () => {
        //Mensaje de error
      },
    });
  }

  cargarInsumopsProdySer(id: number) {
    this._insumoXProdySerService
      .obtenerConjuntoPorProdyser(this.selectedEmpresa, id)
      .subscribe({
        next: (resp) => {
          this.listaInsumosXProductoYServicio = resp;
          this.insumoXProductoYServicio.idProductoYservicio = id;
          console.log(resp);
          this.abrirModal('informacion');
        },
        error: () => {
          //Mensaje de error;
        },
      });
  }

  abrirListaInsumos() {
    this.listaInsumosFiltrados = [...this.listaInsumos];
    this.mostrarListaInsumos = true;
  }

  filtrarInsumos(event: Event) {
    const valor = (event.target as HTMLInputElement).value.toLowerCase();
    this.textoInsumo = valor;
    this.listaInsumosFiltrados = this.listaInsumos.filter((c) =>
      c.descripcion.toLowerCase().includes(valor)
    );
    this.mostrarListaInsumos = true;
  }

  seleccionarInsumo(insumo: InsumoDTO) {
    this.textoInsumo = insumo.descripcion;
    this.insumoXProductoYServicio.idInsumo = insumo.id;
    this.listaInsumosFiltrados = [];
    this.mostrarListaInsumos = false;
  }
}
