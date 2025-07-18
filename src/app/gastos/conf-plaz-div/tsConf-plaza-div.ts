import { FormControl, FormGroup, Validators } from "@angular/forms";

export interface plazaEmpleadoDTO{
  id: number;
  idPlaza: number;
  idEmpleado: number;
  idDivision: number;
  estatus: number;
  fecha_alta: Date;
  fecha_baja: Date | null;
  metodos_pagos_multiples: boolean;
  Limite_personalizado_Alimentos: number;
  Limite_personalizado_Hospedaje: number;
  Limite_personalizado_Transporte: number;
  nombrePlaza: string;
  nombreDivision: string;
  nombreEmpleado: string;
}


export interface plazaEmpleadoCreacionDTO{
  id: number;
  idPlaza: number;
  idEmpleado: number;
  idDivision: number;
  estatus: number;
  fecha_alta: Date;
  fecha_baja: Date | null;
  metodos_pagos_multiples: boolean;
  Limite_personalizado_Alimentos: number;
  Limite_personalizado_Hospedaje: number;
  Limite_personalizado_Transporte: number;
}


export interface cuentaContableFormControl{
  id: FormControl<number>;
  idPlaza: FormControl<number>;
  idEmpleado: FormControl<number>;
  idDivision: FormControl<number>;
  estatus: FormControl<number>;
  fecha_alta: FormControl<Date>;
  fecha_baja: FormControl<Date | null>;
  metodos_pagos_multiples: FormControl<boolean>;
  Limite_personalizado_Alimentos: FormControl<number>;
  Limite_personalizado_Hospedaje: FormControl<number>;
  Limite_personalizado_Transporte: FormControl<number>;
}