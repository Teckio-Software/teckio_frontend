import { Component, Input } from '@angular/core';
import { precioUnitarioDTO } from 'src/app/proyectos/precio-unitario/tsPrecioUnitario';
import { PrecioUnitarioXEmpleadoDTO } from '../empleado';
import { SeguridadService } from '../../seguridad.service';
import { EmpleadoPreciounitarioService } from '../empleado-preciounitario.service';
import { proyectoDTO } from 'src/app/proyectos/proyecto/tsProyecto';
import { ProyectoService } from 'src/app/proyectos/proyecto/proyecto.service';

@Component({
  selector: 'app-tabla-empleado-precio-unitario',
  templateUrl: './tabla-empleado-precio-unitario.component.html',
  styleUrls: ['./tabla-empleado-precio-unitario.component.css']
})
export class TablaEmpleadoPrecioUnitarioComponent {

  @Input() IdEmpleadoInput: number = 0;
  selectedEmpresa: number = 0;
  proyectos!: proyectoDTO[];
  proyectosReset!: proyectoDTO[];
  empleadoPrecioUnitario: PrecioUnitarioXEmpleadoDTO[] = [];
  empleadoPrecioUnitarioReset: PrecioUnitarioXEmpleadoDTO[] = [];

  nombreProyecto: string = "";

  constructor(
    private _SeguridadService: SeguridadService,
    private _proyectoService: ProyectoService,
    private _EmpleadoPrecioUnitario: EmpleadoPreciounitarioService
  ) {
    let IdEmpresa = _SeguridadService.obtenIdEmpresaLocalStorage();
    this.selectedEmpresa = Number(IdEmpresa);
  }

  ngOnInit(): void {
    this._proyectoService.obtenerTodosSinEstructurar(this.selectedEmpresa)
      .subscribe((proyectos) => {
        this.proyectos = proyectos;
        this.proyectosReset = proyectos;
      });
    this.cargarPreciosUnitriosXEmpleados();
  }

  cargarPreciosUnitriosXEmpleados() {
    this._EmpleadoPrecioUnitario.ObtenerXIdEmpleado(this.selectedEmpresa, this.IdEmpleadoInput).subscribe((datos) => {
      this.empleadoPrecioUnitario = datos;
      this.empleadoPrecioUnitarioReset = datos;
      console.log("estos son los PU", this.empleadoPrecioUnitario);
    });
  }

  filtrarProyecto(event: Event) {
    this.proyectos = this.proyectosReset;
    const filterValue = (event.target as HTMLInputElement).value.toLocaleLowerCase();
    this.proyectos = this.proyectos.filter((proyecto) => proyecto.nombre.toLocaleLowerCase().includes(filterValue));
    this.empleadoPrecioUnitario = this.empleadoPrecioUnitarioReset;
  }

  cambiarProyecto(proyecto: proyectoDTO) {
    console.log("aqui estoy");
    this.nombreProyecto = proyecto.nombre;
    this.empleadoPrecioUnitario =  this.empleadoPrecioUnitarioReset.filter(z => z.idProyceto == proyecto.id);
  }

}
