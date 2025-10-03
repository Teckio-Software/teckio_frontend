import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { SeguridadService } from './seguridad/seguridad.service';
import { take, tap } from 'rxjs';
import { proyectoDTO } from './proyectos/proyecto/tsProyecto';

//Si se ponen aqui, truena porque un inject solo puede estar dentro de una clase o en una constante
// const seguridadService = inject(SeguridadService);
// const router = inject(Router);

export function esAdminUsuarioCorporativoFuntion(): boolean {
  const seguridadService = inject(SeguridadService);
  const router = inject(Router);
  if (
    seguridadService.zfObtenerCampoJwt('role') === 'Administrador' ||
    seguridadService.zfObtenerCampoJwt('role') === 'AdministradorRoles'
  ) {
    return true;
  }
  router.navigate(['**']);
  return false;

  //return seguridadService.zfObtenerCampoJwt('role') === 'admin' ? true : false;
}

export function esAdminRoles(): boolean {
  const seguridadService = inject(SeguridadService);
  if (seguridadService.zfObtenerCampoJwt('role') === 'AdministradorRoles') {
    return true;
  }
  return false;
}

export function esCotizacionFuncion(): boolean {
  const seguridadService = inject(SeguridadService);
  let idEmpresa = seguridadService.obtenIdEmpresaLocalStorage();
  if (typeof idEmpresa === undefined || !idEmpresa || idEmpresa === '') {
    return false;
  }
  let permisoArmado = 'SeccionCotizacion-' + idEmpresa;
  if (
    (typeof seguridadService.zfObtenerCampoJwt(permisoArmado) !== 'undefined' &&
      seguridadService.zfObtenerCampoJwt(permisoArmado) &&
      seguridadService.zfObtenerCampoJwt(permisoArmado) !== '') ||
    (typeof seguridadService.zfObtenerCampoJwt('VisorCorporativo') !==
      'undefined' &&
      seguridadService.zfObtenerCampoJwt('VisorCorporativo') &&
      seguridadService.zfObtenerCampoJwt('VisorCorporativo') !== '')
  ) {
    return true;
  }
  return false;
}
