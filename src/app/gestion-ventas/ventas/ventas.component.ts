import { ProductoYServicioDTO } from './../productos/productos';
import { Component, ElementRef, QueryList, ViewChildren } from '@angular/core';
import { VentasService } from './ventas.service';
import { SeguridadService } from 'src/app/seguridad/seguridad.service';
import {
  CancelarOrdenVentaDTO,
  DetalleOrdenVentaDTO,
  ImpuestoDetalleOrdenVentaDTO,
  OrdenVentaDTO,
} from './ordenVenta';
import { da, de, es } from 'date-fns/locale';
import { ClienteService } from 'src/app/catalogos/cliente/cliente.service';
import { clienteDTO } from 'src/app/catalogos/cliente/tsCliente';
import { ProductoYServicioService } from './../productoyservicio.service';
import { flatMap } from 'rxjs';
import {
  CategoriaImpuestoDTO,
  TipoFactorDTO,
  TipoImpuestoDTO,
} from 'src/app/compras/cotizacion/tsCotizacion';
import Swal from 'sweetalert2';
import { AlmacenService } from 'src/app/inventario/almacen/almacen.service';
import { almacenDTO } from 'src/app/inventario/almacen/almacen';
import { log } from 'console';
import { AlertaTipo } from 'src/app/utilidades/alert/alert.component';

@Component({
  selector: 'app-ventas',
  templateUrl: './ventas.component.html',
  styleUrls: ['./ventas.css'],
})
export class VentasComponent {
  selectedEmpresa: number = 0;
  isModalOpen = false;
  impuestosOpen: boolean = false;
  usuarioSesion : string = '';

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

