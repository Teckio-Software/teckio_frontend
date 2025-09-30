import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuditoriasComponent } from './auditorias.component';


const routes: Routes = [{ path: '', component: AuditoriasComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AuditoriasRoutingModule {
  
}
