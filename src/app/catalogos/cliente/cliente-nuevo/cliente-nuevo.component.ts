import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CuentabancariaEmpresaComponent } from 'src/app/bancos/cuentabancaria/cuentabancaria-empresa/cuentabancaria-empresa/cuentabancaria-empresa.component';
import { ClienteService } from '../cliente.service';
import { clienteDTO } from '../tsCliente';

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

    if(this.cliente.razonSocial == "" || this.cliente.rfc == "" || this.cliente.email == "" || this.cliente.telefono == "" || this.cliente.representanteLegal == "" || this.cliente.domicilio == "" 
      || this.cliente.noExterior == "" || this.cliente.colonia == "" || this.cliente.municipio == "" || this.cliente.codigoPostal == "" 
    ){
    }else{
      if(this.cliente.rfc.length > 13){
        console.log("la longitud del RFC no es correcta");
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

  cerrar() {
    this.dialogRef.close(false); // Cierra el diálogo y pasa false para indicar que se canceló la operación
  }

  detenerCierre(event: MouseEvent) {
    event.stopPropagation();
  }

}
