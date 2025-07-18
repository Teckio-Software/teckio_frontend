import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AlmacenSalidaComponent } from './almacen-salida/almacen-salida.component';

const routes: Routes = [
  { path: '', component: AlmacenSalidaComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AlmacenSalidaRoutingModule { }
