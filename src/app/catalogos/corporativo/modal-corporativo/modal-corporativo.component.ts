import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Corporativo } from '../../empresas/empresa';
import { CorporativoService } from '../corporativo.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UtilidadesService } from 'src/app/utilidades/utilidades.service';

@Component({
  selector: 'app-modal-corporativo',
  templateUrl: './modal-corporativo.component.html',
  styleUrls: ['./modal-corporativo.component.css']
})
export class ModalCorporativoComponent implements OnInit {
  formularioCorporativo: FormGroup;
  ocultarPassword: boolean = true;
  tituloAccion: string = 'Agregar';
  botonAccion: string = 'Guardar';

  constructor(
    private modalActual: MatDialogRef<ModalCorporativoComponent>,
    @Inject(MAT_DIALOG_DATA) public datosCorporativo: Corporativo,
    private fb: FormBuilder,
    private _corporativoServicio: CorporativoService,
    private _utilidadServicio: UtilidadesService
  ) {
    this.formularioCorporativo = this.fb.group({
      Nombre: ['', Validators.required],
      Estatus: ['1',],
    });

    if (this.datosCorporativo != null) {
      this.tituloAccion = 'Editar';
      this.botonAccion = 'Actualizar';
    }
  }

  ngOnInit(): void {
    console.log(this.datosCorporativo);
    if (this.datosCorporativo != null) {
      this.formularioCorporativo.patchValue({
        Nombre: this.datosCorporativo.nombre,
        Estatus: this.datosCorporativo.estatus.toString(),
      });
    }
  }

  guardarEditar_Corporativo() {
    const _corporativo: Corporativo = {
      id: this.datosCorporativo == null ? 0 : this.datosCorporativo.id,
      nombre: this.formularioCorporativo.value.Nombre,
      estatus: parseInt(this.formularioCorporativo.value.Estatus),
    };

    if (this.datosCorporativo == null) {
      this._corporativoServicio.guardar(_corporativo).subscribe({
        next: (data) => {
          if (data.status) {
            this.modalActual.close('true');
          }
        },
        error: (e) => {},
      });
    } else {
      this._corporativoServicio.editar(_corporativo).subscribe({
        next: (data) => {
          if (data.status) {
            this.modalActual.close('true');
          }
        },
        error: (e) => {},
      });
    }
  }
}
