import {
  Component,
  EventEmitter,
  Input,
  Output,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import {
  cotizacion,
  cotizacionDTO,
  TipoImpuestoDTO,
  ImpuestoInsumoCotizadoDTO,
  insumosXCotizacion,
  objetoRequisicionDTO,
} from '../tsCotizacion';
import { CotizacionService } from '../cotizacion.service';
import { OrdenCompraComponent } from '../../orden-compra/orden-compra/orden-compra.component';
import { MatDialog } from '@angular/material/dialog';
import Swal from 'sweetalert2';
import { RequisicionService } from '../../requisicion/requisicion.service';
import { InsumoXCotizacionService } from '../../insumoXCotizacion/insumoxcotizacion.service';
import { insumoXCotizacionDTO } from '../../insumoXCotizacion/tsInsumoXCotizacion';
import { InsumoXOrdenCompraService } from '../../insumoxordencompra/insumoxordencompra.service';
import { insumoXOrdenCompraDTO } from '../../insumoxordencompra/tsInsumoXOrdenCompra';
import { AlertaTipo } from 'src/app/utilidades/alert/alert.component';

@Component({
  selector: 'app-cotizaciones',
  templateUrl: './cotizaciones.component.html',
  styleUrls: ['./cotizaciones.component.css'],
})
export class CotizacionesComponent {
  objetoRequisicion!: objetoRequisicionDTO;
  impuestos!: TipoImpuestoDTO[];
  impuestosRespaldo!: TipoImpuestoDTO[];
  insumoXCotizacion!: insumosXCotizacion[];
  impuestoInsumoCotizado!: ImpuestoInsumoCotizadoDTO[];
  idInsumoXC: number = 0;
  estatusIC: number = 1;
  ExistenCotizaciones: boolean = false;
  @ViewChild('dialogImpuestos', { static: true })
  dialogNuevosImpuestos!: TemplateRef<any>;
  constructor(
    public _cotizacionService: CotizacionService,
    public _requisicionService: RequisicionService,
    private _InsumosXCotizacion: InsumoXCotizacionService,
    private dialog: MatDialog
  ) {}

  @Input()
  idRequisicionInput: number = 0;
  @Input()
  idEmpresaInput: number = 0;
  @Output() valueChange = new EventEmitter();

  @Output() valueChangeOC = new EventEmitter();
  @Output() recargar = new EventEmitter();

  @Output() enviarAlerta = new EventEmitter<{
    tipo: AlertaTipo;
    mensaje: string;
  }>();

  seleccionParaOrdenComrpa: boolean = false;
  idCotizacionParaOC: number = 0;
  appRecarga: number = 0;

  ngOnInit() {
    this.cargarRegistros();
    this._cotizacionService
      .ObtenerImpuestos(this.idEmpresaInput)
      .subscribe((datos) => {
        this.impuestos = datos;
        this.impuestosRespaldo = datos;
      });
  }

  lanzarAlerta(tipo: AlertaTipo, mensaje: string) {
    this.enviarAlerta.emit({ tipo, mensaje });
  }

  objeto: number[] = [0, 10, 100, 1000];
  cargarRegistros() {
    if (this.idRequisicionInput > 0 && this.idEmpresaInput > 0) {
      this._requisicionService
        .CrearObjetoRequisicion(this.idEmpresaInput, this.idRequisicionInput)
        .subscribe((datos) => {
          this.objetoRequisicion = datos;
          if (this.objetoRequisicion.cotizacion.length > 0) {
            this.ExistenCotizaciones = true;
          }
        });
    }
  }

  VerInsumosXCotizacion(idCotizacion: number) {
    this.valueChange.emit(idCotizacion);
  }

  VerOrdeneCompra(idCotizacion: number) {
    this.valueChangeOC.emit(idCotizacion);
  }

  // ModalOrdenCompra(idCotizacion: number) {
  //   this.dialog
  //     .open(OrdenCompraComponent, {
  //       data: idCotizacion
  //     })
  //     .afterClosed().subscribe((resultado) => {
  //       this.recargar.emit(1);
  //     });
  // }

  OrdenCompra(idCotizacion: number) {
    this.idCotizacionParaOC = idCotizacion;
    this.appRecarga += 1;
    this.seleccionParaOrdenComrpa = true;
  }

  Autorizar(cotizacion: cotizacion) {
    this._cotizacionService
      .AutorizarTodos(this.idEmpresaInput, cotizacion.idCotizacion)
      .subscribe((datos) => {
        if (datos.estatus) {
          this.lanzarAlerta(
            AlertaTipo.save,
            'Todos los insumos fueron autorizados'
          );
          cotizacion.insumoXCotizacion.forEach(element => {
            element.estatus = 3;
          });
          // this.recargar.emit(1);
        } else {
          return;
        }
      });
  }

  AutorizarInusmo(insumoCotizado: insumosXCotizacion) {
    this._InsumosXCotizacion
      .AutorizarXId(this.idEmpresaInput, insumoCotizado.idInsumoXCotizacion)
      .subscribe((datos) => {
        if (datos.estatus) {
          this.lanzarAlerta(AlertaTipo.save, datos.descripcion);
          // this.recargar.emit(1);
          insumoCotizado.estatus = 3;
        } else {
          return;
        }
      });
  }

  ActualizarInsumoCotizado(insumoCotizado: insumosXCotizacion) {
    if (
      insumoCotizado.cantidad <= 0 ||
      insumoCotizado.precioUnitario <= 0 ||
      insumoCotizado.cantidad == null ||
      insumoCotizado.precioUnitario == null ||
      insumoCotizado.cantidad == undefined ||
      insumoCotizado.precioUnitario == undefined
    ) {
      Swal.fire({
        title: 'Error',
        text: 'Captura la informacion correctamente',
        icon: 'error',
      });
      return;
    }
    if (insumoCotizado.idInsumoXCotizacion == 0) {
      Swal.fire({
        title: 'Error',
        text: 'El insumo no existe',
        icon: 'error',
      });
      return;
    } else {
      this._InsumosXCotizacion
        .ActualizarInsumoXCotizacion(this.idEmpresaInput, insumoCotizado)
        .subscribe((datos) => {
          if (datos.estatus) {
            // this.recargar.emit(1);
            insumoCotizado.estatus = 1;
          } else {
            Swal.fire({
              title: 'Error',
              text: datos.descripcion,
              icon: 'error',
            });
          }
        });
    }
  }

  ActualizarInsumosCotizados(cotizacion: cotizacion) {
    var insumos = cotizacion.insumoXCotizacion.filter(
      (insumo) =>
        insumo.cantidad <= 0 ||
        (insumo.precioUnitario <= 0 && insumo.idInsumo > 0)
    );
    if (insumos.length > 0) {
      Swal.fire({
        title: 'Error',
        text: 'Captura la informacion correctamente',
        icon: 'error',
      });
      return;
    } else {
      this._cotizacionService
        .ActualizarInsumosXCotizacion(this.idEmpresaInput, cotizacion)
        .subscribe((datos) => {
          if (datos.estatus) {
            this.recargar.emit(1);
          } else {
            Swal.fire({
              title: 'Error',
              text: datos.descripcion,
              icon: 'error',
            });
          }
        });
    }
  }

  RemoverAutorizacionInsumo(insumoCotizado: insumosXCotizacion) {
    this._InsumosXCotizacion
      .RemoverAutorizacion(
        this.idEmpresaInput,
        insumoCotizado.idInsumoXCotizacion
      )
      .subscribe((datos) => {
        if (datos.estatus) {
          this.lanzarAlerta(AlertaTipo.save, 'Insumo desautorizado');
          // this.recargar.emit(1);
          insumoCotizado.estatus = 0;
        } else {
          Swal.fire({
            title: 'Error',
            text: datos.descripcion,
            icon: 'error',
          });
        }
      });
  }

  guardarImpuestos() {
    this.recargar.emit(1);
    this.dialog.closeAll();
  }

  VerImpuestos(InsumoXCotizacion: insumosXCotizacion) {
    this.idInsumoXC = InsumoXCotizacion.idInsumoXCotizacion;
    this.estatusIC = InsumoXCotizacion.estatus;
    this.impuestoInsumoCotizado = InsumoXCotizacion.impuestoInsumoCotizado;
    if (this.impuestoInsumoCotizado.length < 4) {
      this.impuestoInsumoCotizado.push({
        id: 0,
        idInsumoCotizado: this.idInsumoXC,
        idImpuesto: 0,
        porcentaje: 0,
        importe: 0,
      });
    }
    this.dialog.open(this.dialogNuevosImpuestos, {
      width: '20%',
      disableClose: true,
    });
  }

  limpiarFormularioNuevaEntrada() {
    this.dialog.closeAll();
    this.recargar.emit(1);
  }

  detenerCierre(event: MouseEvent) {
    event.stopPropagation();
  }

  agregarNuevoImpuesto() {
    if (this.estatusIC != 1) {
    } else {
      let malRegistro = 0;
      this.impuestoInsumoCotizado.forEach((element) => {
        var registros = this.impuestoInsumoCotizado.filter(
          (impuesto) => impuesto.idImpuesto == element.idImpuesto
        );
        if (
          element.porcentaje == 0 ||
          element.porcentaje == null ||
          element.idImpuesto == 0 ||
          element.idImpuesto == null ||
          registros.length > 1
        ) {
          malRegistro++;
        }
      });

      if (malRegistro == 0) {
        this._InsumosXCotizacion
          .CrearImpuestosInsumoCotizado(
            this.idEmpresaInput,
            this.impuestoInsumoCotizado,
            this.idInsumoXC
          )
          .subscribe((datos) => {
            if (datos.estatus) {
              this.recargar.emit(1);
            }
          });
        if (this.impuestoInsumoCotizado.length < 4) {
          this.impuestoInsumoCotizado.push({
            id: 0,
            idInsumoCotizado: this.idInsumoXC,
            idImpuesto: 0,
            porcentaje: 0,
            importe: 0,
          });
        }
      } else {
      }
    }
  }

  EliminarImpuesto(impuesto: ImpuestoInsumoCotizadoDTO) {
    if (this.estatusIC != 1) {
    } else {
      this._InsumosXCotizacion
        .EliminarImpuestoInsumoCotizado(
          this.idEmpresaInput,
          impuesto.idInsumoCotizado,
          Number(impuesto.idImpuesto)
        )
        .subscribe((datos) => {
          if (datos.estatus) {
          } else {
          }
        });
      var filtrarObjeto = this.impuestoInsumoCotizado.findIndex(
        (z) =>
          z.id == impuesto.id &&
          z.idImpuesto == impuesto.idImpuesto &&
          z.porcentaje == impuesto.porcentaje
      );
      if (filtrarObjeto > -1) {
        this.impuestoInsumoCotizado.splice(filtrarObjeto, 1);
      }
    }
  }

  selectOpt(event: Event, impuesto: ImpuestoInsumoCotizadoDTO) {
    let impuesto2: ImpuestoInsumoCotizadoDTO = {
      id: 0,
      idInsumoCotizado: 0,
      idImpuesto: null,
      porcentaje: 0,
      importe: 0,
    };
    impuesto2.idImpuesto = impuesto.idImpuesto;
    impuesto.idImpuesto = 0;

    let encontrados = this.impuestoInsumoCotizado.filter(
      (z) => z.idImpuesto == impuesto2.idImpuesto
    );
    if (encontrados.length > 0) {
      var filtrarObjeto = this.impuestoInsumoCotizado.findIndex(
        (z) =>
          z.id == impuesto.id &&
          z.porcentaje == impuesto.porcentaje &&
          z.idInsumoCotizado == impuesto.idInsumoCotizado
      );
      if (filtrarObjeto > -1) {
        impuesto.idImpuesto = null;
      }
    } else {
      impuesto.idImpuesto = impuesto2.idImpuesto;
    }
  }

  regresar(seccion: 'cotizacion'): void {
    if (seccion === 'cotizacion') {
      this.seleccionParaOrdenComrpa = false;
    }
  }
}
