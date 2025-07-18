import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PolizaComponent } from './poliza/poliza.component';

const routes: Routes = [
  { path: '', component: PolizaComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PolizaRoutingModule { }
