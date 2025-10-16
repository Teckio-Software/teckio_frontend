import { precioUnitarioDetalleCopiaDTO } from './../../precio-unitario-detalle/tsPrecioUnitarioDetalle';
import { PrecioUnitarioService } from 'src/app/proyectos/precio-unitario/precio-unitario.service';
import { proyectoDTO } from './../../proyecto/tsProyecto';
import { SeguridadService } from './../../../seguridad/seguridad.service';
import { ProyectoService } from './../../proyecto/proyecto.service';
import { Component, Input, OnInit } from '@angular/core';
import { DatosParaCopiarArmadoDTO, datosParaCopiarDTO, precioUnitarioCopiaDTO, precioUnitarioDTO } from '../tsPrecioUnitario';
import { PrecioUnitarioDetalleService } from '../../precio-unitario-detalle/precio-unitario-detalle.service';
import { tipoInsumoDTO } from 'src/app/catalogos/tipo-insumo/tsTipoInsumo';
import { TipoInsumoService } from 'src/app/catalogos/tipo-insumo/tipo-insumo.service';

@Component({
  selector: 'app-importar-proyecto',
  templateUrl: './importar-proyecto.component.html',
  styleUrls: ['./importar-proyecto.component.css']
})
export class ImportarProyectoComponent implements OnInit {
  @Input() tipoImportacion!: number;
  @Input() precioUnitarioMenu!: precioUnitarioDTO;
  selectedPU = 0;
  appRecarga = 0;
  virtualScrollMostrado = false;
  matrizMostrada = false;
  selectedEmpresa = 0;
  selectedProyecto = 0;
  nombreProyecto = '';
  proyectos!: proyectoDTO[];
  proyectosReset!: proyectoDTO[];
  preciosUnitarios: precioUnitarioCopiaDTO[] = [];
  preciosUnitariosDetalles!: precioUnitarioDetalleCopiaDTO[];
  preciosUnitariosDetallesReset!: precioUnitarioDetalleCopiaDTO[];
  private preciosUnitariosArbol: precioUnitarioCopiaDTO[] = [];
  tipoInsumo!: tipoInsumoDTO[];

  constructor(
    private proyectoService: ProyectoService
    , private seguridadService: SeguridadService
    , private precioUnitarioService: PrecioUnitarioService
    , private precioUnitarioDetalleService: PrecioUnitarioDetalleService
    , private tipoInsumoService: TipoInsumoService
  ){
    let idEmpresa = seguridadService.obtenIdEmpresaLocalStorage()
    this.selectedEmpresa = Number(idEmpresa);
  }

  ngOnInit(): void {
    console.log(this.tipoImportacion, "soy el tipo de importacion");
    this.proyectoService.obtenerTodosSinEstructurar(this.selectedEmpresa)
    .subscribe((datos) => {
      this.proyectos = datos;
      this.proyectosReset = datos;
    })
    this.tipoInsumoService.obtenerTodosSinPaginar(this.selectedEmpresa)
    .subscribe((registros) => {
      this.tipoInsumo = registros;
    })
  }

  filtrarProyecto(event: Event) {
    this.proyectos = this.proyectosReset;
    const filterValue = (
      event.target as HTMLInputElement
    ).value.toLocaleLowerCase();
    this.proyectos = this.proyectos.filter(
      (proyecto) =>
        proyecto.nombre.toLocaleLowerCase().includes(filterValue) ||
        proyecto.codigoProyecto.toLocaleLowerCase().includes(filterValue)
    );
  }

  trackByPrecioUnitario = (_: number, item: precioUnitarioDTO) => item.id;


  seleccionarProducto(proyecto: proyectoDTO){
    this.nombreProyecto = proyecto.nombre;
    this.selectedProyecto = proyecto.id;
    this.precioUnitarioService.obtenerEstructuradosParaCopiar(this.selectedProyecto, this.selectedEmpresa)
    .subscribe((registros) => {
      console.log("registros", registros)
      this.preciosUnitariosArbol = registros ?? [];
      this.virtualScrollMostrado = false;
      this.actualizarListaVisible();
    })
  }

  obtenerDetallesCopia(puCopia: precioUnitarioCopiaDTO){
    this.selectedPU = puCopia.id;
    this.matrizMostrada = true;
    this.precioUnitarioDetalleService.obtenerTodos(this.selectedPU, this.selectedEmpresa)
    .subscribe((registros) => {
      this.preciosUnitariosDetalles = registros;
      this.preciosUnitariosDetallesReset = registros;
    })
  }

