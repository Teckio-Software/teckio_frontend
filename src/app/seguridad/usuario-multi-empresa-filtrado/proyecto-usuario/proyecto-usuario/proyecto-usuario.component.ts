import { Component, Input, OnInit } from '@angular/core';
import { ProyectoService } from 'src/app/proyectos/proyecto/proyecto.service';
import { proyectoDTO } from 'src/app/proyectos/proyecto/tsProyecto';
import { SeguridadService } from 'src/app/seguridad/seguridad.service';
import { ProyectoUsuarioService } from '../proyecto-usuario.service';
import { usuarioProyectoDTO } from '../tsUsuarioProyecto';
import { UsuarioEmpresaEstructura } from 'src/app/seguridad/seguridad-multi-empresa/tsSeguridadMultiEmpresa';
import {
  asignarRolAUsuarioEnEmpresaPorPoryectoDTO,
  rolProyectoEmpresaUsuarioDTO,
} from 'src/app/seguridad/usuario-multi-empresa/tsUsuarioMultiEmpresa';
import { UsuarioService } from 'src/app/seguridad/Servicios/usuario.service';
import { RolService } from 'src/app/seguridad/Servicios/rol.service';
import { RolDTO } from 'src/app/seguridad/tsSeguridad';
import { AlertaTipo } from 'src/app/utilidades/alert/alert.component';

@Component({
  selector: 'app-proyecto-usuario',
  templateUrl: './proyecto-usuario.component.html',
  styleUrls: ['./proyecto-usuario.component.css'],
})
export class ProyectoUsuarioComponent implements OnInit {
  @Input() selectedEmpresa: number = 0;
  @Input() selectedUsuario: number = 0;

  proyectos: proyectoDTO[] = [];
  proyectosAsignados: usuarioProyectoDTO[] = [];
  proyectosVisibles: usuarioProyectoDTO[] = [];

  nuevoProyectoAsignado: usuarioProyectoDTO = {
    id: 0,
    idUsuario: 0,
    idEmpresa: 0,
    idProyecto: 0,
    estatus: false,
    nombreProyecto: '',
  };

  selectedProyectoId: number = 0;
  agregarSelectedProyectoId: number = 0;

  alertaSuccess: boolean = false;
  alertaMessage: string = '';
  alertaTipo: AlertaTipo = AlertaTipo.none;
  AlertaTipo = AlertaTipo;

  registros: rolProyectoEmpresaUsuarioDTO[] = [];
  parametros: asignarRolAUsuarioEnEmpresaPorPoryectoDTO = {
    idUsuario: 0,
    idEmpresa: 0,
    idProyecto: 0,
    idRol: 0,
  };

  roles: RolDTO[] = [];
  selectedRol: number = 0;

  constructor(
    private proyectoService: ProyectoService,
    private usuarioService: UsuarioService,
    private _SeguridadEmpresa: SeguridadService,
    private _ProyectoUsuarioService: ProyectoUsuarioService,
    private rolService: RolService
  ) {}

  ngOnInit(): void {
    this.proyectoService
      .obtenerTodosSinEstructurar(this.selectedEmpresa)
      .subscribe((proyectos: proyectoDTO[]) => {
        this.proyectos = proyectos;
        console.log(this.proyectos);
      });

    this._ProyectoUsuarioService
      .obtenerProyectosPorEmpresaPorUsuario({
        idUsuario: this.selectedUsuario,
        idEmpresa: this.selectedEmpresa,
      })
      .subscribe((proyectos) => {
        this.proyectosAsignados = proyectos;
        this.proyectosAsignados.forEach((element) => {
          let p = this.proyectos.find((z) => z.id == element.idProyecto);
          if (p) {
            element.nombreProyecto = p.nombre;
          }
        });
        this.proyectosVisibles = this.proyectosAsignados; // Mostrar todos al inicio
      });

    this.obtenerRoles();
  }

  get tieneEmpresaYRol(): boolean {
    return this.registros.some((r) => r.estatus && !!r.idRol) ?? false;
  }

  asignarProyecto(idProyecto: number) {
    this.nuevoProyectoAsignado.estatus = true;
    this.nuevoProyectoAsignado.idEmpresa = this.selectedEmpresa;
    this.nuevoProyectoAsignado.idUsuario = this.selectedUsuario;
    this.nuevoProyectoAsignado.idProyecto = idProyecto;
    this._ProyectoUsuarioService
      .asignarProyectoAUsuario(this.nuevoProyectoAsignado)
      .subscribe(() => {
        this.refreshProyectos();
      });
  }

