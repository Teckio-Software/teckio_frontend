import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ContratosDTO, DatosEmpleadoDTO, JornadasDTO, PlazaCentroDTO, PlazaCuentaDTO, PlazaEmpleadoDTO, RegimenesDTO, RiesgosDTO, UsuarioGastosDTO, arbolDTO, arbol_AutorizadoresDTO, autorizadoresDTO } from '../tsDatos-empleado';
import { DatosEmpleadoService } from '../datos-empleado.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SeguridadService } from 'src/app/seguridad/seguridad.service';
import { PageEvent } from '@angular/material/paginator';
import { plazaEmpleadoDTO } from '../../conf-plaz-div/tsConf-plaza-div';
import { divisionDTO } from '../../division/tsDivision';
import { plazaDTO } from '../../plazas/tsPlazas';
import { plazaService } from '../../plazas/plazas.service';
import { divisionService } from '../../division/division.service';
import { cuentaContableGastosDTO } from '../../cuenta-contable/tsCuentaContableGastos';
import { cuentaContableGastosService } from '../../cuenta-contable/cuentaContableGastos.service';
import { centroCostosService } from '../../centro-costos/centro-costos.service';
import { centroCostosDTO } from '../../centro-costos/tsCentro-Costos';
import { usuarioBaseDTO } from 'src/app/seguridad/seguridad-multi-empresa/tsSeguridadMultiEmpresa';
import { empty } from 'rxjs';
import { NivelComponent } from '../../crear-arbol/nivel/nivel.component';

@Component({
  selector: 'app-datos-empleado',
  templateUrl: './datos-empleado.component.html',
  styleUrls: ['./datos-empleado.component.css']
})
export class DatosEmpleadoComponent {
  empleado: boolean = true;
  confCentro: boolean = false;
  confCuenta: boolean = false;
  confPlaza: boolean = false;
  arbol: boolean = false;
  plazacambio: plazaEmpleadoDTO[] = [];

  mostrarEmpleado() {
    this.empleado = true;
    this.confCentro = false;
    this.confCuenta = false;
    this.confPlaza = false;
    this.arbol = false;
    this.verArbol = false;
    this.editarArbol = false;
  }

  mostrarconfCentro(empleado: PlazaEmpleadoDTO) {
    this.empleado = false;
    this.confCentro = true;
    this.confCuenta = false;
    this.confPlaza = false;
    this.arbol = false;
    this.cargarEmpleadoCentro(empleado.id)
    this.idEmpleado = empleado.id;
  }

  mostrarconfCuenta(empleado: PlazaEmpleadoDTO) {
    this.empleado = false;
    this.confCentro = false;
    this.confCuenta = true;
    this.confPlaza = false;
    this.arbol = false;
    this.cargarEmpleadoCuenta(empleado.id)
    this.idEmpleado = empleado.id;
  }

  mostrarconfPlaza(empleado: UsuarioGastosDTO) {
    this.empleado = false;
    this.confCentro = false;
    this.confCuenta = false;
    this.confPlaza = true;
    this.arbol = false;
    this.cargarplazaEmpleado(empleado.id)
    this.idEmpleado = empleado.id;
  }

  mostrarArbol(plazaEmpleado: PlazaEmpleadoDTO) {

    this.arbol = true;
    this.empleado = false;
    this.confCentro = false;
    this.confCuenta = false;
    this.confPlaza = false;
    this.cargararbol(plazaEmpleado.id)
  }

  arbolAutorizadores: arbol_AutorizadoresDTO = {
    id: 0,
    idArbol: 0,
    idAutorizador: 0,
    nivelAutorizacion: 0
  };

  mostrarUObtener(plazaEmpleado: plazaEmpleadoDTO){
    this.idPlazaEmpleado = plazaEmpleado.id;
    this.datosEmpleadoService.obtenerArbolxPlaza(this.idPlazaEmpleado, this.selectedEmpresa)
    
    .subscribe((arbol) => {
      this.arbolAutorizacion = arbol;
      if(this.arbolAutorizacion.id >= 1){
        this.editarArbol = true;
        this.verArbol = false;
        this.mostrarArbol(plazaEmpleado);
        this.updatePop('none')
      }
      else{
        this.editarArbol = false;
        this.verArbol = true;
        this.updatePop('block')
      }
    })
  }  

