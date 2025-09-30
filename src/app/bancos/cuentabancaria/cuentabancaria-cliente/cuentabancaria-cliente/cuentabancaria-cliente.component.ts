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
import { RespuestaDTO } from 'src/app/utilidades/tsUtilidades';

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

  mensajeError: RespuestaDTO = {
      estatus: false,
      descripcion: ''
    };
  
    errorB: boolean = false;
    errorNCu: RespuestaDTO = {
      estatus: false,
      descripcion: ''
    };
    errorNS: RespuestaDTO = {
      estatus: false,
      descripcion: ''
    };
    errorC: RespuestaDTO = {
      estatus: false,
      descripcion: ''
    };
    errorTM: boolean = false;

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
      (this.cuentaBancaria.idBanco <= 0 || this.cuentaBancaria.idBanco.toString() == '') &&
      // this.cuentaBancaria.idCliente <= 0 &&
      (this.cuentaBancaria.numeroCuenta == '' ||
      this.cuentaBancaria.numeroCuenta == undefined) &&
      (this.cuentaBancaria.numeroSucursal == '' ||
      this.cuentaBancaria.numeroSucursal == undefined) &&
      (this.cuentaBancaria.clabe == '' ||
      this.cuentaBancaria.clabe == undefined) &&
      (this.cuentaBancaria.tipoMoneda == undefined ||
      this.cuentaBancaria.tipoMoneda <= 0)
    ) {
      this.mensajeError = {
        estatus: true,
        descripcion: 'Todos los campos son obligatorios',
      };
      return;
    } else {
      //Validaciones

      let c = true;

      if (this.cuentaBancaria.idBanco <= 0 || this.cuentaBancaria.idBanco.toString() == "") {
        this.errorB = true;
        c = false;
      }

      if (this.cuentaBancaria.idCliente <= 0) {
        this.mensajeError = {
        estatus: true,
        descripcion: 'No hay un cliente asociado',
      };
        c = false;
      }
      if(this.cuentaBancaria.numeroCuenta.length<10){
        this.errorNCu = {
          estatus: true,
          descripcion: 'El campo Numero de Cuenta debe tener 10 digitos'
        };
        c = false;
      }
      if (this.cuentaBancaria.numeroCuenta == "" || this.cuentaBancaria.numeroCuenta == undefined) {
        this.errorNCu = {
          estatus: true,
          descripcion: 'El campo Numero de Cuenta es obligatorio'
        };
        c = false;
      }
      if(this.cuentaBancaria.numeroSucursal.length<20){
        this.errorNS = {
          estatus: true,
          descripcion: 'El campo Numero de Sucursal debe tener 20 digitos'
        };
        c = false;
      }
      if (this.cuentaBancaria.numeroSucursal == "" || this.cuentaBancaria.numeroSucursal == undefined) {
        this.errorNS = {
          estatus: true,
          descripcion: 'El campo Numero de Sucursal es obligatorio'
        };
        c = false;
      }
      if(this.cuentaBancaria.clabe.length<18){
        this.errorC = {
          estatus: true,
          descripcion: 'El campo Clabe debe tener 18 digitos'
        };
        c = false;
      }
      if (this.cuentaBancaria.clabe == "" || this.cuentaBancaria.clabe == undefined) {
        this.errorC = {
          estatus: true,
          descripcion: 'El campo Clabe es obligatorio'
        };
        c = false;
      }

      if (this.cuentaBancaria.tipoMoneda == undefined || this.cuentaBancaria.tipoMoneda <= 0) {
        this.errorTM = true;
        c = false;
      }

      if(!c){
        return;
      }


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
