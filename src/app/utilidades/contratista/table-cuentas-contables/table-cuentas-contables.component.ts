import { Component, Input } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { ClienteService } from 'src/app/catalogos/cliente/cliente.service';
import { ContratistaService } from 'src/app/catalogos/contratista/contratista.service';
import { cuentaContableDTO } from 'src/app/contabilidad/cuenta-contable/tsCuentaContable';
import { SeguridadService } from 'src/app/seguridad/seguridad.service';

@Component({
  selector: 'app-table-cuentas-contables',
  templateUrl: './table-cuentas-contables.component.html',
  styleUrls: ['./table-cuentas-contables.component.css']
})
export class TableCuentasContablesComponent {

  @Input() IdContratistaInput : number = 0;
  @Input() IdClienteInput : number = 0;

  
  selectedEmpresa : number = 0;
  cuentasContables : cuentaContableDTO[] = [];

  changeColor: any = null;

  constructor(
    private _seguridadService : SeguridadService,
    private _contatistaService : ContratistaService,
    private _clienteService : ClienteService
  ){
    let idEmpresa = _seguridadService.obtenIdEmpresaLocalStorage();
    this.selectedEmpresa = Number(idEmpresa);
  }

  ngOnInit(): void {
    if(this.IdContratistaInput != 0){
      this.cargarCuentasXContratista();
    }else if(this.IdClienteInput != 0){
      console.log("Cuentas contables para clientes");
      this.cargarCuentasXCliente();
    }
  }

  cargarCuentasXContratista(){
    this._contatistaService.obtenerCuentasContables(this.selectedEmpresa, this.IdContratistaInput).subscribe((datos) => {
      this.cuentasContables = datos;
      console.log("estas son las cuentasContables", this.cuentasContables);
    });
  }

  cargarCuentasXCliente(){
    this._clienteService.obtenerCuentasContables(this.selectedEmpresa, this.IdClienteInput).subscribe((datos) => {
      this.cuentasContables = datos;
      console.log("estas son las cuentasContables", this.cuentasContables);
    });
  }

  toggleSubTable(index: number) {
    this.changeColor = index;
  }

}
