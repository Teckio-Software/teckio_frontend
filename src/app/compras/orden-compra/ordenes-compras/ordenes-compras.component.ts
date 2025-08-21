import {
  Component,
  EventEmitter,
  Input,
  Output,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import {
  FacturaXOrdenCompraDTO,
  ordenCompraDTO,
  OrdenCompraFacturasDTO,
} from '../tsOrdenCompra';
import { OrdenCompraService } from '../orden-compra.service';
import { contratistaDTO } from 'src/app/catalogos/contratista/tsContratista';
import { MatDialog } from '@angular/material/dialog';
import { da } from 'date-fns/locale';
import { FacturaDetalleDTO } from 'src/app/facturacionTeckio/facturas';
import { AlertaTipo } from 'src/app/utilidades/alert/alert.component';

@Component({
  selector: 'app-ordenes-compras',
  templateUrl: './ordenes-compras.component.html',
  styleUrls: ['./ordenes-compras.component.css'],
})
export class OrdenesComprasComponent {
  @ViewChild('dialogNuevaFactura', { static: true })
  dialogCargaFactura!: TemplateRef<any>;

  ordenescompras: ordenCompraDTO[] = [];
  constructor(
    public _ordenCompraService: OrdenCompraService,
    private dialog: MatDialog
  ) { }

  archivosCargarFacturas: FileList | null = null;
  ordenCompraFacturas: OrdenCompraFacturasDTO = {
    idOrdenCompra: 0,
    montoTotalOrdenCompra: 0,
    montoTotalFactura: 0,
    facturasXOrdenCompra: [],
    estatusSaldado: 0
  };
  detalleFacturaXOC: FacturaDetalleDTO[] = [];

  @Input()
  idRequisicionInput: number = 0;
  @Input()
  idEmpresaInput: number = 0;
  @Input()
  idCotizacionInput: number = 0;
  @Output() valueChangeIOC = new EventEmitter();

  @Output() valueChangeEA = new EventEmitter();

  @Output() valueChangeTodosOC = new EventEmitter();

  alertaSuccess: boolean = false;
  alertaMessage: string = '';
  alertaTipo: AlertaTipo = AlertaTipo.none;
  AlertaTipo = AlertaTipo;

  todos: boolean = false;
  idOrdenCompra: number = 0;
  appRegarga: number = 1;
  OrdenCompraSeleccionada: boolean = false;
  changeColor: any = null;
  insumosEstado: boolean = false;
  isOpenModal: boolean = false;
  isOrdenCompra: ordenCompraDTO = {
    id: 0,
    idContratista: 0,
    razonSocial: '',
    montoTotal: 0,
    numeroPedido: 0,
    idCotizacion: 0,
    noCotizacion: 0,
    idRequisicion: 0,
    noRequisicion: 0,
    fechaPedido: new Date(),
    estatus: 0,
    solicito: '',
    elaboro: '',
    autorizo: '',
    chofer: '',
    observaciones: '',
    idProyecto: 0,
    nombre: '',
    noOrdenCompra: '',
    fechaRegistro: new Date(),
    estatusInsumosSurtidos: 0,
    estatusInsumosSurtidosDescripcion: '',
    isExpanded: false,
    estatusSaldado: 0,
    totalSaldado: 0,
    saldo: 0,
    montoAPagar: 0,
    esSeleccionado: false,
    nombreProyecto: ''
  };
  isContratista: contratistaDTO = {
    id: 0,
    razonSocial: '',
    rfc: '',
    esProveedorServicio: false,
    esProveedorMaterial: false,
    representanteLegal: '',
    telefono: '',
    email: '',
    domicilio: '',
    nExterior: '',
    colonia: '',
    municipio: '',
    codigoPostal: '',
    idCuentaContable: 0,
    idIvaAcreditableContable: 0,
    idIvaPorAcreditar: 0,
    idCuentaAnticipos: 0,
    idCuentaRetencionISR: 0,
    idCuentaRetencionIVA: 0,
    idEgresosIvaExento: 0,
    idEgresosIvaGravable: 0,
    idIvaAcreditableFiscal: 0,
  };

  ngOnInit() {
    if (this.idCotizacionInput > 0) {
      this.todos = true;
    }
    this.cargarRegistros();
  }

  cargarRegistros() {
    this.ordenescompras = [];
    if (this.idCotizacionInput <= 0) {
      if (this.idRequisicionInput > 0 && this.idEmpresaInput > 0) {
        this._ordenCompraService
          .ObtenXIdRequisicion(this.idEmpresaInput, this.idRequisicionInput)
          .subscribe((datos) => {
            this.ordenescompras = datos;
          });
      }
    } else {
      if (this.idRequisicionInput > 0 && this.idEmpresaInput > 0) {
        this._ordenCompraService
          .ObtenXIdCotizacion(this.idEmpresaInput, this.idCotizacionInput)
          .subscribe((datos) => {
            this.ordenescompras = datos;
          });
      }
    }
  }

  prueba = false;

  alerta(tipo: AlertaTipo, mensaje: string = '') {
    if (tipo === AlertaTipo.none) {
      this.cerrarAlerta();
      return;
    }

    this.alertaTipo = tipo;
    this.alertaMessage = mensaje || 'Ocurrió un error';
    this.alertaSuccess = true;

    setTimeout(() => {
      this.cerrarAlerta();
    }, 2500);
  }

  cerrarAlerta() {
    this.alertaSuccess = false;
    this.alertaTipo = AlertaTipo.none;
    this.alertaMessage = '';
  }

  showModal(ordenCompra: ordenCompraDTO) {
    this.isOpenModal = true;
    this.isOrdenCompra.id = ordenCompra.id;
    this.isOrdenCompra.noOrdenCompra = ordenCompra.noOrdenCompra;
    this.isOrdenCompra.fechaRegistro = ordenCompra.fechaRegistro;
    this.isOrdenCompra.fechaPedido = ordenCompra.fechaPedido;
    this.isOrdenCompra.estatus = ordenCompra.estatus;
    this.isOrdenCompra.estatusInsumosSurtidos =
      ordenCompra.estatusInsumosSurtidos;
    this.isOrdenCompra.elaboro = ordenCompra.elaboro;
    this.isOrdenCompra.autorizo = ordenCompra.autorizo;

    this.isOrdenCompra.idContratista = ordenCompra.idContratista;
    this.isOrdenCompra.observaciones = ordenCompra.observaciones;
    console.log('uibfiurfbo', this.isOrdenCompra.idContratista);
    this.appRegarga = +1;
    this.prueba = true;
  }

  closeModal() {
    this.isOpenModal = false;
  }

  desplegarInformacion(oc: ordenCompraDTO) {
    oc.isExpanded = !oc.isExpanded;
  }

  // VerInsumosXOrdenCompra(idOrdenCompra:number){
  //   this.valueChangeIOC.emit(idOrdenCompra);
  // }
  VerInsumosXOrdenCompra(idOrdenCompra: number) {
    this.changeColor = idOrdenCompra;
    this.idOrdenCompra = idOrdenCompra;
    this.appRegarga = this.appRegarga + 1;
    this.OrdenCompraSeleccionada = true;
    this.insumosEstado = true;
  }

  VerEntradasAlmacen(idOrdenCompra: number) {
    this.valueChangeEA.emit(idOrdenCompra);
  }

  cerrarInsumosPorOrden() {
    this.idOrdenCompra = 0;
    this.OrdenCompraSeleccionada = false;
    this.changeColor = null;
  }

  verTodos() {
    this.valueChangeTodosOC.emit(0);
  }

  nuevaFacturaOrdenCompra(IdOrdenCompra: number) {
    this.idOrdenCompra = IdOrdenCompra;

    this._ordenCompraService
      .ObtenerFacturasXOrdenCompra(this.idEmpresaInput, this.idOrdenCompra)
      .subscribe((datos) => {
        this.ordenCompraFacturas = datos;
      });

    this.dialog.open(this.dialogCargaFactura, {
      width: '10%',
      disableClose: true,
    });
  }

  facturaDetalleSelected(factura: FacturaXOrdenCompraDTO) {
    // Si ya está seleccionado, lo deseleccionamos (cerramos la tabla)
    if (this.detalleFacturaXOC === factura.detalleFactura) {
      this.detalleFacturaXOC = [];
    } else {
      // Si es otro o aún no hay ninguno seleccionado, lo mostramos
      this.detalleFacturaXOC = factura.detalleFactura;
    }
  }

  limpiarCargarFactura() {
    this.dialog.closeAll();
  }

  detenerCierre(event: MouseEvent) {
    event.stopPropagation();
  }

  onFileChangeFactura(event: any) {
    const files = (event.target as HTMLInputElement).files;
    this.archivosCargarFacturas = files;
  }
  cargarFactura() {
    console.log('estos son los xmls', this.archivosCargarFacturas);
    if (this.archivosCargarFacturas) {
      this._ordenCompraService
        .cargarFacturasXOrdenCompra(
          this.archivosCargarFacturas,
          this.idEmpresaInput,
          this.idOrdenCompra
        )
        .subscribe((datos) => {
          if (datos.estatus) {
            this.alerta(AlertaTipo.save, datos.descripcion);
          } else {
            this.alerta(AlertaTipo.error, datos.descripcion);
          }
          this.limpiarCargarFactura();
        });
    } else {
      console.log('no hay facturas');
    }
  }

  autorizarFactura(facturaOC: FacturaXOrdenCompraDTO) {
    this._ordenCompraService.AutorizarFacturaXOrdenCompra(this.idEmpresaInput, facturaOC).subscribe((datos) => {
      if (datos.estatus) {
        this._ordenCompraService
          .ObtenerFacturasXOrdenCompra(this.idEmpresaInput, this.idOrdenCompra)
          .subscribe((datos) => {
            this.ordenCompraFacturas = datos;
          });
      }
    });
  }

  cancelarFactura(facturaOC: FacturaXOrdenCompraDTO) {
    this._ordenCompraService.CancelarFacturaXOrdenCompra(this.idEmpresaInput, facturaOC).subscribe((datos) => {
      if (datos.estatus) {
        this._ordenCompraService
          .ObtenerFacturasXOrdenCompra(this.idEmpresaInput, this.idOrdenCompra)
          .subscribe((datos) => {
            this.ordenCompraFacturas = datos;
          });
      }
    });
  }
}
