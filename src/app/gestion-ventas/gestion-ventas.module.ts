import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductosRoutingModule } from './productos/productos-routing.module';
import { VentasRoutingModule } from './ventas/ventas-routing.module';

@NgModule({
  declarations: [],
  imports: [CommonModule, ProductosRoutingModule, VentasRoutingModule],
})
export class GestionVentasModule {}
