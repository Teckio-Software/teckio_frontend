import { ProductoYServicioDTO } from './../productos/productos';
import { Component, ElementRef, QueryList, ViewChildren } from '@angular/core';
import { VentasService } from './ventas.service';
import { SeguridadService } from 'src/app/seguridad/seguridad.service';
import {
  DetalleOrdenVentaDTO,
  ImpuestoDetalleOrdenVentaDTO,
  OrdenVentaDTO,
} from './ordenVenta';
import { da, de } from 'date-fns/locale';
import { ClienteService } from 'src/app/catalogos/cliente/cliente.service';
import { clienteDTO } from 'src/app/catalogos/cliente/tsCliente';
import { ProductoYServicioService } from './../productoyservicio.service';
import { flatMap } from 'rxjs';
import {
  CategoriaImpuestoDTO,
  TipoFactorDTO,
  TipoImpuestoDTO,
} from 'src/app/compras/cotizacion/tsCotizacion';

@Component({
  selector: 'app-ventas',
  templateUrl: './ventas.component.html',
  styleUrls: ['./ventas.css'],
})
export class VentasComponent {
  selectedEmpresa: number = 0;
  isModalOpen = false;
  impuestosOpen: boolean = false;

  ordenVenta: OrdenVentaDTO = {
    id: 0,
    numeroOrdenVenta: '',
    autorizo: '',
    idCliente: 0,
    fechaRegistro: new Date(),
    estatus: 0,
    importeTotal: 0,
    subtotal: 0,
    estatusSaldado: 0,
    totalSaldado: 0,
    descuento: 0,
    observaciones: '',
    detalleOrdenVenta: [],
    elaboro: '',
    razonSocialCliente: '',
  };

  ordenesVenta: OrdenVentaDTO[] = [];

  // productosYServicios: ProductoYServicioDTO[] = [];

  selectedDetalleOrdenVenta: DetalleOrdenVentaDTO = {
    id: 0,
    idOrdenVenta: 0,
    idProductoYservicio: 0,
    idEstimacion: 0,
    cantitdad: 0,
    precioUnitario: 0,
    descuento: 0,
    importeTotal: 0,
    impuestosDetalleOrdenVenta: [],
    descripcion: '',
  };

   nuevoDetalleOrdenVenta: DetalleOrdenVentaDTO = {
    id: 0,
    idOrdenVenta: 0,
    idProductoYservicio: 0,
    idEstimacion: 0,
    cantitdad: 0,
    precioUnitario: 0,
    descuento: 0,
    importeTotal: 0,
    impuestosDetalleOrdenVenta: [],
    descripcion: '',
  };

  selectedImpuesto: ImpuestoDetalleOrdenVentaDTO = {
    id: 0,
    idDetalleOrdenVenta: 0,
    idTipoImpuesto: 0,
    idTipoFactor: 0,
    idCategoriaImpuesto: 0,
    idClasificacionImpuesto: 0,
    tasaCuota: 0,
    importeTotal: 0,
    descripcionTipoImpuesto: '',
    descripcionTipoFactor: '',
    descripcionCategoriaImpuesto: '',
    descripcionClasificacionImpuesto: ''
  };

  impuestosDetalleOrdenVenta: ImpuestoDetalleOrdenVentaDTO[] = [];

  clientes: clienteDTO[] = [];
  clientesReset: clienteDTO[] = [];

  productosYServicio: ProductoYServicioDTO[] = [];
  productosYServicioReset: ProductoYServicioDTO[] = [];

  tiposImpuesto: TipoImpuestoDTO[] = [];
  tiposFactor: TipoFactorDTO[] = [];
  categoriaImpuesto: CategoriaImpuestoDTO[] = [];
  isLoading: boolean = true;

  listaProductoYServicio: boolean = false;

  @ViewChildren('lista') listas!: QueryList<ElementRef<HTMLElement>>;

  mensajeAlerta: string = '';

  mostrarListaImpuestos : boolean = false;
  mostrarListaFactores : boolean = false;
  mostrarListaCategoria : boolean = false;

  constructor(
    private _seguridadService: SeguridadService,
    private _ordenVentaService: VentasService,
    private _clienteService: ClienteService,
    private _prodYserService: ProductoYServicioService
  ) {
    let IdEmpresa = _seguridadService.obtenIdEmpresaLocalStorage();
    this.selectedEmpresa = Number(IdEmpresa);
  }

