import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { CredencialesUsuarioDTO, RolDTO } from '../tsSeguridad';
import { SeguridadService } from '../seguridad.service';
import { MatSelectChange } from '@angular/material/select';
import { Router } from '@angular/router';

@Component({
  selector: 'app-registro-admin',
  templateUrl: './registro-admin.component.html',
  styleUrls: ['./registro-admin.component.css']
})
export class RegistroAdminComponent {
  @Input()
  listaErrores: string[] = [];
  @Input()
  accion!: string;
  @Output()
  onSubmit: EventEmitter<CredencialesUsuarioDTO> = new EventEmitter<CredencialesUsuarioDTO>();
  roleName!: string;
  listaRoles!: RolDTO[];

  constructor(private formBuilder: FormBuilder,
    private seguridadService: SeguridadService,
    private router: Router) { }

  form!: FormGroup;
  registraUsuario: CredencialesUsuarioDTO = {
    email: '',
    password: '',
    role: ''
  }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      email: ['', {validators: [],},]
      , password: ['', {validators: [],},]
      , role: new FormControl()
    });
    this.seguridadService.zfObtenerRolesSinPaginar()
    .subscribe((roles) => {
      this.listaRoles = roles;
    })
  }

  zfObtenerMensajeErrorEmail(){
    var campo = this.form.get('email')!;
    if (campo.hasError('required')) {
      return 'El campo Email es requerido';
    }

    if (campo.hasError('email')) {
      return 'El Email no es válido';
    }

    return '';
  }

  zfCambiaRole(Role: MatSelectChange){
    this.roleName = Role.value;
  }

  zfRegistrar() {
    this.registraUsuario = this.form.value;
    if (typeof this.registraUsuario.email === 'undefined' || !this.registraUsuario.email || this.registraUsuario.email === ""
        || typeof this.registraUsuario.password === 'undefined' || !this.registraUsuario.password || this.registraUsuario.password === ""
        || typeof this.registraUsuario.role === 'undefined' || !this.registraUsuario.role || this.registraUsuario.role === "") {
      return;
    }
    this.seguridadService.crearUsuarioConRol(this.registraUsuario)
    .subscribe(() => {});
    this.form.reset();
  }

  zfLimpiarFormulario(){
    this.form.reset();

  }
}
