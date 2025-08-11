import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ProductoYServicioConjunto } from '../productos/productos';
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

  selectedEmpresa: number = 0;

  listaProductosYServicios: ProductoYServicioConjunto[] = [];
  listaProductosYServiciosSat: ProductoServicioSat[] = [];
  listaProductosYServiciosSatAux: ProductoServicioSat[] = [];
  listaUnidades: UnidadDTO[] = [];
  listaUnidadesSat: UnidadSatDTO[] = [];
  listaCategorias: CategoriaProductoServicioDTO[] = [];
  listaSubcategorias: SubcategoriaProductoServicio[] = [];

  constructor(private _productoYServicioService: ProductoYServicioService,
    private _seguridadService: SeguridadService,
    private _unidadService: UnidadService,
    private _unidadSatService: UnidadSatService,
    private _categoriaProdSerservice: CategoriaProductoServicioService,
    private _subcategoriaProdSerservice: SubcategoriaProductoServicioService,
    private _productoServicioSatService: ProductoServicioSatService,
  ){
    let IdEmpresa = _seguridadService.obtenIdEmpresaLocalStorage();
    this.selectedEmpresa = Number(IdEmpresa);
  }

  ngOnInit(){
    this.CargarProductosYServicios();
    this.cargarUnidades();
    this.cargarUnidadesSat();
    this.cargarProdYSerSat();
    this.cargarCategoriasProdSer();
    this.cargarSubcategoriasProdSer();
  }

  cargarUnidades(){
    this._unidadService.ObtenerTodos(this.selectedEmpresa).subscribe((resp)=>{
      this.listaUnidades = resp;      
    })
  }

  cargarUnidadesSat(){
    this._unidadSatService.ObtenerTodos(this.selectedEmpresa).subscribe((resp)=>{
      this.listaUnidadesSat = resp;
    })
  }

  cargarProdYSerSat(){
    this._productoServicioSatService.ObtenerTodos(this.selectedEmpresa).subscribe((resp)=>{
      this.listaProductosYServiciosSat = resp;
      this.listaProductosYServiciosSatAux = this.listaProductosYServiciosSat.slice(0,100);
      console.log(this.listaProductosYServiciosSatAux);
      
    })
  }

  cargarCategoriasProdSer(){
    this._categoriaProdSerservice.ObtenerTodos(this.selectedEmpresa).subscribe((resp)=>{
    this.listaCategorias = resp;      
    })
  }

  cargarSubcategoriasProdSer(){
    this._subcategoriaProdSerservice.ObtenerTodos(this.selectedEmpresa).subscribe((resp)=>{
      this.listaSubcategorias = resp;
    })
  }

  CargarProductosYServicios(){
    this._productoYServicioService.obtenerConjuntos(this.selectedEmpresa).subscribe((resp)=>{
      this.listaProductosYServicios = resp;
      console.log(this.listaProductosYServicios);
    })
  }

  isModalAddOpen = false;
  isModalInfoOpen = false;

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
  }

  detenerCierre(event: MouseEvent) {
    event.stopPropagation();
  }
}
