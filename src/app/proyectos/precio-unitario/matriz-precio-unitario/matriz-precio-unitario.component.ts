import { PrecioUnitarioDetalleService } from './../../precio-unitario-detalle/precio-unitario-detalle.service';
import { Component, Input, OnInit } from '@angular/core';
import { PrecioUnitarioService } from '../precio-unitario.service';
import { SeguridadService } from 'src/app/seguridad/seguridad.service';
import { Unidades } from '../unidades';
import { precioUnitarioDetalleDTO } from '../../precio-unitario-detalle/tsPrecioUnitarioDetalle';

@Component({
  selector: 'app-matriz-precio-unitario',
  templateUrl: './matriz-precio-unitario.component.html',
  styleUrls: ['./matriz-precio-unitario.component.css']
})
export class MatrizPrecioUnitarioComponent implements OnInit {
  @Input() selectedPU!: number;
  selectedProyecto: number = 0;
  selectedEmpresa: number = 0;
  Unidades: string[] = [];
  detalles!: precioUnitarioDetalleDTO[];
  detallesReset!: precioUnitarioDetalleDTO[];


  constructor (
      private precioUnitarioService: PrecioUnitarioService
      , private _seguridadEmpresa: SeguridadService
      , private unidades: Unidades
      , private precioUnitarioDetalleService: PrecioUnitarioDetalleService
    ){
      let idEmpresa = _seguridadEmpresa.obtenIdEmpresaLocalStorage();
      let idProyecto = _seguridadEmpresa.obtenerIdProyectoLocalStorage();
      this.selectedProyecto = Number(idProyecto);
      this.selectedEmpresa = Number(idEmpresa);
      this.Unidades = this.unidades.Getunidades();
    }

  ngOnInit(): void {
    this.cargarDetallesXIdPrecioUnitario();
  }

  cargarDetallesXIdPrecioUnitario() {
      // this.selectedGenerador = -1;
      let detalleVacio: precioUnitarioDetalleDTO = {
        id: 0,
        idPrecioUnitario: 0,
        idInsumo: 0,
        esCompuesto: false,
        costoUnitario: 0,
        costoUnitarioConFormato: '',
        costoUnitarioEditado: false,
        cantidad: 0,
        cantidadConFormato: '',
        cantidadEditado: false,
        cantidadExcedente: 0,
        idPrecioUnitarioDetallePerteneciente: 0,
        codigo: '',
        descripcion: '',
        unidad: '',
        idTipoInsumo: 0,
        idFamiliaInsumo: 0,
        importe: 0,
        importeConFormato: '',
        costoBase: 0,
        costoBaseConFormato: '',
        esAutorizado: false,
      };
      if (this.selectedPU > 0) {
        // this.displayCarga = 'flex';
          // if (
          //   PrecioUnitario.unidad.toLowerCase() == 'm' ||
          //   PrecioUnitario.unidad.toLowerCase() == 'ml'
          // ) {
          //   this.esM = true;
          // } else {
          //   this.esM = false;
          // }
          // if (PrecioUnitario.unidad.toLowerCase() == 'm2') {
          //   this.esM2 = true;
          // } else {
          //   this.esM2 = false;
          // }
          // if (PrecioUnitario.unidad.toLowerCase() == 'm3') {
          //   this.esM3 = true;
          // } else {
          //   this.esM3 = false;
          // }
          // if (PrecioUnitario.unidad.toLowerCase() == 'kg') {
          //   this.esKg = true;
          // } else {
          //   this.esKg = false;
          // }
          // if (PrecioUnitario.unidad.toLowerCase() == 'ton') {
          //   this.esTon = true;
          // } else {
          //   this.esTon = false;
          // }
          // if (PrecioUnitario.unidad.toLowerCase() == 'pza') {
          //   this.esPza = true;
          // } else {
          //   this.esPza = false;
          // }
          // this.cargarGeneradores(PrecioUnitario.id);
          // this.desglosados.push({
          //   id: 0,
          //   idPrecioUnitario: PrecioUnitario.id,
          //   codigo: PrecioUnitario.codigo,
          //   descripcion: PrecioUnitario.descripcion,
          //   idDetallePerteneciente: 0,
          //   unidad: PrecioUnitario.unidad,
          //   costo: PrecioUnitario.costoUnitario,
          //   cantidad: PrecioUnitario.cantidad,
          //   cantidadConFormato: new Intl.NumberFormat('es-MX', {
          //     minimumFractionDigits: 4,
          //   }).format(PrecioUnitario.cantidad),
          //   costoConFormato: new Intl.NumberFormat('es-MX', {
          //     style: 'currency',
          //     currency: 'MXN',
          //   }).format(PrecioUnitario.costoUnitario),
          // });
            this.precioUnitarioDetalleService
              .obtenerTodos(this.selectedPU, this.selectedEmpresa)
              .subscribe((detalles) => {
                this.detalles = detalles;

                this.detalles.forEach((element) => {
                  element.cantidadConFormato = new Intl.NumberFormat('es-MX', {
                    minimumFractionDigits: 4,
                  }).format(element.cantidad);
                });
                this.detallesReset = detalles;
                this.detalles.push({
                  id: 0,
                  idPrecioUnitario: 0,
                  idInsumo: 0,
                  esCompuesto: false,
                  costoUnitario: 0,
                  cantidad: 0,
                  cantidadExcedente: 0,
                  idPrecioUnitarioDetallePerteneciente: 0,
                  codigo: '',
                  descripcion: '',
                  unidad: '',
                  idTipoInsumo: 0,
                  idFamiliaInsumo: 0,
                  importe: 0,
                  costoUnitarioConFormato: '0.00',
                  cantidadConFormato: '0.00',
                  importeConFormato: '$0.00',
                  costoUnitarioEditado: false,
                  cantidadEditado: false,
                  costoBase: 0,
                  costoBaseConFormato: '$0.00',
                  esAutorizado: false,
                });
                // this.displayCarga = 'none';
              });
      }
      // this.precioUnitarioSeleccionado = PrecioUnitario;
    }
}
