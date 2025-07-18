import { Dialog } from '@angular/cdk/dialog';
import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CuentabancariaClienteComponent } from '../cuentabancaria-cliente/cuentabancaria-cliente/cuentabancaria-cliente.component';
import { CuentabancariaContratistaComponent } from '../cuentabancaria-contratista/cuentabancaria-contratista/cuentabancaria-contratista.component';
import { CuentabancariaEmpresaComponent } from '../cuentabancaria-empresa/cuentabancaria-empresa/cuentabancaria-empresa.component';
import { SeguridadService } from 'src/app/seguridad/seguridad.service';

@Component({
  selector: 'app-cuentabancaria',
  templateUrl: './cuentabancaria.component.html',
  styleUrls: ['./cuentabancaria.component.css']
})
export class CuentabancariaComponent {

  appRefrescar : number = 0;
  selectedEmpresa : number = 0;
  constructor(
    private _SeguridadEmpresa: SeguridadService,
    private dialog : MatDialog
  ){
    let idEmpresa = _SeguridadEmpresa.obtenIdEmpresaLocalStorage();
    this.selectedEmpresa = Number(idEmpresa);
  }



  abrirModalCBEmpresa(): void {
    const dialogRef = this.dialog.open(CuentabancariaEmpresaComponent, {
      data: {
    }
    });
    dialogRef.afterClosed().subscribe((resultado: boolean) => {
      this.appRefrescar += 1;
    });
  
  }

}
