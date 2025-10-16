import { Component, ElementRef, ViewChild, HostListener } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MovimientoBancarioService } from '../movimiento-bancario.service';
import { MovimientoBancarioTeckioDTO } from '../tsMovimientoBancario';
import { SeguridadService } from 'src/app/seguridad/seguridad.service';
import { CuentaBancariaBaseDTO } from '../../cuentabancaria/cuentabancaria';
import { CuentabancariaEmpresaService } from '../../cuentabancaria/cuentabancaria-empresa/cuentabancaria-empresa.service';
import { formatDate } from '@angular/common';
import { PolizaService } from 'src/app/contabilidad/poliza/poliza.service';
import { AlertaTipo } from 'src/app/utilidades/alert/alert.component';

@Component({
  selector: 'app-movimiento-bancario',
  templateUrl: './movimiento-bancario.component.html',
  styleUrls: ['./movimiento-bancario.component.css'],
})
export class MovimientoBancarioComponent {
  selectedEmpresa = 0;
  cuentaBE: CuentaBancariaBaseDTO[] = [];
  filteredCuentas: CuentaBancariaBaseDTO[] = [];

  idCuentaBancaria = 0;
  cuentaSeleccionada = false;
  moviminestosbancarios: MovimientoBancarioTeckioDTO[] = [];
  mostrarFormularioNuevo = false;

  @ViewChild('cuentaInput') cuentaInput?: ElementRef<HTMLInputElement>;
  @ViewChild('cuentaWrapper') cuentaWrapper?: ElementRef<HTMLElement>;

  range = new FormGroup({
    start: new FormControl(),
    end: new FormControl(),
  });

  fechaInicio!: Date | string;
  fechaFin!: Date | string;
  showLista = false;

  alertaSuccess: boolean = false;
      alertaMessage: string = '';
      alertaTipo: AlertaTipo = AlertaTipo.none;
      AlertaTipo = AlertaTipo;

  constructor(
    private _seguridadEmpresa: SeguridadService,
    private _CuentaBancariaEmpresa: CuentabancariaEmpresaService,
    private _MovimientoBancario: MovimientoBancarioService,
    private _PolizaService: PolizaService,
  ) {
    const idEmpresa = this._seguridadEmpresa.obtenIdEmpresaLocalStorage();
    this.selectedEmpresa = Number(idEmpresa);
  }

  ngOnInit(): void {
    this._CuentaBancariaEmpresa.ObtenerTodos(this.selectedEmpresa).subscribe((datos) => {
      this.cuentaBE = datos;
      this.filteredCuentas = [...datos];
    });
  }

  CargarRegistros() {
    this._MovimientoBancario
      .ObtenerXIdCuentaBancaria(this.selectedEmpresa, this.idCuentaBancaria)
      .subscribe((datos) => {
        this.moviminestosbancarios = datos;
      });
  }

  /**
   * Handler único:
   * - Si viene de Event: filtra en vivo y, si el texto coincide EXACTO con una cuenta, la selecciona.
   * - Si viene de objeto Cuenta: selecciona directamente.
   */
  SeleccionarCuenta(source: Event | CuentaBancariaBaseDTO) {
    let cuentaSeleccionada: CuentaBancariaBaseDTO | undefined;

    if (source instanceof Event) {
      const inputEl = source.target as HTMLInputElement;
      const value = (inputEl.value ?? '').trim();
      const termino = value.toLowerCase();

      // Filtrado en vivo
      this.filteredCuentas = this.cuentaBE.filter((c) =>
        [c.numeroCuenta, c.clabe, c.nombreBanco].some((campo) =>
          (campo ?? '').toLowerCase().includes(termino),
        ),
      );

      this.showLista = true;

      // Si coincide exactamente con una cuenta, seleccionar
      const match = this.cuentaBE.find((c) => c.numeroCuenta === value);
      if (!value) {
        // campo vacío: mostrar todo
        this.filteredCuentas = [...this.cuentaBE];
        return;
      }
      if (!match) return; // aún escribiendo, no seleccionar

      cuentaSeleccionada = match;
    } else {
      cuentaSeleccionada = source;
      // pintar valor en input
      if (this.cuentaInput) {
        this.cuentaInput.nativeElement.value = cuentaSeleccionada.numeroCuenta;
      }
    }

    // Selección final
    if (!cuentaSeleccionada) return;

    this.idCuentaBancaria = cuentaSeleccionada.id;
    this.cuentaSeleccionada = true;
    this.showLista = false;

    // Al volver a enfocar, mostrar todas
    this.filteredCuentas = [...this.cuentaBE];

    this.CargarRegistros();
  }

