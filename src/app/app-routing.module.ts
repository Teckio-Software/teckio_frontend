import { ReportesRoutingModule } from './proyectos/reportes/reportes-routing.module';
import { GlosarioRoutingModule } from './documentacion/glosario/glosario-routing.module';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';

const routes: Routes = [
  { path: '', component: DashboardComponent },
  {
    path: 'corporativo',
    loadChildren: () =>
      import(`./catalogos/corporativo/corporativo.module`).then(
        (module) => module.CorporativoModule,
      ),
  },
  {
    path: 'empresas',
    loadChildren: () =>
      import(`./catalogos/empresas/empresas.module`).then((module) => module.EmpresasModule),
  },
  {
    path: 'familia',
    loadChildren: () =>
      import(`./catalogos/familia-insumo/familia-insumo.module`).then(
        (module) => module.FamiliaInsumoModule,
      ),
  },
  {
    path: 'tipoinsumo',
    loadChildren: () =>
      import(`./catalogos/tipo-insumo/tipo-insumo.module`).then(
        (module) => module.TipoInsumoModule,
      ),
  },
  {
    path: 'insumo',
    loadChildren: () =>
      import(`./catalogos/insumo/insumo.module`).then((module) => module.InsumoModule),
  },
  {
    path: 'especialidad',
    loadChildren: () =>
      import(`./catalogos/especialidades/especialidades.module`).then(
        (module) => module.EspecialidadesModule,
      ),
  },
  {
    path: 'contratista',
    loadChildren: () =>
      import(`./catalogos/contratista/contratista.module`).then(
        (module) => module.ContratistaModule,
      ),
  },
  {
    path: 'cliente',
    loadChildren: () =>
      import(`./catalogos/cliente/clientes.module`).then((module) => module.ClientesModule),
  },
  {
    path: 'rubro',
    loadChildren: () =>
      import(`./contabilidad/rubro/rubro.module`).then((module) => module.RubroModule),
  },
  {
    path: 'cuentacontable',
    loadChildren: () =>
      import(`./contabilidad/cuenta-contable/cuenta-contable.module`).then(
        (module) => module.CuentaContableModule,
      ),
  },
  {
    path: 'concepto',
    loadChildren: () =>
      import(`./catalogos/concepto/concepto.module`).then((module) => module.ConceptoModule),
  },
  {
    path: 'tipopoliza',
    loadChildren: () =>
      import(`./contabilidad/tipos-polizas/tipo-poliza.module`).then(
        (module) => module.TipoPolizaModule,
      ),
  },
  {
    path: 'almacen',
    loadChildren: () =>
      import(`./inventario/almacen/almacen.module`).then((module) => module.AlmacenModule),
  },
  {
    path: 'proyecto',
    loadChildren: () =>
      import(`./proyectos/proyecto/proyecto.module`).then((module) => module.ProyectoModule),
  },
  {
    path: 'menu-empresa',
    loadChildren: () =>
      import(`./seguridad/menusXEmpresa/module/module.module`).then(
        (module) => module.ModuleModule,
      ),
  },
  {
    path: 'rol-multiempresa',
    loadChildren: () =>
      import(`./seguridad/rol-multi-empresa/module/module.module`).then(
        (module) => module.ModuleModule,
      ),
  },
  {
    path: 'usuario-multiempresa',
    loadChildren: () =>
      import(`./seguridad/usuario-multi-empresa/module/module.module`).then(
        (module) => module.ModuleModule,
      ),
  },
  {
    path: 'usuario-multiempresa-filtrado',
    loadChildren: () =>
      import(`./seguridad/usuario-multi-empresa-filtrado/module/module.module`).then(
        (module) => module.ModuleModule,
      ),
  },
  {
    path: 'empleado',
    loadChildren: () =>
      import(`./seguridad/empleado/empleados-module/empleados-module.module`).then(
        (module) => module.EmpleadosModuleModule,
      ),
  },
  {
    path: 'explosioninsumos',
    loadChildren: () =>
      import(`./proyectos/precio-unitario/precio-unitario.module`).then(
        (module) => module.PrecioUnitarioModule,
      ),
  },
  {
    path: 'requisicion',
    loadChildren: () =>
      import(`./compras/requisicion/requisicion.module`).then((module) => module.RequisicionModule),
  },
  {
    path: 'resumenOrdenCompra',
    loadChildren: () =>
      import(`./compras/resumen-ordenes-compra/resumen-ordenes-compra.module`).then(
        (module) => module.ResumenOrdenesCompraModule,
      ),
  },
  {
    path: 'ordencompra',
    loadChildren: () =>
      import(`./compras/orden-compra/orden-compra.module`).then(
        (module) => module.OrdenCompraModule,
      ),
  },
  {
    path: 'cotizacion',
    loadChildren: () =>
      import(`./compras/cotizacion/cotizacion.module`).then((module) => module.CotizacionModule),
  },
  {
    path: 'compradirecta',
    loadChildren: () =>
      import(`./compras/compras/comprasdirectas.module`).then(
        (module) => module.ComprasdirectasModule,
      ),
  },
  {
    path: 'almacenentrada',
    loadChildren: () =>
      import(`./inventario/almacenEntrada/almacen-entrada.module`).then(
        (module) => module.AlmacenEntradaModule,
      ),
  },
  {
    path: 'existencia',
    loadChildren: () =>
      import(`./inventario/existencia/existencia.module`).then((module) => module.ExistenciaModule),
  },
  {
    path: 'almacensalida',
    loadChildren: () =>
      import(`./inventario/almacenSalida/almacen-salida.module`).then(
        (module) => module.AlmacenSalidaModule,
      ),
  },
  {
    path: 'preciounitario',
    loadChildren: () =>
      import(`./proyectos/precio-unitario/precio-unitario.module`).then(
        (module) => module.PrecioUnitarioModule,
      ),
  },
  {
    path: 'indirectos',
    loadChildren: () =>
      import(`./proyectos/indirectos/indirectos.module`).then((module) => module.IndirectosModule),
  },
  {
    path: 'cliente',
    loadChildren: () =>
      import(`./contabilidad/cliente/cliente.module`).then((module) => module.ClienteModule),
  },
  {
    path: 'facturas',
    loadChildren: () =>
      import(`./facturacion/facturas-module/facturas-module.module`).then(
        (module) => module.FacturasModuleModule,
      ),
  },
  {
    path: 'orden-compra-ws',
    loadChildren: () =>
      import(`./facturacion/orden-compra-ws/orden-compra-ws/orden-compra-ws.module`).then(
        (module) => module.OrdenCompraWsModule,
      ),
  },
  {
    path: 'poliza',
    loadChildren: () =>
      import(`./contabilidad/poliza/poliza.module`).then((module) => module.PolizaModule),
  },
  {
    path: 'balanza',
    loadChildren: () =>
      import(`./contabilidad/balanza-comprobacion/balanza-comprobacion.module`).then(
        (module) => module.BalanzaComprobacionModule,
      ),
  },
  {
    path: 'division',
    loadChildren: () =>
      import(`./gastos/division/division.module`).then((module) => module.DivisionModule),
  },
  {
    path: 'plazas',
    loadChildren: () =>
      import(`./gastos/plazas/plazas.module`).then((module) => module.PlazasModule),
  },
  {
    path: 'cuenta-contable',
    loadChildren: () =>
      import(`./gastos/cuenta-contable/cuenta-contableGastos.module`).then(
        (module) => module.CuentaContableGastosModule,
      ),
  },
  {
    path: 'centro-costos',
    loadChildren: () =>
      import(`./gastos/centro-costos/centro-costos.module`).then(
        (module) => module.CentroCostoModule,
      ),
  },
  {
    path: 'clave-producto',
    loadChildren: () =>
      import(`./gastos/clave-producto/clave-producto.module`).then(
        (module) => module.ClaveProductoModule,
      ),
  },
  {
    path: 'datos-empleado',
    loadChildren: () =>
      import(`./gastos/datos-empleado/datos-empleado.module`).then(
        (module) => module.DatosEmpleadoModule,
      ),
  },
  {
    path: 'graficas',
    loadChildren: () =>
      import(`./graficas/graficas/graficas.module`).then((module) => module.GraficasModule),
  },
  {
    path: 'crear-arbol',
    loadChildren: () =>
      import(`./gastos/crear-arbol/crear-arbol.module`).then(
        (module) => module.CrearArbolComponentModule,
      ),
  },
  {
    path: 'conf-costos',
    loadChildren: () =>
      import(`./gastos/conf-centro-costos/conf-centro-costos.module`).then(
        (module) => module.ConfCentroCostosComponentModule,
      ),
  },
  {
    path: 'conf-contable',
    loadChildren: () =>
      import(`./gastos/conf-cuenta-contable/conf-cuenta-contable.module`).then(
        (module) => module.ConfCuentaContableModule,
      ),
  },
  {
    path: 'conf-divisiones-plazas',
    loadChildren: () =>
      import(`./gastos/conf-plaz-div/conf-plaz-div.module`).then(
        (module) => module.ConfPlazDivModule,
      ),
  },
  {
    path: 'pagos',
    loadChildren: () =>
      import(`./facturacion/pagos/pagos.module`).then((module) => module.PagosModule),
  },
  {
    path: 'programacionestimada',
    loadChildren: () =>
      import(`./proyectos/programacion-estimada/programacion-estimada.module`).then(
        (module) => module.ProgramacionEstimadaModule,
      ),
  },
  {
    path: 'bancos',
    loadChildren: () => import(`./bancos/banco/banco.module`).then((module) => module.BancoModule),
  },
  {
    path: 'cuentasbancarias',
    loadChildren: () =>
      import(`./bancos/cuentaBancariaEmpresa/cuenta-bancaria-empresa.module`).then(
        (module) => module.CuentaBancariaEmpresaModule,
      ),
  },
  {
    path: 'cuentabancaria',
    loadChildren: () =>
      import(`./bancos/cuentabancaria/cuentabancaria-module.module`).then(
        (module) => module.CuentabancariaModuleModule,
      ),
  },
  {
    path: 'movimientobancario',
    loadChildren: () =>
      import(`./bancos/movimiento-bancario/movimiento-bancario.module`).then(
        (module) => module.MovimientoBancarioModule,
      ),
  },
  {
    path: 'estimaciones',
    loadChildren: () =>
      import(`./proyectos/estimaciones/estimaciones.module`).then(
        (module) => module.EstimacionesModule,
      ),
  },
  {
    path: 'contratos',
    loadChildren: () =>
      import(`./proyectos/contratos/contratos.module`).then((module) => module.ContratosModule),
  },
  {
    path: 'destajos',
    loadChildren: () =>
      import(`./proyectos/reportes/reportes.module`).then((module) => module.ReportesModule),
  },
  {
    path: 'subcontratos',
    loadChildren: () =>
      import(`./proyectos/reportes-subcontratos/reportes-subcontratos.module`).then(
        (module) => module.ReportesSubcontratosModule
      ),
  },
  {
    path: 'facturasTeckio',
    loadChildren: () =>
      import(`./facturacionTeckio/facturas-module.module`).then(
        (module) => module.FacturasModuleModule,
      ),
  },
  {
    path: 'ventas',
    loadChildren: () =>
      import(`./gestion-ventas/ventas/ventas.module`).then((module) => module.VentasModule),
  },
  {
    path: 'productos',
    loadChildren: () =>
      import(`./gestion-ventas/productos/productos.module`).then(
        (module) => module.ProductosModule,
      ),
  },
  {
    path: 'ventas',
    loadChildren: () =>
      import(`./gestion-ventas/ventas/ventas.module`).then((module) => module.VentasModule),
  },
  {
    path: 'productos-y-servicios',
    loadChildren: () =>
      import(
        `./gestion-ventas/productos-servicios/productos-servicios.module`
      ).then((module) => module.ProductosServiciosModule),
  },
  {

    path: 'auditorias',
    loadChildren: () =>
      import(`./seguridad/auditorias/auditorias.module`).then(
        (module) => module.AuditoriasModule
      ),
  },
  {
    path: 'auditorias',
    loadChildren: () =>
      import(`./seguridad/auditorias/auditorias.module`).then((module) => module.AuditoriasModule),
  },
  {
    path: 'glosario',
    loadChildren: () =>
      import(`./documentacion/glosario/glosario.module`).then((module) => module.GlosarioModule),
  },
  {
    path: 'cuentas-por-cobrar',
    loadChildren: () =>
      import(`./contabilidad/cuentas-por-cobrar/cuentas-por-cobrar.module`).then(
        (module) => module.CuentasPorCobrarModule,
      ),
  },
  {path: 'imagenes',
    loadChildren: () =>
      import(`./seguridad/imagenes/imagenes.module`).then(
        (module) => module.ImagenesModule
      ),
  },
  {
    path: 'almacentraspaso',
    loadChildren: () =>
      import(`./inventario/almacenTranspaso/almacen-transpaso.module`).then(
        (module) => module.AlmacenTranspasoModule
      ),
  },

  { path: '**', redirectTo: '' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
