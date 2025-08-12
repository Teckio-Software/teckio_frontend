import { Component, ElementRef, HostListener } from '@angular/core';
import {
  ProductoYServicioConjunto,
  ProductoYServicioDTO,
} from '../productos/productos';
import { ProductoYServicioService } from 'src/app/productos-y-servicios/productoyservicio.service';
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
    private _productoServicioSatService: ProductoServicioSatService
  ) {
    let IdEmpresa = _seguridadService.obtenIdEmpresaLocalStorage();
    this.selectedEmpresa = Number(IdEmpresa);
  }

  @HostListener('document:click', ['$event'])
  clickFuera(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (!target.closest('.relative')) {
      this.cerrarTodasListas();
    }
  }
  selectedEmpresa: number = 0;
  listaProductosYServicios: ProductoYServicioConjunto[] = [];
  listaProductosYServiciosSat: ProductoServicioSat[] = [];
  listaProductosYServiciosSatAux: ProductoServicioSat[] = [];
  listaUnidades: UnidadDTO[] = [];
  listaUnidadesSat: UnidadSatDTO[] = [];
  listaCategorias: CategoriaProductoServicioDTO[] = [];
  listaSubcategorias: SubcategoriaProductoServicio[] = [];
  textoBusquedaUnidad = '';
  textoBusquedaPyS = '';
  textoBusquedaSAT = '';
  textoCategoria = '';
  textoSubCategoria = '';
  unidadesFiltradas: UnidadDTO[] = [];
  productoyServFiltrados: ProductoServicioSat[] = [];
  unidadSATFiltradas: UnidadSatDTO[] = [];
  categoriaFiltradas: CategoriaProductoServicioDTO[] = [];
  subcategoriaFiltradas: SubcategoriaProductoServicio[] = [];
  mostrarListaUnidades = false;
  mostrarListaProductosYServicios = false;
  mostrarListaUnidadesSat = false;
  mostrarListaCategorias = false;
  mostrarListaSubCategorias = false;

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

  isModalAddOpen = false;
  isModalInfoOpen = false;

  ngOnInit() {
    this.CargarProductosYServicios();
    this.cargarUnidades();
    this.cargarUnidadesSat();
    this.cargarProdYSerSat();
    this.cargarCategoriasProdSer();
    this.cargarSubcategoriasProdSer();
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
    this.cerrarTodasListas();
  }

  cerrarTodasListas() {
    this.mostrarListaUnidades = false;
    this.mostrarListaProductosYServicios = false;
    this.mostrarListaUnidadesSat = false;
    this.mostrarListaCategorias = false;
    this.mostrarListaSubCategorias = false;
  }

  detenerCierre(event: MouseEvent) {
    event.stopPropagation();
  }

  crear() {
    console.log(this.productoServicio);
    this._productoYServicioService.crearYObtener(this.selectedEmpresa, this.productoServicio).subscribe(resp=>{
      console.log(resp);
      
    })
  }
}
