import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CuentaBancariaEmpresaDTO } from '../../cuentabancaria';
import { BancoDTO } from 'src/app/bancos/banco/tsBanco';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { SeguridadService } from 'src/app/seguridad/seguridad.service';
import { BancoService } from 'src/app/bancos/banco/banco.service';
import { CuentabancariaEmpresaService } from '../cuentabancaria-empresa.service';
import { RespuestaDTO } from 'src/app/utilidades/tsUtilidades';

@Component({
  selector: 'app-cuentabancaria-empresa',
  templateUrl: './cuentabancaria-empresa.component.html',
  styleUrls: ['./cuentabancaria-empresa.component.css']
})
export class CuentabancariaEmpresaComponent {
  formulario !: FormGroup
  selectedEmpresa = 0;

  cuentaBancaria : CuentaBancariaEmpresaDTO = {
    nombreBanco: '',
    id: 0,
    idBanco: 0,
    numeroCuenta: '',
    numeroSucursal: '',
    clabe: '',
    cuentaClabe: '',
    tipoMoneda: 0,
    fechaAlta: new Date,
    idCuentaContable: 0,
    existeCuentaContable: false
  }

  bancos : BancoDTO[] = [];

  errorGlobal: boolean = false;
  errorBanco: boolean = false;
  errorNumCuenta: RespuestaDTO = { estatus: false, descripcion: '' };
  errorNumSucursal: RespuestaDTO = { estatus: false, descripcion: '' };
  errorClabe: RespuestaDTO = { estatus: false, descripcion: '' };
  errorTipoMoneda: boolean = false;

  constructor(
    public dialogRef: MatDialogRef<CuentabancariaEmpresaComponent>,
    @Inject(MAT_DIALOG_DATA) public data : any,
    private formBuilder: FormBuilder,
    private _SeguridadEmpresa: SeguridadService,
    private _BancoService : BancoService,
    private _CuentaBancariaEmpresa : CuentabancariaEmpresaService
  ){
    let idEmpresa = _SeguridadEmpresa.obtenIdEmpresaLocalStorage();
    this.selectedEmpresa = Number(idEmpresa);
  }

  ngOnInit(): void {
    this.dialogRef.updateSize('80%');
    this.formulario = this.formBuilder.group({
      Banco: ['', { validators: [], },],
      NumeroCuenta: ['', { validators: [], },],
      NumeroSucursal: ['', { validators: [], },],
      CuentaClabe: ['', { validators: [], },],
      TipoMoneda: ['', { validators: [], },]
    });
    this._BancoService.ObtenerBancos(this.selectedEmpresa).subscribe((datos)=>{
      this.bancos = datos;
    })
  }

  guardarCuentaBancariaC(){
    this.cuentaBancaria.idBanco = this.formulario.get('Banco')?.value;
    this.cuentaBancaria.numeroCuenta = this.formulario.get('NumeroCuenta')?.value;
    this.cuentaBancaria.numeroSucursal =  this.formulario.get('NumeroSucursal')?.value;
    this.cuentaBancaria.clabe = this.formulario.get('CuentaClabe')?.value;
    this.cuentaBancaria.tipoMoneda = this.formulario.get('TipoMoneda')?.value;

    if(this.cuentaBancaria.idBanco <= 0 && (this.cuentaBancaria.numeroCuenta.trim() == "" || this.cuentaBancaria.numeroCuenta == undefined)
      && (this.cuentaBancaria.numeroSucursal.trim() == "" || this.cuentaBancaria.numeroSucursal == undefined) && (this.cuentaBancaria.clabe.trim() == "" || this.cuentaBancaria.clabe == undefined)
      && (this.cuentaBancaria.tipoMoneda == undefined || this.cuentaBancaria.tipoMoneda <= 0)
    ){
      this.errorGlobal = true;
      // console.log("los datos no son correctos", this.cuentaBancaria);
      return;
    }else{
      let c = true;
      if(this.cuentaBancaria.idBanco <= 0){
        this.errorBanco = true;
        c = false;
      }
      if (this.cuentaBancaria.numeroCuenta.trim().length<10){
        this.errorNumCuenta.estatus = true;
        this.errorNumCuenta.descripcion = "El campo 'Número de cuenta' debe tener 10 caracteres";
        c = false;
      }
      if (this.cuentaBancaria.numeroCuenta.trim() == "" || this.cuentaBancaria.numeroCuenta == undefined){
        this.errorNumCuenta.estatus = true;
        this.errorNumCuenta.descripcion = "El campo 'Número de cuenta' es requerido";
        c = false;
      }
      if (this.cuentaBancaria.numeroSucursal.trim().length<3){
        this.errorNumSucursal.estatus = true;
        this.errorNumSucursal.descripcion = "El campo 'Número de sucursal' debe tener 3 caracteres";
        c = false;
      }
      if (this.cuentaBancaria.numeroSucursal.trim() == "" || this.cuentaBancaria.numeroSucursal == undefined){
        this.errorNumSucursal.estatus = true;
        this.errorNumSucursal.descripcion = "El campo 'Número de sucursal' es requerido";
        c = false;
      }
      if (this.cuentaBancaria.clabe.trim().length<18){
        this.errorClabe.estatus = true;
        this.errorClabe.descripcion = "El campo 'Clabe' debe tener 18 caracteres";
        c = false;
      }
      if (this.cuentaBancaria.clabe.trim() == "" || this.cuentaBancaria.clabe == undefined){
        this.errorClabe.estatus = true;
        this.errorClabe.descripcion = "El campo 'Clabe' es requerido";
        c = false;
      }
      if (this.cuentaBancaria.tipoMoneda == undefined || this.cuentaBancaria.tipoMoneda <= 0){
        this.errorTipoMoneda = true;
        c = false;
      }
      if(!c){
        return;
      }
      this._CuentaBancariaEmpresa.CrearCuentaBancaria(this.selectedEmpresa, this.cuentaBancaria).subscribe((dato) =>{
        if(dato){
          console.log("se creo la cuenta bancaria");
        }else{
          console.log("ocurrio un error");
        }
      });
      console.log("los campos estan llenos ", this.cuentaBancaria)
    }

    this.cerrar();
  }

  cerrar() {
    this.dialogRef.close(false); // Cierra el diálogo y pasa false para indicar que se canceló la operación
  }

  detenerCierre(event: MouseEvent) {
    event.stopPropagation();
  }

}
