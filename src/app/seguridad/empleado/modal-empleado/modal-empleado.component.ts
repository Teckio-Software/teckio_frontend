import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { EmpleadoDTO } from '../empleado';
import { EmpleadoServiceService } from '../empleado-service.service';
import { SeguridadService } from '../../seguridad.service';
import { formatDate } from '@angular/common';

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
    if(this.empleado.nombre == "" || this.empleado.nombre == undefined || this.empleado.nombre == null ||
      this.empleado.apellidoPaterno == "" || this.empleado.apellidoPaterno == undefined || this.empleado.apellidoPaterno == null ||
      this.empleado.apellidoMaterno == "" || this.empleado.apellidoMaterno == undefined || this.empleado.apellidoMaterno == null ||
      this.empleado.curp == "" || this.empleado.curp == undefined || this.empleado.curp == null || this.empleado.curp.length > 18 ||
      this.empleado.rfc == "" || this.empleado.rfc == undefined || this.empleado.rfc == null || this.empleado.rfc.length > 13 ||
      this.empleado.seguroSocial == "" || this.empleado.seguroSocial == undefined || this.empleado.seguroSocial == null || this.empleado.seguroSocial.length > 20 ||
      this.empleado.salarioDiario <= 0 || this.empleado.salarioDiario == undefined
    ){
      console.log("Error llene los campos correctamente");
    }else{
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

  cerrar(){
    this.dialogRef.close(true);
  }

  detenerCierre(event: MouseEvent) {
    event.stopPropagation();
  }
}
