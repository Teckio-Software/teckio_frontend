import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductosRoutingModule } from './productos/productos-routing.module';
import { VentasRoutingModule } from './ventas/ventas-routing.module';
import { ProductosServiciosRoutingModule } from './productos-servicios/productos-servicios.routing';
import { FormsModule } from '@angular/forms';
import { AlertComponent } from '../utilidades/alert/alert.component';
import { AppBar } from '@mui/material';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    ProductosRoutingModule,
    VentasRoutingModule,
    ProductosServiciosRoutingModule,
  ],
})
export class GestionVentasModule {}
