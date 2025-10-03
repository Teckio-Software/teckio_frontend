import { Component, Inject } from '@angular/core';
import { MatSelectChange } from '@angular/material/select';
import { EmpresaDTO } from 'src/app/catalogos/empresas/empresa';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CorporativoService } from 'src/app/catalogos/corporativo/corporativo.service';
import { EmpresaService } from 'src/app/catalogos/empresas/empresa.service';
import { UtilidadesService } from 'src/app/utilidades/utilidades.service';
import { RolService } from '../../Servicios/rol.service';
import { UsuarioCorporativoService } from '../../Servicios/usuario-corporativo.service';
import { UsuarioEmpresaService } from '../../Servicios/usuario-empresa.service';
import { UsuarioService } from '../../Servicios/usuario.service';
import { SeguridadMultiEmpresaService } from '../../seguridad-multi-empresa/seguridad-multi-empresa.service';
import { RolDTO } from '../../tsSeguridad';
import {
  corporativo,
  rolesPorEmpresa,
  empresaConRoles,
} from '../../usuario-multi-empresa/tsUsuarioMultiEmpresa';
import { usuarioCreacionDTO2 } from '../../modelos/tsUsuarioEmpresa';
import Swal from 'sweetalert2';
import { UsuarioEstructuraCorporativoDTO } from '../../seguridad-multi-empresa/tsSeguridadMultiEmpresa';

@Component({
  selector: 'app-modal-usuario-base',
  templateUrl: './modal-usuario-base.component.html',
  styleUrls: ['./modal-usuario-base.component.css'],
})
export class ModalUsuarioBaseComponent {
  tituloAccion: string = '';
  botonAccion: string = '';
  estatus: string = '';
  mensaje: string = '';
  descripcionEmpresa: string = '';
  empresas: EmpresaDTO[] = [];
  listaIdEmpresas: number[] = [];
  listaRoles: number[] = [];
  idRol: number = 0;
  listaIdsEmpresas: number[] = [];
  roles: RolDTO[] = [];
  corporativos: corporativo[] = [];
  listaRolesEnEmpresa: rolesPorEmpresa[] = [];
  listaEmpresasConRoles: empresaConRoles[] = [];
  seccionesFalse: boolean = false;
  formulario: FormGroup;
  usuarioBase: usuarioCreacionDTO2 = {
    nombreCompleto: '',
    aPaterno: '',
    aMaterno: '',
    nombreUsuario: '',
    correo: '',
    password: '',
  };
  constructor(
    @Inject(MAT_DIALOG_DATA) public datos: UsuarioEstructuraCorporativoDTO,
    private fb: FormBuilder,
    private seguridadService: SeguridadMultiEmpresaService,
    private rolService: RolService,
    private usuarioService: UsuarioService,
    private utilidadServicio: UtilidadesService,
    private empresaService: EmpresaService,
    private corporativoService: CorporativoService,
    private usuarioEmpresaService: UsuarioEmpresaService,
    private usuarioCorporativoService: UsuarioCorporativoService,
    public dialogRef: MatDialogRef<ModalUsuarioBaseComponent>
  ) {
    if (this.datos != null) {
      this.tituloAccion = 'Editar usuario';
      this.botonAccion = 'Actualizar';
      this.formulario = this.fb.group({
        nombre: ['', Validators.required],
        apaterno: ['', Validators.required],
        amaterno: ['', Validators.required],
        usuario: ['', Validators.required],
        correoElectronico: ['', Validators.required],
      });
      this.formulario.get('nombre')?.setValue(datos.nombreCompleto);
      this.formulario.get('apaterno')?.setValue(datos.apaterno);
      this.formulario.get('amaterno')?.setValue(datos.amaterno);
      this.formulario.get('usuario')?.setValue(datos.nombreUsuario);
      this.formulario.get('correoElectronico')?.setValue(datos.correo);
    } else {
      this.tituloAccion = 'Nuevo usuario';
      this.botonAccion = 'Crear';
      this.formulario = this.fb.group({
        nombre: ['', Validators.required],
        apaterno: ['', Validators.required],
        amaterno: ['', Validators.required],
        usuario: ['', Validators.required],
        correoElectronico: ['', Validators.required],
        contrasenia: ['', Validators.required],
        confirmaContrasenia: ['', Validators.required],
      });
    }
  }
  ngOnInit(): void {}

  cancelar() {
    this.dialogRef.close(false);
  }

  guardarEditar() {
    if (this.datos != null) {
      this.editarUsuarioProveedor();
    } else {
      this.guardarNuevo();
    }
  }

