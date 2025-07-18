import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { SeguridadMultiEmpresaService } from '../../seguridad-multi-empresa/seguridad-multi-empresa.service';
import { UtilidadesService } from 'src/app/utilidades/utilidades.service';
import { UsuarioCreacionMultiEmpresaDTO, corporativo, empresaConRoles, rolesPorEmpresa } from '../../usuario-multi-empresa/tsUsuarioMultiEmpresa';
import { MatSelectChange } from '@angular/material/select';
import { RolDTO } from '../../tsSeguridad';
import { MatOptionSelectionChange } from '@angular/material/core';
import { RolService } from '../../Servicios/rol.service';
import { UsuarioService } from '../../Servicios/usuario.service';
import { CorporativoService } from 'src/app/catalogos/corporativo/corporativo.service';
import { UsuarioEmpresaCreacionDTO } from '../../modelos/tsUsuarioEmpresa';
import { UsuarioEmpresaService } from '../../Servicios/usuario-empresa.service';
import { UsuarioCorporativoService } from '../../Servicios/usuario-corporativo.service';
import { UsuarioEstructuraCorporativoDTO, usuarioBaseDTO } from '../../seguridad-multi-empresa/tsSeguridadMultiEmpresa';
import { EmpresaService } from 'src/app/catalogos/empresas/empresa.service';
import { EmpresaDTO } from 'src/app/catalogos/empresas/empresa';

@Component({
  selector: 'app-modal-usuario-multi-empresa',
  templateUrl: './modal-usuario-multi-empresa.component.html',
  styleUrls: ['./modal-usuario-multi-empresa.component.css']
})
export class ModalUsuarioMultiEmpresaComponent implements OnInit {
  tituloAccion: string = "";
  selectedIdUsuario: number = 0;
  obtenUsuario!: usuarioBaseDTO;
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
    , @Inject(MAT_DIALOG_DATA) public datosUsuario: UsuarioEstructuraCorporativoDTO
    , private usuarioService: UsuarioService
    , private _utilidadServicio: UtilidadesService
    , private empresaService: EmpresaService
    , private corporativoService: CorporativoService
    , private usuarioCorporativoService: UsuarioCorporativoService
    , private usuarioEmpresaService: UsuarioEmpresaService
  ) {
    this.formulario = this.fb.group({
      nombre: ['', Validators.required],
      apaterno: ['', Validators.required],
      amaterno: ['', Validators.required],
      usuario: ['', Validators.required],
      correoElectronico: ['', Validators.required]
    });

    if (this.datosUsuario != null) {
      this.usuarioService.obtenTipoUsuario(datosUsuario.idUsuario)
      .subscribe((datos) => {
        this.selectedIdUsuario = datosUsuario.idUsuario;
        //this.obtenUsuario = datos;
        this.formulario.get('nombre')?.setValue(this.obtenUsuario.nombreCompleto);
        this.formulario.get('apaterno')?.setValue(this.obtenUsuario.apaterno);
        this.formulario.get('amaterno')?.setValue(this.obtenUsuario.amaterno);
        this.formulario.get('correoElectronico')?.setValue(this.obtenUsuario.correo);
        this.formulario.get('usuario')?.setValue(this.obtenUsuario.nombreUsuario);
      });
    }
  }
  ngOnInit(): void {
    this.cargarRegistrosCorporativos();
  }

  guardarEditar(){
    let nombre = this.formulario.get('nombre')?.value;
    if (typeof nombre === 'undefined' || !nombre || nombre === "") {
      return;
    }
    this.usuarioService.guardarInfoUsuario({
      id: this.selectedIdUsuario,
      nombreCompleto: this.formulario.get('nombre')?.value,
      apaterno: this.formulario.get('apaterno')?.value,
      amaterno: this.formulario.get('amaterno')?.value,
      nombreUsuario: this.formulario.get('usuario')?.value,
      correo: this.formulario.get('correoElectronico')?.value,
      activo: true,
      idAspNetUser: ''
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
  cambiaCorporativo(registro: MatSelectChange){
    this.cargarRegistrosEmpresas(registro.value);
  }
  agregarRolDeEmpresa(event: MatSelectChange){
    this.listaRoles = [];
    this.listaRoles.push(event.value);
    this.idRol = event.value;
  }
}
