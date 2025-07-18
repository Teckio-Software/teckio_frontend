import { Component, HostListener, Inject } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { tipoInsumoDTO } from '../tsTipoInsumo';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TipoInsumoService } from '../tipo-insumo.service';

@Component({
  selector: 'app-dialog-new-insumo',
  templateUrl: './dialog-new-insumo.component.html',
  styleUrls: ['./dialog-new-insumo.component.css']
})
export class DialogNewInsumoComponent {

  form!: FormGroup;
  editaTipoInsumo: tipoInsumoDTO = {
    id: 0,
    descripcion: ''
  }

  selectedEmpresa: number;
  paginaActual: number;
  cantidadRegistrosAMostrar: number;

 

  constructor(
    public dialogRef: MatDialogRef<DialogNewInsumoComponent>,
    private formBuilder: FormBuilder,
    private _snackBar: MatSnackBar,
    private tipoInsumoService: TipoInsumoService,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {

    this.selectedEmpresa = this.data.selectedEmpresa;
    this.paginaActual =  this.data.paginaActual;
    this.cantidadRegistrosAMostrar = this.data.cantidadRegistrosAMostrar;
   }




  

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      descripcion: ['', { validators: [], },]
      })
  }



  guardar() {
    this.editaTipoInsumo = this.form.value;
    if (typeof this.editaTipoInsumo.descripcion === 'undefined' || !this.editaTipoInsumo.descripcion || this.editaTipoInsumo.descripcion === "") {
      this._snackBar.open("Capture todos los campos", "X", { duration: 3000 });
      return;
    }
    this.tipoInsumoService.crear(this.editaTipoInsumo, this.selectedEmpresa)
      .subscribe({
        next: () => this.dialogRef.close(true),  // Indica que se guardó con éxito
        error: (zError: any) => console.error(zError),
      });
  }
  
  
  cerrarDialog() {
    this.dialogRef.close(false); // Cierra el modal sin guardar
  }

  detenerCierre(event: MouseEvent) {
    event.stopPropagation();
  }
}