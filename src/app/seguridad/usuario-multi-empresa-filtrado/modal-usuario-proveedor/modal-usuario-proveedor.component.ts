import { Component, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSelectChange } from '@angular/material/select';
import { CorporativoService } from 'src/app/catalogos/corporativo/corporativo.service';
import { UtilidadesService } from 'src/app/utilidades/utilidades.service';
import { RolService } from '../../Servicios/rol.service';
import { UsuarioEmpresaService } from '../../Servicios/usuario-empresa.service';
import { UsuarioService } from '../../Servicios/usuario.service';
import { SeguridadMultiEmpresaService } from '../../seguridad-multi-empresa/seguridad-multi-empresa.service';
import { RolDTO } from '../../tsSeguridad';
import { corporativo, rolesPorEmpresa, empresaConRoles, UsuarioCreacionMultiEmpresaDTO } from '../../usuario-multi-empresa/tsUsuarioMultiEmpresa';
import { ModalUsuarioMultiEmpresaComponent } from '../modal-usuario-multi-empresa/modal-usuario-multi-empresa.component';
import { UsuarioProveedorService } from '../../Servicios/usuario-proveedor.service';
import { UsuarioCorporativoService } from '../../Servicios/usuario-corporativo.service';
import { EmpresaDTO } from 'src/app/catalogos/empresas/empresa';
import { EmpresaService } from 'src/app/catalogos/empresas/empresa.service';

@Component({
  selector: 'app-modal-usuario-proveedor',
  templateUrl: './modal-usuario-proveedor.component.html',
  styleUrls: ['./modal-usuario-proveedor.component.css']
})
export class ModalUsuarioProveedorComponent {
  tituloAccion: string = "";
  botonAccion: string = "";
  estatus: string = "";
  mensaje: string = "";
  descripcionEmpresa: string = "";
  empresas: EmpresaDTO[] = [];
  listaIdEmpresas: number[] = [];
  listaRoles: number[] = [];
  idRol: number = 0;
  listaIdsEmpresas: number[] = [];
  roles: RolDTO[] = [];
  corporativos: corporativo[] = [];
  listaRolesEnEmpresa: rolesPorEmpresa[] = [];
  listaEmpresasConRoles: empresaConRoles[] = [];
  seccionesFalse: boolean = false;
  formulario: FormGroup;
  constructor(
    private modalActual: MatDialogRef<ModalUsuarioMultiEmpresaComponent>,
    @Inject(MAT_DIALOG_DATA) public datos: UsuarioCreacionMultiEmpresaDTO,
    private fb: FormBuilder,
    private seguridadService: SeguridadMultiEmpresaService
    , private rolService: RolService
    , private usuarioService: UsuarioService
    , private _utilidadServicio: UtilidadesService
    , private empresaService: EmpresaService
    , private corporativoService: CorporativoService
    , private usuarioEmpresaService: UsuarioEmpresaService
    , private usuarioEmpresaProveedorService: UsuarioProveedorService
    , private usuarioCorporativoService: UsuarioCorporativoService
  ) {
    this.formulario = this.fb.group({
      nombre: ['', Validators.required],
      apaterno: ['', Validators.required],
      amaterno: ['', Validators.required],
      usuario: ['', Validators.required],
      correoElectronico: ['', Validators.required],
      rfc: [''],
      numeroProveedor: [''],
      identificadorFiscal: [''],
      contrasenia: ['', Validators.required],
      confirmaContrasenia: ['', Validators.required]
    });

    if (this.datos != null) {
      this.tituloAccion = 'Editar';
      this.botonAccion = 'Actualizar';
    }
  }
  ngOnInit(): void {
    this.cargarRegistrosCorporativos();
    //this.cargarRegistrosEmpresas();
    //this.cargarRegistrosRoles();
  }

  guardarEditar(){
    let nombre = this.formulario.get('nombre')?.value;
    if (typeof nombre === 'undefined' || !nombre || nombre === "") {
      return;
    }
    this.usuarioEmpresaProveedorService.creaRelacionUsuarioEmpresa({
      nombreCompleto: this.formulario.get('nombre')?.value,
      apaterno: this.formulario.get('apaterno')?.value,
      amaterno: this.formulario.get('amaterno')?.value,
      nombreUsuario: this.formulario.get('usuario')?.value,
      correo: this.formulario.get('correoElectronico')?.value,
      password: this.formulario.get('contrasenia')?.value,
      rfc: this.formulario.get('rfc')?.value,
      numeroProveedor: this.formulario.get('numeroProveedor')?.value,
      identificadorFiscal: this.formulario.get('identificadorFiscal')?.value,
      listaIdEmpresas: this.listaIdsEmpresas,
      idRol: this.idRol,

    })
    .subscribe();
  }
  cargarRegistrosCorporativos(){
    this.usuarioCorporativoService.obtenCorporativosPertenecientes()
    .subscribe((datos) => {
      this.corporativos = datos;
    });
  }
  cargarRegistrosEmpresas(idCorporativo: number){
    this.empresaService.ObtenXIdCorporativo(idCorporativo)
    .subscribe((datos) => {
      this.empresas = datos;
    });
  }
  // cargarRegistrosRoles(){
  //   this.rolService.obtenRoles()
  //   .subscribe((datos) => {
  //     this.roles = datos;
  //   })
  // }
  cambiaCorporativo(registro: MatSelectChange){
    this.cargarRegistrosEmpresas(registro.value);
  }
  agregarRolDeEmpresa(event: MatSelectChange){
    this.listaRoles = [];
    this.listaRoles.push(event.value);
    this.idRol = event.value;
  }

}
