import { id } from 'date-fns/locale';
import { Component, TemplateRef, ViewChild } from '@angular/core';
import { VentasService } from 'src/app/gestion-ventas/ventas/ventas.service';
import { SeguridadService } from 'src/app/seguridad/seguridad.service';
import { FacturaXOrdenVentaDTO, OrdenVentaDTO, OrdenVentaFacturasDTO } from 'src/app/gestion-ventas/ventas/ordenVenta';
import { OrdenCompraFacturasDTO } from 'src/app/compras/orden-compra/tsOrdenCompra';
import { MatDialog } from '@angular/material/dialog';
import { AlertaTipo } from 'src/app/utilidades/alert/alert.component';
import { FacturaDetalleDTO } from 'src/app/facturacionTeckio/facturas';

@Component({
  selector: 'app-cuentas-por-cobrar',
  templateUrl: './cuentas-por-cobrar.component.html',
  styleUrls: ['./cuentas-por-cobrar.component.css'],
})
export class CuentasPorCobrarComponent {
  @ViewChild('dialogNuevaFactura', { static: true })
    dialogCargaFactura!: TemplateRef<any>;

  selectedEmpresa : number = 0;
  selectedProyecto : number = 0;
  crearCuenta: boolean = false;
  verCuenta: boolean = false;
  cerrar: boolean = false;

  ordenesVentasPorCobrar : OrdenVentaDTO[] = [];
  ordenesVentasPorCobrarReset : OrdenVentaDTO[] = [];

  ordenVentaFacturas : OrdenVentaFacturasDTO = {
    idOrdenVenta: 0,
    montoTotalOrdenVenta: 0,
    montoTotalFactura: 0,
    estatusSaldado: 0,
    facturasXOrdenVenta: []
  }
  archivosCargarFacturas: FileList | null = null;
  idOrdenVenta: number = 0;
    detalleFacturaXOV: FacturaDetalleDTO[] = [];


  alertaSuccess: boolean = false;
    alertaMessage: string = '';
    alertaTipo: AlertaTipo = AlertaTipo.none;
    AlertaTipo = AlertaTipo;

    fechaInicio: string = '';
  fechaFin: string = '';
  filtroEstatus: string = '';
  clienteRazonSocial: string = '';

  listaClientes: string[] = [];
  listaClientesReset: string[] = [];
  mostrarListaCliente : boolean = false;

  constructor(
    private _seguridadService: SeguridadService,
    private _OrdenVentaService : VentasService,
        private dialog: MatDialog
  ) {
    let idEmpresa = _seguridadService.obtenIdEmpresaLocalStorage();
    this.selectedEmpresa = Number(idEmpresa);
    let idProyecto = _seguridadService.obtenerIdProyectoLocalStorage();
    this.selectedProyecto = Number(idProyecto);
  }

  ngOnInit(): void {
    this.cargarOrdenesXCobrar();
  }

  cargarOrdenesXCobrar(){
    this._OrdenVentaService.ObtenerTodasSinPagar(this.selectedEmpresa).subscribe((datos) => {
      this.ordenesVentasPorCobrar = datos;
      this.ordenesVentasPorCobrarReset = datos;
      this.listaClientes = [
          ...new Set(this.ordenesVentasPorCobrar.map((z) => z.razonSocialCliente)),
        ];
        this.listaClientesReset = [
          ...new Set(this.ordenesVentasPorCobrar.map((z) => z.razonSocialCliente)),
        ];
    });
  }

  nuevaCuenta() {
    this.crearCuenta = true;
  }

  verCuentas() {
    console.log('click');
    this.verCuenta = true;
  }

  nuevaFacturaOrdenVenta(IdOrdenVenta: number) {
    this.idOrdenVenta = IdOrdenVenta;
    this._OrdenVentaService.ObtenerFacturasXOrdenVenta(this.selectedEmpresa, IdOrdenVenta).subscribe((datos) => {
      this.ordenVentaFacturas = datos;
      });

    this.dialog.open(this.dialogCargaFactura, {
      width: '10%',
      disableClose: true,
    });
  }

