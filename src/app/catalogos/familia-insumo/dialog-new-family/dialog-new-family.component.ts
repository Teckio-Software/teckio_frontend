import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FamiliaInsumoService } from '../familia-insumo.service';

@Component({
  selector: 'app-dialog-new-family',
  templateUrl: './dialog-new-family.component.html',
  styleUrls: ['./dialog-new-family.component.css'],
})
export class DialogNewFamilyComponent {
  editaFamiliaInsumo: any;
  selectedEmpresa: number;
  form!: FormGroup;

  constructor(
      public dialogRef: MatDialogRef<DialogNewFamilyComponent>,
      private formBuilder: FormBuilder,
      private _snackBar: MatSnackBar,
    private familiaService: FamiliaInsumoService,

    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.editaFamiliaInsumo = this.data.editaFamiliaInsumo;
    this.selectedEmpresa = this.data.selectedEmpresa;
  }

  ngOnInit(): void {
    this.dialogRef.updateSize('50%');
    this.form = this.formBuilder.group({
      descripcion: ['', { validators: [] }],
    });
  }

  guardar() {
    this.editaFamiliaInsumo = this.form.value;
    if (
      typeof this.editaFamiliaInsumo.descripcion === 'undefined' ||
      !this.editaFamiliaInsumo.descripcion ||
      this.editaFamiliaInsumo.descripcion === ''
    ) {
      this._snackBar.open('Capture todos los campos', 'X', { duration: 3000 });
      return;
    }
    this.familiaService
      .crear(this.editaFamiliaInsumo, this.selectedEmpresa)
      .subscribe({
        next: () => this.dialogRef.close(true),
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
