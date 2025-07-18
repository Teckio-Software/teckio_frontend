import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import {
  CuentaBancariaClienteDTO,
  CuentaBancariaContratistaDTO,
} from '../../cuentabancaria';
import { BancoDTO } from 'src/app/bancos/banco/tsBanco';
import { CuentabancariaClienteService } from '../cuentabancaria-cliente.service';
import { BancoService } from 'src/app/bancos/banco/banco.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-cuentabancaria-cliente',
  templateUrl: './cuentabancaria-cliente.component.html',
  styleUrls: ['./cuentabancaria-cliente.component.css'],
})
export class CuentabancariaClienteComponent {
  formulario!: FormGroup;
  cuentaBancaria: CuentaBancariaClienteDTO = {
    nombreBanco: '',
    id: 0,
    idBanco: 0,
    numeroCuenta: '',
    numeroSucursal: '',
    clabe: '',
    cuentaClabe: '',
    tipoMoneda: 0,
    fechaAlta: new Date(),
    idCliente: 0,
    existeCuentaContable: false,
  };

  bancos: BancoDTO[] = [];

  constructor(
    public dialogRef: MatDialogRef<CuentabancariaClienteComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private formBuilder: FormBuilder,
    private _BancoService: BancoService,
    private _CuentaBancaria: CuentabancariaClienteService
  ) {}

  ngOnInit(): void {
    this.dialogRef.updateSize('80%');
    this.formulario = this.formBuilder.group({
      Banco: ['', { validators: [] }],
      NumeroCuenta: ['', { validators: [] }],
      NumeroSucursal: ['', { validators: [] }],
      CuentaClabe: ['', { validators: [] }],
      TipoMoneda: ['', { validators: [] }],
    });
    this._BancoService.ObtenerBancos(this.data.idEmpresa).subscribe((datos) => {
      this.bancos = datos;
    });
  }

  guardarCuentaBancariaC() {
    this.cuentaBancaria.idCliente = this.data.idCliente;
    this.cuentaBancaria.idBanco = this.formulario.get('Banco')?.value;
    this.cuentaBancaria.numeroCuenta =
      this.formulario.get('NumeroCuenta')?.value;
    this.cuentaBancaria.numeroSucursal =
      this.formulario.get('NumeroSucursal')?.value;
    this.cuentaBancaria.clabe = this.formulario.get('CuentaClabe')?.value;
    this.cuentaBancaria.tipoMoneda = this.formulario.get('TipoMoneda')?.value;

    if (
      this.cuentaBancaria.idBanco <= 0 ||
      this.cuentaBancaria.idCliente <= 0 ||
      this.cuentaBancaria.numeroCuenta == '' ||
      this.cuentaBancaria.numeroCuenta == undefined ||
      this.cuentaBancaria.numeroSucursal == '' ||
      this.cuentaBancaria.numeroSucursal == undefined ||
      this.cuentaBancaria.clabe == '' ||
      this.cuentaBancaria.clabe == undefined ||
      this.cuentaBancaria.tipoMoneda == undefined ||
      this.cuentaBancaria.tipoMoneda <= 0
    ) {
      return;
    } else {
      this._CuentaBancaria
        .CrearCuentaBancaria(this.data.idEmpresa, this.cuentaBancaria)
        .subscribe((dato) => {
          if (dato) {
            this.cerrar();
          } else {
            console.log('ocurrio un error');
          }
        });
    }
  }

  cerrar() {
    this.dialogRef.close(false); // Cierra el diálogo y pasa false para indicar que se canceló la operación
  }

  detenerCierre(event: MouseEvent) {
    event.stopPropagation();
  }
}
