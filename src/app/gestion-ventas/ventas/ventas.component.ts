import { ProductoYServicioDTO } from './../productos/productos';
import { Component } from '@angular/core';
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
  };

  impuestosDetalleOrdenVenta: ImpuestoDetalleOrdenVentaDTO[] = [];

  clientes: clienteDTO[] = [];
  productosYServicio: ProductoYServicioDTO[] = [];
  productosYServicioReset: ProductoYServicioDTO[] = [];

  isLoading: boolean = true;

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
      },
      error: () => {
        //Imprime mensaje de error.
      },complete:()=>{
        this.isLoading = false;
      }
    });
    this.productosYServicio.push({
      id: 0,
      codigo: '555',
      descripcion: 'Nuevo Insumo',
      idUnidad: 0,
      idProductoYservicioSat: 0,
      idUnidadSat: 0,
      idCategoriaProductoYServicio: 0,
      idSubategoriaProductoYServicio: 0,
    });
    this.cargarOrdenesVenta();
    this.cargarProductosYServicios();
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

  openModal() {
    this.isModalOpen = true;
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
    });
  }

  closeModal() {
    this.isModalOpen = false;
    this.ordenVenta.idCliente = 0;
    this.ordenVenta.observaciones = '';
    this.ordenVenta.detalleOrdenVenta = [];
  }

  agregarDetalle() {
    if (this.ordenVenta.detalleOrdenVenta.length == 0) {
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
      });
    }

    let ultimoProducto =
      this.ordenVenta.detalleOrdenVenta[
        this.ordenVenta.detalleOrdenVenta.length - 1
      ];
    if (
      ultimoProducto.idProductoYservicio == 0 ||
      ultimoProducto.cantitdad == 0 ||
      ultimoProducto.cantitdad == undefined ||
      ultimoProducto.cantitdad == null ||
      ultimoProducto.precioUnitario == 0 ||
      ultimoProducto.precioUnitario == undefined ||
      ultimoProducto.precioUnitario == null
    ) {
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
    });
  }

  seleccionarProducto(producto: ProductoYServicioDTO) {
    this.selectedDetalleOrdenVenta.idProductoYservicio = producto.id;
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

  verImpuestos(detalle: DetalleOrdenVentaDTO) {
    if (detalle.impuestosDetalleOrdenVenta.length <= 0) {
      detalle.impuestosDetalleOrdenVenta.push({
        id: 0,
        idDetalleOrdenVenta: 0,
        idTipoImpuesto: 0,
        idTipoFactor: 0,
        idCategoriaImpuesto: 0,
        idClasificacionImpuesto: 0,
        tasaCuota: 0,
        importeTotal: 0,
      });
    }

    this.selectedDetalleOrdenVenta = detalle;
    this.impuestosDetalleOrdenVenta = detalle.impuestosDetalleOrdenVenta;
    this.impuestosOpen = true;
  }

  agregarImpuesto(impuesto: ImpuestoDetalleOrdenVentaDTO) {
    console.log(
      'Impuestos',
      this.selectedDetalleOrdenVenta.impuestosDetalleOrdenVenta
    );

    let existeImpuesto =
      this.selectedDetalleOrdenVenta.impuestosDetalleOrdenVenta.filter(
        (z) =>
          z.idTipoImpuesto == impuesto.idTipoImpuesto &&
          z.idTipoFactor == impuesto.idTipoFactor &&
          z.idCategoriaImpuesto == impuesto.idCategoriaImpuesto
      );
    if (existeImpuesto.length > 1) {
      impuesto.idCategoriaImpuesto = 0;
      impuesto.idTipoFactor = 0;
      impuesto.idTipoImpuesto = 0;
      impuesto.tasaCuota = 0;

      let existeVacio =
        this.selectedDetalleOrdenVenta.impuestosDetalleOrdenVenta.filter(
          (z) =>
            z.idTipoImpuesto == 0 &&
            z.idTipoFactor == 0 &&
            z.idCategoriaImpuesto == 0
        );

      if (existeVacio.length > 1) {
        let coincidencia =
          this.selectedDetalleOrdenVenta.impuestosDetalleOrdenVenta.findIndex(
            (z) =>
              z.idCategoriaImpuesto == 0 &&
              z.idTipoImpuesto == 0 &&
              z.idTipoFactor == 0
          );

        this.selectedDetalleOrdenVenta.impuestosDetalleOrdenVenta.splice(
          coincidencia,
          1
        );
      }

      return;
    }

    if (
      impuesto.idCategoriaImpuesto != 0 &&
      impuesto.idTipoFactor != 0 &&
      impuesto.idTipoImpuesto != 0 &&
      impuesto.tasaCuota != 0
    ) {
      this.selectedDetalleOrdenVenta.impuestosDetalleOrdenVenta.push({
        id: 0,
        idDetalleOrdenVenta: 0,
        idTipoImpuesto: 0,
        idTipoFactor: 0,
        idCategoriaImpuesto: 0,
        idClasificacionImpuesto: 0,
        tasaCuota: 0,
        importeTotal: 0,
      });
    }
  }

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
      .crear(this.selectedEmpresa, this.ordenVenta)
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
}
