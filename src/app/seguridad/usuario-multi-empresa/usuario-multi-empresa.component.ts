import { Component, OnInit } from '@angular/core';
import { SeguridadMultiEmpresaService } from '../seguridad-multi-empresa/seguridad-multi-empresa.service';
import { UsuarioRolMenuEstructuraDTO, corporativo, empresaConRoles, rolesPorEmpresa } from '../usuario-multi-empresa/tsUsuarioMultiEmpresa';
import { MatDialog } from '@angular/material/dialog';
import { reestablecerContraseniaDTO, RolDTO, UsuarioDTO } from '../tsSeguridad';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { usuarioBaseDTO, usuarioCorporativoDTO, usuarioPorCorporativo } from '../seguridad-multi-empresa/tsSeguridadMultiEmpresa';
import { UsuarioService } from '../Servicios/usuario.service';
import { RolService } from '../Servicios/rol.service';
import { UsuarioCorporativoService } from '../Servicios/usuario-corporativo.service';
import { CorporativoService } from 'src/app/catalogos/corporativo/corporativo.service';
import { ModalUsuarioCorporativoComponent } from './modal-usuario-corporativo/modal-usuario-corporativo.component';
import { EmpresaService } from 'src/app/catalogos/empresas/empresa.service';
import { CambiarContraseniaUsuarioComponent } from '../cambiar-contrasenia-usuario/cambiar-contrasenia-usuario.component';

@Component({
  selector: 'app-usuario-multi-empresa',
  templateUrl: './usuario-multi-empresa.component.html',
  styleUrls: ['./usuario-multi-empresa.component.css']
})
export class UsuarioMultiEmpresaComponent implements OnInit {
  formulario!: FormGroup;
  usuariosCorporativo: usuarioBaseDTO[] = [];
  usuariosEmpresas: usuarioPorCorporativo[] = [];
  empresasConRoles: empresaConRoles[] = [];
  rolesEnEmpresas: rolesPorEmpresa[] = []
  corporativos: corporativo[] = [];
  roles: RolDTO[] = [];
  selectedEmpresa: number = 0;
  selectedCorporativo: number = 0;
  descripcionUsuario!: string;
  descripcionEmpresa!: string;
  menuUsuario: boolean = false;
  menuTabla: boolean = false;
  dataUsuarioRolActividadFiltrado: UsuarioRolMenuEstructuraDTO[] = [];
  constructor(
    private usuarioCorporativoService: UsuarioCorporativoService
    , private dialog: MatDialog
    , private fb: FormBuilder
    , private corporativoService: CorporativoService
    ) {

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
      confirmaContrasenia: ['', Validators.required]
    });
    this.cargarRegistrosCorporativos();
  }

  cargarRegistrosCorporativos(){
    this.corporativoService.lista()
    .subscribe((datos) => {
      this.corporativos = datos;
    });
  }

  cargarRegistrosUsuarios(){
    this.menuUsuario = true;
    this.usuarioCorporativoService.obtenUsuariosPorCorporativo(this.selectedCorporativo)
    .subscribe((datos) => {
      this.usuariosCorporativo = datos;
    });
  }

  cargarRegistrosUsuariosPorCorporativo(idCorporativo: number){
    this.menuUsuario = true;
    this.usuarioCorporativoService.obtenUsuariosPorCorporativo(idCorporativo)
    .subscribe((datos) => {
      this.usuariosCorporativo = datos;
    })
  }

  cargarRegistrosEmpresas(registro: usuarioPorCorporativo){
    this.usuariosEmpresas = [];
    if (typeof registro.estructura === 'undefined' || !registro.estructura || registro.estructura.length <= 0) {
      this.usuariosEmpresas = [];
    }
    else{
      this.usuariosEmpresas = registro.estructura;
    }
    this.menuTabla = true;
  }

  cambiaCorporativo(idCorporativo: number){
    this.selectedCorporativo = idCorporativo;
    this.cargarRegistrosUsuariosPorCorporativo(idCorporativo);
  }

  debeMostrarBoton() : boolean {
    return this.selectedCorporativo > 0;
  }

  cambiaPermisosRolAUsuario(registro: usuarioBaseDTO){
    // this.usuarioService.cambiaPermisoRolAUsuario({
    //   idUsuario: registro.id,
    //   idRol: registro.idRol,
    //   idEmpresa: registro.idRol
    // })
    // .subscribe(() => {
    //   this.cargarRegistrosUsuarios();
    // });
  }

  nuevoUsuario(){
    this.dialog.open(ModalUsuarioCorporativoComponent, {
        disableClose: true,
        width: '50%',
        data:{
          selectedCorporativoid : this.selectedCorporativo
      }
    })
      .afterClosed()
      .subscribe(() => {
        this.cargarRegistrosUsuariosPorCorporativo(this.selectedCorporativo);
      });
  }
  editarUsuario(registro: usuarioBaseDTO){
    let usuarioCorporativo: usuarioCorporativoDTO = {
      idCorporativo: this.selectedCorporativo,
      id: registro.id,
      idAspNetUser: registro.idAspNetUser,
      nombreCompleto: registro.nombreCompleto,
      apaterno: registro.apaterno,
      amaterno: registro.amaterno,
      nombreUsuario: registro.nombreUsuario,
      correo: registro.correo,
      activo: registro.activo
    }
    this.dialog.open(ModalUsuarioCorporativoComponent, {
      disableClose: true,
      width: '50%',
      data: usuarioCorporativo
  })
    .afterClosed()
    .subscribe(() => {
      this.cargarRegistrosUsuariosPorCorporativo(this.selectedCorporativo);
    });
  }
  cambiarContrasenia(usuario: usuarioBaseDTO) {
    let usuarioCambiaContrasenia: reestablecerContraseniaDTO = {
      idUsuario: usuario.idAspNetUser,
      nuevaContrasenia: '',
      nuevaContraseniaConfirma: ''
    }
    this.dialog.open(CambiarContraseniaUsuarioComponent, {
      disableClose: true,
      width: '50%',
      data: usuarioCambiaContrasenia
    }).afterClosed().subscribe(() => {
      this.cargarRegistrosUsuariosPorCorporativo(this.selectedCorporativo);
      console.log();
    });
  }
}
