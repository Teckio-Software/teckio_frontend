import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ComprasdirectasComponent } from './comprasdirectas/comprasdirectas.component';

const routes: Routes = [
  { path: '', component: ComprasdirectasComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ComprasdirectasRoutingModule { }
