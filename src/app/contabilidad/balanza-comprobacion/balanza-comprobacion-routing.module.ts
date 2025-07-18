import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BalanazaComprobacionComponent } from './balanza-comprobacion/balanza-comprobacion.component';

const routes: Routes = [
  { path: '', component: BalanazaComprobacionComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BalanzaComprobacionRoutingModule { }
