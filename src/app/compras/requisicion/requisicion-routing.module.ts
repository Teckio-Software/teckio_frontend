import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RequisicionComponent } from './requisicion/requisicion.component'

const routes: Routes = [
  { path: '', component: RequisicionComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RequisicionRoutingModule { }
