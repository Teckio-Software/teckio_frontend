import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { EmpleadoDTO } from '../empleado';
import { EmpleadoServiceService } from '../empleado-service.service';
import { SeguridadService } from '../../seguridad.service';
import { formatDate } from '@angular/common';
import { error, log } from 'node:console';
import { RespuestaDTO } from 'src/app/utilidades/tsUtilidades';

@Component({
  selector: 'app-modal-empleado',
  templateUrl: './modal-empleado.component.html',
  styleUrls: ['./modal-empleado.component.css']
})
export class ModalEmpleadoComponent {
  form!: FormGroup;
  selectedEmpresa : number = 0;
  empleado : EmpleadoDTO = {
    id: 0,
    idUser: 0,
    nombre: '',
    apellidoPaterno: '',
    apellidoMaterno: '',
    curp: '',
    rfc: '',
    seguroSocial: '',
    fechaRelacionLaboral: null,
    fechaTerminoRelacionLaboral: null,
    salarioDiario: 0,
    estatus: false,
    seleccionado: false
  }

  errorGlobal: boolean = false;
  errorNo: boolean = false;
  errorAP: boolean = false;
  errorAM: boolean = false;
  errorCURP: RespuestaDTO = {estatus: false, descripcion: ''};
  errorRFC: RespuestaDTO = {estatus: false, descripcion: ''};
  errorSS: RespuestaDTO = {estatus: false, descripcion: ''};
  errorFRL: boolean = false;
  errorFTRL: boolean = false;
  errorSD: boolean = false;

  constructor(
    public dialogRef: MatDialogRef<ModalEmpleadoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private formBuilder: FormBuilder,
    private _SeguridadService : SeguridadService,
    private _empleadoService : EmpleadoServiceService
  ){
    let IdEmpresa = _SeguridadService.obtenIdEmpresaLocalStorage();
    this.selectedEmpresa = Number(IdEmpresa);
  }

  ngOnInit(): void {
    let fechaRL = this.data.empleado.fechaRelacionLaboral == null ? this.data.empleado.fechaRelacionLaboral : formatDate(this.data.empleado.fechaRelacionLaboral, 'yyyy-MM-dd', 'en_US');
    let fechaTRL = this.data.empleado.fechaTerminoRelacionLaboral == null ? this.data.empleado.fechaTerminoRelacionLaboral : formatDate(this.data.empleado.fechaTerminoRelacionLaboral, 'yyyy-MM-dd', 'en_US');
    
    console.log("esto es lo que esta llegando", this.data);
    this.form = this.formBuilder.group({
      id: [this.data.empleado.id, {validators: [],},],
      idUser: [this.data.empleado.idUser, {validators: [],},],
      nombre: [this.data.empleado.nombre, {validators: [],},],
      apellidoPaterno: [this.data.empleado.apellidoPaterno, {validators: [],},],
      apellidoMaterno: [this.data.empleado.apellidoMaterno, {validators: [],},],
      curp: [this.data.empleado.curp, {validators: [],},],
      rfc: [this.data.empleado.rfc, {validators: [],},], 
      seguroSocial: [this.data.empleado.seguroSocial, {validators: [],},],
      fechaRelacionLaboral: [fechaRL, {validators: [],},],
      fechaTerminoRelacionLaboral: [fechaTRL, {validators: [],},],
      salarioDiario: [this.data.empleado.salarioDiario, {validators: [],},],
      estatus: [this.data.empleado.estatus, {validators: [],},],
    }); 
  }

  validacionCampos(){
    this.empleado = this.form.getRawValue();
    if((this.empleado.nombre == "" || this.empleado.nombre == undefined || this.empleado.nombre == null) &&
      (this.empleado.apellidoPaterno == "" || this.empleado.apellidoPaterno == undefined || this.empleado.apellidoPaterno == null) &&
      (this.empleado.apellidoMaterno == "" || this.empleado.apellidoMaterno == undefined || this.empleado.apellidoMaterno == null) &&
      (this.empleado.curp == "" || this.empleado.curp == undefined || this.empleado.curp == null || this.empleado.curp.length > 18 || this.empleado.curp.length < 18) &&
      (this.empleado.rfc == "" || this.empleado.rfc == undefined || this.empleado.rfc == null || this.empleado.rfc.length > 13) &&
      (this.empleado.seguroSocial == "" || this.empleado.seguroSocial == undefined || this.empleado.seguroSocial == null || this.empleado.seguroSocial.length > 20) &&
      (this.empleado.salarioDiario <= 0 || this.empleado.salarioDiario == undefined)
    ){
      this.errorGlobal = true;
    }else{
      let c = true;
      if(this.empleado.nombre == "" || this.empleado.nombre == undefined || this.empleado.nombre == null){
        this.errorNo = true;
        c = false;
      }
      if(this.empleado.apellidoPaterno == "" || this.empleado.apellidoPaterno == undefined || this.empleado.apellidoPaterno == null){
        this.errorAP = true;
        c = false;
      }
      if(this.empleado.apellidoMaterno == "" || this.empleado.apellidoMaterno == undefined || this.empleado.apellidoMaterno == null){
        this.errorAM = true;
        c = false;
      }
      if(this.empleado.curp == "" || this.empleado.curp == undefined || this.empleado.curp == null){
        this.errorCURP.estatus = true;
        this.errorCURP.descripcion = "El campo 'CURP' es requerido"
        c = false;
      }else{
        if(this.empleado.curp.length > 18 || this.empleado.curp.length < 18){
        this.errorCURP.estatus = true;
        this.errorCURP.descripcion = "El campo 'CURP' debe tener 18 caracteres";
        c = false;
      }
      }
      if(this.empleado.rfc == "" || this.empleado.rfc == undefined || this.empleado.rfc == null){
        this.errorRFC.estatus = true;
        this.errorRFC.descripcion = "El campo 'RFC' es requerido";
        c = false;
      }else{
        if(this.empleado.rfc.length > 13){
        this.errorRFC.estatus = true;
        this.errorRFC.descripcion = "El campo 'RFC' debe tener 13 caracteres";
        c = false;
      }
      }
      if(this.empleado.seguroSocial == "" || this.empleado.seguroSocial == undefined || this.empleado.seguroSocial == null){
        this.errorSS.estatus = true;
        this.errorSS.descripcion = "El campo 'Seguro Social' es requerido"; 
        c = false;
      }else{
        if(this.empleado.seguroSocial.length > 20){
        this.errorSS.estatus = true;
        this.errorSS.descripcion = "El campo 'Seguro Social' debe tener 20 caracteres"; 
        c = false;
      }
      }
      if(this.empleado.fechaRelacionLaboral == undefined || this.empleado.fechaRelacionLaboral == null){
        this.errorFRL = true;
        c = false;
      }
      if(this.empleado.fechaTerminoRelacionLaboral == undefined || this.empleado.fechaTerminoRelacionLaboral == null){
        this.errorFTRL = true;
        c = false;
      }
      if(this.empleado.salarioDiario <= 0 || this.empleado.salarioDiario == undefined){
        this.errorSD = true;
        c = false;
      }
      if(!c){
        return;
      }
      this.guardar();
    }
  }
  
  guardar(){
    if(this.empleado.id == 0){
      this._empleadoService.CrearEmpleado(this.data.IdEmpresa, this.empleado).subscribe((datos) => {
        console.log(datos);
        this.dialogRef.close(true);
      });
    }else{
      this._empleadoService.EditarEmpleado(this.data.IdEmpresa, this.empleado).subscribe((datos) => {
        console.log(datos);
        this.dialogRef.close(true);
      });
    }
  }

  limpiarErrores(){
    this.errorGlobal = false;
    this.errorNo = false;
    this.errorAP = false;
    this.errorAM = false;
    this.errorCURP.estatus = false;
    this.errorRFC.estatus = false;
    this.errorSS.estatus = false;
    this.errorFRL = false;
    this.errorFTRL = false;
    this.errorSD = false;
  }

  cerrar(){
    this.limpiarErrores();
    this.dialogRef.close(true);
  }

  detenerCierre(event: MouseEvent) {
    event.stopPropagation();
  }
}
