import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CuentabancariaEmpresaService } from '../../cuentabancaria/cuentabancaria-empresa/cuentabancaria-empresa.service';
import { CuentaBancariaBaseDTO } from '../../cuentabancaria/cuentabancaria';
import { contratistaDTO } from 'src/app/catalogos/contratista/tsContratista';
import { clienteDTO } from 'src/app/catalogos/cliente/tsCliente';
import { ContratistaService } from 'src/app/catalogos/contratista/contratista.service';
import { ClienteService } from 'src/app/catalogos/cliente/cliente.service';
import { CuentabancariaClienteService } from '../../cuentabancaria/cuentabancaria-cliente/cuentabancaria-cliente.service';
import { CuentabancariaContratistaService } from '../../cuentabancaria/cuentabancaria-contratista/cuentabancaria-contratista.service';
import { movimientoBancarioCreacionDTO, MovimientoBancarioTeckioDTO } from '../tsMovimientoBancario';
import Swal from 'sweetalert2';
import { MovimientoBancarioService } from '../movimiento-bancario.service';
import { faL } from '@fortawesome/free-solid-svg-icons';
import { OrdenCompraService } from 'src/app/compras/orden-compra/orden-compra.service';
import { FacturaXOrdenCompraDTO, ordenCompraDTO } from 'src/app/compras/orden-compra/tsOrdenCompra';
import { da } from 'date-fns/locale';

@Component({
  selector: 'app-nuevo-movimiento-bancario',
  templateUrl: './nuevo-movimiento-bancario.component.html',
  styleUrls: ['./nuevo-movimiento-bancario.component.css']
})
export class NuevoMovimientoBancarioComponent {

  formulario !: FormGroup;
  movimientoBancario: MovimientoBancarioTeckioDTO = {
    id: 0,
    idPoliza: 0,
    idFactura: 0,
    idCuentaBancariaEmpresa: 0,
    noMovimientoBancario: '',
    folio: '',
    fechaAlta: new Date,
    fechaAplicacion: new Date,
    fechaCobra: new Date,
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
    ordenCompras: []
  };
  beneficiario: any[] = [];
  proveedores: contratistaDTO[] = [];
  clientes: clienteDTO[] = [];
  cuentaB: CuentaBancariaBaseDTO[] = [];
  seleccionaOtros = false;
  tipoBeneficiario = 0;
  OrdenesCompraPorPagar: ordenCompraDTO[] = [];
  FacturaXOrdenCompraPorPagar : FacturaXOrdenCompraDTO[] = [];

  constructor(
    public dialogRef: MatDialogRef<NuevoMovimientoBancarioComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private formBuilder: FormBuilder,
    private _ProveedoresService: ContratistaService,
    private _ClientesService: ClienteService,
    private _CuentasBancariasProveedores: CuentabancariaContratistaService,
    private _CuentasBancariasCleintes: CuentabancariaClienteService,
    private _CuentaBancariaEmpresa: CuentabancariaEmpresaService,
    private _MovimientoBancario: MovimientoBancarioService,
    private _OrdenCompraService: OrdenCompraService
  ) { }

  ngOnInit(): void {
    this.dialogRef.updateSize('80%');
    this.formulario = this.formBuilder.group({
      tipoBeneficiario: [0, { validators: [], },],
      idBeneficiario: [0, { validators: [], },],
      idCuentaBancaria: [0, { validators: [], },],
      moneda: [0, { validators: [], },],
      modalidad: [0, { validators: [], },],
      tipoDeposito: [0, { validators: [], },],
      montoTotal: [0, { validators: [], },],
      folio: ["", { validators: [], },],
      fechaAplicacion: [undefined, { validators: [], },],
      fechaCobra: [undefined, { validators: [], },],
      fechaAlta: [undefined, { validators: [], },],
      concepto: ["", { validators: [], },],
      tipoCambio: [0, { validators: [], },],
      estatus: [0, { validators: [], },],
      idFactura: [0, { validators: [], },],
      idPoliza: [0, { validators: [], },],
      noMovimientoBancario: ["", { validators: [], },],
      id: [0, { validators: [], },],
      idMovimientoBancario: [0, { validators: [], },],
      esFactura: [false, { validators: [], },],
      esOrdenCompra: [false, { validators: [], },]
    });
  }

  TraerBeneficiarios(event: Event) {
    const valor = Number((event.target as HTMLInputElement).value);
    this.movimientoBancario.tipoBeneficiario = Number(valor);
    this.movimientoBancario.esOrdenCompra = false;
    this.movimientoBancario.esFactura = false;

    this.cuentaB = [];
    console.log(valor);
    console.log("TB", this.movimientoBancario.tipoBeneficiario);
    switch (valor) {
      case 1:
        this._ProveedoresService.obtenerTodos(this.data.idEmpresa).subscribe((datos) => {
          this.beneficiario = datos;
          this.seleccionaOtros = false;
          this.tipoBeneficiario = 1;
        });
        break;
      case 2:
        this._ClientesService.obtenerTodos(this.data.idEmpresa).subscribe((datos) => {
          this.beneficiario = datos;
          this.seleccionaOtros = false;
          this.tipoBeneficiario = 2;
        });
        break;
      case 3:
        this.seleccionaOtros = true;
        this.tipoBeneficiario = 3;
        this.CuentasBancariasEmpresa();
        break;
    }
  }