  guardarNuevo() {
    let contrasenia = this.formulario.get('contrasenia')?.value;
    let confirmaContrasenia = this.formulario.get('confirmaContrasenia')?.value;
    let nombre = this.formulario.get('nombre')?.value;
    let aPaterno = this.formulario.get('apaterno')?.value;
    let aMaterno = this.formulario.get('amaterno')?.value;
    let usuario = this.formulario.get('usuario')?.value;
    let correo = this.formulario.get('correoElectronico')?.value;
    if (
      typeof contrasenia === 'undefined' ||
      !contrasenia ||
      contrasenia === '' ||
      typeof nombre === 'undefined' ||
      !nombre ||
      nombre === '' ||
      typeof confirmaContrasenia === 'undefined' ||
      !confirmaContrasenia ||
      confirmaContrasenia === '' ||
      typeof usuario === 'undefined' ||
      !usuario ||
      usuario === '' ||
      typeof correo === 'undefined' ||
      !correo ||
      correo === '' ||
      typeof aPaterno === 'undefined' ||
      !aPaterno ||
      aPaterno === '' ||
      typeof aMaterno === 'undefined' ||
      !aMaterno ||
      aMaterno === ''
    ) {
      Swal.fire({
        title: 'Error',
        text: 'Capture todos los campos',
        icon: 'warning',
      });
      return;
    }
    const regexTest = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if(!regexTest.test(correo)){
      Swal.fire({
        title: 'Error',
        text: 'El correo no es válido',
        icon: 'warning',
      });
      return;
    }

    let esCorreoValido = this.utilidadServicio.esEmailValido(correo);
    if (!esCorreoValido) {
      Swal.fire({
        title: 'Error',
        text: 'Debe tener un correo válido',
        icon: 'warning',
      });
      return;
    }
    var regex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])([A-Za-z\d$@$!%*?&]|[^ ]){8,15}$/;
    if (!regex.test(contrasenia)) {
      Swal.fire({
        title: 'Contraseña inválida',
        text: 'La contraseña debe contener mayúsculas, minúsculas, números, carácteres especiales y un mínimo de 8 carácteres.',
        icon: 'warning',
      });
      return;
    }
    if (!regex.test(confirmaContrasenia)) {
      Swal.fire({
        title: 'Contraseña inválida',
        text: 'La contraseña debe contener mayúsculas, minúsculas, números, carácteres especiales y un mínimo de 8 carácteres.',
        icon: 'warning',
      });
      return;
    }
    if (contrasenia !== confirmaContrasenia) {
      Swal.fire({
        title: 'Error',
        text: 'Las contraseñas deben de ser iguales',
        icon: 'warning',
      });
      return;
    }
    this.usuarioService
      .creaUsuarioBase({
        nombreCompleto: this.formulario.get('nombre')?.value,
        aPaterno: this.formulario.get('apaterno')?.value,
        aMaterno: this.formulario.get('amaterno')?.value,
        nombreUsuario: this.formulario.get('usuario')?.value,
        correo: this.formulario.get('correoElectronico')?.value,
        password: this.formulario.get('contrasenia')?.value,
      })
      .subscribe((resp) => {
        if (resp.estatus) {
          Swal.fire({
            title: 'Correcto',
            text: resp.descripcion,
            icon: 'success',
          });
        }
        this.dialogRef.close();
      });
  }

  editarUsuarioProveedor() {
    let nombre = this.formulario.get('nombre')?.value;
    let aPaterno = this.formulario.get('apaterno')?.value;
    let aMaterno = this.formulario.get('amaterno')?.value;
    let usuario = this.formulario.get('usuario')?.value;
    let correo = this.formulario.get('correoElectronico')?.value;
    if (
      typeof nombre === 'undefined' ||
      !nombre ||
      nombre === '' ||
      typeof usuario === 'undefined' ||
      !usuario ||
      usuario === '' ||
      typeof correo === 'undefined' ||
      !correo ||
      correo === '' ||
      typeof aPaterno === 'undefined' ||
      !aPaterno ||
      aPaterno === '' ||
      typeof aMaterno === 'undefined' ||
      !aMaterno ||
      aMaterno === ''
    ) {
      Swal.fire({
        title: 'Error',
        text: 'Capture todos los campos',
        icon: 'warning',
      });
      return;
    }
    let esCorreoValido = this.utilidadServicio.esEmailValido(correo);
    if (!esCorreoValido) {
      Swal.fire({
        title: 'Error',
        text: 'Debe tener un correo válido',
        icon: 'warning',
      });
      return;
    }
    this.usuarioService
      .guardarInfoUsuario({
        nombreCompleto: this.formulario.get('nombre')?.value,
        apaterno: this.formulario.get('apaterno')?.value,
        amaterno: this.formulario.get('amaterno')?.value,
        nombreUsuario: this.formulario.get('usuario')?.value,
        correo: this.formulario.get('correoElectronico')?.value,
        id: this.datos.idUsuario,
        idAspNetUser: this.datos.idAspNetUser,
        activo: this.datos.activo,
      })
      .subscribe((info) => {
        if (info.estatus) {
          Swal.fire({
            title: 'Correcto',
            text: info.descripcion,
            icon: 'success',
          });
          this.dialogRef.close();

        } else {
          Swal.fire({
            title: 'Error',
            text: info.descripcion,
            icon: 'error',
          });
        }
      });
  }
  cargarRegistrosCorporativos() {
    this.usuarioCorporativoService
      .obtenCorporativosPertenecientes()
      .subscribe((datos) => {
        this.corporativos = datos;
      });
  }
  cargarRegistrosEmpresas(idCorporativo: number) {
    this.empresaService
      .ObtenXIdCorporativo(idCorporativo)
      .subscribe((datos) => {
        this.empresas = datos;
      });
  }
  cambiaCorporativo(registro: MatSelectChange) {
    this.cargarRegistrosEmpresas(registro.value);
  }
  agregarRolDeEmpresa(event: MatSelectChange) {
    this.listaRoles = [];
    this.listaRoles.push(event.value);
    this.idRol = event.value;
  }
  agregaEmpresa(event: EmpresaDTO) {}
}
