import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AlmacenEntradaRoutingModule } from './almacen-entrada-routing.module';
import { AlmacenesEntradasComponent } from './almacenes-entradas/almacenes-entradas.component';
import { AlmaceneEntradaInsumosComponent } from './almacene-entrada-insumos/almacene-entrada-insumos.component';
import { AjusteEntradaAlmacenComponent } from './ajuste-entrada-almacen/ajuste-entrada-almacen.component';
import { DevolucionPrestamosComponent } from './devolucion-prestamos/devolucion-prestamos.component';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    AlmacenEntradaRoutingModule
  ]
})
export class AlmacenEntradaModule { }
