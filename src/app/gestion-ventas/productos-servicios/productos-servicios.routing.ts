import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductosServiciosComponent } from './productos-servicios.component';

const routes: Routes = [{ path: '', component: ProductosServiciosComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProductosServiciosRoutingModule {}
