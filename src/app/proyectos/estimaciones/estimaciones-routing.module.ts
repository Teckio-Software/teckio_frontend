import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EstimacionesComponent } from "./estimaciones/estimaciones.component";

const routes: Routes = [
  { path: '', component: EstimacionesComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EstimacionesRoutingModule { }
