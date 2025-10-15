import { id } from 'date-fns/locale';
import { ProyectoStateService } from './utilidades/drawer/service/proyecto-state.service';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { SeguridadService } from './seguridad/seguridad.service';
import { SeguridadMultiEmpresaService } from './seguridad/seguridad-multi-empresa/seguridad-multi-empresa.service';
import { UsuarioEmpresaService } from './seguridad/Servicios/usuario-empresa.service';
import {
  forkJoin,
  map,
  Observable,
  of,
  startWith,
  Subscription,
  switchMap,
} from 'rxjs';
import { permisos } from './seguridad/autorizado/tsAutorizado';
import { SidenavService } from './utilidades/drawer/service/sidenav.service';
import { onButtonClose, onMainContentChange } from './utilidades/drawer/animations/animations';
import { TituloService } from './utilidades/drawer/left-menu/left-menu.component';
import { proyectoDTO } from './proyectos/proyecto/tsProyecto';
import { ProyectoService } from './proyectos/proyecto/proyecto.service';
import { UsuarioUltimaSeccionService } from './seguridad/Servicios/usuario-ultima-seccion.service';
import { EmpresaDTO } from './catalogos/empresas/empresa';
import { usuarioUltimaSeccion } from './seguridad/seguridad-multi-empresa/tsSeguridadMultiEmpresa';
import { FormControl } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { initFlowbite } from 'flowbite';