   private actualizarListaVisible(): void {
    const resultado: precioUnitarioCopiaDTO[] = [];
    this.flattenPrecios(this.preciosUnitariosArbol, resultado);
    this.preciosUnitarios = resultado;
  }

  private flattenPrecios(
    origen: precioUnitarioCopiaDTO[] | undefined,
    acumulado: precioUnitarioCopiaDTO[],
  ): void {
    if (!origen?.length) {
      return;
    }

    for (const nodo of origen) {
      acumulado.push(nodo);

      if (nodo.expandido && nodo.hijos?.length) {
        this.flattenPrecios(nodo.hijos, acumulado);
      }
    }
  }

  expansionDominio(precioUnitario: precioUnitarioCopiaDTO): void {
    precioUnitario.expandido = !precioUnitario.expandido;
    this.actualizarListaVisible();
  }

  seleccionarHijosPresupuesto(precioUnitario: precioUnitarioCopiaDTO) {
    if (precioUnitario.seleccionado) {
      if (precioUnitario.hijos.length > 0) {
        for (let i = 0; i < precioUnitario.hijos.length; i++) {
          precioUnitario.hijos[i].seleccionado = true;
          this.seleccionarHijosPresupuesto(precioUnitario.hijos[i]);
        }
      }
    } else {
      if (precioUnitario.hijos.length > 0) {
        for (let i = 0; i < precioUnitario.hijos.length; i++) {
          precioUnitario.hijos[i].seleccionado = false;
          this.seleccionarHijosPresupuesto(precioUnitario.hijos[i]);
        }
      }
    }
  }

  datosCopiaArmado: DatosParaCopiarArmadoDTO = {
      registros: [],
      idPrecioUnitarioBase: 0,
      idProyecto: 0,
    };


    datosCopia: datosParaCopiarDTO = {
        registros: [],
        idPrecioUnitarioBase: 0,
        idProyecto: 0,
      };

  importarDatos() {
    console.log(this.tipoImportacion, "Ere")
    if (this.tipoImportacion == 0) {
      // this.displayCarga = 'flex';
      // this.datosCopiaArmado.registros = this.detallesCopiaReset.filter(
      //   (registro) => registro.seleccionado == true
      // );
      // this.datosCopiaArmado.idProyecto = this.selectedProyecto;
      // this.displayCarga = 'flex';
      // this.precioUnitarioService
      //   .copiarArmadoComoConcepto(this.datosCopiaArmado, this.selectedEmpresa)
      //   .subscribe((preciosUnitarios) => {
      //     this.importarConceptoDesdePU = false;
      //     this.preciosUnitarios = preciosUnitarios;
      //     this.actualizarTotales();
      //     this.displayCarga = 'none';
      //   });
      // this.contenedor2 = false;
      // this.setDisplayFlex();
      // this.insumoService
      //   .obtenerParaAutocomplete(this.selectedProyecto, this.selectedEmpresa)
      //   .subscribe((insumos) => {
      //     this.actualizarTotales();
      //     this.insumos = insumos;
      //   });
    } else {
      if (this.tipoImportacion == 1) {
        // this.displayCarga = 'flex';
        this.datosCopia.idProyecto = this.precioUnitarioMenu.idProyecto;
        this.datosCopia.registros = this.preciosUnitariosArbol;
        this.datosCopia.idPrecioUnitarioBase = this.precioUnitarioMenu.id;
        this.precioUnitarioService
          .copiarRegistros(this.datosCopia, this.selectedEmpresa)
          .subscribe(() => {
          });
      } else {
        // this.displayCarga = 'flex';
        this.datosCopiaArmado.idPrecioUnitarioBase = this.precioUnitarioMenu.id;
        this.datosCopiaArmado.registros = this.preciosUnitariosDetallesReset.filter(
          (registro) => registro.seleccionado == true
        );
        this.datosCopiaArmado.idProyecto = this.precioUnitarioMenu.idProyecto;
        // this.displayCarga = 'flex';
        this.precioUnitarioService
          .copiarArmado(this.datosCopiaArmado, this.selectedEmpresa)
          .subscribe(() => {
          });
      }
    }
  }


}
