import {
  Component,
  EventEmitter,
  Inject,
  Input,
  OnInit,
  Output,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { MatTable } from '@angular/material/table';
import { HttpResponse } from '@angular/common/http';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSelectChange } from '@angular/material/select';
import { ordenCompraDTO, ordenCompraCreacionDTO } from '../tsOrdenCompra';
import { OrdenCompraService } from '../orden-compra.service';
import { proyectoDTO } from 'src/app/proyectos/proyecto/tsProyecto';
import { ProyectoService } from 'src/app/proyectos/proyecto/proyecto.service';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import {
  insumoXOrdenCompraCreacionDTO,
  insumoXOrdenCompraDTO,
} from '../../insumoxordencompra/tsInsumoXOrdenCompra';
import { ReplaySubject } from 'rxjs';
import { InsumoXOrdenCompraService } from '../../insumoxordencompra/insumoxordencompra.service';
import { insumoXCotizacionDTO } from '../../insumoXCotizacion/tsInsumoXCotizacion';
import { CotizacionComponent } from '../../cotizacion/cotizacion/cotizacion.component';
import { cotizacionDTO } from '../../cotizacion/tsCotizacion';
import { InsumoXCotizacionService } from '../../insumoXCotizacion/insumoxcotizacion.service';
import { SeguridadService } from 'src/app/seguridad/seguridad.service';
import Swal from 'sweetalert2';
import { CotizacionService } from '../../cotizacion/cotizacion.service';
import { AlertaTipo } from 'src/app/utilidades/alert/alert.component';

@Component({
  selector: 'app-orden-compra',
  templateUrl: './orden-compra.component.html',
  styleUrls: ['./orden-compra.component.css'],
})
export class OrdenCompraComponent implements OnInit {
  @Input() idCotizacionInput: number = 0;
  @Output() enviarAlerta = new EventEmitter<{
    tipo: AlertaTipo;
    mensaje: string;
  }>();

  insumosEstado: boolean = false;

  form!: FormGroup;
  listaInsumosXCotizacion: insumoXCotizacionDTO[] = [];
  cotizacion!: cotizacionDTO;
  ordenCompra: ordenCompraCreacionDTO = {
    idRequisicion: 0,
    idCotizacion: 0,
    idProyecto: 0,
    chofer: '',
    observaciones: '',
    listaInsumosOrdenCompra: [],
    idContratista: 0,
  };
  selectedEmpresa: number = 0;
  selectedProyecto: number = 0;
  ordenescompras: ordenCompraDTO[] = [];
  idOrdenCompra: number = 0;
  insumosXordencompras: insumoXOrdenCompraDTO[] = [];
  insumoOCCreacion: insumoXOrdenCompraCreacionDTO = {
    idInsumoXCotizacion: 0,
    idInsumo: 0,
    cantidad: 0,
    precioUnitario: 0,
    importeConIva: 0,
    importeSinIva: 0,
    idOrdenCompra: 0,
  };

  constructor(
    public _insumoXOrdenCompra: InsumoXOrdenCompraService,
    private FormBuilder: FormBuilder,
    public _insumoXCotizacion: InsumoXCotizacionService,
    private _SeguridadEmpresa: SeguridadService,
    public _ordenCompraService: OrdenCompraService,
    public _cotizacionService: CotizacionService,
    public _insumoXOrdenCompraService: InsumoXOrdenCompraService
  ) {
    let idEmpresa = _SeguridadEmpresa.obtenIdEmpresaLocalStorage();
    this.selectedEmpresa = Number(idEmpresa);
    let idProyecto = _SeguridadEmpresa.obtenerIdProyectoLocalStorage();
    this.selectedProyecto = Number(idProyecto);
  }

  ngOnInit(): void {
    this.form = this.FormBuilder.group({
      chofer: ['', { validators: [] }],
      observaciones: ['', { validators: [] }],
    });
    this._cotizacionService
      .obtenerXId(this.selectedEmpresa, this.idCotizacionInput)
      .subscribe((datos) => {
        this.cotizacion = datos;
      });
    this.cargarInusmmosCotizados();
    this.cargarOrdenCompra();
  }

  desplegarInformacion(params: {
    ordenCompra?: ordenCompraDTO;
    insumoCotizacion?: insumoXCotizacionDTO;
    insumoOc?: insumoXOrdenCompraDTO;
  }) {
    const { ordenCompra, insumoCotizacion, insumoOc } = params;

    if (ordenCompra) {
      ordenCompra.isExpanded = !ordenCompra.isExpanded;
      return;
    }

    if (insumoCotizacion) {
      insumoCotizacion.isExpanded = !insumoCotizacion.isExpanded;
      return;
    }

    if (insumoOc) {
      insumoOc.isExpanded = !insumoOc.isExpanded;
      return;
    }
  }

  cargarInusmmosCotizados() {
    this._insumoXCotizacion
      .ObtenXIdCotizacionNoComprados(
        this.selectedEmpresa,
        this.idCotizacionInput
      )
      .subscribe((datos) => {
        this.listaInsumosXCotizacion = datos;
      });
  }

  EliminarListaInsumosXCotizacion(id: number) {
    if (this.listaInsumosXCotizacion.length > 1) {
      var filtrarObjeto = this.listaInsumosXCotizacion.findIndex(
        (z) => z.id == id
      );
      if (filtrarObjeto > -1) {
        this.listaInsumosXCotizacion.splice(filtrarObjeto, 1);
      }
    }
  }

