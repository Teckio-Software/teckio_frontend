import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TipoInsumoComponent } from './tipo-insumo/tipo-insumo.component';

const routes: Routes = [
  { path: '', component: TipoInsumoComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TipoInsumoRoutingModule { }
