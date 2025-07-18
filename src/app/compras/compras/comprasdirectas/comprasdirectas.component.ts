import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { almacenDTO } from 'src/app/inventario/almacen/almacen';
import { CompraDirectaInsumoCreacionDTO, CompraDirectaInsumoDTO } from '../../comprasdirectasinsumos/tsComprasDirectasInsumos';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { InsumoService } from 'src/app/catalogos/insumo/insumo.service';
import { AlmacenService } from 'src/app/inventario/almacen/almacen.service';
import { ComprasdirectasService } from '../comprasdirectas.service';
import { ComprasdirectasinsumosService } from '../../comprasdirectasinsumos/comprasdirectasinsumos.service';
import { CompraDirectaCreacionDTO, CompraDirectaDTO } from '../tsComprasDirectas';
import { InsumoCreacionDTO, InsumoDTO, InsumoFormDTO } from 'src/app/catalogos/insumo/tsInsumo';
import { PageEvent } from '@angular/material/paginator';
import { HttpResponse } from '@angular/common/http';
import { contratistaDTO } from 'src/app/catalogos/contratista/tsContratista';
import { ContratistaService } from 'src/app/catalogos/contratista/contratista.service';
import { proyectoDTO } from 'src/app/proyectos/proyecto/tsProyecto';
import { ProyectoService } from 'src/app/proyectos/proyecto/proyecto.service';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatTable } from '@angular/material/table';
import { InsumoProyectoBusquedaDTO, InsumoRequisicionBusquedaDTO, RequisicionBuscarDTO, requisicionDTO } from '../../requisicion/tsRequisicion';
import { MatSelectChange } from '@angular/material/select';
import { TipoInsumoService } from 'src/app/catalogos/tipo-insumo/tipo-insumo.service';
import { FamiliaInsumoService } from 'src/app/catalogos/familia-insumo/familia-insumo.service';
import { tipoInsumoDTO } from 'src/app/catalogos/tipo-insumo/tsTipoInsumo';
import { familiaInsumoDTO } from 'src/app/catalogos/familia-insumo/tsFamilia';
import { InsumoXRequisicionService } from '../../insumos-requicision/insumoxrequisicion/insumoxrequisicion.service';
import { insumoXRequisicionCreacion } from '../../insumos-requicision/insumoxrequisicion/tsInsumoXRequisicion';
import { RequisicionService } from '../../requisicion/requisicion.service';
import { MatInput } from '@angular/material/input';
import { MatMenuItem, MatMenuTrigger } from '@angular/material/menu';

@Component({
  selector: 'app-comprasdirectas',
  templateUrl: './comprasdirectas.component.html',
  styleUrls: ['./comprasdirectas.component.css']
})
export class ComprasdirectasComponent implements OnInit {
  form!:FormGroup;
  formInsumos!: FormGroup;
  formNuevoInsumo!: FormGroup;
  totalPedidoFormControl = new FormControl({value: "", disabled: true});
  insumoControlNormal = new FormControl('');
  requisicionControl = new FormControl('');
  montoDescuentoControl = new FormControl('');
  montoIvaControl = new FormControl({value: "", disabled: true});
  montoIsrControl = new FormControl({value: "", disabled: true});
  montoIepsControl = new FormControl({value: "", disabled: true});
  montoIsanControl = new FormControl({value: "", disabled: true});
  montoSubTotalControl = new FormControl({value: "", disabled: true});
  montoTotalControl = new FormControl({value: "", disabled: true});
  @ViewChild('tableInsumosPresupuestados') matTableInsumosPresupuestados!: MatTable<any>;
  totalPedido: number = 0;
  almacenes!: almacenDTO[];
  selectedAlmacen: number = 0;
  tieneInsumosXCompraDirecta = false;
  insumosComprados = 0;
  cantidadInsumos: number = 0;
  precioInsumo: number = 0;
  idCompraDirecta = 0;
  idAlmacen = 0;
  idContratista = 0;
  idProyecto = 0;
  idRequisicion = 0;
  idInsumoCantidad: number = 0;
  idInsumoCosto: number = 0;
  idTipoInsumo: number = 0;
  idFamiliaInsumo: number = 0;
  totalMontoInsumos: number = 0;
  totalDineroInsumos: number = 0;
  multiplicacion: number = 0;
  selectedProyecto: number = 0;
  selectedRow: number = 0;
  selectedInsumoPorNuevaCompraDirecta: number = 0;
  disableDescuento: boolean = true;
  position!: number;

  @ViewChild('dialogNuevaCompraDirecta', {static: true})
  dialogNuevaCompraDirecta!: TemplateRef<any>;

