import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProgramacionEstimadaComponent } from './programacion-estimada/programacion-estimada.component'

const routes: Routes = [
  { path: '', component: ProgramacionEstimadaComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProgramacionEstimadaRoutingModule { }
