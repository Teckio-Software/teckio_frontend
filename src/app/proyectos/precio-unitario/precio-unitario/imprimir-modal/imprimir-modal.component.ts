import { proyectoDTO } from './../../../proyecto/tsProyecto';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { imprimirReporte, imprimirReporteAnalisisPU, imprimirReporteManoObra } from './imprimirReportes';
import { precioUnitarioDTO } from '../../tsPrecioUnitario';
import { ParametrosImprimirPuService } from './services/parametros-imprimir-pu.service';
import { SeguridadService } from 'src/app/seguridad/seguridad.service';
import { ParametrosImpresionPu } from './ts.parametros-imprimir-pu';
import { RespuestaDTO } from 'src/app/utilidades/tsUtilidades';
import { Reporte } from './types/reporte';
import { log } from 'console';
import { PrecioUnitarioService } from '../../precio-unitario.service';
import { ConjuntoIndirectosDTO } from 'src/app/proyectos/conjunto-indirectos/conjunto-indirectos';
import { IndirectosServiceService } from 'src/app/proyectos/indirectos/indirectos-service.service';
import { IndirectosDTO } from 'src/app/proyectos/indirectos/indirectos';
import { ImagenService } from 'src/app/utilidades/imagen.service';

/**
 * Modal para configurar y ejecutar la impresión de reportes
 * del flujo de Precio Unitario.
 *
 * Contiene un pequeño wizard de 3 pasos para:
 * 1) Seleccionar el tipo de reporte.
 * 2) Configurar opciones del reporte (rango, encabezados, márgenes, totales).
 * 3) Confirmar y generar el PDF.
 *
 * Entradas principales:
 * - preciosUnitarios: lista completa a imprimir (o base para selección parcial).
 * - marcados: subconjunto de precios seleccionados por el usuario (impresión marcada).
 * - proyecto, totales (con/sin IVA): datos adicionales mostrados en el reporte.
 *
 * Servicios y utilidades:
 * - ParametrosImprimirPuService: CRUD de parámetros de impresión por empresa.
 * - SeguridadService: obtiene el id de empresa activo.
 * - imprimirReporte(): genera el PDF a partir del objeto `Reporte`.
 */
@Component({
  selector: 'app-imprimir-modal',
  templateUrl: './imprimir-modal.component.html',
})
export class ImprimirModalComponent {
  @Input() isOpen: boolean = false;
  @Input() preciosUnitarios: precioUnitarioDTO[] = [];
  @Input() marcados: precioUnitarioDTO[] = [];
  @Input() proyecto!: proyectoDTO;
  @Input() total: number = 0;
  @Input() totalSinIva!: string;
  @Input() totalConIva!: string;
  @Input() totalSinFormato!: number;
  @Input() totalIva!: string;
  @Input() totalSinFormatoIva!: number;
  @Input() totalSinFormatoSinIva!: number;
  @Output() close: EventEmitter<void> = new EventEmitter<void>();
  indirectos: IndirectosDTO[] = [];

  tipoReporte: string = '';
  tipoImpresion: string = '';
  tipoPrecio: string = '';
  tipoError: string = '';
  pieIzq: string = '';
  pieCentro: string = '';
  pieDerecha: string = '';

  selectedParams?: ParametrosImpresionPu;
  selectedEmpresa: number = 0;
  idProyecto: number = 0;
  selectedParamId: number = 0;

  isParamGuardado: boolean = false;
  isParamDeleted: boolean = false;

  reportePresupuesto: boolean = false;
  reporteManoDeObra: boolean = false;
  reporteAnalisisPrecioUnitario: boolean = false;
  isImporteconLetra: boolean = true;
  isImprimirImpuestos: boolean = true;
  isImprimirConCostoDirecto: boolean = false;
  isImprimirPU: boolean = false;
  isImprimirPUIVA: boolean = false;
  isImprimirPuMasIVA: boolean = false;
  isError: boolean = false;
  isError2: boolean = false;
  isError3: boolean = false;
  isError4: boolean = false;