  @ViewChild('dialogNuevoInsumo', {static: true})
  dialogNuevoInsumo!: TemplateRef<any>;

  @ViewChild(MatMenuTrigger, { static: true })
  matMenuTrigger!: MatMenuTrigger;

  menuTopLeftPosition = { x: 0, y: 0 };

  insumosXCompraDirecta!: CompraDirectaInsumoDTO[];
  comprasDirectas!: CompraDirectaDTO[];
  insumos!: InsumoDTO[];
  contratistas!: contratistaDTO[];
  proyectos!: proyectoDTO[];
  listaInsumosSeleccionados: CompraDirectaInsumoCreacionDTO[] = [];
  tiposInsumo!: tipoInsumoDTO[];
  familiasInsumo!: familiaInsumoDTO[];
  requisiciones!: requisicionDTO[];
  insumosXRequisicion!: insumoXRequisicionCreacion[];
  listaIdRequisiciones: number[] = [];

  formularioInsumosOriginal = {
    codigo: '',
    descripcion: '',
    unidad: '',
  };
  creaInsumo: InsumoCreacionDTO ={
    descripcion: '',
    unidad: '',
    codigo: '',
    idTipoInsumo: 0,
    idFamiliaInsumo: 0,
    idProyecto: 0,
    costoUnitario: 0
  }
  creaCompraDirectaReset: CompraDirectaCreacionDTO = {
    fechaRegistro: new Date,
    fechaEntrega: new Date,
    idContratista: 0,
    totalMontoInsumos: 0,
    montoDescuento: 0,
    importeIva: 0,
    totalPedido: 0,
    totalInsumos: 0,
    estatus: 1,
    idAlmacen: 0,
    idPedido: 0,
    observaciones: '',
    listaIdInsumos: [],
    idProyecto: 0,
    idRequisicion: 0,
    descuento: 0
  }
  creaCompraDirecta: CompraDirectaCreacionDTO = {
    fechaRegistro: new Date,
    fechaEntrega: new Date,
    idContratista: 0,
    totalMontoInsumos: 0,
    montoDescuento: 0,
    importeIva: 0,
    totalPedido: 0,
    totalInsumos: 0,
    estatus: 1,
    idAlmacen: 0,
    idPedido: 0,
    observaciones: '',
    listaIdInsumos: [],
    idProyecto: 0,
    idRequisicion: 0,
    descuento: 0
  }
  insumoProyecto: InsumoProyectoBusquedaDTO = {
    idProyecto: 0,
    descripcionInsumo: "",
    unidad: ''
  };
  requisicionBusqueda: InsumoRequisicionBusquedaDTO = {
    idRequisicion: 0,
    numeroRequisicion: '',
    idProyecto: 0
  }
  requisicionBuscarDTO: RequisicionBuscarDTO = {
    idProyecto: 0,
    NoRequisicion: 0
  }
  insumoSeleccionadoNormal: InsumoDTO = {
    id: 0,
    idTipoInsumo: 0,
    idFamiliaInsumo: 0,
    descripcionTipoInsumo: "",
    descripcionFamiliaInsumo: "",
    descripcion: "",
    unidad: "",
    codigo: "",
    idProyecto: 0,
    costoUnitario: 0,
    costoBase: 0,
    esFsrGlobal: false
  };
  requisicion: requisicionDTO = {
    id: 0,
    noRequisicion: "",
    totalInsumosRequisitados: 0,
    insumosPendientes: 0,
    insumosComprados: 0,
    estatus: '',
    idProyecto: 0,
    nombre: '',
    idAlmacen: 0,
    nombreAlmacen: '',
    observaciones: '',
    fechaEntrega: new Date,
    fechaRegistro: new Date,
    estatusInt: 0,
    estatusInsumosSurtidos: 0
  }
  columnasAMostrarIXCD = ['codigo', 'descripcion', 'unidad', 'cantidad', 'precio', 'preciototal'];
  columnasAMostrar = ['id', 'norequisicionsurte', 'nombreproyecto', 'fechaRegistro', 'fechaEntrega', 'proveedor', 'montoDescuento', 'totalPedido', 'estatus', 'observaciones', 'acciones'];
  columnasAMostrarInsumos = ['codigo', 'descripcion', 'unidad', 'cantidad', 'costounitario', 'acciones'];
  columnasAMostrarPU= ['codigo', 'descripcion', 'unidad', 'cantidad', 'importe'];

