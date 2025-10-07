import {
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  Output,
  QueryList,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import {
  almacenSalidaCreacionDTO,
  almacenSalidaDTO,
  insumosExistenciaDTO,
  transpasoAlmacenDTO,
  transpasoAlmacenInsumoDTO,
} from '../almacenSalida/tsAlmacenSalida';
import { AlmacenSalidaService } from '../almacenSalida/almacen-salida.service';
import { formatDate } from '@angular/common';
import { AlmacenService } from '../almacen/almacen.service';
import Swal from 'sweetalert2';
import { faL } from '@fortawesome/free-solid-svg-icons';
import { InsumoDTO } from 'src/app/catalogos/insumo/tsInsumo';
import { log } from 'console';
import { RespuestaDTO } from 'src/app/utilidades/tsUtilidades';
import { AlertaTipo } from 'src/app/utilidades/alert/alert.component';
import { almacenDTO } from '../almacen/almacen';
import { almacenSalidaInsumosCreacionDTO } from '../almacenSalidaInsumos/tsAlmacenSalidaInsumos';
import { existenciasInsumosDTO } from '../existencia/tsExistencia';
import { AlmacenSalidaInsumosService } from '../almacenSalidaInsumos/almacen-salida-insumos.service';
import { ExistenciasService } from '../existencia/existencias.service';
import { SeguridadService } from 'src/app/seguridad/seguridad.service';

@Component({
  selector: 'app-almacen-transpaso',
  templateUrl: './almacen-transpaso.component.html',
  styleUrls: ['./almacen-transpaso.component.css'],
})
export class AlmacenTranspasoComponent { 
    idProyectoInput: number = 0;
    idEmpresaInput: number = 0;
  
    @Output() valueChangeInsumosSA = new EventEmitter();
  
    @ViewChildren('lista') listas!: QueryList<ElementRef<HTMLElement>>;
  
    // Obtiene la referencia al contenedor del virtual scroll
    @ViewChild('virtualScrollContainer') virtualScrollContainer!: ElementRef;
      
    // Escucha los clics en todo el documento
    @HostListener('document:click', ['$event'])
    onDocumentClick(event: MouseEvent) {
      // Comprueba si el virtual scroll está visible y si el clic no ocurrió dentro de él
      if (this.SlistaAlmacenesMain && !this.virtualScrollContainer.nativeElement.contains(event.target)) {
        this.SlistaAlmacenesMain = false;
      }
    }
    
  
    alertaSuccess: boolean = false;
    alertaMessage: string = '';
    alertaTipo: AlertaTipo = AlertaTipo.none;
    AlertaTipo = AlertaTipo;
  
    salidasalmacen!: almacenSalidaDTO[];
    salidasalmacenConPrestamos!: almacenSalidaDTO[];
    salidasalmacenRespaldo!: almacenSalidaDTO[];
    insumosDisponibles: insumosExistenciaDTO[] = [];
    insumoInformacion: insumosExistenciaDTO = {
      idInsumo: 0,
      codigo: '',
      descripcion: '',
      unidad: '',
      cantidadDisponible: 0,
      esPrestamo: false,
      cantidadPorSalir: 0,
    };
  
    selectedIndex = -1;
  
    changeColor: any = null;
    appRegarga: number = 0;
    idSalidaAlmacen: number = 0;
  
    tipoSalidaAlmacen: number = 0;
    fechafiltro!: Date;
  
    almacenes!: almacenDTO[];
    almacenesVS!: almacenDTO[];
  
    idAlmacen: number = 0;
    esBaja: boolean = false;
  
    // almacenSalidaCreacion: almacenSalidaCreacionDTO = {
    //   personaRecibio: '',
    //   ListaAlmacenSalidaInsumoCreacion: [],
    //   idAlmacen: 0,
    //   observaciones: '',
    //   esBaja: false,
    // };
  
    insumoSalidaCreacion: almacenSalidaInsumosCreacionDTO = {
      idInsumo: 0,
      cantidadPorSalir: 0,
      esPrestamo: false,
      idSalidaAlmacen: 0,
    };
  
    isLoading: boolean = true;
  
    isOpenModalTranspaso: boolean = false;
  
    listaAlmacenes: almacenDTO[] = [];
    listaAlmacenesReset: almacenDTO[] = [];
  
    nombreAlmacen: string = '';
    
    SlistaAlmacenes: boolean = false;
    SlistaInsumos: boolean = false;
    filtroEstatus: string = '';
  
    transpaso: transpasoAlmacenDTO = {
      idAlmacenOrigen: 0,
      idAlmacenDestino: 0,
      insumos: [],
    };
  
    selectedInsumo: transpasoAlmacenInsumoDTO = {
      idInsumo: 0,
      cantidadExistencia: 0,
      nombreInsumo: '',
    }
  
      insumosExistentes !: existenciasInsumosDTO[];
      insumosExistentesReset !: existenciasInsumosDTO[];
  
      cantidadDisponible: number = 0;
  
      mensajeError: RespuestaDTO = {
        estatus: false,
        descripcion: '',
      };
  
      SlistaAlmacenesMain: boolean = false;
      selectedAlmacen: string = '';

      /////////* PAGINATION */////////
          paginatedAlmacenes: almacenSalidaDTO[] = [];
          currentPage = 1;
          pageSize = 20; // Number of items per page
          totalItems = 0;
          pages: number[] = [];
          visiblePages: number[] = [];
          totalPages = 0;
      
          ////////////////
  
    constructor(
      public _almacenSalida: AlmacenSalidaService,
      private almacenService: AlmacenService,
      private _almacenSalidaInsumo: AlmacenSalidaInsumosService,
      private _existenciaService: ExistenciasService,
      private _seguridadService: SeguridadService
    ) {
      const IdEmpresa = _seguridadService.obtenIdEmpresaLocalStorage();
    this.idEmpresaInput = Number(IdEmpresa);
    const IdProyecto = _seguridadService.obtenerIdProyectoLocalStorage();
    this.idProyectoInput = Number(IdProyecto);
    }
  
    ngOnInit() {
      this.cargarRegistros();
      this.cargarRegistrosSalidasConPrestamos();
      this.almacenService
        .obtenerXIdProyecto(this.idProyectoInput, this.idEmpresaInput)
        .subscribe((datos) => {
          this.almacenes = datos;
          this.almacenesVS = datos;
        });
    }
  
    /**
   * Filtra la lista de almacenes
   * @param event El evento que se lanzo
   * @returns void
   * @description Filtra la lista de almacenes segun el texto ingresado en el input
   * El texto se busca en la propiedad almacenNombre de cada objeto almacen
   * Si el texto es vacio, se muestra la lista completa de almacenes
   */
    FiltrarAlmacenes(event: Event) {
      this.almacenesVS = this.almacenes;
      const filterValue = (
        event.target as HTMLInputElement
      ).value.toLocaleLowerCase();
      if(filterValue.trim()!=''){
        this.almacenesVS = this.almacenes.filter(a=>
        a.almacenNombre.toLowerCase().includes(filterValue.toLowerCase())
      );
      }
    }
  
  /**
   * Abre el modal de transpaso y resetea los valores de los campos
   * del registro de transpaso, así como la lista de insumos existentes
   * y la cantidad disponible para cada insumo.
   */
    abrirModalTranspaso() {
      this.insumosExistentes = this.insumosExistentesReset;
      this.isOpenModalTranspaso = true;
    }
  
  /**
   * Cierra el modal de transpaso y resetea los valores de los campos
   * del registro de transpaso, así como la lista de insumos existentes
   * y la cantidad disponible para cada insumo.
   */
    cerrarModalTranspaso() {
      this.transpaso.idAlmacenDestino = 0;
      this.selectedInsumo = {
        idInsumo: 0,
        nombreInsumo: '',
        cantidadExistencia: 0
      }
      this.nombreAlmacen = '';
      this.isOpenModalTranspaso = false;
      this.SlistaAlmacenes = false;
      this.SlistaInsumos = false;
      this.cantidadDisponible = 0;
      this.transpaso = {
        idAlmacenOrigen: 0,
        idAlmacenDestino: 0,
        insumos: [],
      }
    }
  
    selectAll(event: Event): void {
      const inputElement = event.target as HTMLInputElement;
      inputElement.select();
    }
  
  /**
   * Comprueba si la cantidad de un insumo en el registro de transpaso no supera la cantidad disponible en el almacén
   * @param index El índice del insumo en el registro de transpaso
   * @param insumo El insumo que se va a comprobar
   */
    comprobarExistencia(index: number, insumo: transpasoAlmacenInsumoDTO) {
      var cantidadDisponible = this.insumosExistentesReset.find((i) => i.idInsumo == insumo.idInsumo)?.cantidadInsumos ?? 0;
      if (this.transpaso.insumos[index].cantidadExistencia > cantidadDisponible) {
        this.transpaso.insumos[index].cantidadExistencia = cantidadDisponible;
      }
    }
  
  /**
   * Filtra la lista de almacenes
   * @param event El evento que se lanzo
   * @returns void
   * @description Filtra la lista de almacenes segun el texto ingresado en el input
   * El texto se busca en la propiedad almacenNombre de cada objeto almacen
   */
    filtrarAlmacen(event: Event) {
      this.listaAlmacenes = this.listaAlmacenesReset;
      const filterValue = (
        event.target as HTMLInputElement
      ).value.toLocaleLowerCase();
      this.listaAlmacenes = this.listaAlmacenes.filter((almacen) =>
        almacen.almacenNombre.toLocaleLowerCase().includes(filterValue)
      );
    }
  
    /**
     * Selecciona un almacen para la orden de venta
     * @param almacen El almacen seleccionado
     */
    seleccionarAlmacen(almacen: almacenDTO) {
      // Asigna el id del almacen seleccionado a la orden de venta
      //
      //* Lógica para guardar la información del almacen de destino para el transpaso
      //
      this.transpaso.idAlmacenDestino = almacen.id
      this.nombreAlmacen = almacen.almacenNombre;
      // Oculta la lista de almacenes
      this.SlistaAlmacenes = false;
      this.mensajeError.estatus = false;
    }
  
    // seleccionarAlmacenMain(id: number, nombreAlmacen: string) {
    //   this.idAlmacen = id;
    //   this.selectedAlmacen = nombreAlmacen;
    //   this.SlistaAlmacenes = false;
    // }
  
    /**
     * Selecciona un insumo para la orden de venta
     * @param insumo El insumo seleccionado
     */
    seleccionarInsumo(insumo: existenciasInsumosDTO) {    
      if(this.transpaso.insumos.filter(i=>i.idInsumo==insumo.idInsumo).length>0){
        this.SlistaInsumos = false;
        return;
      }
      this.selectedInsumo.nombreInsumo = insumo.descripcion;
      this.selectedInsumo.idInsumo = insumo.idInsumo; 
      this.cantidadDisponible = insumo.cantidadInsumos;
  
      // Oculta la lista de almacenes
      this.SlistaInsumos = false;
    }
  
    /**
     * Transpasa los insumos seleccionados del almacen seleccionado a otro almacen
     */
    transpasar() {
      /**
       * Valida que se haya seleccionado un almacen de destino
       */
      if(this.transpaso.idAlmacenDestino==0){
        this.mensajeError = {
          estatus: true,
          descripcion: 'Seleccione un almacen de destino',
        }
        return;
      }
      /**
       * Valida que se haya seleccionado al menos un insumo
       */
      if(this.transpaso.insumos.length<=0){
        this.mensajeError = {
          estatus: true,
          descripcion: 'Seleccione al menos un insumo',
        }
        return;
      }
      /**
       * Realiza el transpaso
       */
      this.transpaso.idAlmacenOrigen = this.idAlmacen
      this._almacenSalida.transpasar(this.idEmpresaInput,this.transpaso).subscribe({next:resp=>{
        console.log(resp);
        if(resp.estatus){
          this.alerta(AlertaTipo.save, resp.descripcion);
          this.cerrarModalTranspaso();
          this.cargarRegistros();
          this.cargarInsumos();
          this.cargarInsumosDisponibles();
        }else{
          this.alerta(AlertaTipo.error, resp.descripcion);
        }
      }, error:()=>{
        this.alerta(AlertaTipo.error, 'Error al realizar la transpaso');
      }})
    }
  
    /**
     * Carga la lista de insumos existentes en el almacen seleccionado
     */
    cargarInsumos(){
      // Obtiene la lista de insumos existentes en el almacen seleccionado
      // y los filtra para que solo se muestren los que tengan cantidad mayor a cero
      this._existenciaService.obtenInsumosExistentes(this.idEmpresaInput, this.idAlmacen).subscribe((datos)=>{
        // Asigna la lista de insumos existentes a la variable correspondiente
        this.insumosExistentes = datos;
        // Filtra la lista de insumos existentes para que solo se muestren los que tengan cantidad mayor a cero
        this.insumosExistentes = this.insumosExistentes.filter(i=>i.cantidadInsumos>0);
        // Asigna la lista de insumos existentes sin filtrar a la variable correspondiente
        this.insumosExistentesReset = this.insumosExistentes;
      });
    }
  
    /**
     * Agrega una fila al registro de transpaso
     */
    agregarFila(){
      // Verifica si el insumo seleccionado tiene un id mayor a cero
      if(this.selectedInsumo.idInsumo>0){
        // Verifica si la cantidad existente del insumo seleccionado es mayor a cero
        if(this.selectedInsumo.cantidadExistencia<=0){
          return;
        }
        // Verifica si la cantidad existente del insumo seleccionado es mayor a la cantidad disponible
        if(this.selectedInsumo.cantidadExistencia>this.cantidadDisponible){
          this.selectedInsumo.cantidadExistencia = this.cantidadDisponible;
        }
        // Oculta el mensaje de error
        this.mensajeError.estatus = false;
        // Agrega el insumo seleccionado al registro de transpaso
        this.transpaso.insumos.push(this.selectedInsumo);
        // Filtra la lista de insumos existentes para que solo se muestren los que no estan en el registro de transpaso
        this.insumosExistentes = this.insumosExistentesReset.filter(i=>this.transpaso.insumos.filter(insumo=>insumo.idInsumo==i.idInsumo).length==0);
  
        // Resetea el insumo seleccionado
        this.cantidadDisponible = 0;
        this.selectedInsumo = {
          idInsumo:0,
          cantidadExistencia:0,
          nombreInsumo:''
        }
  
        //Deselecciona el index
        this.selectedIndex = -1;
      }
    }
  
    /**
     * Elimina un insumo del registro de transpaso
     * @param insumo Insumo a eliminar
     */
    eliminarInsumo(insumo:transpasoAlmacenInsumoDTO){
      // Elimina el insumo del registro de transpaso
      this.transpaso.insumos = this.transpaso.insumos.filter(i=>i.idInsumo!=insumo.idInsumo);
      // Filtra la lista de insumos existentes para que solo se muestren los que no estan en el registro de transpaso
      this.insumosExistentes = this.insumosExistentesReset.filter(i=>this.transpaso.insumos.filter(insumo=>insumo.idInsumo==i.idInsumo).length==0);
    }
  
    detenerCierre(event: MouseEvent) {
      const clicDentro = this.listas.some((lista) =>
        lista.nativeElement.contains(event.target as Node)
      );
      if (!clicDentro) {
        // this.listaProductoYServicio = false;
        // this.mostrarListaImpuestos = false;
        // this.mostrarListaFactores = false;
        // this.mostrarListaCategoria = false;
        // this.listaClientes = false;
      }
      event.stopPropagation();
    }
  
    /**
     * Carga la lista de almacenes sin paginar
     */
    cargarAlmacenes() {
      /**
       * Servicio que se encarga de obtener todos los almacenes sin paginar
       */
      this.almacenService.obtenerTodosSinPaginar(this.idEmpresaInput).subscribe({
        /**
         * Callback que se ejecuta cuando se obtiene la lista de almacenes
         * @param datos lista de almacenes
         */
        next: (datos: almacenDTO[]) => {
          this.listaAlmacenes = datos;
          this.listaAlmacenes = this.listaAlmacenes.filter(a=>a.id!=this.idAlmacen);
          this.listaAlmacenesReset = datos;
        },
        /**
         * Callback que se ejecuta cuando hay un error al obtener la lista de almacenes
         */
        error: () => {
          //Imprime mensaje de error.
        },
      });
      this.filtroEstatus = '';
    }
  
    cargarRegistros() {
      this.salidasalmacen = [];
      this._almacenSalida
        .ObtenXIdProyecto(this.idEmpresaInput, this.idProyectoInput)
        .subscribe((datos) => {
          this.salidasalmacen = datos;
          this.salidasalmacenRespaldo = datos;
          this.fitrarTipoSA();
          this.totalItems = this.salidasalmacen.length;
          this.updatePagination();
          this.updatePaginatedData();
          this.isLoading = false;
        });
    }
    cargarRegistrosSalidasConPrestamos() {
      this.salidasalmacenConPrestamos = [];
      this._almacenSalida
        .ObtenXIdProyectoSalidasConPrestamos(
          this.idEmpresaInput,
          this.idProyectoInput
        )
        .subscribe((datos) => {
          this.salidasalmacenConPrestamos = datos;
        });
    }
  
    // SeleccionaAlmacen(event: Event) {
    //   const inputElement = event.target as HTMLInputElement;
    //   const selectedValue = inputElement.value;
    //   const idAlmacen =
    //     this.almacenes.find((almacen) => almacen.almacenNombre === selectedValue)
    //       ?.id || 0;
    //   this.idAlmacen = idAlmacen;
    //   this.cargarInsumosDisponibles();
    //   this.fitrarTipoSA();
    //   this.cargarInsumos();
    //   this.cargarAlmacenes();
    // }
  
    SeleccionaAlmacen(id: number, nombreAlmacen: string) {
      this.idAlmacen = id;
      this.selectedAlmacen = nombreAlmacen;
      this.SlistaAlmacenesMain = false;
      this.cargarInsumosDisponibles();
      this.fitrarTipoSA();
      this.cargarInsumos();
      this.cargarAlmacenes();
    }
  
    cargarInsumosDisponibles() {
      if (this.idAlmacen != 0) {
        this._almacenSalida
          .obtenerInsumosDisponibles(this.idEmpresaInput, this.idAlmacen)
          .subscribe((datos) => {
            this.insumosDisponibles = datos;
            console.log('insumos disponibles', this.insumosDisponibles);
          });
      }
    }
  
    VerInsumosXSalidaAlmacen(salidaAlmacen: almacenSalidaDTO) {
      this.changeColor = salidaAlmacen.id;
      this.idSalidaAlmacen = salidaAlmacen.id;
      if (salidaAlmacen.estatus == 2) {
        console.log('es baja');
        this.esBaja = true;
      } else {
        this.esBaja = false;
      }
      this.appRegarga += 1;
    }
  
    // NuevaSalidaAlmacen() {
    //   this.almacenSalidaCreacion.idAlmacen = this.idAlmacen;
    //   this.almacenSalidaCreacion.observaciones = '';
    //   this.almacenSalidaCreacion.personaRecibio = '';
    //   this.almacenSalidaCreacion.esBaja = false;
  
    //   this._almacenSalida
    //     .CrearAlmacenSalida(this.idEmpresaInput, this.almacenSalidaCreacion)
    //     .subscribe((datos) => {
    //       if (datos.estatus) {
    //         this.cargarRegistros();
    //         this.cargarRegistrosSalidasConPrestamos();
    //       } else {
    //         Swal.fire({
    //           text: datos.descripcion,
    //           icon: 'error',
    //         });
    //       }
    //     });
    // }
    // NuevaBajaAlmacen() {
    //   this.almacenSalidaCreacion.idAlmacen = this.idAlmacen;
    //   this.almacenSalidaCreacion.observaciones = '';
    //   this.almacenSalidaCreacion.personaRecibio = '';
    //   this.almacenSalidaCreacion.esBaja = true;
  
    //   this._almacenSalida
    //     .CrearAlmacenSalida(this.idEmpresaInput, this.almacenSalidaCreacion)
    //     .subscribe((datos) => {
    //       if (datos.estatus) {
    //         this.cargarRegistros();
    //         this.cargarRegistrosSalidasConPrestamos();
    //       } else {
    //         Swal.fire({
    //           text: datos.descripcion,
    //           icon: 'error',
    //         });
    //       }
    //     });
    // }
  
    actualizarSalidaAlmacen(almacenSalida: almacenSalidaDTO) {
      this._almacenSalida
        .EditarAlmacenSalida(this.idEmpresaInput, almacenSalida)
        .subscribe((datos) => {
          if (datos.estatus) {
            this.cargarRegistros();
          } else {
            Swal.fire({
              text: datos.descripcion,
              icon: 'error',
            });
          }
        });
    }
  
    informacionInsumo(event: Event) {
      const inputElement = event.target as HTMLInputElement;
      const selectedValue = inputElement.value;
      const insumo = this.insumosDisponibles.find(
        (insumo) =>
          insumo.descripcion.replace(/ /g, '') == selectedValue.replace(/ /g, '')
      );
      if (insumo) {
        this.insumoInformacion.idInsumo = insumo.idInsumo;
        this.insumoInformacion.codigo = insumo.codigo;
        this.insumoInformacion.descripcion = insumo.descripcion;
        this.insumoInformacion.unidad = insumo.unidad;
        this.insumoInformacion.cantidadDisponible = insumo.cantidadDisponible;
        this.insumoInformacion.cantidadPorSalir = 0;
      } else {
        this.limpiarInsumoCrear();
      }
    }
  
    limpiarInsumoCrear() {
      this.insumoInformacion.idInsumo = 0;
      this.insumoInformacion.codigo = '';
      this.insumoInformacion.descripcion = '';
      this.insumoInformacion.unidad = '';
      this.insumoInformacion.cantidadDisponible = 0;
      this.insumoInformacion.cantidadPorSalir = 0;
      this.insumoInformacion.esPrestamo = false;
    }
  
    guardarSalidaInsumo() {
      if (
        this.insumoInformacion.idInsumo == 0 ||
        this.insumoInformacion.cantidadPorSalir <= 0 ||
        this.insumoInformacion.cantidadDisponible <
          this.insumoInformacion.cantidadPorSalir
      ) {
        Swal.fire({
          text: 'Datos Incorrectos',
          icon: 'error',
        });
      } else {
        this.insumoSalidaCreacion.idInsumo = this.insumoInformacion.idInsumo;
        this.insumoSalidaCreacion.idSalidaAlmacen = this.idSalidaAlmacen;
        this.insumoSalidaCreacion.cantidadPorSalir =
          this.insumoInformacion.cantidadPorSalir;
        this.insumoSalidaCreacion.esPrestamo =
          this.esBaja == true ? false : this.insumoInformacion.esPrestamo;
  
        this._almacenSalidaInsumo
          .CrearInsumoSalidaAlmacen(
            this.idEmpresaInput,
            this.insumoSalidaCreacion
          )
          .subscribe((datos) => {
            if (datos.estatus) {
              this.limpiarInsumoCrear();
              this.cargarInsumosDisponibles();
              this.appRegarga += 1;
            } else {
              Swal.fire({
                text: datos.descripcion,
                icon: 'error',
              });
            }
          });
      }
    }
  
    fitrarTipoSA() {
      this.changeColor = 0;
      this.idSalidaAlmacen = 0;
  
      this.salidasalmacen = this.salidasalmacenRespaldo;
  
      this.filtroAlmacen();
  
      if (this.tipoSalidaAlmacen == 3) {
        this.salidasalmacen = this.salidasalmacenConPrestamos;
        if (this.fechafiltro == undefined) {
          return;
        } else {
          var salidasA = this.salidasalmacen.filter(
            (z) =>
              formatDate(z.fechaRegistro, 'yyyy-MM-dd', 'en_US') ==
              formatDate(this.fechafiltro, 'yyyy-MM-dd', 'en_US')
          );
          if (salidasA.length <= 0) {
            this.salidasalmacen = [];
          } else {
            this.salidasalmacen = salidasA;
          }
        }
        return;
      }
      if (this.tipoSalidaAlmacen == 0) {
        if (this.fechafiltro == undefined) {
          return;
        } else {
          var salidasA = this.salidasalmacen.filter(
            (z) =>
              formatDate(z.fechaRegistro, 'yyyy-MM-dd', 'en_US') ==
              formatDate(this.fechafiltro, 'yyyy-MM-dd', 'en_US')
          );
          if (salidasA.length <= 0) {
            this.salidasalmacen = [];
            return;
          } else {
            this.salidasalmacen = salidasA;
          }
        }
      } else {
        var entradasA = this.salidasalmacen.filter(
          (z) => z.estatus == this.tipoSalidaAlmacen
        );
        this.salidasalmacen = entradasA;
        if (entradasA.length <= 0) {
          this.salidasalmacen = [];
          return;
        } else {
          if (this.fechafiltro != undefined) {
            var salidasAfecha = entradasA.filter(
              (z) =>
                formatDate(z.fechaRegistro, 'yyyy-MM-dd', 'en_US') ==
                formatDate(this.fechafiltro, 'yyyy-MM-dd', 'en_US')
            );
            if (salidasAfecha.length <= 0) {
              this.salidasalmacen = [];
            } else {
              this.salidasalmacen = salidasAfecha;
            }
          }
        }
      }
    }
  
    filtroAlmacen() {
      if (this.idAlmacen != 0) {
        let porAlmacen = this.salidasalmacen.filter(
          (z) => z.idAlmacen == this.idAlmacen
        );
        this.salidasalmacen = porAlmacen;
      }
    }
  
    alerta(tipo: AlertaTipo, mensaje: string = '') {
        if (tipo === AlertaTipo.none) {
          this.cerrarAlerta();
          return;
        }
    
        this.alertaTipo = tipo;
        this.alertaMessage = mensaje || 'Ocurrió un error';
        this.alertaSuccess = true;
    
        setTimeout(() => {
          this.cerrarAlerta();
        }, 3000);
      }
    
      cerrarAlerta() {
        this.alertaSuccess = false;
        this.alertaTipo = AlertaTipo.none;
        this.alertaMessage = '';
      }

      ////////////* PAGINACIÓN *//////////////////

  updatePagination() {
    this.totalPages = Math.ceil(this.totalItems / this.pageSize);
    this.pages = Array.from({ length: this.totalPages }, (_, i) => i + 1);
    this.updateVisiblePages();
  }

  updateVisiblePages() {
    const startPage = Math.max(1, this.currentPage - 2);

    const endPage = Math.min(this.totalPages, startPage + 4);

    this.visiblePages = Array.from(
      { length: endPage - startPage + 1 },
      (_, i) => startPage + i
    );

    if (this.totalPages < 5) {
      this.visiblePages = this.pages;
    }
  }

  updatePaginatedData() {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.paginatedAlmacenes = this.salidasalmacen.slice(startIndex, endIndex);
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePaginatedData();
      this.updateVisiblePages();
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePaginatedData();
      this.updateVisiblePages();
    }
  }

  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.updatePaginatedData();
      this.updateVisiblePages();
    }
  }

  getPaginationInfo() {
    return `Página ${this.currentPage} de ${this.totalPages}`;
  }
  ///////////* PAGINATION */////////
}
