import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CorporativoComponent } from './corporativo/corporativo.component';

const routes: Routes = [
  { path: '', component: CorporativoComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CorporativoRoutingModule { }
