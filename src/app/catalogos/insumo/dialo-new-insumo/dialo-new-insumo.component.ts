import { Component, Inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { InsumoFormDTO } from '../tsInsumo';
import { MatSnackBar } from '@angular/material/snack-bar';
import { InsumoService } from '../insumo.service';

@Component({
  selector: 'app-dialo-new-insumo',
  templateUrl: './dialo-new-insumo.component.html',
  styleUrls: ['./dialo-new-insumo.component.css'],
})
export class DialoNewInsumoComponent {
  idEditaInsumo: number;
  // selectedProyecto: number;
  idProyecto: number;
  tiposInsumo: any;
  selectedEmpresa: number;
  familiasInsumo: any;
  form!: FormGroup;
  editaInsumo: InsumoFormDTO = {
    id: 0,
    descripcion: '',
    unidad: '',
    codigo: '',
    idTipoInsumo: 0,
    idFamiliaInsumo: 0,
    idProyecto: 0,
    costoUnitario: 0,
  };
  constructor(
    public dialogRef: MatDialogRef<DialoNewInsumoComponent>,
    private formBuilder: FormBuilder,
    private _snackBar: MatSnackBar,
    private insumoService: InsumoService,

    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.tiposInsumo = this.data.tiposInsumo;
    this.familiasInsumo = this.data.familiasInsumo;

    // this.selectedProyecto = this.data.selectedProyecto;
    this.idProyecto = this.data.idProyecto;
    this.idEditaInsumo = this.data.idEditaInsumo;
    this.selectedEmpresa = this.data.selectedEmpresa;
  }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      descripcion: ['', { validators: [] }],
      unidad: ['', { validators: [] }],
      codigo: ['', { validators: [] }],
      costoUnitario: ['', { validators: [] }],
      idTipoInsumo: new FormControl(''),
      idFamiliaInsumo: new FormControl(''),
    });
    this.dialogRef.updateSize('70%');
  }

  guardar() {
    this.editaInsumo = this.form.value;
    this.editaInsumo.idProyecto = this.idProyecto;
    if (
      typeof this.editaInsumo.descripcion === 'undefined' ||
      !this.editaInsumo.descripcion ||
      this.editaInsumo.descripcion === '' ||
      typeof this.editaInsumo.unidad === 'undefined' ||
      !this.editaInsumo.unidad ||
      this.editaInsumo.unidad === '' ||
      //typeof this.editaInsumo.observaciones === 'undefined' || !this.editaInsumo.observaciones || this.editaInsumo.observaciones === "" ||
      typeof this.editaInsumo.idTipoInsumo === 'undefined' ||
      !this.editaInsumo.idTipoInsumo ||
      this.editaInsumo.idTipoInsumo <= 0 ||
      typeof this.editaInsumo.idFamiliaInsumo === 'undefined' ||
      !this.editaInsumo.idFamiliaInsumo ||
      this.editaInsumo.idFamiliaInsumo <= 0
    ) {
      this._snackBar.open('Capture todos los campos', 'X', { duration: 3000 });
      return;
    }
    if (this.idEditaInsumo > 0) {
      this.editaInsumo.id = this.idEditaInsumo;
      this.insumoService
        .editar(this.editaInsumo, this.selectedEmpresa)
        .subscribe({
          next: () => {
            this.dialogRef.close(true);
            this.idEditaInsumo = 0;
          },
          error: (zError: any) => console.error(zError),
        });
    } else {
      this.insumoService
        .crear(this.editaInsumo, this.selectedEmpresa)
        .subscribe({
          next: () => this.dialogRef.close(true),
          error: (zError: any) => console.error(zError),
        });
    }
    this.form.reset();
    this.idEditaInsumo = 0;
  }

  cerrarDialog() {
    this.dialogRef.close(false); // Cierra el modal sin guardar
  }

  detenerCierre(event: MouseEvent) {
    event.stopPropagation();
  }
}
