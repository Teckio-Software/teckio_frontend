import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { RolService } from '../../Servicios/rol.service';
import { UtilidadesService } from 'src/app/utilidades/utilidades.service';
import { CorporativoService } from 'src/app/catalogos/corporativo/corporativo.service';
import { SeguridadMultiEmpresaService } from '../../seguridad-multi-empresa/seguridad-multi-empresa.service';
import { RolDTO } from '../../tsSeguridad';
import { MatSelectChange } from '@angular/material/select';
import { UsuarioCorporativoService } from '../../Servicios/usuario-corporativo.service';
import { corporativo } from '../tsUsuarioMultiEmpresa';
import Swal from 'sweetalert2';
import { usuarioCorporativoDTO } from '../../seguridad-multi-empresa/tsSeguridadMultiEmpresa';

@Component({
  selector: 'app-modal-usuario-corporativo',
  templateUrl: './modal-usuario-corporativo.component.html',
  styleUrls: ['./modal-usuario-corporativo.component.css']
})
export class ModalUsuarioCorporativoComponent implements OnInit {
  form!:FormGroup;
  // formulario: FormGroup;
  esActualiza: boolean = false;
  roles: RolDTO[] = [];
  idRol: number = 0;
  corporativos: corporativo[] = [];
  selectedCorporativo: number = 0;
  selectedCorporativoid: number;
  password: string = "";
  confirmaPassword: string = "";

  constructor(
    private modalActual: MatDialogRef<ModalUsuarioCorporativoComponent>
    , private fb: FormBuilder
    , private usuarioCorporativoService: UsuarioCorporativoService
    , @Inject(MAT_DIALOG_DATA) public data: usuarioCorporativoDTO
  ) {
    this.selectedCorporativoid = this.data.idCorporativo;
    if (this.data != null) {
      this.esActualiza = true;
      this.form = this.fb.group({
        nombre: ['', Validators.required],
        apaterno: ['', Validators.required],
        amaterno: ['', Validators.required],
        usuario: ['', Validators.required],
        correoElectronico: ['', Validators.required],
        numeroProveedor: [''],
        identificadorFiscal: ['']
      });
    }
    else{
      this.form = this.fb.group({
        nombre: ['', Validators.required],
        apaterno: ['', Validators.required],
        amaterno: ['', Validators.required],
        usuario: ['', Validators.required],
        correoElectronico: ['', Validators.required],
        numeroProveedor: [''],
        identificadorFiscal: [''],
        contrasenia: ['', Validators.required],
        confirmaContrasenia: ['', Validators.required]
      });
    }
  }
  ngOnInit(): void {
    console.log(this.form.get('nombre')?.value);
    // this.cargarRegistrosCorporativos();
  }
  guardarEditar() {
    // Verificar si las contraseñas coinciden
    const contrasenia = this.form.get('contrasenia')?.value;
    const confirmaContrasenia = this.form.get('confirmaContrasenia')?.value;

    if (contrasenia !== confirmaContrasenia) {
      // Mostrar un mensaje de error o manejar la situación de contraseñas no coincidentes
      Swal.fire({
        title: "Error",
        text: "Las contraseñas no coinciden",
        icon: "error"
      });
      return; // Detener el proceso si las contraseñas no coinciden
    }

    //Validaciones de datos
    if((this.form.get('nombre')?.value == '') &&
      (this.form.get('apaterno')?.value == '') &&
      (this.form.get('amaterno')?.value == '') &&
      (this.form.get('usuario')?.value == '') &&
      (this.form.get('correoElectronico')?.value == '')){
      this.AlertaCampo('Capture todos los campos');
      return;
    }

    if(this.form.get('nombre')?.value == ''){
      this.AlertaCampo('El campo \'Nombre\' es requerido');
      return;}
    if(this.form.get('apaterno')?.value == ''){
      this.AlertaCampo('El campo \'Apellido Paterno\' es requerido');
      return;}
    if(this.form.get('amaterno')?.value == ''){
      this.AlertaCampo('El campo \'Apellido Materno\' es requerido');
      return;}
      if(this.form.get('correoElectronico')?.value == ''){
      this.AlertaCampo('El campo \'Correo electrónico\' es requerido');
      return;}
    if(this.form.get('usuario')?.value == ''){
      this.AlertaCampo('El campo \'Nombre de usuario\' es requerido');
      return;}
    //////////////////////

    // Si las contraseñas coinciden, continuar con el guardado del usuario
    this.usuarioCorporativoService.creaUsuarioCorporativo({
      nombreCompleto: this.form.get('nombre')?.value,
      apaterno: this.form.get('apaterno')?.value,
      amaterno: this.form.get('amaterno')?.value,
      nombreUsuario: this.form.get('usuario')?.value,
      correo: this.form.get('correoElectronico')?.value,
      password: contrasenia, // Usar la contraseña verificada
      idCorporativo: this.selectedCorporativoid
    })
    .subscribe(() => {
      this.modalActual.close(true); // Cierra el modal y guarda
    });
  }

  /**
   * Muestra un mensaje de advertencia en una ventana emergente.
   * @param {string} message - El mensaje a mostrar en la ventana emergente.
   */
  AlertaCampo(message: string) {
      Swal.fire({
        title: "Warning",
        text: message,
        icon: "warning"
      });
    }

  cerrarDialog() {
    this.modalActual.close(false); // Cierra el modal sin guardar
  }

  detenerCierre(event: MouseEvent) {
    event.stopPropagation();
  }
}
