import { FormControl, FormGroup, Validators } from "@angular/forms";

export interface tipoInsumoDTO{
  id: number;
  descripcion: string;
}

export interface tipoInsumoCreacionDTO{
  descripcion: string;
}


export interface tipoInsumoFormControl{
  id: FormControl<number>;
  descripcion: FormControl<string>;
}

export class TipoInsumoArray {
  id!: number;
  descripcion!: string;

  static asFormGroup(tipoInsumo: TipoInsumoArray): FormGroup {
    const fg = new FormGroup({
      id: new FormControl(tipoInsumo.id, Validators.required),
      descripcion: new FormControl(tipoInsumo.descripcion, Validators.required)
    });
    return fg;
  }
}
