import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { especialidadDTO } from '../tsEspecialidad';
import { EspecialidadService } from '../especialidad.service';

@Component({
  selector: 'app-dialog-new-especialidad',
  templateUrl: './dialog-new-especialidad.component.html',
  styleUrls: ['./dialog-new-especialidad.component.css']
})
export class DialogNewEspecialidadComponent {
  form!: FormGroup;
  editaEspecialidad: especialidadDTO ={
    id: 0,
    descripcion: '',
    codigo: ''
  }
  idEditaEspecialidad: number;
  selectedEmpresa: number;
   
  constructor(
      
  public dialogRef: MatDialogRef<DialogNewEspecialidadComponent>,
  private formBuilder: FormBuilder, 
  private _snackBar: MatSnackBar,
  private especialidadService: EspecialidadService,
  @Inject(MAT_DIALOG_DATA) public data: any,
  ){
    this.idEditaEspecialidad = this.data.id
    this.selectedEmpresa = this.data.selectedEmpresa;
  }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      codigo: ['', {validators: [],},]
      , descripcion: ['', {validators: [],},]
    });
  this.dialogRef.updateSize('70%');

  }

  guardar(){
    this.editaEspecialidad = this.form.value;
    if (typeof this.editaEspecialidad.codigo === 'undefined' || !this.editaEspecialidad.codigo || this.editaEspecialidad.codigo === ""
        || typeof this.editaEspecialidad.descripcion === 'undefined' || !this.editaEspecialidad.descripcion || this.editaEspecialidad.descripcion === ""
        //typeof this.editaEspecialidad.observaciones === 'undefined' || !this.editaEspecialidad.observaciones || this.editaEspecialidad.observaciones === ""
        ) {
        this._snackBar.open("Capture los campos obligatorios", "X", {duration: 3000});
        return;
    }
    if (this.idEditaEspecialidad > 0) {
      this.editaEspecialidad.id = this.idEditaEspecialidad;
      this.especialidadService.editar(this.editaEspecialidad, this.selectedEmpresa)
      .subscribe({
        next: () => {
          this.dialogRef.close(true);
          this.idEditaEspecialidad = 0;
        },
        error: (zError: any) => console.error(zError),
      });
    }
    else{
      this.especialidadService.crear(this.editaEspecialidad, this.selectedEmpresa)
      .subscribe({
        next: () => this.dialogRef.close(true),
        error: (zError: any) => console.error(zError),
      });
    }
    this.form.reset();
    this.idEditaEspecialidad = 0;
  }


  
  cerrarDialog() {
    this.dialogRef.close(false); // Cierra el modal sin guardar
  }

  detenerCierre(event: MouseEvent) {
    event.stopPropagation();
  }



}
