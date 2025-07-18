



export interface AlmacenEntradaInsumosDTO{
  id: number;
  idAlmacenEntrada: number;
  idProyecto:number;
  idRequisicion: number;
  nombreProyecto:string;
  idInsumo: number;
  codigoInsumo: number;
  descripcionInsumo: number;
  unidadInsumo: number;
  cantidadPorRecibir: number;
  cantidadRecibida: number;
  noRequisicion:string;
  idOrdenCompra:number;
  estatus:number;
}


export interface AlmacenEntradaInsumoCreacionDTO{
  idInsumo: number;
  idAlmacenEntrada : number;
  descripcion : string;
  unidad : string;
  idTipoInsumo : number;
  cantidadPorRecibir: number;
  cantidadRecibida: number;
  idOrdenCompra: number;
  idInsumoXOrdenCompra: number;
}


export interface InsumoAlmacenEntradaDTO{
  idContratista: number;
  razonSocialContratista: string;
  idCompra: number;
  estatusCompra: number;
  idRequisicion: number;
  idInsumoComprado: number;
  idInsumo: number;
  codigoInsumo: string;
  descripcionInsumo: string;
  unidadInsumo: string;
  cantidad: number;
  noRequisicion: string;
}