  ngOnInit(): void {
    this._clienteService.obtenerTodos(this.selectedEmpresa).subscribe({
      next: (datos) => {
        this.clientes = datos;
        this.clientesReset = datos;
      },
      error: () => {
        //Imprime mensaje de error.
      },
      complete: () => {
        this.isLoading = false;
      },
    });
    this.cargarOrdenesVenta();
    this.cargarProductosYServicios();
    this.tiposImpuesto.push({
      id: 1,
      claveImpuesto: '002',
      descripcionImpuesto: 'IVA',
    });
    this.tiposFactor.push({
      id: 1,
      descripcion: 'Tasa',
    });
    this.categoriaImpuesto.push({
      id: 1,
      tipo: 'Trasladado',
    });
  }

  cargarOrdenesVenta() {
    this._ordenVentaService.obtenerTodos(this.selectedEmpresa).subscribe({
      next: (datos) => {
        this.ordenesVenta = datos;
      },
      error: () => {
        //Imprime mensaje de error.
      },
    });
  }

  cargarProductosYServicios() {
    this._prodYserService.obtenerTodos(this.selectedEmpresa).subscribe({
      next: (datos) => {
        this.productosYServicio = datos;
        this.productosYServicioReset = datos;
      },
      error: () => {
        //Imprime mensaje de error.
      },
    });
  }

  openModal(ordenVenta: OrdenVentaDTO) {
    this.isModalOpen = true;
    this._ordenVentaService
      .obtenerOrdenVenta(ordenVenta.id, this.selectedEmpresa)
      .subscribe((datos) => {
        this.ordenVenta = datos;
      });
    // this.ordenVenta.detalleOrdenVenta.push({
    //   id: 0,
    //   idOrdenVenta: 0,
    //   idProductoYservicio: 0,
    //   idEstimacion: 0,
    //   cantitdad: 0,
    //   precioUnitario: 0,
    //   descuento: 0,
    //   importeTotal: 0,
    //   impuestosDetalleOrdenVenta: [],
    // });
  }

  closeModal() {
    this.isModalOpen = false;
    this.impuestosOpen = false;
    this.ordenVenta.idCliente = 0;
    this.ordenVenta.observaciones = '';
    this.ordenVenta.detalleOrdenVenta = [];
  }

  seleccionarCliente(cliente: clienteDTO) {
    this.ordenVenta.idCliente = cliente.id;
    this.ordenVenta.razonSocialCliente = cliente.razonSocial;
  }

  agregarDetalle() {
    // let ultimoProducto =
    //   this.ordenVenta.detalleOrdenVenta[
    //     this.ordenVenta.detalleOrdenVenta.length - 1
    //   ];
    // if (
    //   ultimoProducto.idProductoYservicio == 0 ||
    //   ultimoProducto.cantitdad == 0 ||
    //   ultimoProducto.cantitdad == undefined ||
    //   ultimoProducto.cantitdad == null ||
    //   ultimoProducto.precioUnitario == 0 ||
    //   ultimoProducto.precioUnitario == undefined ||
    //   ultimoProducto.precioUnitario == null
    // ) {
    //   return;
    // }

    let existeNuevoDetalle = this.ordenVenta.detalleOrdenVenta.filter(
      (z) => z.id == 0
    );
    if (existeNuevoDetalle.length > 0) {
      return;
    }

    this.ordenVenta.detalleOrdenVenta.push({
      id: 0,
      idOrdenVenta: 0,
      idProductoYservicio: 0,
      idEstimacion: 0,
      cantitdad: 0,
      precioUnitario: 0,
      descuento: 0,
      importeTotal: 0,
      impuestosDetalleOrdenVenta: [],
      descripcion: '',
    });
  }

  seleccionarProducto(
    producto: ProductoYServicioDTO
  ) {
    var existeProducto = this.ordenVenta.detalleOrdenVenta.filter(
      (z) => z.idProductoYservicio == producto.id
    );
    if (existeProducto.length > 0) {
      this.mensajeAlerta = 'El producto ya fue seleccionado';
      this.nuevoDetalleOrdenVenta.idProductoYservicio = 0;
      this.nuevoDetalleOrdenVenta.descripcion = '';
      return;
    } else {
      this.mensajeAlerta = '';
    }

    this.nuevoDetalleOrdenVenta.idProductoYservicio = producto.id;
    this.nuevoDetalleOrdenVenta.descripcion = producto.descripcion;
    this.listaProductoYServicio = false;
  }

