import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ReportesSubcontratosComponent } from './reportes-subcontratos/reportes-subcontratos.component';


const routes: Routes = [
  { path: '', component: ReportesSubcontratosComponent }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [
    RouterModule
  ]
})
export class ReportesSubcontratosRoutingModule { }
