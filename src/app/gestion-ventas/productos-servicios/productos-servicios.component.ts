import {
  InsumoXProductoYServicioConjuntoDTO,
  InsumoXProductoYServicioDTO,
} from './../../facturacion/insumoxproductoyservicio/ts.insumoxproductoyservicio';
import { Component, ElementRef, QueryList, ViewChildren } from '@angular/core';
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
    private productoYServicioService: ProductoYServicioService,
    private seguridadService: SeguridadService,
    private unidadService: UnidadService,
    private unidadSatService: UnidadSatService,
    private categoriaProdSerService: CategoriaProductoServicioService,
    private subcategoriaProdSerService: SubcategoriaProductoServicioService,
    private productoServicioSatService: ProductoServicioSatService,
    private insumoService: InsumoService,
    private insumoXProdySerService: InsumoXProductoYServicioService
  ) {
    this.selectedEmpresa = Number(
      this.seguridadService.obtenIdEmpresaLocalStorage()
    );
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
  textoCodigo: string = '';
  textoDescripcion: string = '';

  mostrarListaUnidades: boolean = false;
  mostrarListaProductosYServicios: boolean = false;
  mostrarListaUnidadesSat: boolean = false;
  mostrarListaCategorias: boolean = false;
  mostrarListaSubCategorias: boolean = false;
  mostrarListaInsumos: boolean = false;
  isModalAddOpen: boolean = false;
  isModalInfoOpen: boolean = false;
  alertaSuccess: boolean = false;

  isLoading: boolean = true;

  ngOnInit() {
    this.cargarProductosYServicios();
    this.cargarUnidades();
    this.cargarUnidadesSat();
    this.cargarProdYSerSat();
    this.cargarCategoriasProdSer();
    this.cargarSubcategoriasProdSer();
    this.cargarInsumos();
  }

  @ViewChildren('lista') listas!: QueryList<ElementRef<HTMLElement>>;

  cargarUnidades() {
    this.unidadService.ObtenerTodos(this.selectedEmpresa).subscribe((resp) => {
      this.listaUnidades = resp;
    });
  }

  abrirListaUnidades() {
    this.unidadesFiltradas = [...this.listaUnidades];
    this.mostrarListaUnidades = true;
  }

  filtrarUnidades(event: Event) {
    this.filtrarLista(
      event,
      'textoBusquedaUnidad',
      'listaUnidades',
      'unidadesFiltradas',
      'descripcion'
    );
    this.mostrarListaUnidades = true;
  }

  seleccionarUnidad(unidad: UnidadDTO) {
    this.textoBusquedaUnidad = unidad.descripcion;
    this.productoServicio.idUnidad = unidad.id;
    this.unidadesFiltradas = [];
    this.mostrarListaUnidades = false;
  }

  cargarProdYSerSat() {
    this.productoServicioSatService
      .ObtenerTodos(this.selectedEmpresa)
      .subscribe((resp) => {
        this.listaProductosYServiciosSat = resp;
        this.listaProductosYServiciosSatAux = resp.slice(0, 100);
      });
  }

  abrirListaProductosYServicios() {
    this.productoyServFiltrados = [...this.listaProductosYServiciosSatAux];
    this.mostrarListaProductosYServicios = true;
  }

  filtrarProductosYServicios(event: Event) {
    this.filtrarLista(
      event,
      'textoBusquedaPyS',
      'listaProductosYServiciosSatAux',
      'productoyServFiltrados',
      'descripcion'
    );
    this.mostrarListaProductosYServicios = true;
  }

  seleccionarProductoServicio(productoServicio: ProductoServicioSat) {
    this.textoBusquedaPyS = productoServicio.descripcion;
    this.productoServicio.idProductoYservicioSat = productoServicio.id;
    this.productoyServFiltrados = [];
    this.mostrarListaProductosYServicios = false;
  }

  cargarUnidadesSat() {
    this.unidadSatService
      .ObtenerTodos(this.selectedEmpresa)
      .subscribe((resp) => {
        this.listaUnidadesSat = resp;
      });
  }

  abrirListaUnidadesSat() {
    this.unidadSATFiltradas = [...this.listaUnidadesSat];
    this.mostrarListaUnidadesSat = true;
  }

  filtrarUnidadesSat(event: Event) {
    this.filtrarLista(
      event,
      'textoBusquedaSAT',
      'listaUnidadesSat',
      'unidadSATFiltradas',
      'nombre'
    );
    this.mostrarListaUnidadesSat = true;
  }

  seleccionarUnidadSat(unidad: UnidadSatDTO) {
    this.textoBusquedaSAT = unidad.nombre;
    this.productoServicio.idUnidadSat = unidad.id;
    this.unidadSATFiltradas = [];
    this.mostrarListaUnidadesSat = false;
  }

  cargarCategoriasProdSer() {
    this.categoriaProdSerService
      .ObtenerTodos(this.selectedEmpresa)
      .subscribe((resp) => {
        this.listaCategorias = resp;
      });
  }

  abrirListaCategorias() {
    this.categoriaFiltradas = [...this.listaCategorias];
    this.mostrarListaCategorias = true;
  }

  filtrarCategorias(event: Event) {
    this.filtrarLista(
      event,
      'textoCategoria',
      'listaCategorias',
      'categoriaFiltradas',
      'descripcion'
    );
    this.mostrarListaCategorias = true;
  }

  seleccionarCategoria(categoria: CategoriaProductoServicioDTO) {
    this.textoCategoria = categoria.descripcion;
    this.productoServicio.idCategoriaProductoYServicio = categoria.id;
    this.categoriaFiltradas = [];
    this.mostrarListaCategorias = false;
  }

  cargarSubcategoriasProdSer() {
    this.subcategoriaProdSerService
      .ObtenerTodos(this.selectedEmpresa)
      .subscribe((resp) => {
        this.listaSubcategorias = resp;
      });
  }

  abrirListaSubCategorias() {
    this.subcategoriaFiltradas = [...this.listaSubcategorias];
    this.mostrarListaSubCategorias = true;
  }

  filtrarSubCategorias(event: Event) {
    this.filtrarLista(
      event,
      'textoSubCategoria',
      'listaSubcategorias',
      'subcategoriaFiltradas',
      'descripcion'
    );
    this.mostrarListaSubCategorias = true;
  }

  seleccionarSubCategoria(subcategoria: SubcategoriaProductoServicio) {
    this.textoSubCategoria = subcategoria.descripcion;
    this.productoServicio.idSubategoriaProductoYServicio = subcategoria.id;
    this.subcategoriaFiltradas = [];
    this.mostrarListaSubCategorias = false;
  }

  cargarProductosYServicios() {
    this.productoYServicioService
      .obtenerConjuntos(this.selectedEmpresa)
      .subscribe((resp) => {
        this.listaProductosYServicios = resp;
        this.isLoading = false;
      });
  }

  abrirModal(tipoModal: string) {
    this.isModalInfoOpen = tipoModal === 'informacion';
    this.isModalAddOpen = tipoModal !== 'informacion';
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
    this.productoServicio = {
      id: 0,
      codigo: '',
      descripcion: '',
      idUnidad: 0,
      idProductoYservicioSat: 0,
      idUnidadSat: 0,
      idCategoriaProductoYServicio: 0,
      idSubategoriaProductoYServicio: 0,
    };
    this.insumoXProductoYServicio = {
      id: 0,
      idProductoYservicio: 0,
      idInsumo: 0,
      cantidad: 0,
    };
  }

  detenerCierre(event: MouseEvent) {
    const clicDentro = this.listas.some((lista) =>
      lista.nativeElement.contains(event.target as Node)
    );
    if (!clicDentro) {
      this.mostrarListaInsumos = false;
      this.mostrarListaUnidades = false;
      this.mostrarListaProductosYServicios = false;
      this.mostrarListaUnidadesSat = false;
      this.mostrarListaCategorias = false;
      this.mostrarListaSubCategorias = false;
    }
    event.stopPropagation();
  }

  crear() {
    this.productoYServicioService
      .crear(this.selectedEmpresa, this.productoServicio)
      .subscribe((resp) => {
        if (resp.estatus) {
          this.alerta(AlertaTipo.save, resp.descripcion);
          this.cerrarModal();
          this.cargarProductosYServicios();
        } else {
          this.alerta(AlertaTipo.error, resp.descripcion);
          console.error(resp.descripcion);
        }
      });
  }

  crearInsumoXProductoyServicio(
    insumoXProductoYServicio: InsumoXProductoYServicioDTO
  ) {
    this.insumoXProdySerService
      .crear(this.selectedEmpresa, insumoXProductoYServicio)
      .subscribe((resp) => {
        if (resp.estatus) {
          this.alerta(AlertaTipo.save, resp.descripcion);
          this.refrescarInsumosXProdySer();
          this.textoInsumo = '';
          this.insumoXProductoYServicio.cantidad = 0;
          this.listaInsumosFiltrados = [];
          this.mostrarListaInsumos = false;
        } else {
          this.alerta(AlertaTipo.error, resp.descripcion);
        }
      });
  }

  actualizarInsumoXProductoyServicio(
    insumoXProductoYServicio: InsumoXProductoYServicioDTO
  ) {
    this.insumoXProdySerService
      .editar(this.selectedEmpresa, insumoXProductoYServicio)
      .subscribe((resp) => {
        if (resp.estatus) {
          this.alerta(AlertaTipo.save, resp.descripcion);
          this.refrescarInsumosXProdySer();
        } else {
          this.alerta(AlertaTipo.error, resp.descripcion);
        }
      });
  }

  eliminarInsumoXProductoyServicio(id: number) {
    this.insumoXProdySerService
      .eliminar(this.selectedEmpresa, id)
      .subscribe((resp) => {
        if (resp.estatus) {
          this.alerta(AlertaTipo.save, resp.descripcion);
          this.refrescarInsumosXProdySer();
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
    setTimeout(() => this.cerrarAlerta(), 3000);
  }

  cerrarAlerta() {
    this.alertaSuccess = false;
    this.alertaTipo = AlertaTipo.none;
    this.alertaMessage = '';
  }

  cargarInsumos() {
    this.insumoService.obtenerTodos(this.selectedEmpresa).subscribe({
      next: (resp) => {
        this.listaInsumos = resp;
      },
      error: () => {
        //Mensaje de error
      },
    });
  }

  refrescarInsumosXProdySer() {
    this.insumoXProdySerService
      .obtenerConjuntoPorProdyser(
        this.selectedEmpresa,
        this.insumoXProductoYServicio.idProductoYservicio
      )
      .subscribe((resp) => {
        this.listaInsumosXProductoYServicio = resp;
      });
  }

  cargarInsumopsProdySer(id: number) {
    this.insumoXProdySerService
      .obtenerConjuntoPorProdyser(this.selectedEmpresa, id)
      .subscribe({
        next: (resp) => {
          this.listaInsumosXProductoYServicio = resp;
          this.insumoXProductoYServicio.idProductoYservicio = id;
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
    this.filtrarLista(
      event,
      'textoInsumo',
      'listaInsumos',
      'listaInsumosFiltrados',
      'descripcion'
    );
    this.mostrarListaInsumos = true;
  }

  seleccionarInsumo(insumo: InsumoDTO) {
    this.textoInsumo = insumo.descripcion;
    this.insumoXProductoYServicio.idInsumo = insumo.id;
    this.listaInsumosFiltrados = [];
    this.mostrarListaInsumos = false;
  }

  /**
   * Método genérico para filtrar listas por texto y propiedad
   */
  private filtrarLista(
    event: Event,
    textoProp: string,
    listaProp: string,
    filtradosProp: string,
    propiedad: string
  ) {
    const valor = (event.target as HTMLInputElement).value.toLowerCase();
    (this as any)[textoProp] = valor;
    (this as any)[filtradosProp] = (this as any)[listaProp].filter(
      (item: any) => item[propiedad].toLowerCase().includes(valor)
    );
  }
}
