import { Component, OnInit } from '@angular/core';
import { PrecioUnitarioService } from '../precio-unitario.service';
import { SeguridadService } from 'src/app/seguridad/seguridad.service';
import { Unidades } from '../unidades';
import { UnidadDTO } from 'src/app/facturacion/unidad/ts.unidad';
import { precioUnitarioDTO } from '../tsPrecioUnitario';

@Component({
  selector: 'app-catalogo-concepto',
  templateUrl: './catalogo-concepto.component.html',
  styleUrls: ['./catalogo-concepto.component.css']
})
export class CatalogoConceptoComponent implements OnInit{
  selectedProyecto = 0;
  selectedEmpresa = 0;
  selectedPU = 0;
  matrizMostrada: boolean = false;
  Unidades: string[] = [];
  preciosUnitarios: precioUnitarioDTO[] = [];
  precioUnitarioCantidadEditado!: precioUnitarioDTO;
  constructor (
    private precioUnitarioService: PrecioUnitarioService
    , private _seguridadEmpresa: SeguridadService
    , private unidades: Unidades
  ){
    let idEmpresa = _seguridadEmpresa.obtenIdEmpresaLocalStorage();
    let idProyecto = _seguridadEmpresa.obtenerIdProyectoLocalStorage();
    this.selectedProyecto = Number(idProyecto);
    this.selectedEmpresa = Number(idEmpresa);
    this.Unidades = this.unidades.Getunidades();
  }

  ngOnInit(): void {
    this.obtenerRegistros();
  }

  obtenerRegistros(){
    this.precioUnitarioService.obtenerEstructurado(this.selectedProyecto, this.selectedEmpresa)
    .subscribe((preciosUnitarios) => {
      this.preciosUnitarios = preciosUnitarios;
    })
  }

  expansionDominio(precioUnitario: precioUnitarioDTO): void {
    precioUnitario.expandido = !precioUnitario.expandido;
  }

  exponerCantidad(precioUnitario:precioUnitarioDTO){
    if(this.precioUnitarioCantidadEditado){
      this.precioUnitarioCantidadEditado.cantidadEditado = false;
    }
    this.precioUnitarioCantidadEditado = precioUnitario;
    precioUnitario.cantidadEditado = true;
  }

  actualizarCantidad(precioUnitario: precioUnitarioDTO, valor: string): void {
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

  mostrarMatriz(precioUnitario: precioUnitarioDTO){
    this.selectedPU = precioUnitario.id;
    this.matrizMostrada = true;
  }
}
