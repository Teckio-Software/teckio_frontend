import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-nueva-cuenta',
  templateUrl: './nueva-cuenta.component.html',
  styleUrls: ['./nueva-cuenta.component.css'],
})
export class NuevaCuentaComponent {
  @Output() regresar = new EventEmitter<void>();

  close() {
    this.regresar.emit();
  }
}
