import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ConfCentroCostosComponent } from './conf-centro-costos/conf-centro-costos.component';

const routes: Routes = [
  { path: '', component: ConfCentroCostosComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ConfCentroCostosRoutingModule { }