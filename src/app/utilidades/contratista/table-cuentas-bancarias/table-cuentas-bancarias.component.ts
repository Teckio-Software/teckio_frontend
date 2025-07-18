import { Component } from '@angular/core';
import { ModalFormularioCuentasBancariasComponent } from '../modal-formulario-cuentas-bancarias/modal-formulario-cuentas-bancarias.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-table-cuentas-bancarias',
  templateUrl: './table-cuentas-bancarias.component.html',
  styleUrls: ['./table-cuentas-bancarias.component.css']
})
export class TableCuentasBancariasComponent {
  constructor(public dialog: MatDialog) {}
  abrirDialogoFormulario(): void {
    const dialogRef = this.dialog.open(ModalFormularioCuentasBancariasComponent, {
 
        data: {
          
       
      }
    });
}

}
