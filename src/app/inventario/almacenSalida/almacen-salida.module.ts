import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AlmacenSalidaRoutingModule } from './almacen-salida-routing.module';
import { AlmacenesSalidasComponent } from './almacenes-salidas/almacenes-salidas.component';
import { AlmacenSalidaInsumosComponent } from './almacen-salida-insumos/almacen-salida-insumos.component';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    AlmacenSalidaRoutingModule
  ]
})
export class AlmacenSalidaModule { }
