import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CuentabancariaRoutingModule } from './cuentabancaria-routing.module';
import { CuentabancariaContratistaComponent } from './cuentabancaria-contratista/cuentabancaria-contratista/cuentabancaria-contratista.component';
import { CuentasBancariasContratistaComponent } from './cuentabancaria-contratista/cuentas-bancarias-contratista/cuentas-bancarias-contratista.component';
import { CuentabancariaClienteComponent } from './cuentabancaria-cliente/cuentabancaria-cliente/cuentabancaria-cliente.component';
import { CuentasBancariasClienteComponent } from './cuentabancaria-cliente/cuentas-bancarias-cliente/cuentas-bancarias-cliente.component';
import { CuentabancariaEmpresaComponent } from './cuentabancaria-empresa/cuentabancaria-empresa/cuentabancaria-empresa.component';
import { CuentasBancariasEmpresaComponent } from './cuentabancaria-empresa/cuentas-bancarias-empresa/cuentas-bancarias-empresa.component';



@NgModule({
  declarations: [

  ],
  imports: [
    CommonModule,
    CuentabancariaRoutingModule
  ]
})
export class CuentabancariaModuleModule { }
