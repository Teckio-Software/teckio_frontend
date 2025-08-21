import { Component, EventEmitter, Input, Output } from '@angular/core';
import {
  almacenSalidaCreacionDTO,
  almacenSalidaDTO,
  insumosExistenciaDTO,
} from '../tsAlmacenSalida';
import { AlmacenSalidaService } from '../almacen-salida.service';
import { formatDate } from '@angular/common';
import { AlmacenService } from '../../almacen/almacen.service';
import { almacenDTO } from '../../almacen/almacen';
import Swal from 'sweetalert2';
import { almacenSalidaInsumosCreacionDTO } from '../../almacenSalidaInsumos/tsAlmacenSalidaInsumos';
import { AlmacenSalidaInsumosService } from '../../almacenSalidaInsumos/almacen-salida-insumos.service';
import { faL } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-almacenes-salidas',
  templateUrl: './almacenes-salidas.component.html',
  styleUrls: ['./almacenes-salidas.component.css'],
})
export class AlmacenesSalidasComponent {
  @Input()
  idProyectoInput: number = 0;

  @Input()
  idEmpresaInput: number = 0;

  @Output() valueChangeInsumosSA = new EventEmitter();

  salidasalmacen!: almacenSalidaDTO[];
  salidasalmacenConPrestamos!: almacenSalidaDTO[];
  salidasalmacenRespaldo!: almacenSalidaDTO[];
  insumosDisponibles: insumosExistenciaDTO[] = [];
  insumoInformacion: insumosExistenciaDTO = {
    idInsumo: 0,
    codigo: '',
    descripcion: '',
    unidad: '',
    cantidadDisponible: 0,
    esPrestamo: false,
    cantidadPorSalir: 0,
  };

  changeColor: any = null;
  appRegarga: number = 0;
  idSalidaAlmacen: number = 0;

  tipoSalidaAlmacen: number = 0;
  fechafiltro!: Date;

  almacenes!: almacenDTO[];
  idAlmacen: number = 0;
  esBaja: boolean = false;

  almacenSalidaCreacion: almacenSalidaCreacionDTO = {
    personaRecibio: '',
    ListaAlmacenSalidaInsumoCreacion: [],
    idAlmacen: 0,
    observaciones: '',
    esBaja: false,
  };

  insumoSalidaCreacion: almacenSalidaInsumosCreacionDTO = {
    idInsumo: 0,
    cantidadPorSalir: 0,
    esPrestamo: false,
    idSalidaAlmacen: 0,
  };

  isLoading: boolean = true;

  constructor(
    public _almacenSalida: AlmacenSalidaService,
    private almacenService: AlmacenService,
    private _almacenSalidaInsumo: AlmacenSalidaInsumosService
  ) {}

  ngOnInit() {
    this.cargarRegistros();
    this.cargarRegistrosSalidasConPrestamos();
    this.almacenService
      .obtenerXIdProyecto(this.idProyectoInput, this.idEmpresaInput)
      .subscribe((datos) => {
        this.almacenes = datos;
      });
  }

  cargarRegistros() {
    this.salidasalmacen = [];
    this._almacenSalida
      .ObtenXIdProyecto(this.idEmpresaInput, this.idProyectoInput)
      .subscribe((datos) => {
        this.salidasalmacen = datos;
        this.salidasalmacenRespaldo = datos;
        this.fitrarTipoSA();
        this.isLoading = false;
      });
  }
  cargarRegistrosSalidasConPrestamos() {
    this.salidasalmacenConPrestamos = [];
    this._almacenSalida
      .ObtenXIdProyectoSalidasConPrestamos(
        this.idEmpresaInput,
        this.idProyectoInput
      )
      .subscribe((datos) => {
        this.salidasalmacenConPrestamos = datos;
      });
  }

  SeleccionaAlmacen(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    const selectedValue = inputElement.value;
    const idAlmacen =
      this.almacenes.find((almacen) => almacen.almacenNombre === selectedValue)
        ?.id || 0;
    this.idAlmacen = idAlmacen;
    this.cargarInsumosDisponibles();
    this.fitrarTipoSA();
  }

  cargarInsumosDisponibles() {
    if (this.idAlmacen != 0) {
      this._almacenSalida
        .obtenerInsumosDisponibles(this.idEmpresaInput, this.idAlmacen)
        .subscribe((datos) => {
          this.insumosDisponibles = datos;
          console.log('insumos disponibles', this.insumosDisponibles);
        });
    }
  }

  VerInsumosXSalidaAlmacen(salidaAlmacen: almacenSalidaDTO) {
    this.changeColor = salidaAlmacen.id;
    this.idSalidaAlmacen = salidaAlmacen.id;
    if (salidaAlmacen.estatus == 2) {
      console.log('es baja');
      this.esBaja = true;
    } else {
      this.esBaja = false;
    }
    this.appRegarga += 1;
  }

  NuevaSalidaAlmacen() {
    this.almacenSalidaCreacion.idAlmacen = this.idAlmacen;
    this.almacenSalidaCreacion.observaciones = '';
    this.almacenSalidaCreacion.personaRecibio = '';
    this.almacenSalidaCreacion.esBaja = false;

    this._almacenSalida
      .CrearAlmacenSalida(this.idEmpresaInput, this.almacenSalidaCreacion)
      .subscribe((datos) => {
        if (datos.estatus) {
          this.cargarRegistros();
          this.cargarRegistrosSalidasConPrestamos();
        } else {
          Swal.fire({
            text: datos.descripcion,
            icon: 'error',
          });
        }
      });
  }
  NuevaBajaAlmacen() {
    this.almacenSalidaCreacion.idAlmacen = this.idAlmacen;
    this.almacenSalidaCreacion.observaciones = '';
    this.almacenSalidaCreacion.personaRecibio = '';
    this.almacenSalidaCreacion.esBaja = true;

    this._almacenSalida
      .CrearAlmacenSalida(this.idEmpresaInput, this.almacenSalidaCreacion)
      .subscribe((datos) => {
        if (datos.estatus) {
          this.cargarRegistros();
          this.cargarRegistrosSalidasConPrestamos();
        } else {
          Swal.fire({
            text: datos.descripcion,
            icon: 'error',
          });
        }
      });
  }

