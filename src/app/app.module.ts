import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MenuComponent } from './menu/menu.component';
import { MaterialModule } from './material/material.module';
import { MostrarErroresComponent } from './utilidades/mostrar-errores/mostrar-errores.component';
import { ListadoGenericoComponent } from './utilidades/listado-generico/listado-generico.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { InputImgComponent } from './utilidades/input-img/input-img.component';
import { TipoInsumoComponent } from './catalogos/tipo-insumo/tipo-insumo/tipo-insumo.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { FamiliaInsumoComponent } from './catalogos/familia-insumo/familia-insumo/familia-insumo.component';
import { InsumoComponent } from './catalogos/insumo/insumo/insumo.component';
import { EspecialidadesComponent } from './catalogos/especialidades/especialidad/especialidades.component';
import { ContratistaComponent } from './catalogos/contratista/contratista/contratista.component';
import { RubroComponent } from './contabilidad/rubro/rubro/rubro.component';
import { CuentaContableComponent } from './contabilidad/cuenta-contable/cuenta-contable/cuenta-contable.component';
import { ConceptoComponent } from './catalogos/concepto/concepto/concepto.component';
import { PartidaComponent } from './catalogos/partidas/partidas/partidas.component';
import { TipoPolizaComponent } from './contabilidad/tipos-polizas/tipo-poliza/tipo-poliza.component';
import { AlmacenComponent } from './inventario/almacen/almacen/almacen.component';
import { ProyectoComponent } from './proyectos/proyecto/proyecto/proyecto.component';
import { SeguridadInterceptorService } from './seguridad/seguridad-interceptor.service';
import { RequisicionComponent } from './compras/requisicion/requisicion/requisicion.component';
import { AutorizadoComponent } from './seguridad/autorizado/autorizado.component';
import { ComprasdirectasComponent } from './compras/compras/comprasdirectas/comprasdirectas.component';
import { RegistroAdminComponent } from './seguridad/registro-admin/registro-admin.component';
import { FormularioAutenticacionComponent } from './seguridad/formulario-autenticacion/formulario-autenticacion.component';
import { LoginComponent } from './seguridad/login/login.component';
import { OrdenCompraComponent } from './compras/orden-compra/orden-compra/orden-compra.component';
import { CotizacionComponent } from './compras/cotizacion/cotizacion/cotizacion.component';
import { ExistenciaComponent } from './inventario/existencia/existencia/existencia.component';
import { AlmacenSalidaComponent } from './inventario/almacenSalida/almacen-salida/almacen-salida.component';
import { AlmacenEntradaComponent } from './inventario/almacenEntrada/almacen-entrada/almacen-entrada.component';
import { PrecioUnitarioComponent } from './proyectos/precio-unitario/precio-unitario/precio-unitario.component';
import { ProgramacionEstimadaComponent } from './proyectos/programacion-estimada/programacion-estimada/programacion-estimada.component';
import { CorporativoComponent } from './catalogos/corporativo/corporativo/corporativo.component';
import { UsuarioMultiEmpresaComponent } from './seguridad/usuario-multi-empresa/usuario-multi-empresa.component';
import { MenusEmpresaComponent } from './seguridad/menusXEmpresa/menus-empresa/menus-empresa.component';
import { UsuarioMultiEmpresaFiltradoComponent } from './seguridad/usuario-multi-empresa-filtrado/usuario-multi-empresa-filtrado.component';
import { ModalRolMultiEmpresaComponent } from './seguridad/rol-multi-empresa/modal-rol-multi-empresa/modal-rol-multi-empresa.component';
import { RolMultiEmpresaComponent } from './seguridad/rol-multi-empresa/rol-multi-empresa.component';
import { ModalUsuarioMultiEmpresaComponent } from './seguridad/usuario-multi-empresa-filtrado/modal-usuario-multi-empresa/modal-usuario-multi-empresa.component';
import { FacturasComponent } from './facturacion/facturas/facturas.component';
import { ClienteComponent } from './contabilidad/cliente/cliente/cliente.component';
import { OrdenCompraWsComponent } from './facturacion/orden-compra-ws/orden-compra-ws.component';
import { DatePipe } from '@angular/common';
import { PolizaComponent } from './contabilidad/poliza/poliza/poliza.component';
import { TreeViewComponent } from './utilidades/tree-view/tree-view.component';
import { BalanazaComprobacionComponent } from './contabilidad/balanza-comprobacion/balanza-comprobacion/balanza-comprobacion.component';
import { RecargaDirective } from './directiva/recarga.directive';
import { EmpresasPropiasComponent } from './seguridad/empresas-propias/empresas-propias.component';
import { ModalUsuarioCorporativoComponent } from './seguridad/usuario-multi-empresa/modal-usuario-corporativo/modal-usuario-corporativo.component';
import { ModalUsuarioProveedorComponent } from './seguridad/usuario-multi-empresa-filtrado/modal-usuario-proveedor/modal-usuario-proveedor.component';
import { PlazasComponent } from './gastos/plazas/plazas/plazas.component';
import { GraficasComponent } from './graficas/graficas/graficas.component';
import { ClaveProductoComponent } from './gastos/clave-producto/clave-producto/clave-producto.component';
import { ClaveProductoModule } from './gastos/clave-producto/clave-producto.module';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { DivisionComponent } from './gastos/division/division/division.component';
import { ModalUsuarioGastosComponent } from './seguridad/usuario-multi-empresa-filtrado/modal-usuario-gastos/modal-usuario-gastos.component';
import { UsuarioContainerComponent } from './gastos/crear-arbol/usuario-container/usuario-container.component';
import { NivelComponent } from './gastos/crear-arbol/nivel/nivel.component';
import { CrearArbolComponent } from './gastos/crear-arbol/crear-arbol/crear-arbol.component';
import { PagosComponent } from './facturacion/pagos/pagos/pagos.component';
import { CentroCostosComponent } from './gastos/centro-costos/centro-costos/centro-costos.component';
import { ConfPlazDivComponent } from './gastos/conf-plaz-div/conf-plaz-div/conf-plaz-div.component';
import { CuentaContableGastosComponent } from './gastos/cuenta-contable/cuenta-contable/cuenta-contableGastos.component';
import { DatosEmpleadoComponent } from './gastos/datos-empleado/datos-empleado/datos-empleado.component';
import { PaginadoComponent } from './utilidades/paginado/paginado.component';
import { CuentaBancariaEmpresaComponent } from './bancos/cuentaBancariaEmpresa/cuenta-bancaria-empresa/cuenta-bancaria-empresa.component';
import { BancoComponent } from './bancos/banco/banco/banco.component';
import { EstimacionesComponent } from './proyectos/estimaciones/estimaciones/estimaciones.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ModalAlertComponent } from './utilidades/modal-alert/modal-alert.component';
import { ContratosComponent } from './proyectos/contratos/contratos/contratos.component';
import { TableContratistasComponent } from './utilidades/contratista/table-contratistas/table-contratistas.component';
import { ModalFormularioComponent } from './utilidades/contratista/modal-formulario/modal-formulario.component';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { TableCuentasBancariasComponent } from './utilidades/contratista/table-cuentas-bancarias/table-cuentas-bancarias.component';
import { TableCuentasContablesComponent } from './utilidades/contratista/table-cuentas-contables/table-cuentas-contables.component';
import { ModalFormularioCuentasBancariasComponent } from './utilidades/contratista/modal-formulario-cuentas-bancarias/modal-formulario-cuentas-bancarias.component';
import { InsumosRequicicionComponent } from './compras/insumos-requicision/insumos-requicicion/insumos-requicicion.component';
import { LeftMenuComponent } from './utilidades/drawer/left-menu/left-menu.component';
import { SidenavService } from './utilidades/drawer/service/sidenav.service';
import { InsumosXcotizacionComponent } from './compras/insumoXCotizacion/insumos-xcotizacion/insumos-xcotizacion.component';
import { CotizacionesComponent } from './compras/cotizacion/cotizaciones/cotizaciones.component';
import { ModalNewRequisicionComponent } from './compras/requisicion/modal-new-requisicion/modal-new-requisicion.component';
import { OrdenesComprasComponent } from './compras/orden-compra/ordenes-compras/ordenes-compras.component';
import { InsumosXordenCompraComponent } from './compras/orden-compra/insumos-xorden-compra/insumos-xorden-compra.component';
import { AlmacenesEntradasComponent } from './inventario/almacenEntrada/almacenes-entradas/almacenes-entradas.component';
import { AlmaceneEntradaInsumosComponent } from './inventario/almacenEntrada/almacene-entrada-insumos/almacene-entrada-insumos.component';
import { DialogNewInsumoComponent } from './catalogos/tipo-insumo/dialog-new-insumo/dialog-new-insumo.component';
import { DialogNewFamilyComponent } from './catalogos/familia-insumo/dialog-new-family/dialog-new-family.component';
import { DialoNewInsumoComponent } from './catalogos/insumo/dialo-new-insumo/dialo-new-insumo.component';
import { DialoNewConceptoComponent } from './catalogos/concepto/dialo-new-concepto/dialo-new-concepto.component';
import { DialogNewEspecialidadComponent } from './catalogos/especialidades/dialog-new-especialidad/dialog-new-especialidad.component';
import { DialogNewRubroComponent } from './contabilidad/rubro/dialog-new-rubro/dialog-new-rubro.component';
import { DialogNewProyectoComponent } from './proyectos/proyecto/dialog-new-proyecto/dialog-new-proyecto.component';
import { DialogFSRComponent } from './proyectos/precio-unitario/dialog-fsr/dialog-fsr.component';
import { DialogExplosionInsumosComponent } from './proyectos/precio-unitario/dialog-explosion-insumos/dialog-explosion-insumos.component';
import { DetallesExistenciaComponent } from './inventario/existencia/detalles-existencia/detalles-existencia.component';
import { AlmacenesSalidasComponent } from './inventario/almacenSalida/almacenes-salidas/almacenes-salidas.component';
import { AlmacenSalidaInsumosComponent } from './inventario/almacenSalida/almacen-salida-insumos/almacen-salida-insumos.component';
import { AjusteEntradaAlmacenComponent } from './inventario/almacenEntrada/ajuste-entrada-almacen/ajuste-entrada-almacen.component';
import { DevolucionPrestamosComponent } from './inventario/almacenEntrada/devolucion-prestamos/devolucion-prestamos.component';
import { FacturasTeckioComponent } from './facturacionTeckio/facturas-teckio/facturas-teckio.component';
import { CuentabancariaComponent } from './bancos/cuentabancaria/cuentabancaria/cuentabancaria.component';
import { CuentabancariaClienteComponent } from './bancos/cuentabancaria/cuentabancaria-cliente/cuentabancaria-cliente/cuentabancaria-cliente.component';
import { CuentabancariaContratistaComponent } from './bancos/cuentabancaria/cuentabancaria-contratista/cuentabancaria-contratista/cuentabancaria-contratista.component';
import { CuentabancariaEmpresaComponent } from './bancos/cuentabancaria/cuentabancaria-empresa/cuentabancaria-empresa/cuentabancaria-empresa.component';
import { CuentasBancariasContratistaComponent } from './bancos/cuentabancaria/cuentabancaria-contratista/cuentas-bancarias-contratista/cuentas-bancarias-contratista.component';
import { ClientesComponent } from './catalogos/cliente/clientes/clientes.component';
import { ClienteNuevoComponent } from './catalogos/cliente/cliente-nuevo/cliente-nuevo.component';
import { EmpresasComponent } from './catalogos/empresas/empresas/empresas.component';
import { ModalCorporativoComponent } from './catalogos/corporativo/modal-corporativo/modal-corporativo.component';
import { ModalUsuarioBaseComponent } from './seguridad/usuario-multi-empresa-filtrado/modal-usuario-base/modal-usuario-base.component';
import { NuevoMovimientoBancarioComponent } from './bancos/movimiento-bancario/nuevo-movimiento-bancario/nuevo-movimiento-bancario.component';
import { MovimientoBancarioComponent } from './bancos/movimiento-bancario/movimiento-bancario/movimiento-bancario.component';
import { EditCompaniesComponent } from './catalogos/empresas/acciones/edit-companies/edit-companies.component';
import { CambiarContraseniaUsuarioComponent } from './seguridad/cambiar-contrasenia-usuario/cambiar-contrasenia-usuario.component';
import { ReportesComponent } from './proyectos/reportes/reportes/reportes.component';
import { DestajoComponent } from './proyectos/reportes/destajo/destajo.component';
import { AcumuladoComponent } from './proyectos/reportes/acumulado/acumulado.component';
import { TotalDestajoComponent } from './proyectos/reportes/total-destajo/total-destajo.component';
import { ResumenEstimacionesComponent } from './proyectos/reportes/resumen-estimaciones/resumen-estimaciones.component';
import { TableEstimacionesComponent } from './proyectos/reportes/resumen-estimaciones/table-estimaciones/table-estimaciones.component';
import { AddCuentaContableComponent } from './contabilidad/cuenta-contable/cuenta-contable/accions/add-cuenta-contable/add-cuenta-contable.component';
import { ConfiguracionCuentaContableModalComponent } from './catalogos/contratista/configuracion-cuenta-contable-modal/configuracion-cuenta-contable-modal.component';
import { ConjuntoIndirectosComponent } from './proyectos/conjunto-indirectos/conjunto-indirectos/conjunto-indirectos.component';
import { IndirectosComponent } from './proyectos/indirectos/indirectos/indirectos.component';
import { NewPolizaComponent } from './contabilidad/poliza/poliza/acciones/new-poliza/new-poliza.component';
import { GanttComponentNG } from './gantt/ganttComponentNG';
import { IndirectosConceptoComponent } from './proyectos/indirectos-concepto/indirectos-concepto/indirectos-concepto.component';
import { EmpleadosComponent } from './seguridad/empleado/empleados/empleados.component';
import { ModalEmpleadoComponent } from './seguridad/empleado/modal-empleado/modal-empleado.component';
import { ModalTablaEmpleadosComponent } from './seguridad/empleado/modal-tabla-empleados/modal-tabla-empleados.component';
import { ModalEmpleadoPrecioUnitarioComponent } from './seguridad/empleado/modal-empleado-precio-unitario/modal-empleado-precio-unitario.component';
import { TablaEmpleadoPrecioUnitarioComponent } from './seguridad/empleado/tabla-empleado-precio-unitario/tabla-empleado-precio-unitario.component';
import { ModalContratistaCuentascontablesComponent } from './catalogos/contratista/modal-contratista-cuentascontables/modal-contratista-cuentascontables.component';
import { ModalClienteCuentascontablesComponent } from './catalogos/cliente/modal-cliente-cuentascontables/modal-cliente-cuentascontables.component';
import { AlertComponent } from './utilidades/alert/alert.component';
import { OrdenCompraModule } from './compras/orden-compra/orden-compra.module';
import { FacturaDetalleComponent } from './facturacionTeckio/facturas-teckio/factura-detalle/factura-detalle.component';
import { FacturaComplementoPagoComponent } from './facturacionTeckio/facturas-teckio/factura-complemento-pago/factura-complemento-pago.component';
import { ProyectoUsuarioComponent } from './seguridad/usuario-multi-empresa-filtrado/proyecto-usuario/proyecto-usuario/proyecto-usuario.component';
import { PolizaModalComponent } from './contabilidad/poliza/poliza/poliza-modal/poliza-modal.component';
import { ReportesBIComponent } from './proyectos/reportes/reportes-bi/reportes-bi.component';
import { VentasComponent } from './gestion-ventas/ventas/ventas.component';
import { ProductosComponent } from './gestion-ventas/productos/productos.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { PrecioUnitarioModalComponent } from './proyectos/precio-unitario/precio-unitario/precio-unitario-modal/precio-unitario-modal.component';
import { ResumenOrdenesCompraComponent } from './compras/resumen-ordenes-compra/resumen-ordenes-compra.component';
import { LottieModule } from 'ngx-lottie';
import player from 'lottie-web';
import { ModalAsigacionComponent } from './seguridad/usuario-multi-empresa-filtrado/modal-asigacion/modal-asigacion.component';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { ProductosServiciosComponent } from './gestion-ventas/productos-servicios/productos-servicios.component';
import { ImprimirModalComponent } from './proyectos/precio-unitario/precio-unitario/imprimir-modal/imprimir-modal.component';
import { FieldsetModule } from 'primeng/fieldset';
import { A11yModule } from "@angular/cdk/a11y";

