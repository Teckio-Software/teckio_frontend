import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReportesRoutingModule } from './reportes-routing.module';
import { ReportesBIComponent } from './reportes-bi/reportes-bi.component';



@NgModule({
  imports: [
    CommonModule,
    ReportesRoutingModule
  ]
})
export class ReportesModule { }
