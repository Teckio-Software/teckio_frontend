import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FamiliaInsumoComponent } from './familia-insumo/familia-insumo.component';

const routes: Routes = [
  { path: '', component: FamiliaInsumoComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FamiliaInsumoRoutingModule { }
