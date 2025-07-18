import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { CentroCostosComponent } from './centro-costos/centro-costos.component';

const routes: Routes = [
  { path: '', component: CentroCostosComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CentroCostosRoutingModule { }