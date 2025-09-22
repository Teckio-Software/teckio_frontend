import { Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { existenciasInsumosDTO } from '../tsExistencia';
import { ExistenciasService } from '../existencias.service';
import { HttpResponse } from '@angular/common/http';
import { SeguridadService } from 'src/app/seguridad/seguridad.service';
import { proyectoDTO } from 'src/app/proyectos/proyecto/tsProyecto';
import { ProyectoService } from 'src/app/proyectos/proyecto/proyecto.service';
import { AlmacenService } from '../../almacen/almacen.service';
import { almacenDTO } from '../../almacen/almacen';

@Component({
  selector: 'app-existencia',
  templateUrl: './existencia.component.html',
  styleUrls: ['./existencia.component.css']
})
export class ExistenciaComponent {
  proyectos!: proyectoDTO[];
  almacenes!: almacenDTO[];
  almacenesVS!: almacenDTO[];

  insumosExistentes !: existenciasInsumosDTO[];
  selectedEmpresa : number = 0;
  viewDetalles : boolean = false;
  selectedInsumo : number = 0;
  appRegarga : number = 1;
  proyectoSeleccionado !: boolean;
  idProyecto: number = 0;
  idAlmacen: number = 0;
  idInsumo: number = 0;
  changeColor: any = null;

  isLoading: boolean = true;

   SlistaAlmacenes: boolean = false;
    selectedAlmacen: string = '';
  
    // Obtiene la referencia al contenedor del virtual scroll
    @ViewChild('virtualScrollContainer') virtualScrollContainer!: ElementRef;
  
    // Escucha los clics en todo el documento
    @HostListener('document:click', ['$event'])
    onDocumentClick(event: MouseEvent) {
      // Comprueba si el virtual scroll está visible y si el clic no ocurrió dentro de él
      if (this.SlistaAlmacenes && !this.virtualScrollContainer.nativeElement.contains(event.target)) {
        this.SlistaAlmacenes = false;
      }
    }

  // columnasAMostrarInsumos = ['codigo', 'descripcion', 'unidad', 'almacen', 'cantidadAumenta', 'cantidadRetira', 'cantidadRecibida'];
  // cantidadTotalRegistrosInsumos: any;
  // paginaActualInsumos = 1;
  // cantidadRegistrosAMostrarInsumos = 10;
  existenciasInsumos!: existenciasInsumosDTO[];
  constructor(private _existenciaService: ExistenciasService
    , private proyectoService: ProyectoService
    , private almacenService: AlmacenService
    , private _SeguridadEmpresa: SeguridadService
  ){
    let idEmpresa = _SeguridadEmpresa.obtenIdEmpresaLocalStorage();
    this.selectedEmpresa = Number(idEmpresa);
    this.proyectoSeleccionado = false;
    let idProyecto = _SeguridadEmpresa.obtenerIdProyectoLocalStorage();
    this.idProyecto = Number(idProyecto);
  }

  ngOnInit(){
    this.traerInformacion();
    this.proyectoService.obtener(this.selectedEmpresa).subscribe((datos) => {
      this.proyectos = datos;
    })
  }

/**
 * Filtra la lista de almacenes
 * @param event El evento que se lanzo
 * @returns void
 * @description Filtra la lista de almacenes segun el texto ingresado en el input
 * El texto se busca en la propiedad almacenNombre de cada objeto almacen
 * Si el texto es vacio, se muestra la lista completa de almacenes
 */
  FiltrarAlmacenes(event: Event) {
    this.almacenesVS = this.almacenes;
    const filterValue = (
      event.target as HTMLInputElement
    ).value.toLocaleLowerCase();
    if(filterValue.trim()!=''){
      this.almacenesVS = this.almacenes.filter(a=>
      a.almacenNombre.toLowerCase().includes(filterValue.toLowerCase())
    );
    }
  }

  // SeleccionaAlmacen(event: Event) {
  //   const inputElement = event.target as HTMLInputElement;
  //   const selectedValue = inputElement.value;
  //   const idAlmacen =
  //     this.almacenes.find((almacen) => almacen.almacenNombre === selectedValue)
  //       ?.id || 0;
  //   this.idAlmacen = idAlmacen;
  //   this.fitrarTipoEA();
  // }

  SeleccionaAlmacen(id: number, nombreAlmacen: string) {
    this.idAlmacen = id;
    this.selectedAlmacen = nombreAlmacen;
    this.SlistaAlmacenes = false;
    this.cargarInsumos();
  }

  traerInformacion(
  ) {
   

    this.proyectoSeleccionado = false;

    this.almacenService.obtenerXIdProyecto(this.idProyecto, this.selectedEmpresa).subscribe((datos) => {
    this.proyectoSeleccionado = true;

      this.almacenes = datos;
      this.almacenesVS = datos;
      this.isLoading = false;
    })
  }

  // cargarInsumos(event: Event){
  //   const inputElement = event.target as HTMLInputElement;
  //   const selectedValue = inputElement.value;
  //   const idAlmacen = this.almacenes.find(almacen => almacen.almacenNombre === selectedValue)?.id || 0;
  //   this.idAlmacen = idAlmacen;
  //   this._existenciaService.obtenInsumosExistentes(this.selectedEmpresa, this.idAlmacen).subscribe((datos)=>{
  //     this.insumosExistentes = datos;
  //     this.insumosExistentes.forEach(element =>{
  //       if(element.cantidadInsumos <= 0){
  //         element.esDisponible = true;
  //       }else{
  //         element.esDisponible = false;
  //       }
  //     });
  //   });
  // }

  cargarInsumos(){
    this._existenciaService.obtenInsumosExistentes(this.selectedEmpresa, this.idAlmacen).subscribe((datos)=>{
      this.insumosExistentes = datos;
      this.insumosExistentes.forEach(element =>{
        if(element.cantidadInsumos <= 0){
          element.esDisponible = true;
        }else{
          element.esDisponible = false;
        }
      });
    });
  }

  verDetalles(idInsumo : number){
    this.changeColor = idInsumo;
    this.viewDetalles = true;
    this.selectedInsumo = idInsumo;
    this.idInsumo = idInsumo;
    this.appRegarga = this.appRegarga + 1;
  }
}
