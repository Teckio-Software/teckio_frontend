import { Component } from '@angular/core';

@Component({
  selector: 'app-cuenta-form',
  templateUrl: './cuenta-form.component.html',
  styleUrls: ['./cuenta-form.component.css'],
})
export class CuentaFormComponent {
  isCreate: boolean = false;

  crearArticulo() {
    this.isCreate = true;
  }
}