  mostrarNuevoArbol() {
    this.arbol = true;
    this.empleado = false;
    this.confCentro = false;
    this.confCuenta = false;
    this.confPlaza = false;
  }
  usuarios: UsuarioGastosDTO[] = [];
  usuariosReset: UsuarioGastosDTO[] = [];
  form!:FormGroup;
  formCuenta!:FormGroup;
  formCentro!:FormGroup;

  idPlazaEmpleado: number = 0;
  contratos : ContratosDTO[] = [];
  contratosReset : ContratosDTO[] = [];
  regimenes : RegimenesDTO [] = [];
  regimenesReset : RegimenesDTO [] = [];
  Riesgos : RiesgosDTO [] = [];
  RiesgosReset : RiesgosDTO [] = [];
  Jornadas : JornadasDTO [] = [];
  JornadasReset : JornadasDTO [] = [];
  verArbol: boolean = false;


  idArbol: number = 0;
  EsAnticipo: boolean = false;
  EsGasto: boolean = false;

  usuariosDisponibles: autorizadoresDTO[] = [];
  arbolxAutorizadores: arbol_AutorizadoresDTO[] = [];

  niveles: autorizadoresDTO[][] = [];
  guardarAutorizador: autorizadoresDTO[] = [];
  arregloGuardarArbol: arbol_AutorizadoresDTO[] = [];

  datosEmpleados: DatosEmpleadoDTO[] = [];
  datosEmpleadosReset: DatosEmpleadoDTO[] = [];
  cuentascontables: cuentaContableGastosDTO[] = [];
  cuentascontablesReset: cuentaContableGastosDTO[] = [];
  centroscostos: centroCostosDTO[] = [];
  centroscostosReset: centroCostosDTO[] = [];
  plazasEmpleados: plazaEmpleadoDTO[] = [];  
  empleadoCuenta: PlazaCuentaDTO[] = [];
  empleadoCentro: PlazaCentroDTO[] = [];
  divisiones! : divisionDTO [];
  divisionesReset! : divisionDTO [];
  plazas! : plazaDTO [];
  plazasReset! : plazaDTO [];
  plazasResetAgregar! : plazaDTO [];
  cantidadTotalRegistros: any;
  paginaActual = 1;
  cantidadRegistrosAMostrar = 5;
  selectedEmpresa = 0;
  idEditaEmpleado: number = 0;
  dropdown = true;
  panelActivado: boolean = false;
  idEmpleado: number = 0;

  selectedContrato: number = 0;
  nombreContrato: string = '';
  selectedRegimen: number = 0;
  nombreRegimen: string = '';
  selectedRiesgo: number = 0;
  nombreRiesgo: string = '';
  selectedJornada: number = 0;
  nombreJornada: string = '';

  nombreCentro: string = '';
  selectedCentro: number = 0;
  nombreCuenta: string = '';
  selectedCuenta: number = 0;
  nombreDivision: string = '';
  selectedDivision: number = 0;
  nombrePlaza: string = '';
  selectedPlaza: number = 0;

  arbolAutorizacion: arbolDTO = {
    id: 0,
    idPlazaEmpleado: 0,
    fecha_alta: new Date(),
    esAnticipo: false
  };

