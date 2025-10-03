import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { EmpresaDTO } from 'src/app/catalogos/empresas/empresa';
import { EmpresaService } from '../../empresa.service';
import { RespuestaDTO } from 'src/app/utilidades/tsUtilidades';
import { log } from 'console';
@Component({
  selector: 'app-edit-companies',
  templateUrl: './edit-companies.component.html',
  styleUrls: ['./edit-companies.component.css']
})
export class EditCompaniesComponent {
  tituloAccion: string = 'Agregar';
  botonAccion: string = 'Guardar';
  accion!:string;
  formulario: FormGroup;

  errorRFC: RespuestaDTO = {estatus: false, descripcion: ''};

  constructor(
    private modalActual: MatDialogRef<EditCompaniesComponent>,
    @Inject(MAT_DIALOG_DATA) public datos: EmpresaDTO,
    private fb: FormBuilder,
    private _empresaServicio: EmpresaService,
  ) {
    if (this.datos != null && this.datos.id > 0) {
      this.tituloAccion = 'Editar empresa';
      this.botonAccion = 'Actualizar';
      this.formulario = this.fb.group({
        razonSocial: ['', Validators.required],
        rfc: ['', Validators.required],
        sociedad: ['', Validators.required],
        estatus: ['1', Validators.required]
      });
      this.formulario.get('razonSocial')?.setValue(datos.nombreComercial);
      this.formulario.get('rfc')?.setValue(datos.rfc);
      this.formulario.get('sociedad')?.setValue(datos.sociedad);
      this.formulario.get('estatus')?.setValue(datos.estatus ? '1' : '0');
    }
    else{
      this.tituloAccion = 'Nueva empresa';
      this.botonAccion = 'Crear';
      this.formulario = this.fb.group({
        razonSocial: ['', Validators.required],
        rfc: ['', Validators.required],
        sociedad: ['', Validators.required],
        estatus: ['1', Validators.required]
      });
    }
  }

  ngOnInit(): void {
  }

  _empresa: EmpresaDTO = {
    id: 0,
    nombreComercial: '',
    rfc: '',
    estatus: true,
    idCorporativo: 0,
    sociedad: '',
    fechaRegistro: new Date(),
    guidEmpresa: '',
    codigoPostal: ''
  }


  guardarEmpresa(){
    this.errorRFC.estatus = false;
    this._empresa = {
      id: this.datos.id,
      nombreComercial: this.formulario.get('razonSocial')?.value,
      // nombreComercial: this.formulario.get('razonSocial')?.value,
      rfc: this.formulario.get('rfc')?.value,
      estatus: this.formulario.get('estatus')?.value == '1' ? true : false,
      idCorporativo: this.datos.idCorporativo,
      sociedad: this.formulario.get('sociedad')?.value,
      fechaRegistro: new Date,
      guidEmpresa: '',
      codigoPostal: ''
    };
    let c = true;
    if(this._empresa.rfc.length<12){
      this.errorRFC.estatus = true;
      this.errorRFC.descripcion = 'El RFC debe tener 12 o 13 caracteres';
      c = false;
    }
    if(this._empresa.rfc.includes(' ')){
      this.errorRFC.estatus = true;
      this.errorRFC.descripcion = 'El RFC no debe tener espacios';
      c = false;
    }
    if(!c){
      console.log('No se van a guardar');
      return;
    }
    console.log(this._empresa);
    if (this.datos != null && this.datos.id > 0) {
      this._empresaServicio.editar(this._empresa).subscribe(() => {
        this.cerrarDialog();
      });
    }
    else{
      this._empresaServicio.guardar(this._empresa).subscribe(() => {
        this.cerrarDialog();
      });
    }
  }
  cerrarDialog() {
    this.modalActual.close(false); // Cierra el modal sin guardar
  }

  detenerCierre(event: MouseEvent) {
    event.stopPropagation();
  }
}
