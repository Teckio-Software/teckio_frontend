import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FacturasTeckioComponent } from './facturas-teckio/facturas-teckio.component';

const routes: Routes = [
  { path: '', component: FacturasTeckioComponent }
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FacturasModuleRoutingModule { }
