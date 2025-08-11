import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductosServiciosRoutingModule } from './productos-servicios.routing';
import { ProductosServiciosComponent } from './productos-servicios.component';

@NgModule({
  declarations: [ProductosServiciosComponent],
  imports: [CommonModule, ProductosServiciosRoutingModule],
})
export class ProductosServiciosModule {}
