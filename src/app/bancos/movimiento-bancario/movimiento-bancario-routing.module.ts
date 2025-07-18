import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MovimientoBancarioComponent } from './movimiento-bancario/movimiento-bancario.component';

const routes: Routes = [
  //Mandamos a traer el componente de Empresa
  { path: '', component: MovimientoBancarioComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MovimientoBancarioRoutingModule { }