  cargarOrdenCompra() {
    this._ordenCompraService
      .ObtenXIdCotizacion(this.selectedEmpresa, this.idCotizacionInput)
      .subscribe((datos) => {
        this.ordenescompras = datos;
      });
  }

  // GuardarOrdenCompra() {
  //     this.ordenCompra.listaInsumosOrdenCompra = [];
  //     this.ordenCompra.idCotizacion = this.cotizacion.id;
  //     this.ordenCompra.idContratista = this.cotizacion.idContratista;
  //     this.ordenCompra.idProyecto = this.cotizacion.idProyecto;
  //     this.ordenCompra.idRequisicion = this.cotizacion.idRequisicion;
  //     this.ordenCompra.chofer = this.form.get("chofer")?.value;
  //     this.ordenCompra.observaciones = this.form.get("observaciones")?.value;

  //     if (this.ordenCompra.chofer == "" || this.ordenCompra.observaciones == "") {
  //         Swal.fire({
  //             title: "Error",
  //             text: "Capture la información correctamente",
  //             icon: "error"
  //         });
  //     }else{
  //         this.listaInsumosXCotizacion.forEach(element => {
  //             this.ordenCompra.listaInsumosOrdenCompra.push({
  //                 idInsumoXCotizacion: element.id,
  //                 idInsumo: element.idInsumo,
  //                 cantidad: element.cantidadCotizada,
  //                 precioUnitario: element.precioUnitario,
  //                 importeConIva: element.importeTotal,
  //                 importeSinIva: element.importeSinIva,
  //                 idOrdenCompra: 0
  //             });
  //         });
  //         this._ordenCompraService.CrearOrdenCompra(this.selectedEmpresa, this.ordenCompra).subscribe((datos) => {
  //             if(datos.estatus){
  //             }else{
  //                 Swal.fire({
  //                     title: "Error",
  //                     text: datos.descripcion,
  //                     icon: "error"
  //                 });
  //             }
  //         });
  //     }
  // }

  lanzarAlerta(tipo: AlertaTipo, mensaje: string) {
    this.enviarAlerta.emit({ tipo, mensaje });
  }

  crearOrdenCompra() {
    this.ordenCompra.idCotizacion = this.idCotizacionInput;
    this.ordenCompra.idRequisicion = this.cotizacion.idRequisicion;
    this.ordenCompra.idContratista = this.cotizacion.idContratista;
    this.ordenCompra.idProyecto = this.selectedProyecto;
    this.ordenCompra.chofer = '';
    this.ordenCompra.observaciones = '';
    if (this.listaInsumosXCotizacion.length > 0) {
      this._ordenCompraService
        .CrearOrdenCompra(this.selectedEmpresa, this.ordenCompra)
        .subscribe((datos) => {
          if (datos.estatus) {
            this.cargarOrdenCompra();
            this.lanzarAlerta(AlertaTipo.save, 'Orden de compra creada');
          } else {
            Swal.fire({
              title: 'Error',
              text: datos.descripcion,
              icon: 'error',
            });
          }
        });
    } else {
      Swal.fire({
        title: 'Error',
        text: 'Na hay insumos para comprar',
        icon: 'error',
      });
    }
  }

  actualizarOrdenCompra(ordenCompra: ordenCompraDTO) {
    this._ordenCompraService
      .EditarOrdenCompra(this.selectedEmpresa, ordenCompra)
      .subscribe((datos) => {
        if (datos.estatus) {
          this.lanzarAlerta(AlertaTipo.edit, 'Orden de compra actualizada');
          this.cargarOrdenCompra();
        } else {
          Swal.fire({
            title: 'Error',
            text: datos.descripcion,
            icon: 'error',
          });
        }
      });
  }

  ComprarInsumo(insumoCotizado: insumoXCotizacionDTO) {
    (this.insumoOCCreacion.idInsumoXCotizacion = insumoCotizado.id),
      (this.insumoOCCreacion.idInsumo = insumoCotizado.idInsumo),
      (this.insumoOCCreacion.cantidad = insumoCotizado.cantidadCotizada),
      (this.insumoOCCreacion.precioUnitario = insumoCotizado.precioUnitario),
      (this.insumoOCCreacion.importeConIva = insumoCotizado.importeTotal),
      (this.insumoOCCreacion.importeSinIva = insumoCotizado.importeSinIva);
    this.insumoOCCreacion.idOrdenCompra = this.idOrdenCompra;
    this._insumoXOrdenCompraService
      .CrearInsumoOrdenCompra(this.selectedEmpresa, this.insumoOCCreacion)
      .subscribe((datos) => {
        if (datos.estatus) {
          this.lanzarAlerta(AlertaTipo.edit, 'Insumo comprado');
          this.cargarInusmmosCotizados();
          this.cargarInsumosOrdenCompra();
        } else {
          Swal.fire({
            title: 'Error',
            text: datos.descripcion,
            icon: 'error',
          });
        }
      });
  }

  cargarInsumosOrdenCompra() {
    this._insumoXOrdenCompraService
      .ObtenXIdOrdenCompra(this.selectedEmpresa, this.idOrdenCompra)
      .subscribe((datos) => {
        this.insumosXordencompras = datos;
      });
  }

  OrdenCompraSeleccionada(idOrdenCompra: number) {
    this.insumosEstado = true;
    this.idOrdenCompra = idOrdenCompra;
    this.cargarInsumosOrdenCompra();
  }

  cerrarOrdenCompra() {
    this.insumosEstado = false;
    this.idOrdenCompra = 0;
  }

  verImpuestos(idInsumoOC: number) {}
}
