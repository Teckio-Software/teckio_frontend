import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OrdenCompraWsComponent } from '../orden-compra-ws.component';

const routes: Routes = [
  { path: '', component: OrdenCompraWsComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OrdenCompraWsRoutingModule { }
