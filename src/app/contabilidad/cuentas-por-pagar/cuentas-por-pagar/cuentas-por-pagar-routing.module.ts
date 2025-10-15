import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { CuentasPorPagarComponent } from './cuentas-por-pagar.component';

const routes: Routes = [{ path: '', component: CuentasPorPagarComponent }];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class CuentasPorPagarRoutingModule { }
