import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ConfCuentaContableComponent } from './conf-cuenta-contable/conf-cuenta-contable.component';

const routes: Routes = [
  { path: '', component: ConfCuentaContableComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ConfCuentaContableRoutingModule { }