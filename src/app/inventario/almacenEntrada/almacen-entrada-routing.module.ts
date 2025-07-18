import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AlmacenEntradaComponent } from './almacen-entrada/almacen-entrada.component';

const routes: Routes = [
  { path: '', component: AlmacenEntradaComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AlmacenEntradaRoutingModule { }
