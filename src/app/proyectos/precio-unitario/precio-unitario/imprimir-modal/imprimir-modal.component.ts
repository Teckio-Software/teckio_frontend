import { Component, EventEmitter, Input, Output } from '@angular/core';
import { log } from 'console';
import { imprimirMarcado, imprimirCompleto } from './imprimirReportes';
import { precioUnitarioDTO } from '../../tsPrecioUnitario';

@Component({
  selector: 'app-imprimir-modal',
  templateUrl: './imprimir-modal.component.html',
  styleUrls: ['./imprimir-modal.component.css'],
})
export class ImprimirModalComponent {
  @Input() isOpen: boolean = false;
  @Input() preciosUnitarios: precioUnitarioDTO[] = [];
  @Output() close = new EventEmitter<void>();

  tipoReporte: string = '';
  tipoImpresion: string = '';
  tipoPrecio: string = '';

  tituloDocumento: string = '';
  encabezadoIzq: string = '';
  encabezadoCentro: string = '';
  encabezadoDerecha: string = '';

  reportePresupuesto: boolean = false;
  isError: boolean = false;
  isError2: boolean = false;

  currentStep = 0;
  steps = [
    'Selecciona el reporte a imprimir',
    'Opciones del reporte',
    'Opciones de impresión',
  ];

  closeModal() {
    this.close.emit();
  }

  detenerCierre(event: MouseEvent) {
    event.stopPropagation();
  }

  nextStep() {
    if (this.currentStep === 0 && !this.tipoReporte) {
      this.isError = true;
      return;
    } else {
      this.isError = false;
    }

    if (this.currentStep === 1 && !this.tipoImpresion) {
      this.isError2 = true;
      return;
    } else {
      this.isError2 = false;
    }

    if (this.currentStep >= this.steps.length - 1) return;

    this.currentStep++;

    if (this.currentStep > 0) {
      switch (this.tipoReporte) {
        case 'presupuesto':
          this.reportePresupuesto = true;
          break;

        default:
          console.warn(`No hay lógica implementada para: ${this.tipoReporte}`);
      }
    }
  }

  prevStep() {
    this.isError = false;
    if (this.currentStep > 0) {
      this.currentStep--;
    }
  }

  finish() {
    switch (this.tipoReporte) {
      case 'presupuesto':
        this.reportePresupuesto = true;

        if (this.tipoImpresion === 'impresionCompleta') {
          imprimirCompleto(
            this.preciosUnitarios,
            this.tituloDocumento,
            this.encabezadoIzq,
            this.encabezadoCentro,
            this.encabezadoDerecha
          );
        }
        if (this.tipoImpresion === 'impresionMarcada') {
          imprimirMarcado();
        }
        break;

      default:
        console.log(
          `No hay lógica implementada para el tipo de reporte: ${this.tipoReporte}`
        );
    }
    this.closeModal();
  }
}
