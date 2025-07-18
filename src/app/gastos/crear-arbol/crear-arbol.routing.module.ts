import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { CrearArbolComponent } from './crear-arbol/crear-arbol.component';

const routes: Routes = [
  { path: '', component: CrearArbolComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CrearArbolRoutingModule { }