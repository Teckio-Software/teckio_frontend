import { Component, Inject } from '@angular/core';
import { EmpleadoDTO } from '../empleado';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { EmpleadoServiceService } from '../empleado-service.service';
import { th, tr } from 'date-fns/locale';

@Component({
  selector: 'app-modal-tabla-empleados',
  templateUrl: './modal-tabla-empleados.component.html',
  styleUrls: ['./modal-tabla-empleados.component.css']
})
export class ModalTablaEmpleadosComponent {

  empleados: EmpleadoDTO[] = [];
  changeColor: any = null;

  constructor(
    public dialogRef: MatDialogRef<ModalTablaEmpleadosComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _empleadoService: EmpleadoServiceService,
  ) {

  }

  ngOnInit(): void {
    console.log("esto llego", this.data);
    this.cargarRegistros();
  }

  cargarRegistros() {
    this._empleadoService.ObtenerTodos(this.data.IdEmpresa).subscribe((datos) => {
      let empleados = datos.filter(z => z.idUser == 0);
      this.empleados = empleados;
      console.log("estos son los empleados", this.empleados);
    });
  }

  Seleccionar(empleado: EmpleadoDTO) {
    console.log("este es ele empleado", empleado);
    this.empleados.forEach((element) => {
      if (element.id == empleado.id) {
        element.seleccionado = true;
        console.log("cambiando verdadero");
      } else {
        element.seleccionado = false;
        console.log("cambiando falso");
      }
    });
  }

  relacionarEmpleado() {
    let relacion = this.empleados.find(z => z.seleccionado == true);
    console.log("este es el empleado a relacionar", relacion);
    if (relacion) {
      relacion.idUser = this.data.IdUser;
      this._empleadoService.EditarEmpleado(this.data.IdEmpresa, relacion).subscribe((datos) => {
        if (datos.estatus) {
          this.cerrar();
        }
      });
    }else{
      console.log("debe seleccionar un empleado")
    }
  }

  cerrar() {
    this.dialogRef.close(true);
  }

  detenerCierre(event: MouseEvent) {
    event.stopPropagation();
  }

}
