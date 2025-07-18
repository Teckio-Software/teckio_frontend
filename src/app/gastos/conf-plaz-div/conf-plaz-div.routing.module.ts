import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ConfPlazDivComponent } from './conf-plaz-div/conf-plaz-div.component';

const routes: Routes = [
  { path: '', component: ConfPlazDivComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class  ConfPlazDivRoutingModule { }