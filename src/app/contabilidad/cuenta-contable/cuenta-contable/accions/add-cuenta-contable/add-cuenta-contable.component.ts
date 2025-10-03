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
  
  errorCo: boolean = false;
  errorDe: boolean = false;
  errorRu: boolean = false;
  errorTM: boolean = false;
  errorCAS: boolean = false;
  errorGlobal: boolean = false;

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
    let c = true;
    if((this.nuevaCC.codigo.trim()=='')&&
      (this.nuevaCC.descripcion.trim()=='') &&
      (this.nuevaCC.idRubro<=0) &&
      (this.nuevaCC.tipoMoneda<=0) &&
      (this.nuevaCC.idCodigoAgrupadorSat<=0)
      ){
        this.errorGlobal = true;
        return;
      }
    if(this.nuevaCC.codigo.trim()==''){
      this.errorCo = true;
      c = false;
    }
    if(this.nuevaCC.descripcion.trim()==''){
      this.errorDe = true;
      c = false;
    }
    if(this.nuevaCC.idRubro<=0){
      this.errorRu = true;
      c = false;
    }
    if(this.nuevaCC.tipoMoneda<=0){
      this.errorTM = true;
      c = false;
    }
    if(this.nuevaCC.idCodigoAgrupadorSat<=0){
      this.errorCAS = true;
      c = false;
    }
    if(!c){
      return;
    }
    this.dialogRef.close(this.nuevaCC); // Cierra el modal sin guardar
  }

  cargarRubros(){
    this.rubroService
    .obtenerTodos(this.selectedEmpresa)
    .subscribe((respuesta) => {
      this.rubros = respuesta;
    });
  }

  limpiarErrores(){
    this.errorCo = false;
    this.errorDe = false;
    this.errorRu = false;
    this.errorTM = false;
    this.errorCAS = false;
    this.errorGlobal = false;
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
    this.limpiarErrores();
    this.dialogRef.close(false); // Cierra el modal sin guardar
  }
  
  detenerCierre(event: MouseEvent) {
    event.stopPropagation();
  }
}
