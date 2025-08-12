import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductosServiciosRoutingModule } from './productos-servicios.routing';
import { ProductosServiciosComponent } from './productos-servicios.component';
import { ScrollingModule } from '@angular/cdk/scrolling';

@NgModule({
  declarations: [ProductosServiciosComponent],
  imports: [CommonModule, ProductosServiciosRoutingModule, ScrollingModule],
})
export class ProductosServiciosModule {}
