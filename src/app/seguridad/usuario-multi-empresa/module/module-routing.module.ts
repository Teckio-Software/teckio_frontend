import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UsuarioMultiEmpresaComponent } from '../usuario-multi-empresa.component';

const routes: Routes = [
  { path: '', component: UsuarioMultiEmpresaComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ModuleRoutingModule { }
