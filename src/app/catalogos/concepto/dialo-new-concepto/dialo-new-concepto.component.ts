import { Component, Inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { conceptoDTO } from '../concepto';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ConceptoService } from '../concepto.service';

@Component({
  selector: 'app-dialo-new-concepto',
  templateUrl: './dialo-new-concepto.component.html',
  styleUrls: ['./dialo-new-concepto.component.css'],
})
export class DialoNewConceptoComponent {
  form!: FormGroup;
  especialidades: any;
  editaConcepto: conceptoDTO = {
    id: 0,
    descripcion: '',
    unidad: '',
    codigo: '',
    idEspecialidad: 0,
    descripcionEspecialidad: '',
    idProyecto: 0,
    costoUnitario: 0,
    costoUnitarioConFormato: '$0.00'

  };
  // selectedProyecto: number;
  idProyecto: number;
  selectedEmpresa: number;
  conceptos: any;
  ideditaConcepto: number;
  constructor(
    public dialogRef: MatDialogRef<DialoNewConceptoComponent>,
    private _snackBar: MatSnackBar,
    private formBuilder: FormBuilder,
    private conceptoService: ConceptoService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.especialidades = this.data.especialidades;
    // this.selectedProyecto = this.data.selectedProyecto;
    this.idProyecto = this.data.idProyecto;
    this.selectedEmpresa = this.data.selectedEmpresa;
    this.conceptos = this.data.conceptos;
    this.ideditaConcepto = this.data.ideditaConcepto;
  }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      descripcion: ['', { validators: [] }],
      unidad: ['', { validators: [] }],
      codigo: ['', { validators: [] }],
      idEspecialidad: new FormControl(''),
    });
  }

  guardar() {
    this.editaConcepto = this.form.value;
    this.editaConcepto.descripcionEspecialidad = '';
    if (
      typeof this.editaConcepto.descripcion === 'undefined' ||
      !this.editaConcepto.descripcion ||
      this.editaConcepto.descripcion === '' ||
      typeof this.editaConcepto.unidad === 'undefined' ||
      !this.editaConcepto.unidad ||
      this.editaConcepto.unidad === '' ||
      typeof this.editaConcepto.codigo === 'undefined' ||
      !this.editaConcepto.codigo ||
      this.editaConcepto.codigo === ''
    ) {
      this._snackBar.open('Capture todos los campos', 'X', { duration: 3000 });
      return;
    }
    this.conceptoService
      .crear(
        {
          codigo: this.editaConcepto.codigo,
          descripcion: this.editaConcepto.descripcion,
          unidad: this.editaConcepto.unidad,
          idEspecialidad: this.editaConcepto.idEspecialidad,
          costoUnitario: this.editaConcepto.costoUnitario,
          idProyecto: this.idProyecto,
        },
        this.selectedEmpresa
      )
      .subscribe(() => {
        this.dialogRef.close(true);
      });
    this.form.reset();
    this.ideditaConcepto = 0;
  }

  cerrarDialog() {
    this.dialogRef.close(false); // Cierra el modal sin guardar
  }

  detenerCierre(event: MouseEvent) {
    event.stopPropagation();
  }
}