export function playerFactory() {
  return player;
}

@NgModule({
  declarations: [
    AppComponent,
    MenuComponent,
    InputImgComponent,
    TipoInsumoComponent,
    ListadoGenericoComponent,
    MostrarErroresComponent,
    FamiliaInsumoComponent,
    InsumoComponent,
    EspecialidadesComponent,
    ContratistaComponent,
    RubroComponent,
    CuentaContableComponent,
    ConceptoComponent,
    PartidaComponent,
    TipoPolizaComponent,
    AlmacenComponent,
    ProyectoComponent,
    RequisicionComponent,
    AutorizadoComponent,
    ComprasdirectasComponent,
    RegistroAdminComponent,
    FormularioAutenticacionComponent,
    LoginComponent,
    OrdenCompraComponent,
    CotizacionComponent,
    ComprasdirectasComponent,
    ExistenciaComponent,
    PrecioUnitarioComponent,
    AlmacenSalidaComponent,
    AlmacenEntradaComponent,
    ProgramacionEstimadaComponent,
    CorporativoComponent,
    MenusEmpresaComponent,
    ModalCorporativoComponent,
    UsuarioMultiEmpresaComponent,
    UsuarioMultiEmpresaFiltradoComponent,
    RolMultiEmpresaComponent,
    ModalRolMultiEmpresaComponent,
    ModalUsuarioMultiEmpresaComponent,
    ClienteComponent,
    FacturasComponent,
    OrdenCompraWsComponent,
    PolizaComponent,
    TreeViewComponent,
    BalanazaComprobacionComponent,
    RecargaDirective,
    PaginadoComponent,
    EmpresasPropiasComponent,
    ModalUsuarioProveedorComponent,
    ModalUsuarioGastosComponent,
    ModalUsuarioCorporativoComponent,
    PlazasComponent,
    GraficasComponent,
    ClaveProductoComponent,
    DivisionComponent,
    UsuarioContainerComponent,
    NivelComponent,
    CrearArbolComponent,
    DatosEmpleadoComponent,
    CentroCostosComponent,
    ConfPlazDivComponent,
    CuentaContableGastosComponent,
    PagosComponent,
    CuentaBancariaEmpresaComponent,
    BancoComponent,
    EstimacionesComponent,
    ModalAlertComponent,
    ContratosComponent,
    TableContratistasComponent,
    ModalFormularioComponent,
    TableCuentasBancariasComponent,
    TableCuentasContablesComponent,
    ModalFormularioCuentasBancariasComponent,
    InsumosRequicicionComponent,
    LeftMenuComponent,
    InsumosXcotizacionComponent,
    CotizacionesComponent,
    ModalNewRequisicionComponent,
    OrdenesComprasComponent,
    InsumosXordenCompraComponent,
    AlmacenesEntradasComponent,
    AlmaceneEntradaInsumosComponent,
    AlmacenesSalidasComponent,
    AlmacenSalidaInsumosComponent,
    DetallesExistenciaComponent,
    AjusteEntradaAlmacenComponent,
    DevolucionPrestamosComponent,
    DialogNewInsumoComponent,
    DialogNewFamilyComponent,
    DialoNewInsumoComponent,
    DialoNewConceptoComponent,
    DialogNewEspecialidadComponent,
    DialogNewRubroComponent,
    DialogNewProyectoComponent,
    DialogFSRComponent,
    DialogExplosionInsumosComponent,
    FacturasTeckioComponent,
    CuentabancariaComponent,
    CuentabancariaClienteComponent,
    CuentabancariaContratistaComponent,
    CuentabancariaEmpresaComponent,
    CuentasBancariasContratistaComponent,
    ClientesComponent,
    ClienteNuevoComponent,
    EmpresasComponent,
    ModalUsuarioBaseComponent,
    MovimientoBancarioComponent,
    NuevoMovimientoBancarioComponent,
    EditCompaniesComponent,
    CambiarContraseniaUsuarioComponent,
    ReportesComponent,
    DestajoComponent,
    AcumuladoComponent,
    TotalDestajoComponent,
    ResumenEstimacionesComponent,
    TableEstimacionesComponent,
    AddCuentaContableComponent,
    ConfiguracionCuentaContableModalComponent,
    ConjuntoIndirectosComponent,
    IndirectosComponent,
    ConfiguracionCuentaContableModalComponent,
    NewPolizaComponent,
    IndirectosConceptoComponent,
    EmpleadosComponent,
    ModalEmpleadoComponent,
    ModalTablaEmpleadosComponent,
    ModalEmpleadoPrecioUnitarioComponent,
    TablaEmpleadoPrecioUnitarioComponent,
    ModalContratistaCuentascontablesComponent,
    ModalClienteCuentascontablesComponent,
    AlertComponent,
    FacturaDetalleComponent,
    FacturaComplementoPagoComponent,
    ProyectoUsuarioComponent,
    PolizaModalComponent,
    ReportesBIComponent,
    VentasComponent,
    ProductosComponent,
    PrecioUnitarioModalComponent,
    ResumenOrdenesCompraComponent,
    ModalAsigacionComponent,
    ProductosServiciosComponent,
    ImprimirModalComponent,
  ],

  imports: [
    MatTooltipModule,
    LottieModule.forRoot({ player: playerFactory }),
    BrowserModule,
    BrowserAnimationsModule,
    MaterialModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    AppRoutingModule,
    SweetAlert2Module.forRoot(),
    ClaveProductoModule,
    DragDropModule,
    NgbModule,
    NgbTooltipModule,
    GanttComponentNG,
    OrdenCompraModule,
    ScrollingModule,
    FieldsetModule,
    A11yModule
],
  exports: [LeftMenuComponent],
  providers: [
    SidenavService,
    DatePipe,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: SeguridadInterceptorService,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
