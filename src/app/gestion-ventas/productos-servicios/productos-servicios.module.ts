import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductosServiciosRoutingModule } from './productos-servicios.routing';
import { ProductosServiciosComponent } from './productos-servicios.component';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { FormsModule } from '@angular/forms';
import { AlertComponent } from 'src/app/utilidades/alert/alert.component';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    ProductosServiciosRoutingModule,
    ScrollingModule,
    FormsModule,
  ],
})
export class ProductosServiciosModule {}
