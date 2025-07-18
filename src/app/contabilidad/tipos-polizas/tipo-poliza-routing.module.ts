import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TipoPolizaComponent } from './tipo-poliza/tipo-poliza.component';

const routes: Routes = [
  { path: '', component: TipoPolizaComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TipoPolizaRoutingModule { }
