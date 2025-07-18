import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { CuentaBancariaEmpresaComponent } from '../cuenta-bancaria-empresa/cuenta-bancaria-empresa.component';

const routes: Routes = [
  { path: '', component: CuentaBancariaEmpresaComponent }
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CuentaBancariaEmpresaRoutingModule { }
