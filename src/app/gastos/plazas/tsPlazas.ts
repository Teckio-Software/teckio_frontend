import { FormControl, FormGroup, Validators } from "@angular/forms";

export interface plazaDTO{
  id: number;
  id_divisiones: number;
  nombrePlaza: string;
  estatus: number;
  fecha_alta: Date;
  fecha_baja: Date | null;
  nombreDivision: string;
}

export interface divisionDTO{
  id: number;
  nombre: string;
}

export interface plazaCreacionDTO{
  id_divisiones: number;
  nombrePlaza: string;
  estatus: number;
  fecha_alta: Date;
  fecha_baja: Date;
}


export interface plazaFormControl{
  id: FormControl<number>;
  nombre: FormControl<string>;
  estatus: FormControl<number>;
  id_divisiones: FormControl<number>;
  fecha_alta: Date;
  fecha_baja: Date;
}