import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ResumenOrdenesCompraComponent } from './resumen-ordenes-compra.component';

const routes: Routes = [
  { path: '', component: ResumenOrdenesCompraComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ResumneOrdenesCompraRoutingModule { }
