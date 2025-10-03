import { NestedTreeControl } from '@angular/cdk/tree';
import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  HostListener,
  OnInit,
  QueryList,
  ViewChildren,
} from '@angular/core';
import { RolMenuEstructuraDTO } from './tsRolMultiEmpresa';
import { MatTreeNestedDataSource } from '@angular/material/tree';
import { SeguridadMultiEmpresaService } from '../seguridad-multi-empresa/seguridad-multi-empresa.service';
import { MatDialog } from '@angular/material/dialog';
import { UtilidadesService } from 'src/app/utilidades/utilidades.service';
import { ModalRolMultiEmpresaComponent } from './modal-rol-multi-empresa/modal-rol-multi-empresa.component';
import { RolDTO } from '../tsSeguridad';
import { RolService } from '../Servicios/rol.service';
import { AutorizacionRolService } from '../Servicios/autorizacion-rol.service';
import { corporativo } from '../usuario-multi-empresa/tsUsuarioMultiEmpresa';
import { CorporativoService } from 'src/app/catalogos/corporativo/corporativo.service';
import { UsuarioCorporativoService } from '../Servicios/usuario-corporativo.service';
import { MenusService } from '../Servicios/menus.service';
import { MenuDTO } from '../modelos/tsMenu';
import { EmpresaDTO } from 'src/app/catalogos/empresas/empresa';
import { EmpresaService } from 'src/app/catalogos/empresas/empresa.service';
import { animate, style, transition, trigger } from '@angular/animations';
import { AlertaTipo } from 'src/app/utilidades/alert/alert.component';

@Component({
  selector: 'app-rol-multi-empresa',
  templateUrl: './rol-multi-empresa.component.html',
  styleUrls: ['./rol-multi-empresa.component.css'],
  animations: [
    trigger('fadeScaleIn', [
      transition(':enter', [
        style({
          opacity: 0,
          transform: 'scale(0.95)',
        }),
        animate(
          '250ms ease-out',
          style({
            opacity: 1,
            transform: 'scale(1)',
          })
        ),
      ]),
      transition(':leave', [
        animate(
          '200ms ease-in',
          style({
            opacity: 0,
            transform: 'scale(0.95)',
          })
        ),
      ]),
    ]),
  ],
})
export class RolMultiEmpresaComponent implements OnInit {
  empresas: EmpresaDTO[] = [];
  empresas2: EmpresaDTO[] = [];
  roles: RolDTO[] = [];
  descripcionRol: string = '';
  descripcionMenu: string = '';
  descripcionSeccion: string = '';
  muestraRoles: boolean = false;
  muestraMenus: boolean = false;
  muestraSecciones: boolean = false;
  muestraActividades: boolean = false;
  menus: MenuDTO[] = [];
  dataRolMenu: RolMenuEstructuraDTO[] = [];
  dataMenuFiltrado: RolMenuEstructuraDTO[] = [];
  dataRolSeccionFiltrado: RolMenuEstructuraDTO[] = [];
  dataRolActividadFiltrado: RolMenuEstructuraDTO[] = [];
  corporativos: corporativo[] = [];
  selectedEmpresa: number = 0;
  selectedRol: number = 0;
  selectedCorporativo: number = 0;
  selectedSeccion: number = 0;
  nuevoRol: boolean = false;

  alertaSuccess: boolean = false;
  alertaMessage: string = '';
  alertaTipo: AlertaTipo = AlertaTipo.none;
  AlertaTipo = AlertaTipo;

  isLoading: boolean = true;

  @ViewChildren('inputRol') inputsRol!: QueryList<ElementRef<HTMLInputElement>>;

  constructor(
    private rolService: RolService,
    private empresaService: EmpresaService,
    private usuarioCorporativoService: UsuarioCorporativoService,
    private cdr: ChangeDetectorRef
  ) {}
  @HostListener('document:keydown.escape', ['$event'])
  onKeydownHandler(event: KeyboardEvent) {
    if (!this.nuevoRol) {
      return;
    }
    this.nuevoRol = false;
    this.roles.shift();
  }
  ngOnInit(): void {
    this.cargarRegistrosCorporativos();
  }

