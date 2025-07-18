import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { CuentabancariaComponent } from './cuentabancaria/cuentabancaria.component';


const routes: Routes = [
  { path: '', component: CuentabancariaComponent }
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CuentabancariaRoutingModule { }
