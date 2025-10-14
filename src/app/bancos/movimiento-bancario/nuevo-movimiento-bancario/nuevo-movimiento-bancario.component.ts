import { es, th } from 'date-fns/locale';
import {
  Component,
  EventEmitter,
  Inject,
  Input,
  OnChanges,
  OnInit,
  Optional,
  Output,
  SimpleChanges,
} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CuentabancariaEmpresaService } from '../../cuentabancaria/cuentabancaria-empresa/cuentabancaria-empresa.service';
import { CuentaBancariaBaseDTO } from '../../cuentabancaria/cuentabancaria';
import { ContratistaService } from 'src/app/catalogos/contratista/contratista.service';
import { ClienteService } from 'src/app/catalogos/cliente/cliente.service';
import { CuentabancariaClienteService } from '../../cuentabancaria/cuentabancaria-cliente/cuentabancaria-cliente.service';
import { CuentabancariaContratistaService } from '../../cuentabancaria/cuentabancaria-contratista/cuentabancaria-contratista.service';
import { MovimientoBancarioTeckioDTO } from '../tsMovimientoBancario';
import Swal from 'sweetalert2';
import { MovimientoBancarioService } from '../movimiento-bancario.service';
import { OrdenCompraService } from 'src/app/compras/orden-compra/orden-compra.service';
import { FacturaXOrdenCompraDTO, ordenCompraDTO } from 'src/app/compras/orden-compra/tsOrdenCompra';
import { VentasService } from 'src/app/gestion-ventas/ventas/ventas.service';
import { FacturaXOrdenVentaDTO, OrdenVentaDTO } from 'src/app/gestion-ventas/ventas/ordenVenta';

@Component({
  selector: 'app-nuevo-movimiento-bancario',
  templateUrl: './nuevo-movimiento-bancario.component.html',
  styleUrls: ['./nuevo-movimiento-bancario.component.css'],
})
export class NuevoMovimientoBancarioComponent implements OnInit, OnChanges {
  @Input() empresaId?: number;
  @Input() cuentaBancariaEmpresaId?: number;
  @Input() idCliente: number = 0;
  @Input() idOrdenVenta: number = 0;
  @Input() idProveedor: number = 0;
  @Input() idOrdenCompra: number = 0;


  @Output() closed = new EventEmitter<boolean>();

  movimientoBancario: MovimientoBancarioTeckioDTO = this.crearMovimientoInicial();
  beneficiario: any[] = [];
  cuentaB: CuentaBancariaBaseDTO[] = [];
  seleccionaOtros = false;
  tipoBeneficiario = 0;
  OrdenesCompraPorPagar: ordenCompraDTO[] = [];
  FacturaXOrdenCompraPorPagar: FacturaXOrdenCompraDTO[] = [];
  OrdenesVentaPorPagar: OrdenVentaDTO[] = [];
  FacturaXOrdenVentaPorPagar: FacturaXOrdenVentaDTO[] = [];
  private modalData?: { idEmpresa: number; idCeuntaBancariaEmpresa: number };
  private empresaContextoId = 0;
  private cuentaBancariaEmpresaContextoId = 0;
  cuentaBE: CuentaBancariaBaseDTO[] = [];