  datoEmpleado: DatosEmpleadoDTO = {
    id: 0,
    nombre: '',
    idUsuario: 0,
    numeroEmpleadoSAP: '',
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
    fechaRelacionLaboral: new Date(),
    salarioDiario: 0,
    claveContrato: 0,
    claveRegimen: 0,
    claveJornada: 0,
    claveRiesgoPuesto: 0,
  }
  datosEmpleadosEdicion: DatosEmpleadoDTO = {
    id: 0,
    nombre: '',
    idUsuario: 0,
    numeroEmpleadoSAP: '',
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
    fechaRelacionLaboral: new Date(),
    salarioDiario: 0,
    claveContrato: 0,
    claveRegimen: 0,
    claveJornada: 0,
    claveRiesgoPuesto: 0,
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

  empleadoCuentaEdicion: PlazaCuentaDTO = {
    id: 0,
    idPlaza: 0,
    idCuentaContableGastos: 0,
    estatus: 0,
    nombreCuenta: '',
    codigo: '',
  }

  empleadoCentroEdicion: PlazaCentroDTO = {
    id: 0,
    id_centro_costo: 0,
    idPlaza: 0,
    estatus: 0,
    fecha_alta: new Date(),
    fecha_baja: null,
    nombreCentro: '',
    codigo: ''
  }
  
  constructor(private formBuilder: FormBuilder
    , private datosEmpleadoService: DatosEmpleadoService
    , private plazasService: plazaService
    , private divisionesService: divisionService
    , private cuentasgastosService: cuentaContableGastosService
    , private centroCostosService: centroCostosService
    , private _snackBar: MatSnackBar
    , private _SeguridadEmpresa: SeguridadService
    , private router: Router
    ) {
        let idEmpresa = _SeguridadEmpresa.obtenIdEmpresaLocalStorage();
        this.selectedEmpresa = Number(idEmpresa);
    }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      id: ['', {validators: [],},],
      idPlaza: ['', {validators: [],},],
      idDivision: ['', {validators: [],},],
      metodos_pagos_multiples: ['', {validators: [],},],
      
    });
    this.formCuenta = this.formBuilder.group({
      idCuentaContableGastos: ['', {validators: [],},],
      codigo: ['', {validators: [],},],
    });
    this.formCentro = this.formBuilder.group({
      id_centro_costo: ['', {validators: [],},],
      codigo: ['', {validators: [],},],
    })

    this.cargarRegistros();
  }

  cargarRegistros(){
    this.datosEmpleadoService
    .obtenerEmpleadosGastos(this.selectedEmpresa)
    .subscribe((empleado) =>{
      this.usuarios = empleado;
      this.usuariosReset = empleado;
    })
    this.plazasService
    .obtenerPaginado()
    .subscribe((plaza) =>{
      this.plazas = plaza;
      this.plazasReset = plaza;
    })
    this.divisionesService
    .obtenerPaginado()
    .subscribe((division) =>{
      this.divisiones = division;
      this.divisionesReset = division;
    })
    this.cuentasgastosService
    .obtenerPaginado()
    .subscribe((cuenta)  =>{
      this.cuentascontables = cuenta;
      this.cuentascontablesReset = cuenta;
    })
    this.centroCostosService
    .obtenerPaginado()
    .subscribe((centro)  =>{
      this.centroscostos = centro;
      this.centroscostosReset = centro;
    })
    this.datosEmpleadoService
    .obtenerContrato(this.selectedEmpresa)
    .subscribe((contrato) =>{
      this.contratos = contrato;
      this.contratosReset = contrato;
    })
    this.datosEmpleadoService
    .obtenerRiesgo(this.selectedEmpresa)
    .subscribe((riesgo) =>{
      this.Riesgos = riesgo;
      this.RiesgosReset = riesgo;
    })
    this.datosEmpleadoService
    .obtenerRegimen(this.selectedEmpresa)
    .subscribe((regimen) =>{
      this.regimenes = regimen;
      this.regimenesReset = regimen;
    })
    this.datosEmpleadoService
    .obtenerJornada(this.selectedEmpresa)
    .subscribe((jornada) =>{
      this.Jornadas = jornada;
      this.JornadasReset = jornada;
    })
    
    this.datosEmpleadoService
    .obtenerPaginadoAutorizadores(this.selectedEmpresa)
    .subscribe((autorizador) =>{

      this.usuariosDisponibles = autorizador

      this.datosEmpleadoService.obtenerArbol_Autorizadores(this.idArbol, this.selectedEmpresa)
      .subscribe((arbol_autorizadores) => {
        this.arbolxAutorizadores = arbol_autorizadores
        for(const x = 1; x == this.arbolxAutorizadores.length; x + 1){
          
          if (this.arbolxAutorizadores.some(item => item.id != this.usuariosDisponibles[x].id)) {
            this.usuariosDisponibles.splice(x, 1)
          }
        }
        
      })
      
    })

    // this.datosEmpleadoService
    // .obtenerPaginadoAutorizadores()
    // .subscribe((autorizador) =>{
    //   this.datosEmpleadoService.obtenerArbol_Autorizadores(this.idArbol, this.selectedEmpresa)
    //   .subscribe((arboxAutorizadores) => {
    //     this.arbolxAutorizadores = this.arbolxAutorizadores

    //     if(this.arbolxAutorizadores){
    //       //terminar obtención de arbol_autorizador
    //     }
    //   })
      
    // })
    
  }

  cargarContrato(id: number){
    this.datosEmpleadoService
    .obtenerContrato(this.selectedEmpresa)
    .subscribe((contrato) =>{
      this.contratos = contrato;
    })
  }
  cargarRiesgo(id: number){
    this.datosEmpleadoService
    .obtenerRiesgo(this.selectedEmpresa)
    .subscribe((riesgo) =>{
      this.Riesgos = riesgo;
    })
  }
  cargarRegimen(id: number){
    this.datosEmpleadoService
    .obtenerRegimen(this.selectedEmpresa)
    .subscribe((regimen) =>{
      this.regimenes = regimen;
    })
  }
  cargarJornada(id: number){
    this.datosEmpleadoService
    .obtenerJornada(this.selectedEmpresa)
    .subscribe((jornada) =>{
      this.Jornadas = jornada;
    })
  }

  cargarEmpleadoCuenta(idPlaza: number){
    this.datosEmpleadoService
    .obtenerPaginadoPlazaCuenta(idPlaza, this.selectedEmpresa)
    .subscribe((empleado) =>{
      this.empleadoCuenta = empleado;
    })
  }
  cargarplazaEmpleado(idEmpleado: number){
    this.datosEmpleadoService
    .obtenerPaginadoPlazaEmpleado(idEmpleado, this.selectedEmpresa)
    .subscribe((empleado) =>{
      this.plazasEmpleados = empleado;
    })
  }
  cargarEmpleadoCentro(idPlaza: number){
    this.datosEmpleadoService
    .obtenerPaginadoPlazaCentro(idPlaza, this.selectedEmpresa)
    .subscribe((empleado) =>{
      this.empleadoCentro = empleado;
    })
  }

  cargararbol(idplaza: number = 1){
    this.datosEmpleadoService
    .obtenerArbolxPlaza(idplaza, this.selectedEmpresa)
    .subscribe((arbol) =>{
      this.arbolAutorizacion = arbol;
      this.idArbol = arbol.id;
    })
  }

  cargarPlazaAgregar(idDivision: number){
    this.plazasService
    .obtenerXIdDivision(idDivision,this.paginaActual)
    .subscribe((plaza) =>{
      this.plazas = plaza;
      this.plazasResetAgregar = plaza;
    })
  }

  actualizarPaginacion(datos: PageEvent){
    this.paginaActual = datos.pageIndex + 1;
    this.cantidadRegistrosAMostrar = datos.pageSize;
    this.cargarRegistros();
  }
  

  editarEmpleado(){
    this.datosEmpleadoService.editarEmpleado(this.datosEmpleadosEdicion, this.selectedEmpresa)
    .subscribe(() => {
      this.cargarRegistros()
      this.datosEmpleadosEdicion = {
        id: 0,
        nombre: '',
        idUsuario: 0,
        numeroEmpleadoSAP: '',
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
        fechaRelacionLaboral: new Date(),
        salarioDiario: 0,
        claveContrato: 0,
        claveRegimen: 0,
        claveJornada: 0,
        claveRiesgoPuesto: 0,
      }
    })
  }

  filtrarClaveContrato(event: Event) {
    this.contratos = this.contratosReset;
    const filterValue = (event.target as HTMLInputElement).value.toLocaleLowerCase();
    this.contratos = this.contratos.filter((contrato) => contrato.descripcion.toLocaleLowerCase().includes(filterValue));
  }

  filtrarClaveRegimen(event: Event) {
    this.regimenes = this.regimenesReset;
    const filterValue = (event.target as HTMLInputElement).value.toLocaleLowerCase();
    this.regimenes = this.regimenes.filter((regimen) => regimen.descripcion.toLocaleLowerCase().includes(filterValue));
  }
  filtrarClaveRiesgo(event: Event) {
    this.Riesgos = this.RiesgosReset;
    const filterValue = (event.target as HTMLInputElement).value.toLocaleLowerCase();
    this.Riesgos = this.Riesgos.filter((Riesgo) => Riesgo.descripcion.toLocaleLowerCase().includes(filterValue));
  }
  filtrarClaveJornada(event: Event) {
    this.Jornadas = this.JornadasReset;
    const filterValue = (event.target as HTMLInputElement).value.toLocaleLowerCase();
    this.Jornadas = this.Jornadas.filter((Jornada) => Jornada.descripcion.toLocaleLowerCase().includes(filterValue));
  }


  filtrarCentro(event: Event) {
    this.centroscostos = this.centroscostosReset;
    const filterValue = (event.target as HTMLInputElement).value.toLocaleLowerCase();
    this.centroscostos = this.centroscostos.filter((centro) => centro.nombre.toLocaleLowerCase().includes(filterValue));
  }


  filtrarCuenta(event: Event) {
    this.cuentascontables = this.cuentascontablesReset;
    const filterValue = (event.target as HTMLInputElement).value.toLocaleLowerCase();
    this.cuentascontables = this.cuentascontables.filter((cuenta) => cuenta.nombre.toLocaleLowerCase().includes(filterValue));
  }

  filtrarDivision(event: Event) {
    this.divisiones = this.divisionesReset;
    const filterValue = (event.target as HTMLInputElement).value.toLocaleLowerCase();
    this.divisiones = this.divisiones.filter((division) => division.nombre.toLocaleLowerCase().includes(filterValue));
  }
  filtrarPlaza(event: Event) {
    this.plazas = this.plazasResetAgregar;
    const filterValue = (event.target as HTMLInputElement).value.toLocaleLowerCase();
    this.plazas = this.plazas.filter((plaza) => plaza.nombrePlaza.toLocaleLowerCase().includes(filterValue));
  }
  pruebaCont() {
    this.dropdown = true;
  }
  edicion(datosEmpleado: DatosEmpleadoDTO){
    this.datoEmpleado = datosEmpleado;
  }

  guardarRelacionPlazaEmpleado(){
    this.plazaEmpleadoEdicion = this.form.value;
    this.plazaEmpleadoEdicion.idDivision = this.selectedDivision
    this.plazaEmpleadoEdicion.idPlaza = this.selectedPlaza
    this.plazaEmpleadoEdicion.nombreDivision = this.nombreDivision
    this.plazaEmpleadoEdicion.nombrePlaza = this.nombrePlaza
    this.plazaEmpleadoEdicion.nombreEmpleado = this.nombreCentro
    this.plazaEmpleadoEdicion.estatus = 1;
    this.plazaEmpleadoEdicion.id = 0;
    this.plazaEmpleadoEdicion.fecha_alta = new Date();
    this.plazaEmpleadoEdicion.fecha_baja = null;
    this.plazaEmpleadoEdicion.idEmpleado = this.idEmpleado;
    this.plazaEmpleadoEdicion.Limite_personalizado_Alimentos = 0;
    this.plazaEmpleadoEdicion.Limite_personalizado_Transporte = 0;
    this.plazaEmpleadoEdicion.Limite_personalizado_Hospedaje = 0;
    if (typeof this.plazaEmpleadoEdicion.idEmpleado === 'undefined') {
      this._snackBar.open("Capture todos los campos", "X", {duration: 3000});
      return;
    }
    this.datosEmpleadoService.crearPlazaEmpleado(this.plazaEmpleadoEdicion, this.selectedEmpresa)
    .subscribe( () => {
      this.cargarRegistros();
      this.form.reset();
    });
  }

  guardarRelacionEmpleadoCuenta(){
    this.empleadoCuentaEdicion = this.formCuenta.value;
    this.empleadoCuentaEdicion.idCuentaContableGastos = this.selectedCuenta
    this.empleadoCuentaEdicion.nombreCuenta = this.nombreCuenta
    this.empleadoCuentaEdicion.idPlaza = this.idEmpleado;
    this.empleadoCuentaEdicion.estatus = 1;
    this.empleadoCuentaEdicion.id = 0;
    if (typeof this.empleadoCuentaEdicion.idPlaza === 'undefined') {
      this._snackBar.open("Capture todos los campos", "X", {duration: 3000});
      return;
    }
    this.datosEmpleadoService.crearPlazaCuenta(this.empleadoCuentaEdicion, this.selectedEmpresa)
    .subscribe( () => {
      this.cargarRegistros();
      this.form.reset();
    });
  }

  guardarRelacionEmpleadoCentro(){
    this.empleadoCentroEdicion = this.formCentro.value;
    this.empleadoCentroEdicion.id_centro_costo = this.selectedCentro;
    this.empleadoCentroEdicion.nombreCentro = this.nombreCentro;
    this.empleadoCentroEdicion.idPlaza = this.idEmpleado;
    this.empleadoCentroEdicion.estatus = 1;
    this.empleadoCentroEdicion.fecha_alta = new Date();
    this.empleadoCentroEdicion.fecha_baja = null;
    this.empleadoCentroEdicion.id = 0;

    if (typeof this.empleadoCentroEdicion.idPlaza === 'undefined') {
      this._snackBar.open("Capture todos los campos", "X", {duration: 3000});
      return;
    }
    this.datosEmpleadoService.crearPlazaCentro(this.empleadoCentroEdicion, this.selectedEmpresa)
    .subscribe( () => {
      this.cargarRegistros();
      this.form.reset();
    });
  }


  aplicarFiltroTabla(event: Event) {
    this.usuarios = this.usuariosReset;
    const filterValue = (event.target as HTMLInputElement).value;
    this.usuarios = this.usuarios.filter((usuario) => usuario.nombre.toLocaleLowerCase().includes(filterValue));
  }

  cambiarContrato(contrato: ContratosDTO) {
    this.selectedContrato = contrato.id;
    this.nombreContrato = contrato.descripcion;
    this.cargarContrato(this.selectedContrato);
    
  }
  cambiarRegimen(regimen: RiesgosDTO) {
    this.selectedRegimen = regimen.id;
    this.nombreRegimen = regimen.descripcion;
    this.cargarRegimen(this.selectedRegimen);
    
  }
  cambiarRiesgo(riesgo: RiesgosDTO) {
    this.selectedRiesgo = riesgo.id;
    this.nombreRiesgo = riesgo.descripcion;
    this.cargarRiesgo(this.selectedRiesgo);
    
  }
  cambiarJornada(jornada: JornadasDTO) {
    this.selectedJornada = jornada.id;
    this.nombreJornada = jornada.descripcion;
    this.cargarJornada(this.selectedJornada);
    
  }

  cambiarCentro(centro: centroCostosDTO) {
    this.selectedCentro = centro.id;
    this.nombreCentro = centro.nombre;
    this.cargarRegistros();
    
  }

  cambiarCuenta(cuenta: cuentaContableGastosDTO) {
    this.selectedCuenta = cuenta.id;
    this.nombreCuenta = cuenta.nombre;
    this.cargarRegistros();
    
  }
  cambiarDivision(division: divisionDTO) {
    this.selectedDivision = division.id;
    this.nombreDivision = division.nombre;
    this.cargarPlazaAgregar(this.selectedDivision);
    
  }
  cambiarPlaza(plaza: plazaDTO) {
    this.selectedPlaza = plaza.id;
    this.nombrePlaza = plaza.nombrePlaza;
    this.cargarPlazaAgregar(this.selectedDivision);
  }

  pruebaPlazaEmpleado(empleado: DatosEmpleadoDTO){
    this.datosEmpleadosEdicion = empleado;
  }

  prueba(empleado: DatosEmpleadoDTO){
    this.datosEmpleadosEdicion = empleado;
  }

  CrearArbol(anticipo: boolean){
    this.arbolAutorizacion.idPlazaEmpleado = this.idPlazaEmpleado;
    this.arbolAutorizacion.fecha_alta = new Date();
    this.arbolAutorizacion.id = 0;
    if(anticipo == true)
      this.arbolAutorizacion.esAnticipo = true;
    else
      this.arbolAutorizacion.esAnticipo = false;
    
    this.datosEmpleadoService.crearArbol(this.arbolAutorizacion,this.selectedEmpresa)
    .subscribe(() => {
      this.cargarRegistros()
      this.arbolAutorizacion = {
        id: 0,
        idPlazaEmpleado: 0,
        fecha_alta: new Date(),
        esAnticipo: false
      }
      this.updatePop('none')
    })
  }

  editarArbol: boolean = false;
  nonePop: any = 'block';

  popStyle: any = {
    'display': 'block'
  }
 
 
  updatePop(newDisplay: string): void {
    this.popStyle = {
      ...this.popStyle,
      'display': newDisplay
    };
  }
 


  // obteneridPLaza(plazaEmpleado: plazaEmpleadoDTO){
  //   this.idPlazaEmpleado = plazaEmpleado.id;
  //   this.datosEmpleadoService.obtenerArbolxPlaza(this.idPlazaEmpleado, this.selectedEmpresa)
  //   .subscribe((arbol) => {
  //     this.arbolAutorizacion = arbol;
  //     if(this.arbolAutorizacion.id >= 1){
  //       this.editarArbol = true;
  //       this.verArbol = false;
  //     }
  //     else{
  //       this.editarArbol = false;
  //       this.verArbol = true;
  //     }
  //   })
    
  // }

  editarCuenta(){
    this.datosEmpleadoService.crearEmpleado(this.datosEmpleadosEdicion, this.selectedEmpresa)
    .subscribe(() => {
      this.cargarRegistros()
      this.datosEmpleadosEdicion = {
        id: 0,
        nombre: '',
        idUsuario: 0,
        numeroEmpleadoSAP: '',
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
        fechaRelacionLaboral: new Date(),
        salarioDiario: 0,
        claveContrato: 0,
        claveRegimen: 0,
        claveJornada: 0,
        claveRiesgoPuesto: 0
      }
    })
  }

