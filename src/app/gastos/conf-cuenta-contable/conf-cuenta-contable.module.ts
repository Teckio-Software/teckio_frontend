import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfCuentaContableRoutingModule } from './conf-cuenta-contable.routing.module';
import { ConfCuentaContableComponent } from './conf-cuenta-contable/conf-cuenta-contable.component';


@NgModule({
  declarations: [ConfCuentaContableComponent],
  imports: [
    CommonModule,
    ConfCuentaContableRoutingModule
  ],
  exports: [ConfCuentaContableComponent]
})
export class ConfCuentaContableModule { }