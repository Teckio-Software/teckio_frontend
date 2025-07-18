import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ConfCuentaContableComponent } from '../conf-cuenta-contable/conf-cuenta-contable/conf-cuenta-contable.component';

import { DatosEmpleadoComponent } from './datos-empleado/datos-empleado.component';

const routes: Routes = [
  { path: '', component: DatosEmpleadoComponent }
  ,
  {
    path: 'conf-contable2',
    loadChildren: () => import(`../conf-cuenta-contable/conf-cuenta-contable.module`).then(
      module => module.ConfCuentaContableModule
    )
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DatosEmpleadoRoutingModule { }