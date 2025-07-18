import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MenusEmpresaComponent } from '../menus-empresa/menus-empresa.component';

const routes: Routes = [
  { path: '', component: MenusEmpresaComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ModuleRoutingModule { }
