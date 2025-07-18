import { AlmacenEntradaInsumoCreacionDTO } from "../almacenEntradaInsumo/tsAlmacenEntradaInsumo";
import { almacenSalidaInsumosDTO } from "../almacenSalidaInsumos/tsAlmacenSalidaInsumos";





export interface AlmacenEntradaDTO{
  id: number;
  noEntrada: number;
  idAlmacen: number;
  nombreAlmacen: number;
  fechaRegistro: Date;
  idContratista: number;
  representanteLegal : string;
  observaciones: string;
  personaRegistra : string;
  estatus : number;
}



export interface AlmacenEntradaCreacionDTO{
  idAlmacen: number;
  idContratista: number;
  observaciones : string;
  listaInsumosEnAlmacenEntrada: AlmacenEntradaInsumoCreacionDTO[];
}

export interface AlmacenEntradaDevolucionCreacionDTO{
  idAlmacen: number;
  idContratista: number;
  observaciones : string;
  listaInsumosPrestamo: almacenSalidaInsumosDTO[];
}