  cargarFactura() {
      if (this.archivosCargarFacturas) {
        this._OrdenVentaService
          .cargarFacturasXOrdenVenta(
            this.archivosCargarFacturas,
            this.selectedEmpresa,
            this.idOrdenVenta
          )
          .subscribe((datos) => {
            if (datos.estatus) {
              this.alerta(AlertaTipo.save, datos.descripcion);
              this._OrdenVentaService
                .ObtenerFacturasXOrdenVenta(
                  this.selectedEmpresa,
                  this.idOrdenVenta
                )
                .subscribe((datos) => {
                  this.ordenVentaFacturas = datos;
                });
            } else {
              this.alerta(AlertaTipo.error, datos.descripcion);
            }
            this.limpiarCargarFactura();
          });
      } else {
        console.log('no hay facturas');
      }
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
        }, 2500);
      }

  limpiarCargarFactura() {
    this.dialog.closeAll();
  }

  detenerCierre(event: MouseEvent) {
    event.stopPropagation();
  }

  onFileChangeFactura(event: any) {
    const files = (event.target as HTMLInputElement).files;
    this.archivosCargarFacturas = files;
  }

  cerrarAlerta() {
    this.alertaSuccess = false;
    this.alertaTipo = AlertaTipo.none;
    this.alertaMessage = '';
  }

  autorizarFactura(facturaOV: FacturaXOrdenVentaDTO) {
      this._OrdenVentaService
        .AutorizarFacturaXOrdenVenta(this.selectedEmpresa, facturaOV)
        .subscribe((datos) => {
          if (datos.estatus) {
            this._OrdenVentaService
              .ObtenerFacturasXOrdenVenta(
                this.selectedEmpresa,
                this.idOrdenVenta
              )
              .subscribe((datos) => {
                this.ordenVentaFacturas = datos;
              });
          }
        });
    }

    cancelarFactura(facturaOV: FacturaXOrdenVentaDTO) {
      this._OrdenVentaService
        .CancelarFacturaXOrdenVenta(this.selectedEmpresa, facturaOV)
        .subscribe((datos) => {
          if (datos.estatus) {
            this._OrdenVentaService
              .ObtenerFacturasXOrdenVenta(
                this.selectedEmpresa,
                this.idOrdenVenta
              )
              .subscribe((datos) => {
                this.ordenVentaFacturas = datos;
              });
          }
        });
    }

    facturaDetalleSelected(factura: FacturaXOrdenVentaDTO) {
        // Si ya está seleccionado, lo deseleccionamos (cerramos la tabla)
        if (this.detalleFacturaXOV === factura.detalleFactura) {
          this.detalleFacturaXOV = [];
        } else {
          // Si es otro o aún no hay ninguno seleccionado, lo mostramos
          this.detalleFacturaXOV = factura.detalleFactura;
        }
      }

      seleccionEstatus(event: any) {
    this.filtroEstatus = event.target.value;
    console.log('este es el estatus', this.filtroEstatus);
    this.filtrarTablaOrdenesVentaPorCobrar();
  }

  filtrarTablaOrdenesVentaPorCobrar() {
    this.ordenesVentasPorCobrar = this.ordenesVentasPorCobrarReset;
    if (
      this.filtroEstatus != undefined &&
      this.filtroEstatus != null &&
      this.filtroEstatus != ''
    ) {
      this.ordenesVentasPorCobrar = this.ordenesVentasPorCobrar.filter(
        (z) => z.estatusSaldado == Number(this.filtroEstatus)
      );
    }
    if (this.clienteRazonSocial != '') {
      this.ordenesVentasPorCobrar = this.ordenesVentasPorCobrar.filter((z) =>
        z.razonSocialCliente
          .toLocaleLowerCase()
          .includes(this.clienteRazonSocial.toLocaleLowerCase())
      );
    }

    const start = this.parseISOToLocal(this.fechaInicio);
    const end = this.parseISOToLocal(this.fechaFin);

    if (start) start.setHours(0, 0, 0, 0);
    if (end) end.setHours(23, 59, 59, 999);

    this.ordenesVentasPorCobrar = this.ordenesVentasPorCobrar.filter((z) => {
      const d = this.toDate(z.fechaRegistro);
      if (!d) return false;
      return (!start || d >= start) && (!end || d <= end);
    });
  }

  private toDate(val: Date | string | null | undefined): Date | null {
    if (!val) return null;
    return val instanceof Date ? val : new Date(val);
  }

  private parseISOToLocal(iso: string): Date | null {
    if (!iso) return null;
    const [y, m, d] = iso.split('-').map(Number);
    return new Date(y, m - 1, d); // ← local, sin saltos por zona
  }

  filtrarCliente(event: Event) {
    const filterValue = (
      event.target as HTMLInputElement
    ).value.toLocaleLowerCase();
    this.clienteRazonSocial = filterValue;
    this.listaClientes = this.listaClientesReset.filter((z) =>
      z.toLocaleLowerCase().includes(filterValue)
    );
    this.filtrarTablaOrdenesVentaPorCobrar();
  }

  seleccionarCliente(cliente: string) {
    this.clienteRazonSocial = cliente;
    this.mostrarListaCliente = false;
    this.filtrarTablaOrdenesVentaPorCobrar();
  }
}
