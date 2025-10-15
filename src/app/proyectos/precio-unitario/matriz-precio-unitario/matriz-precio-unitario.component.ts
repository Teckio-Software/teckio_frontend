import { InsumoService } from './../../../catalogos/insumo/insumo.service';
import { TestBed } from '@angular/core/testing';
import { familiaInsumoDTO } from 'src/app/catalogos/familia-insumo/tsFamilia';
import { tipoInsumoDTO } from 'src/app/catalogos/tipo-insumo/tsTipoInsumo';
import { TipoInsumoService } from 'src/app/catalogos/tipo-insumo/tipo-insumo.service';
import { FamiliaInsumoService } from 'src/app/catalogos/familia-insumo/familia-insumo.service';
import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { PrecioUnitarioDetalleService } from './../../precio-unitario-detalle/precio-unitario-detalle.service';
import { PrecioUnitarioService } from '../precio-unitario.service';
import { SeguridadService } from 'src/app/seguridad/seguridad.service';
import { Unidades } from '../unidades';
import { precioUnitarioDetalleDTO } from '../../precio-unitario-detalle/tsPrecioUnitarioDetalle';
import { precioUnitarioDTO } from '../tsPrecioUnitario';
import { InsumoDTO } from 'src/app/catalogos/insumo/tsInsumo';

@Component({
  selector: 'app-matriz-precio-unitario',
  templateUrl: './matriz-precio-unitario.component.html',
  styleUrls: ['./matriz-precio-unitario.component.css']
})
export class MatrizPrecioUnitarioComponent implements OnInit {
  @Input() selectedPU!: number;
  @Output() detalleCreado = new EventEmitter<void>();
  selectedProyecto: number = 0;
  selectedEmpresa: number = 0;
  nivelDesglose: number = 0;
  Unidades: string[] = [];
  detalles!: precioUnitarioDetalleDTO[];
  detallesReset!: precioUnitarioDetalleDTO[];
  tipoInsumo!: tipoInsumoDTO[];
  familiaInsumo!: familiaInsumoDTO[];
  varDetalleSeleccionado!: precioUnitarioDetalleDTO;
  @ViewChild('inputFiltrado') inputFiltrado: any;

  constructor (
      private precioUnitarioService: PrecioUnitarioService
      , private _seguridadEmpresa: SeguridadService
      , private unidades: Unidades
      , private precioUnitarioDetalleService: PrecioUnitarioDetalleService
      , private familiaInsumoService: FamiliaInsumoService
      , private tipoInsumoService: TipoInsumoService
      , private insumoService: InsumoService
    ){
      let idEmpresa = _seguridadEmpresa.obtenIdEmpresaLocalStorage();
      let idProyecto = _seguridadEmpresa.obtenerIdProyectoLocalStorage();
      this.selectedProyecto = Number(idProyecto);
      this.selectedEmpresa = Number(idEmpresa);
      this.Unidades = this.unidades.Getunidades();
    }