  actualizarSalidaAlmacen(almacenSalida: almacenSalidaDTO) {
    this._almacenSalida
      .EditarAlmacenSalida(this.idEmpresaInput, almacenSalida)
      .subscribe((datos) => {
        if (datos.estatus) {
          this.cargarRegistros();
        } else {
          Swal.fire({
            text: datos.descripcion,
            icon: 'error',
          });
        }
      });
  }

  informacionInsumo(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    const selectedValue = inputElement.value;
    const insumo = this.insumosDisponibles.find(
      (insumo) =>
        insumo.descripcion.replace(/ /g, '') == selectedValue.replace(/ /g, '')
    );
    if (insumo) {
      this.insumoInformacion.idInsumo = insumo.idInsumo;
      this.insumoInformacion.codigo = insumo.codigo;
      this.insumoInformacion.descripcion = insumo.descripcion;
      this.insumoInformacion.unidad = insumo.unidad;
      this.insumoInformacion.cantidadDisponible = insumo.cantidadDisponible;
      this.insumoInformacion.cantidadPorSalir = 0;
    } else {
      this.limpiarInsumoCrear();
    }
  }

  limpiarInsumoCrear() {
    this.insumoInformacion.idInsumo = 0;
    this.insumoInformacion.codigo = '';
    this.insumoInformacion.descripcion = '';
    this.insumoInformacion.unidad = '';
    this.insumoInformacion.cantidadDisponible = 0;
    this.insumoInformacion.cantidadPorSalir = 0;
    this.insumoInformacion.esPrestamo = false;
  }

  guardarSalidaInsumo() {
    if (
      this.insumoInformacion.idInsumo == 0 ||
      this.insumoInformacion.cantidadPorSalir <= 0 ||
      this.insumoInformacion.cantidadDisponible <
        this.insumoInformacion.cantidadPorSalir
    ) {
      Swal.fire({
        text: 'Datos Incorrectos',
        icon: 'error',
      });
    } else {
      this.insumoSalidaCreacion.idInsumo = this.insumoInformacion.idInsumo;
      this.insumoSalidaCreacion.idSalidaAlmacen = this.idSalidaAlmacen;
      this.insumoSalidaCreacion.cantidadPorSalir =
        this.insumoInformacion.cantidadPorSalir;
      this.insumoSalidaCreacion.esPrestamo =
        this.esBaja == true ? false : this.insumoInformacion.esPrestamo;

      this._almacenSalidaInsumo
        .CrearInsumoSalidaAlmacen(
          this.idEmpresaInput,
          this.insumoSalidaCreacion
        )
        .subscribe((datos) => {
          if (datos.estatus) {
            this.limpiarInsumoCrear();
            this.cargarInsumosDisponibles();
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

  fitrarTipoSA() {
    this.changeColor = 0;
    this.idSalidaAlmacen = 0;

    this.salidasalmacen = this.salidasalmacenRespaldo;

    this.filtroAlmacen();

    if (this.tipoSalidaAlmacen == 3) {
      this.salidasalmacen = this.salidasalmacenConPrestamos;
      if (this.fechafiltro == undefined) {
        return;
      } else {
        var salidasA = this.salidasalmacen.filter(
          (z) =>
            formatDate(z.fechaRegistro, 'yyyy-MM-dd', 'en_US') ==
            formatDate(this.fechafiltro, 'yyyy-MM-dd', 'en_US')
        );
        if (salidasA.length <= 0) {
          this.salidasalmacen = [];
        } else {
          this.salidasalmacen = salidasA;
        }
      }
      return;
    }
    if (this.tipoSalidaAlmacen == 0) {
      if (this.fechafiltro == undefined) {
        return;
      } else {
        var salidasA = this.salidasalmacen.filter(
          (z) =>
            formatDate(z.fechaRegistro, 'yyyy-MM-dd', 'en_US') ==
            formatDate(this.fechafiltro, 'yyyy-MM-dd', 'en_US')
        );
        if (salidasA.length <= 0) {
          this.salidasalmacen = [];
          return;
        } else {
          this.salidasalmacen = salidasA;
        }
      }
    } else {
      var entradasA = this.salidasalmacen.filter(
        (z) => z.estatus == this.tipoSalidaAlmacen
      );
      this.salidasalmacen = entradasA;
      if (entradasA.length <= 0) {
        this.salidasalmacen = [];
        return;
      } else {
        if (this.fechafiltro != undefined) {
          var salidasAfecha = entradasA.filter(
            (z) =>
              formatDate(z.fechaRegistro, 'yyyy-MM-dd', 'en_US') ==
              formatDate(this.fechafiltro, 'yyyy-MM-dd', 'en_US')
          );
          if (salidasAfecha.length <= 0) {
            this.salidasalmacen = [];
          } else {
            this.salidasalmacen = salidasAfecha;
          }
        }
      }
    }
  }

  filtroAlmacen() {
    if (this.idAlmacen != 0) {
      let porAlmacen = this.salidasalmacen.filter(
        (z) => z.idAlmacen == this.idAlmacen
      );
      this.salidasalmacen = porAlmacen;
    }
  }
}
