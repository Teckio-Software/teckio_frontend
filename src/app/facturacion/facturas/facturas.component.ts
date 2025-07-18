import {Component,OnInit,AfterViewInit,ViewChild,ChangeDetectorRef,} from '@angular/core';

import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { DatePipe } from '@angular/common';
//import * as XLSX from 'xlsx';
import { FacturaService } from './factura.service';
import { UtilidadesService } from 'src/app/utilidades/utilidades.service';
import { SeguridadService } from 'src/app/seguridad/seguridad.service';
import { BuscarFacturasDTO, FacturaEstructuraDTO, Facturas } from './tsFacturas';

import * as XLSX from 'xlsx';
import { AcuseService } from '../acuses/acuse.service';

@Component({
  selector: 'app-facturas',
  templateUrl: './facturas.component.html',
  styleUrls: ['./facturas.component.css'],
})
export class FacturasComponent implements OnInit, AfterViewInit {
  colorFondo1: string = '';
  colorFondo2: string = '';
  colorFondo3: string = '';
  conCRP: boolean = false;
  sinCRP: boolean = true;
  itemsPerPage: number = 50;
  currentPage: number = 1;
  factura: Facturas = {
    id: 0,
    ordenCompra: '',
    uuid: '',
    fechaValidacion: new Date,
    fechaTimbrado: new Date,
    fechaEmision: new Date,
    rfcEmisor: '',
    rfcReceptor: '',
    subtotal: 0,
    total: 0,
    serieCfdi: '',
    folioCfdi: '',
    estatus: 0,
    tipo: 0,
    moneda: '',
    modalidad: 0,
    idArchivo: 0,
    metodoPago: '',
    formaPago: 0,
    descuento: 0,
    idArchivoPdf: 0,
    numeroDocumento: ''
  }
  facturaDetalle: FacturaEstructuraDTO = {
    idFactura: 0,
    serieCfdi: '',
    folioCfdi: '',
    numeroOrdenCompra: '',
    razonSocial: '',
    fechaTimbrado: new Date,
    fechaRegistro: new Date,
    totalIva: 0,
    subtotal: 0,
    impuestosLocales: 0,
    total: 0,
    estatusAnteriorCfdi: false,
    estatusActualCfdi: false,
    fechaRevalidacion: new Date,
    fechaComplementoPago: new Date,
    estatusRepse: 0,
    descuento: 0,
    totalIsr: 0
  }
  data = [];
  validaInicio!: Date;
  validaFin!: Date;
  selectedUuid: string = "";
  estatus!: string;
  tipo!: string;
  searchString!: string;
  organizacionSeleccionada!: number;
  archivosSeleccionados: FileList | null = null;
  facturas: Facturas[] = [];
  selectedEmpresa: number = 0;
  facturaFiltro: BuscarFacturasDTO = {
    serieCfdi: '',
    folioCfdi: '',
    uuid: '',
    buscaXFechaValidacion: false,
    fechaValidacion: new Date,
    buscaXFechaTimbrado: false,
    fechaTimbrado: new Date,
    buscaXFechaEmision: false,
    fechaEmision: new Date,
    estatus: 0,
    moneda: '',
    tipo: 0,
    numeroDocumento: '',
    idEntradaMaterial: 0
  };
  usuario: string = '';
  mostrarColumna2: boolean = false;
  columnasTabla: string[] = [];

  ocultarTabla: boolean = false;
  iconInfo: boolean = true;

  dataInicio: Facturas[] = [];
  dataListaMisfacturas = new MatTableDataSource(this.dataInicio);
  @ViewChild(MatPaginator) paginacionTabla!: MatPaginator;

  organizaciones: any[] = [];

  constructor(
    private dialog: MatDialog,
    private _misfacturasServicio: FacturaService,
    private _utilidadServicio: UtilidadesService,
    private datePipe: DatePipe,
    private _SeguridadServicio: SeguridadService,
    private _AcuseService: AcuseService,
    private cdr: ChangeDetectorRef
  ) {}

  onClick() {
    this.ocultarTabla = true;

    const fechaIFormateada = this.datePipe.transform(
      this.validaInicio,
      'dd/MM/yyyy'
    );
    const fechaFFormateada = this.datePipe.transform(
      this.validaFin,
      'dd/MM/yyyy'
    );

    this.ocultarTabla = true;
    this.iconInfo = false;
  }