  constructor(
    @Optional() private dialogRef: MatDialogRef<NuevoMovimientoBancarioComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) data: any,
    private _ProveedoresService: ContratistaService,
    private _ClientesService: ClienteService,
    private _CuentasBancariasProveedores: CuentabancariaContratistaService,
    private _CuentasBancariasCleintes: CuentabancariaClienteService,
    private _CuentaBancariaEmpresa: CuentabancariaEmpresaService,
    private _MovimientoBancario: MovimientoBancarioService,
    private _OrdenCompraService: OrdenCompraService,
    private _OrdenVentaService: VentasService
  ) {
    this.modalData = data;
  }

  ngOnChanges(_: SimpleChanges): void {
    this.establecerContexto();
  }

  ngOnInit(): void {
    this.dialogRef?.updateSize('80%');
    console.log("esto es lo que se rcibe", this.cuentaBancariaEmpresaId);
    this.establecerContexto();
    if(this.idCliente != 0 || this.idProveedor != 0){
      this._CuentaBancariaEmpresa.ObtenerTodos(this.empresaContextoId).subscribe((datos) => {
        this.cuentaBE = datos;
    });
    }
    if(this.idCliente != 0){
      this.tipoBeneficiario = 2;
      this._ClientesService.obtenerTodos(this.empresaContextoId).subscribe((datos) => {
          this.beneficiario = datos;
        });
      this.movimientoBancario.idBeneficiario = this.idCliente;
      this.movimientoBancario.tipoBeneficiario = 2;
      this._CuentasBancariasCleintes
          .ObtenerXIdCliente(this.empresaContextoId, this.idCliente)
          .subscribe((datos) => {
            this.cuentaB = datos;
          });

          this._OrdenVentaService.ObtenerXIdClienteSinPagar(this.empresaContextoId, this.idCliente).subscribe((datos) => {
            console.log("esta son las ordenes de venta", datos);
          this.OrdenesVentaPorPagar = datos;
          this.OrdenesVentaPorPagar = this.OrdenesVentaPorPagar.filter((z) => z.id == this.idOrdenVenta);
          this.movimientoBancario.ordenVentas = this.OrdenesVentaPorPagar;
          console.log("estas son las ordenes de venta", this.OrdenesVentaPorPagar);
        });
        this._OrdenVentaService.ObtenerFacturasXIdClienteSinPagar(this.empresaContextoId, this.idCliente).subscribe((datos) => {

          this.FacturaXOrdenVentaPorPagar = datos;
          this.FacturaXOrdenVentaPorPagar = this.FacturaXOrdenVentaPorPagar.filter((z) => z.idOrdenVenta == this.idOrdenVenta);
          this.movimientoBancario.facturasXOrdenVenta = this.FacturaXOrdenVentaPorPagar;
        })
    }
    if(this.idProveedor != 0){
      console.log("entro al proveedor", this.idProveedor);
      this.tipoBeneficiario = 1;
      this._ProveedoresService.obtenerTodos(this.empresaContextoId).subscribe((datos) => {
          this.beneficiario = datos;
        });
        this.movimientoBancario.idBeneficiario = this.idProveedor;
      this.movimientoBancario.tipoBeneficiario = 1;
      this._CuentasBancariasProveedores
          .ObtenerXIdContratista(this.empresaContextoId, this.idProveedor)
          .subscribe((datos) => {
            this.cuentaB = datos;
          });
        this._OrdenCompraService
          .ObtenerXIdContratistaSinPagar(this.empresaContextoId, this.idProveedor)
          .subscribe((datos) => {
            this.OrdenesCompraPorPagar = datos;
            this.OrdenesCompraPorPagar = this.OrdenesCompraPorPagar.filter((z) => z.id == this.idOrdenCompra);
            this.movimientoBancario.ordenCompras = this.OrdenesCompraPorPagar;
            console.log("esta son las facturas de ordenes de venta", this.OrdenesCompraPorPagar);

          });
        this._OrdenCompraService
          .ObtenerFacturasXIdContratistaSinPagar(this.empresaContextoId, this.idProveedor)
          .subscribe((datos) => {
            this.FacturaXOrdenCompraPorPagar = datos;
            this.FacturaXOrdenCompraPorPagar = this.FacturaXOrdenCompraPorPagar.filter((z) => z.idOrdenCompra == this.idOrdenCompra);
            this.movimientoBancario.facturasXOrdenCompra = this.FacturaXOrdenCompraPorPagar;
          });
    }
  }

  private establecerContexto() {
    this.empresaContextoId = this.empresaId ?? this.modalData?.idEmpresa ?? 0;
    this.cuentaBancariaEmpresaContextoId =
      this.cuentaBancariaEmpresaId ?? this.modalData?.idCeuntaBancariaEmpresa ?? 0;

      this.movimientoBancario.idCuentaBancariaEmpresa = this.cuentaBancariaEmpresaContextoId;
  }

  private crearMovimientoInicial(): MovimientoBancarioTeckioDTO {
    return {
      id: 0,
      idPoliza: 0,
      idFactura: 0,
      idCuentaBancariaEmpresa: 0,
      noMovimientoBancario: '',
      folio: '',
      fechaAlta: new Date(),
      fechaAplicacion: new Date(),
      fechaCobra: new Date(),
      modalidad: 0,
      tipoDeposito: 0,
      montoTotal: 0,
      concepto: '',
      tipoCambio: 0,
      moneda: 0,
      estatus: 0,
      tipoBeneficiario: 0,
      idBeneficiario: 0,
      idCuentaBancaria: 0,
      idMovimientoBancario: 0,
      beneficiario: '',
      descripcionModalidad: '',
      descripcionMoneda: '',
      descripcionEstatus: '',
      saldo: 0,
      esFactura: false,
      esOrdenCompra: false,
      facturasXOrdenCompra: [],
      ordenCompras: [],
      esFacturaOrdenVenta: false,
      esOrdenVenta: false,
      ordenVentas: [],
      facturasXOrdenVenta: []
    };
  }

  private reiniciarFormulario() {
    this.movimientoBancario = this.crearMovimientoInicial();
    this.beneficiario = [];
    this.cuentaB = [];
    this.OrdenesCompraPorPagar = [];
    this.FacturaXOrdenCompraPorPagar = [];
    this.seleccionaOtros = false;
    this.tipoBeneficiario = 0;
  }

  onCancelar() {
    this.cerrar(false);
  }

  cerrar(recargar = false) {
    this.reiniciarFormulario();
    if (this.dialogRef) {
      this.dialogRef.close(recargar);
    } else {
      this.closed.emit(recargar);
    }
  }
  onTipoBeneficiarioChange(tipo: number) {
    if (!this.empresaContextoId) {
      Swal.fire({
        title: 'Atencion',
        text: 'Selecciona primero una cuenta bancaria de empresa.',
        icon: 'warning',
      });
      return;
    }

    const valor = Number(tipo) || 0;
    this.movimientoBancario.tipoBeneficiario = valor;
    this.tipoBeneficiario = valor;
    this.movimientoBancario.idBeneficiario = 0;
    this.movimientoBancario.idCuentaBancaria = 0;
    this.movimientoBancario.esOrdenCompra = false;
    this.movimientoBancario.esFactura = false;
    this.movimientoBancario.montoTotal = 0;
    this.movimientoBancario.ordenCompras = [];
    this.movimientoBancario.facturasXOrdenCompra = [];
    this.beneficiario = [];
    this.cuentaB = [];
    this.OrdenesCompraPorPagar = [];
    this.FacturaXOrdenCompraPorPagar = [];
    this.seleccionaOtros = valor === 3 || valor === 4;

    if (!valor) {
      return;
    }

    switch (valor) {
      case 1:
        this._ProveedoresService.obtenerTodos(this.empresaContextoId).subscribe((datos) => {
          this.beneficiario = datos;
        });
        break;
      case 2:
        this._ClientesService.obtenerTodos(this.empresaContextoId).subscribe((datos) => {
          this.beneficiario = datos;
        });
        break;
      case 3:
        this.CuentasBancariasEmpresa();
        break;
      case 4:
        // Persona externa: se captura manualmente, no se cargan listas auxiliares.
        break;
    }
  }

  onBeneficiarioChange(idBeneficiario: number) {
    const valorSeleccion = Number(idBeneficiario) || 0;
    this.movimientoBancario.idBeneficiario = valorSeleccion;
    this.movimientoBancario.idCuentaBancaria = 0;
    this.cuentaB = [];
    this.movimientoBancario.ordenCompras = [];
    this.movimientoBancario.facturasXOrdenCompra = [];
    this.OrdenesCompraPorPagar = [];
    this.FacturaXOrdenCompraPorPagar = [];

    if (!valorSeleccion || !this.empresaContextoId) {
      return;
    }

    switch (this.tipoBeneficiario) {
      case 1:
        this._CuentasBancariasProveedores
          .ObtenerXIdContratista(this.empresaContextoId, valorSeleccion)
          .subscribe((datos) => {
            this.cuentaB = datos;
          });
        this._OrdenCompraService
          .ObtenerXIdContratistaSinPagar(this.empresaContextoId, valorSeleccion)
          .subscribe((datos) => {
            this.OrdenesCompraPorPagar = datos;
            this.movimientoBancario.ordenCompras = datos;
            console.log("esta son las facturas de ordenes de venta", this.OrdenesCompraPorPagar);
          });
        this._OrdenCompraService
          .ObtenerFacturasXIdContratistaSinPagar(this.empresaContextoId, valorSeleccion)
          .subscribe((datos) => {
            this.FacturaXOrdenCompraPorPagar = datos;
            this.movimientoBancario.facturasXOrdenCompra = datos;
          });
        break;
      case 2:
        this._CuentasBancariasCleintes
          .ObtenerXIdCliente(this.empresaContextoId, valorSeleccion)
          .subscribe((datos) => {
            this.cuentaB = datos;
          });
        this._OrdenVentaService.ObtenerXIdClienteSinPagar(this.empresaContextoId, valorSeleccion).subscribe((datos) => {
          this.OrdenesVentaPorPagar = datos;
          this.movimientoBancario.ordenVentas = datos;
        });
        this._OrdenVentaService.ObtenerFacturasXIdClienteSinPagar(this.empresaContextoId, valorSeleccion).subscribe((datos) => {
          this.FacturaXOrdenVentaPorPagar = datos;
          this.movimientoBancario.facturasXOrdenVenta = datos;
        })
        break;
    }
  }

  CuentasBancariasEmpresa() {
    this._CuentaBancariaEmpresa.ObtenerTodos(this.empresaContextoId).subscribe((datos) => {
      this.cuentaB = datos;
      const cuentaEnUso = this.cuentaB.findIndex(
        (z) => z.id === this.cuentaBancariaEmpresaContextoId,
      );
      if (cuentaEnUso >= 0) {
        this.cuentaB.splice(cuentaEnUso, 1);
      }
    });
  }

  guardarMovimientoBancario() {
    if (!this.movimientoBancario.idCuentaBancariaEmpresa) {
      Swal.fire({
        title: 'Error',
        text: 'Selecciona una cuenta bancaria de empresa antes de guardar.',
        icon: 'error',
      });
      return;
    }

    this.movimientoBancario.beneficiario = '';
    this.movimientoBancario.descripcionEstatus = '';
    this.movimientoBancario.descripcionModalidad = '';
    this.movimientoBancario.descripcionMoneda = '';
    if (
      this.movimientoBancario.tipoBeneficiario <= 0 ||
      this.movimientoBancario.concepto == '' ||
      this.movimientoBancario.folio == '' ||
      this.movimientoBancario.fechaAplicacion == undefined ||
      this.movimientoBancario.fechaCobra == undefined ||
      this.movimientoBancario.modalidad <= 0 ||
      this.movimientoBancario.moneda <= 0 ||
      this.movimientoBancario.montoTotal <= 0 ||
      this.movimientoBancario.tipoCambio <= 0 ||
      this.movimientoBancario.tipoDeposito <= 0 ||
      this.movimientoBancario.idCuentaBancaria == 0
    ) {
      Swal.fire({
        title: 'Error',
        text: 'Llena todos los campos correctamente.',
        icon: 'error',
      });
      return;
    }
    if (
      this.movimientoBancario.idBeneficiario <= 0 &&
      ![3, 4].includes(this.movimientoBancario.tipoBeneficiario)
    ) {
      Swal.fire({
        title: 'Error',
        text: 'Llena todos los campos correctamente.',
        icon: 'error',
      });
      return;
    }

    this._MovimientoBancario.crear(this.empresaContextoId, this.movimientoBancario).subscribe({
      next: (datos) => {
        if (datos.estatus) {
          const mensajeExito =
            (datos.descripcion as string) ?? 'Movimiento bancario creado correctamente.';
          this.reiniciarFormulario();
          Swal.fire({
            title: 'Exito',
            text: mensajeExito,
            icon: 'success',
          }).then(() => this.cerrar(true));
        } else {
          Swal.fire({
            title: 'Error',
            text: datos.descripcion,
            icon: 'error',
          });
        }
      },
      error: (error) => {
        console.error('Error al crear movimiento bancario', error);
        Swal.fire({
          title: 'Error',
          text: 'Ocurrio un error al guardar el movimiento bancario.',
          icon: 'error',
        });
      },
    });
  }

  esFactura() {
    if (this.movimientoBancario.esFactura) {
      this.movimientoBancario.esFactura = true;
      this.movimientoBancario.esOrdenCompra = false;
      this.movimientoBancario.esFacturaOrdenVenta = false;
      this.movimientoBancario.esOrdenVenta = false;

      this.movimientoBancario.montoTotal = 0;
      this.recalculaTotalFacturas();
    } else {
      this.movimientoBancario.esFactura = false;
      if (
        this.movimientoBancario.esFactura == false &&
        this.movimientoBancario.esOrdenCompra == false &&
        this.movimientoBancario.esFacturaOrdenVenta == false &&
        this.movimientoBancario.esOrdenVenta == false
      ) {
        this.movimientoBancario.montoTotal = 0;
      }
    }
  }

  esFacturaXOrdenVenta() {
    if (this.movimientoBancario.esFacturaOrdenVenta) {
      this.movimientoBancario.esFactura = false;
      this.movimientoBancario.esOrdenCompra = false;
      this.movimientoBancario.esFacturaOrdenVenta = true;
      this.movimientoBancario.esOrdenVenta = false;

      this.movimientoBancario.montoTotal = 0;
      this.recalculaTotalFacturasXOrdenVenta();
    } else {
      this.movimientoBancario.esFacturaOrdenVenta = false;
      if (
        this.movimientoBancario.esFactura == false &&
        this.movimientoBancario.esOrdenCompra == false &&
        this.movimientoBancario.esFacturaOrdenVenta == false &&
        this.movimientoBancario.esOrdenVenta == false
      ) {
        this.movimientoBancario.montoTotal = 0;
      }
    }
  }

  esOrdenCompra() {
    if (this.movimientoBancario.esOrdenCompra) {
      this.movimientoBancario.esFactura = false;
      this.movimientoBancario.esOrdenCompra = true;
      this.movimientoBancario.esFacturaOrdenVenta = false;
      this.movimientoBancario.esOrdenVenta = false;

      this.movimientoBancario.montoTotal = 0;
      this.recalculaTotalOrdenCompras();
    } else {
      this.movimientoBancario.esOrdenCompra = false;
      if (
        this.movimientoBancario.esFactura == false &&
        this.movimientoBancario.esOrdenCompra == false &&
        this.movimientoBancario.esFacturaOrdenVenta == false &&
        this.movimientoBancario.esOrdenVenta == false
      ) {
        this.movimientoBancario.montoTotal = 0;
      }
    }
  }

  esOrdenVenta() {
    if (this.movimientoBancario.esOrdenVenta) {
      this.movimientoBancario.esFactura = false;
      this.movimientoBancario.esOrdenCompra = false;
      this.movimientoBancario.esFacturaOrdenVenta = false;
      this.movimientoBancario.esOrdenVenta = true;

      this.movimientoBancario.montoTotal = 0;
      this.recalculaTotalOrdenVentas();
    } else {
      this.movimientoBancario.esOrdenVenta = false;
      if (
        this.movimientoBancario.esFactura == false &&
        this.movimientoBancario.esOrdenCompra == false &&
        this.movimientoBancario.esFacturaOrdenVenta == false &&
        this.movimientoBancario.esOrdenVenta == false
      ) {
        this.movimientoBancario.montoTotal = 0;
      }
    }
  }

  recalculaTotalFacturas() {
    this.movimientoBancario.montoTotal = 0;
    this.movimientoBancario.facturasXOrdenCompra.forEach((element) => {
      if (element.esSeleccionado) {
        this.movimientoBancario.montoTotal += element.montoAPagar;
      }
    });
  }

  recalculaTotalOrdenCompras() {
    this.movimientoBancario.montoTotal = 0;
    this.movimientoBancario.ordenCompras.forEach((element) => {
      if (element.esSeleccionado) {
        this.movimientoBancario.montoTotal += element.montoAPagar;
      }
    });
  }

  recalculaTotalFacturasXOrdenVenta() {
    this.movimientoBancario.montoTotal = 0;
    this.movimientoBancario.facturasXOrdenVenta.forEach((element) => {
      if (element.esSeleccionado) {
        this.movimientoBancario.montoTotal += element.montoAPagar;
      }
    });
  }

  recalculaTotalOrdenVentas() {
    this.movimientoBancario.montoTotal = 0;
    this.movimientoBancario.ordenVentas.forEach((element) => {
      if (element.esSeleccionado) {
        this.movimientoBancario.montoTotal += element.montoAPagar;
      }
    });
  }
}
