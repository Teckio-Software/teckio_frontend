import { proyectoDTO } from './../../../proyecto/tsProyecto';
import { is } from 'date-fns/locale';
import { Component, EventEmitter, Input, Output } from '@angular/core';

import { imprimirReporte } from './imprimirReportes';
import { precioUnitarioDTO } from '../../tsPrecioUnitario';
import { ParametrosImprimirPuService } from './parametros-imprimir-pu.service';
import { SeguridadService } from 'src/app/seguridad/seguridad.service';
import { ParametrosImpresionPu } from './ts.parametros-imprimir-pu';
import { RespuestaDTO } from 'src/app/utilidades/tsUtilidades';

@Component({
  selector: 'app-imprimir-modal',
  templateUrl: './imprimir-modal.component.html',
  styleUrls: ['./imprimir-modal.component.css'],
})
export class ImprimirModalComponent {
  @Input() isOpen: boolean = false;
  @Input() preciosUnitarios: precioUnitarioDTO[] = [];
  @Input() marcados: precioUnitarioDTO[] = [];
  @Input() proyecto!: proyectoDTO;

  @Input() totalSinIva!: string;
  @Input() totalConIva!: string;
  @Input() totalIva!: string;

  @Output() close = new EventEmitter<void>();

  tipoReporte: string = '';
  tipoImpresion: string = '';
  tipoPrecio: string = '';

  tipoError: string = '';

  tituloDocumento: string = '';
  encabezadoIzq: string = '';
  encabezadoCentro: string = '';
  encabezadoDerecha: string = '';
  pieIzq: string = '';
  pieCentro: string = '';
  pieDerecha: string = '';
  margenSuperior: number = 30;
  margenInferior: number = 30;
  margenIzquierdo: number = 30;
  margenDerecho: number = 30;
  selectedEmpresa: number = 0;
  selectedParams?: ParametrosImpresionPu;
  selectedParamId: number = 0;

  isParamGuardado: boolean = false;
  isParamDeleted: boolean = false;

  reportePresupuesto: boolean = false;
  isImporteconLetra: boolean = false;
  isError: boolean = false;
  isError2: boolean = false;
  isError3: boolean = false;

  currentStep = 0;
  steps = [
    'Selecciona el reporte a imprimir',
    'Opciones del reporte',
    'Opciones de impresión',
  ];

  paramsImpresionLista: ParametrosImpresionPu[] = [];

