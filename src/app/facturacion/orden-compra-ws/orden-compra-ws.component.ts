import { Component, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { EntradasLinea, OrdenCompra, OrdenCompraWS, agrupacionEntrada, detalleOrdenPorConfirmarModel } from '../orden-compra-ws-utilidades/tsOrdenCompra';
import { MatPaginator } from '@angular/material/paginator';
import { UtilidadesService } from 'src/app/utilidades/utilidades.service';
import { RespuestaDTO, formatearFecha } from 'src/app/utilidades/tsUtilidades';
import { OrdenCompraWsUtilidadesService } from '../orden-compra-ws-utilidades/orden-compra-ws-utilidades.service';
import { SeguridadService } from 'src/app/seguridad/seguridad.service';
import  Swal  from 'sweetalert2';
import { FacturaService } from '../facturas/factura.service';

@Component({
  selector: 'app-orden-compra-ws',
  templateUrl: './orden-compra-ws.component.html',
  styleUrls: ['./orden-compra-ws.component.css']
})
export class OrdenCompraWsComponent {
  selectedNumeroProveedor: string = "";
  selectedNoEntrada: string = "";
  respuesta: RespuestaDTO = {
    estatus: false,
    descripcion: ''
  }
  ordenCompraWs: OrdenCompraWS[] = [];
  selectedOrdenCompraWs!: OrdenCompraWS;
  detalleOrdenPorConfirmar: detalleOrdenPorConfirmarModel[] = [];
  entradasLinea: EntradasLinea[] = [];
  agrupacionesEntradas: agrupacionEntrada[] = [];
  selectedNoOrdenCompra: string = "";
  noLinea: string = "";
  ordenCompra: string = "";
  division: string = "";
  dataInicio: OrdenCompra[] = [];
  archivosSeleccionados: FileList | null = null;
  archivosSeleccionadosFactura: FileList | null = null;
  dataListaOrdenCompra = new MatTableDataSource(this.dataInicio);
  selectedEmpresa: number = 0;
  dataInicio2: OrdenCompra[] = [];
  dataListaOrdenCompraDetalle = new MatTableDataSource(this.dataInicio2);

  mostrarContenido = false;
  mostrarContenido2 = false;
  mostrarContenido3 = false;
  mostrarContenido4 = false;
  ocultarTabla1 = false;
  mostrarTabla2: boolean = false;
  mostrarTabla3: boolean = false;
  mostrarTabla4: boolean = false;
  mostrarTabla5: boolean = false;
  filaNumero: string = '00000';
  filaSeleccionarNumero: string = '';
  selectedLine: string | null = null;
  seleccionarDentradas: string | null = null;
  selectedRow: number | null = null;
  iconInfo: boolean = true;
  sumaTotal: string = '0';
  tablaMontos: boolean = false;
  pestanas: boolean = false;
  pestanaProveedores: boolean = false;
  pestanaComprador: boolean = false;
  pestanaEntrega = false;
  iconRegresar = false;


  toggleContenido(parametro: OrdenCompraWS) {
    this.mostrarContenido = !this.mostrarContenido;
    this.mostrarContenido = true;
    this.mostrarTabla2 = !this.mostrarTabla2;
    this.mostrarTabla5 = false;
    this.ocultarTabla1 = false;
    this.mostrarTabla3 = true;
    this.pestanas = true;
    this.iconRegresar = true;
    this.entradasLinea = parametro.entradasDetalle;
    this.selectedNoOrdenCompra = parametro.numeroOrdenCompra;
    this.detalleOrdenPorConfirmar = parametro.detallesOrdenConfimada;
    this.selectedOrdenCompraWs = parametro;
  }

  toggleContenido2(noLinea: string) {
    this.mostrarContenido2 = true;
    this.noLinea = noLinea;
    this.mostrarTabla3 = !this.mostrarTabla3;
    this.mostrarTabla5 = false;
  }

  toggleContenido3(noEntrada: string) {
    this.mostrarTabla5 = !this.mostrarTabla5;
    this.obtenerOrdenCompraFecha4(noEntrada);
    this.seleccionarDentradas = noEntrada;
    this.filaNumero = '00000'
  }

  toggleTabla2() {
    this.mostrarTabla2 = !this.mostrarTabla2;
    this.mostrarTabla5 = false;
    this.ocultarTabla1 = false;
  }

  toggleTabla3() {
    this.mostrarTabla3 = !this.mostrarTabla3;
    this.mostrarTabla5 = false;
  }

  toggleBotonEntradas() {
    this.mostrarTabla3 = !this.mostrarTabla3;
    this.mostrarTabla4 = !this.mostrarTabla4;
  }

  toggleTabla5(entrada: EntradasLinea) {
    this.mostrarTabla5 = !this.mostrarTabla5;
    this.seleccionarDentradas = entrada.referencia;
    this.mostrarTabla3 = false;
    this.selectedNoEntrada = entrada.noEntrada;
  }

  functionSeleccionarNoEntrada(entrada: EntradasLinea){
    this.selectedNoEntrada = entrada.noEntrada;
  }

  ocultarTablas() {
    this.mostrarTabla2 = false;
    this.mostrarTabla3 = false;
    this.mostrarTabla4 = false;
    this.mostrarTabla5 = false;
    this.ocultarTabla1 = true;
    this.pestanas = false;
    this.iconRegresar = false;
  }

  //-----------------------------------------------------------Seleccionador de no. de línea----------------------------------------
  seleccionarLinea(numero: string) {
    this.filaNumero = numero;
  }

  filtrarLineas(numero: string) {
    this.filaSeleccionarNumero = numero;
    this.selectedLine = numero;
  }

  //----------------------------------------------------------- Cambiar de color la fila---------------------------------------------
  selectRow(numeroOrdenCompra: number) {
    this.selectedRow = numeroOrdenCompra;
  }
  //-----------------------------------------------------------Acciones botones-----------------------------------------------------
  regresarOrdenes() {
    this.mostrarTabla5 = false;
    this.mostrarTabla3 = true;
  }

  //-----------------------------------------------------------pestañas------------------------------------------------------------ -
  mostrarMontos() {
    this.tablaMontos = true;
    this.mostrarTabla4 = false;
    this.mostrarTabla3 = false;
    this.pestanaProveedores = false;
    this.pestanaComprador = false;
    this.pestanaEntrega = false;
    this.mostrarTabla5 = false;
  }

  mostrarEntradas() {
    this.mostrarTabla3 = true;
    this.tablaMontos = false;
    this.mostrarTabla4 = false;
    this.pestanaProveedores = false;
    this.pestanaComprador = false;
    this.pestanaEntrega = false;
    this.mostrarTabla5 = false;
  }

  mostrarProveedores() {
    this.pestanaProveedores = true;
    this.mostrarTabla3 = false;
    this.tablaMontos = false;
    this.pestanaComprador = false;
    this.pestanaEntrega = false;
    this.mostrarTabla5 = false;
    this.mostrarTabla4 = false;
  }

  toggleTabla4() {
    this.mostrarTabla4 = true;
    this.mostrarTabla5 = false;
    this.mostrarTabla3 = false;
    this.tablaMontos = false;
    this.pestanaProveedores = false;
    this.pestanaComprador = false;
    this.pestanaEntrega = false;
  }

  mostrarComprador() {
    this.pestanaComprador = true;
    this.mostrarTabla4 = false;
    this.mostrarTabla5 = false;
    this.mostrarTabla3 = false;
    this.tablaMontos = false;
    this.pestanaProveedores = false;
    this.pestanaEntrega = false;
  }

  mostrarEntrega() {
    this.pestanaEntrega = true;
    this.pestanaComprador = false;
    this.mostrarTabla4 = false;
    this.mostrarTabla5 = false;
    this.mostrarTabla3 = false;
    this.tablaMontos = false;
    this.pestanaProveedores = false;
  }

  @ViewChild(MatPaginator) paginacionTabla!: MatPaginator;

  constructor(
    private _ordencompraServicio: OrdenCompraWsUtilidadesService,
    private _FacturaService: FacturaService,
    private _utilidadServicio: UtilidadesService,
    private _SeguridadEmpresa: SeguridadService
  ) {
    let idEmpresa = _SeguridadEmpresa.obtenIdEmpresaLocalStorage();
    this.selectedEmpresa = Number(idEmpresa);
  }

  obtenerOrdenCompra(ordencompra: string, division: string) {
    this.ordenCompra = ordencompra;
    this.division = division;
    this._ordencompraServicio.ObtenerOC2(ordencompra, division).subscribe({
      next: (data) => {
        if (data.status) {
          // Asignar los datos del cabecero//
          this.dataListaOrdenCompra.data = data.value;
          this.ordenCompraWs = data.value;
          this.dataListaOrdenCompra.data = this.dataListaOrdenCompra.data.map(
            (element) => ({
              ...element,
              fecha: formatearFecha(new Date(element.fecha)),
            })
          );

          //Mostrat y ocultar componentes
          this.ocultarTabla1 = true;
          this.iconInfo = false;

          for (const element of this.dataListaOrdenCompra.data) {
            // Verificar si 'total' es un número antes de formatear
            if (typeof element.total === 'number') {
              element.totalFormateado = element.total.toLocaleString('en-US', {
                style: 'currency',
                currency: 'USD',
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              });
            }
            this.ordenCompraWs[0].estatusOrdenCompraWS
            const NO_ENTREGADO = 1;
            const PARCIALMENTE_ENTREGADO = 2;
            const ORDEN_COMPRAWS = 3;
            const FACTURADO_PARCIALMENTE = 'R';
            const FACTURADO = 'F';

            switch (element.estatusAlmacen) {
              case NO_ENTREGADO: {
                element.estatusAlmacenFormato = 'No entregado';
                break;
              }
              case PARCIALMENTE_ENTREGADO: {
                element.estatusAlmacenFormato = 'Parcialmente entregado';
                break;
              }
              case ORDEN_COMPRAWS: {
                switch (element.estatusOrdenCompraWS) {
                  case FACTURADO_PARCIALMENTE: {
                    element.estatusAlmacenFormato = 'Facturado parcialmente';
                    break;
                  }
                  case FACTURADO: {
                    element.estatusAlmacenFormato = 'Facturado';
                    break;
                  }
                  default: {
                    element.estatusAlmacenFormato = 'Entregado';
                    break;
                  }
                }

                break;
              }
              default: {
                break;
              }
            }
          }



          this.dataListaOrdenCompra.data.forEach((element) => {
            element.selected = false;
          });

          // Llenar la informacion del detalle//
          this.dataListaOrdenCompraDetalle.data = [];
          for (let i = 0; i < data.value.length; i++) {
            const element = data.value[i];
            this.dataListaOrdenCompraDetalle.data.push(
              ...element.detallesOrdenConfimada
            );
          }

          for (
            let i = 0;
            i < this.dataListaOrdenCompraDetalle.data.length; i++) {
            const element = this.dataListaOrdenCompraDetalle.data[i];
            if (typeof element.cantidad === 'number') {
              element.cantidadFormato =
                element.cantidad.toLocaleString('en-US');
            }

            if (typeof element.costoUnitario === 'number') {
              element.costoUnitarioFormato =
                element.costoUnitario.toLocaleString('en-US', {
                  style: 'currency',
                  currency: 'USD',
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                });
            }

            if (typeof element.costoTotal === 'number') {
              element.costoTotalFormato = element.costoTotal.toLocaleString(
                'en-US',
                {
                  style: 'currency',
                  currency: 'USD',
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                }
              );
            }
          }

          //Llenar la informacion por linea//
          // this.dataListaOrdenCompraentradasDetalle.data = [];
          // for (let i = 0; i < data.value.length; i++) {
          //   const element = data.value[i];
          //   this.dataListaOrdenCompraentradasDetalle.data.push(
          //     ...element.entradasDetalle
          //   );
          // }

        } else {
          // Recargar la página
          location.reload();

          // Ocultar las dos tablas
          this.dataListaOrdenCompra.data = [];
          this.dataListaOrdenCompraDetalle.data = [];
          //this.dataListaOrdenCompraentradasDetalle.data = [];

          this.mostrarContenido = false;
          this.mostrarContenido2 = false;

          this._utilidadServicio.mostrarAlerta(
            'No se encontraron datos',
            'Oops!'
          );
        }
      },
      error: (e) => {
        console.error(e);
      },
    });
  }


  obtenerOrdenCompraFecha4(noEntrada: string) {


    this.entradasLinea = [];
    for (let i = 0; i < this.ordenCompraWs.length; i++) {
      const element = this.ordenCompraWs[i];
      if (
        typeof element.entradasDetalle === 'undefined' ||
        !element.entradasDetalle
      ) {
        element.entradasDetalle = [];
      }
      for (
        let index = 0;
        index < element.entradasDetalle.length;
        index++
      ) {
        const element2 = element.entradasDetalle[index];
        if (element2.noEntrada === noEntrada) {
          this.entradasLinea.push(element2);
        }
      }
    }
  }

  obtenerOrdenCompragGeneral(orden: detalleOrdenPorConfirmarModel) {
    //this.mostrarContenido3 = !this.mostrarContenido3;
    //this.mostrarContenido4 = false;
    this.mostrarContenido2 = true;
    this.noLinea = orden.noLinea;
    //this.mostrarTabla3 = !this.mostrarTabla3; //Oculta y muestra la tabla 3
    this.mostrarTabla5 = false;
    this.mostrarTabla4 = false;
    this.filaNumero = '0000';
    this.mostrarTabla4 = false;
    this.mostrarTabla5 = false;
    this.mostrarTabla3 = true;
    this.tablaMontos = false;
    this.pestanaProveedores = false;
    this.pestanaComprador = false;
    this.pestanaEntrega = false;


    this.sumaTotal = '0';
    for (let orden of this.entradasLinea) {
      this.sumaTotal += parseFloat(orden.total);
    }
    //entradasAgrupadas
    //
    this.entradasLinea = [];
    let ordenCompraFiltrado = this.ordenCompraWs.filter(z => z.numeroOrdenCompra === this.selectedNoOrdenCompra);
    for (let i = 0; i < ordenCompraFiltrado.length; i++) {
      const element = ordenCompraFiltrado[i];
      for (let j = 0; j < element.entradasAgrupadas.length; j++) {
        const entrada = element.entradasAgrupadas[j];
        for (let k = 0; k < entrada.listaDetalles.length; k++) {
          const element2 = entrada.listaDetalles[k];
          if (element2.noLinea === this.noLinea) {
            this.entradasLinea.push(element2);
          }
        }
      }
    }
  }

  obtenerOrdenCompraLinea() {
    //this.mostrarContenido4 = true;
    this.mostrarContenido3 = false;
  }

  seleccionarOpcion(event: any) {
    this.mostrarContenido4 = true;
    this.entradasLinea = [];
    for (let i = 0; i < this.ordenCompraWs.length; i++) {
      const element = this.ordenCompraWs[i];
      if (
        typeof element.entradasDetalle === 'undefined' ||
        !element.entradasDetalle
      ) {
        element.entradasDetalle = [];
      }
      for (
        let index = 0;
        index < element.entradasDetalle.length;
        index++
      ) {
        const element2 = element.entradasDetalle[index];
        if (element2.noLinea === event) {
          this.entradasLinea.push(element2);
        }
      }
    }
  }

  ngOnInit(): void {
    this.selectedNumeroProveedor = this._SeguridadEmpresa.zfObtenerPermisoEspecialPantalla("numeroProveedor");
  }

  ngAfterViewInit(): void {
    this.dataListaOrdenCompra.paginator = this.paginacionTabla;
  }

  onAceptarClick(event: any) {
    if (this.archivosSeleccionados) {
      this._ordencompraServicio
        .SimulacionWebService(this.archivosSeleccionados, this.selectedEmpresa.toString())
        .subscribe((info) => {
          this.ordenCompraWs = info;
          this.ocultarTabla1 = true;
          this.iconInfo = false;
        });
    } else {
      console.error('No se han seleccionado archivos.');
    }
  }
  cargarFactura(event: any) {
    if (this.archivosSeleccionadosFactura) {
      this._FacturaService
        .CargaFactura(this.archivosSeleccionadosFactura, this.selectedEmpresa.toString(), this.selectedOrdenCompraWs, this.selectedNoEntrada)
        .subscribe((info) => {
          this.respuesta = info;
          this.ocultarTabla1 = true;
          this.iconInfo = false;
          if (this.respuesta.estatus) {
            Swal.fire({
              title: "Factura validada",
              text: this.respuesta.descripcion,
              icon: "success"
            });
          }
          else{
            Swal.fire({
              title: "Error",
              text: this.respuesta.descripcion,
              icon: "error"
            });
          }
        });
    } else {
    }
  }

  onFileChange(event: any) {
    const files = (event.target as HTMLInputElement).files;
    this.archivosSeleccionados = files;
  }
  onFileChangeFactura(event: any) {
    const files = (event.target as HTMLInputElement).files;
    this.archivosSeleccionadosFactura = files;
  }
}
