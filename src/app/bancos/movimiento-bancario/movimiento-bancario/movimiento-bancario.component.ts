
import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MovimientoBancarioService } from '../movimiento-bancario.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { movimientoBancarioCreacionDTO, movimientoBancarioDTO, MovimientoBancarioTeckioDTO } from '../tsMovimientoBancario';
import { contratistaDTO } from 'src/app/catalogos/contratista/tsContratista';
import { contratistaCuentaBancariaCreacionDTO, contratistaCuentaBancariaDTO, pedidoDTO } from '../../cuentasBancariasContratista/tsCuentaBancariaContratista';
import { MatDialog } from '@angular/material/dialog';
import { ContratistaService } from 'src/app/catalogos/contratista/contratista.service';
import { Observable, map, startWith } from 'rxjs';
import { proyectoDTO } from 'src/app/proyectos/proyecto/tsProyecto';
import { ProyectoService } from 'src/app/proyectos/proyecto/proyecto.service';
import { CuentasBancariasContratistaService } from '../../cuentasBancariasContratista/cuentas-bancarias-contratista.service';
import { PageEvent } from '@angular/material/paginator';
import { HttpResponse } from '@angular/common/http';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { CompraDirectaDTO } from 'src/app/compras/compras/tsComprasDirectas';
import { SeguridadService } from 'src/app/seguridad/seguridad.service';
import { Facturas } from 'src/app/facturacion/facturas/tsFacturas';
import { EmpresaService } from 'src/app/catalogos/empresas/empresa.service';
import { cuentaBancariaDTO } from 'src/app/catalogos/empresas/empresa';
import { NuevoMovimientoBancarioComponent } from '../nuevo-movimiento-bancario/nuevo-movimiento-bancario.component';
import { CuentaBancariaBaseDTO } from '../../cuentabancaria/cuentabancaria';
import { CuentabancariaEmpresaService } from '../../cuentabancaria/cuentabancaria-empresa/cuentabancaria-empresa.service';
import { formatDate } from '@angular/common';
import { da } from 'date-fns/locale';
import { PolizaService } from 'src/app/contabilidad/poliza/poliza.service';


@Component({
  selector: 'app-movimiento-bancario',
  templateUrl: './movimiento-bancario.component.html',
  styleUrls: ['./movimiento-bancario.component.css']
})
export class MovimientoBancarioComponent {

  selectedEmpresa = 0;
  cuentaBE: CuentaBancariaBaseDTO[] = [];
  idCuentaBancaria = 0;
  cuentaSeleccionada = false;
  moviminestosbancarios: MovimientoBancarioTeckioDTO[] = [];

  range = new FormGroup({
    start: new FormControl,
    end: new FormControl,
  });

  fechaInicio !: Date | string;
  fechaFin !: Date | string;

  constructor(
    private _seguridadEmpresa: SeguridadService,
    private dialog: MatDialog,
    private _CuentaBancariaEmpresa: CuentabancariaEmpresaService,
    private _MovimientoBancario: MovimientoBancarioService,
    private _PolizaService : PolizaService
  ) {
    let idEmpresa = this._seguridadEmpresa.obtenIdEmpresaLocalStorage();
    this.selectedEmpresa = Number(idEmpresa);
  }

  ngOnInit(): void {
    this._CuentaBancariaEmpresa.ObtenerTodos(this.selectedEmpresa).subscribe((datos) => {
      this.cuentaBE = datos;
    });
  }

  CargarRegistros() {
    this._MovimientoBancario.ObtenerXIdCuentaBancaria(this.selectedEmpresa, this.idCuentaBancaria).subscribe((datos) => {
      this.moviminestosbancarios = datos;
    });
  }

  SeleccionarCuenta(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    const selectedValue = inputElement.value;
    const idCuentaBE = this.cuentaBE.find(cuenta => cuenta.numeroCuenta === selectedValue)?.id || 0;
    this.idCuentaBancaria = idCuentaBE;
    this.cuentaSeleccionada = true;
    if (this.idCuentaBancaria > 0) {
      this.CargarRegistros();
    }
  }

  abrirModalMovimientoBancario(): void {
    const dialogRef = this.dialog.open(NuevoMovimientoBancarioComponent, {
      data: {
        idEmpresa: this.selectedEmpresa,
        idCeuntaBancariaEmpresa: this.idCuentaBancaria,
      }
    });
    dialogRef.afterClosed().subscribe((resultado: boolean) => {
      this.limpiarFiltro();
    });
  }

  autorizarMovimientoBancario(idMovimientoBancario: number) {
    this._MovimientoBancario.AutorizarMovimientoBancario(this.selectedEmpresa, idMovimientoBancario).subscribe((datos) => {
      if (datos.estatus) {
        this.limpiarFiltro();
      } else {
        console.log(datos.descripcion);
      }
    });
  }

  cancelarMovimientoBancario(idMovimientoBancario: number) {
    this._MovimientoBancario.CancelarXIdMovimientoBancario(this.selectedEmpresa, idMovimientoBancario).subscribe((datos) => {
      if (datos.estatus) {
        this.limpiarFiltro();
      } else {
        console.log(datos.descripcion);
      }
    });
  }

  generarPoliza(idMovimientoBancario : number){
    this._PolizaService.GenerarPolizaXIdMovimientoBancario(this.selectedEmpresa, idMovimientoBancario).subscribe((datos) => {
      if(datos.estatus){
        this.CargarRegistros();
      }
    });
  }

  eliminarPoliza(idMovimientoBancario : number){
    this._PolizaService.EliminarPolizaXIdMovimientoBancario(this.selectedEmpresa, idMovimientoBancario).subscribe((datos) => {
      if(datos.estatus){
        this.CargarRegistros();
      }
    });
  }

  clickButtonFiltro() {
    if ((typeof this.range.get("start")?.value != 'undefined' && this.range.get("start")?.value != null) && (typeof this.range.get("end")?.value != 'undefined' && this.range.get("end")?.value != null)) {
      this.fechaInicio = formatDate(this.range.get("start")?.value, 'yyyy-MM-dd', 'en_US');
      this.fechaFin = formatDate(this.range.get("end")?.value, 'yyyy-MM-dd', 'en_US');

      this._MovimientoBancario.ObtenerXIdCuentaBancariaYFiltro(this.selectedEmpresa, this.idCuentaBancaria, this.fechaInicio, this.fechaFin).subscribe((datos) => {
        this.moviminestosbancarios = datos;
        console.log("estos son los MB con Filtro", this.moviminestosbancarios);
      });
    }else{
      this.CargarRegistros();
    }
  }

  limpiarFiltro() { 
    this.range.reset();
    this.clickButtonFiltro();
  }


}
