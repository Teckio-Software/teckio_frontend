import { ProyectoStateService } from './utilidades/drawer/service/proyecto-state.service';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { SeguridadService } from './seguridad/seguridad.service';
import { SeguridadMultiEmpresaService } from './seguridad/seguridad-multi-empresa/seguridad-multi-empresa.service';
import { UsuarioEmpresaService } from './seguridad/Servicios/usuario-empresa.service';
import { map, Observable, of, startWith, Subscription } from 'rxjs';
import { permisos } from './seguridad/autorizado/tsAutorizado';
import { SidenavService } from './utilidades/drawer/service/sidenav.service';
import { onMainContentChange } from './utilidades/drawer/animations/animations';
import { TituloService } from './utilidades/drawer/left-menu/left-menu.component';
import { proyectoDTO } from './proyectos/proyecto/tsProyecto';
import { ProyectoService } from './proyectos/proyecto/proyecto.service';
import { UsuarioUltimaSeccionService } from './seguridad/Servicios/usuario-ultima-seccion.service';
import { EmpresaDTO } from './catalogos/empresas/empresa';
import { usuarioUltimaSeccion } from './seguridad/seguridad-multi-empresa/tsSeguridadMultiEmpresa';
import { FormControl } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  animations: [onMainContentChange],
})
export class AppComponent implements OnInit {
  proyectoControl = new FormControl('');
  filteredProyectos: Observable<proyectoDTO[]> = new Observable<
    proyectoDTO[]
  >();
  public tituloComponente: string = 'Inicio';
  public onSideNavChange: boolean | undefined;
  esLogueado: boolean = false;
  title = 'ERP_Teckio_F';
  subscription!: Subscription;
  recargar: number = 0;
  permisosUsuario: permisos[] = [];
  permisosAdmin: permisos[] = [];
  proyectos!: proyectoDTO[];
  idProyectoChange: number = 0;
  idUsuario: number = 0;
  idUsarioUltimaSeccion: number = 0;
  limiarvalores!: '';
  idProyecto: number = 0;
  proyectoString: string = '';
  idTableUltimoRegistro: number = 0;
  proyectoIdChange: number = 0;
  editarRegistro: usuarioUltimaSeccion = {
    id: 0,
    idProyecto: 0,
    idEmpresa: 0,
    idUsuario: 0,
  };

  isOpen: boolean = false;
  isLoading: boolean = false;

  @Input()
  zvCampoPermiso!: string;
  empresasPertenecientes: EmpresaDTO[] = [];
  selectedEmpresa: number = 0;
  public sideNavState: boolean = false;
  public linkText: boolean = false;

  @ViewChild('textoDataList') textoDataList!: any;

  constructor(
    public zvSeguridadService: SeguridadService,
    public _UsuarioEmpresaService: SeguridadMultiEmpresaService,
    public _UsuarioEmpresa: UsuarioEmpresaService,
    private _sidenavService: SidenavService,
    private tituloService: TituloService,
    private proyectoService: ProyectoService,
    private _UsuarioXIdUsuario: UsuarioUltimaSeccionService,
    private proyectoStateService: ProyectoStateService
  ) {
    let idEmpresa = this.zvSeguridadService.obtenIdEmpresaLocalStorage();
    this.selectedEmpresa = Number(idEmpresa);
    this.idProyectoChange = Number(
      this.zvSeguridadService.obtenerIdProyectoLocalStorage()
    );
    this.idUsuario = Number(
      this.zvSeguridadService.zfObtenerCampoJwt('idUsuario')
    );
    this.esLogueado = this.zvSeguridadService.zfEstaLogueadoBoolean();
    this._sidenavService.sideNavState$.subscribe((res) => {
      this.onSideNavChange = res;
    });

    this._sidenavService.sideNavState$.subscribe((res) => {
      this.onSideNavChange = res;
    });
  }

  private _filter(value: string): proyectoDTO[] {
    const filterValue = this._normalizeValue(String(value));

    return this.proyectos.filter((proyecto) =>
      this._normalizeValue(proyecto.nombre).includes(filterValue)
    );
  }

  private _normalizeValue(value: string): string {
    return value.toLowerCase().replace(/\s/g, '');
  }

  reiniciarFiltro() {
    this.filteredProyectos = this.proyectoControl.valueChanges.pipe(
      startWith(''),
      map((value) => {
        const stringValue = typeof value === 'string' ? value : '';
        return this._filter(stringValue);
      })
    );
  }

