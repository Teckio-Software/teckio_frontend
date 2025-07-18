import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { Event } from '@angular/router';
import { precioUnitarioDetalleDTO } from 'src/app/proyectos/precio-unitario-detalle/tsPrecioUnitarioDetalle';
import { CostoHorarioFijoXPrecioUnitarioDetalleDTO } from '../../tsPrecioUnitario';
import { KatexSpecificOptions } from 'ngx-markdown';

@Component({
  selector: 'app-precio-unitario-modal',
  templateUrl: './precio-unitario-modal.component.html',
  styleUrls: ['./precio-unitario-modal.component.css'],
})
export class PrecioUnitarioModalComponent {
  costofijo: CostoHorarioFijoXPrecioUnitarioDetalleDTO = {
    id: 0,
    idPrecioUnitarioDetalle: 0,
    inversion: 0,
    interesAnual: 0,
    horasUso: 0,
    vidaUtil: 0,
    porcentajeReparacion: 0,
    porcentajeSeguroAnual: 0,
    gastoAnual: 0,
    mesTrabajoReal: 0,
  };

  @Input() isOpen: boolean = false;
  @Input() detalle!: precioUnitarioDetalleDTO;
  @Output() close = new EventEmitter<void>();
  selectedIndex: number = 0;

  closeModal() {
    this.close.emit();
  }

  seleccionarIndex(event: MatTabChangeEvent) {
    this.selectedIndex = event.index;
  }
}