  editarAsignacionProyecto(registro: usuarioProyectoDTO) {
    this.nuevoProyectoAsignado = registro;
    this._ProyectoUsuarioService
      .asignarProyectoAUsuario(this.nuevoProyectoAsignado)
      .subscribe(() => {
        this.refreshProyectos();
      });
  }

  editarAsignacionProyectoConRoles(registro: rolProyectoEmpresaUsuarioDTO) {
    let parametro: asignarRolAUsuarioEnEmpresaPorPoryectoDTO = {
      idUsuario: registro.idUsuario,
      idEmpresa: registro.idEmpresa,
      idProyecto: registro.idProyecto,
      idRol: registro.idRol,
    };

    let usuarioProyecto: usuarioProyectoDTO = {
      id: 0,
      idUsuario: registro.idUsuario,
      idEmpresa: registro.idEmpresa,
      idProyecto: registro.idProyecto,
      nombreProyecto: '',
      estatus: false,
    };

    this.usuarioService.asignarRolesPorProyecto(parametro).subscribe(() => {
      // this.obtenerRelaciones(usuarioProyecto);
    });
  }

  agregarProyecto(id: number) {
    let existeProyecto = this.proyectosAsignados.find(
      (p) => p.idProyecto == id
    );
    if (existeProyecto) {
      this.alerta(AlertaTipo.error, 'El proyecto ya está asignado.');
      return;
    }

    this.selectedProyectoId = id;
    this.asignarProyecto(id);
    this.agregarSelectedProyectoId = 0;
  }

  obtenerRelaciones(registro: usuarioProyectoDTO) {
    // Si ya estaba seleccionado, deseleccionamos
    if (this.selectedProyectoId === registro.idProyecto) {
      this.selectedProyectoId = 0;
      this.proyectosVisibles = this.proyectosAsignados; // Mostrar todos
      this.registros = []; // Ocultar tabla de roles
      return;
    }

    // Seleccionar este proyecto
    this.parametros.idUsuario = registro.idUsuario;
    this.parametros.idEmpresa = registro.idEmpresa;
    this.parametros.idProyecto = registro.idProyecto;
    this.selectedProyectoId = registro.idProyecto;

    this.proyectosVisibles = [registro]; // Mostrar sólo este

    this.usuarioService
      .obtenerRolesPorProyectoPorUsuario(this.parametros)
      .subscribe((respuesta: rolProyectoEmpresaUsuarioDTO[]) => {
        this.registros = respuesta;
      });
  }

  obtenerRoles() {
    this.rolService
      .obtenRolesXEmpresa(this.selectedEmpresa)
      .subscribe((respuesta) => {
        this.roles = respuesta;
      });
  }

  asignarRol(idRol: number) {
    let nuevoRegistro: asignarRolAUsuarioEnEmpresaPorPoryectoDTO = {
      idUsuario: this.selectedUsuario,
      idEmpresa: this.selectedEmpresa,
      idProyecto: this.selectedProyectoId,
      idRol: idRol,
    };

    this.usuarioService.asignarRolesPorProyecto(nuevoRegistro).subscribe(() => {
      this.obtenerRelaciones(this.nuevoProyectoAsignado);
    });
  }

  refreshProyectos() {
    this.proyectoService
      .obtenerTodosSinEstructurar(this.selectedEmpresa)
      .subscribe((proyectos: proyectoDTO[]) => {
        this.proyectos = proyectos;
      });
    this._ProyectoUsuarioService
      .obtenerProyectosPorEmpresaPorUsuario({
        idUsuario: this.selectedUsuario,
        idEmpresa: this.selectedEmpresa,
      })
      .subscribe((proyectos) => {
        this.proyectosAsignados = proyectos;
        this.proyectosAsignados.forEach((element) => {
          let p = this.proyectos.find((z) => z.id == element.idProyecto);
          if (p) {
            element.nombreProyecto = p.nombre;
          }
        });
        this.proyectosVisibles = this.proyectosAsignados; // Refresca visibles
      });
  }

  alerta(tipo: AlertaTipo, mensaje: string = '') {
    if (tipo === AlertaTipo.none) {
      this.cerrarAlerta();
      return;
    }

    this.alertaTipo = tipo;
    this.alertaMessage = mensaje || 'Ocurrió un error';
    this.alertaSuccess = true;

    setTimeout(() => {
      this.cerrarAlerta();
    }, 1200);
  }

  cerrarAlerta() {
    this.alertaSuccess = false;
    this.alertaTipo = AlertaTipo.none;
    this.alertaMessage = '';
  }
}
