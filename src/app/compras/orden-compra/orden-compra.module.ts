import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OrdenCompraRoutingModule } from './orden-compra-routing.module';
import { ModalOrdenCompraComponent } from './ordenes-compras/modal-orden-compra/modal-orden-compra.component';
import { OrdenCompraComponent } from './orden-compra/orden-compra.component';

@NgModule({
  declarations: [ModalOrdenCompraComponent],
  imports: [CommonModule, OrdenCompraRoutingModule],
  exports: [ModalOrdenCompraComponent],
})
export class OrdenCompraModule {}
