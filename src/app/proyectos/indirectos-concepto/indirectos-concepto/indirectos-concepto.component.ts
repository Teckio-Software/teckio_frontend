import { Component, Inject, TemplateRef, ViewChild, HostListener } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { IndirectosComponent } from '../../indirectos/indirectos/indirectos.component';
import { SeguridadService } from 'src/app/seguridad/seguridad.service';
import { precioUnitarioDTO } from '../../precio-unitario/tsPrecioUnitario';
import { PrecioUnitarioService } from '../../precio-unitario/precio-unitario.service';
import { IndirectosXConceptoDTO } from '../Indirectos-concepto';
import { IndirectosConceptoService } from '../indirectos-concepto.service';
import { elementAt } from 'rxjs';
import { EstimacionesService } from '../../estimaciones/estimaciones.service';

@Component({
  selector: 'app-indirectos-concepto',
  templateUrl: './indirectos-concepto.component.html',
  styleUrls: ['./indirectos-concepto.component.css']
})
export class IndirectosConceptoComponent {
  @ViewChild('dialogIndirectosConcepto', { static: true })
  dialogIndirectosConcepto!: TemplateRef<any>;

  openDropdownId: number | null = null;

  selectedProyecto: number = 0;
  selectedEmpresa: number = 0;
  PU: precioUnitarioDTO = {
    hijos: [],
    id: 0,
    idProyecto: 0,
    cantidad: 0,
    cantidadConFormato: '',
    cantidadEditado: false,
    cantidadExcedente: 0,
    cantidadExcedenteConFormato: '',
    tipoPrecioUnitario: 0,
    costoUnitario: 0,
    porcentajeIndirecto: 0,
    costoUnitarioConFormato: '',
    costoUnitarioEditado: false,
    nivel: 0,
    noSerie: 0,
    idPrecioUnitarioBase: 0,
    esDetalle: false,
    idConcepto: 0,
    codigo: '',
    descripcion: '',
    unidad: '',
    precioUnitario: 0,
    precioUnitarioConFormato: '',
    precioUnitarioEditado: false,
    importe: 0,
    importeConFormato: '',
    importeSeries: 0,
    importeSeriesConFormato: '',
    expandido: false,
    porcentajeIndirectoConFormato: '',
    posicion: 0,
    codigoPadre: '',
    esCatalogoGeneral: false
  }

  PUEditando: boolean = false;
  indirectos: IndirectosXConceptoDTO[] = [];
  indirectoPadre: IndirectosXConceptoDTO = {
    hijos: [],
    id: 0,
    idConcepto: 0,
    codigo: '',
    descripcion: '',
    tipoIndirecto: 0,
    porcentaje: 0,
    porcentajeConFormato: '',
    idIndirectoBase: 0,
    expandido: false,
    nivel: 0
  }

  existenIndirectos: boolean = false;
  porcentajeIndirectos: number = 0;
  existenEstimaciones: boolean = false;

  constructor(
    public dialogRef: MatDialogRef<IndirectosComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _SeguridadService: SeguridadService,
    private dialog: MatDialog,
    private precioUnitarioService: PrecioUnitarioService,
    private _IndirectosService: IndirectosConceptoService,
    private estimacionesService: EstimacionesService

  ) {
    let empresa = _SeguridadService.obtenIdEmpresaLocalStorage();
    let proyecto = _SeguridadService.obtenerIdProyectoLocalStorage();
    this.selectedEmpresa = Number(empresa);
    this.selectedProyecto = Number(proyecto);
    this.PU = data;
  }

  ngOnInit(): void {
    this.estimacionesService.obtenerPeriodos(this.selectedProyecto, this.selectedEmpresa).subscribe((datos) => {
      if (datos.length > 0) {
        this.existenEstimaciones = true;
      }
    });
    this.cargarIndirectos();
  }

  cargarIndirectos() {
    this.porcentajeIndirectos = 0;
    this._IndirectosService.ObtenerIndirectos(this.selectedEmpresa, this.PU.idConcepto).subscribe((datos) => {
      this.indirectos = datos;
      this.porcentajeIndirectos = 0;
      if (this.indirectos.length > 0) {
        let indirectosPadre = this.indirectos.filter(z => z.idIndirectoBase == 0);
        indirectosPadre.forEach((element) => {
          this.porcentajeIndirectos += element.porcentaje;
        });
        this.existenIndirectos = true;
      }
    });
  }

  NuevosIndirectos() {
    this._IndirectosService.CrearIndirectosPadre(this.selectedEmpresa, this.PU.idConcepto).subscribe((datos) => {
      if (datos.estatus) {
        this.cargarIndirectos();
      }
    });
  }

  arrowFunction = (): number => {
    this._IndirectosService.ObtenerIndirectos(this.selectedEmpresa, this.PU.idConcepto).subscribe((datos) => {
      this.indirectos = datos;
      this.porcentajeIndirectos = 0;
      if (this.indirectos.length <= 0) {
        this.porcentajeIndirectos = 0;
      }
      let indirectosPadre = this.indirectos.filter(z => z.idIndirectoBase == 0);
      indirectosPadre.forEach((element) => {
        this.porcentajeIndirectos += element.porcentaje;
      });
      this.PU.porcentajeIndirectoConFormato = new Intl.NumberFormat('es-MX', { minimumFractionDigits: 4 }).format(this.porcentajeIndirectos / 100 + 1);
      this.existenIndirectos = true;
      this.PUEditando = false;
      return this.porcentajeIndirectos;
    });
    return this.porcentajeIndirectos;
  }

