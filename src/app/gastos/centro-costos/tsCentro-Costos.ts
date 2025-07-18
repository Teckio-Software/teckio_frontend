import { FormControl, FormGroup, Validators } from "@angular/forms";

export interface centroCostosDTO{
  id: number;
  nombre: string;
  estatus: number;
  codigo: string;
  fecha_alta: Date;
  fecha_baja: Date | null;
}

export interface centroCostosCreacionDTO{
  id: number;
  nombre: string;
  estatus: number;
  codigo: string;
  fecha_alta: Date;
  fecha_baja: Date | null;
}


export interface centroCostosFormControl{
  id: FormControl<number>;
  nombre: FormControl<string>;
  estatus: FormControl<number>;
  codigo: FormControl<string>;
  fecha_alta: FormControl<Date>;
  fecha_baja: FormControl<Date | null>;
}