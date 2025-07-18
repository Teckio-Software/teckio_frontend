import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ProyectoService } from '../../proyecto/proyecto.service';
import { SeguridadService } from 'src/app/seguridad/seguridad.service';
import { ContratistaService } from 'src/app/catalogos/contratista/contratista.service';
import { ContratoService } from '../../contratos/contratos.service';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { FormControl } from '@angular/forms';
import { contratoDTO, parametrosParaBuscarContratos } from '../../contratos/tsContratos';
import { map, Observable, startWith } from 'rxjs';
import { contratistaDTO } from 'src/app/catalogos/contratista/tsContratista';
import { ReportesService } from '../reportes.service';
import { PeriodoResumenDTO } from '../../estimaciones/tsEstimaciones';
import { ObjetoDestajoacumuladoDTO } from '../reportesDestajo';

@Component({
  selector: 'app-acumulado',
  templateUrl: './acumulado.component.html',
  styleUrls: ['./acumulado.component.css']
  
})


export class AcumuladoComponent {

  @Output() total = new EventEmitter();

  @Input() parametros : parametrosParaBuscarContratos = {
    idProyecto: 0,
    tipoContrato: false,
    idContratista: 0,
    idContrato: 0,
    fechaInicio: null,
    fechaFin: null
  }

  selectedProyecto : number = 0;
  selectedEmpresa : number = 0;

  contratistaControl = new FormControl("");
  filteredcontratista: Observable<contratistaDTO[]> = new Observable<contratistaDTO[]>();

  esDestajoOContrato : boolean = false;
  selectedContratista : number = 0;
  selectedContrato : number = 0;
  contratos : contratoDTO[] = [];
  contratistas : contratistaDTO[] = [];
  objetoAcumulado : ObjetoDestajoacumuladoDTO = {
    destajos: [],
    periodos: []
  };
  totalAcumulado : number = 0;

  constructor(
    private proyectoService: ProyectoService,
    private _seguridadService: SeguridadService,
    private contratistaService: ContratistaService,
    private contratosService: ContratoService,
    private destajoAcumulado : ReportesService
  ){
    let idEmpresa = _seguridadService.obtenIdEmpresaLocalStorage();
    let idProyecto = _seguridadService.obtenerIdProyectoLocalStorage();
    this.selectedProyecto = Number(idProyecto);
    this.selectedEmpresa = Number(idEmpresa);
  }

  ngOnInit(): void {
    this.cargarcontratistas();
    this.filtrarDestajo();
    this.cargarContratos();
  }
  cargarContratos(){
    this.contratosService.obtenerDestajos(this.parametros, this.selectedEmpresa)
        .subscribe((contratos) => {
          this.contratos = contratos
        })
  }

  cargarcontratistas(){
    this.contratistaService.obtenerTodos(this.selectedEmpresa)
    .subscribe((contratistas) => {
      this.contratistas = contratistas;
      const contratista = this.contratistas.filter(z => z.id == this.parametros.idContratista);

    if(contratista[0].esProveedorMaterial == true && contratista[0].esProveedorServicio == true){
      this.esDestajoOContrato = false;
    }else if(contratista[0].esProveedorServicio = true){
      this.esDestajoOContrato = true;
    }
    this.parametros.tipoContrato = this.esDestajoOContrato;
    })
  }

  private _filter(value: string): contratistaDTO[] {
    const filterValue = this._normalizeValue(String(value));


    return this.contratistas.filter(contratista => 
      this._normalizeValue(contratista.razonSocial).includes(filterValue)
    );
  }

  private _normalizeValue(value: string): string {
    return value.toLowerCase().replace(/\s/g, '');
  }

  selectionChangeContratista(event: MatAutocompleteSelectedEvent){
    const selectedContratista = event.option.value;
    this.contratistaControl.setValue(selectedContratista.razonSocial)
    if (selectedContratista) {
      if(selectedContratista.esProveedorMaterial == true && selectedContratista.esProveedorServicio == true){
        this.esDestajoOContrato = false;
      }else if(selectedContratista.esProveedorServicio = true){
        this.esDestajoOContrato = true;
      }
      this.selectedContratista = selectedContratista.id;
      let parametros: parametrosParaBuscarContratos = {
        idProyecto: this.selectedProyecto,
        tipoContrato: this.esDestajoOContrato,
        idContratista: this.selectedContratista,
        idContrato: 0,
        fechaInicio: null,
        fechaFin: null
      }
      this.contratosService.obtenerDestajos(parametros, this.selectedEmpresa)
        .subscribe((contratos) => {
          this.contratos = contratos
        })
    this.filtrarDestajo();

    }
  }

  onSelectionChangeSelect(event: Event): void {
    this.filtrarDestajo();
  }

  filtrarDestajo(){
    this.parametros.idContrato = this.selectedContrato;
    this.destajoAcumulado.destajoAcumulado(this.selectedEmpresa, this.parametros).subscribe((destajos) => {
      this.objetoAcumulado = destajos;
      this.objetoAcumulado.destajos.forEach((element) =>{
        this.totalAcumulado += element.importe;
      });
      this.total.emit(this.totalAcumulado);
    });
  }
}
