import { Component, OnDestroy, OnInit } from '@angular/core';
import { Chart, ChartType } from 'chart.js/auto';
import { SeguridadService } from 'src/app/seguridad/seguridad.service';
import { GraficasService } from '../graficas.service';
import { graficaDTO, graficaDetalleDTO } from '../tsGrafica';
// import { Chart } from 'chart.js/dist';

@Component({
  selector: 'app-graficas',
  templateUrl: './graficas.component.html',
  styleUrls: ['./graficas.component.css']
})
export class GraficasComponent implements OnInit {
  selectedEmpresa: number = 0;
  graficaProveedores: graficaDTO = {
    label: '',
    detalle: []
  };
  labels: string[] = [];
  datos: number[] = [];
  graficaDivisiones: graficaDTO = {
    label: '',
    detalle: []
  };
  labelsDivision: string[] = [];
  datosDivision: number[] = [];
  graficaPeriodo: graficaDTO = {
    label: '',
    detalle: []
  };
  labelsPeriodo: string[] = [];
  datosPeriodo: number[] = [];
  constructor(
    private _SeguridadEmpresa: SeguridadService
    , private _GraficasService: GraficasService
  ){
    let idEmpresa = _SeguridadEmpresa.obtenIdEmpresaLocalStorage();
    this.selectedEmpresa = Number(idEmpresa);
  }
  // ngOnDestroy(): void {
  //   // this.chartOrdenCompraProveedor.destroy();
  //   // this.chartOrdenCompraPeriodo.destroy();
  //   // this.chartOrdenCompraDivision.destroy();
  // }
  public chartOrdenCompraProveedor!: Chart;
  public chartOrdenCompraDivision!: Chart;
  public chartOrdenCompraPeriodo!: Chart;
  public chart: any;
  ngOnInit(): void {
    this.cargaGraficas();
  }

  cargaGraficas(){
    this._GraficasService.obtenerGraficaProveedores(this.selectedEmpresa)
    .subscribe((datos) => {
      this.graficaProveedores = datos;
      this.labels = [];
      this.datos = [];
      let chartExistProveedor = Chart.getChart("chartOrdenCompraProveedor");
      if (typeof chartExistProveedor !== 'undefined') {
        this.chartOrdenCompraProveedor.destroy();
      }
      const data = {
        labels: this.labels,
        datasets: [{
          label: 'Total de $ por proveedor',
          data: this.datos,
          fill: true,
          borderColor: 'rgb(75, 192, 192)',
          backgroundColor: 'rgb(75, 192, 192)',
          tension: 0.1
        }]
      };
      this.chartOrdenCompraProveedor = new Chart("chartOrdenCompraProveedor", {
        type: 'bar' as ChartType,
        data: data
      });
      this.graficaProveedores.detalle.forEach(element => {
        this.labels.push(element.labels);
        this.datos.push(element.data);
      });
      this.chartOrdenCompraProveedor.update();
    });
    this._GraficasService.obtenerGraficaTotalesDivision(this.selectedEmpresa)
    .subscribe((datos) => {
      this.graficaDivisiones = datos;
      this.labelsDivision = [];
      this.datosDivision = [];
      let chartExistDivision = Chart.getChart("chartOrdenCompraDivision");
      if (typeof chartExistDivision !== 'undefined') {
        this.chartOrdenCompraDivision.destroy();
      }
      const dataDivision = {
        labels: this.labelsDivision,
        datasets: [{
          label: 'Total de dinero por división',
          data: this.datosDivision,
          fill: true,
          borderColor: 'rgb(75, 192, 192)',
          backgroundColor: 'rgb(75, 192, 192)',
          tension: 0.1
        }]
      };
      this.chartOrdenCompraDivision = new Chart("chartOrdenCompraDivision", {
        type: 'bar' as ChartType,
        data: dataDivision
      });
      this.graficaDivisiones.detalle.forEach(element => {
        this.labelsDivision.push(element.labels);
        this.datosDivision.push(element.data);
      });
      this.chartOrdenCompraDivision.update();
    });
    this._GraficasService.obtenerGraficaTotalesPeriodo(this.selectedEmpresa)
    .subscribe((datos) => {
      this.graficaPeriodo = datos;
      this.labelsPeriodo = [];
      this.datosPeriodo = [];
      let chartExistPeriodo = Chart.getChart("chartOrdenCompraPeriodo");
      if (typeof chartExistPeriodo !== 'undefined') {
        this.chartOrdenCompraPeriodo.destroy();
      }
      const dataPeriodo = {
        labels: this.labelsPeriodo,
        datasets: [{
          label: 'Total de dinero por mes',
          data: this.datosPeriodo,
          fill: true,
          borderColor: 'rgb(75, 192, 192)',
          backgroundColor: 'rgb(75, 192, 192)',
          tension: 0.1
        }]
      };
      this.chartOrdenCompraPeriodo = new Chart("chartOrdenCompraPeriodo", {
        type: 'bar' as ChartType,
        data: dataPeriodo
      });
      this.graficaPeriodo.detalle.forEach(element => {
        this.labelsPeriodo.push(element.labels);
        this.datosPeriodo.push(element.data);
      });
      this.chartOrdenCompraPeriodo.update();
    });
  }
}
