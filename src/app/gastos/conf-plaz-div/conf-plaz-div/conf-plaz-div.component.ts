import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DatosEmpleadoDTO } from '../../datos-empleado/tsDatos-empleado';
import { FormBuilder, FormGroup } from '@angular/forms';
import { plazaEmpleadoDTO } from '../tsConf-plaza-div';
import { plazaEmpleadoService } from '../conf-plaza-div.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SeguridadService } from 'src/app/seguridad/seguridad.service';

@Component({
  selector: 'app-conf-plaz-div',
  templateUrl: './conf-plaz-div.component.html',
  styleUrls: ['./conf-plaz-div.component.css']
})
export class ConfPlazDivComponent implements OnInit {
  
  form!:FormGroup;
  plazaEmpleado: plazaEmpleadoDTO[] = [];
  plazasEmpleados: plazaEmpleadoDTO[] = [];
  plazasEmpleadosReset: plazaEmpleadoDTO[] = [];
  cantidadTotalRegistros: any;
  paginaActual = 1;
  cantidadRegistrosAMostrar = 5;
  selectedEmpresa = 0;
  idEditaCentroCostos: number = 0;
  dropdown = true;
  panelActivado: boolean = false;
  nombrecentroCostos: string = "";
  plazaempleado: plazaEmpleadoDTO = {
    id: 0,
    idPlaza: 0,
    idEmpleado: 0,
    idDivision: 0,
    estatus: 0,
    fecha_alta: new Date(),
    fecha_baja: null,
    metodos_pagos_multiples: false,
    Limite_personalizado_Alimentos: 0,
    Limite_personalizado_Hospedaje: 0,
    Limite_personalizado_Transporte: 0,
    nombrePlaza: '',
    nombreDivision: '',
    nombreEmpleado: ''
  }
  plazaEmpleadoEdicion: plazaEmpleadoDTO = {
    id: 0,
    idPlaza: 0,
    idEmpleado: 0,
    idDivision: 0,
    estatus: 0,
    fecha_alta: new Date(),
    fecha_baja: null,
    metodos_pagos_multiples: false,
    Limite_personalizado_Alimentos: 0,
    Limite_personalizado_Hospedaje: 0,
    Limite_personalizado_Transporte: 0,
    nombrePlaza: '',
    nombreDivision: '',
    nombreEmpleado: ''
  }

  datosEmpleadosEdicion: DatosEmpleadoDTO = {
    id: 0,
    idUsuario: 0,
    numeroEmpleadoSAP: '',
    nombre: '',
    apellidoPaterno: '',
    apellidoMaterno: '',
    estatus: 0,
    fecha_alta: new Date(),
    fecha_baja: null,
    seguroSocial: '',
    rfc: '',
    curp: '',
    codigoPostal: '',
    numeroEmpleado: '',
    fechaRelacionLaboral: null,
    salarioDiario: 0,
    claveContrato: 0,
    claveRegimen: 0,
    claveJornada: 0,
    claveRiesgoPuesto: 0
  };


  constructor(private activatedRoute: ActivatedRoute
              , private formBuilder: FormBuilder
              , private plazaEmpleadoService: plazaEmpleadoService
              , private _snackBar: MatSnackBar
              , private _SeguridadEmpresa: SeguridadService
              ) {
                let idEmpresa = _SeguridadEmpresa.obtenIdEmpresaLocalStorage();
        this.selectedEmpresa = Number(idEmpresa);
               }

  ngOnInit(): void {
    this.datosEmpleadosEdicion = this.activatedRoute.snapshot.queryParams['empleado']
    this.form = this.formBuilder.group({
      id: ['', {validators: [],},]
      , plaza:['', {validators: [],},]
      , division:['', {validators: [],},]
      , estatus:['', {validators: [],},]
    });
    this.cargarRegistros(this.paginaActual, this.cantidadRegistrosAMostrar);
  }

  cargarRegistros(pagina: number, cantidadElementosAMostrar: any){
    this.plazaEmpleadoService
    .obtenerPaginado(this.datosEmpleadosEdicion.id ,this.paginaActual, this.cantidadRegistrosAMostrar, this.selectedEmpresa)
    .subscribe((plaza) =>{
      this.plazasEmpleados = plaza;
      this.plazasEmpleadosReset = plaza;
    })
  }

  guardar(){
    this.plazaEmpleadoEdicion = this.form.value;
    this.plazaEmpleadoEdicion.estatus = 1;
    this.plazaEmpleadoEdicion.id = 0;
    if (typeof this.plazaEmpleadoEdicion.idEmpleado === 'undefined') {
      this._snackBar.open("Capture todos los campos", "X", {duration: 3000});
      return;
    }
    this.plazaEmpleadoService.crear(this.plazaEmpleadoEdicion, this.selectedEmpresa)
    .subscribe( () => {
      this.cargarRegistros(this.paginaActual, this.cantidadRegistrosAMostrar);
      this.form.reset();
    });
  }

}
