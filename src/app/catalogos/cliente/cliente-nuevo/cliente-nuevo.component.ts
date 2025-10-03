import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CuentabancariaEmpresaComponent } from 'src/app/bancos/cuentabancaria/cuentabancaria-empresa/cuentabancaria-empresa/cuentabancaria-empresa.component';
import { ClienteService } from '../cliente.service';
import { clienteDTO } from '../tsCliente';
import { RespuestaDTO } from 'src/app/utilidades/tsUtilidades';

@Component({
  selector: 'app-cliente-nuevo',
  templateUrl: './cliente-nuevo.component.html',
  styleUrls: ['./cliente-nuevo.component.css']
})
export class ClienteNuevoComponent {

  formulario !: FormGroup
  cliente : clienteDTO = {
    id: 0,
    razonSocial: '',
    rfc: '',
    email: '',
    telefono: '',
    representanteLegal: '',
    noExterior: '',
    colonia: '',
    municipio: '',
    codigoPostal: '',
    idCuentaContable: 0,
    idIvaTrasladado: 0,
    idIvaPorTasladar: 0,
    idCuentaAnticipos: 0,
    idIvaExento: 0,
    idRetensionIsr: 0,
    idIeps: 0,
    idIvaRetenido: 0,
    domicilio: '',
    idIvaGravable: 0,
    direccion: ''
  }

  errorGlobal: boolean = false;
  errorRS: boolean = false;
  errorRFC: RespuestaDTO = {estatus: false, descripcion: ''};
  errorCE: RespuestaDTO = {estatus: false, descripcion: ''};
  errorTel: RespuestaDTO = {estatus: false, descripcion: ''};
  errorRL: boolean = false;
  errorDm: boolean = false;
  errorCol: boolean = false;
  errorMun: boolean = false;
  errorNE: boolean = false;
  errorCP: boolean = false;

  constructor(
    public dialogRef: MatDialogRef<CuentabancariaEmpresaComponent>, 
    @Inject(MAT_DIALOG_DATA) public data : any,
    private formBuilder: FormBuilder,
    private _clienteService : ClienteService
  ){

  }

  ngOnInit(){
    this.dialogRef.updateSize('80%'); 
    this.formulario = this.formBuilder.group({
      razonsocial: ['', { validators: [], },],
      rfc: ['', { validators: [], },],
      email: ['', { validators: [], },],
      telefono: ['', { validators: [], },],
      representante: ['', { validators: [], },],
      domicilio: ['', { validators: [], },],
      colonia: ['', { validators: [], },],
      municipio: ['', { validators: [], },],
      numeroE: ['', { validators: [], },],
      codigoPostal: ['', { validators: [], },],
    });
  }

  guardarCliente(){
    this.cliente.razonSocial = this.formulario.get("razonsocial")?.value;
    this.cliente.rfc = this.formulario.get("rfc")?.value;
    this.cliente.email = this.formulario.get("email")?.value;
    this.cliente.telefono = this.formulario.get("telefono")?.value;
    this.cliente.representanteLegal = this.formulario.get("representante")?.value;
    this.cliente.domicilio = this.formulario.get("domicilio")?.value;
    this.cliente.noExterior = this.formulario.get("numeroE")?.value;
    this.cliente.colonia = this.formulario.get("colonia")?.value;
    this.cliente.municipio = this.formulario.get("municipio")?.value;
    this.cliente.codigoPostal = this.formulario.get("codigoPostal")?.value;

    if(this.cliente.razonSocial.trim() == "" && this.cliente.rfc.trim() == "" && this.cliente.email.trim() == "" && this.cliente.telefono.trim() == "" && this.cliente.representanteLegal.trim() == "" && this.cliente.domicilio.trim() == "" 
      && this.cliente.noExterior.trim() == "" && this.cliente.colonia.trim() == "" && this.cliente.municipio.trim() == "" && this.cliente.codigoPostal.trim() == "" 
    ){
      this.errorGlobal = true;
      return;
    }else{
      
      let c = true
      if(this.cliente.razonSocial.trim() == ''){
        this.errorRS = true;
        c = false;
      }
      if(this.cliente.rfc.length < 12){
        this.errorRFC.estatus = true;
        this.errorRFC.descripcion = "La longitud del RFC no es correcta";
        c = false;
      }
      if(this.cliente.rfc.trim() == ''){
        this.errorRFC.estatus = true;
        this.errorRFC.descripcion = "El campo 'RFC' es requerido";
        c = false;
      }
      const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!regex.test(this.cliente.email)) {
      this.errorCE.estatus = true;
      this.errorCE.descripcion = "El campo Correo electrónico no es válido";
      c = false;
    }
      if(this.cliente.email.trim() == ''){
        this.errorCE.estatus = true;
        this.errorCE.descripcion = "El campo 'Correo electrónico' es requerido";
        c = false;
      }
      if(this.cliente.telefono.length < 10){
        this.errorTel.estatus = true;
        this.errorTel.descripcion = "El campo 'Teléfono' debe tener 10 caracteres";
        c = false;
      }
      if(this.cliente.telefono.trim() == ''){
        this.errorTel.estatus = true;
        this.errorTel.descripcion = "El campo 'Teléfono' es requerido";
        c = false;
      }
      if(this.cliente.representanteLegal.trim() == ''){
        this.errorRL = true;
        c = false;
      }
      if(this.cliente.domicilio.trim() == ''){
        this.errorDm = true;
        c = false;
      }
      if(this.cliente.noExterior.trim() == ''){
        this.errorNE = true;
        c = false;
      }
      if(this.cliente.colonia.trim() == ''){
        this.errorCol = true;
        c = false;
      }
      if(this.cliente.municipio.trim() == ''){
        this.errorMun = true;
        c = false;
      }
      if(this.cliente.codigoPostal.trim() == ''){
        this.errorCP = true;
        c = false;
      }
      if(!c){
        return;
      }
      console.log(this.cliente);
      this._clienteService.crear(this.data.idEmpresa, this.cliente).subscribe((datos) => {
        if(datos.estatus){
          this.cerrar();
        }else{
          console.log(datos.descripcion);
        }
      });
    }
  }

  limpiarErrores(){
    this.errorGlobal = false;
    this.errorRS = false;
    this.errorRFC.estatus = false;
    this.errorRFC.descripcion = "";
    this.errorCE.estatus = false;
    this.errorCE.descripcion = "";
    this.errorTel.estatus = false;
    this.errorTel.descripcion = "";
    this.errorRL = false;
    this.errorDm = false;
    this.errorCol = false;
    this.errorMun = false;
    this.errorNE = false;
    this.errorCP = false;
  }

  cerrar() {
    this.limpiarErrores();
    this.dialogRef.close(false); // Cierra el diálogo y pasa false para indicar que se canceló la operación
  }

  detenerCierre(event: MouseEvent) {
    event.stopPropagation();
  }

}