  detenerCierre(event: MouseEvent) {
    this.openDropdownId = 0;
    event.stopPropagation();
  }

  cerrar() {
    this.dialog.closeAll();
  }

  edicion() {
    if(this.existenEstimaciones){
      return;
    }
    if (this.existenIndirectos && this.porcentajeIndirectos > 0) {
      this.PUEditando = false;
      return;
    }
    this.PUEditando = true;
  }

  seleccionar(indirecto: IndirectosXConceptoDTO) { }

  expansionDominio(indirecto: IndirectosXConceptoDTO) {
    indirecto.expandido = !indirecto.expandido;
  }

  ediatarIndirectoPrecioUnitario() {
    this.precioUnitarioService.editarIndirectoPrecioUnitario(this.PU, this.selectedEmpresa).subscribe((datos) => {
      if (datos) {
        this.PU.porcentajeIndirectoConFormato = new Intl.NumberFormat('es-MX', { minimumFractionDigits: 4 }).format(this.PU.porcentajeIndirecto)
        this.PUEditando = false;
      }
    });
  }

  crearIndirectoMismoNivel(indirecto: IndirectosXConceptoDTO) {
    let nuevoIndirecto: IndirectosXConceptoDTO = {
      hijos: [],
      id: 0,
      idConcepto: indirecto.idConcepto,
      codigo: '',
      descripcion: '',
      tipoIndirecto: indirecto.tipoIndirecto,
      porcentaje: 0,
      porcentajeConFormato: '',
      idIndirectoBase: indirecto.idIndirectoBase,
      expandido: false,
      nivel: 0
    }
    this.BuscarNodo(indirecto.idIndirectoBase);
    this.indirectoPadre.hijos.push(nuevoIndirecto);

    this.openDropdownId = null;
  }

  crearIndirectoSubnivel(indirecto: IndirectosXConceptoDTO) {
    let nuevoIndirecto: IndirectosXConceptoDTO = {
      hijos: [],
      id: 0,
      idConcepto: indirecto.idConcepto,
      codigo: '',
      descripcion: '',
      tipoIndirecto: indirecto.tipoIndirecto,
      porcentaje: 0,
      porcentajeConFormato: '',
      idIndirectoBase: indirecto.id,
      expandido: false,
      nivel: 0
    }
    indirecto.expandido = true;
    this.indirectoPadre = indirecto;
    this.indirectoPadre.hijos.push(nuevoIndirecto);

    this.openDropdownId = null;
  }

  eliminarIndirecto(indirecto: IndirectosXConceptoDTO): void {
    this._IndirectosService.EliminarIndirecto(this.selectedEmpresa, indirecto.id).subscribe((datos) => {
      if (datos.estatus) {
        this.arrowFunction();
      }
      this.openDropdownId = null;
    });
  }

  BuscarNodo(idIndirecto: number) {
    this.indirectos.forEach((element) => {
      if (element.id == idIndirecto) {
        this.indirectoPadre = element;
        return;
      } else {
        this.BuscarNodoHijo(idIndirecto, element.hijos);
      }
    });
  }

  BuscarNodoHijo(idIndirecto: number, hijos: IndirectosXConceptoDTO[]) {
    hijos.forEach((element) => {
      if (element.id == idIndirecto) {
        this.indirectoPadre = element;
        return;
      } else {
        this.BuscarNodoHijo(idIndirecto, element.hijos);
      }
    });
  }

  crear(indirecto: IndirectosXConceptoDTO) {
    if (indirecto.id == 0) {
      this._IndirectosService.CrearIndirecto(this.selectedEmpresa, indirecto).subscribe((datos) => {
        if (datos.estatus) {
          this.arrowFunction();
        }
      });
    } else {
      indirecto.porcentajeConFormato = "";
      this._IndirectosService.EditarIndirecto(this.selectedEmpresa, indirecto).subscribe((datos) => {
        if (datos.estatus) {
          this.arrowFunction();
        }
      });
    }
  }

  toggleDropdown(indirecto: IndirectosXConceptoDTO, event: MouseEvent): void {
    event.stopPropagation();
    this.openDropdownId = this.openDropdownId === indirecto.id ? null : indirecto.id;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event): void {
    const target = event.target as HTMLElement;
    console.log('Click en:', target, 'Contenedor encontrado:', target.closest('.dropdown-menu-container'));
    if (!target.closest('.dropdown-menu-container')) {
      this.openDropdownId = null;
    }
  }

  onContainerClick(event: MouseEvent): void {
    console.log(this.openDropdownId);
    event.stopPropagation();


    const target = event.target as HTMLElement;
    if (!target.closest('.dropdown-menu-container')) {
      this.openDropdownId = null;
    }
  }
}
