import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { CuentaContableGastosComponent } from './cuenta-contable/cuenta-contableGastos.component';

const routes: Routes = [
  { path: '', component: CuentaContableGastosComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CuentaContableRoutingModule { }