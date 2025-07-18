import { Component, EventEmitter, Output } from '@angular/core';
import { ProyectoService } from '../../proyecto/proyecto.service';
import { SeguridadService } from 'src/app/seguridad/seguridad.service';
import { ReportesService } from '../reportes.service';
import { parametrosParaBuscarContratos } from '../../contratos/tsContratos';
import { ObjetoDestajoTotalDTO } from '../reportesDestajo';
import { FormControl, FormGroup } from '@angular/forms';
import { formatDate } from '@angular/common';

@Component({
  selector: 'app-total-destajo',
  templateUrl: './total-destajo.component.html',
  styleUrls: ['./total-destajo.component.css']
})
export class TotalDestajoComponent {

  @Output() total = new EventEmitter();

  changeColor: any = null;

  selectedProyecto: number = 0;
  selectedEmpresa: number = 0;
  totalDestajos: number = 0;
  totalConFormato : string = "0.00";
  appRecarga: number = 0;
  selectedContratista: number = 0;
  contratistaSeleccionado: boolean = false;
  parametrosConceptos: parametrosParaBuscarContratos = {
    idProyecto: 0,
    tipoContrato: false,
    idContratista: 0,
    idContrato: 0,
    fechaInicio: null,
    fechaFin: null
  }

  objetoDestajoTotal: ObjetoDestajoTotalDTO = {
    contratistas: [],
    periodos: []
  }

  range = new FormGroup({
    start: new FormControl,
    end: new FormControl,
  });

  fechaInicio !: string;
  fechaFin !: string;

  constructor(
    private proyectoService: ProyectoService,
    private _seguridadService: SeguridadService,
    private destajoTotal: ReportesService
  ) {
    let idEmpresa = _seguridadService.obtenIdEmpresaLocalStorage();
    let idProyecto = _seguridadService.obtenerIdProyectoLocalStorage();
    this.selectedProyecto = Number(idProyecto);
    this.selectedEmpresa = Number(idEmpresa);
  }

  ngOnInit(): void {
    let perametros: parametrosParaBuscarContratos = {
      idProyecto: this.selectedProyecto,
      tipoContrato: false,
      idContratista: 0,
      idContrato: 0,
      fechaInicio: null,
      fechaFin: null
    }

    this.cargarDestajistas(perametros);
  }

  cargarDestajistas(parametros : parametrosParaBuscarContratos){
    this.totalDestajos = 0;
    this.destajoTotal.DestajoTotal(this.selectedEmpresa, parametros).subscribe((datos) => {
      this.objetoDestajoTotal = datos;
      this.objetoDestajoTotal.contratistas.forEach((element) => {
        this.totalDestajos += element.importe;
      });
      this.totalConFormato = new Intl.NumberFormat('es-MX', { minimumFractionDigits: 2 }).format(this.totalDestajos);
    });
  }

  verConceptos(idContratista: number) {
    this.changeColor = idContratista;
    this.contratistaSeleccionado = true;
    this.appRecarga += 1;
    this.parametrosConceptos.idProyecto = this.selectedProyecto;
    this.parametrosConceptos.idContratista = idContratista;
    if ((typeof this.range.get("start")?.value != 'undefined' && this.range.get("start")?.value != null) && (typeof this.range.get("end")?.value != 'undefined' && this.range.get("end")?.value != null)) {
      this.parametrosConceptos.fechaFin = this.fechaFin;
      this.parametrosConceptos.fechaInicio = this.fechaInicio;
    } else {
      this.parametrosConceptos.fechaFin = null;
      this.parametrosConceptos.fechaInicio = null;
    }
  }

  clickButtonFiltro() {
    if ((typeof this.range.get("start")?.value != 'undefined' && this.range.get("start")?.value != null) && (typeof this.range.get("end")?.value != 'undefined' && this.range.get("end")?.value != null)) {
      this.fechaInicio = formatDate(this.range.get("start")?.value, 'yyyy-MM-dd', 'en_US');
      this.fechaFin = formatDate(this.range.get("end")?.value, 'yyyy-MM-dd', 'en_US');
      let perametros: parametrosParaBuscarContratos = {
        idProyecto: this.selectedProyecto,
        tipoContrato: false,
        idContratista: 0,
        idContrato: 0,
        fechaInicio: this.fechaInicio,
        fechaFin: this.fechaFin
      }
      this.cargarDestajistas(perametros);

    } else {
      let perametros: parametrosParaBuscarContratos = {
        idProyecto: this.selectedProyecto,
        tipoContrato: false,
        idContratista: 0,
        idContrato: 0,
        fechaInicio: null,
        fechaFin: null
      }
      this.cargarDestajistas(perametros);
    }
    if (this.contratistaSeleccionado) {
      this.verConceptos(this.changeColor);
    }
  }

  limpiarFiltro() {
    this.range.reset();
    this.clickButtonFiltro();
  }

}
