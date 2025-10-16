import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-ver-cuenta',
  templateUrl: './ver-cuenta.component.html',
  styleUrls: ['./ver-cuenta.component.css'],
})
export class VerCuentaComponent {
  @Input() verCuenta: boolean = false;
  @Output() regresar = new EventEmitter<void>();

  close() {
    this.regresar.emit();
  }
}
