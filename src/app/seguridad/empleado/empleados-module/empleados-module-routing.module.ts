import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EmpleadosComponent } from '../empleados/empleados.component';

const routes: Routes = [
  { path: '', component: EmpleadosComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EmpleadosModuleRoutingModule { }
