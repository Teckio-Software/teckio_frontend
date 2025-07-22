import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { SidenavService } from '../service/sidenav.service';
import { onSideNavChange, animateText } from '../animations/animations';
import { Router, NavigationEnd } from '@angular/router';
import { Injectable } from '@angular/core';
import {
  BehaviorSubject,
  filter,
  Subject,
  takeUntil,
  Subscription,
  tap,
  delay,
  switchMap,
  from,
  combineLatest,
} from 'rxjs';
import { SeguridadService } from 'src/app/seguridad/seguridad.service';
import { BreakpointObserver } from '@angular/cdk/layout';
import { ProyectoStateService } from '../service/proyecto-state.service';
import { proyectoDTO } from 'src/app/proyectos/proyecto/tsProyecto';
import { Page, pages } from '../../tsUtilidades';

@Component({
  selector: 'app-left-menu',
  templateUrl: './left-menu.component.html',
  styleUrls: ['./left-menu.component.css'],
  animations: [onSideNavChange, animateText],
})
export class LeftMenuComponent implements OnInit {
  @Output() onSinenavToggle = new EventEmitter<void>();
  @Input() sideNavState: boolean = false;
  @Input() linkText: boolean = false;
  @Input() isLoading!: boolean;

  public pagesFiltradas: Page[] = [];
  private destroy$ = new Subject<void>();
  public tituloComponente: string = 'Inicio';
  private subscription = new Subscription();
  proyectoActual: proyectoDTO | null = null;
  permisosUsuario: string[] = [];
  isMobile: boolean = false;
  sideNavVisible: boolean = true;

  constructor(
    private _sidenavService: SidenavService,
    private router: Router,
    private tituloService: TituloService,
    public zvSeguridadService: SeguridadService,
    private breakpointObserver: BreakpointObserver,
    private proyectoStateService: ProyectoStateService
  ) {}
  ngOnInit() {
    combineLatest([
      this.proyectoStateService.proyectoNombre$,
      this.zvSeguridadService.token$,
    ]).subscribe(([proyecto, token]) => {
      if (!token) {
        const localToken = localStorage.getItem('token');
        if (localToken) {
          this.zvSeguridadService.actualizarToken(localToken);
          return;
        }
      }
      if (proyecto && token) {
        this.permisosUsuario =
          this.zvSeguridadService.obtenerSeccionesUsuario();
        this.filtrarPagesPorPermiso();
        console.log(this.permisosUsuario);
      } else {
        this.pagesFiltradas = [];
      }
    });

    this.router.events
      .pipe(filter((event: any) => event instanceof NavigationEnd))
      .subscribe(() => {
        this.setPageTitleBasedOnRoute(this.router.url);
        this.validarAccesoAProyectoActual();
      });

    this.breakpointObserver
      .observe(['(max-width: 639px)'])
      .pipe(takeUntil(this.destroy$))
      .subscribe((result) => {
        this.isMobile = result.matches;
        if (this.isMobile) {
          this.sideNavVisible = false;
          this.sideNavState = false;
          this.linkText = false;
        } else {
          this.sideNavVisible = true;
        }
      });

    this.breakpointObserver
      .observe(['(max-width: 639px)'])
      .pipe(takeUntil(this.destroy$))
      .subscribe((result) => {
        this.isMobile = result.matches;
        if (this.isMobile) {
          this.sideNavVisible = false;
          this.sideNavState = false;
          this.linkText = false;
        } else {
          this.sideNavVisible = true;
        }
      });

    this._sidenavService.sideNavState$.next(this.sideNavState);
    this.tituloComponente = this.tituloComponente;
    this.router.events
      .pipe(filter((event: any) => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        const currentRoute = event.urlAfterRedirects;
        this.setPageTitleBasedOnRoute(currentRoute);
      });
    const initialRoute = this.router.url;
    this.setPageTitleBasedOnRoute(initialRoute);
  }

  private tienePermiso(required: string[] = []): boolean {
    // Si la sección no requiere permisos o el array está vacío/contiene "" (público)
    if (!required || required.length === 0 || required.some((p) => p === '')) {
      return true;
    }
    // Si el usuario tiene al menos uno de los permisos requeridos
    return required.some((permiso) => this.permisosUsuario.includes(permiso));
  }

  private esAdministrador(): boolean {
    const rol = this.zvSeguridadService.zfObtenerCampoJwt('role');
    const admin = rol === 'Administrador';
    return admin;
  }

  private filtrarPagesPorPermiso(): void {
    const esAdmin = this.esAdministrador();

    this.pagesFiltradas = pages
      .filter(
        (page) =>
          esAdmin ||
          (page.nestedPages || []).some((nested) =>
            this.tienePermiso(nested.permiso)
          )
      )
      .map((page) => ({
        ...page,
        nestedPages: (page.nestedPages || []).filter(
          (nested) => esAdmin || this.tienePermiso(nested.permiso)
        ),
      }));
  }

  private validarAccesoAProyectoActual(): void {
    const esPrivilegiado = this.esAdministrador();
    const ruta = this.router.url;
    const tieneAcceso = this.pagesFiltradas.some((page) =>
      page.nestedPages?.some((p) => ruta.startsWith(p.link))
    );

    const esPaginaInicio = ruta === '/';

    if (!esPrivilegiado && !tieneAcceso && !esPaginaInicio) {
      this.router.navigate(['**']);
    }
  }

  toggleSinenav() {
    this.onSinenavToggle.emit();
    this.sideNavState = !this.sideNavState;
    this.linkText = this.sideNavState;
    if (this.isMobile) {
      this.sideNavVisible = this.sideNavState;
    }
  }

  toggleNestedPages(page: Page) {
    if (page.nestedPages) {
      // Solo si hay sub-páginas
      for (let i = 0; i < pages.length; i++) {
        if (pages[i] !== page) {
          pages[i].expanded = false;
        }
      }
      page.expanded = !page.expanded;
    }
  }

  title(pagina: Page) {
    const titulo = pagina.name;
    this.tituloComponente = titulo;
    this.tituloService.actualizarTitulo(titulo);
  }

  private setPageTitleBasedOnRoute(route: string) {
    for (const page of pages) {
      if (page.nestedPages) {
        for (const nestedPage of page.nestedPages) {
          if (route === nestedPage.link) {
            this.tituloComponente = nestedPage.name;
            this.tituloService.actualizarTitulo(nestedPage.name);
            return;
          }
        }
      } else {
        if (route === page.link) {
          this.tituloComponente = page.name;
          this.tituloService.actualizarTitulo(page.name);
          return;
        }
      }
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
    this.subscription.unsubscribe();
  }
}

@Injectable({
  providedIn: 'root',
})
export class TituloService {
  private tituloComponenteSource = new BehaviorSubject<string>('Inicio');
  tituloComponente$ = this.tituloComponenteSource.asObservable();

  constructor() {}

  actualizarTitulo(titulo: string) {
    this.tituloComponenteSource.next(titulo);
  }
}
