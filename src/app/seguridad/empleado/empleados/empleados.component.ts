import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ModalEmpleadoComponent } from '../modal-empleado/modal-empleado.component';
import { EmpleadoDTO } from '../empleado';
import { EmpleadoServiceService } from '../empleado-service.service';
import { SeguridadService } from '../../seguridad.service';
import { ModalEmpleadoPrecioUnitarioComponent } from '../modal-empleado-precio-unitario/modal-empleado-precio-unitario.component';

@Component({
  selector: 'app-empleados',
  templateUrl: './empleados.component.html',
  styleUrls: ['./empleados.component.css']
})
export class EmpleadosComponent {

  selectedEmpresa: number = 0;
  empleados: EmpleadoDTO[] = [];
  changeColor: any = null;
  appRecarga : number = 0;

  isLoading: boolean = true;

  constructor(
    public dialog: MatDialog,
    private _empleadoService: EmpleadoServiceService,
    private _SeguridadService: SeguridadService
  ) {
    let IdEmpresa = _SeguridadService.obtenIdEmpresaLocalStorage();
    this.selectedEmpresa = Number(IdEmpresa);
  }

  ngOnInit(): void {
    this.cargarRegistros();
  }

  cargarRegistros() {
    this._empleadoService.ObtenerTodos(this.selectedEmpresa).subscribe((datos) => {
      this.empleados = datos;
      this.isLoading = false;
    });
  }

  SeleccionaEmpleado(empleado: EmpleadoDTO) {
    this.changeColor = empleado.id;
    this.appRecarga += 1;
  }

  abrirFormularioCrear() {
    let empleado: EmpleadoDTO = {
      id: 0,
      idUser: 0,
      nombre: '',
      apellidoPaterno: '',
      apellidoMaterno: '',
      curp: '',
      rfc: '',
      seguroSocial: '',
      fechaRelacionLaboral: null,
      fechaTerminoRelacionLaboral: null,
      salarioDiario: 0,
      estatus: false,
      seleccionado: false
    }

    this.abrirDialogoFormulario(empleado);
  }

  ActualizaEstatus(empleado: EmpleadoDTO) {
    this._empleadoService.EditarEmpleado(this.selectedEmpresa, empleado).subscribe((datos) => {
      this.cargarRegistros();
    });
  }

  abrirDialogoFormulario(empleado: EmpleadoDTO): void {
    const dialogRef = this.dialog.open(ModalEmpleadoComponent, {
      data: {
        empleado : empleado,
        IdEmpresa : this.selectedEmpresa
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.cargarRegistros();
      }
    })
  }

  abrirDialogoPrecioUnitario(empleado: EmpleadoDTO): void {
    console.log("empleado", empleado);
    const dialogRef = this.dialog.open(ModalEmpleadoPrecioUnitarioComponent, {
      data: {
        empleado : empleado,
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.cargarRegistros();
      }
    })
  }

}
