import { Component, EventEmitter, Input, Output } from '@angular/core';
import {
  AlmacenEntradaCreacionDTO,
  AlmacenEntradaDTO,
} from '../tsAlmacenEntrada';
import { AlmacenEntradaService } from '../almacen-entrada.service';
import { formatDate } from '@angular/common';
import { AlmacenService } from '../../almacen/almacen.service';
import { almacenDTO } from '../../almacen/almacen';
import Swal from 'sweetalert2';
import { ContratistaService } from 'src/app/catalogos/contratista/contratista.service';
import { contratistaDTO } from 'src/app/catalogos/contratista/tsContratista';
import { insumoXOrdenCompraDTO } from 'src/app/compras/insumoxordencompra/tsInsumoXOrdenCompra';
import { InsumoXOrdenCompraService } from 'src/app/compras/insumoxordencompra/insumoxordencompra.service';
import { AlmacenEntradaInsumoCreacionDTO } from '../../almacenEntradaInsumo/tsAlmacenEntradaInsumo';
import { AlmacenEntradaInsumoService } from '../../almacenEntradaInsumo/almacen-entrada-insumo.service';
import {
  InsumoDTO,
  InsumoParaExplosionDTO,
} from 'src/app/catalogos/insumo/tsInsumo';
import { PrecioUnitarioService } from 'src/app/proyectos/precio-unitario/precio-unitario.service';
import { InsumoService } from 'src/app/catalogos/insumo/insumo.service';
import { TipoInsumoService } from 'src/app/catalogos/tipo-insumo/tipo-insumo.service';
import { tipoInsumoDTO } from 'src/app/catalogos/tipo-insumo/tsTipoInsumo';

@Component({
  selector: 'app-almacenes-entradas',
  templateUrl: './almacenes-entradas.component.html',
  styleUrls: ['./almacenes-entradas.component.css'],
})
export class AlmacenesEntradasComponent {
  constructor(
    public _almacenEntrada: AlmacenEntradaService,
    private almacenService: AlmacenService,
    public _contratistaService: ContratistaService,
    private insumoXordenCompraServide: InsumoXOrdenCompraService,
    private _alamcenEntradaInsumoServie: AlmacenEntradaInsumoService,
    private _explosionInsumos: PrecioUnitarioService,
    private _insumo: InsumoService,
    private _tipoInsumo: TipoInsumoService
  ) {}

  @Input()
  idProyectoInput: number = 0;
  @Input()
  idRequisicionInput: number = 0;
  @Input()
  idEmpresaInput: number = 0;
  @Input()
  idCotizacionInput: number = 0;
  @Input()
  idOrdenCompraInput: number = 0;

  @Output() valueChangeTodosEA = new EventEmitter();

  @Output() valueChangeInsumosEA = new EventEmitter();

  todos: boolean = false;
  almacenes!: almacenDTO[];
  idAlmacen: number = 0;
  insumosEstado: boolean = false;

  entradasalmacen!: AlmacenEntradaDTO[];
  entradasAlmancenRespaldo!: AlmacenEntradaDTO[];
  idEntradaAlmacen: number = 0;
  EntradaAlmacenSeleccionada: boolean = false;
  appRegarga: number = 0;
  changeColor: any = null;

  tipoEntradaAlmacen: number = 0;
  fechafiltro!: Date;

  almacenEntradaCreacion: AlmacenEntradaCreacionDTO = {
    idAlmacen: 0,
    idContratista: 0,
    listaInsumosEnAlmacenEntrada: [],
    observaciones: '',
  };

  contratista: contratistaDTO[] = [];
  idContratista: number = 0;
  editando: boolean = false;
  esAjusteAlmacen = false;
  insumosCompradosContratista: insumoXOrdenCompraDTO[] = [];
  insumoAjusteAlmacen: AlmacenEntradaInsumoCreacionDTO = {
    idInsumo: 0,
    idAlmacenEntrada: 0,
    descripcion: '',
    unidad: '',
    idTipoInsumo: 0,
    cantidadPorRecibir: 0,
    cantidadRecibida: 0,
    idOrdenCompra: 0,
    idInsumoXOrdenCompra: 0,
  };
  explocionInsumosparaRequisicion!: InsumoParaExplosionDTO[];
  explocionInsumos!: InsumoParaExplosionDTO[];
  insumos!: InsumoDTO[];
  tipoInsumos!: tipoInsumoDTO[];
  isLoading: boolean = true;

