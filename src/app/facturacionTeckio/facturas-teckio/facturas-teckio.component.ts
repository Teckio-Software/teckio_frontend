import { Component, TemplateRef, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { FacturasServiceService } from '../facturas-service.service';
import { SeguridadService } from 'src/app/seguridad/seguridad.service';
import { FacturaDTO, FacturasTeckioDTO, FacturaTeckioDetallesDTO } from '../facturas';
import { formatDate } from '@angular/common';

@Component({
  selector: 'app-facturas-teckio',
  templateUrl: './facturas-teckio.component.html',
  styleUrls: ['./facturas-teckio.component.css']
})
export class FacturasTeckioComponent {

  @ViewChild('dialogNuevaFactura', { static: true }) dialogCargaFactura!: TemplateRef<any>;

  archivosCargarFacturas: FileList | null = null;
  selectedEmpresa: number = 0;
  appRecarga : number = 0;
  isTableDetalles : boolean = false;
  isTableComplemento : boolean = false;
  idFactura : number = 0;

  facturas !: FacturaDTO[];
  facturasRespaldo !: FacturaDTO[];
  factura : FacturaDTO = {
    uuid: '',
    fechaValidacion: new Date,
    fechaTimbrado: new Date,
    fechaEmision: new Date,
    rfcEmisor: '',
    subtotal: 0,
    total: 0,
    serieCfdi: '',
    folioCfdi: '',
    estatus: 0,
    tipo: 0,
    modalidad: 0,
    idArchivo: 0,
    metodoPago: '',
    descuento: 0,
    idArchivoPdf: 0,
    estatusEnviadoCentroCostos: 0,
    versionFactura: '',
    codigoPostal: '',
    tipoCambio: 0,
    formaPago: '',
    moneda: '',
    rfcReceptor: '',
    idCliente: 0,
    idFormaPago: 0,
    idRegimenFiscalSat: 0,
    idUsoCfdi: 0,
    idMonedaSat: 0,
    razonSocialCliente: '',
    regimenFiscal: '',
    usoCfdi: '',
    monedaSat: '',
    id: 0
  };
  detalleFactura : FacturaTeckioDetallesDTO = {
    totalIVA: 0,
    totalISR: 0,
    impuestosLocales: 0,
    razonSocial: '',
    complementosPagos: []
  };
  existenFacturas: boolean = false;

  fechafiltro !: Date;
  estatusFactura: number = 0;
    /////////* PAGINATION */////////
    paginatedFacturas: FacturaDTO[] = [];
    currentPage = 1;
    pageSize = 32; // Number of items per page
    totalItems = 0;
    pages: number[] = [];
    visiblePages: number[] = [];
    totalPages = 0;
    /////////* PAGINATION */////////

  constructor(
    private dialog: MatDialog,
    private _fcaturasService: FacturasServiceService,
    private _SeguridadEmpresa: SeguridadService
  ) {
    let idEmpresa = _SeguridadEmpresa.obtenIdEmpresaLocalStorage();
    this.selectedEmpresa = Number(idEmpresa);
  }

  ngOnInit(): void {
    
    this._fcaturasService.ObtenFacturas(this.selectedEmpresa).subscribe((datos) => {
      if (datos.length > 0) {
        this.facturas = datos;
        this.facturasRespaldo = datos;
        this.existenFacturas = true;
        this.totalItems = datos.length;
        this.updatePagination();
        this.updatePaginatedData();
      }
    });
  }
  descargarConceptos(){
    this._fcaturasService.ObtenProductos(this.selectedEmpresa).subscribe((datos) =>{
      console.log(datos);
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

  nuevaValidacion() {
    this.dialog.open(this.dialogCargaFactura, {
      width: '10%',
      disableClose: true
    });
  }

  cargarFactura() {
    if (this.archivosCargarFacturas) {
      this._fcaturasService.CargaFactura(this.archivosCargarFacturas, this.selectedEmpresa).subscribe((datos) => {
        if (datos.estatus) {
          console.log(datos.descripcion);
        } else {
          console.log("Error", datos.descripcion)
        }
      });
    } else {
      console.log("no hay facturas");
    }
  }

  verDetalles(factura : FacturaDTO){
    this.idFactura = factura.id;
    if(factura.tipo == 1){
      console.log("Ingreso");
      this.appRecarga =+ 1;

      this.isTableDetalles = true;
      this.isTableComplemento = false;
    }
    if(factura.tipo == 5){
      console.log("Pago");
      this.appRecarga =+ 1;
      
      this.isTableDetalles = false;
      this.isTableComplemento = true;
    }
    console.log("cambiandoIDFActura", this.idFactura);
    
  }

  detallesFactura(factura: FacturaDTO) {
    this.factura = factura;
    console.log("Esto es la factura", this.factura);
    this._fcaturasService.ObtenDetalleFactura(this.selectedEmpresa, factura.id).subscribe((datos) => {
      this.detalleFactura = datos;
      console.log("detalle de factura ", this.detalleFactura);
    });
  }

  descargaXml(contentType: string) {
    this._fcaturasService.obtenFacturaXml(this.selectedEmpresa, this.factura.id)
      .subscribe((datos: Blob) => {
        const blob = new Blob([datos], { type: contentType });
        const url = window.URL.createObjectURL(blob);
        const downloadLink = document.createElement('a');
        downloadLink.href = url;
        downloadLink.setAttribute('download', this.factura.rfcEmisor + '_' + this.factura.rfcReceptor + '_' + this.factura.uuid + '.xml');
        document.body.appendChild(downloadLink);
        downloadLink.click();
      });
  }

  descargaFacturaPdf() {
    this._fcaturasService.obtenFacturaPdf(this.selectedEmpresa, this.factura.id)
      .subscribe((datos: Blob) => {
        const blob = new Blob([datos], { type: 'pdf' });
        const url = window.URL.createObjectURL(blob);
        const downloadLink = document.createElement('a');
        downloadLink.href = url;
        downloadLink.setAttribute('download', this.factura.rfcEmisor + '_' + this.factura.rfcReceptor + '_' + this.factura.uuid + '.pdf');
        document.body.appendChild(downloadLink);
        downloadLink.click();
      });
  }

  descargaAcusePdf() {
    this._fcaturasService.obtenAcusePdf(this.selectedEmpresa, this.factura.id)
      .subscribe((datos: Blob) => {
        const blob = new Blob([datos], { type: 'pdf' });
        const url = window.URL.createObjectURL(blob);
        const downloadLink = document.createElement('a');
        downloadLink.href = url;
        downloadLink.setAttribute('download', this.factura.uuid + '.pdf');
        document.body.appendChild(downloadLink);
        downloadLink.click();
      });
  }

  fitrarFacturas() {
    console.log("este es el valor del estatus", this.estatusFactura);
    this.paginatedFacturas = this.facturasRespaldo;

    if(this.estatusFactura == 0){
      if(this.fechafiltro == undefined){
        return;
      }else{
        var facturasFiltro = this.facturas.filter(z => formatDate(z.fechaValidacion, 'yyyy-MM-dd', 'en_US') == formatDate(this.fechafiltro, 'yyyy-MM-dd', 'en_US'));
        if(facturasFiltro.length <= 0){
          this.paginatedFacturas = [];
          return;
        }else{
          this.paginatedFacturas = facturasFiltro;
        }
      }
    }else{
      var facturasFiltro = this.paginatedFacturas.filter(z => z.estatus == this.estatusFactura);
      this.paginatedFacturas = facturasFiltro;
      if(facturasFiltro.length <= 0){
        this.paginatedFacturas = [];
        return;
      }else{
        if(this.fechafiltro != undefined){
          var facturasFiltrofecha = facturasFiltro.filter(z => formatDate(z.fechaValidacion, 'yyyy-MM-dd', 'en_US') == formatDate(this.fechafiltro, 'yyyy-MM-dd', 'en_US'));
          if(facturasFiltrofecha.length <= 0){
            this.paginatedFacturas = [];
          }else{
            this.paginatedFacturas = facturasFiltrofecha;
          }
        }
      }
    }

  }


    /////////* PAGINATION */////////

    updatePagination() {
      this.totalPages = Math.ceil(this.totalItems / this.pageSize);
      this.pages = Array.from({ length: this.totalPages }, (_, i) => i + 1);
      this.updateVisiblePages();
    }
  
    updateVisiblePages() {
      const startPage = Math.max(1, this.currentPage - 2);
      const endPage = Math.min(this.totalPages, startPage + 4);
  
      this.visiblePages = Array.from(
        { length: endPage - startPage + 1 },
        (_, i) => startPage + i
      );
  
      if (this.totalPages < 5) {
        this.visiblePages = this.pages;
      }
    }
  
    updatePaginatedData() {
      const startIndex = (this.currentPage - 1) * this.pageSize;
      const endIndex = startIndex + this.pageSize;
      this.paginatedFacturas = this.facturas.slice(startIndex, endIndex);
    }
  
    previousPage() {
      if (this.currentPage > 1) {
        this.currentPage--;
        this.updatePaginatedData();
        this.updateVisiblePages();
      }
    }
  
    nextPage() {
      if (this.currentPage < this.totalPages) {
        this.currentPage++;
        this.updatePaginatedData();
        this.updateVisiblePages();
      }
    }
  
    goToPage(page: number) {
      if (page >= 1 && page <= this.totalPages) {
        this.currentPage = page;
        this.updatePaginatedData();
        this.updateVisiblePages();
      }
    }
  
    getPaginationInfo() {
      return `Página ${this.currentPage} de ${this.totalPages}`;
    }
    ///////////* PAGINATION */////////





}
