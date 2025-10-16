import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { SeguridadService } from '../seguridad.service';
import { Router } from '@angular/router';
import { CredencialesUsuarioDTO } from '../tsSeguridad';
import { UsuarioEmpresaService } from '../Servicios/usuario-empresa.service';
import { SeguridadMultiEmpresaService } from '../seguridad-multi-empresa/seguridad-multi-empresa.service';
import { EmpresaDTO } from 'src/app/catalogos/empresas/empresa';
import Swal from 'sweetalert2';
import { AuthEventService } from 'src/app/utilidades/event-auth-service/auth-event.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  recargar: number = 0;
  recargar1: number = 0;
  empresasPertenecientes: EmpresaDTO[] = [];
  @Output() newItemEvent = new EventEmitter<EmpresaDTO[]>();

  mensajeUsuario: string = '';
  mensajeContrasena: string = '';
  isLoading: boolean = false;
  botonMensaje: string = 'Entrar';

  constructor(
    private seguridadService: SeguridadService,
    private seguridadMultiEmpresa: SeguridadMultiEmpresaService,
    private router: Router,
    public _UsuarioEmpresaService: SeguridadMultiEmpresaService,
    public _UsuarioEmpresa: UsuarioEmpresaService,
    private authEventService: AuthEventService
  ) {}

  zfLogin(zCredenciales: CredencialesUsuarioDTO) {
    this.isLoading = true;
    this.botonMensaje = 'Entrando...';
    this.seguridadMultiEmpresa.zfLogin(zCredenciales).subscribe({
      next: (zRespuesta) => {
        if (zRespuesta.token == 'El usuario ingresado es incorrecto.') {
          this.mensajeUsuario = 'El usuario ingresado es incorrecto.';
          this.mensajeContrasena = '';
          this.isLoading = false;
          this.botonMensaje = 'Entrar';

          return;
        }
        if (zRespuesta.token == 'La contraseña ingresada es incorrecta.') {
          this.mensajeContrasena = 'La contraseña ingresada es incorrecta.';
          this.mensajeUsuario = '';
          this.isLoading = false;
          this.botonMensaje = 'Entrar';

          return;
        }
        if (zRespuesta.token == 'UsuarioNoActivo') {
          Swal.fire({
            imageUrl: 'assets/warning.svg',
            html: `
            <div>
            <p style="margin : 0px;">Usuario inactivo favor de contactar a su administrador del portal.</p>
            </div>
            `,
            imageWidth: 50,
            customClass: {
              icon: 'no-border',
              confirmButton: 'SweetAlert2ConfirmButtonWarning',
            },
          });
          this.isLoading = false;
          this.botonMensaje = 'Entrar';
          return;
        }
        if (zRespuesta.token != 'NoToken') {
          this.recargar = this.recargar + 1;
          this.seguridadMultiEmpresa.zfGuardarToken(zRespuesta);
          this.seguridadMultiEmpresa
            .respuestaFront(zCredenciales)
            .subscribe(() => {});
            this.authEventService.notifyLoginSuccess();
          this.router.navigate(['/']);
        }
      },

      error: (zError) => {
        this.isLoading = false;
        this.botonMensaje = 'Entrar';

        console.error(zError);
      },
    });
  }
}
