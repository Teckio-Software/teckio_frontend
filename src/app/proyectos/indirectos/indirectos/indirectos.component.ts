import { Component, ElementRef, Inject, Renderer2, TemplateRef, ViewChild } from '@angular/core';
import { ConjuntoIndirectosDTO } from '../../conjunto-indirectos/conjunto-indirectos';
import { SeguridadService } from 'src/app/seguridad/seguridad.service';
import { IndirectosServiceService } from '../indirectos-service.service';
import { IndirectosDTO } from '../indirectos';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { EstimacionesService } from '../../estimaciones/estimaciones.service';

@Component({
  selector: 'app-indirectos',
  templateUrl: './indirectos.component.html',
  styleUrls: ['./indirectos.component.css']
})
export class IndirectosComponent {

  @ViewChild('dialogIndirectos', { static: true })
  dialogTablaIndirectos!: TemplateRef<any>;

  selectedProyecto: number = 0;
  selectedEmpresa: number = 0;
  existeConjunto: boolean = false;

  conjuntoIndirecto: ConjuntoIndirectosDTO = {
    id: 0,
    idProyecto: 0,
    tipoCalculo: 0,
    porcentaje: 0,
    porcentajeConFormato: ''
  }

  indirectos: IndirectosDTO[] = [];
  indirectoPadre: IndirectosDTO = {
    hijos: [],
    id: 0,
    idConjuntoIndirectos: 0,
    codigo: '',
    descripcion: '',
    tipoIndirecto: 0,
    porcentaje: 0,
    porcentajeConFormato: '',
    idIndirectoBase: 0,
    expandido: false,
    nivel: 0
  }

  porcentajeRealConFormato: string = '';

  existenEstimaciones: boolean = false;


  @ViewChild('dropdownToggle') dropdownToggle !: ElementRef;
  dropdownMenu: any;
  constructor(
    public dialogRef: MatDialogRef<IndirectosComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _SeguridadService: SeguridadService,
    private _IndirectosService: IndirectosServiceService,
    private dialog: MatDialog,
    private renderer: Renderer2,
    private estimacionesService: EstimacionesService
  ) {
    let empresa = _SeguridadService.obtenIdEmpresaLocalStorage();
    let proyecto = _SeguridadService.obtenerIdProyectoLocalStorage();
    this.selectedEmpresa = Number(empresa);
    this.selectedProyecto = Number(proyecto);
  }

  ngOnInit() {
    this.estimacionesService.obtenerPeriodos(this.selectedProyecto, this.selectedEmpresa).subscribe((datos) => {
      if (datos.length > 0) {
        this.existenEstimaciones = true;
      }
    });
    this.cargarConjunto();
    this.cargarIndirectos();
  }

  toggleDropdown() {


  }

  onDocumentClick(event: MouseEvent) {
    const dropdownButton = event.target as HTMLElement;

    // Mantiene el menu abierto
    if (dropdownButton.closest('.inline-flex.items-center')) {
      return;
    }

    // Cierra todos los menús desplegables abiertos
    const dropdownMenus = document.querySelectorAll('.dropdown-menu.show');
    dropdownMenus.forEach(menu => {
      if (menu instanceof HTMLElement) {
        this.renderer.removeClass(menu, 'show');
      }
    });
  }

  // onDocumentClick(event: MouseEvent) {
  //   // Obtén el botón del menú desplegable
  //   const dropdownButton = event.target as HTMLElement;
  //   const dropdownMenu = this.dropdownToggle.nativeElement.nextElementSibling; // Obtén el menú desplegable
  //   // Verificar si el clic fue en el botón del menú desplegable
  //   if (dropdownButton.closest('.inline-flex.items-center')) {

  //     if (!dropdownMenu.classList.contains('dropdown-menu')) {
  //       this.renderer.addClass(dropdownMenu, 'dropdown-menu');
  //     }
  //     console.log("menu", dropdownMenu);
  //     return; // No hacer nada si se hizo clic en el botón
  //   }

  //   console.log("aqui estoy de nuevo");
  //   if (dropdownMenu.classList.contains('dropdown-menu')) {
  //     this.renderer.removeClass(dropdownMenu, 'dropdown-menu');
  //   }
  //   console.log("menu en clck", dropdownMenu);

  // }

  cargarConjunto() {
    this._IndirectosService.ObtenerConjuntoIndirecto(this.selectedEmpresa, this.selectedProyecto).subscribe((datos) => {
      this.conjuntoIndirecto = datos;
      console.log(this.conjuntoIndirecto);
      this.porcentajeRealConFormato = new Intl.NumberFormat('es-MX', {
          style: 'percent',
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }).format(
          (this.conjuntoIndirecto.porcentaje - 1)
        );
      if (this.conjuntoIndirecto.id != 0) {
        this.existeConjunto = true;
      }
    });
  }

  cargarIndirectos() {
    this._IndirectosService.ObtenerIndirectos(this.selectedEmpresa, this.selectedProyecto).subscribe((datos) => {
      this.indirectos = datos;
    });
  }

  crearConjuntoIndirecto() {
    this._IndirectosService.CrearConjuntoIndirecto(this.selectedEmpresa, this.selectedProyecto).subscribe((datos) => {
      if (datos.estatus) {
        this.cargarIndirectos();
      }
    });
  }

  Recalcular(conjunto: ConjuntoIndirectosDTO) {
    this._IndirectosService.EditarConjuntoIndirecto(this.selectedEmpresa, conjunto).subscribe((datos) => {
      if (datos.estatus) {
        this.cargarConjunto();
      }
    });
  }

  expansionDominio(indirecto: IndirectosDTO) {
    indirecto.expandido = !indirecto.expandido;
  }

  seleccionar(indirecto: IndirectosDTO) { }

  crear(indirecto: IndirectosDTO) {
    if (indirecto.id == 0) {
      this._IndirectosService.CrearIndirecto(this.selectedEmpresa, indirecto).subscribe((datos) => {
        if (datos.estatus) {
          this.cargarConjunto();
          this.cargarIndirectos();
        }
      });
    } else {
      indirecto.porcentajeConFormato = "";
      this._IndirectosService.EditarIndirecto(this.selectedEmpresa, indirecto).subscribe((datos) => {
        if (datos.estatus) {
          this.cargarConjunto();
          this.cargarIndirectos();
        }
      });
    }
  }

  crearIndirectoMismoNivel(indirecto: IndirectosDTO) {
    let nuevoIndirecto: IndirectosDTO = {
      hijos: [],
      id: 0,
      idConjuntoIndirectos: indirecto.idConjuntoIndirectos,
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
  }

  crearIndirectoSubnivel(indirecto: IndirectosDTO) {
    let nuevoIndirecto: IndirectosDTO = {
      hijos: [],
      id: 0,
      idConjuntoIndirectos: indirecto.idConjuntoIndirectos,
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
  }

  eliminarIndirecto(indirecto: IndirectosDTO) {
    this._IndirectosService.EliminarIndirecto(this.selectedEmpresa, indirecto.id).subscribe((datos) => {
      if (datos.estatus) {
        this.cargarConjunto();
        this.cargarIndirectos();
      }
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

  BuscarNodoHijo(idIndirecto: number, hijos: IndirectosDTO[]) {
    hijos.forEach((element) => {
      if (element.id == idIndirecto) {
        this.indirectoPadre = element;
        return;
      } else {
        this.BuscarNodoHijo(idIndirecto, element.hijos);
      }
    });
  }

  detenerCierre(event: MouseEvent) {
    event.stopPropagation();
  }

  cerrar() {
    this.dialog.closeAll();
  }
}
