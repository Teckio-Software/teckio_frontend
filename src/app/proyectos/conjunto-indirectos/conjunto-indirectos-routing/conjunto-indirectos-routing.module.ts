import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ConjuntoIndirectosComponent } from '../conjunto-indirectos/conjunto-indirectos.component';


const routes: Routes = [
  { path: '', component: ConjuntoIndirectosComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [
    RouterModule
  ]
})
export class ConjuntoIndirectosRoutingModule { }
