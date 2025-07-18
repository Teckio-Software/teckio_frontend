import { Component, Input } from '@angular/core';
import { CuentaBancariaBaseDTO, CuentaBancariaContratistaDTO, CuentaBancariaEmpresaDTO } from '../../cuentabancaria';
import { CuentabancariaContratistaService } from '../cuentabancaria-contratista.service';
import { CuentaBancariaEmpresaService } from 'src/app/bancos/cuentaBancariaEmpresa/cuenta-bancaria-empresa.service';
import { CuentabancariaEmpresaService } from '../../cuentabancaria-empresa/cuentabancaria-empresa.service';
import { CuentabancariaClienteService } from '../../cuentabancaria-cliente/cuentabancaria-cliente.service';
import { MatDialog } from '@angular/material/dialog';
import { ModalContratistaCuentascontablesComponent } from 'src/app/catalogos/contratista/modal-contratista-cuentascontables/modal-contratista-cuentascontables.component';

@Component({
  selector: 'app-cuentas-bancarias-contratista',
  templateUrl: './cuentas-bancarias-contratista.component.html',
  styleUrls: ['./cuentas-bancarias-contratista.component.css']
})
export class CuentasBancariasContratistaComponent {

  @Input() IdContratistaInput : number = 0;
  @Input() IdEmpresaInput : number = 0;
  @Input() IdClienteInput : number = 0;

  cuentasBancarias : CuentaBancariaBaseDTO[] = [];

  constructor(
    private _cuentaBancariaContratista : CuentabancariaContratistaService,
    private _cuentaBancariaEmpresa : CuentabancariaEmpresaService,
    private _cuentaBancariaCliente : CuentabancariaClienteService,
    public dialog: MatDialog
    
  ){}

  ngOnInit():void{
    this.cargaRegistros();
  }

  cargaRegistros(){
    if(this.IdContratistaInput > 0){
      this._cuentaBancariaContratista.ObtenerXIdContratista(this.IdEmpresaInput, this.IdContratistaInput).subscribe((datos) => {
        this.cuentasBancarias = datos;
      });
    }
    if(this.IdClienteInput > 0){
      this._cuentaBancariaCliente.ObtenerXIdCliente(this.IdEmpresaInput, this.IdClienteInput).subscribe((datos) => {
        this.cuentasBancarias = datos;
      });
    }
    if(this.IdContratistaInput == 0 && this.IdClienteInput == 0){
      this._cuentaBancariaEmpresa.ObtenerTodos(this.IdEmpresaInput).subscribe((datos) => {
        this.cuentasBancarias = datos;
      });
    }
  }

  abrirModalCCEmpresa(cuentaBancariaEmpresa: CuentaBancariaBaseDTO): void {
      const dialogRef = this.dialog.open(ModalContratistaCuentascontablesComponent, {
        data: {
          cuentaBancariaEmpresa: cuentaBancariaEmpresa
        }
      });
      dialogRef.afterClosed().subscribe((resultado: boolean) => {
        this.cargaRegistros();
      });
    }
}
