import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-modal-asigacion',
  templateUrl: './modal-asigacion.component.html',
  styleUrls: ['./modal-asigacion.component.css'],
})
export class ModalAsigacionComponent {
  @Input() isOpen!: boolean;
  @Output() close = new EventEmitter<void>();

  closeModal() {
    this.close.emit();
  }

  detenerCierre(event: MouseEvent) {
    event.stopPropagation();
  }
}
