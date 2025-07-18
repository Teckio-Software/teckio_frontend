

// export interface MenuDTO{
//   id: number;
//   nombre: string;
//   icono: string;
//   url: string;
//   idEmpresa: number;
//   codigoMenu: string;
//   esActivo: boolean;
//   listaSecciones: SeccionDTO[];
// }

export interface SeccionDTO{
  id: number;
  seccion: string;
  idEmpresa: number;
  codigoSeccion: string;
  esActivo: boolean;
  listaActividades:ActividadDTO[];
}

export interface ActividadDTO{
  id: number;
  actividades: string;
  idSeccion: number;
  codigoActividad: string;
  esActivo: boolean;
}


export interface MenuEstructuraDTO{
  idMenu: number;
  idSeccion: number;
  idActividad: number;
  // 1 = Menú, 2 = Sección, 3 = Actividad
  tipoMenu: number;
  descripcion: string;
  esAutorizado: boolean;
  esActivo: boolean;
  estructura: MenuEstructuraDTO[];
}

export interface autorizacionMenu{
  idEmpresa: number;
  idMenu: number;
}




export interface MenuDTO{
  id: number;
  descripcion: string;
  codigoMenu: string;
}

