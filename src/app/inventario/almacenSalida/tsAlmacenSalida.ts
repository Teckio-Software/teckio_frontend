import { almacenSalidaInsumosCreacionDTO } from "../almacenSalidaInsumos/tsAlmacenSalidaInsumos";



export interface almacenSalidaDTO{
  id: number;
  codigoSalida : string;
  idAlmacen: number;
  almacenNombre: string;
  esAlmacenCentral: boolean;
  idProyecto: number;
  descripcionProyecto: string;
  fechaRegistroSalida: Date;
  fechaAutorizacionSalida: Date;
  fechaRegistro : Date;
  observaciones : string;
  estatus: number;
  autorizo: string;
  personaRecibio: string;
  personaSurtio: string;
}

export interface almacenSalidaCreacionDTO{
  idAlmacen: number;
  personaRecibio: string;
  observaciones : string;
  ListaAlmacenSalidaInsumoCreacion: almacenSalidaInsumosCreacionDTO[];
  esBaja : boolean;
}


export interface insumosExistenciaDTO{
  idInsumo : number;
  codigo : string;
  descripcion : string;
  unidad : string;
  cantidadDisponible : number;
  esPrestamo : boolean;
  cantidadPorSalir: number;
}
