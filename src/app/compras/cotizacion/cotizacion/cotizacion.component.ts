import {
  Component,
  ElementRef,
  EventEmitter,
  Host,
  Inject,
  Input,
  OnInit,
  Output,
  TemplateRef,
  ViewChild,
} from '@angular/core';

import { FormBuilder, FormGroup } from '@angular/forms';

import {
  cotizacionDTO,
  cotizacionCreacionDTO,
  InsumoXCotizacionCreacionDTO,
  insumosXCotizacion,
} from '../tsCotizacion';
import { CotizacionService } from '../cotizacion.service';
import { insumoXCotizacionDTO } from '../../insumoXCotizacion/tsInsumoXCotizacion';
import { insumoXRequisicionDTO } from '../../insumos-requicision/insumoxrequisicion/tsInsumoXRequisicion';
import { InsumoXRequisicionService } from '../../insumos-requicision/insumoxrequisicion/insumoxrequisicion.service';
import { InsumoXCotizacionService } from '../../insumoXCotizacion/insumoxcotizacion.service';
import { contratistaDTO } from 'src/app/catalogos/contratista/tsContratista';
import { ContratistaService } from 'src/app/catalogos/contratista/contratista.service';

import { SeguridadService } from 'src/app/seguridad/seguridad.service';

import Swal from 'sweetalert2';
import { AlertaTipo } from 'src/app/utilidades/alert/alert.component';
import { elementAt } from 'rxjs';

@Component({
  selector: 'app-cotizacion',
  templateUrl: './cotizacion.component.html',
})
export class CotizacionComponent implements OnInit {
  @Input()
  idRequisicionInput: number = 0;
  @Output() recargar = new EventEmitter();
  @Output() enviarAlerta = new EventEmitter<{
    tipo: AlertaTipo;
    mensaje: string;
  }>();

  form!: FormGroup;
  cotizaciones: cotizacionDTO[] = [];
  cotizacionesReset: cotizacionDTO[] = [];
  alertaTipo: AlertaTipo = AlertaTipo.none;
  AlertaTipo = AlertaTipo;

  cotizacion: cotizacionCreacionDTO = {
    idProyecto: 0,
    idRequisicion: 0,
    idContratista: 0,
    observaciones: '',
    listaInsumosCotizacion: [],
  };
  listaInsumosXRequisicion: insumoXRequisicionDTO[] = [];
  listaInsumosxCotizacion: insumoXCotizacionDTO[] = [];
  listaInsumosCotizacionCrear: InsumoXCotizacionCreacionDTO[] = [];
  contratista: contratistaDTO[] = [];
  selectedEmpresa: number = 0;
  selectedProyecto: number = 0;
  idContratista: number = 0;
  idCotizacion: number = 0;
  seleccionParaOrdenComrpa: boolean = false;
  idCotizacionParaOC: number = 0;
  appRecarga: number = 0;
  insumosEstado: boolean = false;
  importeTotalCotizacion : number = 0;
  importeTotalCotizacionConFormato : string = "0.00"

  selectedIndex: number = -1;

  // vardatos !: listaRequisicionDTO;
  // @ViewChild('closeModal') closeModal!: ElementRef
  constructor(
    // @Inject(MAT_DIALOG_DATA) public datos: listaRequisicionDTO,
    private _SeguridadEmpresa: SeguridadService,
    private _InsumosXRequisicion: InsumoXRequisicionService,
    private FormBuilder: FormBuilder,
    // , public dialogRef: MatDialogRef<CotizacionComponent>,
    public _cotizacionService: CotizacionService,
    public _contratistaService: ContratistaService,
    public _insumoxcotizacion: InsumoXCotizacionService
  ) {
    let idEmpresa = _SeguridadEmpresa.obtenIdEmpresaLocalStorage();
    let idProyecto = _SeguridadEmpresa.obtenerIdProyectoLocalStorage();
    this.selectedEmpresa = Number(idEmpresa);
    this.selectedProyecto = Number(idProyecto);
    // this.vardatos = datos;
  }
  ngOnInit(): void {
    // this.dialogRef.updateSize('80%'); // Actualiza el tamaño del diálogo

    this._contratistaService
      .obtenerTodos(this.selectedEmpresa)
      .subscribe((datos) => {
        this.contratista = datos;
      });

    this.cargarCotizaciones();

    this.form = this.FormBuilder.group({
      contratista: ['', { validators: [] }],
      observaciones: ['', { validators: [] }],
    });

    this.cargarInsumosXRequisicion();
  }

  lanzarAlerta(tipo: AlertaTipo, mensaje: string) {
    this.enviarAlerta.emit({ tipo, mensaje });
  }

  cargarCotizaciones() {
    this._cotizacionService
      .ObtenXIdRequisicion(this.selectedEmpresa, this.idRequisicionInput)
      .subscribe((datos) => {
        this.cotizaciones = datos;
        this.cotizacionesReset = datos;
      });
  }

  desplegarInformacion(cotizacion: cotizacionDTO) {
    cotizacion.isExpanded = !cotizacion.isExpanded;
  }

  cargarInsumosXRequisicion() {
    this._InsumosXRequisicion
      .obtenerTodosInsumosRequicicion(
        this.selectedEmpresa,
        this.idRequisicionInput
      )
      .subscribe((datos) => {
        this.listaInsumosXRequisicion = datos;
        console.log(this.listaInsumosXRequisicion, 'Sewe');
      });
  }

  // GuardarCotizacion() {
  //   this.cotizacion.idContratista = Number(this.form.get("contratista")?.value);
  //   this.cotizacion.observaciones = this.form.get("observaciones")?.value;
  //   this.cotizacion.idProyecto = this.selectedProyecto;
  //   this.cotizacion.idRequisicion = this.idRequisicionInput;
  //   this.cotizacion.listaInsumosCotizacion = [];
  //   if (this.cotizacion.observaciones == "" || this.cotizacion.idContratista == 0) {
  //     Swal.fire({
  //       title: "Error",
  //       text: "Capture la información correctamente",
  //       icon: "error"
  //     });
  //   } else {
  //     this.listaInsumosCotizacionCrear.forEach(element => {
  //       if (element.unidad == "" ||
  //         element.cantidad <= 0 ||
  //         element.precioUnitario <= 0 ||
  //         element.descuento > (element.precioUnitario * element.cantidad) || element.descuento == null || element.pIVA > 100 || element.pIVA < 0
  //       ) {
  //         Swal.fire({
  //           title: "Error",
  //           text: "Capture correctamente la información de los insumos",
  //           icon: "error"
  //         });
  //       } else {
  //         this.cotizacion.listaInsumosCotizacion.push(element);
  //       }
  //     });
  //     if (this.cotizacion.listaInsumosCotizacion.length < this.listaInsumosCotizacionCrear.length) {
  //       Swal.fire({
  //         title: "Error",
  //         text: "Verifique que todos sus insumos sean correctos",
  //         icon: "error"
  //       });
  //     } else {
  //       this._cotizacionService.CrearCotizacion(this.selectedEmpresa, this.cotizacion).subscribe((datos) => {
  //         if (datos.estatus) {
  //           // this.dialogRef.close();
  //           this.cotizacion = {
  //             idProyecto: 0,
  //             idRequisicion: 0,
  //             idContratista: 0,
  //             observaciones: "",
  //             listaInsumosCotizacion: []
  //           }
  //         } else {
  //           Swal.fire({
  //             title: "Error",
  //             text: datos.descripcion,
  //             icon: "error"
  //           });
  //           this.cotizacion.listaInsumosCotizacion = [];
  //         }
  //       });
  //     }
  //   }
  // }

  EliminarListaInsumosXCotizacion(descripcion: string, unidad: string) {
    if (this.listaInsumosCotizacionCrear.length > 1) {
      var filtrarObjeto = this.listaInsumosCotizacionCrear.findIndex(
        (z) => z.descripcion == descripcion && z.unidad == unidad
      );
      if (filtrarObjeto > -1) {
        this.listaInsumosCotizacionCrear.splice(filtrarObjeto, 1);
      }
    }
  }

  crearCotizacion() {
    this.cotizacion.idProyecto = this.selectedProyecto;
    this.cotizacion.idRequisicion = this.idRequisicionInput;
    this._cotizacionService
      .CrearCotizacion(this.selectedEmpresa, this.cotizacion)
      .subscribe((datos) => {
        if (datos.estatus) {
          this.cargarCotizaciones();
          this.lanzarAlerta(AlertaTipo.save, 'Cotización creada');
        } else {
          Swal.fire({
            title: 'Error',
            text: datos.descripcion,
            icon: 'error',
          });
        }
      });
  }

  actualizarCotizacion(cotizacionDTO: cotizacionDTO) {
    if (cotizacionDTO.representanteLegal != '') {
      let contratista = this.contratista.filter(
        (z) => z.representanteLegal == cotizacionDTO.representanteLegal
      );
      this.idContratista = contratista.length <= 0 ? 0 : contratista[0].id;
    } else {
      return;
    }
    if (this.idContratista == 0) {
      return;
    }
    cotizacionDTO.idContratista = this.idContratista;
    this._cotizacionService
      .EditarCotizacion(this.selectedEmpresa, cotizacionDTO)
      .subscribe((datos) => {
        if (datos.estatus) {
          this.cargarCotizaciones();
        } else {
          Swal.fire({
            title: 'Error',
            text: datos.descripcion,
            icon: 'error',
          });
        }
      });

    this.lanzarAlerta(AlertaTipo.edit, 'Cotización actualizada');
  }

  seleccionado(cotizacion: cotizacionDTO) {
    if (cotizacion.id == this.idCotizacion) {
      this.cotizaciones = this.cotizacionesReset;
      this.idCotizacion = 0;
      this.seleccionParaOrdenComrpa = false;
      this.insumosEstado = false;
      return;
    }
    this.insumosEstado = true;
    this.cotizaciones = [];
    this.cotizaciones.push(cotizacion);
    this.idCotizacion = cotizacion.id;
    this.seleccionParaOrdenComrpa = false;
    this.CargarInsumocXCotizacion();
  }

