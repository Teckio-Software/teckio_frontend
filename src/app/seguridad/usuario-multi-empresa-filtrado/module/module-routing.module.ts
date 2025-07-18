import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UsuarioMultiEmpresaFiltradoComponent } from '../usuario-multi-empresa-filtrado.component';

const routes: Routes = [
  { path: '', component: UsuarioMultiEmpresaFiltradoComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ModuleRoutingModule { }