  currentStep: number = 0;
  /** Títulos visibles del wizard de pasos del modal. */
  steps: string[] = [
    'Selecciona el reporte a imprimir',
    'Opciones del reporte',
    'Opciones de impresión',
  ];

  /** Lista de configuraciones persistidas de parámetros de impresión. */
  paramsImpresionLista: ParametrosImpresionPu[] = [];

  /** Modelo editable con la configuración de impresión activa. */
  paramsImpresion: ParametrosImpresionPu = {
    id: 0,
    nombre: '',
    encabezadoIzquierdo: '',
    encabezadoCentro: '',
    encabezadoDerecho: '',
    pieIzquierdo: '',
    pieCentro: '',
    pieDerecho: '',
    margenSuperior: 30,
    margenInferior: 30,
    margenDerecho: 30,
    margenIzquierdo: 30,
  };

  /**
   * Constructor.
   *
   * Obtiene el id de la empresa activa desde el servicio de seguridad y
   * lo asigna a this.selectedEmpresa para utilizarlo en las operaciones
   * de los parámetros de impresión.
   *
   * @param parametrosImpresion Servicio de parámetros de impresión.
   * @param seguridadService Servicio de seguridad.
   */
  constructor(
    private parametrosImpresion: ParametrosImprimirPuService,
    private seguridadService: SeguridadService,
    private precioUnitarioService: PrecioUnitarioService,
    private indirectosService: IndirectosServiceService,
    private imagenService: ImagenService
  ) {
    const idEmpresa: number = Number(seguridadService.obtenIdEmpresaLocalStorage());
    this.selectedEmpresa = idEmpresa;
    const IdProyecto: number = Number(seguridadService.obtenerIdProyectoLocalStorage());
    this.idProyecto = IdProyecto;
  }

  /** Inicializa cargando los parámetros de impresión de la empresa actual. */
  ngOnInit() {
    this.obtenerParametrosImpresion();
  }

  /**
   * Selecciona un parámetro de impresión de la lista y lo asigna
   * a this.paramsImpresion.
   * @param event Evento que se lanza al cambiar el selector de parámetros.
   */
  seleccionarParams(event: Event): void {
    const id: number = Number((event.target as HTMLSelectElement).value);
    const seleccionado: ParametrosImpresionPu | undefined = this.paramsImpresionLista.find(
      (p) => p.id === id,
    );

    if (seleccionado) {
      this.paramsImpresion = { ...seleccionado };
    }
  }

  /**
   * Crea una configuración de parámetros de impresión para la empresa seleccionada.
   * Si la configuración se crea correctamente, se asigna a this.paramsImpresion y se
   * muestra un mensaje de confirmación por 3 segundos.
   * Si ocurre un error, se muestra un mensaje de error por 3 segundos.
   */
  crearConfiguracionParams(): void {
    this.parametrosImpresion.crear(this.selectedEmpresa, this.paramsImpresion).subscribe({
      next: (datos: RespuestaDTO) => {
        if (datos.estatus) {
          this.isParamGuardado = true;
          this.obtenerParametrosImpresion();
        } else {
          this.isParamGuardado = false;
          this.tipoError = datos.descripcion || 'Ocurrió un error';
        }
        setTimeout(() => {
          this.isParamGuardado = false;
          this.tipoError = '';
        }, 3000);
      },
      error: (err) => {
        this.isParamGuardado = false;
        this.tipoError = 'Error al conectar con el servidor';
        console.error(err);

        setTimeout(() => {
          this.tipoError = '';
        }, 3000);
      },
    });
  }

  /**
   * Obtiene la lista de parámetros de impresión para la empresa seleccionada en
   * this.selectedEmpresa y la asigna a this.paramsImpresionLista.
   */
  obtenerParametrosImpresion(): void {
    this.parametrosImpresion
      .obtenerTodos(this.selectedEmpresa)
      .subscribe((datos: ParametrosImpresionPu[]) => {
        this.paramsImpresionLista = datos;
      });
  }

  /**
   * Edita un registro de parámetros de impresión existente.
   *
   * @param id El ID del registro a editar.
   */
  editarParams(id: number): void {
    this.parametrosImpresion.editar(this.selectedEmpresa, this.paramsImpresion).subscribe({
      next: (datos: RespuestaDTO) => {
        this.paramsImpresion.id = id;
        if (datos.estatus) {
          this.isParamGuardado = true;
          this.obtenerParametrosImpresion();
        } else {
          this.isParamGuardado = false;
          this.tipoError = datos.descripcion || 'Ocurrió un error';
        }
        setTimeout(() => {
          this.isParamGuardado = false;
          this.tipoError = '';
        }, 3000);
      },
      error: (err) => {
        this.isParamGuardado = false;
        this.tipoError = 'Error al conectar con el servidor';
        console.error(err);
      },
    });
  }

  /**
   * Elimina un registro de parámetros de impresión existente.
   * Si se elimina correctamente, se muestra un mensaje de confirmación por 3 segundos.
   * Si ocurre un error, se muestra un mensaje de error por 3 segundos.
   * @param id El ID del registro a eliminar.
   */
  eliminarParams(id: number): void {
    this.parametrosImpresion.eliminar(this.selectedEmpresa, id).subscribe({
      next: (datos: RespuestaDTO) => {
        if (datos.estatus) {
          this.isParamDeleted = true;
          this.paramsImpresion = {
            id: 0,
            nombre: '',
            encabezadoIzquierdo: '',
            encabezadoCentro: '',
            encabezadoDerecho: '',
            pieIzquierdo: '',
            pieCentro: '',
            pieDerecho: '',
            margenSuperior: 30,
            margenInferior: 30,
            margenDerecho: 30,
            margenIzquierdo: 30,
          };
          this.obtenerParametrosImpresion();
        } else {
          this.tipoError = datos.descripcion || 'Ocurrió un error';
        }

        setTimeout(() => {
          this.isParamDeleted = false;
          this.tipoError = '';
        }, 3000);
      },
      error: (err) => {
        this.tipoError = 'Error al conectar con el servidor';
        console.error(err);

        setTimeout(() => {
          this.tipoError = '';
        }, 3000);
      },
    });
  }

  /**
   * Cierra el modal y emite un evento de cierre.
   */
  closeModal(): void {
    this.close.emit();
  }

  /**
   * Detiene la propagación del evento de clic en el modal, asegurando que no se
   * cierre el modal accidentalmente al hacer clic en el contenido del mismo.
   * @param event El evento de clic.
   */
  detenerCierre(event: MouseEvent): void {
    event.stopPropagation();
  }

  /**
   * Avanza al siguiente paso en el modal, validando previamente que se hayan
   * seleccionado las opciones necesarias en el paso actual.
   *
   * Si se intenta avanzar al siguiente paso sin haber seleccionado las opciones
   * necesarias, se muestran mensajes de error y no se avanza.
   *
   * Si se ha seleccionado una opción de reporte, se habilita el paso correspondiente
   * para ese reporte.
   */
  nextStep() {
    if(this.tipoReporte === 'analisisPreciosUnitarios') {
      if(ObtenerPUPlanos(this.preciosUnitarios).length <= 0){        
        this.isError4 = true;
        return;
      }
      this.currentStep = 2
    }
    if(this.tipoReporte === 'presupuestoManoDeObra') {
      this.currentStep = 2
    }
    this.isError = false;
    this.isError2 = false;
    this.isError3 = false;

    //validar si hay reporte seleccionado
    if (this.currentStep === 0 && !this.tipoReporte) {
      this.isError = true;
      return;
    } else {
      this.isError = false;
    }

    //validar si hay rango de impresion seleccionado
    if (this.currentStep === 1 && !this.tipoImpresion) {
      this.isError2 = true;
      return;
    } else {
      this.isError2 = false;
    }

    //validar si es impresion marcada y si hay marcados
    if (
      this.currentStep === 1 &&
      this.tipoImpresion === 'impresionMarcada' &&
      (!this.marcados || this.marcados.length === 0)
    ) {
      this.isError3 = true;
      return;
    }

    if (this.currentStep >= this.steps.length - 1) return;

    this.currentStep++;

    this.reportePresupuesto = false;
    this.reporteManoDeObra = false;
    if (this.currentStep > 0) {
      switch (this.tipoReporte) {
        case 'presupuesto':
          this.reportePresupuesto = true;
          break;

        case 'presupuestoManoDeObra':
          this.reporteManoDeObra = true;
          console.warn(`No hay lógica implementada para: ${this.tipoReporte}`);

          break;

        default:
          console.warn(`No hay lógica implementada para: ${this.tipoReporte}`);
      }
    }
  }

