import { Component, Inject, Input, OnInit } from '@angular/core';
import { CuentaContableService } from 'src/app/contabilidad/cuenta-contable/cuenta-contable.service';
import { SeguridadService } from 'src/app/seguridad/seguridad.service';
import { ContratistaService } from '../contratista.service';
import { cuentaContableDTO } from 'src/app/contabilidad/cuenta-contable/tsCuentaContable';
import { contratistaDTO } from '../tsContratista';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-configuracion-cuenta-contable-modal',
  templateUrl: './configuracion-cuenta-contable-modal.component.html',
  styleUrls: ['./configuracion-cuenta-contable-modal.component.css']
})
export class ConfiguracionCuentaContableModalComponent implements OnInit {
  selectedEmpresa: number = 0;
  cuentasContables!: cuentaContableDTO[];
  contratista!: contratistaDTO;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: contratistaDTO
    , private _seguridadServce: SeguridadService
    , private _dialogRef: MatDialogRef<ConfiguracionCuentaContableModalComponent>
    , private _cuentaContableService : CuentaContableService
    , private _contratistaService: ContratistaService
  ) { 
    let idEmpresa = _seguridadServce.obtenIdEmpresaLocalStorage();
    this.selectedEmpresa = Number(idEmpresa);
    this.contratista = this.contratista;
  }

  ngOnInit(): void {
    this._cuentaContableService.obtenerAsignables(this.selectedEmpresa)
    .subscribe((cuentasContables) => {
      this.cuentasContables = cuentasContables;
    })
  }

  asignarCuentaContable(){
    this._contratistaService.editar(this.contratista, this.selectedEmpresa)
    .subscribe(() => {
      this._dialogRef.close();
    })
  }

  selectionChangeContratista(event: any){
    console.log(event.option.value);
    console.log(this.data);
  }
}
