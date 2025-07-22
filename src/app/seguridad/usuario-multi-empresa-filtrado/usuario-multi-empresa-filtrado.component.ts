import {
  Component,
  EventEmitter,
  HostListener,
  OnInit,
  Output,
} from '@angular/core';
import {
  UsuarioRolMenuEstructuraDTO,
  corporativo,
} from '../usuario-multi-empresa/tsUsuarioMultiEmpresa';
import { MatDialog } from '@angular/material/dialog';
import { reestablecerContraseniaDTO, RolDTO } from '../tsSeguridad';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UsuarioService } from '../Servicios/usuario.service';
import { AutorizacionUsuarioService } from '../Servicios/autorizacion-usuario.service';
import { UsuarioEmpresaService } from '../Servicios/usuario-empresa.service';
import {
  UsuarioEmpresaEstructura,
  UsuarioEstructuraCorporativoDTO,
} from '../seguridad-multi-empresa/tsSeguridadMultiEmpresa';
import { RolService } from '../Servicios/rol.service';
import { ModalUsuarioProveedorComponent } from './modal-usuario-proveedor/modal-usuario-proveedor.component';
import { ModalUsuarioGastosComponent } from './modal-usuario-gastos/modal-usuario-gastos.component';
import { UsuarioCorporativoService } from '../Servicios/usuario-corporativo.service';
import { EmpresaDTO } from 'src/app/catalogos/empresas/empresa';
import { EmpresaService } from 'src/app/catalogos/empresas/empresa.service';
import { ModalUsuarioBaseComponent } from './modal-usuario-base/modal-usuario-base.component';
import { PageEvent, MatPaginatorIntl } from '@angular/material/paginator';
import { divisionDTO } from 'src/app/gastos/division/tsDivision';
import { plazaDTO } from 'src/app/gastos/plazas/tsPlazas';
import { CambiarContraseniaUsuarioComponent } from '../cambiar-contrasenia-usuario/cambiar-contrasenia-usuario.component';
import { EmpleadoDTO } from '../empleado/empleado';
import { ModalEmpleadoComponent } from '../empleado/modal-empleado/modal-empleado.component';
import { EmpleadoServiceService } from '../empleado/empleado-service.service';
import { da, el } from 'date-fns/locale';
import { EmpleadosComponent } from '../empleado/empleados/empleados.component';
import { ModalTablaEmpleadosComponent } from '../empleado/modal-tabla-empleados/modal-tabla-empleados.component';
import {
  esAdminRoles,
  esAdminUsuarioCorporativoFuntion,
} from 'src/app/safe.guard';