  paramsImpresion: ParametrosImpresionPu = {
    id: 0,
    nombre: '',
    encabezadoIzquierdo: '',
    encabezadoCentro: '',
    encabezadoDerecho: '',
    pieIzquierdo: '',
    pieCentro: '',
    pieDerecho: '',
    margenSuperior: 30,
    margenInferior: 30,
    margenDerecho: 30,
    margenIzquierdo: 30,
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

  ngOnInit() {
    this.obtenerParametrosImpresion();
    console.log(this.preciosUnitarios);
  }

  seleccionarParams(event: Event) {
    const id = Number((event.target as HTMLSelectElement).value);
    const seleccionado = this.paramsImpresionLista.find((p) => p.id === id);

    if (seleccionado) {
      this.paramsImpresion = { ...seleccionado };
    }
  }

  crearConfiguracionParams() {
    this.parametrosImpresion
      .crear(this.selectedEmpresa, this.paramsImpresion)
      .subscribe({
        next: (datos: RespuestaDTO) => {
          if (datos.estatus) {
            this.isParamGuardado = true;
            this.obtenerParametrosImpresion();
          } else {
            this.isParamGuardado = false;
            this.tipoError = datos.descripcion || 'Ocurrió un error';
          }
          setTimeout(() => {
            this.isParamGuardado = false;
            this.tipoError = '';
          }, 3000);
        },
        error: (err) => {
          this.isParamGuardado = false;
          this.tipoError = 'Error al conectar con el servidor';
          console.error(err);

          setTimeout(() => {
            this.tipoError = '';
          }, 3000);
        },
      });
  }

  obtenerParametrosImpresion() {
    this.parametrosImpresion
      .obtenerTodos(this.selectedEmpresa)
      .subscribe((datos) => {
        this.paramsImpresionLista = datos;
      });
  }

  editarParams(id: number) {
    this.parametrosImpresion
      .editar(this.selectedEmpresa, this.paramsImpresion)
      .subscribe({
        next: (datos) => {
          this.paramsImpresion.id = id;
          if (datos.estatus) {
            this.isParamGuardado = true;
            this.obtenerParametrosImpresion();
          } else {
            this.isParamGuardado = false;
            this.tipoError = datos.descripcion || 'Ocurrió un error';
          }
          setTimeout(() => {
            this.isParamGuardado = false;
            this.tipoError = '';
          }, 3000);
        },
        error: (err) => {
          this.isParamGuardado = false;
          this.tipoError = 'Error al conectar con el servidor';
          console.error(err);
        },
      });
  }

  eliminarParams(id: number) {
    this.parametrosImpresion.eliminar(this.selectedEmpresa, id).subscribe({
      next: (datos) => {
        if (datos.estatus) {
          this.isParamDeleted = true;
          this.paramsImpresion = {
            id: 0,
            nombre: '',
            encabezadoIzquierdo: '',
            encabezadoCentro: '',
            encabezadoDerecho: '',
            pieIzquierdo: '',
            pieCentro: '',
            pieDerecho: '',
            margenSuperior: 30,
            margenInferior: 30,
            margenDerecho: 30,
            margenIzquierdo: 30,
          };
          this.obtenerParametrosImpresion();
        } else {
          this.tipoError = datos.descripcion || 'Ocurrió un error';
        }

        setTimeout(() => {
          this.isParamDeleted = false;
          this.tipoError = '';
        }, 3000);
      },
      error: (err) => {
        this.tipoError = 'Error al conectar con el servidor';
        console.error(err);

        setTimeout(() => {
          this.tipoError = '';
        }, 3000);
      },
    });
  }

  closeModal() {
    this.close.emit();
  }

  detenerCierre(event: MouseEvent) {
    event.stopPropagation();
  }

  nextStep() {
    this.isError = false;
    this.isError2 = false;
    this.isError3 = false;

    //validar si hay reporte seleccionado
    if (this.currentStep === 0 && !this.tipoReporte) {
      this.isError = true;
      return;
    } else {
      this.isError = false;
    }

    //validar si hay rango de impresion seleccionado
    if (this.currentStep === 1 && !this.tipoImpresion) {
      this.isError2 = true;
      return;
    } else {
      this.isError2 = false;
    }

    //validar si es impresion marcada y si hay marcados
    if (
      this.currentStep === 1 &&
      this.tipoImpresion === 'impresionMarcada' &&
      (!this.marcados || this.marcados.length === 0)
    ) {
      this.isError3 = true;
      return;
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
        console.log(this.preciosUnitarios);

        console.log(this.totalConIva, this.totalSinIva);

        if (this.tipoImpresion === 'impresionCompleta') {
          imprimirReporte(
            this.preciosUnitarios,
            this.paramsImpresion.nombre,
            this.paramsImpresion.encabezadoIzquierdo,
            this.paramsImpresion.encabezadoCentro,
            this.paramsImpresion.encabezadoDerecho,
            this.paramsImpresion.margenSuperior,
            this.paramsImpresion.margenInferior,
            this.paramsImpresion.margenIzquierdo,
            this.paramsImpresion.margenDerecho,
            this.isImporteconLetra,
            this.totalSinIva,
            this.totalConIva,
            this.proyecto,
            this.totalIva
          );
        }
        if (this.tipoImpresion === 'impresionMarcada') {
          imprimirReporte(
            this.marcados,
            this.paramsImpresion.nombre,
            this.paramsImpresion.encabezadoIzquierdo,
            this.paramsImpresion.encabezadoCentro,
            this.paramsImpresion.encabezadoDerecho,
            this.paramsImpresion.margenSuperior,
            this.paramsImpresion.margenInferior,
            this.paramsImpresion.margenIzquierdo,
            this.paramsImpresion.margenDerecho,
            this.isImporteconLetra,
            this.totalSinIva,
            this.totalConIva,
            this.proyecto,
            this.totalIva
          );
        }
        break;

      default:
        console.log(
          `No hay lógica implementada para el tipo de reporte: ${this.tipoReporte}`
        );
    }
  }
}
