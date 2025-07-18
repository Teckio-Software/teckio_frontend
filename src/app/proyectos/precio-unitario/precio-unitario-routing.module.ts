import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PrecioUnitarioComponent } from "./precio-unitario/precio-unitario.component";

const routes: Routes = [
  { path: '', component: PrecioUnitarioComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PrecioUnitarioRoutingModule { }
