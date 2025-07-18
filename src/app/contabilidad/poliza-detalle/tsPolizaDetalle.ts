export interface polizaDetalleDTO{
    id: number;
    idPoliza: number;
    idCuentaContable: number;
    cuentaContableCodigo: string;
    concepto: string;
    debe: number;
    haber: number;
}