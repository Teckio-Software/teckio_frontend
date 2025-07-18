export interface CuentaBancariaBaseDTO{
    id : number,
    idBanco : number,
    numeroCuenta : string,
    numeroSucursal : string,
    clabe : string,
    cuentaClabe : string,
    tipoMoneda : number,
    fechaAlta : Date,
    nombreBanco : string,
    existeCuentaContable : boolean
}

export interface CuentaBancariaContratistaDTO extends CuentaBancariaBaseDTO{
    idContratista : number,
}

export interface CuentaBancariaClienteDTO extends CuentaBancariaBaseDTO{
    idCliente : number,
}

export interface CuentaBancariaEmpresaDTO extends CuentaBancariaBaseDTO{
    idCuentaContable : number;
}
