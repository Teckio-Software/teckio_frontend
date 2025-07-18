import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CuentaContableComponent } from './cuenta-contable/cuenta-contable.component';

const routes: Routes = [
  { path: '', component: CuentaContableComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CuentaContableRoutingModule { }
