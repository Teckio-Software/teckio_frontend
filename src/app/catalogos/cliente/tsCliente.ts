export interface clienteDTO{
    id: number;
    razonSocial: string;
    rfc: string;
    email: string;
    telefono: string;
    representanteLegal: string;
    domicilio: string;
    noExterior: string;
    colonia: string;
    municipio: string;
    codigoPostal: string;
    idCuentaContable: number;
    idIvaTrasladado: number;
    idIvaPorTasladar: number;
    idCuentaAnticipos: number;
    idIvaExento: number;
    idIvaGravable: number;
    idRetensionIsr: number;
    idIeps: number;
    idIvaRetenido: number;
    direccion : string
  }

  export interface clienteCreacionDTO{
    id: number;
    razonSocial: string;
    rfc: string;
    email: string;
    telefono: string;
    representanteLegal: string;
    formaPago: number
    direccion: string;
    noExterior: string;
    codigoPostal: string;
    idCuentaContable: number;
    idIvaTrasladado: number;
    idIvaPorTrasladar: number;
    idCuentaAnticipos: number;
    idIvaExento: number;
    idIvaGravable: number;
    idRetensionIsr: number;
    idIeps: number;
    idIvaRetenido: number;
  }