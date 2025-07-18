import { Component, Inject, NgModule } from '@angular/core';
import { FormBuilder, FormGroup, FormControl} from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ContratistaService } from 'src/app/catalogos/contratista/contratista.service';
import { contratistaDTO } from 'src/app/catalogos/contratista/tsContratista';
import { SeguridadService } from 'src/app/seguridad/seguridad.service';
import { CuentaBancariaContratistaDTO } from '../../cuentabancaria';
import { BancoService } from 'src/app/bancos/banco/banco.service';
import { BancoDTO } from 'src/app/bancos/banco/tsBanco';
import { CuentabancariaContratistaService } from '../cuentabancaria-contratista.service';

@Component({
  selector: 'app-cuentabancaria-contratista',
  templateUrl: './cuentabancaria-contratista.component.html',
  styleUrls: ['./cuentabancaria-contratista.component.css']
})


export class CuentabancariaContratistaComponent {

  formulario !: FormGroup
  selectedEmpresa = 0;

  cuentaBancaria : CuentaBancariaContratistaDTO = {
    idContratista: 0,
    nombreBanco: '',
    id: 0,
    idBanco: 0,
    numeroCuenta: '',
    numeroSucursal: '',
    clabe: '',
    cuentaClabe: '',
    tipoMoneda: 0,
    fechaAlta: new Date,
    existeCuentaContable: false
  }

  bancos : BancoDTO[] = [];

  constructor(
    public dialogRef: MatDialogRef<CuentabancariaContratistaComponent>, 
    @Inject(MAT_DIALOG_DATA) public data : any,
    private formBuilder: FormBuilder,
    private _SeguridadEmpresa: SeguridadService,
    private _BancoService : BancoService, 
    private _CuentaBancaria : CuentabancariaContratistaService
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
    this.cuentaBancaria.idContratista = this.data.idContratista;
    this.cuentaBancaria.idBanco = this.formulario.get('Banco')?.value;
    this.cuentaBancaria.numeroCuenta = this.formulario.get('NumeroCuenta')?.value;
    this.cuentaBancaria.numeroSucursal =  this.formulario.get('NumeroSucursal')?.value;
    this.cuentaBancaria.clabe = this.formulario.get('CuentaClabe')?.value;
    this.cuentaBancaria.tipoMoneda = this.formulario.get('TipoMoneda')?.value;

    if(this.cuentaBancaria.idBanco <= 0 || this.cuentaBancaria.idContratista <= 0 || this.cuentaBancaria.numeroCuenta == "" || this.cuentaBancaria.numeroCuenta == undefined
      || this.cuentaBancaria.numeroSucursal == "" || this.cuentaBancaria.numeroSucursal == undefined || this.cuentaBancaria.clabe == "" || this.cuentaBancaria.clabe == undefined
      || this.cuentaBancaria.tipoMoneda == undefined || this.cuentaBancaria.tipoMoneda <= 0
    ){
      console.log("los datos no son correctos", this.cuentaBancaria);
      return;
    }else{
      this._CuentaBancaria.CrearCuentaBancaria(this.selectedEmpresa, this.cuentaBancaria).subscribe((dato) =>{
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