// Seccion de Arbol

  //Sección usuarios
  // eliminarUsuarios(usuario: autorizadoresDTO): void {
  //   this.datosEmpleadoService.eliminarUsuario(usuario);
  //   this.datosEmpleadoService
  //   .obtenerPaginadoAutorizadores(this.selectedEmpresa)
  //   .subscribe((autorizador) =>{
  //     this.usuariosDisponibles = autorizador;
  //   });
  // }

  //sección niveles

  generarNivel(): void {
    this.niveles.push([]);
  }

  agregarUsuario(usuario: autorizadoresDTO, nivelIndex: number): void {
    usuario.nivel = nivelIndex + 1;
    this.niveles[nivelIndex].push(usuario); // Agregar usuario al nivel
    const index = this.usuariosDisponibles.indexOf(usuario);
    if (index !== -1) {
      this.usuariosDisponibles.splice(index, 1); // Eliminar usuario de la lista de disponibles
      this.guardarAutorizador.push(usuario);
    }
  }

  eliminarUsuario(usuario: autorizadoresDTO, nivelIndex: number): void {
    const index = this.niveles[nivelIndex].indexOf(usuario);
    if (index !== -1) {
      this.niveles[nivelIndex].splice(index, 1); // Eliminar usuario del nivel
      this.usuariosDisponibles.push(usuario); // Agregar usuario de vuelta a la lista de disponibles
      this.guardarAutorizador.splice(index, 1);
    }
  }

  eliminarNivel(nivelIndex: number): void {
    if (confirm("¿Estás seguro de que quieres eliminar este nivel?")) {
      // Obtener usuarios de este nivel antes de eliminarlo
      const usuariosEnNivel = this.niveles[nivelIndex];
      // Eliminar nivel
      this.niveles.splice(nivelIndex, 1);
      // Revertir los usuarios de este nivel a la lista de disponibles
      usuariosEnNivel.forEach(usuario => {
        this.usuariosDisponibles.push(usuario);
        this.guardarAutorizador.splice(nivelIndex, 1);
      });
    } 
  }


  guardarArbol(idArbol: number, idEmpresa: number){
    this.arbolAutorizadores.idArbol = idArbol;
    for (var x = 0; x < this.guardarAutorizador.length; x++) {
      this.arregloGuardarArbol[x] = {
        id: 0,
        idArbol: idArbol,
        idAutorizador: this.guardarAutorizador[x].id,
        nivelAutorizacion: this.guardarAutorizador[x].nivel
      };
    
    }
    this.datosEmpleadoService.CrearRelación_ArbolxAutorizador(this.arregloGuardarArbol, idEmpresa)
    .subscribe(() => {
      this.cargarRegistros()
      this.arregloGuardarArbol = [];
    })
  }


}

