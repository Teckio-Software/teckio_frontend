import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-productos-servicios',
  templateUrl: './productos-servicios.component.html',
})
export class ProductosServiciosComponent {
  isModalAddOpen = false;
  isModalInfoOpen = false;

  abrirModal(tipoModal: string) {
    if (tipoModal === 'informacion') {
      this.isModalInfoOpen = true;
    } else {
      this.isModalAddOpen = true;
    }
  }

  cerrarModal() {
    this.isModalAddOpen = false;
    this.isModalInfoOpen = false;
  }

  detenerCierre(event: MouseEvent) {
    event.stopPropagation();
  }
}
