import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ImagenesComponent } from './imagenes.component';


const routes: Routes = [{ path: '', component: ImagenesComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ImagenesRoutingModule {
  
}