@Component({
  selector: 'app-usuario-multi-empresa-filtrado',
  templateUrl: './usuario-multi-empresa-filtrado.component.html',
  styleUrls: ['./usuario-multi-empresa-filtrado.component.css'],
})
export class UsuarioMultiEmpresaFiltradoComponent implements OnInit {
  length = 20;
  pageEvent!: PageEvent;
  inicioCopia = 0;
  terminoCopia = 20;
  currentState = 'initial';
  tablaAsignacion = false;
  nombreUsuario: string = '';
  esAdmin: boolean = false;
  esAdminRoles: boolean = false;
  clicked = false; // Variable para controlar si se ha hecho clic

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.checkResolution(); // Detectar cambios de tamaño de ventana
  }

  ngOnChanges() {
    const screenWidth = window.innerWidth;

    // Aplicar los estilos originales cuando currentState cambia de 'initial' a otro valor
    if (this.currentState !== 'initial') {
      if (screenWidth > 1365) {
        this.currentState = 'changed';
        this.tablaAsignacion = true; // Desactivar la tabla de asignación
      } else {
        this.currentState = 'original';
        this.tablaAsignacion = true; // Activar la tabla de asignación
      }
    }
  }

  form!: FormGroup;
  dropdown = true;
  nombreDivision: string = '';
  nombrePlaza: string = '';
  selectedDivision: number = 0;
  selectedPlaza: number = 0;
  idEmpleado: number = 0;
  idPlazaEmpleado: number = 0;
  idRol: number = 0;
  usuarioCambiaContrasenia: reestablecerContraseniaDTO = {
    idUsuario: '',
    nuevaContrasenia: '',
    nuevaContraseniaConfirma: '',
  };
  respuestaRadio1: string = 'SI';
  respuestaRadio2: string = 'NO';
  respuestaRadioLimites1: string = 'SI';
  respuestaRadioLimites2: string = 'NO';
  divisiones!: divisionDTO[];
  divisionesReset!: divisionDTO[];
  plazas!: plazaDTO[];
  plazasReset!: plazaDTO[];
  plazasResetAgregar!: plazaDTO[];
  selectedEmpresaGastos: number = 0;
  selectedEmpresaId: number = 0;

  isClicked: boolean = false;

  formulario!: FormGroup;
  empresasConRoles: UsuarioEmpresaEstructura[] = [];
  corporativos: corporativo[] = [];
  roles: RolDTO[] = [];
  empresas: EmpresaDTO[] = [];
  selectedEmpresa: number = 0;
  selectedCorporativo: number = 0;
  selectedUsuario: number = 0;
  idUsuarioEditar: number = 0;
  esPermisosEspeciales: boolean = false;
  menuUsuario: boolean = false;
  menuTabla: boolean = false;
  menuSecciones: boolean = false;
  menuActividades: boolean = false;
  menuEditar: boolean = false;
  descripcionRol: string = '';
  descripcionMenu: string = '';
  descripcionSeccion: string = '';
  dataUsuario: UsuarioEstructuraCorporativoDTO[] = [];
  dataUsuarioReset: UsuarioEstructuraCorporativoDTO[] = [];
  dataUsuarioMenu: UsuarioRolMenuEstructuraDTO[] = [];
  dataUsuarioMenuFiltrado: UsuarioRolMenuEstructuraDTO[] = [];
  dataUsuarioRolSeccionFiltrado: UsuarioRolMenuEstructuraDTO[] = [];
  dataUsuarioRolActividadFiltrado: UsuarioRolMenuEstructuraDTO[] = [];

  empleado: EmpleadoDTO = {
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
    seleccionado: false,
  };
  existeEmpleadoUsuario: boolean = false;

  IdEmpresa: number = 0;
  usarioActivoEmpresa: boolean = false;
  IdUser: number = 0;

  constructor(
    private empresaService: EmpresaService,
    private usuarioService: UsuarioService,
    private autorizacionUsuarioService: AutorizacionUsuarioService,
    private dialog: MatDialog,
    private fb: FormBuilder,
    private usuarioCorporativoService: UsuarioCorporativoService,
    private usuarioEmpresaService: UsuarioEmpresaService,
    private rolService: RolService,
    private formBuilder: FormBuilder,
    private paginator: MatPaginatorIntl,
    private _empleadoService: EmpleadoServiceService
  ) {
    this.paginator.itemsPerPageLabel = 'Registros por pagina:';
    this.esAdmin = esAdminUsuarioCorporativoFuntion();
    this.esAdminRoles = esAdminRoles();
  }

  ngOnInit(): void {
    this.formulario = this.fb.group({
      nombre: ['', Validators.required],
      usuario: ['', Validators.required],
      correoElectronico: ['', Validators.required],
      rfc: [''],
      numeroProveedor: [''],
      identificadorFiscal: [''],
      contrasenia: ['', Validators.required],
      confirmaContrasenia: ['', Validators.required],
    });

    this.form = this.formBuilder.group({
      id: ['', { validators: [] }],
      idPlaza: ['', { validators: [] }],
      idDivision: ['', { validators: [] }],
      metodos_pagos_multiples: [false, { validators: [] }],
      limitesPersonalizados: [false, { validators: [] }],
      limite_personalizado_Alimentos: [0, { validators: [] }],
      limite_personalizado_Hospedaje: [0, { validators: [] }],
      limite_personalizado_Transporte: [0, { validators: [] }],
      conLimitesExtranjeros: [false, { validators: [] }],
      limite_Extranjero_Alimentos: [0, { validators: [] }],
      limite_Extranjero_Hospedaje: [0, { validators: [] }],
      limite_Extranjero_Transporte: [0, { validators: [] }],
    });
    this.cargarRegistrosCorporativos();
  }

  seleccionEmpresaTabla(empresa: UsuarioEmpresaEstructura) {
    this.IdEmpresa = empresa.idEmpresa;
    this.usarioActivoEmpresa = empresa.activoEmpresa;

    if (this.usarioActivoEmpresa) {
      this._empleadoService
        .ObtenerXIdUser(empresa.idEmpresa, this.empleado.idUser)
        .subscribe((datos) => {
          if (datos.id <= 0) {
            this.abrirDialogoFormularioEmpleado(this.empleado);
          } else {
            console.log('ya existe un empleado para este usuario');
          }
        });
    } else {
      console.log('el usuario no esta activo');
    }
  }

  seleccionEmpresaTablaRelacion(empresa: UsuarioEmpresaEstructura) {
    this.IdEmpresa = empresa.idEmpresa;
    console.log('esta es la empresa', this.IdEmpresa);
    this.usarioActivoEmpresa = empresa.activoEmpresa;
    if (this.usarioActivoEmpresa) {
      this._empleadoService
        .ObtenerXIdUser(empresa.idEmpresa, this.empleado.idUser)
        .subscribe((datos) => {
          if (datos.id <= 0) {
            this.abrirDialogoTablaEmpleado(this.empleado);
          } else {
            console.log('ya existe un empleado para este usuario');
          }
        });
    } else {
      console.log('el usuario no esta activo');
    }
  }

  abrirDialogoTablaEmpleado(empleado: EmpleadoDTO): void {
    const dialogRef = this.dialog.open(ModalTablaEmpleadosComponent, {
      data: {
        IdUser: empleado.idUser,
        IdEmpresa: this.IdEmpresa,
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
      }
    });
  }

  abrirDialogoFormularioEmpleado(empleado: EmpleadoDTO): void {
    const dialogRef = this.dialog.open(ModalEmpleadoComponent, {
      data: {
        empleado: empleado,
        IdEmpresa: this.IdEmpresa,
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
      }
    });
  }

  checkResolutionAfterLoad() {
    const screenWidth = window.innerWidth;
    if (screenWidth <= 1365) {
      this.currentState = 'original'; // Volver a los estilos originales si la resolución es menor que 1365
      this.tablaAsignacion = true;
    }
  }

  checkResolution() {
    const screenWidth = window.innerWidth;
    if (this.clicked) {
      // Si se ha hecho clic
      if (screenWidth <= 1365) {
        this.currentState = 'original'; // Volver a los estilos originales si la resolución es menor que 1365
        this.tablaAsignacion = true;
      } else {
        this.currentState = 'changed'; // Cambiar a los estilos modificados si la resolución es mayor que 1365
        this.tablaAsignacion = true;
      }
    }
  }
  cargarRegistros(idCorporativo: number) {
    this.selectedCorporativo = idCorporativo;
    this.dataUsuario = [];
    this.dataUsuarioReset = [];
    this.dataUsuarioMenuFiltrado = [];
    this.dataUsuarioRolSeccionFiltrado = [];
    this.dataUsuarioRolActividadFiltrado = [];
    this.usuarioEmpresaService
      .ObtenUsuariosPorCliente(idCorporativo)
      .subscribe((datos) => {
        this.dataUsuario = datos;
        this.dataUsuarioReset = datos;
        this.menuUsuario = true;
        this.menuTabla = false;
      });
  }
  cargarRegistrosRoles() {
    this.rolService
      .obtenRolesXEmpresa(this.selectedEmpresa)
      .subscribe((datos) => {
        this.roles = datos;
      });
  }

  cargarRegistrosMenus(rol: UsuarioRolMenuEstructuraDTO) {
    this.menuEditar = false;
    this.descripcionRol = rol.descripcion;
    this.dataUsuarioMenuFiltrado = [];
    this.dataUsuarioRolSeccionFiltrado = [];
    this.dataUsuarioRolActividadFiltrado = [];
    if (
      typeof rol.estructura === 'undefined' ||
      !rol.estructura ||
      rol.estructura.length <= 0
    ) {
      this.dataUsuarioMenuFiltrado = [];
    } else {
      this.dataUsuarioMenuFiltrado = rol.estructura;
    }
    this.menuTabla = true;
  }

  cargarRegistrosSecciones(menu: UsuarioRolMenuEstructuraDTO) {
    this.descripcionMenu = menu.descripcion;
    this.dataUsuarioRolSeccionFiltrado = [];
    this.dataUsuarioRolActividadFiltrado = [];
    if (
      typeof menu.estructura === 'undefined' ||
      !menu.estructura ||
      menu.estructura.length <= 0
    ) {
      this.dataUsuarioRolSeccionFiltrado = [];
    } else {
      this.dataUsuarioRolSeccionFiltrado = menu.estructura;
    }
    this.menuSecciones = true;
  }

  cargarRegistrosActividades(seccion: UsuarioRolMenuEstructuraDTO) {
    this.descripcionSeccion = seccion.descripcion;
    this.dataUsuarioRolActividadFiltrado = [];
    if (
      typeof seccion.estructura === 'undefined' ||
      !seccion.estructura ||
      seccion.estructura.length <= 0
    ) {
      this.dataUsuarioRolActividadFiltrado = [];
    } else {
      this.dataUsuarioRolActividadFiltrado = seccion.estructura;
    }
    this.menuActividades = true;
  }
  cargarRegistrosCorporativos() {
    this.usuarioCorporativoService
      .obtenCorporativosPertenecientes()
      .subscribe((datos) => {
        this.corporativos = datos;
        if (this.corporativos.length > 0) {
          this.selectedCorporativo = this.corporativos[0].id;
          this.cargarRegistros(this.selectedCorporativo);
        }
      });
  }
  activarDesactivarUsuario(idUsuario: number, esActivo: boolean) {
    if (esActivo) {
      this.usuarioService.activaUsuario(idUsuario).subscribe(() => {});
    } else {
      this.usuarioService.desactivaUsuario(idUsuario).subscribe(() => {});
    }
  }

  filaSeleccionada: any = null;

  cambiaEmpresa(idEmpresa: number) {
    this.selectedEmpresa = idEmpresa;
    this.dataUsuarioRolActividadFiltrado = [];
    this.cargarRegistros(this.selectedEmpresa);
    this.menuUsuario = true;
  }

  cambiaCorporativo(idCorporativo: number) {
    this.selectedCorporativo = idCorporativo;
    this.empresaService
      .ObtenXIdCorporativo(this.selectedCorporativo)
      .subscribe((datos) => {
        this.empresas = datos;
      });
  }

  pruebaCont() {
    this.dropdown = true;
  }

  filtrarDivision(event: Event) {
    this.divisiones = this.divisionesReset;
    const filterValue = (
      event.target as HTMLInputElement
    ).value.toLocaleLowerCase();
    this.divisiones = this.divisiones.filter((division) =>
      division.nombre.toLocaleLowerCase().includes(filterValue)
    );
  }

  filtrarPlaza(event: Event) {
    this.plazas = this.plazasResetAgregar;
    const filterValue = (
      event.target as HTMLInputElement
    ).value.toLocaleLowerCase();
    this.plazas = this.plazas.filter((plaza) =>
      plaza.nombrePlaza.toLocaleLowerCase().includes(filterValue)
    );
  }
  cambiarRolGastos(registro: number) {
    this.idRol = registro;
  }

  cambiaPermisosRolAUsuario(event: any, registro: UsuarioEmpresaEstructura) {
    const idRol = Number(event);

    registro.idRol = idRol;

    this.usuarioService
      .cambiaPermisoRolAUsuario({
        idUsuario: this.selectedUsuario,
        idRol: idRol,
        idEmpresa: registro.idEmpresa,
      })
      .subscribe((datos) => {
        this.cambiaCorporativo(this.selectedCorporativo);
      });
  }

  nuevoUsuario() {
    this.dialog
      .open(ModalUsuarioBaseComponent, {
        disableClose: true,
        width: '50%',
      })
      .afterClosed()
      .subscribe(() => {
        this.cargarRegistros(this.selectedCorporativo);
        console.log();
      });
  }

  modificaDatosUsuarioBase(usuario: UsuarioEstructuraCorporativoDTO) {
    this.usuarioService
      .obtenTipoUsuario(usuario.idUsuario)
      .subscribe((info) => {
        if (info.descripcion == 'proveedor') {
          this.dialog
            .open(ModalUsuarioProveedorComponent, {
              disableClose: true,
              width: '50%',
              data: usuario,
            })
            .afterClosed()
            .subscribe(() => {
              this.cargarRegistros(this.selectedCorporativo);
              console.log();
            });
        } else if (info.descripcion == 'gastos') {
          this.dialog
            .open(ModalUsuarioGastosComponent, {
              disableClose: true,
              width: '50%',
              data: usuario,
            })
            .afterClosed()
            .subscribe(() => {
              this.cargarRegistros(this.selectedCorporativo);
              console.log();
            });
        } else if (info.descripcion == 'normal') {
          this.dialog
            .open(ModalUsuarioBaseComponent, {
              disableClose: true,
              width: '50%',
              data: usuario,
            })
            .afterClosed()
            .subscribe(() => {
              this.cargarRegistros(this.selectedCorporativo);
              console.log();
            });
        }
      });
  }

  cambiarContrasenia(usuario: UsuarioEstructuraCorporativoDTO) {
    this.usuarioCambiaContrasenia.idUsuario = usuario.idAspNetUser;
    this.usuarioCambiaContrasenia.nuevaContrasenia = 'asd';
    this.usuarioCambiaContrasenia.nuevaContraseniaConfirma = 'asd';
    this.dialog
      .open(CambiarContraseniaUsuarioComponent, {
        disableClose: true,
        width: '50%',
        data: this.usuarioCambiaContrasenia,
      })
      .afterClosed()
      .subscribe(() => {
        this.cargarRegistros(this.selectedCorporativo);
      });
  }

  cambiarAdministradorRoles(usuario: UsuarioEstructuraCorporativoDTO){
    this.usuarioService.CrearAdministradorRoles(usuario).subscribe((datos) =>{
      console.log("Respuesta: ",datos.descripcion);
    })
  }

  nuevoUsuarioProveedor() {
    this.dialog
      .open(ModalUsuarioProveedorComponent, {
        disableClose: true,
        width: '50%',
      })
      .afterClosed()
      .subscribe(() => {
        this.cargarRegistros(this.selectedCorporativo);
      });
  }
  nuevoUsuarioGastos() {
    this.dialog
      .open(ModalUsuarioGastosComponent, {
        disableClose: true,
        width: '50%',
      })
      .afterClosed()
      .subscribe(() => {
        this.cargarRegistros(this.selectedCorporativo);
      });
  }

  permisosEspeciales() {
    this.esPermisosEspeciales = true;
    this.cargarRegistros(this.selectedEmpresa);
  }

  permisosPorRol() {
    this.esPermisosEspeciales = false;
    this.cargarRegistros(this.selectedEmpresa);
  }

  activarSeccion(seccion: UsuarioRolMenuEstructuraDTO) {
    let objetosActividad = this.dataUsuarioRolActividadFiltrado.filter(
      (objeto) => objeto.idSeccion === seccion.idSeccion
    );
    if (seccion.esActivo === false) {
      this.autorizacionUsuarioService
        .quitarAutorizacionSeccionAUsuario({
          idEmpresa: seccion.idEmpresa,
          idUsuario: seccion.idUsuario,
          idSeccion: seccion.idSeccion,
        })
        .subscribe(() => {
          objetosActividad.forEach((element) => {
            element.esActivo = false;
          });
        });
    } else {
      this.autorizacionUsuarioService
        .autorizaSeccionAUsuario({
          idEmpresa: seccion.idEmpresa,
          idUsuario: seccion.idUsuario,
          idSeccion: seccion.idSeccion,
        })
        .subscribe();
    }
  }

  activarActividad(actividad: UsuarioRolMenuEstructuraDTO) {
    let objetosSeccion = this.dataUsuarioRolSeccionFiltrado.filter(
      (objeto) => objeto.idSeccion == actividad.idSeccion
    );
    if (objetosSeccion.length > 0 && actividad.esActivo === true) {
      this.autorizacionUsuarioService
        .autorizaActividadAUsuario({
          idEmpresa: actividad.idEmpresa,
          idUsuario: actividad.idUsuario,
          idActividad: actividad.idActividad,
        })
        .subscribe(() => {
          objetosSeccion[0].esActivo = true;
        });
    } else {
      this.autorizacionUsuarioService.quitarAutorizacionActividadAUsuario({
        idEmpresa: actividad.idEmpresa,
        idUsuario: actividad.idUsuario,
        idActividad: actividad.idActividad,
      });
    }
  }

  activarEmpresaUsuario(registro: UsuarioEmpresaEstructura) {
    this.usuarioEmpresaService
      .activaRelacionUsuarioEmpresa(
        this.selectedUsuario,
        registro.idEmpresa,
        registro.idRol
      )
      .subscribe(() => {});
  }

  guardarDatosUsuario() {
    let parametro = this.formulario.value;
    parametro.id = this.idUsuarioEditar;
    this.usuarioService.guardarInfoUsuario(parametro).subscribe(() => {
      this.cargarRegistros(this.selectedEmpresa);
      //this.menuEditar = false;
    });
  }

  activado: boolean = false;
  desaparecer: string = '';

  activarElemento() {
    this.activado = true;
    setTimeout(() => {
      this.desactivarElemento();
      this.desaparecer = 'none';
    }, 5000); // 3000 milisegundos = 3 segundos
  }

  desactivarElemento() {
    this.activado = false;
  }
  cambiarPaginaCopia(e: PageEvent) {
    this.pageEvent = e;
    this.length = e.length;
    this.inicioCopia = e.pageIndex * e.pageSize;
    this.terminoCopia = this.inicioCopia + e.pageSize;
  }
  //#region Filtro
  clickInputFiltroProveedores() {
    this.dropdown = true;
  }
  filtrarProveedores(event: Event) {
    if (this.nombreUsuario.length <= 0) {
      this.dataUsuario = this.dataUsuarioReset;
    }
    this.inicioCopia = 0;
    this.terminoCopia = 20;
    this.dataUsuario = this.dataUsuarioReset;
    const filterValue = (
      event.target as HTMLInputElement
    ).value.toLocaleLowerCase();
    this.dataUsuario = this.dataUsuarioReset.filter((usuario) =>
      usuario.nombreCompleto
        .toLocaleLowerCase()
        .includes(filterValue.toLocaleLowerCase())
    );
  }
  seleccionaProveedor(proveedor: UsuarioEstructuraCorporativoDTO) {
    this.dataUsuario = this.dataUsuarioReset.filter(
      (z) => z.nombreCompleto == proveedor.nombreCompleto
    );
    this.dropdown = false;
    this.nombreUsuario = proveedor.nombreCompleto;
  }

  cargarRegistrosEmpresas(parametro: UsuarioEstructuraCorporativoDTO) {
    // let indiceNombre = parametro.nombreCompleto.indexOf();
    if (!this.tablaAsignacion) {
      this.selectedUsuario = parametro.idUsuario;
      this.dataUsuario = [];
      this.dataUsuario.push(parametro);
      this.empleado.nombre = parametro.nombreCompleto;

      this.empleado.apellidoPaterno = parametro.apaterno;
      this.empleado.apellidoMaterno = parametro.amaterno;
      this.empleado.idUser = parametro.idUsuario;
      this.IdEmpresa = 0;
      this.usarioActivoEmpresa = false;

      this.clicked = true; // Se ha hecho clic
      this.currentState = 'changed'; // Cambiar a los estilos modificados al hacer clic
      this.tablaAsignacion = true;

      // Llamar a la función para detectar la resolución después de realizar los cambios
      this.checkResolutionAfterLoad();

      this.empresasConRoles = [];
      this.menuTabla = true;
      this.selectedUsuario = parametro.idUsuario;
      this.usuarioEmpresaService
        .ObtenEmpresasXUsuario(this.selectedCorporativo, parametro.idUsuario)
        .subscribe((datos) => {
          console.log('Aqui estamos', datos);
          this.empresasConRoles = datos;
        });
      this.filaSeleccionada = parametro;
    } else {
      this.tablaAsignacion = false;
      this.dataUsuario = this.dataUsuarioReset;
      this.clicked = false;
      this.selectedEmpresaId = 0;
      this.filaSeleccionada = null;
      // this.currentState = 'changed'; // Cambiar a los estilos modificados al hacer clic

      this.checkResolutionAfterLoad();
    }
  }

  cargarProyectos(registro: UsuarioEmpresaEstructura) {
    if (this.selectedEmpresaId === registro.idEmpresa) {
      this.selectedEmpresaId = 0;
    } else {
      this.selectedEmpresaId = registro.idEmpresa;
    }
    this.isClicked = !this.isClicked;
    // this.selectedUsuario;
    // registro.idEmpresa;
  }
  //#endregion
}
