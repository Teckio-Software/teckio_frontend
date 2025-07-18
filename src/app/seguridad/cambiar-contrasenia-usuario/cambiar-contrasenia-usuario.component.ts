import { Component, Inject, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import Swal from 'sweetalert2';
import { UsuarioService } from '../Servicios/usuario.service';
import { reestablecerContraseniaDTO } from '../tsSeguridad';

@Component({
  selector: 'app-cambiar-contrasenia-usuario',
  templateUrl: './cambiar-contrasenia-usuario.component.html',
  styleUrls: ['./cambiar-contrasenia-usuario.component.css']
})
export class CambiarContraseniaUsuarioComponent {
  @Input()
  username: number = 0;
  formulario: FormGroup;
  constructor(private usuarioService: UsuarioService,
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<CambiarContraseniaUsuarioComponent>,
    @Inject(MAT_DIALOG_DATA) public datosUsuario: reestablecerContraseniaDTO
  ){
    this.formulario = this.fb.group({
      contrasenia: ['', Validators.required],
      confirmaContrasenia: ['', Validators.required]
    });
  }
  ngOnInit(): void {
    if (this.datosUsuario != null) {}
  }
  cambiarContrasenia(){
    let contrasenia = this.formulario.get('contrasenia')?.value;
    let confirmaContrasenia = this.formulario.get('confirmaContrasenia')?.value;
    if (typeof contrasenia === 'undefined' || !contrasenia || contrasenia === ""
      || typeof confirmaContrasenia === 'undefined' || !confirmaContrasenia || confirmaContrasenia === ""
    ) {
      Swal.fire({
        title: "Error",
        text: "Capture todos los campos",
        icon: "warning"
      });
      return;
    }
    var regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])([A-Za-z\d$@$!%*?&]|[^ ]){8,15}$/;
    if (!regex.test(contrasenia)){
      Swal.fire({
        title: "Contraseña inválida",
        text: "La contraseña debe contener mayúsculas, minúsculas, números, carácteres especiales y un mínimo de 8 carácteres.",
        icon: "warning"
      });
      return;
    }
    if (!regex.test(confirmaContrasenia)){
      Swal.fire({
        title: "Contraseña inválida",
        text: "La contraseña debe contener mayúsculas, minúsculas, números, carácteres especiales y un mínimo de 8 carácteres.",
        icon: "warning"
      });
      return;
    }
    if (contrasenia !== confirmaContrasenia) {
      Swal.fire({
        title: "Error",
        text: "Las contraseñas deben de ser iguales",
        icon: "warning"
      });
      return;
    }
    if (this.datosUsuario == null) {
      Swal.fire({
        title: "Error",
        text: "Seleccione un usuario válido",
        icon: "warning"
      });
      return;
    }
    this.usuarioService.ReestableceContraseniaUsuario({
      idUsuario: this.datosUsuario.idUsuario,
      nuevaContrasenia: contrasenia,
      nuevaContraseniaConfirma: confirmaContrasenia
    })
    .subscribe((resp) => {
      if (resp.estatus) {
        this.dialogRef.close();

        Swal.fire({
          imageUrl: "assets/success.svg",
          html: `
          <div>
          <p style="margin : 0px;">La contraseña ha sido restablecida para este usuario</p>
          </div>
          `,
          imageWidth: 50,
          customClass: {
            icon: 'no-border',
            confirmButton: 'SweetAlert2ConfirmButtonCorrecto',
           }
        });
      }
    });
  }
}
