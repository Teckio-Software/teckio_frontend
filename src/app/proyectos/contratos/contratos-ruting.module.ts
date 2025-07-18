import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ContratosComponent } from './contratos/contratos.component';


const routes: Routes = [
  { path: '', component: ContratosComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ContratosRutingModule { }





