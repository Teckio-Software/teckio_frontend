export interface insumoXOrdenCompraDTO {
  id: number;
  idOrdenCompra: number;
  idInsumo: number;
  codigo: string;
  descripcion: string;
  unidad: string;
  idInsumoXCotizacion: number;
  cantidad: number;
  cantidadRecibida: number;
  precioUnitario: number;
  importeSinIva: number;
  importeConIva: number;
  estatusInsumoOrdenCompra: number;
  estatusInsumoOrdenCompraDescripcion: string;
  noOrdenCompra: string;
  isExpanded: boolean;
  cantidadConFormato : string;
descuentoConFormato : string;
precioUnitarioConFormato : string;
importeSinIvaConFormato : string
}

export interface insumoXOrdenCompraCreacionDTO {
  idOrdenCompra: number;
  idInsumoXCotizacion: number;
  idInsumo: number;
  cantidad: number;
  precioUnitario: number;
  importeConIva: number;
  importeSinIva: number;
}
