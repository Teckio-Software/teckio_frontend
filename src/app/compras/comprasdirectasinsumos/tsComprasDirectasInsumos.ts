




export interface CompraDirectaInsumoDTO{
    id: number;
    idCompraDirecta: number;
    idInsumo: number;
    codigoInsumo: string;
    descripcionInsumo: string;
    unidadInsumo: string;
    precioUnitarioInsumo: number;
    cantidadInsumos: number;
}

export interface CompraDirectaInsumoCreacionDTO{
    idInsumo: number;
    codigoInsumo: string;
    descripcionInsumo: string;
    unidadInsumo: string;
    precioUnitarioInsumo: number;
    cantidadInsumos: number;
    iva: number;
    isr: number;
    ieps: number;
    isan: number;
}

// export interface CompraDirectaInsumoDTO{
//   id: number;
//   idCompraDirecta: number;
//   idInsumo: number;
//   codigoInsumo: string;
//   descripcionInsumo: string;
//   unidadInsumo: string;
//   precioUnitarioInsumo: number;
//   cantidadInsumos: number;
// }