  cancelarOrdenVentaDTO: CancelarOrdenVentaDTO = {
    idOrdenVenta: 0,
    idAlmacenDestino: 0,
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
    descripcionClasificacionImpuesto: '',
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

  listaClientes: boolean = false;
  SlistaAlmacenes: boolean = false;

  listaProductoYServicio: boolean = false;

  @ViewChildren('lista') listas!: QueryList<ElementRef<HTMLElement>>;

  mensajeAlerta: string = '';

  mostrarListaImpuestos: boolean = false;
  mostrarListaFactores: boolean = false;
  mostrarListaCategoria: boolean = false;

  mostrarListaEstatus: boolean = false;
  estatusDescripcion: string = '';
  mostrarListaUsuario: boolean = false;
  nombreUsuario: string = '';

  listaImpuestos: boolean = false;
  listaFactores: boolean = false;
  listaCategoria: boolean = false;
  listaClasificacion: boolean = false;

  esEliminar: boolean = false;
  elimandoDatalle: boolean = false;
  elimandoImpuesto: boolean = false;
  ChangeDetectorRef: any;
  permiteCrear: boolean = true;

  isOpenModalCancelar: boolean = false;

  listaAlmacenes: almacenDTO[] = [];
  listaAlmacenesReset: almacenDTO[] = [];
  
  nombreAlmacen: string = '';

  alertaSuccess: boolean = false;
    alertaMessage: string = '';
    alertaTipo: AlertaTipo = AlertaTipo.none;
    AlertaTipo = AlertaTipo;

  constructor(
    private _seguridadService: SeguridadService,
    private _ordenVentaService: VentasService,
    private _clienteService: ClienteService,
    private _prodYserService: ProductoYServicioService,
    private almacenService: AlmacenService,
    
  ) {
    let IdEmpresa = _seguridadService.obtenIdEmpresaLocalStorage();
    this.selectedEmpresa = Number(IdEmpresa);
    this.usuarioSesion = _seguridadService.zfObtenerCampoJwt("username");
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

    this.cargarAlmacenes();
  }

  cargarAlmacenes(){
    this.almacenService.obtenerTodosSinPaginar(this.selectedEmpresa).subscribe({
      next: (datos) => {
        this.listaAlmacenes = datos;
        this.listaAlmacenesReset = datos;
      },
      error: () => {
        //Imprime mensaje de error.
      },
    })
  }

  cargarOrdenesVenta() {
    this._ordenVentaService.obtenerTodos(this.selectedEmpresa).subscribe({
      next: (datos) => {
        this.ordenesVenta = datos;
        console.log("estas son las ordenes de venta",this.ordenesVenta);
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
    this.ordenVenta = ordenVenta;
    this.cargarOrdenVenta();
  }

  cargarOrdenVenta() {
    this._ordenVentaService
      .obtenerOrdenVenta(this.ordenVenta.id, this.selectedEmpresa)
      .subscribe((datos) => {
        this.ordenVenta = datos;
        if (this.selectedDetalleOrdenVenta.id != 0) {
          var detalleActualizado = this.ordenVenta.detalleOrdenVenta.filter(
            (z) => z.id == this.selectedDetalleOrdenVenta.id
          );
          this.impuestosDetalleOrdenVenta =
            detalleActualizado[0].impuestosDetalleOrdenVenta;
          if (
            this.impuestosDetalleOrdenVenta.length == 0 &&
            detalleActualizado.length != 0
          ) {
            this.impuestosDetalleOrdenVenta.push({
              id: 0,
              idDetalleOrdenVenta: this.selectedDetalleOrdenVenta.id,
              idTipoImpuesto: 0,
              idTipoFactor: 0,
              idCategoriaImpuesto: 0,
              idClasificacionImpuesto: 0,
              tasaCuota: 0,
              importeTotal: 0,
              descripcionTipoImpuesto: '',
              descripcionTipoFactor: '',
              descripcionCategoriaImpuesto: '',
              descripcionClasificacionImpuesto: '',
            });
            this.limpiarNuevoDetalle();
          }
        }
      });
  }

  limpiarNuevoDetalle() {
    this.nuevoDetalleOrdenVenta.id = 0;
    this.nuevoDetalleOrdenVenta.idProductoYservicio = 0;
    this.nuevoDetalleOrdenVenta.idEstimacion = 0;
    this.nuevoDetalleOrdenVenta.cantitdad = 0;
    this.nuevoDetalleOrdenVenta.precioUnitario = 0;
    this.nuevoDetalleOrdenVenta.descuento = 0;
    this.nuevoDetalleOrdenVenta.importeTotal = 0;
    this.nuevoDetalleOrdenVenta.impuestosDetalleOrdenVenta = [];
    this.nuevoDetalleOrdenVenta.descripcion = '';
    this.nuevoDetalleOrdenVenta.idOrdenVenta = this.ordenVenta.id;
  }

  closeModal() {
    this.isModalOpen = false;
    this.impuestosOpen = false;
    this.ordenVenta.idCliente = 0;
    this.ordenVenta.observaciones = '';
    this.ordenVenta.detalleOrdenVenta = [];
    this.listaClientes = false;
  }

  seleccionarCliente(cliente: clienteDTO) {
    this.ordenVenta.idCliente = cliente.id;
    this.ordenVenta.razonSocialCliente = cliente.razonSocial;
    this.listaClientes = false;
  }

  /**
   * Selecciona un almacen para la orden de venta
   * @param almacen El almacen seleccionado
   */
  seleccionarAlmacen(almacen: almacenDTO) {
    // Asigna el id del almacen seleccionado a la orden de venta
    this.cancelarOrdenVentaDTO.idAlmacenDestino = almacen.id;
    this.nombreAlmacen = almacen.almacenNombre;
    // Oculta la lista de almacenes
    this.SlistaAlmacenes = false;
  }

  agregarDetalle() {
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

  seleccionarProducto(producto: ProductoYServicioDTO) {
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

  seleccionarImpuestos(
    tipoImpuesto: TipoImpuestoDTO,
    impuesto: ImpuestoDetalleOrdenVentaDTO
  ) {
    impuesto.idTipoImpuesto = tipoImpuesto.id;
    impuesto.descripcionTipoImpuesto = tipoImpuesto.descripcionImpuesto;
    this.agregarImpuesto(impuesto);
  }

  seleccionarFactores(
    tipoFactor: TipoFactorDTO,
    impuesto: ImpuestoDetalleOrdenVentaDTO
  ) {
    impuesto.idTipoFactor = tipoFactor.id;
    impuesto.descripcionTipoFactor = tipoFactor.descripcion;
    this.agregarImpuesto(impuesto);
  }

  seleccionarCategorias(
    categorias: CategoriaImpuestoDTO,
    impuesto: ImpuestoDetalleOrdenVentaDTO
  ) {
    impuesto.idCategoriaImpuesto = categorias.id;
    impuesto.descripcionCategoriaImpuesto = categorias.tipo;
    this.agregarImpuesto(impuesto);
  }

  guardarDetalle(detalle: DetalleOrdenVentaDTO) {
    if (
      detalle.idProductoYservicio == 0 ||
      detalle.idProductoYservicio == undefined ||
      detalle.idProductoYservicio == null ||
      // || detalle.idEstimacion == 0 || detalle.idEstimacion == undefined || detalle.idEstimacion == null
      detalle.cantitdad == 0 ||
      detalle.cantitdad == undefined ||
      detalle.cantitdad == null ||
      detalle.precioUnitario == 0 ||
      detalle.precioUnitario == undefined ||
      detalle.precioUnitario == null
    ) {
      console.log(detalle);
      this.mensajeAlerta = 'Captura los campos obligatorios';
      return;
    } else {
      this.mensajeAlerta = '';
    }

    if (detalle.id == 0) {
      //crear nuevo detalle
      this.cargarOrdenVenta();
    } else {
      //editar detalle
      this.cargarOrdenVenta();
    }
  }

  // eliminarOrdenVenta(ordenVenta: OrdenVentaDTO) {
  //   Swal.fire({
  //     confirmButtonText: 'Aceptar',
  //     cancelButtonText: 'Cancelar',
  //     showCancelButton: true,
  //     html: `<p>¿Desea eliminar la orden de venta?</p>`,
  //   }).then((result) => {
  //     if (result.isConfirmed) {
  //       this._ordenVentaService.eliminarOrdenVenta(ordenVenta.id, this.selectedEmpresa).subscribe((respuesta) => {
  //         this.cargarOrdenesVenta();
  //       });
  //     } else {
  //       return;
  //     }
  //     this.ChangeDetectorRef.detectChanges();
  //   });
  // }

  abrirModalCancelarOrdenVenta(id: number){
    this.mensajeAlerta = '';
    this.isOpenModalCancelar = true;
    this.cancelarOrdenVentaDTO.idOrdenVenta = id;
  }

  cerrarModalCancelarOrdenVenta(){
    this.mensajeAlerta = '';
    this.isOpenModalCancelar = false;
    this.cancelarOrdenVentaDTO.idOrdenVenta = 0;
    this.cancelarOrdenVentaDTO.idAlmacenDestino = 0;
    this.nombreAlmacen = '';
    this.SlistaAlmacenes = false;
  }
  cancelarOrdenVenta() {
    if(this.cancelarOrdenVentaDTO.idAlmacenDestino == 0){
      this.mensajeAlerta = 'Selecciona un almacen';
      return;
    }
    Swal.fire({
      confirmButtonText: 'Aceptar',
      cancelButtonText: 'Cancelar',
      showCancelButton: true,
      html: `<p>¿Estás seguro de que deseas cancelar esta venta?</p>`,
    }).then((result) => {
      if (result.isConfirmed) {
        this._ordenVentaService
          .cancelar(this.selectedEmpresa, this.cancelarOrdenVentaDTO)
          .subscribe({
            next: (resp) => {
              if(resp.estatus){
                this.cerrarModalCancelarOrdenVenta();
                this.cargarOrdenesVenta();
              }
            },
            error: () => {
              //Mensaje de error
            },
          });
      } else {
        return;
      }
      this.ChangeDetectorRef.detectChanges();
    });
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
    this.mensajeAlerta = 'Seguro de eliminar el detalle?';
    this.esEliminar = true;
    this.elimandoDatalle = true;
    this.elimandoImpuesto = false;
  }

  noEliminar() {
    this.mensajeAlerta = '';
    this.esEliminar = false;
    this.elimandoDatalle = false;
    this.elimandoImpuesto = false;
  }

  eliminarRegistro() {
    if (this.elimandoDatalle) {
      this._ordenVentaService
        .eliminarDetalle(
          this.selectedDetalleOrdenVenta.id,
          this.selectedEmpresa
        )
        .subscribe({
          next: () => {
            this.cargarOrdenVenta();
            this.noEliminar();
          },
        });
    }
    if (this.elimandoImpuesto) {
      this._ordenVentaService
        .eliminarImpuesto(this.selectedImpuesto.id, this.selectedEmpresa)
        .subscribe({
          next: () => {
            this.cargarOrdenVenta();
            this.noEliminar();
          },
        });
    }
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

  filtrarAlmacen(event: Event) {
    this.listaAlmacenes = this.listaAlmacenesReset;
    const filterValue = (
      event.target as HTMLInputElement
    ).value.toLocaleLowerCase();
    this.listaAlmacenes = this.listaAlmacenes.filter((almacen) =>
      almacen.almacenNombre.toLocaleLowerCase().includes(filterValue)
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
        descripcionClasificacionImpuesto: '',
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
    } else {
      this.mensajeAlerta = '';
    }

    let existeImpuesto =
      this.selectedDetalleOrdenVenta.impuestosDetalleOrdenVenta.filter(
        (z) => z.idTipoImpuesto == impuesto.idTipoImpuesto
      );
    if (existeImpuesto.length >= 2) {
      this.mensajeAlerta = 'El impuesto ya fue seleccionado';
      impuesto.idTipoImpuesto = 0;
      impuesto.descripcionTipoImpuesto = '';
      return;
    } else {
      this.mensajeAlerta = '';
      this.mostrarListaImpuestos = false;
      this.mostrarListaFactores = false;
      this.mostrarListaCategoria = false;
    }

    if (impuesto.id == 0) {
      this._ordenVentaService
        .crearImpuesto(impuesto, this.selectedEmpresa)
        .subscribe({
          next: () => {
            this.cargarOrdenVenta();
          },
        });
    } else {
      this._ordenVentaService
        .editarImpuesto(impuesto, this.selectedEmpresa)
        .subscribe({
          next: () => {
            this.cargarOrdenVenta();
          },
        });
    }
  }

  /**
   * Elimina un impuesto de la lista de impuestos de un detalle de orden de venta.
   * @param impuesto El impuesto a eliminar.
   */
  eliminarImpuesto(impuesto: ImpuestoDetalleOrdenVentaDTO) {
    this.mensajeAlerta = 'Seguro de eliminar el impuesto?';
    this.esEliminar = true;
    this.elimandoDatalle = false;
    this.elimandoImpuesto = true;
  }

  /**
   * Crea una orden de venta.
   */
  crearOrdenVenta() {
    //Revisa si crear esta permitido
    if (this.permiteCrear) {
      // Establece la fecha de registro actual
      this.ordenVenta = {
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

      // Llama al servicio de ordenes de venta para crear una orden
      this._ordenVentaService
        .crear(this.selectedEmpresa, this.ordenVenta)
        .subscribe({
          /**
           * Se llama cuando se crea correctamente la orden de venta.
           * @param resp La respuesta del servidor.
           */
          next: (resp) => {
            // Carga la lista de ordenes de venta
            this.cargarOrdenesVenta();
            this.bloquearBotonCrear();
          },
          /**
           * Se llama cuando se produce un error al crear la orden de venta.
           * @param error El error producido.
           */
          error: () => {
            // Mensaje de error
          },
        });
    } else {
      console.log('No se permiten crear ordenes de venta seguidas.');
    }
  }

  bloquearBotonCrear() {
    this.permiteCrear = false;
    setTimeout(() => {
      this.permiteCrear = true;
    }, 1000);
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
      this.listaClientes = false;
    }
    event.stopPropagation();
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

}
