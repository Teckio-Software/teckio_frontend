import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CredencialesUsuarioDTO } from '../tsSeguridad';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { animate, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-formulario-autenticacion',
  templateUrl: './formulario-autenticacion.component.html',
  animations: [
    // Overlay: solo fade in/out
    trigger('overlayFade', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('200ms ease-out', style({ opacity: 1 })),
      ]),
      transition(':leave', [animate('150ms ease-in', style({ opacity: 0 }))]),
    ]),

    // Modal: fade + scale + slide
    trigger('modalPop', [
      transition(':enter', [
        style({ opacity: 0, transform: 'scale(0.95) translateY(1rem)' }),
        animate(
          '250ms cubic-bezier(0.16, 1, 0.3, 1)',
          style({ opacity: 1, transform: 'scale(1) translateY(0)' })
        ),
      ]),
      transition(':leave', [
        animate(
          '200ms cubic-bezier(0.4, 0, 0.2, 1)',
          style({ opacity: 0, transform: 'scale(0.95) translateY(1rem)' })
        ),
      ]),
    ]),
  ],
})
export class FormularioAutenticacionComponent {
  @Input()
  listaErrores: string[] = [];
  @Input()
  accion!: string;
  @Input() mensajeUsuario: string = '';
  @Input() mensajeContrasena: string = '';
  @Output()
  onSubmit: EventEmitter<CredencialesUsuarioDTO> =
    new EventEmitter<CredencialesUsuarioDTO>();
  recargar: number = 0;

  password!: string;
  showPassword: boolean = false;
  isLoading = false;
  isOpen = false;

  constructor(private formBuilder: FormBuilder) {}

  form!: FormGroup;

  ngOnInit(): void {
    this.password = 'password';
    this.form = this.formBuilder.group({
      Email: [
        '',
        {
          validators: [Validators.required],
        },
      ],
      Password: [
        '',
        {
          validators: [Validators.required],
        },
      ],
    });
    this.recargar = this.recargar + 1;
  }

  openDialogRecuperarContrasena() {
    this.isOpen = true;
  }

  cerrarModal() {
    this.isOpen = false;
  }
  zfObtenerMensajeErrorEmail() {
    var campo = this.form.get('Email')!;
    if (campo.hasError('required')) {
      return 'El campo correo es requerido';
    }

    if (campo.hasError('email')) {
      return 'El correo no es válido';
    }

    return '';
  }

  showPasswordField() {
    if (this.password === 'password') {
      this.password = 'text';
      this.showPassword = true;
    } else {
      this.password = 'password';
      this.showPassword = false;
    }
  }
}
