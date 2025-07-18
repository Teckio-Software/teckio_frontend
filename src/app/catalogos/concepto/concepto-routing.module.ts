import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ConceptoComponent } from './concepto/concepto.component';

const routes: Routes = [
  { path: '', component: ConceptoComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ConceptoRoutingModule { }
