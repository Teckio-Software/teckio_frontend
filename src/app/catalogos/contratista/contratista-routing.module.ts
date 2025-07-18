import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ContratistaComponent } from './contratista/contratista.component';

const routes: Routes = [
  { path: '', component: ContratistaComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ContratistaRoutingModule { }
