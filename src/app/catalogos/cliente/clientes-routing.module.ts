import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Route, RouterModule, Routes } from '@angular/router';
import { ClienteComponent } from 'src/app/contabilidad/cliente/cliente/cliente.component';
import { ClientesComponent } from './clientes/clientes.component';

const routes : Routes = [
  { path : '', component : ClientesComponent}
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports : [RouterModule]
})
export class ClientesRoutingModule { }
