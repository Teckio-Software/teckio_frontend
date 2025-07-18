import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { PrecioUnitarioService } from 'src/app/proyectos/precio-unitario/precio-unitario.service';
import { SeguridadService } from '../../seguridad.service';
import { precioUnitarioDTO } from 'src/app/proyectos/precio-unitario/tsPrecioUnitario';
import { EmpleadoPreciounitarioService } from '../empleado-preciounitario.service';
import { PrecioUnitarioXEmpleadoDTO } from '../empleado';
import { find } from 'rxjs';

@Component({
  selector: 'app-modal-empleado-precio-unitario',
  templateUrl: './modal-empleado-precio-unitario.component.html',
  styleUrls: ['./modal-empleado-precio-unitario.component.css']
})
export class ModalEmpleadoPrecioUnitarioComponent {

  selectedEmpresa: number = 0;
  selectedProyecto: number = 0;
  changeColor: any = null;
  empleadoPrecioUnitario: PrecioUnitarioXEmpleadoDTO[] = [];

  constructor(
    public dialogRef: MatDialogRef<ModalEmpleadoPrecioUnitarioComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _precioUnitario: PrecioUnitarioService,
    private _SeguridadService: SeguridadService,
    private _EmpleadoPrecioUnitario: EmpleadoPreciounitarioService
  ) {
    let IdProyecto = _SeguridadService.obtenerIdProyectoLocalStorage();
    let IdEmpresa = _SeguridadService.obtenIdEmpresaLocalStorage();
    this.selectedProyecto = Number(IdProyecto);
    this.selectedEmpresa = Number(IdEmpresa);
  }

  ngOnInit(): void {
    console.log("este es el idEmpleado", this.data.empleado.id)
    this.cargarPreciosUnitariosXAsignar();
  }

  cargarPreciosUnitariosXAsignar() {
    this._EmpleadoPrecioUnitario.ObtenerParaAsignarPreciosUniatrios(this.selectedEmpresa, this.data.empleado.id, this.selectedProyecto).subscribe((datos) => {
      this.empleadoPrecioUnitario = datos;
    });
  }

  asignarPrecioUnitario() {
    let asignados = this.empleadoPrecioUnitario.filter(z => z.seleccionado == true);
    if (asignados.length <= 0) {
      console.log("no hay ninguna seleccion de PU");
    } else {
      this._EmpleadoPrecioUnitario.CrearLista(this.selectedEmpresa, asignados).subscribe((datos) => {
        if (datos.estatus) {
          this.cerrar();
        } else {
          console.log(datos.descripcion);
        }
      });
    }
  }

  cerrar() {
    this.dialogRef.close(true);
  }

  detenerCierre(event: MouseEvent) {
    event.stopPropagation();
  }

}
