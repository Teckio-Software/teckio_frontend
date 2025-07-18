import { FormControl, FormGroup, Validators } from "@angular/forms";

export interface cuentaContableGastosDTO{
  id: number;
  nombre: string;
  codigo: string;
  monto_inicial: number;
  esAcreedor: boolean;
  fecha_alta: Date;
  forma_pago_aceptable: number;
  tipo_moneda: number;
  estatus: number;
}


export interface cuentaContableCreacionDTO{
  id: number;
  nombre: string;
  codigo: string;
  monto_inicial: number;
  esAcreedor: boolean;
  fecha_alta: Date;
  forma_pago_aceptable: number;
  tipoMoneda: number;
}


export interface cuentaContableFormControl{
  id: FormControl<number>;
  nombre: FormControl<string>;
  codigo: FormControl<string>;
  monto_inicial: FormControl<number>;
  esAcreedor: FormControl<boolean>;
  fecha_alta: FormControl<Date>;
  forma_pago_aceptable: FormControl<number>;
  tipoMoneda: FormControl<number>;
}