  ngOnInit() {
    if (this.idOrdenCompraInput > 0) {
      this.todos = true;
    }
    this.almacenService
      .obtenerXIdProyecto(this.idProyectoInput, this.idEmpresaInput)
      .subscribe((datos) => {
        this.almacenes = datos;
        this.isLoading = false;
      });
    this._contratistaService
      .obtenerTodos(this.idEmpresaInput)
      .subscribe((respuesta) => {
        this.contratista = respuesta;
        this.isLoading = false;
      });
    this._insumo
      .obtenerXIdProyecto(this.idEmpresaInput, this.idProyectoInput)
      .subscribe((datos) => {
        this.insumos = datos;
        this.isLoading = false;
      });
    this._tipoInsumo
      .TipoInsumosParaRequisitar(this.idEmpresaInput)
      .subscribe((datos) => {
        this.tipoInsumos = datos;
        this.isLoading = false;
      });
    this._explosionInsumos
      .explosionDeInsumos(this.idProyectoInput, this.idEmpresaInput)
      .subscribe((datos) => {
        this.explocionInsumos = datos;
        this.explocionInsumosparaRequisicion = this.explocionInsumos.filter(
          (z) =>
            z.idTipoInsumo != 10000 &&
            z.idTipoInsumo != 3 &&
            z.idTipoInsumo != 10001
        );
        this.isLoading = false;
      });
    this.cargarRegistros();
  }

  cargarRegistros() {
    this.entradasalmacen = [];

    if (this.idProyectoInput > 0 && this.idRequisicionInput == 0) {
      this._almacenEntrada
        .ObtenXIdProyecto(this.idEmpresaInput, this.idProyectoInput)
        .subscribe((datos) => {
          this.entradasalmacen = datos;
          this.entradasAlmancenRespaldo = datos;
          this.fitrarTipoEA();
        });
    } else {
      if (
        this.idRequisicionInput > 0 &&
        this.idEmpresaInput > 0 &&
        this.idOrdenCompraInput <= 0
      ) {
        this._almacenEntrada
          .ObtenXIdRequisicion(this.idEmpresaInput, this.idRequisicionInput)
          .subscribe((datos) => {
            this.entradasalmacen = datos;
            console.log('estas son las entradas', this.entradasalmacen);
            this.entradasAlmancenRespaldo = datos;
            this.fitrarTipoEA();
          });
      } else {
        this._almacenEntrada
          .ObtenXIdOrdenCompra(this.idEmpresaInput, this.idOrdenCompraInput)
          .subscribe((datos) => {
            this.entradasalmacen = datos;
            this.entradasAlmancenRespaldo = datos;
            this.fitrarTipoEA();
          });
      }
    }
  }

  SeleccionaAlmacen(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    const selectedValue = inputElement.value;
    const idAlmacen =
      this.almacenes.find((almacen) => almacen.almacenNombre === selectedValue)
        ?.id || 0;
    this.idAlmacen = idAlmacen;
    this.fitrarTipoEA();
  }

  NuevaEntradaAlmacen() {
    if (this.idAlmacen != 0) {
      this.almacenEntradaCreacion.listaInsumosEnAlmacenEntrada = [];
      this.almacenEntradaCreacion.idAlmacen = this.idAlmacen;
      this.almacenEntradaCreacion.idContratista = 0;
      this.almacenEntradaCreacion.observaciones = '';

      this._almacenEntrada
        .crear(this.idEmpresaInput, this.almacenEntradaCreacion)
        .subscribe((datos) => {
          if (datos.estatus) {
            this.cargarRegistros();
          } else {
            Swal.fire({
              title: 'Error',
              text: datos.descripcion,
              icon: 'error',
            });
          }
        });
    } else {
      Swal.fire({
        text: 'Seleccione el almacén',
        icon: 'error',
      });
    }
  }

  NuevoAjusteAlmacen() {
    if (this.idAlmacen != 0) {
      this.almacenEntradaCreacion.listaInsumosEnAlmacenEntrada = [];
      this.almacenEntradaCreacion.idAlmacen = this.idAlmacen;
      this.almacenEntradaCreacion.idContratista = 0;
      this.almacenEntradaCreacion.observaciones = '';

      this._almacenEntrada
        .CrearAjusteEntradaAlmacen(
          this.idEmpresaInput,
          this.almacenEntradaCreacion
        )
        .subscribe((datos) => {
          if (datos.estatus) {
            this.cargarRegistros();
          } else {
            Swal.fire({
              title: 'Error',
              text: datos.descripcion,
              icon: 'error',
            });
          }
        });
    } else {
      Swal.fire({
        text: 'Seleccione el almacén',
        icon: 'error',
      });
    }
  }