  seleccionarImpuestos(tipoImpuesto : TipoImpuestoDTO, impuesto : ImpuestoDetalleOrdenVentaDTO) {
    impuesto.idTipoImpuesto = tipoImpuesto.id;
    impuesto.descripcionTipoImpuesto = tipoImpuesto.descripcionImpuesto;
    this.agregarImpuesto(impuesto);
  }

  seleccionarFactores(tipoFactor : TipoFactorDTO, impuesto : ImpuestoDetalleOrdenVentaDTO) {
    impuesto.idTipoFactor = tipoFactor.id;
    impuesto.descripcionTipoFactor = tipoFactor.descripcion;
    this.agregarImpuesto(impuesto);
  }

  seleccionarCategorias(categorias : CategoriaImpuestoDTO, impuesto : ImpuestoDetalleOrdenVentaDTO) {
    impuesto.idCategoriaImpuesto = categorias.id;
    impuesto.descripcionCategoriaImpuesto = categorias.tipo;
    this.agregarImpuesto(impuesto);
  }

  guardarDetalle(detalle : DetalleOrdenVentaDTO) {
    if(detalle.idProductoYservicio == 0 || detalle.idProductoYservicio == undefined || detalle.idProductoYservicio == null
      || detalle.idEstimacion == 0 || detalle.idEstimacion == undefined || detalle.idEstimacion == null
      || detalle.cantitdad == 0 || detalle.cantitdad == undefined || detalle.cantitdad == null
      || detalle.precioUnitario == 0 || detalle.precioUnitario == undefined || detalle.precioUnitario == null
    ){
      console.log(detalle);
      this.mensajeAlerta = 'Captura los campos obligatorios';
      return;
    }else{
      this.mensajeAlerta = '';
    }

    if(detalle.id == 0){
      //crear nuevo detalle
    }else{
      //editar detalle
    }
  }

  editarDetalle(detalle: DetalleOrdenVentaDTO) {
    let existeDetalle = this.ordenVenta.detalleOrdenVenta.filter(
      (z) =>
        z.idEstimacion == detalle.idEstimacion &&
        z.idProductoYservicio == detalle.idProductoYservicio
    );
    if (existeDetalle.length > 1) {
      detalle.idEstimacion = 0;
      detalle.idProductoYservicio = 0;

      let existeVacio = this.ordenVenta.detalleOrdenVenta.filter(
        (z) => z.idEstimacion == 0 && z.idProductoYservicio == 0
      );

      if (existeVacio.length > 1) {
        let coincidencia = this.ordenVenta.detalleOrdenVenta.findIndex(
          (z) => z.idEstimacion == 0 && z.idProductoYservicio == 0
        );

        this.ordenVenta.detalleOrdenVenta.splice(coincidencia, 1);
      }

      return;
    }

    if (
      detalle.idProductoYservicio == 0 ||
      detalle.cantitdad == 0 ||
      detalle.cantitdad == undefined ||
      detalle.cantitdad == null ||
      detalle.precioUnitario == 0 ||
      detalle.precioUnitario == undefined ||
      detalle.precioUnitario == null
    ) {
      return;
    }

    let ultimoVacio = this.ordenVenta.detalleOrdenVenta.filter(
      (z) => z.idEstimacion == 0 && z.idProductoYservicio == 0
    );
    if (ultimoVacio.length >= 1) {
      let coincidencia = this.ordenVenta.detalleOrdenVenta.findIndex(
        (z) => z.idEstimacion == 0 && z.idProductoYservicio == 0
      );

      this.ordenVenta.detalleOrdenVenta.splice(coincidencia, 1);
    }

    this.ordenVenta.detalleOrdenVenta.push({
      id: 0,
      idOrdenVenta: 0,
      idProductoYservicio: 0,
      idEstimacion: 0,
      cantitdad: 0,
      precioUnitario: 0,
      descuento: 0,
      importeTotal: 0,
      impuestosDetalleOrdenVenta: [],
      descripcion: '',
    });
  }

  eliminarDetalle(detalle: DetalleOrdenVentaDTO) {
    let coincidencia = this.ordenVenta.detalleOrdenVenta.findIndex(
      (z) =>
        z.idEstimacion == detalle.idEstimacion &&
        z.idProductoYservicio == detalle.idProductoYservicio
    );

    this.ordenVenta.detalleOrdenVenta.splice(coincidencia, 1);
  }

  filtrarProducto(event: Event) {
    this.productosYServicio = this.productosYServicioReset;
    const filterValue = (
      event.target as HTMLInputElement
    ).value.toLocaleLowerCase();
    this.productosYServicio = this.productosYServicio.filter(
      (producto) =>
        producto.codigo.toLocaleLowerCase().includes(filterValue) ||
        producto.descripcion.toLocaleLowerCase().includes(filterValue)
    );
  }