  onInputFocus() {
    // Al enfocar, abrir y mostrar todo
    this.showLista = true;
    this.filteredCuentas = [...this.cuentaBE];
  }

  abrirModalMovimientoBancario(): void {
    if (this.idCuentaBancaria <= 0) return;
    this.mostrarFormularioNuevo = true;
  }

  cerrarFormularioNuevoMovimiento(recargar = false) {
    this.mostrarFormularioNuevo = false;
    if (recargar) this.CargarRegistros();
  }

  autorizarMovimientoBancario(idMovimientoBancario: number) {
    this._MovimientoBancario
      .AutorizarMovimientoBancario(this.selectedEmpresa, idMovimientoBancario)
      .subscribe((datos) => {
        if (datos.estatus) this.limpiarFiltro();
        else console.log(datos.descripcion);
      });
  }

  cancelarMovimientoBancario(idMovimientoBancario: number) {
    this._MovimientoBancario
      .CancelarXIdMovimientoBancario(this.selectedEmpresa, idMovimientoBancario)
      .subscribe((datos) => {
        if (datos.estatus) this.limpiarFiltro();
        else console.log(datos.descripcion);
      });
  }

  generarPoliza(idMovimientoBancario: number) {
    this._PolizaService
      .GenerarPolizaXIdMovimientoBancario(this.selectedEmpresa, idMovimientoBancario)
      .subscribe((datos) => {
        if (datos.estatus) this.CargarRegistros();
        if(!datos.estatus){
              this.alerta(AlertaTipo.save, datos.descripcion);
        }
      });
  }

  eliminarPoliza(idMovimientoBancario: number) {
    this._PolizaService
      .EliminarPolizaXIdMovimientoBancario(this.selectedEmpresa, idMovimientoBancario)
      .subscribe((datos) => {
        if (datos.estatus) this.CargarRegistros();
      });
  }

  clickButtonFiltro() {
    const fi = this.range.get('start')?.value;
    const ff = this.range.get('end')?.value;

    if (fi && ff) {
      this.fechaInicio = formatDate(fi, 'yyyy-MM-dd', 'en_US');
      this.fechaFin = formatDate(ff, 'yyyy-MM-dd', 'en_US');

      this._MovimientoBancario
        .ObtenerXIdCuentaBancariaYFiltro(
          this.selectedEmpresa,
          this.idCuentaBancaria,
          this.fechaInicio,
          this.fechaFin,
        )
        .subscribe((datos) => (this.moviminestosbancarios = datos));
    } else {
      this.CargarRegistros();
    }
  }

  limpiarFiltro() {
    this.range.reset();
    this.CargarRegistros();
  }

  ElegirCuenta(cuenta: CuentaBancariaBaseDTO) {
    // Click en opción -> seleccionar y cerrar
    this.SeleccionarCuenta(cuenta);
    this.showLista = false;
  }

  // Cerrar lista si clic fuera del wrapper
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event) {
    const target = event.target as Node;
    const dentro = !!this.cuentaWrapper?.nativeElement.contains(target);
    if (!dentro) this.showLista = false;
  }

  alerta(tipo: AlertaTipo, mensaje: string = '') {
        if (tipo === AlertaTipo.none) {
          this.cerrarAlerta();
          return;
        }

        this.alertaTipo = tipo;
        this.alertaMessage = mensaje || 'Ocurrió un error';
        this.alertaSuccess = true;

        setTimeout(() => {
          this.cerrarAlerta();
        }, 2500);
      }

      cerrarAlerta() {
    this.alertaSuccess = false;
    this.alertaTipo = AlertaTipo.none;
    this.alertaMessage = '';
  }
}