  ngOnInit(): void {
    if (this.zvSeguridadService.zfEstaLogueadoBoolean()) {
      // this.obtenerProyectos();
      this.GuardarUltimoProyectoAndEmpresa();
      this.cargarEmpresas();
      this.obtenerProyectos(this.selectedEmpresa);
    }

    this.permisosUsuario.push({
      permiso: 'VisorCorporativo',
      valor: 'Codigo-J05tg8!',
    });

    this.permisosAdmin.push({
      permiso: 'role',
      valor: 'Administrador',
    });

    this.subscription = this._UsuarioEmpresaService.refresh$.subscribe(() => {
      this.cargarEmpresas();
    });
    this.tituloService.tituloComponente$.subscribe((titulo) => {
      this.tituloComponente = titulo;
    });
  }
  actualizar(idEmpresa: number) {
    this.textoDataList.nativeElement.value = '';
    this.recargar++;
    this.zvSeguridadService.guardaIdEmpresaLocalStorage(this.selectedEmpresa);
    if (this.selectedEmpresa > 0) {
      const idEmpresa = Number(this.selectedEmpresa);
      // Actualiza la empresa seleccionada en el último registro
      // Actualizar la lista de proyectos después de cambiar de empresa
      this.proyectoService.obtener(idEmpresa).subscribe((datos) => {
        this.proyectos = datos;
        let editarAtravesDeChangeEmpresa: usuarioUltimaSeccion = {
          id: this.idTableUltimoRegistro,
          idProyecto: 0,
          idEmpresa: idEmpresa,
          idUsuario: this.idUsuario,
        };
        if (datos.length > 0) {
          this.textoDataList.nativeElement.value = datos[0].nombre;
          editarAtravesDeChangeEmpresa.idProyecto = datos[0].id;
          this.zvSeguridadService.guardarIdProyectoLocalStorage(datos[0].id);
        } else {
          this.textoDataList.nativeElement.value = '';
          editarAtravesDeChangeEmpresa.idProyecto = 0;
          this.zvSeguridadService.guardarIdProyectoLocalStorage(0);
        }
        this.selectedEmpresa = idEmpresa;
        this._UsuarioXIdUsuario
          .editarUltimaSeccionUsuario(editarAtravesDeChangeEmpresa)
          .subscribe((datos) => {
            this.recargar++;
            this._UsuarioEmpresaService
              .actualizarClaims()
              .subscribe((datos) => {
                this.actualizaClaims();
                this._UsuarioEmpresaService.zfGuardarToken(datos);
              });
          });
      });
    }
  }
  obtenerProyectos(idEmpresa: number) {
    this.proyectos = [];
    this.proyectoService.obtener(idEmpresa).subscribe((datos) => {
      this.proyectos = datos;
      this.filteredProyectos = this.proyectoControl.valueChanges.pipe(
        startWith(''),
        map((value) => {
          const stringValue = typeof value === 'string' ? value : '';
          return this._filter(stringValue);
        })
      );
      let idAlmacenado = Number(
        this.zvSeguridadService.obtenerIdProyectoLocalStorage()
      );
      if (idAlmacenado > 0) {
        this.idProyecto = idAlmacenado;
        this.zvSeguridadService.guardarIdProyectoLocalStorage(idAlmacenado);
        this.recargar = this.recargar + 1;
      } else {
        this._UsuarioXIdUsuario
          .obtenerUltimaSeccionUsuarioXIUsuario(this.idUsuario)
          .subscribe((data) => {
            if (data.idProyecto == 0) {
              data.idProyecto = datos[0].id;
            }
            this.zvSeguridadService.guardarIdProyectoLocalStorage(
              data.idProyecto
            );
            this.zvSeguridadService.guardaIdEmpresaLocalStorage(data.idEmpresa);

            this.obtenerProyectos(this.selectedEmpresa);
            this.idProyecto = data.idProyecto;
            this.recargar = this.recargar + 1;
          });
      }
    });
  }

  cargarEmpresas(): EmpresaDTO[] {
    let hayToken = this.zvSeguridadService.zfObtenerToken();
    if (typeof hayToken === 'undefined' || !hayToken?.length) {
      return [];
    }
    this.esLogueado = this.zvSeguridadService.zfEstaLogueadoBoolean();
    let idEmpresa = this.zvSeguridadService.obtenIdEmpresaLocalStorage();
    this.selectedEmpresa = Number(idEmpresa);
    this._UsuarioEmpresa.obtenEmpresasPorUsuario().subscribe((empresas) => {
      this.empresasPertenecientes = empresas;
      if (empresas.length > 0 && this.selectedEmpresa <= 0) {
        this.selectedEmpresa = empresas[0].id;
        this.idUsuario = Number(
          this.zvSeguridadService.zfObtenerCampoJwt('idUsuario')
        );
        this.GuardarUltimoProyectoAndEmpresa();
        this.zvSeguridadService.guardaIdEmpresaLocalStorage(
          this.selectedEmpresa
        );
        if (this.selectedEmpresa > 0) {
          this.obtenerProyectos(this.selectedEmpresa);
          this.recargar = this.recargar + 1;
        }
      }
      return this.empresasPertenecientes;
    });
    return [];
  }