  cargarRegistrosRoles(idEmpresa: number): void {
    if (this.selectedEmpresa === idEmpresa) {
      this.selectedEmpresa = 0;
      this.roles = [];
      this.muestraRoles = false;
      this.muestraMenus = false;
      this.muestraSecciones = false;
      this.muestraActividades = false;
    } else {
      this.selectedEmpresa = idEmpresa;
      this.rolService.obtenRolesXEmpresa(idEmpresa).subscribe((datos) => {
        this.roles = datos;
        this.muestraRoles = true;
        this.muestraMenus = false;
        this.muestraSecciones = false;
        this.muestraActividades = false;
        this.limpiarDesdeMenu();
      });
    }
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

  cargarRegistrosMenusXPor(idRol: number) {
    this.selectedRol = idRol;
    this.limpiarDesdeMenu();
  }

  cargarRegistrosMenus() {
    this.rolService
      .obtenMenusXEmpresa(this.selectedEmpresa)
      .subscribe((datos) => {
        this.menus = datos;
      });
  }

  filaseleccionada: any = null;

  seleccionarFila(fila: any) {
    this.filaseleccionada = fila;
  }

  cargarRegistrosSecciones(menu: MenuDTO) {
    this.descripcionMenu = menu.descripcion;
    this.dataRolSeccionFiltrado = [];
    this.descripcionSeccion = '';
    this.dataRolActividadFiltrado = [];
    this.rolService
      .obtenSeccionesPorRol(this.selectedRol, menu.id)
      .subscribe((datos) => {
        this.dataRolSeccionFiltrado = datos;
        this.muestraSecciones = true;
      });
    this.filaseleccionada = menu;
    this.limpiarActividad();
  }

  cargarRegistrosActividades(seccion: RolMenuEstructuraDTO) {
    this.rolService
      .obtenActividadesPorRol(this.selectedRol, seccion.idSeccion)
      .subscribe((datos) => {
        this.dataRolActividadFiltrado = datos;
        this.muestraActividades = true;
      });
    this.filaseleccionada = seccion;
  }

  cambiaEmpresa(idEmpresa: number) {
    this.selectedEmpresa = idEmpresa;
    this.dataRolMenu = [];
    this.dataMenuFiltrado = [];
    this.dataRolSeccionFiltrado = [];
    this.dataRolActividadFiltrado = [];
  }

  preparacionRolEmpresa() {
    if (this.nuevoRol) {
      return;
    }
    this.nuevoRol = true;

    this.roles.unshift({
      id: 0,
      nombre: '',
    });

    this.cdr.detectChanges();

    setTimeout(() => {
      const input = this.inputsRol.first;
      if (input) {
        input.nativeElement.focus();
      }
    });
  }

  crearRolEnEmpresa() {
    this.rolService
      .crearRoleEnEmpresa({
        nombre: '',
        idEmpresa: this.selectedEmpresa,
      })
      .subscribe(() => {
        this.nuevoRol = false;
      });
  }

  selecccionaRol(idRol: number) {
    this.selectedRol = idRol;
    this.muestraMenus = true;
    if (this.selectedRol > 0) {
      this.dataMenuFiltrado;
      this.cargarRegistrosMenus();
      this.muestraSecciones = false;
      this.muestraActividades = false;
      this.descripcionMenu = '';
      this.limpiarDesdeSeccion();
    }
  }

  editar(rol: RolDTO) {
    if (!this.nuevoRol && this.selectedRol > 0) {
      this.rolService
        .editarNombreRol({
          idRol: rol.id,
          descripcionRol: rol.nombre,
        })
        .subscribe(() => {
          this.cargarRegistrosRoles(this.selectedEmpresa);
          this.alerta(AlertaTipo.save, 'Rol editado correctamente');
        });
    } else {
      this.rolService
        .crearRoleEnEmpresa({
          nombre: rol.nombre,
          idEmpresa: this.selectedEmpresa,
        })
        .subscribe(() => {
          this.cargarRegistrosRoles(this.selectedEmpresa);
          this.alerta(AlertaTipo.save, 'Rol creado correctamente');
        });
    }
    this.nuevoRol = false;
  }

  asignaPermisoSeccion(parametro: RolMenuEstructuraDTO) {
    if (parametro.esActivo == false) {
      return;
    }
    this.rolService
      .autorizaSeccionARol({
        idRol: parametro.idRol,
        idSeccion: parametro.idSeccion,
      })
      .subscribe();
  }

  activarSeccion(registro: RolMenuEstructuraDTO) {
    let objetosActividad = this.dataRolActividadFiltrado.filter(
      (objeto) => objeto.idSeccion === registro.idSeccion
    );
    if (registro.esActivo) {
      this.rolService
        .autorizaSeccionARol({
          idRol: registro.idRol,
          idSeccion: registro.idSeccion,
        })
        .subscribe(() => {});
    } else {
      this.rolService
        .quitarAutorizacionSeccionARol({
          idRol: registro.idRol,
          idMenu: registro.idMenu,
          idSeccion: registro.idSeccion,
          idActividad: registro.idActividad,
          tipoMenu: 5,
          descripcion: '',
          estructura: [],
          esActivo: false,
          esAutorizado: false,
        })
        .subscribe(() => {
          objetosActividad.forEach((element) => {
            element.esActivo = false;
          });
        });
    }
  }

  activarActividad(actividad: RolMenuEstructuraDTO) {
    let objetosSeccion = this.dataRolSeccionFiltrado.filter(
      (objeto) => objeto.idSeccion == actividad.idSeccion
    );
    if (objetosSeccion.length > 0 && actividad.esActivo) {
      this.rolService
        .autorizaActividadARol({
          idRol: actividad.idRol,
          idMenu: actividad.idMenu,
          idSeccion: actividad.idSeccion,
          idActividad: actividad.idActividad,
        })
        .subscribe(() => {
          objetosSeccion[0].esActivo = true;
        });
    } else if (!actividad.esActivo) {
      this.rolService
        .quitarAutorizacionActividadARol({
          idRol: actividad.idRol,
          idMenu: actividad.idMenu,
          idSeccion: actividad.idSeccion,
          idActividad: actividad.idActividad,
          tipoMenu: 5,
          descripcion: '',
          estructura: [],
          esActivo: false,
          esAutorizado: false,
        })
        .subscribe(() => {});
    }
  }
  cambiaCorporativo(idCorporativo: number) {
    this.selectedCorporativo = idCorporativo;
    this.empresaService
      .ObtenXIdCorporativo(this.selectedCorporativo)
      .subscribe((datos) => {
        this.empresas = datos;
        this.limpiarDesdeRol();
      });
  }
  cargarRegistrosCorporativos() {
    this.usuarioCorporativoService
      .obtenCorporativosPertenecientes()
      .subscribe((datos) => {
        this.corporativos = datos;
        if (this.corporativos.length > 0) {
          this.selectedCorporativo = this.corporativos[0].id;
          this.cambiaCorporativo(this.selectedCorporativo);
        }
        this.isLoading = false;
      });
  }
  limpiarDesdeRol() {
    this.roles = [];
    this.menus = [];
    this.dataRolSeccionFiltrado = [];
    this.dataRolActividadFiltrado = [];
  }
  limpiarDesdeMenu() {
    this.menus = [];
    this.dataRolSeccionFiltrado = [];
    this.dataRolActividadFiltrado = [];
  }
  limpiarDesdeSeccion() {
    this.dataRolSeccionFiltrado = [];
    this.dataRolActividadFiltrado = [];
  }
  limpiarActividad() {
    this.dataRolActividadFiltrado = [];
  }
}