  ngOnInit(): void {
    this.cargarDetallesXIdPrecioUnitario();
    this.familiaInsumoService.obtenerTodosSinPaginar(this.selectedEmpresa)
    .subscribe((registros) =>{
      this.familiaInsumo = registros;
    })
    this.tipoInsumoService.obtenerTodosSinPaginar(this.selectedEmpresa)
    .subscribe((registros) => {
      this.tipoInsumo = registros;
    })
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
                }).format(element.cantidad!);
              });
              this.detallesReset = detalles;
              this.detalles.push({
                id: 0,
                idPrecioUnitario: 0,
                idInsumo: 0,
                esCompuesto: false,
                costoUnitario: 0,
                cantidad: null,
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
                costoBase: null,
                costoBaseConFormato: '$0.00',
                esAutorizado: false,
              });
              // this.displayCarga = 'none';
            });
    }
      // this.precioUnitarioSeleccionado = PrecioUnitario;
  }

  exponerNumeros(detalle: precioUnitarioDetalleDTO){
    if(this.varDetalleSeleccionado){
      this.varDetalleSeleccionado.cantidadEditado = false;
      this.varDetalleSeleccionado.costoUnitarioEditado = false;
    }
    this.varDetalleSeleccionado = detalle;
    this.varDetalleSeleccionado.cantidadEditado = true;
    this.varDetalleSeleccionado.costoUnitarioEditado = true;
    // this.precioUnitarioCantidadEditado = precioUnitario;
    // precioUnitario.cantidadEditado = true;
  }

  detallesDesgloce: precioUnitarioDetalleDTO[] = [];

  cargarDetallesHijos(detalle: precioUnitarioDetalleDTO){
    this.detallesDesgloce.push(detalle);
    if (detalle.id != 0) {
      // this.inputFiltrado.nativeElement.value = '';
      // this.seEstaEditandoRegistro = false;
      // this.displayCarga = 'flex';
      if (detalle.esCompuesto == true && detalle.id > 0) {
        // if (this.cargando == false) {
          // this.cargando = true;
          this.precioUnitarioDetalleService
            .obtenerHijos(detalle, this.selectedEmpresa)
            .subscribe((detalles) => {
              // this.inicio = 0;
              // this.termino = 10;
              // this.paginadoBase.pageIndex = 0;
              this.detalles = detalles;
              console.log(this.detalles);
              this.detalles.push({
                id: 0,
                idPrecioUnitario: 0,
                idInsumo: 0,
                esCompuesto: false,
                costoUnitario: 0,
                cantidad: null,
                cantidadExcedente: 0,
                idPrecioUnitarioDetallePerteneciente: detalle.id,
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
                costoBase: null,
                costoBaseConFormato: '$0.00',
                esAutorizado: false,
              });
              // this.displayCarga = 'none';
              // this.cargando = false;
            });
        // }
      }
    }
  }

  cargarRegistroDelDesglose(desglose: precioUnitarioDetalleDTO) {
    console.log(desglose);
      if (desglose.id == 0) {
        // this.displayCarga = 'flex';
        for (let i = this.detallesDesgloce.length - 1; i > 0; i--) {
          this.detallesDesgloce.pop();
        }
        this.precioUnitarioDetalleService
          .obtenerTodos(desglose.idPrecioUnitario, this.selectedEmpresa)
          .subscribe((detalles) => {
            this.detalles = detalles;
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
              costoUnitarioConFormato: '$0.00',
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
      } else {
        // this.displayCarga = 'flex';
        for (let i = this.detallesDesgloce.length - 1; i > 0; i--) {
          if (
            this.detallesDesgloce[i].idPrecioUnitarioDetallePerteneciente ==
            desglose.idPrecioUnitarioDetallePerteneciente
          ) {
            i = 0;
          } else {
            console.log("pop")
            this.detallesDesgloce.pop();
          }
        }
        let Detalle: precioUnitarioDetalleDTO = {
          id: desglose.idPrecioUnitarioDetallePerteneciente,
          idPrecioUnitario: desglose.idPrecioUnitario,
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
          costoUnitarioConFormato: '',
          cantidadConFormato: '',
          importeConFormato: '',
          costoUnitarioEditado: false,
          cantidadEditado: false,
          costoBase: 0,
          costoBaseConFormato: '$0.00',
          esAutorizado: false,
        };
        this.precioUnitarioDetalleService
          .obtenerHijos(desglose, this.selectedEmpresa)
          .subscribe((detalles) => {
            this.detalles = detalles;
            this.detalles.push({
              id: 0,
              idPrecioUnitario: 0,
              idInsumo: 0,
              esCompuesto: false,
              costoUnitario: 0,
              cantidad: 0,
              cantidadExcedente: 0,
              idPrecioUnitarioDetallePerteneciente:
              Detalle.idPrecioUnitarioDetallePerteneciente,
              codigo: '',
              descripcion: '',
              unidad: '',
              idTipoInsumo: 0,
              idFamiliaInsumo: 0,
              importe: 0,
              costoUnitarioConFormato: '$0.00',
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
    }

    precioUnitarioSeleccionado: precioUnitarioDTO = {
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
      porcentajeIndirectoConFormato: '',
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
      posicion: 0,
      codigoPadre: '',
      esCatalogoGeneral: false,
      esAvanceObra: false,
      esAdicional: false,
      esSeleccionado: false
    }

    insumos: InsumoDTO[] = [];
    insumosReset: InsumoDTO[] = [];


crearDetalle(detalle: precioUnitarioDetalleDTO) {
    // this.seEstaEditandoRegistro = false;
    detalle.idPrecioUnitario = this.selectedPU;
    if (detalle.id == 0) {
      // if (
      //   typeof detalle.codigo == undefined ||
      //   !detalle.codigo ||
      //   detalle.codigo == '' ||
      //   typeof detalle.descripcion == undefined ||
      //   !detalle.descripcion ||
      //   detalle.descripcion == '' ||
      //   typeof detalle.unidad == undefined ||
      //   !detalle.unidad ||
      //   detalle.unidad == '' ||
      //   typeof detalle.idTipoInsumo == undefined ||
      //   !detalle.idTipoInsumo ||
      //   detalle.idTipoInsumo <= 0
      // ) {
      //   this._snackBar.open('capture todos los campos', 'X', {
      //     duration: 3000,
      //   });
      //   return;
      // }
      // this.displayCarga = 'flex';
      this.precioUnitarioDetalleService
        .creaRegistro(detalle, this.selectedEmpresa)
        .subscribe((detalles) => {
          this.detalles = detalles;
          this.precioUnitarioService
            .obtenerEstructurado(this.selectedProyecto, this.selectedEmpresa)
            .subscribe((precios) => {
              this.detalles.push({
                id: 0,
                idPrecioUnitario: 0,
                idInsumo: 0,
                esCompuesto: false,
                costoUnitario: 0,
                cantidad: 0,
                cantidadExcedente: 0,
                idPrecioUnitarioDetallePerteneciente:
                detalle.idPrecioUnitarioDetallePerteneciente,
                codigo: '',
                descripcion: '',
                unidad: '',
                idTipoInsumo: 0,
                idFamiliaInsumo: 0,
                importe: 0,
                costoUnitarioConFormato: '$0.00',
                cantidadConFormato: '0.00',
                importeConFormato: '$0.00',
                costoUnitarioEditado: false,
                cantidadEditado: false,
                costoBase: 0,
                costoBaseConFormato: '$0.00',
                esAutorizado: false,
              });
            });
          this.insumoService
            .obtenerParaAutocomplete(
              this.selectedProyecto,
              this.selectedEmpresa
            )
            .subscribe((insumos) => {
              this.insumos = insumos;
              this.insumosReset = insumos;
            });
          // this.cargarListaConceptos();
          this.actualizarDesgloce();
          this.detalleCreado.emit();
        });
    } else {
      // if (
      //   typeof detalle.codigo == undefined ||
      //   !detalle.codigo ||
      //   detalle.codigo == '' ||
      //   typeof detalle.descripcion == undefined ||
      //   !detalle.descripcion ||
      //   detalle.descripcion == '' ||
      //   typeof detalle.unidad == undefined ||
      //   !detalle.unidad ||
      //   detalle.unidad == '' ||
      //   typeof detalle.idTipoInsumo == undefined ||
      //   !detalle.idTipoInsumo ||
      //   detalle.idTipoInsumo <= 0
      // ) {
      //   this._snackBar.open('capture todos los campos', 'X', {
      //     duration: 3000,
      //   });
      //   return;
      // }
      // this.displayCarga = 'flex';
      this.precioUnitarioDetalleService
        .editaRegistro(detalle, this.selectedEmpresa)
        .subscribe((detalles) => {
          this.detalles = detalles;
          this.precioUnitarioService
            .obtenerEstructurado(this.selectedProyecto, this.selectedEmpresa)
            .subscribe((precios) => {
              // this.preciosUnitariosRefresco = precios;
              // this.refrescar();
              this.detalles.push({
                id: 0,
                idPrecioUnitario: 0,
                idInsumo: 0,
                esCompuesto: false,
                costoUnitario: 0,
                cantidad: 0,
                cantidadExcedente: 0,
                idPrecioUnitarioDetallePerteneciente:
                  detalle.idPrecioUnitarioDetallePerteneciente,
                codigo: '',
                descripcion: '',
                unidad: '',
                idTipoInsumo: 0,
                idFamiliaInsumo: 0,
                importe: 0,
                costoUnitarioConFormato: '$0.00',
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
          this.insumoService
            .obtenerParaAutocomplete(
              this.selectedProyecto,
              this.selectedEmpresa
            )
            .subscribe((insumos) => {
              this.insumos = insumos;
              this.insumosReset = insumos;
            });
          // this.cargarListaConceptos();
          this.actualizarDesgloce();
          this.detalleCreado.emit();
        });
    }
  }

  totalDesglosados = 0;

  actualizarDesgloce() {
    this.detallesDesgloce.forEach((element) => {
      this.totalDesglosados = 0;
      if (element.idPrecioUnitarioDetallePerteneciente == 0) {
        this.precioUnitarioDetalleService
          .obtenerTodos(element.idPrecioUnitario, this.selectedEmpresa)
          .subscribe((datos) => {
            this.detallesDesgloce = datos;
            this.totalDesglosados = this.detallesDesgloce.reduce(
              (acumulado, detalle) => acumulado + detalle.importe,
              0
            );
            element.importeConFormato = new Intl.NumberFormat('es-MX', {
              style: 'currency',
              currency: 'MXN',
            }).format(this.totalDesglosados);
          });
      } else {
        let Detalle: precioUnitarioDetalleDTO = {
          id: element.idPrecioUnitarioDetallePerteneciente,
          idPrecioUnitario: element.idPrecioUnitario,
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
          costoUnitarioConFormato: '',
          cantidadConFormato: '',
          importeConFormato: '',
          costoUnitarioEditado: false,
          cantidadEditado: false,
          costoBase: 0,
          costoBaseConFormato: '$0.00',
          esAutorizado: false,
        };

        this.precioUnitarioDetalleService
          .obtenerHijos(Detalle, this.selectedEmpresa)
          .subscribe((datos) => {
            this.detallesDesgloce = datos;
            this.totalDesglosados = this.detallesDesgloce.reduce(
              (acumulado, detalle) => acumulado + detalle.importe,
              0
            );
            element.importeConFormato = new Intl.NumberFormat('es-MX', {
              style: 'currency',
              currency: 'MXN',
            }).format(this.totalDesglosados);
          });
      }
    });
  }

  actualizarCantidad(precioUnitario: precioUnitarioDetalleDTO, valor: string): void {
    if (!precioUnitario.cantidadEditado) {
      return;
    }

    const valorRecortado = valor.trim();
    if (valorRecortado === '') {
      return;
    }

    const cantidad = Number(valorRecortado);
    if (!isNaN(cantidad)) {
      precioUnitario.cantidad = cantidad;
    }
  }

  actualizarCostoBase(precioUnitario: precioUnitarioDetalleDTO, valor: string): void {
    if (!precioUnitario.cantidadEditado) {
      return;
    }

    const valorRecortado = valor.trim();
    if (valorRecortado === '') {
      return;
    }

    const costoBase = Number(valorRecortado);
    if (!isNaN(costoBase)) {
      precioUnitario.costoBase = costoBase;
    }
  }

  actualizarTipoInsumo(detalle: precioUnitarioDetalleDTO, valor: number | string | null): void {
    const id = Number(valor ?? 0);
    if (Number.isNaN(id)) {
      return;
    }
    if (detalle.idTipoInsumo === id) {
      return;
    }
    detalle.idTipoInsumo = id;
    this.crearDetalle(detalle);
  }

  actualizarFamiliaInsumo(detalle: precioUnitarioDetalleDTO, valor: number | string | null): void {
    const id = Number(valor ?? 0);
    if (Number.isNaN(id)) {
      return;
    }
    if (detalle.idFamiliaInsumo === id) {
      return;
    }
    detalle.idFamiliaInsumo = id;
    this.crearDetalle(detalle);
  }
}
