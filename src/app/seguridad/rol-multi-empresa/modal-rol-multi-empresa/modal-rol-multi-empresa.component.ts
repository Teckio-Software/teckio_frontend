import { Component, Inject, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { RolCreacionEnEmpresaDTO, RolMenuEstructuraDTO } from '../tsRolMultiEmpresa';
import { SeguridadMultiEmpresaService } from '../../seguridad-multi-empresa/seguridad-multi-empresa.service';
import { UtilidadesService } from 'src/app/utilidades/utilidades.service';
import { HttpResponse } from '@angular/common/http';
import { ActividadDTO, MenuEstructuraDTO, SeccionDTO } from '../../menusXEmpresa/tsMenu';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { RolService } from '../../Servicios/rol.service';
import { MenusService } from '../../Servicios/menus.service';
import { MenuDTO } from '../../modelos/tsMenu';
import { EmpresaService } from 'src/app/catalogos/empresas/empresa.service';
import { EmpresaDTO } from 'src/app/catalogos/empresas/empresa';

@Component({
  selector: 'app-modal-rol-multi-empresa',
  templateUrl: './modal-rol-multi-empresa.component.html',
  styleUrls: ['./modal-rol-multi-empresa.component.css']
})
export class ModalRolMultiEmpresaComponent implements OnInit {
  tituloAccion: string = "";
  botonAccion: string = "";
  estatus: string = "";
  mensaje: string = "";
  descripcionMenu: string = "";
  descripcionSeccion: string = "";
  @Input()
  empresas: EmpresaDTO[] = [];
  listaIdMenus: number[] = [];
  listaIdSecciones: number[] = [];
  listaIdActividades: number[] = [];
  dataSeccion: SeccionDTO[] = [];
  dataSeccionFiltrado: SeccionDTO[] = [];
  dataActividadFiltrado: ActividadDTO[] = [];
  seccionesFalse: boolean = false;
  serviciosTabla: boolean = false;
  seccionesTabla: boolean = false;
  actividadesTabla: boolean = false;
  formulario: FormGroup;
  rolCreacion: RolCreacionEnEmpresaDTO = {
    nombre: '',
    idEmpresa: 0
  }
  constructor(
    private modalActual: MatDialogRef<ModalRolMultiEmpresaComponent>,
    @Inject(MAT_DIALOG_DATA) public datos: EmpresaDTO[],
    private fb: FormBuilder,
    private _seguridadService: SeguridadMultiEmpresaService
    , private menuService: MenusService
    , private rolService: RolService
    , private _utilidadServicio: UtilidadesService
    , private empresaService: EmpresaService
  ) {
    this.formulario = this.fb.group({
      nombre: ['', Validators.required],
      idEmpresa: [0, Validators.required]
    });

    if (this.datos != null) {
      this.tituloAccion = 'Editar';
      this.botonAccion = 'Actualizar';
    }
  }

  ngOnInit(): void {
    this.empresas = this.datos;
    if (this.datos != null) {
      this.formulario.patchValue({
        idEmpresa: this.datos.toString(),
      });
    }
  }

  guardarEditar() {
    //let nombre = this.formulario.get('nombre')?.value;
    let nombre = this.formulario.value.nombre;
    let idEmpresa = this.formulario.value.idEmpresa;
    if (typeof nombre === 'undefined' || !nombre || nombre === ""
      || typeof idEmpresa === 'undefined' || !idEmpresa || idEmpresa <= 0
    ) {
      return;
    }
    const _parametro: RolCreacionEnEmpresaDTO = {
      //id: this.datos == null ? 0 : this.datos.id,
      nombre: this.formulario.value.nombre,
      idEmpresa: this.formulario.value.idEmpresa
    };
    this.rolService.crearRoleEnEmpresa(_parametro)
    .subscribe((respuesta) => {
      this.estatus = respuesta.headers.get("estatus") || "";
      this.mensaje = respuesta.headers.get("mensaje") || "";
      this._utilidadServicio.mostrarAlerta(
        this.mensaje,
        this.estatus === "1" ? 'Exito' : "Error"
      );
    });
  }

  cargarRegistrosMenus(idEmpresa: number){
    this.descripcionMenu = "";
    this.descripcionSeccion = "";
    this.dataSeccionFiltrado = [];
    this.dataActividadFiltrado = [];
    // this.menuService.obtenMenusEstructura(idEmpresa)
    // .subscribe((datos) => {
    //   this.dataMenu = datos;
    // });
  }

  cargarRegistrosSecciones(menu: MenuDTO){
    this.descripcionMenu = menu.descripcion;
    //this.dataRolSeccion = [];
    this.dataSeccionFiltrado = [];
    this.descripcionSeccion = "";
    this.dataActividadFiltrado = [];
    this.seccionesTabla = true;
  }

  cargarRegistrosActividades(seccion: SeccionDTO){
    this.descripcionSeccion = seccion.seccion;
    this.dataActividadFiltrado = [];
    this.dataActividadFiltrado = seccion.listaActividades;
    this.actividadesTabla = true;
  }

  estaAutorizadoSeccion(seccion: SeccionDTO){
    if (seccion.esActivo === true) {
      //seccion.esAutorizado = true;
      this.cargarRegistrosActividades(seccion);
      let objetos = this.listaIdSecciones.filter(objetoSeleccionado => objetoSeleccionado == seccion.id);
      if (objetos.length <= 0 && seccion.id > 0) {
        this.listaIdSecciones.push(seccion.id);
      }
    }
    else{
      let index = this.listaIdSecciones.findIndex(objetoSeleccionado => objetoSeleccionado == seccion.id);
      this.listaIdSecciones.splice(index, 1);
      this.cargarRegistrosActividades(seccion);
    }
  }

  estaAutorizadoActividad(actividad: ActividadDTO){
    if (actividad.esActivo === true) {
      let objetos = this.listaIdActividades.filter(objetoSeleccionado => objetoSeleccionado == actividad.id);
      if (objetos.length <= 0 && actividad.id > 0) {
        this.listaIdActividades.push(actividad.id);
      }
    }
    else{
      let index = this.listaIdActividades.findIndex((objeto) => {
        return objeto == actividad.id;
      });
      this.listaIdActividades.splice(index, 1);
    }
  }

  cambiaEmpresa(idEmpresa: any){
    this.serviciosTabla = true;
    this.dataActividadFiltrado = [];
    this.dataSeccionFiltrado = [];
    this.listaIdMenus = [];
    this.listaIdSecciones = [];
    this.listaIdActividades = [];
    this.cargarRegistrosMenus(idEmpresa);
  }
}