import { set } from 'date-fns';
import { AuthEventService } from './utilidades/event-auth-service/auth-event.service';
 
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  animations: [onMainContentChange, onButtonClose],
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
  @Input() hoverMenu: 'open' | 'close' = 'close';

  onMouseEnter(): void {
    // Cambia el estado a 'open' para que el margen se mueva a 200px
    this.hoverMenu = 'open'; 
  }

  // 2. Método para manejar cuando el ratón SALE (unhover)
  onMouseLeave(): void {
    // Regresa el estado a 'close' para que el margen vuelva a 62px
    this.hoverMenu = 'close';
  }
 
  isOpen: boolean = false;
  isLoading: boolean = false;
 
  @Input()
  zvCampoPermiso!: string;
  empresasPertenecientes: EmpresaDTO[] = [];
  selectedEmpresa: number = 0;
  public sideNavState: boolean = false;
  public linkText: boolean = false;
 
  @ViewChild('textoDataList') textoDataList!: any;
 
  private loginSubscription: Subscription;

  constructor(
    public zvSeguridadService: SeguridadService,
    public _UsuarioEmpresaService: SeguridadMultiEmpresaService,
    public _UsuarioEmpresa: UsuarioEmpresaService,
    private _sidenavService: SidenavService,
    private tituloService: TituloService,
    private proyectoService: ProyectoService,
    private _UsuarioXIdUsuario: UsuarioUltimaSeccionService,
    private proyectoStateService: ProyectoStateService,
    private authEventService: AuthEventService
  ) {
    // let idEmpresa = this.zvSeguridadService.obtenIdEmpresaLocalStorage();
    // this.selectedEmpresa = Number(idEmpresa);
    // this.idUsuario = Number(
    //   this.zvSeguridadService.zfObtenerCampoJwt('idUsuario')
    // );
    
    // this.esLogueado = this.zvSeguridadService.zfEstaLogueadoBoolean();
    this._sidenavService.sideNavState$.subscribe((res) => {
      this.onSideNavChange = res;
    });
 
    this._sidenavService.sideNavState$.subscribe((res) => {
      this.onSideNavChange = res;
    });
    this.loginSubscription = this.authEventService.loginSuccess$.subscribe(() => {
      this.handleLoginSuccess(); // Llama a la nueva lógica
    });
  }

  handleLoginSuccess(): void {
    this.initializeAppData(); 
    let idEmpresa = this.zvSeguridadService.obtenIdEmpresaLocalStorage();
    if(idEmpresa == null || idEmpresa == undefined || idEmpresa == ''){
      idEmpresa = '1';
    }
    this.selectedEmpresa = Number(idEmpresa);
    this.zvSeguridadService.guardaIdEmpresaLocalStorage(this.selectedEmpresa);
    // this.obtenerUltimaSeccionEmpresaYProyecto(); 
  }

  private initializeAppData(): void {
    let idEmpresa = this.zvSeguridadService.obtenIdEmpresaLocalStorage();
    this.selectedEmpresa = Number(idEmpresa);
    this.idUsuario = Number(
      this.zvSeguridadService.zfObtenerCampoJwt('idUsuario')
      
    );
    this.esLogueado = this.zvSeguridadService.zfEstaLogueadoBoolean();
    if (this.esLogueado) {
      this.obtenerUltimaSeccionEmpresaYProyectoSinCrear();
    }
    this.idProyecto = Number(
      this.zvSeguridadService.obtenerIdProyectoLocalStorage()
    );
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
 
  private actualizarListadoProyectos(proyectos: proyectoDTO[]): void {
    this.proyectos = proyectos;
    const idProyectoLocal = Number(
      this.zvSeguridadService.obtenerIdProyectoLocalStorage()
    );
    // if (this.proyectos.length > 0 && idProyectoLocal === 0) {
    //   this.zvSeguridadService.guardarIdProyectoLocalStorage(
    //     this.proyectos[0].id
    //   );
    // }
    const idProyecto = Number(
      this.zvSeguridadService.obtenerIdProyectoLocalStorage()
    );
    this.idProyecto = idProyecto 
    let proyecto = this.proyectos.find((x) => x.id === idProyecto);
    if (proyecto) {
      this.proyectoControl.setValue(proyecto.nombre);
    }
    this.reiniciarFiltro();
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
    this.initializeAppData();
    initFlowbite();
    // if (this.zvSeguridadService.zfEstaLogueadoBoolean()) {
    //   this.obtenerUltimaSeccionEmpresaYProyecto();
    // }
    this.permisosUsuario.push({
      permiso: 'VisorCorporativo',
      valor: 'Codigo-J05tg8!',
    });
    this.permisosAdmin.push({
      permiso: 'role',
      valor: 'Administrador',
    });
    this.subscription = this._UsuarioEmpresaService.refresh$.subscribe(() => {
      this.obtenerUltimaSeccionEmpresaYProyecto();
    });
    this.tituloService.tituloComponente$.subscribe((titulo) => {
      this.tituloComponente = titulo;
    });
  }
  actualizar(idEmpresa: number) {
    if (!idEmpresa) {
      return;
    }
 
    if (this.textoDataList?.nativeElement) {
      this.textoDataList.nativeElement.value = '';
    }
 
    this.isLoading = true;
    this.selectedEmpresa = idEmpresa;
    this.zvSeguridadService.guardaIdEmpresaLocalStorage(idEmpresa);
    this.zvSeguridadService.guardarIdProyectoLocalStorage(0);
    this.idProyecto = 0;
 
    this._UsuarioXIdUsuario
      .obtenerUltimaSeccionUsuarioXIUsuario(this.idUsuario)
      .pipe(
        switchMap((datos) => {
          const nuevoRegistro: usuarioUltimaSeccion = {
            id: datos.id,
            idProyecto: Number(
              this.zvSeguridadService.obtenerIdProyectoLocalStorage()
            ),
            idEmpresa: idEmpresa,
            idUsuario: this.idUsuario,
          };
          const ultimaSeccion$ =
            datos.id > 0
              ? this._UsuarioXIdUsuario.editarUltimaSeccionUsuario(
                  nuevoRegistro
                )
              : this._UsuarioXIdUsuario.crearUltimaSeccionUsuario(
                  nuevoRegistro
                );
 
          return forkJoin({
            ultimaSeccion: ultimaSeccion$,
            claims: this._UsuarioEmpresaService.actualizarClaims(),
            proyectos: this.proyectoService.obtener(idEmpresa),
          });
        })
      )
      .subscribe({
        next: ({ claims, proyectos }) => {
          this._UsuarioEmpresaService.zfGuardarToken(claims);
          this.zvSeguridadService.actualizarToken(claims.token);
          this.actualizarListadoProyectos(proyectos);
          this.isLoading = false;
          this.recargar++;
        },
        error: (error) => {
          console.error('Error al actualizar empresa', error);
          this.isLoading = false;
        },
      });
  }
 
  // obtenerProyectos(idEmpresa: number) {
  //   this.proyectos = [];
  //   this.proyectoService.obtener(idEmpresa).subscribe((datos) => {
  //     this.proyectos = datos;
  //     this.filteredProyectos = this.proyectoControl.valueChanges.pipe(
  //       startWith(''),
  //       map((value) => {
  //         const stringValue = typeof value === 'string' ? value : '';
  //         return this._filter(stringValue);
  //       })
  //     );
  //     let idAlmacenado = Number(
  //       this.zvSeguridadService.obtenerIdProyectoLocalStorage()
  //     );
  //     if (idAlmacenado > 0) {
  //       this.idProyecto = idAlmacenado;
  //       this.zvSeguridadService.guardarIdProyectoLocalStorage(idAlmacenado);
  //       this.recargar = this.recargar + 1;
  //     } else {
  //       this._UsuarioXIdUsuario
  //         .obtenerUltimaSeccionUsuarioXIUsuario(this.idUsuario)
  //         .subscribe((data) => {
  //           if (data.idProyecto == 0) {
  //             data.idProyecto = datos[0].id;
  //           }
  //           this.zvSeguridadService.guardarIdProyectoLocalStorage(
  //             data.idProyecto
  //           );
  //           this.zvSeguridadService.guardaIdEmpresaLocalStorage(data.idEmpresa);
 
  //           this.obtenerProyectos(this.selectedEmpresa);
  //           this.idProyecto = data.idProyecto;
  //           this.recargar = this.recargar + 1;
  //         });
  //     }
  //   });
  // }
 
  // cargarEmpresas(): EmpresaDTO[] {
  //   let hayToken = this.zvSeguridadService.zfObtenerToken();
  //   if (typeof hayToken === 'undefined' || !hayToken?.length) {
  //     return [];
  //   }
  //   this.esLogueado = this.zvSeguridadService.zfEstaLogueadoBoolean();
  //   let idEmpresa = this.zvSeguridadService.obtenIdEmpresaLocalStorage();
  //   this.selectedEmpresa = Number(idEmpresa);
  //   console.log(
  //     'esta es la empresa que esta en el localstorage',
  //     this.selectedEmpresa
  //   );
  //   this._UsuarioEmpresa.obtenEmpresasPorUsuario().subscribe((empresas) => {
  //     this.empresasPertenecientes = empresas;
  //     if (empresas.length > 0 && this.selectedEmpresa <= 0) {
  //       this.selectedEmpresa = empresas[0].id;
  //       this.idUsuario = Number(
  //         this.zvSeguridadService.zfObtenerCampoJwt('idUsuario')
  //       );
  //       this.GuardarUltimoProyectoAndEmpresa();
  //       this.zvSeguridadService.guardaIdEmpresaLocalStorage(
  //         this.selectedEmpresa
  //       );
  //       if (this.selectedEmpresa > 0) {
  //         this.obtenerProyectos(this.selectedEmpresa);
  //         this.recargar = this.recargar + 1;
  //       }
  //     }
  //     return this.empresasPertenecientes;
  //   });
  //   return [];
  // }
 
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

  onSinenavToggleOpen() {
    this.sideNavState = true;
    this.isOpen = true;
    this.linkText = true;
 
    this._sidenavService.sideNavState$.next(this.sideNavState);
  }
 
  toggleSidenav(sidenav: any) {
    sidenav.toggle();
    this.onSideNavChange = !this.onSideNavChange;
  }
 
  // GuardarUltimoProyectoAndEmpresa() {
  //   this._UsuarioXIdUsuario
  //     .obtenerUltimaSeccionUsuarioXIUsuario(this.idUsuario)
  //     .subscribe((datos) => {
  //       this.idTableUltimoRegistro = Number(datos.id);
  //       if (datos.id > 0) {
  //         this.selectedEmpresa = datos.idEmpresa;
  //         this.idProyecto = datos.idProyecto;
  //         this.proyectoService
  //           .obtenerXId(datos.idProyecto, datos.idEmpresa)
  //           .subscribe((datos) => {
  //             this.proyectoControl.setValue(datos.nombre);
  //             this.proyectoString = datos.nombre;
  //           });
  //         this.zvSeguridadService.guardarIdProyectoLocalStorage(
  //           this.idProyecto
  //         );
  //       } else {
  //         let nuevoRegistro: usuarioUltimaSeccion = {
  //           id: 0,
  //           idProyecto: this.idProyecto,
  //           idEmpresa: this.selectedEmpresa,
  //           idUsuario: this.idUsuario,
  //         };
  //         this._UsuarioXIdUsuario
  //           .crearUltimaSeccionUsuario(nuevoRegistro)
  //           .subscribe((datos) => {
  //             this.selectedEmpresa = datos.idEmpresa;
  //             this.idProyecto = datos.idProyecto;
  //             this.zvSeguridadService.guardarIdProyectoLocalStorage(
  //               this.idProyecto
  //             );
  //             this.recargar++;
  //             this._UsuarioEmpresaService
  //               .actualizarClaims()
  //               .subscribe((datos) => {
  //                 this.actualizaClaims();
  //                 this._UsuarioEmpresaService.zfGuardarToken(datos);
  //               });
  //           });
  //       }
  //     });
  // }
 
  obtenerUltimaSeccionEmpresaYProyecto() {
    let hayToken = this.zvSeguridadService.zfObtenerToken();
    if (typeof hayToken === 'undefined' || !hayToken?.length) {
      return;
    }
    this.esLogueado = this.zvSeguridadService.zfEstaLogueadoBoolean();
    this._UsuarioXIdUsuario
      .obtenerUltimaSeccionUsuarioXIUsuario(this.idUsuario)
      .subscribe((datos) => {
        if (datos.id > 0) {
          // Guardar en localstorage Empresa y Proyecto
          this.zvSeguridadService.guardaIdEmpresaLocalStorage(datos.idEmpresa);
          this.zvSeguridadService.guardarIdProyectoLocalStorage(
            datos.idProyecto
          );
          this.cargarEmpresasXUsuario();
        } else {
          this.zvSeguridadService.guardaIdEmpresaLocalStorage(0);
          this.zvSeguridadService.guardarIdProyectoLocalStorage(0);
          // Obtenemos Empresa y Proyecto
          this.cargarEmpresasXUsuario();
 
          // Generar nuevo registro para ultima seccion y guardarlo
          setTimeout(() => {
            let nuevoRegistro: usuarioUltimaSeccion = {
              id: 0,
              idProyecto: Number(
                this.zvSeguridadService.obtenerIdProyectoLocalStorage()
              ),
              idEmpresa: Number(
                this.zvSeguridadService.obtenIdEmpresaLocalStorage()
              ),
              idUsuario: this.idUsuario,
            };
            this._UsuarioXIdUsuario
              .crearUltimaSeccionUsuario(nuevoRegistro)
              .subscribe((datos) => {
                this._UsuarioEmpresaService
                  .actualizarClaims()
                  .subscribe((datos) => {
                    this.actualizaClaims();
                    this._UsuarioEmpresaService.zfGuardarToken(datos);
                    this.recargar++;
                  });
              });
          }, 500);
        }
      });
  }

  obtenerUltimaSeccionEmpresaYProyectoSinCrear() {
    let hayToken = this.zvSeguridadService.zfObtenerToken();
    if (typeof hayToken === 'undefined' || !hayToken?.length) {
      return;
    }
    this.esLogueado = this.zvSeguridadService.zfEstaLogueadoBoolean();
    this._UsuarioXIdUsuario
      .obtenerUltimaSeccionUsuarioXIUsuario(this.idUsuario)
      .subscribe((datos) => {
        if (datos.id > 0) {
          // Guardar en localstorage Empresa y Proyecto
          this.zvSeguridadService.guardaIdEmpresaLocalStorage(datos.idEmpresa);
          this.zvSeguridadService.guardarIdProyectoLocalStorage(
            datos.idProyecto
          );
          this.cargarEmpresasXUsuario();
        } else {
          this.zvSeguridadService.guardaIdEmpresaLocalStorage(0);
          this.zvSeguridadService.guardarIdProyectoLocalStorage(0);
          // Obtenemos Empresa y Proyecto
          this.cargarEmpresasXUsuario();
        }
      });
  }
 
  cargarEmpresasXUsuario() {
    this._UsuarioEmpresa.obtenEmpresasPorUsuario().subscribe((empresas) => {
      this.empresasPertenecientes = empresas;
      let idEmpresa = Number(
        this.zvSeguridadService.obtenIdEmpresaLocalStorage()
      );
      if (empresas.length > 0) {
        if (idEmpresa == 0) {
          this.zvSeguridadService.guardaIdEmpresaLocalStorage(empresas[0].id);
        }
        this.cargarProyectosXEmpresa();
      }
    });
  }
 
  cargarProyectosXEmpresa() {
    const idEmpresa = Number(
      this.zvSeguridadService.obtenIdEmpresaLocalStorage()
    );
 
    this.proyectoService.obtener(idEmpresa).subscribe((datos) => {
      this.actualizarListadoProyectos(datos);
    });
  }
 
  selectionChangeContratista(event: MatAutocompleteSelectedEvent) {
    const selectedProyecto = event.option.value;
    this.isLoading = true;
    this.idProyecto = selectedProyecto.id;
 
    this.proyectoControl.setValue(selectedProyecto.nombre);
    const exixteProyecto = this.proyectos.filter(
      (e) => e.nombre === selectedProyecto.nombre
    );
    if (exixteProyecto.length > 0) {
      this.zvSeguridadService.guardarIdProyectoLocalStorage(
        selectedProyecto.id
      );
      this._UsuarioXIdUsuario
        .obtenerUltimaSeccionUsuarioXIUsuario(this.idUsuario)
        .subscribe((datos) => {
          // editar registro para ultima seccion y guardarlo
          let nuevoRegistro: usuarioUltimaSeccion = {
            id: datos.id,
            idProyecto: Number(
              this.zvSeguridadService.obtenerIdProyectoLocalStorage()
            ),
            idEmpresa: Number(
              this.zvSeguridadService.obtenIdEmpresaLocalStorage()
            ),
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
        });
    }
  }
}