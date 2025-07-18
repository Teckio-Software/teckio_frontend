export interface almacenDTO{
    id: number;
    codigo: string;
    almacenNombre: string;
    central: boolean;
    responsable: string;
    domicilio: string;
    colonia: string;
    ciudad: string;
    telefono: string;
    idProyecto : number;
  }
  
  export interface almacenCreacionDTO{
    codigo: string;
    almacenNombre: string;
    central: boolean;
    responsable: string;
    domicilio: string;
    colonia: string;
    ciudad: string;
    telefono: string;
    idProyecto : number;
  }
  