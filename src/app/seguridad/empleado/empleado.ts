export interface EmpleadoDTO{
id : number;
idUser : number;
nombre : string;
apellidoPaterno : string;
apellidoMaterno : string;
curp : string;
rfc : string;
seguroSocial : string;
fechaRelacionLaboral : Date | null;
fechaTerminoRelacionLaboral : Date | null;
salarioDiario : number;
estatus : boolean;
seleccionado : boolean;
}

export interface PrecioUnitarioXEmpleadoDTO {
    id : number;
    idEmpleado : number;
    idProyceto : number;
    idPrecioUnitario : number;
    nombreProyceto : string;
    codigo : string;
    descripcion : string; 
    unidad : string;
    cantidad : number;
    cantidadConFormato : string;
    seleccionado : boolean;
}