import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { rubroDTO } from '../tsRubro';
import { RubroService } from '../rubro.service';

@Component({
  selector: 'app-dialog-new-rubro',
  templateUrl: './dialog-new-rubro.component.html',
  styleUrls: ['./dialog-new-rubro.component.css'],
})
export class DialogNewRubroComponent {
  form!: FormGroup;
  editaRubro: rubroDTO = {
    id: 0,
    descripcion: '',
    naturalezaRubro: 0,
    tipoReporte: 0,
    posicion: 0,
  };
  selectedEmpresa: number;
  idEditaRubro: number;

  constructor(
    public dialogRef: MatDialogRef<DialogNewRubroComponent>,
    private formBuilder: FormBuilder,
    private _snackBar: MatSnackBar,
    private rubroService: RubroService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.selectedEmpresa = this.data.selectedEmpresa;
    this.idEditaRubro = this.data.idEditaRubro;
  }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      id: ['', { validators: [] }],
      descripcion: ['', { validators: [] }],
      naturalezaRubro: ['', { validators: [] }],
      tipoReporte: ['', { validators: [] }],
      posicion: ['', { validators: [] }],
    });
  }

  cerrarDialog() {
    this.dialogRef.close(false);
  }

  detenerCierre(event: MouseEvent) {
    event.stopPropagation();
  }

  guardar() {
    this.editaRubro = this.form.value;
    this.editaRubro.id = 0;
    this.editaRubro.posicion = 0;
    if (
      typeof this.editaRubro.descripcion === 'undefined' ||
      !this.editaRubro.descripcion ||
      this.editaRubro.descripcion === '' ||
      typeof this.editaRubro.naturalezaRubro === 'undefined' ||
      !this.editaRubro.naturalezaRubro ||
      this.editaRubro.naturalezaRubro <= 0 ||
      typeof this.editaRubro.tipoReporte === 'undefined' ||
      !this.editaRubro.tipoReporte ||
      this.editaRubro.tipoReporte <= 0
      //|| typeof this.editaRubro.posicion === 'undefined' || !this.editaRubro.posicion || this.editaRubro.posicion <= 0
    ) {
      this._snackBar.open('Capture todos los campos', 'X', { duration: 3000 });
      return;
    }
    this.rubroService.crear(this.editaRubro, this.selectedEmpresa).subscribe({
      next: () => this.dialogRef.close(true), // Indica que se guardó con éxito
      error: (zError: any) => console.error(zError),
    });
    this.form.reset();
    this.idEditaRubro = 0;
  }
}
