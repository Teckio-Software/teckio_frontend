import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { CuentabancariaEmpresaComponent } from 'src/app/bancos/cuentabancaria/cuentabancaria-empresa/cuentabancaria-empresa/cuentabancaria-empresa.component';
import { ClienteNuevoComponent } from '../cliente-nuevo/cliente-nuevo.component';
import { SeguridadService } from 'src/app/seguridad/seguridad.service';
import { clienteDTO } from '../tsCliente';
import { ClienteService } from '../cliente.service';
import { CuentabancariaClienteComponent } from 'src/app/bancos/cuentabancaria/cuentabancaria-cliente/cuentabancaria-cliente/cuentabancaria-cliente.component';
import { ModalClienteCuentascontablesComponent } from '../modal-cliente-cuentascontables/modal-cliente-cuentascontables.component';
import { ModalContratistaCuentascontablesComponent } from '../../contratista/modal-contratista-cuentascontables/modal-contratista-cuentascontables.component';

@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.component.html',
  styleUrls: ['./clientes.component.css']
})
export class ClientesComponent {

  selectedEmpresa = 0;
  existenClientes = false;
  clientes: clienteDTO[] = [];
  appRecarga = 0;
  idCliente = 0;
  clienteSeleccionado = false;
  changeColor: any = null;

  selectedIndex: number = 0;

  isLoading: boolean = false;

  constructor(
    private dialog: MatDialog,
    private _SeguridadService: SeguridadService,
    private _cleinteService: ClienteService
  ) {
    let idEmpresa = this._SeguridadService.obtenIdEmpresaLocalStorage();
    this.selectedEmpresa = Number(idEmpresa);
  }

  ngOnInit() {
    this.cargarRegistros();
  }

  abrirModalCliente(): void {
    const dialogRef = this.dialog.open(ClienteNuevoComponent, {
      data: {
        idEmpresa: this.selectedEmpresa
      }
    });
    dialogRef.afterClosed().subscribe((resultado: boolean) => {
      this.cargarRegistros();
    });
  }

  cargarRegistros() {
    this._cleinteService.obtenerTodos(this.selectedEmpresa).subscribe((datos) => {
      this.clientes = datos;
      if (this.clientes.length > 0) {
        this.existenClientes = true;
      }
      this.isLoading = false;
    });
  }

  NuevaCuentaBancariaClientes(idCliente: number): void {
    const dialogRef = this.dialog.open(CuentabancariaClienteComponent, {
      data: {
        idEmpresa: this.selectedEmpresa,
        idCliente: idCliente
      }
    });
    dialogRef.afterClosed().subscribe((resultado: boolean) => {
      this.appRecarga += 1;
    });
  }

  abrirModalCCCliente(ciente : clienteDTO){
 const dialogRef = this.dialog.open(ModalContratistaCuentascontablesComponent, {
      data: {
        cliente: ciente
    }
    });
    dialogRef.afterClosed().subscribe((resultado: boolean) => {
      this.appRecarga += 1;
    });
  
  }

  VerCuentasBancariaCliente(idCliente: number) {
    this.changeColor = idCliente;
    this.idCliente = idCliente;
    this.clienteSeleccionado = true;
    this.appRecarga += 1;
    
  }

  yourFn(event: any) {
    this.selectedIndex = event.index;
  }

}
