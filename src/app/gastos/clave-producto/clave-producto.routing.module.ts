import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ClaveProductoComponent } from './clave-producto/clave-producto.component';

const routes: Routes = [
  { path: '', component: ClaveProductoComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ClaveProductoRoutingModule { }