  onFileChange(event: any) {
    const files = (event.target as HTMLInputElement).files;

    if (files) {
      this.archivosSeleccionados = files;

      this._misfacturasServicio
        .ValidaRFCEmisorExiste(this.archivosSeleccionados, this.usuario)
        .subscribe({
          next: (data) => {
            // Manejar la respuesta exitosa aquí
            if (data.status) {
              this.organizaciones = data.value.organizaciones;
              this.cdr.detectChanges(); // Forzar la detección de cambios
              // Hacer algo si la validación es exitosa
            } else {
              this._utilidadServicio.mostrarAlerta(data.msg, 'Oops!');
            }
          },
          error: (e) => {
            console.log(e); // Asegúrate de imprimir el error para obtener información sobre lo que salió mal.
          },
        });
    } else {
      console.error('No se han seleccionado archivos.');
    }
  }

  cambiarSemaforo() {
    this.conCRP = true;
    this.sinCRP = false;
  }

  cambiarColor() {
    this.colorFondo1 = '#C3CFDB';
  }

  cambiarColor1() {
    this.colorFondo2 = '#C3CFDB';
  }

  cambiarColor2() {
    this.colorFondo3 = '#C3CFDB';
  }

  regresarColor() {
    this.colorFondo1 = '';
    this.colorFondo2 = '';
    this.colorFondo3 = '';
  }

  
  onSelectChange(event: any) {
    this.organizacionSeleccionada = event.target.value;
  }

  onAceptarClick(event: any) {
    if (this.organizacionSeleccionada !== null && this.organizacionSeleccionada !== undefined) {
      if (this.archivosSeleccionados !== null && this.archivosSeleccionados !== undefined) {
        this._misfacturasServicio.ValidaUUIDExiste(this.archivosSeleccionados, this.organizacionSeleccionada, this.usuario)
          .subscribe({
            next: (data) => {
              // Manejar la respuesta exitosa aquí
              if (data.status) {
                // Hacer algo si la validación es exitosa
              } else {
                this._utilidadServicio.mostrarAlerta(data.msg, 'Oops!');
              }
            },
            error: (e) => {
              console.log(e); // Asegúrate de imprimir el error para obtener información sobre lo que salió mal.
            },
          });

      } else {
        this._utilidadServicio.mostrarAlerta('Ningún archivo seleccionado', 'Oops!');
      }
    } else {
      this._utilidadServicio.mostrarAlerta('Ninguna organización seleccionada', 'Oops!');
    }
  }


  ngOnInit(): void {
    let idEmpresa = this._SeguridadServicio.obtenIdEmpresaLocalStorage();
    this.selectedEmpresa = Number(idEmpresa);
    this._misfacturasServicio.obtenFacturas(this.selectedEmpresa, this.facturaFiltro)
    .subscribe((datos) => {
      this.facturas = datos;
      if (datos.length > 0) {
        this.ocultarTabla = true;
        this.iconInfo = false;
      }
    });
  }

  seleccionaFactura(factura: Facturas){
    this.factura = factura;
    this._misfacturasServicio.obtenFacturaDetalle(this.selectedEmpresa, factura.id)
    .subscribe((datos) => {
      this.facturaDetalle = datos;
    })
  }

  ngAfterViewInit(): void {
    this.dataListaMisfacturas.paginator = this.paginacionTabla;
  }

  ExportTOExcel() {
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(
      this.dataListaMisfacturas.filteredData
    );
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    /* save to file */
    XLSX.writeFile(wb, 'TablesSize.xlsx');
  }

  descargaXml(contentType: string){
    this._misfacturasServicio.obtenFacturaXml(this.selectedEmpresa, this.factura.id)
    .subscribe((datos: Blob) => {
      const blob = new Blob([datos], { type: contentType });
      const url = window.URL.createObjectURL(blob);
      const downloadLink = document.createElement('a');
      downloadLink.href = url;
      downloadLink.setAttribute('download', this.factura.rfcEmisor + '_' + this.factura.rfcReceptor + '_' + this.factura.uuid +  '.xml');
      document.body.appendChild(downloadLink);
      downloadLink.click();
    });
  }

  descargaAcusePdf(){
    this._AcuseService.obtenAcusePdf(this.selectedEmpresa, this.factura.id)
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

  descargaFacturaPdf(){
    this._misfacturasServicio.obtenFacturaPdf(this.selectedEmpresa, this.factura.id)
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

  get paginatedData(){
    const start = (this.currentPage - 1) * (this.itemsPerPage)
    const end = start + this.itemsPerPage;
    return this.facturas.slice(start, end);
  }

  changePage(page: number){
    this.currentPage = page;
  }
}