  filtrarCliente(event: Event) {
    this.clientes = this.clientesReset;
    const filterValue = (
      event.target as HTMLInputElement
    ).value.toLocaleLowerCase();
    this.clientes = this.clientes.filter((cliente) =>
      cliente.razonSocial.toLocaleLowerCase().includes(filterValue)
    );
  }

  verImpuestos(detalle: DetalleOrdenVentaDTO) {
    if (detalle.impuestosDetalleOrdenVenta.length <= 0) {
      detalle.impuestosDetalleOrdenVenta.push({
        id: 0,
        idDetalleOrdenVenta: detalle.id,
        idTipoImpuesto: 0,
        idTipoFactor: 0,
        idCategoriaImpuesto: 0,
        idClasificacionImpuesto: 0,
        tasaCuota: 0,
        importeTotal: 0,
        descripcionTipoImpuesto: '',
        descripcionTipoFactor: '',
        descripcionCategoriaImpuesto: '',
        descripcionClasificacionImpuesto: ''
      });
    }
    this.impuestosOpen = true;
    this.selectedDetalleOrdenVenta = detalle;
    this.impuestosDetalleOrdenVenta = detalle.impuestosDetalleOrdenVenta;
  }

  agregarImpuesto(impuesto: ImpuestoDetalleOrdenVentaDTO) {
    if (
      impuesto.idTipoImpuesto == 0 ||
      impuesto.idTipoFactor == 0 ||
      impuesto.idCategoriaImpuesto == 0 ||
      impuesto.tasaCuota == 0
    ) {
      this.mensajeAlerta = 'Captura los campos obligatorios';
      return;
    }else{
      this.mensajeAlerta = '';
    }

    let existeImpuesto =
      this.selectedDetalleOrdenVenta.impuestosDetalleOrdenVenta.filter(
        (z) =>
          z.idTipoImpuesto == impuesto.idTipoImpuesto
      );
    if (existeImpuesto.length >= 2) {
      this.mensajeAlerta = 'El impuesto ya fue seleccionado';
      impuesto.idTipoImpuesto = 0;
      impuesto.descripcionTipoImpuesto = '';
      return;
    }else{
      this.mensajeAlerta = '';
      this.mostrarListaImpuestos = false;
      this.mostrarListaFactores = false;
      this.mostrarListaCategoria = false;
    }



    if(impuesto.id == 0){
      //crear impuesto
      this._ordenVentaService
      .obtenerOrdenVenta(this.ordenVenta.id, this.selectedEmpresa)
      .subscribe((datos) => {
        this.ordenVenta = datos;
      });
    }else{
      //editar impuesto
    }
  }

  /**
   * Elimina un impuesto de la lista de impuestos de un detalle de orden de venta.
   * @param impuesto El impuesto a eliminar.
   */
  eliminarImpuesto(impuesto: ImpuestoDetalleOrdenVentaDTO) {
    let coincidencia =
      this.selectedDetalleOrdenVenta.impuestosDetalleOrdenVenta.findIndex(
        (z) =>
          z.idCategoriaImpuesto == impuesto.idCategoriaImpuesto &&
          z.idTipoImpuesto == impuesto.idTipoImpuesto &&
          z.idTipoFactor == impuesto.idTipoFactor
      );

    this.selectedDetalleOrdenVenta.impuestosDetalleOrdenVenta.splice(
      coincidencia,
      1
    );
  }

  guardarOrdenVenta() {
    this._ordenVentaService
      .editar(this.selectedEmpresa, this.ordenVenta)
      .subscribe({
        next: (respuesta) => {
          if (respuesta.estatus) {
            this.closeModal();
            this.cargarOrdenesVenta();
          } else {
            // console.log(respuesta);
            //Mensaje de error
          }
        },
        error: () => {
          //Mensaje de error
        },
      });
  }

  // seleccionarProductoOServicio(id: number, index: number){
  //   this.ordenVenta.detalleOrdenVenta[index].idProductoYservicio = id;
  // }

  detenerCierre(event: MouseEvent) {
    const clicDentro = this.listas.some((lista) =>
      lista.nativeElement.contains(event.target as Node)
    );
    if (!clicDentro) {
      this.listaProductoYServicio = false;
      this.mostrarListaImpuestos = false;
      this.mostrarListaFactores = false;
      this.mostrarListaCategoria = false;
    }
    event.stopPropagation();
  }
}
