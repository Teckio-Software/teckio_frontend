import { FormControl, FormGroup, Validators } from "@angular/forms";

export interface claveProdDTO{
  id: number;
  idClaveProd: number;
  permitido: boolean;
  idDivision: number;
  idCuentaContable: number;
  nombreClave: string;
  claveProd: string;
  nombreDivision: string;
  nombreCuentaContable: string;
}

export interface ClaveProdSATDTO{
  id: number;
  clave_Producto: string;
  nombre: string;
  estatus: number;
  fecha_alta: Date;
  fecha_baja: Date | null;
}

export interface claveProdCreacionDTO{
  id: number;
  idClaveProd: number;
  permitido: boolean;
  idDivision: number;
  idCuentaContable: number;
  nombreClave: string;
  claveProd: string;
  nombreDivision: string;
  nombreCuentaContable: string;
}


export interface claveProdFormControl{
  id: FormControl<number>;
  idClaveProd: FormControl<number>;
  permitido: FormControl<boolean>;
  idDivision: FormControl<number>;
  idCuentaContable: FormControl<number>;
  nombreClave: FormControl<string>;
  claveProd: FormControl<string>;
  nombreDivision: FormControl<string>;
  nombreCuentaContable: FormControl<string>;
}