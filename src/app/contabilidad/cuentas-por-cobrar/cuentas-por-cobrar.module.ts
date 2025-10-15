import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { CuentasPorCobrarRoutingModule } from './cuentas-por-cobrar-routing.module';
import { NuevaCuentaComponent } from './components/nueva-cuenta/nueva-cuenta.component';
import { CuentaFormComponent } from './components/cuenta-form/cuenta-form.component';
import { CuentaDetailsComponent } from './components/cuenta-details/cuenta-details.component';

@NgModule({
  declarations: [],
  imports: [CommonModule, CuentasPorCobrarRoutingModule],
})
export class CuentasPorCobrarModule {}
