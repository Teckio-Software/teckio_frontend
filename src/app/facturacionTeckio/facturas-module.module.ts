import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FacturasModuleRoutingModule } from './facturas-module-routing.module';
import { FacturaComplementoPagoComponent } from './facturas-teckio/factura-complemento-pago/factura-complemento-pago.component';
import { FacturaDetalleComponent } from './facturas-teckio/factura-detalle/factura-detalle.component';

@NgModule({
  declarations: [],
  imports: [CommonModule, FacturasModuleRoutingModule],
})
export class FacturasModuleModule {}
