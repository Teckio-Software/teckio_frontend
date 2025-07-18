import { FormControl, FormGroup, Validators } from "@angular/forms";

export interface divisionDTO{
  id: number;
  nombre: string;
  estatus: number;
  codigoSAP: string;
  asignaAC: boolean;
  registroPatronal: string;
}

export interface division1{
  id: number;
  nombre: string;
}

export interface divisionCreacionDTO{
  nombre: string;
  estatus: number;
  codigoSAP: string;
  asignaAC: boolean;
  registroPatronal: string;
}


export interface divisionFormControl{
  id: FormControl<number>;
  nombre: FormControl<string>;
  estatus: FormControl<number>;
  codigoSAP: FormControl<string>;
  asignaAC: FormControl<boolean>;
  registroPatronal: FormControl<string>;
}