  CargarInsumocXCotizacion() {

    this.listaInsumosCotizacionCrear = [];
    this._insumoxcotizacion
      .ObtenXIdCotizacion(this.selectedEmpresa, this.idCotizacion)
      .subscribe((datos) => {
        this.importeTotalCotizacion = 0;
        this.listaInsumosxCotizacion = datos;
        console.log(this.listaInsumosXRequisicion, "UwU");
        this.listaInsumosXRequisicion.forEach((element) => {
          console.log(element, "element");
          let insumocotizado = this.listaInsumosxCotizacion.find(
            (z) => z.idInsumoRequisicion == element.id
          );
          if (insumocotizado) {
            this.listaInsumosCotizacionCrear.push({
              idInsumoRequisicion: element.id,
              descripcion: element.descripcion,
              unidad: element.unidad,
              cantidad: insumocotizado.cantidad,
              precioUnitario: insumocotizado.precioUnitario,
              descuento: insumocotizado.descuento,
              pIVA: 16,
              idCotizacion: this.idCotizacion,
              id: insumocotizado.id,
              idInsumo: element.idInsumo,
              estatus: insumocotizado.estatusInsumoCotizacion,
              importeTotal: insumocotizado.importeTotal,
              cantidadConFormato: insumocotizado.cantidadConFormato,
              descuentoConFormato: insumocotizado.descuentoConFormato,
              precioUnitarioConFormato: insumocotizado.precioUnitarioConFormato,
              importeTotalConFormato: insumocotizado.importeTotalConFormato,
              pIvaConFormato: insumocotizado.pIvaConFormato,
              pCotizado: element.cUnitario,
              pCotizadoConFormato: new Intl.NumberFormat('es-MX', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              }).format(element.cUnitario),
            });
          } else {
            this.listaInsumosCotizacionCrear.push({
              idInsumoRequisicion: element.id,
              descripcion: element.descripcion,
              unidad: element.unidad,
              cantidad: element.cantidad,
              precioUnitario: 0,
              descuento: 0,
              pIVA: 16,
              idCotizacion: this.idCotizacion,
              id: 0,
              idInsumo: element.idInsumo,
              estatus: 0,
              importeTotal: 0,
              cantidadConFormato: '0.00',
              descuentoConFormato: '0.00',
              precioUnitarioConFormato: '0.00',
              importeTotalConFormato: '0.00',
              pIvaConFormato: '',
              pCotizado: element.cUnitario,
              pCotizadoConFormato: new Intl.NumberFormat('es-MX', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              }).format(element.cUnitario),
            });
          }
        });
        this.listaInsumosCotizacionCrear.forEach((element) => {
          this.importeTotalCotizacion = this.importeTotalCotizacion + element.importeTotal;
        });
        this.importeTotalCotizacionConFormato = new Intl.NumberFormat('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(this.importeTotalCotizacion);
      });
      
  }

  actualizarInsumoCotizado(insumoCotizado: InsumoXCotizacionCreacionDTO) {
    console.log("este es el insumo", insumoCotizado);
    
    if (
      insumoCotizado.cantidad <= 0 ||
      insumoCotizado.cantidad == undefined ||
      insumoCotizado.cantidad == null ||
      insumoCotizado.precioUnitario <= 0 ||
      insumoCotizado.cantidad == undefined ||
      insumoCotizado.precioUnitario == null ||
      insumoCotizado.pIVA <= 0 ||
      insumoCotizado.cantidad == undefined ||
      insumoCotizado.pIVA > 16 ||
      insumoCotizado == null ||
      insumoCotizado.descuento >
      insumoCotizado.cantidad * insumoCotizado.precioUnitario ||
      insumoCotizado.descuento == null
    ) {
      console.log("efe")
      return;
    } else {
      if (insumoCotizado.id != 0) {
        let insumoEditado: insumosXCotizacion = {
          idInsumoXCotizacion: insumoCotizado.id,
          idInsumo: insumoCotizado.id,
          descripcion: insumoCotizado.descripcion,
          unidad: insumoCotizado.unidad,
          importe: 0,
          precioUnitario: insumoCotizado.precioUnitario,
          cantidad: insumoCotizado.cantidad,
          estatus: 0,
          impuestoInsumoCotizado: [],
          descuento: insumoCotizado.descuento,
        };
        this._insumoxcotizacion
          .ActualizarInsumoXCotizacion(this.selectedEmpresa, insumoEditado)
          .subscribe((datos) => {
            if (datos.estatus) {
              this.CargarInsumocXCotizacion();
            }
          });
        this.lanzarAlerta(AlertaTipo.save, 'Insumo actualizado');
      } else {
        this._insumoxcotizacion
          .CrearInsumoCotizado(this.selectedEmpresa, insumoCotizado)
          .subscribe((datos) => {
            if (datos.estatus) {
              this.CargarInsumocXCotizacion();
            }
          });
        this.lanzarAlerta(AlertaTipo.save, 'Insumo actualizado');
      }
    }
  }

  OrdenConpra(cotizacion: cotizacionDTO) {
    this.idCotizacionParaOC = cotizacion.id;
    this.cotizaciones = [];
    this.cotizaciones.push(cotizacion);
    this.idCotizacion = cotizacion.id;
    this.appRecarga += 1;
    this.seleccionParaOrdenComrpa = true;
  }
}
