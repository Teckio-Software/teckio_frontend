import { Component, TemplateRef, ViewChild } from '@angular/core';
import { OrdenCompraService } from '../orden-compra/orden-compra.service';
import { SeguridadService } from 'src/app/seguridad/seguridad.service';
import {
  FacturaXOrdenCompraDTO,
  ordenCompraDTO,
  OrdenCompraFacturasDTO,
  OrdenesCompraXInsumoDTO,
} from '../orden-compra/tsOrdenCompra';
import { FacturaDetalleDTO } from 'src/app/facturacionTeckio/facturas';
import { MatDialog } from '@angular/material/dialog';
import { AlertaTipo } from 'src/app/utilidades/alert/alert.component';
import { proyectoDTO } from 'src/app/proyectos/proyecto/tsProyecto';
import { ProyectoService } from 'src/app/proyectos/proyecto/proyecto.service';
import { FormControl } from '@angular/forms';
import { map, Observable, startWith } from 'rxjs';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { InsumoDTO } from 'src/app/catalogos/insumo/tsInsumo';
import { tr } from 'date-fns/locale';

@Component({
  selector: 'app-resumen-ordenes-compra',
  templateUrl: './resumen-ordenes-compra.component.html',
  styleUrls: ['./resumen-ordenes-compra.component.css'],
})
export class ResumenOrdenesCompraComponent {
  @ViewChild('dialogNuevaFactura', { static: true })
  dialogCargaFactura!: TemplateRef<any>;
  proyectoControl = new FormControl('');
  filteredProyectos: Observable<proyectoDTO[]> = new Observable<
    proyectoDTO[]
  >();

  ordenCompraControl = new FormControl('');
  filteredOrdenes: Observable<ordenCompraDTO[]> = new Observable<
    ordenCompraDTO[]
  >();

  InsumoControl = new FormControl('');
  filteredInsumos: Observable<InsumoDTO[]> = new Observable<InsumoDTO[]>();

  selectedIndex: number = 0;

  alertaSuccess: boolean = false;
  alertaMessage: string = '';
  alertaTipo: AlertaTipo = AlertaTipo.none;
  AlertaTipo = AlertaTipo;

  selectedEmpresa: number = 0;
  selectedProyecto: number = 0;

  ordenescompras: ordenCompraDTO[] = [];
  ordenescomprasReset: ordenCompraDTO[] = [];
  proyectos!: proyectoDTO[];

  changeColor: any = null;
  insumosEstado: boolean = false;
  appRegarga: number = 1;
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
    nombreProyecto: '',
    importeTotal: 0
  };

  OrdenCompraSeleccionada: boolean = false;
  prueba = false;

  selectedEstatusInsumo: number = 0;
  selectedEstatusPagado: number = 0;
  idOrdenCompra: number = 0;
  archivosCargarFacturas: FileList | null = null;
  ordenCompraFacturas: OrdenCompraFacturasDTO = {
    idOrdenCompra: 0,
    montoTotalOrdenCompra: 0,
    montoTotalFactura: 0,
    facturasXOrdenCompra: [],
    estatusSaldado: 0,
  };
  detalleFacturaXOC: FacturaDetalleDTO[] = [];
  nombreProyecto: string = '';
  idProyectoFiltro: number = 0;

  insumosComprados: InsumoDTO[] = [];
  existenInsumosComprados: boolean = false;
  descripcionInsumo: string = '';
  idInsumoFiltro : number = 0;

  ordenesCommpraXInsumo : OrdenesCompraXInsumoDTO[] = [];
  importeTotalInsumosConFormato : string = "0.00";
  importeTotalInsumos : number = 0;

  isLoadingOC: boolean = true;
  isLoadingIC: boolean = false;


  constructor(
    private _ordenCompraService: OrdenCompraService,
    private _seguridadService: SeguridadService,
    private dialog: MatDialog,
    private proyectoService: ProyectoService
  ) {
    let IdEmpresa = _seguridadService.obtenIdEmpresaLocalStorage();
    this.selectedEmpresa = Number(IdEmpresa);
    let IdProyecto = _seguridadService.obtenerIdProyectoLocalStorage();
    this.selectedProyecto = Number(IdProyecto);
  }

  ngOnInit() {
    this.cargarOrdenesCompra();
    this.proyectoService.obtener(this.selectedEmpresa).subscribe((datos) => {
      this.proyectos = datos;
    });
  }

  yourFn(event: any) {
    this.selectedIndex = event.index;
    if(this.selectedIndex == 0){
      this.nombreProyecto = "";
      this.filtrarListaOrdenesCompra();
    }
    this.cargarInsumosComprados();
  }

  cargarOrdenesCompra() {
    this._ordenCompraService
      .ObtenTotdas(this.selectedEmpresa)
      .subscribe((datos) => {
        this.ordenescompras = datos;
        this.ordenescomprasReset = datos;
        this.filtrarListaOrdenesCompra();
        this.isLoadingOC = false;
      });
  }

  desplegarInformacion(oc: ordenCompraDTO) {
    oc.isExpanded = !oc.isExpanded;
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
    this.appRegarga = +1;
    this.prueba = true;
  }

  closeModal() {
    this.isOpenModal = false;
  }

  filtrarXEstatusInsumo(estatusInsumo: number) {
    this.selectedEstatusInsumo = estatusInsumo;

    if (this.selectedEstatusInsumo == 0) {
      if (this.selectedEstatusInsumo == this.selectedEstatusPagado) {
        this.ordenescompras = this.ordenescomprasReset;
      } else {
        this.ordenescompras = this.ordenescomprasReset.filter(
          (z) => z.estatusSaldado == this.selectedEstatusPagado
        );
      }
      this.filtrarListaOrdenesCompra();

      return;
    }

    if (this.selectedEstatusPagado == 0) {
      this.ordenescompras = this.ordenescomprasReset.filter(
        (z) => z.estatusInsumosSurtidos == this.selectedEstatusInsumo
      );
    } else {
      this.ordenescompras = this.ordenescomprasReset.filter(
        (z) =>
          z.estatusInsumosSurtidos == this.selectedEstatusInsumo &&
          z.estatusSaldado == this.selectedEstatusPagado
      );
    }
    this.filtrarListaOrdenesCompra();
  }

  filtrarXEstatusPagado(estatusPagado: number) {
    this.selectedEstatusPagado = estatusPagado;

    if (this.selectedEstatusPagado == 0) {
      if (this.selectedEstatusPagado == this.selectedEstatusInsumo) {
        this.ordenescompras = this.ordenescomprasReset;
      } else {
        this.ordenescompras = this.ordenescomprasReset.filter(
          (z) => z.estatusInsumosSurtidos == this.selectedEstatusInsumo
        );
      }
      this.filtrarListaOrdenesCompra();
      return;
    }

    if (this.selectedEstatusInsumo == 0) {
      this.ordenescompras = this.ordenescomprasReset.filter(
        (z) => z.estatusSaldado == this.selectedEstatusPagado
      );
    } else {
      this.ordenescompras = this.ordenescomprasReset.filter(
        (z) =>
          z.estatusInsumosSurtidos == this.selectedEstatusInsumo &&
          z.estatusSaldado == this.selectedEstatusPagado
      );
    }
    this.filtrarListaOrdenesCompra();
  }

  filtrarTabla(event: any) {
    let texto = event.target.value;

    this.filtrarListaOrdenesCompra();
  }

  filtrarListaOrdenesCompra() {
    this.filteredOrdenes = this.ordenCompraControl.valueChanges.pipe(
      startWith(this.nombreProyecto),
      map((value) => {
        const stringValue = typeof value === 'string' ? value : '';
        return this._filterOC(stringValue);
      })
    );
  }

  private _filter(value: string): proyectoDTO[] {
    const filterValue = this._normalizeValue(String(value));

    return this.proyectos.filter((proyecto) =>
      this._normalizeValue(proyecto.nombre).includes(filterValue)
    );
  }

  private _filterOC(value: string): ordenCompraDTO[] {
    const filterValue = this._normalizeValue(String(value));

    return this.ordenescompras.filter((oc) =>
      this._normalizeValue(oc.nombreProyecto).includes(filterValue)
    );
  }

  private _filterInsumo(value: string): InsumoDTO[] {
    const filterValue = this._normalizeValue(String(value));

    return this.insumosComprados.filter((insumo) =>
      this._normalizeValue(insumo.descripcion).includes(filterValue)
    );
  }

  private _normalizeValue(value: string): string {
    return value.toLowerCase().replace(/\s/g, '');
  }

  reiniciarFiltro() {
    this.filteredProyectos = this.proyectoControl.valueChanges.pipe(
      startWith(''),
      map((value) => {
        const stringValue = typeof value === 'string' ? value : '';
        return this._filter(stringValue);
      })
    );
  }

  selectionChangeProyecto(event: MatAutocompleteSelectedEvent) {
    const selectedProyecto = event.option.value;

    this.proyectoControl.setValue(selectedProyecto.nombre);
    const exixteProyecto = this.proyectos.filter(
      (e) => e.nombre === selectedProyecto.nombre
    );
    if (exixteProyecto.length > 0) {
      const idProyecto = selectedProyecto.id;
    }

    this.nombreProyecto = exixteProyecto[0].nombre;
    this.idProyectoFiltro = exixteProyecto[0].id;
    this.filtrarXEstatusInsumo(this.selectedEstatusInsumo);

    this.cargarInsumosComprados();
  }

  selectionChangeInsumo(event: MatAutocompleteSelectedEvent) {
    const selectedIsnumo = event.option.value;

    this.InsumoControl.setValue(selectedIsnumo.descripcion);
    const existeInsumo = this.insumosComprados.filter(
      (e) => e.descripcion === selectedIsnumo.descripcion
    );
    if (existeInsumo.length > 0) {
      const idInsumo = selectedIsnumo.id;
    }

    this.descripcionInsumo = existeInsumo[0].descripcion;
    this.idInsumoFiltro = existeInsumo[0].id;
    this.cargarOrdenesCompraXInsumo();
  }

  filtraInsumo(event: any) {
    let texto = event.target.value;

    this.filtrarListaInsumos();
  }

  filtrarListaInsumos() {
    this.filteredInsumos = this.InsumoControl.valueChanges.pipe(
      startWith(this.descripcionInsumo),
      map((value) => {
        const stringValue = typeof value === 'string' ? value : '';
        return this._filterInsumo(stringValue);
      })
    );
  }

  cargarInsumosComprados() {
    if (this.selectedIndex != 1) {
      return;
    }
    if (this.idProyectoFiltro <= 0) {
      this.idProyectoFiltro = this.selectedProyecto;
    }

    let proyectoSeleccionado = this.proyectos.filter(
      (z) => z.id == this.idProyectoFiltro
    );
    this.proyectoControl.setValue(proyectoSeleccionado[0].nombre);
    this.descripcionInsumo = "";
    this.ordenesCommpraXInsumo = [];
    this.importeTotalInsumosConFormato = "0.00";
    this.isLoadingOC = true;
    this._ordenCompraService
      .ObtenerInsumosComprados(this.selectedEmpresa, this.idProyectoFiltro)
      .subscribe((datos) => {
        this.insumosComprados = datos;
        this.existenInsumosComprados = false;
        if(this.insumosComprados.length > 0){
          this.existenInsumosComprados = true;
          this.filtrarListaInsumos();
        }
        this.isLoadingOC = false;
      });
  }

  cargarOrdenesCompraXInsumo() {
    this.isLoadingIC = true;
    this.ordenesCommpraXInsumo = [];
    this.importeTotalInsumosConFormato = "0.00";

    this._ordenCompraService
      .ObtenerOrdenesCompraXInsumo(this.selectedEmpresa, this.idInsumoFiltro)
      .subscribe((datos) => {
        this.ordenesCommpraXInsumo = datos;
        this.importeTotalInsumos = 0;
        this.ordenesCommpraXInsumo.forEach((element) => {
          this.importeTotalInsumos += element.importeConIva;
        });
        this.importeTotalInsumosConFormato = new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(this.importeTotalInsumos);
        this.isLoadingIC = false;
      });
  }

  nuevaFacturaOrdenCompra(IdOrdenCompra: number) {
    this.idOrdenCompra = IdOrdenCompra;

    this._ordenCompraService
      .ObtenerFacturasXOrdenCompra(this.selectedEmpresa, this.idOrdenCompra)
      .subscribe((datos) => {
        this.ordenCompraFacturas = datos;
      });

    this.dialog.open(this.dialogCargaFactura, {
      width: '10%',
      disableClose: true,
    });
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

  cargarFactura() {
    console.log('estos son los xmls', this.archivosCargarFacturas);
    if (this.archivosCargarFacturas) {
      this._ordenCompraService
        .cargarFacturasXOrdenCompra(
          this.archivosCargarFacturas,
          this.selectedEmpresa,
          this.idOrdenCompra
        )
        .subscribe((datos) => {
          if (datos.estatus) {
            this.alerta(AlertaTipo.save, datos.descripcion);
            this._ordenCompraService
              .ObtenerFacturasXOrdenCompra(
                this.selectedEmpresa,
                this.idOrdenCompra
              )
              .subscribe((datos) => {
                this.ordenCompraFacturas = datos;
              });
          } else {
            this.alerta(AlertaTipo.error, datos.descripcion);
          }
          this.limpiarCargarFactura();
        });
    } else {
      console.log('no hay facturas');
    }
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

  autorizarFactura(facturaOC: FacturaXOrdenCompraDTO) {
    this._ordenCompraService
      .AutorizarFacturaXOrdenCompra(this.selectedEmpresa, facturaOC)
      .subscribe((datos) => {
        if (datos.estatus) {
          this._ordenCompraService
            .ObtenerFacturasXOrdenCompra(
              this.selectedEmpresa,
              this.idOrdenCompra
            )
            .subscribe((datos) => {
              this.ordenCompraFacturas = datos;
            });
        }
      });
  }

  cancelarFactura(facturaOC: FacturaXOrdenCompraDTO) {
    this._ordenCompraService
      .CancelarFacturaXOrdenCompra(this.selectedEmpresa, facturaOC)
      .subscribe((datos) => {
        if (datos.estatus) {
          this._ordenCompraService
            .ObtenerFacturasXOrdenCompra(
              this.selectedEmpresa,
              this.idOrdenCompra
            )
            .subscribe((datos) => {
              this.ordenCompraFacturas = datos;
            });
        }
      });
  }
}