  // SeleccionaContratista(event: Event){
  //   const inputElement = event.target as HTMLInputElement;
  //   const selectedValue = inputElement.value;
  //   const idContratista = this.contratista.find(contratista => contratista.representanteLegal === selectedValue)?.id || 0;
  //   this.idContratista = idContratista;
  // }

  actualizarEntradaAlmacen(entradaAlmacen: AlmacenEntradaDTO) {
    if (entradaAlmacen.estatus == 1) {
      if (entradaAlmacen.idContratista == 0) {
        let idContratista = this.contratista.find(
          (z) => z.representanteLegal == entradaAlmacen.representanteLegal
        );

        if (idContratista && entradaAlmacen.representanteLegal != '') {
          entradaAlmacen.idContratista = idContratista.id;
        } else {
          return;
        }
      }
    }
    this._almacenEntrada
      .EditarAlmacenEntrada(this.idEmpresaInput, entradaAlmacen)
      .subscribe((datos) => {
        if (datos.estatus) {
          this.cargarRegistros();
        } else {
          Swal.fire({
            text: datos.descripcion,
            icon: 'error',
          });
        }
        this.cargarRegistros();
      });
  }

  Recibir(insumoEntra: insumoXOrdenCompraDTO) {
    let insumoEntradaalmacen: AlmacenEntradaInsumoCreacionDTO = {
      idInsumo: insumoEntra.idInsumo,
      descripcion: insumoEntra.descripcion,
      unidad: insumoEntra.unidad,
      idTipoInsumo: 0,
      cantidadPorRecibir: insumoEntra.cantidad,
      cantidadRecibida: insumoEntra.cantidadRecibida,
      idOrdenCompra: insumoEntra.idOrdenCompra,
      idInsumoXOrdenCompra: insumoEntra.id,
      idAlmacenEntrada: this.idEntradaAlmacen,
    };

    if (
      insumoEntradaalmacen.cantidadRecibida != 0 &&
      insumoEntradaalmacen.cantidadRecibida != null
    ) {
      this._alamcenEntradaInsumoServie
        .CrearInsumoEntradaAlmacen(this.idEmpresaInput, insumoEntradaalmacen)
        .subscribe((datos) => {
          if (datos.estatus) {
            this.ObtenerInsumosComprados();
            this.appRegarga += 1;
          } else {
            Swal.fire({
              text: datos.descripcion,
              icon: 'error',
            });
          }
        });
    } else {
      Swal.fire({
        text: 'Cantidad incorrecta',
        icon: 'error',
      });
    }
  }

  verTodos() {
    this.valueChangeTodosEA.emit(0);
  }

  VerInsumosXEntradaAlmacen(almacenEntrada: AlmacenEntradaDTO) {
    this.idContratista = almacenEntrada.idContratista;
    this.changeColor = almacenEntrada.id;
    this.idEntradaAlmacen = almacenEntrada.id;
    this.EntradaAlmacenSeleccionada = true;

    this.insumosEstado = !this.insumosEstado;
    console.log('abriendo insumos', this.insumosEstado);

    if (almacenEntrada.estatus == 1) {
      this.esAjusteAlmacen = false;
      this.ObtenerInsumosComprados();
    }
    if (almacenEntrada.estatus == 3) {
      this.esAjusteAlmacen = false;
    }
    if (almacenEntrada.estatus == 2) {
      this.esAjusteAlmacen = true;
      this.insumosCompradosContratista = [];
    }

    this.appRegarga = this.appRegarga + 1;
  }

  CerrarInsumosXEntradaAlmacen() {
    this.EntradaAlmacenSeleccionada = false;
    this.changeColor = null;
    this.esAjusteAlmacen = false;
    this.insumosEstado = !this.insumosEstado;
    console.log('cerrando insumos', this.insumosEstado);
  }

  informacionInsumo(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    const selectedValue = inputElement.value;
    const idInsumo =
      this.insumos.find((insumo) => insumo.descripcion == selectedValue)?.id ||
      0;

    let insumo = this.explocionInsumosparaRequisicion.filter(
      (insumo) => insumo.id == idInsumo
    );

    if (idInsumo) {
      if (this.insumoAjusteAlmacen.descripcion == insumo[0].descripcion) {
        this.insumoAjusteAlmacen.unidad = insumo[0].unidad;
        this.insumoAjusteAlmacen.idInsumo = insumo[0].id;
        this.insumoAjusteAlmacen.idTipoInsumo = insumo[0].idTipoInsumo;
        return;
      }
    } else {
      this.insumoAjusteAlmacen.unidad = '';
      this.insumoAjusteAlmacen.idTipoInsumo = 0;
      this.insumoAjusteAlmacen.cantidadRecibida = 0;
      this.insumoAjusteAlmacen.idInsumo = 0;
    }
  }

