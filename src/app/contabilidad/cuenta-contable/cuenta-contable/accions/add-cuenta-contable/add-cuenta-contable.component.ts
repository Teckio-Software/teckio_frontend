import { Component, Inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { rubroDTO } from 'src/app/contabilidad/rubro/tsRubro';
import { codigoAgrupadorDTO, cuentaContableCreacionDTO, cuentaContableDTO } from '../../../tsCuentaContable';
import { RubroService } from 'src/app/contabilidad/rubro/rubro.service';
import { SeguridadService } from 'src/app/seguridad/seguridad.service';
import { CodigoAgrupadorService } from '../../../codigo-agrupador.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CuentaContableService } from '../../../cuenta-contable.service';

@Component({
  selector: 'app-add-cuenta-contable',
  templateUrl: './add-cuenta-contable.component.html',
  styleUrls: ['./add-cuenta-contable.component.css']
})
export class AddCuentaContableComponent {
  selectedEmpresa: number = 0;
  form!: FormGroup;
  rubros!: rubroDTO[];
  codigos!: codigoAgrupadorDTO[];
  creaCuentaContable: cuentaContableCreacionDTO = {
    codigo: "",
    descripcion: "",
    idRubro: 0,
    tipoMoneda: 0,
    saldoInicial: 0,
    saldoFinal: 0,
    presupuesto: 0,
    idCodigoAgrupadorSat: 0,
    idPadre: 0,
    nivel: 0,
    hijos: [],
    esCuentaContableEmpresa: false,
    tipoCuentaContable: 0
  }
  



  constructor(
    private cuentaContableService: CuentaContableService,
    public dialogRef: MatDialogRef<AddCuentaContableComponent>,
    private rubroService: RubroService,
    private _SeguridadEmpresa: SeguridadService,
    private _snackBar: MatSnackBar,
    private formBuilder: FormBuilder

    , private codigoAgrupadorService: CodigoAgrupadorService



    ,@Inject(MAT_DIALOG_DATA) public data: any
  ) { 
    let idEmpresa = _SeguridadEmpresa.obtenIdEmpresaLocalStorage();
    this.selectedEmpresa = Number(idEmpresa);
  }

  ngOnInit(): void {
    this.cargarRubros();
    this.codigoAgrupadorService.obtenerTodosSinPaginar(this.selectedEmpresa)
    .subscribe((codigos) => {
      this.codigos = codigos;
    })
  }


  creaNuevaCuentaContable(){
    this.dialogRef.close(this.nuevaCC); // Cierra el modal sin guardar
  }

  cargarRubros(){
    this.rubroService
    .obtenerTodos(this.selectedEmpresa)
    .subscribe((respuesta) => {
      this.rubros = respuesta;
    });
  }

  nuevaCC: cuentaContableCreacionDTO =  {
    codigo: '',
    descripcion: '',
    idRubro: 0,
    tipoMoneda: 0,
    saldoInicial: 0,
    saldoFinal: 0,
    presupuesto: 0,
    idCodigoAgrupadorSat: 0,
    idPadre: 0,
    nivel: 1,
    hijos: [],
    esCuentaContableEmpresa: false,
    tipoCuentaContable: 0
  }

  cerrarDialog() {
    this.dialogRef.close(false); // Cierra el modal sin guardar
  }
  
  detenerCierre(event: MouseEvent) {
    event.stopPropagation();
  }
}
