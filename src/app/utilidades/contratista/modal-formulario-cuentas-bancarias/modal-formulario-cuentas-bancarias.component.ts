import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-modal-formulario-cuentas-bancarias',
  templateUrl: './modal-formulario-cuentas-bancarias.component.html',
  styleUrls: ['./modal-formulario-cuentas-bancarias.component.css']
})
export class ModalFormularioCuentasBancariasComponent {
  constructor(
    public dialogRef: MatDialogRef<ModalFormularioCuentasBancariasComponent>,
    


  ){}
  cerrar(): void {
    this.dialogRef.close(false); // Cierra el diálogo y pasa false para indicar que se canceló la operación
  }

  detenerCierre(event: MouseEvent) {
    event.stopPropagation();
  }


}
