import { Component, EventEmitter, Input, Output } from '@angular/core';
import { log } from 'console';
import { imprimirMarcado, imprimirCompleto } from './imprimirReportes';
import { precioUnitarioDTO } from '../../tsPrecioUnitario';
import { ParametrosImprimirPuService } from './parametros-imprimir-pu.service';
import { SeguridadService } from 'src/app/seguridad/seguridad.service';
import { ParametrosImpresionPu } from './ts.parametros-imprimir-pu';

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
  pieIzq: string = '';
  pieCentro: string = '';
  pieDerecha: string = '';
  margenSuperior: number = 0.5;
  margenInferior: number = 0.5;
  margenIzquierdo: number = 0.5;
  margenDerecho: number = 0.5;
  selectedEmpresa: number = 0;

  reportePresupuesto: boolean = false;
  isError: boolean = false;
  isError2: boolean = false;

  currentStep = 0;
  steps = [
    'Selecciona el reporte a imprimir',
    'Opciones del reporte',
    'Opciones de impresión',
  ];

  paramsImpresion: ParametrosImpresionPu = {
    id: 0,
    idCliente: 0,
    nombre: '',
    encabezadoIzquierdo: '',
    encabezadoCentro: '',
    encabezadoDerecho: '',
    pieIzquierdo: '',
    pieCentro: '',
    pieDerecho: '',
    idImagen: 0,
    margenSuperior: 0.5,
    margenInferior: 0.5,
    margenDerecho: 0.5,
    margenIzquierdo: 0.5,
  };

  constructor(
    private parametrosImpresion: ParametrosImprimirPuService,
    private seguridadService: SeguridadService
  ) {
    const idEmpresa: number = Number(
      seguridadService.obtenIdEmpresaLocalStorage()
    );

    this.selectedEmpresa = idEmpresa;
  }

  crearConfiguracionParams() {
    this.parametrosImpresion
      .crear(this.selectedEmpresa, this.paramsImpresion)
      .subscribe((datos) => {
        console.log(datos);
        if (datos) {
          console.log(datos);
        }
      });
  }

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
            this.paramsImpresion.nombre,
            this.paramsImpresion.encabezadoIzquierdo,
            this.paramsImpresion.encabezadoCentro,
            this.paramsImpresion.encabezadoDerecho
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
