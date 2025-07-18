import { CompraDirectaInsumoCreacionDTO } from "../comprasdirectasinsumos/tsComprasDirectasInsumos";



export interface CompraDirectaDTO{
    id: number;
    fechaRegistro: Date;
    fechaEntrega: Date;
    idContratista: number;
    razonContratista: string;
    totalMontoInsumos: number; //Subtotal
    montoDescuento: number;//Monto descuento
    importeIva: number; //Importe iva
    totalPedido: number; //Total con iva
    totalInsumos: number; //Numero de insumos - Por ejemplo 1.6 toneladas
    estatus: number;
    idAlmacen: number;
    codigoalmacen: string;
    descripcionAlmacen: string;
    idPedido: number;
    descripcionPedido: string;
    observaciones: string;
    noRequisicion: number;
    idProyecto: number;
    descripcionProyecto: string;
}

export interface CompraDirectaCreacionDTO{
    fechaRegistro: Date;
    fechaEntrega: Date;
    idContratista: number;
    totalMontoInsumos: number; //Subtotal
    montoDescuento: number;//Monto descuento
    importeIva: number; //Importe iva
    totalPedido: number; //Total con iva
    totalInsumos: number; //Numero de insumos - Por ejemplo 1.6 toneladas
    estatus: number;
    idAlmacen: number;
    idPedido: number;
    observaciones: string;
    idProyecto: number;
    idRequisicion: number;
    descuento: number;
    listaIdInsumos: CompraDirectaInsumoCreacionDTO[];
}

