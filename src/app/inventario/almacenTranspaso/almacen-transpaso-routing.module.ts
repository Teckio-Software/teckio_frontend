import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AlmacenTranspasoComponent } from './almacen-transpaso.component';


const routes: Routes = [
  { path: '', component: AlmacenTranspasoComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AlmacenTranspasoRoutingModule { }