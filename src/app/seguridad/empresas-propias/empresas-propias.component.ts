import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UsuarioEmpresaService } from '../Servicios/usuario-empresa.service';
import { SeguridadMultiEmpresaService } from '../seguridad-multi-empresa/seguridad-multi-empresa.service';
import { SeguridadService } from '../seguridad.service';
import { EmpresaDTO } from 'src/app/catalogos/empresas/empresa';

@Component({
  selector: 'app-empresas-propias',
  templateUrl: './empresas-propias.component.html',
  styleUrls: ['./empresas-propias.component.css']
})
export class EmpresasPropiasComponent {
  recargar1: number = 0;
  selectedEmpresa: number = 0;
  empresas: EmpresaDTO[] = [];
  empresasPertenecientes: EmpresaDTO[] = [];
  constructor(public zvSeguridadService: SeguridadService
    , public _UsuarioEmpresaService: SeguridadMultiEmpresaService
    , public _UsuarioEmpresa: UsuarioEmpresaService
    , private router: Router
    ) { }
  ngOnInit(): void {
    this.cargarEmpresas();
  }
  actualizar(){
    this.recargar1 = this.recargar1 + 1;
    this.zvSeguridadService.guardaIdEmpresaLocalStorage(this.selectedEmpresa);
  }
  cargarEmpresas(){
    let hayToken = this.zvSeguridadService.zfObtenerToken();
    if (typeof hayToken === "undefined" || !hayToken?.length) {
      return;
    }
    this._UsuarioEmpresa.obtenEmpresasPorUsuario()
    .subscribe((empresas) => {
      this.empresasPertenecientes = empresas;
      this.zvSeguridadService.guardaIdEmpresaLocalStorage(empresas[0].id);
      this.recargar1 = this.recargar1 +1;
      // window.location.reload();
    });
  }
}
