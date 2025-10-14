import { Component, EventEmitter, Input, Output } from '@angular/core';
import { EstimacionesService } from '../../estimaciones/estimaciones.service';
import { ProyectoService } from '../../proyecto/proyecto.service';
import { SeguridadService } from 'src/app/seguridad/seguridad.service';
import { PeriodoEstimacionesDTO } from '../../estimaciones/tsEstimaciones';
import { ContratistaService } from 'src/app/catalogos/contratista/contratista.service';
import { contratistaDTO } from 'src/app/catalogos/contratista/tsContratista';
import { ContratoService } from '../../contratos/contratos.service';
import { ContratosDTO } from 'src/app/gastos/datos-empleado/tsDatos-empleado';
import { contratoDTO, parametrosParaBuscarContratos } from '../../contratos/tsContratos';
import { ReporteDestajoDTO } from '../reportesDestajo';
import { ReportesService } from '../reportes.service';
import { FormControl } from '@angular/forms';
import { map, Observable, startWith } from 'rxjs';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';

@Component({
  selector: 'app-destajo',
  templateUrl: './destajo.component.html',
  styleUrls: ['./destajo.component.css']
})
export class DestajoComponent {
  contratistaControl = new FormControl("")
  filteredcontratista: Observable<contratistaDTO[]> = new Observable<contratistaDTO[]>();

  @Output() total = new EventEmitter();
  @Input() esDestajo : boolean = false;

  selectedPeriodo : number = 0;
  selectedProyecto : number = 0;
  selectedEmpresa : number = 0;
  selectedContratista : number = 0;
  selectedContrato : number = 0;
  periodos!: PeriodoEstimacionesDTO[];
  contratistas : contratistaDTO[] = [];
  contratistaNombre = "";
  contratos : contratoDTO[] = [];
  esDestajoOContrato : boolean = false;
  destajos : ReporteDestajoDTO[] = [];
  totalDestajos : number = 0;
  totalConFormato : string = "0.00";

  parametroDestajos : ReporteDestajoDTO = {
    idPeriodoEstimacion: 0,
    idContratista: 0,
    idContrato: 0,
    idPrecioUnitario: 0,
    idProyecto: 0,
    descripcion: '',
    porcentajeEstimacion: 0,
    importe: 0,
    importeConFormato: '',
    porcentajeEstimacionConFormato: '',
    porcentajePago: 0,
    porcentajePagoConFormato: '',
    acumulado: 0,
    acumuladoConFormato: '',
    porcentajeDestajo: 0,
    porcentajeDestajoConFormato: '',
    importeDestajo: 0,
    importeDestajoConFormato: '',
    tipoContrato: false
  }




    /////////* PAGINATION */////////
    // paginatedProyectos: proyectoDTO[] = [];
    currentPage = 1;
    pageSize = 32; // Number of items per page
    totalItems = 0;
    pages: number[] = [];
    visiblePages: number[] = [];
    totalPages = 0;
    /////////* PAGINATION */////////


     /////////* PAGINATION */////////

     constructor(
      private estimacionesService: EstimacionesService,
      private proyectoService: ProyectoService,
      private _seguridadService: SeguridadService,
      private contratistaService: ContratistaService,
      private contratosService: ContratoService,
      private reportesDestajoService : ReportesService
     ){
      let idEmpresa = _seguridadService.obtenIdEmpresaLocalStorage();
      let idProyecto = _seguridadService.obtenerIdProyectoLocalStorage();
      this.selectedProyecto = Number(idProyecto);
      this.selectedEmpresa = Number(idEmpresa);

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


     ngOnInit(): void {
      this.total.emit(this.totalDestajos);

      this.cargarPeriodos();
      this.cargarcontratistas();
    }

    cargarPeriodos() {
      this.estimacionesService
        .obtenerPeriodos(this.selectedProyecto, this.selectedEmpresa)
        .subscribe((periodos) => {
          this.periodos = periodos;
        });
    }

    cargarcontratistas(){
      this.contratistaService.obtenerTodos(this.selectedEmpresa)
      .subscribe((contratistas) => {
        this.contratistas = contratistas;
        if(this.esDestajo){
          this.contratistas = contratistas.filter(z => z.esProveedorServicio == true);
        }else{
          this.contratistas = contratistas.filter(z => z.esProveedorMaterial == true && z.esProveedorServicio == true);
        }
        this.filteredcontratista = this.contratistaControl.valueChanges.pipe(
          startWith(''),
          map(value => {
            const stringValue = typeof value === 'string' ? value : '';
            return this._filter(stringValue);
          })
        );
      })
    }

    filtrarDestajo(){
      // console.log("este es el peridod", this.selectedEmpresa, this.selectedProyecto, this.selectedPeriodo);
      this.parametroDestajos.idPeriodoEstimacion = this.selectedPeriodo;
      this.parametroDestajos.idContratista = this.selectedContratista;
      this.parametroDestajos.idContrato = this.selectedContrato;
      this.parametroDestajos.idProyecto = this.selectedProyecto;
      this.parametroDestajos.tipoContrato = this.esDestajo;

      if(this.parametroDestajos.idPeriodoEstimacion == 0 || this.parametroDestajos.idContratista == 0){
        console.log("no hay seleccion");
      }else{
        this.reportesDestajoService.reporteDestajo(this.selectedEmpresa, this.parametroDestajos).subscribe((datos) => {
          this.destajos = datos;
          this.totalDestajos = 0;
          this.destajos.forEach((element) => {
            this.totalDestajos += element.importe;
          });
          this.totalConFormato = new Intl.NumberFormat('es-MX', { minimumFractionDigits: 2 }).format(this.totalDestajos);
        });
      }
    }

    onSelectionSeleccionContratista(event: Event) {
      const inputElement = event.target as HTMLInputElement;
      const selectedValue = inputElement.value;

      //  si uri quiere ver el proyecto seleccionado completo
      const selectedContratista = this.contratistas.find(z => z.razonSocial === selectedValue);
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
            this.contratos = contratos;
            if(this.esDestajo){
            this.contratos = this.contratos.filter(x => x.tipoContrato == true);
            }else{
              this.contratos = this.contratos.filter(x => x.tipoContrato == false);}
          })
      this.filtrarDestajo();

      }
    }

    onSelectionChangeSelect(event: Event): void {
      this.filtrarDestajo();
    }

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
    // this.paginatedProyectos = this.proyectos.slice(startIndex, endIndex);
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


  selectionChangeContratista(event: MatAutocompleteSelectedEvent){
    const selectedContratista = event.option.value;
    this.contratistaControl.setValue(selectedContratista.razonSocial)
    console.log(selectedContratista)
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
          this.contratos = contratos;
          if(this.esDestajo){
          this.contratos = this.contratos.filter(x => x.tipoContrato == true);
          }else{
            this.contratos = this.contratos.filter(x => x.tipoContrato == false);
          }
        })
    this.filtrarDestajo();

    }
  }

}
