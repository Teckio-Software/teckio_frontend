import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { EstimacionesService } from 'src/app/proyectos/estimaciones/estimaciones.service';

@Component({
  selector: 'app-modal-alert',
  templateUrl: './modal-alert.component.html',
  styleUrls: ['./modal-alert.component.css']
})
export class ModalAlertComponent {

  // constructor(
  //   public dialogRef: MatDialogRef<DialogoComponent>,

  //   private estimacionesService: EstimacionesService
  // ) {}

  constructor(
    public dialogRef: MatDialogRef<ModalAlertComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private estimacionesService: EstimacionesService


  ) {}

  
  eliminarPeriodo(selectedPeriodo: number, selectedEmpresa: number): void {
    this.estimacionesService.eliminarPeriodo(selectedPeriodo, selectedEmpresa)
      .subscribe(() => {
          this.estimacionesService.obtenerPeriodos(this.data.selectedProyecto, this.data.selectedEmpresa)
            .subscribe((estimaciones) => {
              this.dialogRef.close(true); // Cierra el diálogo y pasa true para indicar que se realizó la eliminación del periodo
            });
      });
  }



  cerrar(): void {
    this.dialogRef.close(false); // Cierra el diálogo y pasa false para indicar que se canceló la operación
  }

    detenerCierre(event: MouseEvent) {
    event.stopPropagation();
  }

  confirmar(): void {
    this.dialogRef.close(true); // Cierra el diálogo y pasa true para indicar que se confirmó la operación
  }


  ejecutarFuncionAceptar(): void {
    if (this.data.funcionAceptarEstimaciones) {
        this.data.funcionAceptarEstimaciones(this.data.selectedPeriodo, this.data.selectedEmpresa);
    }
    if (this.data.funcionAceptarTipoInsumo) {
        this.data.funcionAceptarTipoInsumo(this.data.tipoInsumoId);
    }
    if (this.data.funcionAceptarFamilia){
        this.data.funcionAceptarFamilia(this.data.familiaId);
    }
    if (this.data.funcionAceptarEspecialidad){
      this.data.funcionAceptarEspecialidad(this.data.especialidadId);
    }
    if (this.data.funcionAceptarConcepto){
      this.data.funcionAceptarConcepto(this.data.conceptoId);
    }
    if (this.data.funcionAceptarContratista){
      this.data.funcionAceptarContratista(this.data.selectedContratista);
    }
    if (this.data.funcionAceptarPU){
      this.data.funcionAceptarPU(this.data.selectedPU);
    }
    if (this.data.funcionAceptarPUDetalle){
      this.data.funcionAceptarPUDetalle(this.data.selectedPUDetalle);
    }
    this.cerrar();
}
}