  /**
   * Retrocede al paso anterior en el modal, reiniciando el estado de error
   * de selección de opciones.
   */
  prevStep(): void {
    this.isError = false;
    if(this.tipoReporte === 'analisisPreciosUnitarios' || this.tipoReporte === 'presupuestoManoDeObra') {
      this.currentStep = 0
    }
    if (this.currentStep > 0) {
      this.currentStep--;
    }
  }

  /**
   * Finaliza el proceso de impresión, ejecutando la lógica definida
   * en logicaImpresion().
   */
  finish(): void {
    this.logicaImpresion();
  }

  /**
   * Realiza la lógica de impresión de reportes, determinando el tipo de reporte y
   * los totales a imprimir.
   *
   * Se define el tipo de reporte según el valor de tipoReporte y se llena el
   * objeto de reporte con los valores correspondientes.
   *
   * Se activan las banderas de precios unitarios segun el tipo de precio seleccionado.
   * Se envía el objeto de reporte a imprimir a la logica de impresión.
   */
  logicaImpresion(): void {
    //reportes definidos de acuerdo a si es completo o marcado
    const reporte: Reporte = {
      precioUnitario: this.preciosUnitarios,
      detallesPrecioUnitario: [],
      titulo: this.paramsImpresion.nombre,
      encabezadoIzq: this.paramsImpresion.encabezadoIzquierdo,
      encabezadoCentro: this.paramsImpresion.encabezadoCentro,
      encabezadoDerecha: this.paramsImpresion.encabezadoDerecho,
      margenSuperior: this.paramsImpresion.margenSuperior,
      margenInferior: this.paramsImpresion.margenInferior,
      margenIzquierdo: this.paramsImpresion.margenIzquierdo,
      margenDerecho: this.paramsImpresion.margenDerecho,
      importeConLetra: this.isImporteconLetra,
      totalConIVA: this.totalConIva,
      totalSinFormato: this.totalSinFormato,
      totalSinIva: this.totalSinIva,
      total: this.total,
      proyecto: this.proyecto,
      totalIva: this.totalIva,
      imprimirImpuesto: this.isImprimirImpuestos,
      imprimirConCostoDirecto: this.isImprimirConCostoDirecto,
      imprimirConPrecioUnitario: this.isImprimirPU,
      imprimirConPrecioUnitarioIVA: this.isImprimirPUIVA,
      imprimirConPUMasIva: this.isImprimirPuMasIVA,
      indirectos: this.indirectos,
      base64: ''
    };

    //si es marcado, se llena el arreglo de marcados en lugar del completo
    const reporteMarcado: Reporte = {
      precioUnitario: this.marcados,
      detallesPrecioUnitario: [],
      titulo: this.paramsImpresion.nombre,
      encabezadoIzq: this.paramsImpresion.encabezadoIzquierdo,
      encabezadoCentro: this.paramsImpresion.encabezadoCentro,
      encabezadoDerecha: this.paramsImpresion.encabezadoDerecho,
      margenSuperior: this.paramsImpresion.margenSuperior,
      margenInferior: this.paramsImpresion.margenInferior,
      margenIzquierdo: this.paramsImpresion.margenIzquierdo,
      margenDerecho: this.paramsImpresion.margenDerecho,
      importeConLetra: this.isImporteconLetra,
      totalConIVA: this.totalConIva,
      totalSinFormato: this.totalSinFormato,
      totalSinIva: this.totalSinIva,
      total: this.total,
      proyecto: this.proyecto,
      totalIva: this.totalIva,
      imprimirImpuesto: this.isImprimirImpuestos,
      imprimirConCostoDirecto: this.isImprimirConCostoDirecto,
      imprimirConPrecioUnitario: this.isImprimirPU,
      imprimirConPrecioUnitarioIVA: this.isImprimirPUIVA,
      imprimirConPUMasIva: this.isImprimirPuMasIVA,
      indirectos: this.indirectos,
      base64: ''
    };
    this.imagenService.obtenerImagen(this.selectedEmpresa).subscribe({next: (imagen) => {
      reporte.base64 = 'data:image/'+imagen.tipo.replace('.','')+';base64,' + imagen.base64;
      reporteMarcado.base64 = 'data:image/'+imagen.tipo.replace('.','')+';base64,' + imagen.base64;
    }, error: (err) => {
      reporte.base64 = '';
      reporteMarcado.base64 = '';
    },
    complete: () => {
      // definir el tipo de reporte
    switch (this.tipoReporte) {
      case 'presupuesto':
        this.reportePresupuesto = true;
        let reporteBase: Reporte = reporte;
        if (this.tipoImpresion === 'impresionCompleta') {
          if (this.tipoPrecio === 'costoDirecto') {
            reporte.imprimirConCostoDirecto = true;
            imprimirReporte(reporte);
          }
          if (this.tipoPrecio === 'precioUnitario') {
            reporte.imprimirConPrecioUnitario = true;
            imprimirReporte(reporte);
          }
          if (this.tipoPrecio === 'precioUnitarioIVA') {
            reporte.imprimirConPUMasIva = true;
            imprimirReporte(reporte);
          }
        }
        if (this.tipoImpresion === 'impresionMarcada') {
          imprimirReporte(reporteMarcado);
        }
        break;
      case 'analisisPreciosUnitarios':
        this.reporteAnalisisPrecioUnitario = true;
        let preciosUnitariosFiltrados = ObtenerPUPlanos(this.preciosUnitarios);
        if(preciosUnitariosFiltrados.length <= 0){
          console.log('No hay precios unitarios seleccionados');
          return;
        }
        let ids = preciosUnitariosFiltrados.map(pu => pu.id);
        reporte.imprimirConCostoDirecto = true;
        reporte.precioUnitario = preciosUnitariosFiltrados;
        this.precioUnitarioService.ObtenerDetallesPorPUImpresion(this.selectedEmpresa,ids).subscribe((preciosUnitarios) => {
          reporte.detallesPrecioUnitario = preciosUnitarios;
          this.indirectosService.ObtenerIndirectos(this.selectedEmpresa, this.idProyecto).subscribe((conjuntoIndirectos) => {
          this.indirectos = conjuntoIndirectos;
          reporte.indirectos = this.indirectos;
          imprimirReporteAnalisisPU(reporte);
        })
        })
        break;
      case 'presupuestoManoDeObra':
        this.reporteManoDeObra = true;
        let preciosUnitariosFiltradosManoObra = ObtenerTodosPUPlanos(this.preciosUnitarios);
        let idsMO = preciosUnitariosFiltradosManoObra.map(pu => pu.id);
        reporte.imprimirConCostoDirecto = true;
        reporte.precioUnitario = preciosUnitariosFiltradosManoObra;
        this.precioUnitarioService.ObtenerDetallesPorPUImpresion(this.selectedEmpresa,idsMO).subscribe((preciosUnitarios) => {
          reporte.detallesPrecioUnitario = preciosUnitarios.filter(pu => pu.idTipoInsumo == 10008 || pu.idTipoInsumo == 10000);
          if(reporte.detallesPrecioUnitario.length <= 0){
            console.log('No hay precios unitarios seleccionados');
            return;
          }
          console.log(reporte);
          this.indirectosService.ObtenerIndirectos(this.selectedEmpresa, this.idProyecto).subscribe((conjuntoIndirectos) => {
          this.indirectos = conjuntoIndirectos;
          reporte.indirectos = this.indirectos;
          imprimirReporteManoObra(reporte);
          });
        });
        break;
        //si es impresion marcada, se asigna el reporte marcado como base y los totales se calculan de acuerdo a los marcados
        if (this.tipoImpresion === 'impresionMarcada') {
          for (let i = 0; i < reporte.precioUnitario.length; i++) {
            this.total = this.total + reporte.precioUnitario[i].importe;
          }
          reporteBase = reporteMarcado;
        }

        //se limpian las banderas de precios
        flagsPreciosUnitarios(reporteBase);
        //se activan las banderas de precios unitarios segun el tipo de precio seleccionado
        setFlagsPorTipoPrecio(reporteBase, this.tipoPrecio);

        //se envia el objeto de reporte a imprimir a la logica de impresión
        imprimirReporte(reporteBase);
        break;
      default:
        console.log(`No hay lógica implementada para el tipo de reporte: ${this.tipoReporte}`);
    }
    }
  });
    
  }
}