  guardarInsumoAjusteAlmacen() {
    this.insumoAjusteAlmacen.idAlmacenEntrada = this.idEntradaAlmacen;
    if (
      this.insumoAjusteAlmacen.descripcion == null ||
      this.insumoAjusteAlmacen.descripcion == '' ||
      this.insumoAjusteAlmacen.unidad == null ||
      this.insumoAjusteAlmacen.unidad == '' ||
      this.insumoAjusteAlmacen.cantidadRecibida == 0 ||
      this.insumoAjusteAlmacen.cantidadRecibida == null ||
      this.insumoAjusteAlmacen.idTipoInsumo == 0 ||
      this.insumoAjusteAlmacen.idTipoInsumo == null
    ) {
      Swal.fire({
        text: 'Datos incorrectos',
        icon: 'error',
      });
    } else {
      this._alamcenEntradaInsumoServie
        .CrearInsumoAjusteAlmacen(this.idEmpresaInput, this.insumoAjusteAlmacen)
        .subscribe((datos) => {
          if (datos.estatus) {
            this.limpiarInsumoAjuste();
            this.appRegarga += 1;
          } else {
            Swal.fire({
              text: datos.descripcion,
              icon: 'error',
            });
          }
        });
    }
  }

  limpiarInsumoAjuste() {
    this.insumoAjusteAlmacen.idInsumo = 0;
    this.insumoAjusteAlmacen.idAlmacenEntrada = 0;
    this.insumoAjusteAlmacen.descripcion = '';
    this.insumoAjusteAlmacen.unidad = '';
    this.insumoAjusteAlmacen.idTipoInsumo = 0;
    this.insumoAjusteAlmacen.cantidadPorRecibir = 0;
    this.insumoAjusteAlmacen.cantidadRecibida = 0;
    this.insumoAjusteAlmacen.idOrdenCompra = 0;
    this.insumoAjusteAlmacen.idInsumoXOrdenCompra = 0;
  }

  ObtenerInsumosComprados() {
    this.insumoXordenCompraServide
      .obtenerXIdContratista(
        this.idEmpresaInput,
        this.idContratista,
        this.idProyectoInput
      )
      .subscribe((datos) => {
        this.insumosCompradosContratista = datos;
        this.insumosCompradosContratista.forEach((element) => {
          element.cantidadRecibida = 0;
        });
      });
  }

  fitrarTipoEA() {
    this.idEntradaAlmacen = 0;
    this.changeColor = 0;
    this.esAjusteAlmacen = false;
    this.EntradaAlmacenSeleccionada = false;
    this.insumosCompradosContratista = [];

    this.entradasalmacen = this.entradasAlmancenRespaldo;
    this.filtroAlmacen();

    if (this.tipoEntradaAlmacen == 0) {
      if (this.fechafiltro == undefined) {
        return;
      } else {
        var entradasA = this.entradasalmacen.filter(
          (z) =>
            formatDate(z.fechaRegistro, 'yyyy-MM-dd', 'en_US') ==
            formatDate(this.fechafiltro, 'yyyy-MM-dd', 'en_US')
        );
        if (entradasA.length <= 0) {
          this.entradasalmacen = [];
          return;
        } else {
          this.entradasalmacen = entradasA;
        }
      }
    } else {
      var entradasA = this.entradasalmacen.filter(
        (z) => z.estatus == this.tipoEntradaAlmacen
      );
      this.entradasalmacen = entradasA;
      if (entradasA.length <= 0) {
        this.entradasalmacen = [];
        return;
      } else {
        if (this.fechafiltro != undefined) {
          var entradasAfecha = entradasA.filter(
            (z) =>
              formatDate(z.fechaRegistro, 'yyyy-MM-dd', 'en_US') ==
              formatDate(this.fechafiltro, 'yyyy-MM-dd', 'en_US')
          );
          if (entradasAfecha.length <= 0) {
            this.entradasalmacen = [];
          } else {
            this.entradasalmacen = entradasAfecha;
          }
        }
      }
    }
  }

  filtroAlmacen() {
    if (this.idAlmacen != 0) {
      let porAlmacen = this.entradasalmacen.filter(
        (z) => z.idAlmacen == this.idAlmacen
      );
      this.entradasalmacen = porAlmacen;
    }
  }
}