  logout() {
    this.recargar = 0;
    this.empresasPertenecientes = [];
    this.zvSeguridadService.zfLogOut();
    this.tituloComponente = 'Inicio';
    this.esLogueado = this.zvSeguridadService.zfEstaLogueadoBoolean();
    this.linkText = false;
    this.sideNavState = false;
    this.isOpen = false;
  }

  actualizaClaims() {
    this.recargar = 0;
    this.zvSeguridadService.zNewClaims();
  }

  onSinenavToggle() {
    this.sideNavState = !this.sideNavState;
    this.isOpen = !this.isOpen;
    this.linkText = this.sideNavState;

    this._sidenavService.sideNavState$.next(this.sideNavState);
  }

  toggleSidenav(sidenav: any) {
    sidenav.toggle();
    this.onSideNavChange = !this.onSideNavChange;
  }

  GuardarUltimoProyectoAndEmpresa() {
    this._UsuarioXIdUsuario
      .obtenerUltimaSeccionUsuarioXIUsuario(this.idUsuario)
      .subscribe((datos) => {
        this.idTableUltimoRegistro = Number(datos.id);
        if (datos.id > 0) {
          this.selectedEmpresa = datos.idEmpresa;
          this.idProyecto = datos.idProyecto;
          this.proyectoService
            .obtenerXId(datos.idProyecto, datos.idEmpresa)
            .subscribe((datos) => {
              this.proyectoControl.setValue(datos.nombre);
              this.proyectoString = datos.nombre;
              this.zvSeguridadService.guardarIdProyectoLocalStorage(
                this.idProyecto
              );
            });
        } else {
          let nuevoRegistro: usuarioUltimaSeccion = {
            id: 0,
            idProyecto: this.idProyecto,
            idEmpresa: this.selectedEmpresa,
            idUsuario: this.idUsuario,
          };
          this._UsuarioXIdUsuario
            .crearUltimaSeccionUsuario(nuevoRegistro)
            .subscribe((datos) => {
              this.selectedEmpresa = datos.idEmpresa;
              this.idProyecto = datos.idProyecto;
              this.zvSeguridadService.guardarIdProyectoLocalStorage(
                this.idProyecto
              );
              this.recargar++;
              this._UsuarioEmpresaService
                .actualizarClaims()
                .subscribe((datos) => {
                  this.actualizaClaims();
                  this._UsuarioEmpresaService.zfGuardarToken(datos);
                });
            });
        }
      });
  }

  selectionChangeContratista(event: MatAutocompleteSelectedEvent) {
    const selectedProyecto = event.option.value;
    this.isLoading = true;
    console.log('seleccionando...', this.isLoading);

    this.proyectoControl.setValue(selectedProyecto.nombre);
    const exixteProyecto = this.proyectos.filter(
      (e) => e.nombre === selectedProyecto.nombre
    );
    if (exixteProyecto.length > 0) {
      const idProyecto = selectedProyecto.id;
      if (idProyecto > 0) {
        this.zvSeguridadService.guardarIdProyectoLocalStorage(idProyecto);
        this.recargar = this.recargar + 1;
        this.proyectoIdChange = idProyecto;
        let idEmpresa = Number(this.selectedEmpresa);
        let nuevoRegistro: usuarioUltimaSeccion = {
          id: this.idTableUltimoRegistro,
          idProyecto: this.proyectoIdChange,
          idEmpresa: idEmpresa,
          idUsuario: this.idUsuario,
        };
        this._UsuarioXIdUsuario
          .editarUltimaSeccionUsuario(nuevoRegistro)
          .subscribe((datos) => {
            this.recargar++;
            this._UsuarioEmpresaService
              .actualizarClaims()
              .subscribe((datos) => {
                this.actualizaClaims();
                this._UsuarioEmpresaService.zfGuardarToken(datos);
                this.zvSeguridadService.actualizarToken(datos.token);
                this.proyectoStateService.setProyectoNombre(selectedProyecto);

                this.isLoading = false;
              });
          });
        this.recargar++;
      }
    }
  }
}