/**
 * Establece las banderas de impresión de precios unitarios en false.
 *
 * @param {Reporte} reporte - El objeto de tipo `Reporte` que se
 *     va a imprimir.
 */

function flagsPreciosUnitarios(reporte: Reporte): void {
  reporte.imprimirConCostoDirecto = false;
  reporte.imprimirConPrecioUnitario = false;
  reporte.imprimirConPrecioUnitarioIVA = false;
}

/**
 * Establece las banderas de impresión de precios unitarios
 * según el tipo de precio.
 *
 * @param {Reporte} reporte - El objeto de tipo `Reporte`
 *     que se va a imprimir.
 * @param {string} tipoPrecio - El tipo de precio que se va
 *     a imprimir.
 *
 * Se establecerá una bandera en true según el tipo de
 *     precio. Si el tipo de precio no es reconocido,
 *     se mostrará un mensaje de error en la consola.
 */
  function setFlagsPorTipoPrecio(reporte: Reporte, tipoPrecio: string): void {
    switch (tipoPrecio) {
      case 'costoDirecto':
        reporte.imprimirConCostoDirecto = true;
        break;
      case 'precioUnitario':
        reporte.imprimirConPrecioUnitario = true;
        break;
      case 'precioUnitarioIVA':
        reporte.imprimirConPrecioUnitarioIVA = true;
        break;

      default:
        console.log('Tipo de precio no reconocido', tipoPrecio);
    }
  }

  /* Función que itera un array de nodos de precio unitario y devuelve un
  * array con los nodos de manera plana que están
  * seleccionados.
  * @param {precioUnitarioDTO[]} nodos - Array de nodos de precio unitario
  * @returns {precioUnitarioDTO[]} - Array con los nodos de tipo "Planos" y
  * seleccionados
  */
  function ObtenerPUPlanos(nodos: precioUnitarioDTO[]): precioUnitarioDTO[] {
    const puPlanos: precioUnitarioDTO[] = [];
    for (const nodo of nodos) {
      if(nodo.tipoPrecioUnitario!=0 && nodo.esSeleccionado){
        puPlanos.push(nodo);
      }
      if (nodo.hijos && nodo.hijos.length > 0) {
        puPlanos.push(...ObtenerPUPlanos(nodo.hijos));
      }
    }
    return puPlanos;
  }

  function ObtenerTodosPUPlanos(nodos: precioUnitarioDTO[]): precioUnitarioDTO[] {
    const puPlanos: precioUnitarioDTO[] = [];
    for (const nodo of nodos) {
      if(nodo.hijos.length == 0 && nodo.tipoPrecioUnitario!=0){
        puPlanos.push(nodo);
      }
      if (nodo.hijos && nodo.hijos.length > 0) {
        puPlanos.push(...ObtenerTodosPUPlanos(nodo.hijos));
      }
    }
    return puPlanos;
  }
