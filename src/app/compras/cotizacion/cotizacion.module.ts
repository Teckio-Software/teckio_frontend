import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { CotizacionRoutingModule } from "./cotizacion-routing.module";
import { CotizacionesComponent } from './cotizaciones/cotizaciones.component';

@NgModule({
    declarations: [
  ],
    imports: [
        CommonModule,
        CotizacionRoutingModule
    ]
})
export class CotizacionModule { }