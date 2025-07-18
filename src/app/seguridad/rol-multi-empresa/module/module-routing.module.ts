import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RolMultiEmpresaComponent } from '../rol-multi-empresa.component';

const routes: Routes = [
  { path: '', component: RolMultiEmpresaComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ModuleRoutingModule { }
