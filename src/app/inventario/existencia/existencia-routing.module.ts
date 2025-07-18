import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ExistenciaComponent } from './existencia/existencia.component';

const routes: Routes = [
  { path: '', component: ExistenciaComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ExistenciaRoutingModule { }
