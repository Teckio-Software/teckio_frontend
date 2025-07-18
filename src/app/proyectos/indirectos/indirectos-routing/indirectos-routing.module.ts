import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { IndirectosComponent } from '../indirectos/indirectos.component';


const routes: Routes = [
  { path: '', component: IndirectosComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [
    RouterModule
  ]
})
export class IndirectosRoutingModule { }
