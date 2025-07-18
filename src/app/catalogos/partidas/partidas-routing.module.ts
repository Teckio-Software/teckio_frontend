import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PartidaComponent } from './partidas/partidas.component';
import { esAdminGuard, esAlmacenGuard } from 'src/app/safe.guard';

const routes: Routes = [
  { path: '', component: PartidaComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PartidasRoutingModule { }