  TraerCuentasBancarias(event: Event) {
    const IdBeneficiario = (event.target as HTMLInputElement).value;
    const indice = IdBeneficiario.indexOf(":");
    const valorSeleccion = Number(IdBeneficiario.substring(indice + 1, IdBeneficiario.length));

    switch (this.tipoBeneficiario) {
      case 1:
        this._CuentasBancariasProveedores.ObtenerXIdContratista(this.data.idEmpresa, valorSeleccion).subscribe((datos) => {
          this.cuentaB = datos;
        });
        this._OrdenCompraService.ObtenerXIdContratistaSinPagar(this.data.idEmpresa, valorSeleccion).subscribe((datos) => {
          this.OrdenesCompraPorPagar = datos;
          this.movimientoBancario.ordenCompras = this.OrdenesCompraPorPagar;
        });
        this._OrdenCompraService.ObtenerFacturasXIdContratistaSinPagar(this.data.idEmpresa, valorSeleccion).subscribe((datos) => {
          this.FacturaXOrdenCompraPorPagar = datos;
          this.movimientoBancario.facturasXOrdenCompra = this.FacturaXOrdenCompraPorPagar;
        });
        break;
      case 2:
        this._CuentasBancariasCleintes.ObtenerXIdCliente(this.data.idEmpresa, valorSeleccion).subscribe((datos) => {
          this.cuentaB = datos;
        });
        break;
    }
  }

  CuentasBancariasEmpresa() {

    this._CuentaBancariaEmpresa.ObtenerTodos(this.data.idEmpresa).subscribe((datos) => {
      this.cuentaB = datos;
      let cuentaEnUsu = this.cuentaB.findIndex(z => z.id == this.data.idCeuntaBancariaEmpresa);
      this.cuentaB.splice(cuentaEnUsu, 1);
    });
  }

  guardarMovimientoBancario() {
    this.movimientoBancario.idCuentaBancariaEmpresa = this.data.idCeuntaBancariaEmpresa;
    this.movimientoBancario.beneficiario = "";
    this.movimientoBancario.descripcionEstatus = "";
    this.movimientoBancario.descripcionModalidad = "";
    this.movimientoBancario.descripcionMoneda = "";
    if (this.movimientoBancario.tipoBeneficiario <= 0 || this.movimientoBancario.concepto == "" || this.movimientoBancario.folio == "" || this.movimientoBancario.fechaAplicacion == undefined ||
      this.movimientoBancario.fechaCobra == undefined || this.movimientoBancario.modalidad <= 0 || this.movimientoBancario.moneda <= 0 || this.movimientoBancario.montoTotal <= 0 ||
      this.movimientoBancario.tipoCambio <= 0 || this.movimientoBancario.tipoDeposito <= 0 || this.movimientoBancario.idCuentaBancaria == 0) {
      Swal.fire({
        title: "Error",
        text: "LLene todos los campos correctamente",
        icon: "error"
      });
      return;
    }
    if (this.movimientoBancario.idBeneficiario <= 0 && this.movimientoBancario.tipoBeneficiario != 3) {
      Swal.fire({
        title: "Error",
        text: "LLene todos los campos correctamente",
        icon: "error"
      });
      return;
    }

    this._MovimientoBancario.crear(this.data.idEmpresa, this.movimientoBancario).subscribe((datos) => {
      if (datos.estatus) {
        this.cerrar();
      } else {
        Swal.fire({
          title: "Error",
          text: datos.descripcion,
          icon: "error"
        });
      }
    });
  }

  esFactura() {
    if (this.movimientoBancario.esFactura) {
      this.movimientoBancario.esFactura = true;
      this.movimientoBancario.esOrdenCompra = false;
      this.movimientoBancario.montoTotal = 0;
      this.recalculaTotalFacturas();
    } else {
      this.movimientoBancario.esFactura = false;
      if(this.movimientoBancario.esFactura == false && this.movimientoBancario.esOrdenCompra == false){
        this.movimientoBancario.montoTotal = 0;
      }
    }
  }

  esOrdenCompra() {
    if (this.movimientoBancario.esOrdenCompra) {
      this.movimientoBancario.esOrdenCompra = true;
      this.movimientoBancario.esFactura = false;
      this.movimientoBancario.montoTotal = 0;
      this.recalculaTotalOrdenCompras();
    } else {
      this.movimientoBancario.esOrdenCompra = false;
      if(this.movimientoBancario.esFactura == false && this.movimientoBancario.esOrdenCompra == false){
        this.movimientoBancario.montoTotal = 0;
      }
    }
  }

  cerrar() {
    this.dialogRef.close(false);
  }

  detenerCierre(event: MouseEvent) {
    event.stopPropagation();
  }

  recalculaTotalFacturas(){
    this.movimientoBancario.montoTotal = 0;
    this.movimientoBancario.facturasXOrdenCompra.forEach((element) => {
      if(element.esSeleccionado){
      this.movimientoBancario.montoTotal += element.montoAPagar;
      }
    });
  }

  recalculaTotalOrdenCompras(){
    this.movimientoBancario.montoTotal = 0;
    this.movimientoBancario.ordenCompras.forEach((element) => {
      if(element.esSeleccionado){
      this.movimientoBancario.montoTotal += element.montoAPagar;
      }
    });
  }


}
