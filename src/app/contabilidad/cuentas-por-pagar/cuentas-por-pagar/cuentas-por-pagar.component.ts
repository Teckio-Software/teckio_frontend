import { Component, TemplateRef, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { OrdenCompraService } from 'src/app/compras/orden-compra/orden-compra.service';
import { FacturaXOrdenCompraDTO, ordenCompraDTO, OrdenCompraFacturasDTO } from 'src/app/compras/orden-compra/tsOrdenCompra';
import { FacturaDetalleDTO } from 'src/app/facturacionTeckio/facturas';
import { SeguridadService } from 'src/app/seguridad/seguridad.service';
import { AlertaTipo } from 'src/app/utilidades/alert/alert.component';

@Component({
  selector: 'app-cuentas-por-pagar',
  templateUrl: './cuentas-por-pagar.component.html',
  styleUrls: ['./cuentas-por-pagar.component.css']
})
export class CuentasPorPagarComponent {
@ViewChild('dialogNuevaFactura', { static: true })
    dialogCargaFactura!: TemplateRef<any>;

  selectedEmpresa : number = 0;
  selectedProyecto : number = 0;
  crearCuenta: boolean = false;
  verCuenta: boolean = false;
  cerrar: boolean = false;

  ordenesCompraPorPagar : ordenCompraDTO[] = [];
  ordenesCompraPorPagarReset : ordenCompraDTO[] = [];

  ordenCompraFacturas : OrdenCompraFacturasDTO = {
    idOrdenCompra: 0,
    montoTotalOrdenCompra: 0,
    montoTotalFactura: 0,
    estatusSaldado: 0,
    facturasXOrdenCompra: []
  }
  archivosCargarFacturas: FileList | null = null;
  IdOrdenCompra: number = 0;
  detalleFacturaXOC: FacturaDetalleDTO[] = [];


  alertaSuccess: boolean = false;
    alertaMessage: string = '';
    alertaTipo: AlertaTipo = AlertaTipo.none;
    AlertaTipo = AlertaTipo;

    fechaInicio: string = '';
  fechaFin: string = '';
  filtroEstatus: string = '';
  proveedorRazonSocial: string = '';

  listaProveedores: string[] = [];
  listaProveedoresReset: string[] = [];
  mostrarListaProveedor : boolean = false;

  mostrarFormularioMovimientoBancario : boolean = false;
  IdProveedor : number = 0;
  IdOrdenCompraSeleccionada : number = 0;


  constructor(
    private _seguridadService: SeguridadService,
    private _OrdenCompraService : OrdenCompraService,
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
    this._OrdenCompraService.ObtenerTodasSinPagar(this.selectedEmpresa).subscribe((datos) => {
      this.ordenesCompraPorPagar = datos;
      this.ordenesCompraPorPagarReset = datos;
      this.listaProveedores = [
          ...new Set(this.ordenesCompraPorPagar.map((z) => z.razonSocial)),
        ];
        this.listaProveedoresReset = [
          ...new Set(this.ordenesCompraPorPagar.map((z) => z.razonSocial)),
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

  nuevaFacturaOrdenCompra(IdOrdenCompra: number) {
    this.IdOrdenCompra = IdOrdenCompra;
    this._OrdenCompraService.ObtenerFacturasXOrdenCompra(this.selectedEmpresa, IdOrdenCompra).subscribe((datos) => {
      this.ordenCompraFacturas = datos;
      });

    this.dialog.open(this.dialogCargaFactura, {
      width: '10%',
      disableClose: true,
    });
  }

  cargarFactura() {
      if (this.archivosCargarFacturas) {
        this._OrdenCompraService
          .cargarFacturasXOrdenCompra(
            this.archivosCargarFacturas,
            this.selectedEmpresa,
            this.IdOrdenCompra
          )
          .subscribe((datos) => {
            if (datos.estatus) {
              this.alerta(AlertaTipo.save, datos.descripcion);
              this._OrdenCompraService
                .ObtenerFacturasXOrdenCompra(
                  this.selectedEmpresa,
                  this.IdOrdenCompra
                )
                .subscribe((datos) => {
                  this.ordenCompraFacturas = datos;
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

  autorizarFactura(facturaOC: FacturaXOrdenCompraDTO) {
      this._OrdenCompraService
        .AutorizarFacturaXOrdenCompra(this.selectedEmpresa, facturaOC)
        .subscribe((datos) => {
          if (datos.estatus) {
            this._OrdenCompraService
              .ObtenerFacturasXOrdenCompra(
                this.selectedEmpresa,
                this.IdOrdenCompra
              )
              .subscribe((datos) => {
                this.ordenCompraFacturas = datos;
              });
          }
        });
    }

    cancelarFactura(facturaOC: FacturaXOrdenCompraDTO) {
      this._OrdenCompraService
        .CancelarFacturaXOrdenCompra(this.selectedEmpresa, facturaOC)
        .subscribe((datos) => {
          if (datos.estatus) {
            this._OrdenCompraService
              .ObtenerFacturasXOrdenCompra(
                this.selectedEmpresa,
                this.IdOrdenCompra
              )
              .subscribe((datos) => {
                this.ordenCompraFacturas = datos;
              });
          }
        });
    }

    facturaDetalleSelected(factura: FacturaXOrdenCompraDTO) {
        // Si ya está seleccionado, lo deseleccionamos (cerramos la tabla)
        if (this.detalleFacturaXOC === factura.detalleFactura) {
          this.detalleFacturaXOC = [];
        } else {
          // Si es otro o aún no hay ninguno seleccionado, lo mostramos
          this.detalleFacturaXOC = factura.detalleFactura;
        }
      }

      seleccionEstatus(event: any) {
    this.filtroEstatus = event.target.value;
    console.log('este es el estatus', this.filtroEstatus);
    this.filtrarTablaOrdenesVentaPorCobrar();
  }

  filtrarTablaOrdenesVentaPorCobrar() {
    this.ordenesCompraPorPagar = this.ordenesCompraPorPagarReset;
    if (
      this.filtroEstatus != undefined &&
      this.filtroEstatus != null &&
      this.filtroEstatus != ''
    ) {
      this.ordenesCompraPorPagar = this.ordenesCompraPorPagar.filter(
        (z) => z.estatusSaldado == Number(this.filtroEstatus)
      );
    }
    if (this.proveedorRazonSocial != '') {
      console.log("con la razon social", this.proveedorRazonSocial);
      this.ordenesCompraPorPagar = this.ordenesCompraPorPagar.filter((z) =>
        z.razonSocial
          .toLocaleLowerCase()
          .includes(this.proveedorRazonSocial.toLocaleLowerCase())
      );
    }

    const start = this.parseISOToLocal(this.fechaInicio);
    const end = this.parseISOToLocal(this.fechaFin);

    console.log(start, end);

    if (start) start.setHours(0, 0, 0, 0);
    if (end) end.setHours(23, 59, 59, 999);

    this.ordenesCompraPorPagar = this.ordenesCompraPorPagar.filter((z) => {
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

  filtrarProveedor(event: Event) {
    const filterValue = (
      event.target as HTMLInputElement
    ).value.toLocaleLowerCase();
    this.proveedorRazonSocial = filterValue;
    this.listaProveedores = this.listaProveedoresReset.filter((z) =>
      z.toLocaleLowerCase().includes(filterValue)
    );
    this.filtrarTablaOrdenesVentaPorCobrar();
  }

  seleccionarProveedor(Proveedor: string) {
    this.proveedorRazonSocial = Proveedor;
    this.mostrarListaProveedor = false;
    this.filtrarTablaOrdenesVentaPorCobrar();
  }

  limpiarFiltros() {
    this.proveedorRazonSocial = '';
    this.filtroEstatus = '';
    this.fechaInicio = '';
    this.fechaFin = '';
    this.filtrarTablaOrdenesVentaPorCobrar();
  }

  abrirModalMovimientoBancario(orden : ordenCompraDTO): void {
      this.IdOrdenCompraSeleccionada  = orden.id;
      this.IdProveedor = orden.idContratista;
      this.mostrarFormularioMovimientoBancario = true;
    }

    cerrarFormularioNuevoMovimiento(recargar = false) {
      this.cargarOrdenesXCobrar();
      this.mostrarFormularioMovimientoBancario = false;

    }
}