  //Compras directas
  cantidadTotalRegistros: any;
  paginaActual = 1;
  cantidadRegistrosAMostrar = 10;
  //Paginado de insumos
  cantidadTotalRegistrosInsumos: any;
  paginaActualInsumos = 1;
  cantidadRegistrosAMostrarInsumos = 10;
  //Paginado de insumos en las compras directas
  cantidadTotalRegistrosInsumosCD: any;
  paginaActualInsumosCD = 1;
  cantidadRegistrosAMostrarInsumosCD = 10;
  constructor(private compraDirectaService: ComprasdirectasService
    , private _snackBar: MatSnackBar
    , private formBuilder: FormBuilder
    , private dialog: MatDialog
    , private insumosXComprasDirectasService: ComprasdirectasinsumosService
    , private insumoService: InsumoService
    , private almacenService: AlmacenService
    , private contratistaService: ContratistaService
    , private proyectoService: ProyectoService
    , private tipoInsumoService: TipoInsumoService
    , private familiaInsumoService: FamiliaInsumoService
    , private insumosXRequisicionService: InsumoXRequisicionService
    , private requisicionService: RequisicionService){}

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      fechaEntrega: new FormControl(new Date)
      , idContratista: new FormControl()
      , importeIva: ['']
      , estatus: new FormControl()
      , idAlmacen: new FormControl()
      , idPedido: new FormControl()
      , observaciones: ['']
      , idProyecto: new FormControl()
    });
    //Este form es para el filtrado de un insumo existente
    this.formInsumos = this.formBuilder.group({
      codigo: ['', {validators: [],},]
      , descripcion: ['', {validators: [],},]
      , unidad: ['', {validators: [],},]
    });
    //Este form es para un nuevo insumo
    this.formNuevoInsumo = this.formBuilder.group({
      descripcion: ['', {validators: [],},]
      , unidad: ['', {validators: [],},]
      , codigo: ['', {validators: [],},]
      , idTipoInsumo: new FormControl()
      , idFamiliaInsumo: new FormControl()
    });
    this.formInsumos.valueChanges
    .subscribe((valor) => {
      this.buscarInsumos(valor);
    });
    this.proyectoService.obtenerTodosSinEstructurar(1)
    .subscribe((respuesta) => {
      this.proyectos = respuesta;
    });
    this.almacenService.obtenerTodosSinPaginar(9)
    .subscribe((respuesta) =>{
      this.almacenes = respuesta;
    });
    this.insumoService.obtenerPaginado(0, 1)
    .subscribe((insumos) => {
      this.insumos = insumos;
    });
    this.contratistaService.obtenerTodos(1)
    .subscribe((contratistas) => {
      this.contratistas = contratistas;
    });
    this.insumoControlNormal.valueChanges
    .subscribe((descripcion) => {
      if (typeof descripcion === 'string' && descripcion) {
        this.insumoProyecto.descripcionInsumo = descripcion;
        this.insumoService.ObtenerPorDescripcionInsumo(this.insumoProyecto, 1)
        .subscribe((explosionInsumos) => {
          this.insumos = explosionInsumos;
        });
      }
    });
    this.requisicionControl.valueChanges
    .subscribe((descripcion) => {
      if (typeof descripcion !== 'string' && !descripcion) {
        return
      }
      if (!Number(descripcion)) {
        return;
      }
        this.requisicionBuscarDTO.NoRequisicion = Number(descripcion);
        this.requisicionService.buscarXNoRequisicion(this.requisicionBuscarDTO)
        .subscribe((requisiciones) => {
          this.requisiciones = requisiciones;
        });

    });
    this.tipoInsumoService.obtenerTodosSinPaginar(1)
    .subscribe((tiposInsumo) => {
      this.tiposInsumo = tiposInsumo;
    });
    this.familiaInsumoService.obtenerTodosSinPaginar(1)
    .subscribe((familiaInsumo) => {
      this.familiasInsumo = familiaInsumo;
    });
    this.paginaActual = 1;
    this.cantidadRegistrosAMostrar = 10;
    this.cargarRegistros(this.paginaActual, this.cantidadRegistrosAMostrar);
    this.requisicionService.sinpaginarcapturadosyautorizados()
    .subscribe((requisiciones) => {
      this.requisiciones = requisiciones;
    })

  }

  cargarRegistros(pagina: number, cantidadElementosAMostrar: any){
    this.compraDirectaService.obtenerPaginado(pagina, cantidadElementosAMostrar)
    .subscribe({
        next: (respuesta: HttpResponse<CompraDirectaDTO[]>) =>{
            this.comprasDirectas = respuesta.body || [];
            this.cantidadTotalRegistros = respuesta.headers.get("cantidadTotalRegistros");
            if (this.cantidadTotalRegistros > 0 && this.comprasDirectas.length <= 0){
              this.paginaActual = 1;
              this.cantidadRegistrosAMostrar = 10;
              this.cargarRegistros(this.paginaActual, this.cantidadRegistrosAMostrar);
            }
        },
        error: (zError: any) =>{
            console.error(zError);
        }
    });
  }

  cargarRegistrosInsumos(pagina: number, cantidadElementosAMostrar: any){
    this.insumoService.obtenerPaginado(0, 1)
    .subscribe((insumos) => {
      this.insumos = insumos;
    });
  }

  onTipoInsumoChange(ob: MatSelectChange) {
    this.idTipoInsumo = ob.value;
  }

  onFamiliaInsumoChange(ob: MatSelectChange) {
    this.idFamiliaInsumo = ob.value;
  }

  guardar(){
    //this.creaCompraDirecta = this.form.value;
    this.creaCompraDirecta.fechaRegistro = new Date;
    this.creaCompraDirecta.fechaEntrega = this.form.get('fechaEntrega')?.value;
    this.creaCompraDirecta.idContratista = this.idContratista;
    this.creaCompraDirecta.totalMontoInsumos = this.insumosComprados;
    this.creaCompraDirecta.montoDescuento = Number(this.montoDescuentoControl?.value) <= 0 ? 0 : Number(this.montoDescuentoControl?.value);
    this.creaCompraDirecta.importeIva = Number(this.form.get('importeIva')?.value);
    this.creaCompraDirecta.totalPedido = this.totalPedido;
    this.creaCompraDirecta.totalInsumos = this.insumosComprados;
    this.creaCompraDirecta.estatus = 1;
    this.creaCompraDirecta.idAlmacen = this.idAlmacen;
    this.creaCompraDirecta.idPedido = 0;
    this.creaCompraDirecta.idProyecto = this.idProyecto
    this.creaCompraDirecta.idRequisicion = this.idRequisicion;
    this.creaCompraDirecta.observaciones = this.form.get('observaciones')?.value;
    this.creaCompraDirecta.listaIdInsumos = this.listaInsumosSeleccionados;
    if(typeof this.creaCompraDirecta.fechaRegistro === 'undefined' || !this.creaCompraDirecta.fechaRegistro
      || typeof this.creaCompraDirecta.idAlmacen === 'undefined' || !this.creaCompraDirecta.idAlmacen || this.creaCompraDirecta.idAlmacen < 0 ||
        typeof this.creaCompraDirecta.fechaEntrega === 'undefined' || !this.creaCompraDirecta.fechaEntrega
      || typeof this.creaCompraDirecta.listaIdInsumos === 'undefined' || !this.creaCompraDirecta.listaIdInsumos || this.creaCompraDirecta.listaIdInsumos.length <= 0
        )
    {
        this._snackBar.open("Capture todos los campos", "X", {duration: 3000});
        return;
    }
    this.compraDirectaService.crear(this.creaCompraDirecta)
    .subscribe({
        next: () => {
          this.cargarRegistros(this.paginaActual, this.cantidadRegistrosAMostrar);
          this.limpiarFormulario();
          this.creaCompraDirecta = this.creaCompraDirectaReset;
          this.insumosComprados = 0;
          this.totalDineroInsumos = 0;
          this.creaCompraDirecta.listaIdInsumos = [];
          this.listaInsumosSeleccionados = [];
          this.idContratista = 0;
          this.idAlmacen = 0;
          this.idProyecto = 0;
        }
        , error: (zError: any) => {
            console.error(zError);
        }
    });

  }
  //Este método es para un nuevo insumo que no estaba requisitado
  guardarNuevoInsumo(){
    this.creaInsumo = this.formNuevoInsumo.value;
    if (typeof this.creaInsumo.descripcion === 'undefined' || !this.creaInsumo.descripcion || this.creaInsumo.descripcion === "" ||
        typeof this.creaInsumo.unidad === 'undefined' || !this.creaInsumo.unidad || this.creaInsumo.unidad === "" ||
        //typeof this.editaInsumo.observaciones === 'undefined' || !this.editaInsumo.observaciones || this.editaInsumo.observaciones === "" ||
        typeof this.creaInsumo.idTipoInsumo === 'undefined' || !this.creaInsumo.idTipoInsumo || this.creaInsumo.idTipoInsumo <= 0 ||
        typeof this.creaInsumo.idFamiliaInsumo === 'undefined' || !this.creaInsumo.idFamiliaInsumo || this.creaInsumo.idFamiliaInsumo <= 0
        ) {
        this._snackBar.open("Capture todos los campos", "X", {duration: 3000});
        return;
    }
    this.insumoService.CrearYDevolverInsumoCreado(this.creaInsumo, 1)
    .subscribe((insumo) => {
      this.listaInsumosSeleccionados.push({
        idInsumo: insumo.id,
        precioUnitarioInsumo: 0,
        cantidadInsumos: 0,
        codigoInsumo: insumo.codigo,
        descripcionInsumo: insumo.descripcion,
        unidadInsumo: insumo.unidad,
        iva: 16,
        isr: 0,
        ieps: 0,
        isan: 0
      });
      if (this.matTableInsumosPresupuestados !== undefined) {
        this.matTableInsumosPresupuestados.renderRows();
      }
    });
    this.formNuevoInsumo.reset();
  }

  cargaInsumosCompraDirecta(idCompraDirecta: number){
    this.idCompraDirecta = idCompraDirecta;
    this.selectedRow = idCompraDirecta;
    this.insumosXComprasDirectasService.obtenerPaginado(this.paginaActualInsumosCD, this.cantidadRegistrosAMostrarInsumosCD, this.idCompraDirecta)
    .subscribe((respuesta: HttpResponse<CompraDirectaInsumoDTO[]>) => {
      this.insumosXCompraDirecta = respuesta.body || [];
      this.cantidadTotalRegistrosInsumosCD = respuesta.headers.get("cantidadTotalRegistros");
      if (this.cantidadTotalRegistrosInsumosCD > 0) {
        this.tieneInsumosXCompraDirecta = true;
      }
    });
  }

  buscarInsumos(valores: any){
    valores.pagina = this.paginaActual;
    valores.recordsPorPagina = this.cantidadRegistrosAMostrar;
    this.insumoService.filtrar(valores,0)
    .subscribe({
      next: (response) => {
        this.insumos = response.body || [];
        this.cantidadTotalRegistrosInsumos = response.headers.get('cantidadTotalRegistros');
      },
      error: (zError) => {
        console.error(zError);
      }
    });
  }

  onKeyUp(categoria: string, row: CompraDirectaInsumoDTO, event: string){

    if (typeof event === 'undefined' || !event || event === ""){
        return;
    }
    if (!Number(event)) {
      this._snackBar.open("Solo números", "X", {duration: 3000});
      return;
    }
    if (categoria === 'cantidad') {
      row.cantidadInsumos = Number(event);
    }
    if (categoria === 'precio') {
      row.precioUnitarioInsumo = Number(event);
    }
    this.insumosXComprasDirectasService.editar(row, row.idCompraDirecta)
    .subscribe({
        next: () =>{

        }
        , error: (zError: any) =>{
            console.error(zError);
        }
    });
  }

  //Limpia el formulario de insumos para filtrar los insumos
  limpiarFormularioFiltroInsumosXContratista(){
    this.formInsumos.patchValue(this.formularioInsumosOriginal);
  }

  actualizarPaginacionIXCD(datos: PageEvent){
    this.paginaActualInsumosCD = datos.pageIndex + 1;
    this.cantidadRegistrosAMostrarInsumosCD = datos.pageSize;
    this.cargarRegistrosInsumoXCompraDirecta(this.paginaActualInsumosCD, this.cantidadRegistrosAMostrarInsumosCD, this.idCompraDirecta);
  }

  cargarRegistrosInsumoXCompraDirecta(pagina: number, cantidadElementosAMostrar: any, idCompraDirecta: number){
    this.insumosXComprasDirectasService.obtenerPaginado(pagina, cantidadElementosAMostrar, idCompraDirecta)
    .subscribe({
        next: (respuesta: HttpResponse<CompraDirectaInsumoDTO[]>) =>{
            this.insumosXCompraDirecta = respuesta.body || [];
            this.cantidadTotalRegistrosInsumosCD = respuesta.headers.get("cantidadTotalRegistros");
            if (this.cantidadTotalRegistrosInsumosCD > 0 && this.insumosXCompraDirecta.length <= 0){
              this.paginaActualInsumosCD = 1;
              this.cantidadRegistrosAMostrarInsumosCD = 10;
              this.cargarRegistrosInsumoXCompraDirecta(this.paginaActualInsumosCD, this.cantidadRegistrosAMostrarInsumosCD, idCompraDirecta);
            }
        },
        error: (zError: any) =>{
            console.error(zError);
        }
    });
  }

  autorizar(compradirecta: CompraDirectaDTO){
    //compradirecta.estatus = 2;
    this.compraDirectaService.editarAutorizar(compradirecta).subscribe(() => {
      this.cargarRegistros(this.paginaActual, this.cantidadRegistrosAMostrar);
    });

  }

  liberar(compradirecta: CompraDirectaDTO){
    //compradirecta.estatus = 2;
    this.compraDirectaService.editarLiberar(compradirecta).subscribe(() => {
      this.cargarRegistros(this.paginaActual, this.cantidadRegistrosAMostrar);
    });

  }

  removerAutorizacion(compradirecta: CompraDirectaDTO){
    //compradirecta.estatus = 2;
    this.compraDirectaService.editarRemoverAutorizacion(compradirecta).subscribe(() => {
      this.cargarRegistros(this.paginaActual, this.cantidadRegistrosAMostrar);
    });

  }

  cancelar(compradirecta: CompraDirectaDTO){
    //compradirecta.estatus = 2;
    this.compraDirectaService.cancelar(compradirecta).subscribe(() => {
      this.cargarRegistros(this.paginaActual, this.cantidadRegistrosAMostrar);
    });
  }

  selectionChangeAlmacen(idAlmacen: number){
    this.idAlmacen = idAlmacen;
  }

  selectionChangeContratista(idContratista: number){
    this.idContratista = idContratista;
  }

  selectionChangeProyecto(idProyecto: number){
    this.idProyecto = idProyecto;
  }

  fechaEntregaChange(fechaEntrega: any){
  }

  obtenCantidadInsumo(idInsumo: number, value: string){
    this.idInsumoCantidad = idInsumo;
    if (!Number(value)) {
      this._snackBar.open("Solo números", "X", {duration: 3000});
      return;
    }
    this.cantidadInsumos = Number(value);
  }
  obtenCostoInsumo(idInsumo: number, value: string){
    this.idInsumoCosto = idInsumo;
    this.precioInsumo = Number(value);
  }

  asignarCantidadInsumoCompraDirecta(idInsumo: number){
    if (idInsumo != this.idInsumoCantidad) {
      this._snackBar.open("Capture la cantidad", "X", {duration: 3000});
      return;
    }
    if (idInsumo != this.idInsumoCosto) {
      this._snackBar.open("Capture el costo unitario", "X", {duration: 3000});
      return;
    }
    this.multiplicacion = this.cantidadInsumos * this.precioInsumo;
    this.totalDineroInsumos += this.multiplicacion;
    /////Revisar
    this.creaCompraDirecta.listaIdInsumos.push({
      idInsumo: idInsumo, precioUnitarioInsumo: this.precioInsumo, cantidadInsumos: this.cantidadInsumos,
      codigoInsumo: '', descripcionInsumo: '', unidadInsumo: '',
      iva: 16,
      isr: 0,
      ieps: 0,
      isan: 0
    });
    this.insumosComprados++;
    this.precioInsumo = 0;
    this.cantidadInsumos = 0;
  }

  actualizarPaginacion(datos: PageEvent){
    this.paginaActual = datos.pageIndex + 1;
    this.cantidadRegistrosAMostrar = datos.pageSize;
    this.cargarRegistros(this.paginaActual, this.cantidadRegistrosAMostrar);
  }

  actualizarPaginacionInsumos(datos: PageEvent){
    this.paginaActualInsumos = datos.pageIndex + 1;
    this.cantidadRegistrosAMostrarInsumos = datos.pageSize;
    this.cargarRegistrosInsumos(this.paginaActualInsumos, this.cantidadRegistrosAMostrarInsumos);
  }

  openDialogWithoutRef(){
    // this.compraDirectaService.obtenerPaginado(this.paginaActual, this.cantidadRegistrosAMostrar)
    // .subscribe((compras) =>{
    //     this.comprasDirectas = compras;
    // });
    this.listaInsumosSeleccionados = [];
    this.listaIdRequisiciones = [];
    this.dialog.open(this.dialogNuevaCompraDirecta, {
        width: '50%',
        disableClose: true
    });
  }
  limpiarFormulario(){
    this.form = this.formBuilder.group({
      fechaEntrega: new FormControl()
      , idContratista: new FormControl()
      , montoDescuento: ['']
      , importeIva: ['']
      , totalPedido: ['']
      , estatus: new FormControl()
      , idAlmacen: new FormControl()
      , idPedido: new FormControl()
      , observaciones: ['']
      , idProyecto: new FormControl()
    });

    this.creaCompraDirecta = this.creaCompraDirectaReset
    this.insumosComprados = 0;
    this.montoIvaControl.setValue('');
    this.montoIsrControl.setValue('');
    this.montoIepsControl.setValue('');
    this.montoIsanControl.setValue('');
    this.montoSubTotalControl.setValue('');
    this.montoTotalControl.setValue('');
  }

  limpiarFormularioNuevoInsumo(){
    this.formNuevoInsumo = this.formBuilder.group({
      descripcion: ['', {validators: [],},]
      , unidad: ['', {validators: [],},]
      , codigo: ['', {validators: [],},]
      , idTipoInsumo: new FormControl()
      , idFamiliaInsumo: new FormControl()
    });
  }

  opcionSeleccionadaNormal(zEvent: MatAutocompleteSelectedEvent){
    if (typeof zEvent.option.value === 'undefined' || !zEvent.option.value) {
      return;
    }
    this.insumoSeleccionadoNormal = zEvent.option.value;
    let insumosRequisitando = this.listaInsumosSeleccionados.filter(insumoSeleccionado => insumoSeleccionado.codigoInsumo === this.insumoSeleccionadoNormal.codigo);
    if (insumosRequisitando.length > 0) {
      this.insumoControlNormal.patchValue('');
      insumosRequisitando.splice(0, 1);
      this._snackBar.open("Ya está requisitando este insumo", "X", {duration: 3000});
      return;
    }
    /////Revisar
    this.listaInsumosSeleccionados.push({
      idInsumo: this.insumoSeleccionadoNormal.id,
      precioUnitarioInsumo: 0,
      cantidadInsumos: 0,
      codigoInsumo: this.insumoSeleccionadoNormal.codigo,
      descripcionInsumo: this.insumoSeleccionadoNormal.descripcion,
      unidadInsumo: this.insumoSeleccionadoNormal.unidad,
      iva: 16,
      isr: 0,
      ieps: 0,
      isan: 0
    });
    this.insumoControlNormal.patchValue('');
    if (this.matTableInsumosPresupuestados !== undefined) {
      this.matTableInsumosPresupuestados.renderRows();
    }
  }

  opcionSeleccionadaRequisicion(zEvent: MatAutocompleteSelectedEvent){
    if (typeof zEvent.option.value === 'undefined' || !zEvent.option.value) {
      return;
    }
    this.listaInsumosSeleccionados = [];
    this.requisicion = zEvent.option.value;
    this.idRequisicion = this.requisicion.id;
    this.selectedAlmacen = this.requisicion.idAlmacen;
    this.selectedProyecto = this.requisicion.idProyecto;
    this.form.get('fechaEntrega')?.setValue(this.requisicion.fechaEntrega);
    this.insumosXRequisicionService.obtenerTodosSinPaginar(this.requisicion.id)
    .subscribe((insumos) => {
      if (insumos === null || typeof insumos === 'undefined') {
        this.requisicionControl.patchValue('');
        this._snackBar.open("No hay insumos en esta requisición", "X", {duration: 3000});
        return;
      }
      for (let i = 0; i < insumos.length; i++) {
        const element = insumos[i];
        this.listaInsumosSeleccionados.push({
          idInsumo: 0,
          precioUnitarioInsumo: 0,
          cantidadInsumos: (element.cantidad - Number(element.cantidad)) <= 0 ? 0 : (element.cantidad - Number(element.cantidad)),
          codigoInsumo: "",
          descripcionInsumo: element.descripcion,
          unidadInsumo: element.unidad,
          iva: 16,
          isr: 0,
          ieps: 0,
          isan: 0
        });
      }
      const duplicado = this.listaInsumosSeleccionados.reduce((acumulador: CompraDirectaInsumoCreacionDTO[], valorActual) => {
            // Guardamos en una variable los objetos del arreglo que tienen el valor repetido de la clave "fruta".
            const siExiste = acumulador.find(
              elemento => elemento.codigoInsumo === valorActual.codigoInsumo
            );
            // Si hay objetos repetidos...
            if (siExiste) {
              // Mapeamos al valor inicial "acumulador" de los objetos repetidos.
              return acumulador.map(elemento => {
                // Verificamos si coincide la clave "fruta" de lo mapeado con el objeto devuelto por el reduce
                if (elemento.codigoInsumo === valorActual.codigoInsumo) {
                  // Retornará la clave "cantidad" sumando sus valores con las demás repetidas.
                  return {
                    ...elemento,
                    cantidadInsumos: elemento.cantidadInsumos + valorActual.cantidadInsumos,
                  };
                }
                return elemento;
              });
            }
            // Retornamos todo el resultado, que se almacenará en un nuevo array de objetos.
            return [...acumulador, valorActual];
          }, []);
          this.listaInsumosSeleccionados = duplicado;
      this.requisicionControl.patchValue('');
      // if (this.matTableInsumosPresupuestados !== undefined) {
      //   this.matTableInsumosPresupuestados.renderRows();
      // }
    });
    //Esta parte del código es para multi-requisición (no borrar)
    // let requisicionesConsultado = this.listaIdRequisiciones.filter(idRequisicion => idRequisicion == this.requisicion.id);
    // if (requisicionesConsultado.length > 0) {
    //   this.requisicionControl.patchValue('');
    //   requisicionesConsultado.splice(0, 1);
    //   this._snackBar.open("Ya ha seleccionado esta requisición", "X", {duration: 3000});
    //   return;
    // }
    // this.listaIdRequisiciones.push(this.requisicion.id);
    // this.insumosXRequisicionService.obtenerTodosSinPaginar(this.requisicion.id)
    // .subscribe((insumos) => {
    //   if (insumos === null || typeof insumos === 'undefined') {
    //     this._snackBar.open("No hay insumos en esta requisición", "X", {duration: 3000});
    //     return;
    //   }
    //   for (let i = 0; i < insumos.length; i++) {
    //     const element = insumos[i];
    //     this.listaInsumosSeleccionados.push({
    //       idInsumo: element.id
    //       , precioUnitarioInsumo: 0
    //       , cantidadInsumos: element.cantidad
    //       , codigoInsumo: element.codigo
    //       , descripcionInsumo: element.descripcion
    //       , unidadInsumo: element.unidad
    //     });
    //   }
    //   this.requisicionControl.patchValue('');
    //   if (this.matTableInsumosPresupuestados !== undefined) {
    //     this.matTableInsumosPresupuestados.renderRows();
    //   }
    //   const duplicado = this.listaInsumosSeleccionados.reduce((acumulador: CompraDirectaInsumoCreacionDTO[], valorActual) => {
    //     // Guardamos en una variable los objetos del arreglo que tienen el valor repetido de la clave "fruta".
    //     const siExiste = acumulador.find(
    //       elemento => elemento.codigoInsumo === valorActual.codigoInsumo
    //     );
    //     // Si hay objetos repetidos...
    //     if (siExiste) {
    //       // Mapeamos al valor inicial "acumulador" de los objetos repetidos.
    //       return acumulador.map(elemento => {
    //         // Verificamos si coincide la clave "fruta" de lo mapeado con el objeto devuelto por el reduce
    //         if (elemento.codigoInsumo === valorActual.codigoInsumo) {
    //           // Retornará la clave "cantidad" sumando sus valores con las demás repetidas.
    //           return {
    //             ...elemento,
    //             cantidadInsumos: elemento.cantidadInsumos + valorActual.cantidadInsumos,
    //           };
    //         }
    //         return elemento;
    //       });
    //     }
    //     // Retornamos todo el resultado, que se almacenará en un nuevo array de objetos.
    //     return [...acumulador, valorActual];
    //   }, []);
    //   this.listaInsumosSeleccionados = duplicado;
    // });
  }

  openDialogWithoutRefNuevoInsumo(){
    this.dialog.open(this.dialogNuevoInsumo, {
        width: '50%',
        disableClose: true
    });
  }

  onRightClick(row: any, event: MouseEvent) {
    event.preventDefault();
    this.selectedInsumoPorNuevaCompraDirecta = row.idInsumo;
    this.menuTopLeftPosition.x = event.clientX;
    this.menuTopLeftPosition.y = event.clientY;
    this.matMenuTrigger.menuData = { item: row };
    this.matMenuTrigger.openMenu();
    this.position = row.position;
  }

  calculaMontos(){
    let totalIva = 0;
    let totalIsr = 0;
    let totalIeps = 0;
    let totalIsan = 0;
    let descuento = 0;
    let subTotal = 0;
    let total = 0;
    let precioInsumos = 0;
    descuento = Number(this.montoDescuentoControl.value);
    for (let index = 0; index < this.listaInsumosSeleccionados.length; index++) {
      const element = this.listaInsumosSeleccionados[index];
      precioInsumos = element.precioUnitarioInsumo * element.cantidadInsumos;
      totalIva = totalIva + ((element.iva * precioInsumos)/100);
      totalIsr = totalIsr + ((element.isr * precioInsumos)/100);
      totalIeps = totalIeps + ((element.ieps * precioInsumos)/100);
      totalIsan = totalIsan + ((element.isan * precioInsumos)/100);
      subTotal = subTotal + precioInsumos;
      total = subTotal + totalIva + totalIsr + totalIeps + totalIsan - descuento;//El descuento es en general no por insumo
    }
    this.montoIvaControl.setValue(totalIva.toString());
    this.montoIsrControl.setValue(totalIsr.toString());
    this.montoIepsControl.setValue(totalIeps.toString());
    this.montoIsanControl.setValue(totalIsan.toString());
    this.montoSubTotalControl.setValue(subTotal.toString());
    this.montoTotalControl.setValue(total.toString());
  }
}
