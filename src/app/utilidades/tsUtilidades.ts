export function toBase64(zFile: File) {
  //Una promera en javascript es una función que termina su ejecución en el futuro.
  return new Promise((zvResolve, zvReject) => {
    const zvReader = new FileReader();
    zvReader.readAsDataURL(zFile);
    zvReader.onload = () => zvResolve(zvReader.result);
    zvReader.onerror = (zError) => zvReject(zError);
  });
}

export function parsearErroresAPI(zResponse: any): string[] {
  const zvListaResultados: string[] = [];
  if (zResponse.error) {
    if (typeof zResponse.error === 'string') {
      zvListaResultados.push(zResponse.error);
    } else if (Array.isArray(zResponse.error)) {
      zResponse.error.forEach((zValor: any) => zvListaResultados.push(zValor.description));
    } else {
      //A veces lo que tenemos es un mapa de errores y campos
      const zvMapaErrores = zResponse.error.errors;
      //Transformamos nuestro objeto en un arreglo
      const zvEntradas = Object.entries(zvMapaErrores);
      zvEntradas.forEach((zArreglo: any[]) => {
        const zvCampo = zArreglo[0];
        zArreglo[1].forEach((zMensajeError: any) => {
          //String interpolation
          zvListaResultados.push(`${zvCampo}: ${zMensajeError}`);
        });
      });
    }
  }
  return zvListaResultados;
}

export function formatearFecha(zDate: Date) {
  //Si viene una fecha en un mal formato le damos uno bueno
  zDate = new Date(zDate);
  const zvFormato = new Intl.DateTimeFormat('en', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
  const [{ value: month }, , { value: day }, , { value: year }] = zvFormato.formatToParts(zDate);
  return `${year}-${month}-${day}`;
}

export interface ResponseApi {
  status: boolean;
  msg: string;
  value: any;
}

export interface RespuestaDTO {
  estatus: boolean;
  descripcion: string;
}

export interface Page {
  link: string;
  name: string;
  icon?: string;
  nestedPages?: Page[];
  imageUrl?: string;
  expanded?: boolean;
  permiso?: string[];
}

export const pages: Page[] = [
  {
    name: 'Presupuestos',
    link: '',
    imageUrl: 'assets/ordencompra.svg',
    nestedPages: [
      {
        name: 'Proyectos',
        link: '/proyecto',
        imageUrl: 'assets/proyectos.svg',
        permiso: [''],
      },
      {
        name: 'Precio Unitario',
        link: '/preciounitario',
        imageUrl: 'assets/preciounitario.svg',
        permiso: [''],
        // SeccionPrecioUnitario
      },
      {
        name: 'Programacion Estimada',
        link: '/programacionestimada',
        imageUrl: 'assets/almacen.svg',
        permiso: [''],
        // SeccionProgramacionEstimada
      },
      {
        name: 'Contratos',
        link: '/contratos',
        imageUrl: 'assets/contratista.svg',
        permiso: [''],
        //SeccionContrato
      },
      {
        name: 'Reportes',
        link: '/reportes',
        imageUrl: 'assets/facturas.svg',
        permiso: [''],
        //SeccionAvanceObra
      },
      {
        name: 'Avance de obra',
        link: '/estimaciones',
        imageUrl: 'assets/estimada.svg',
        permiso: [''],
        //SeccionAvanceObra
      },
    ],
    expanded: false,
  },
  {
    name: 'Gestión de ventas',
    link: '',
    imageUrl: 'assets/carsetting.png',
    nestedPages: [
      {
        name: 'Ventas',
        link: '/ventas',
        imageUrl: 'assets/cart.png',
        permiso: ['SeccionVenta'],
      },
      // {
      //   name: 'Productos',
      //   link: '/productos',
      //   imageUrl: 'assets/products.png',
      //   permiso: ['SeccionProducto'],
      // },
      {
        name: 'Productos y servicios',
        link: '/productos-y-servicios',
        imageUrl: 'assets/products.png',
        permiso: ['SeccionProducto'],
      },
    ],
    expanded: false,
  },
  {
    name: 'Gestión de compras',
    link: '',
    imageUrl: 'assets/compras.svg',
    nestedPages: [
      {
        name: 'Compras',
        link: '/requisicion',
        imageUrl: 'assets/requisicion.svg',
        permiso: ['SeccionRequisicion'],
      },
      {
        name: 'Ordenes de Compra',
        link: '/resumenOrdenCompra',
        imageUrl: 'assets/requisicion.svg',
        permiso: ['SeccionRequisicion'],
      },
    ],
  },
  {
    name: 'Inventario',
    link: '',
    imageUrl: 'assets/conceptos.svg',
    nestedPages: [
      {
        name: 'Almacén',
        link: '/almacen',
        imageUrl: 'assets/almacen.svg',
        permiso: ['SeccionAlmacen'],
      },
      {
        name: 'Entrada de Almacén',
        link: '/almacenentrada',
        imageUrl: 'assets/salida.svg',
        permiso: ['SeccionEntradaAlmacen'],
      },
      {
        name: 'Existencia en Almacén',
        link: '/existencia',
        imageUrl: 'assets/existencias.svg',
        permiso: ['SeccionExistenciaAlmacen'],
      },
      {
        name: 'Salida Almacén',
        link: '/almacensalida',
        imageUrl: 'assets/salida2.svg',
        permiso: ['SeccionSalidaAlmacen'],
      },
    ],
    expanded: false,
  },
  {
    name: 'Catálogos',
    link: '',
    imageUrl: 'assets/polizas.svg',
    nestedPages: [
      {
        name: 'Familia',
        link: '/familia',
        imageUrl: 'assets/familias.svg',
        permiso: ['SeccionFamilia'],
      },
      {
        name: 'Insumo',
        link: '/insumo',
        imageUrl: 'assets/insumosimple.svg',
        permiso: ['SeccionInsumo'],
      },
      {
        name: 'Concepto',
        link: '/concepto',
        imageUrl: 'assets/conceptos.svg',
        permiso: ['SeccionConcepto'],
      },
      {
        name: 'Especialidad',
        link: '/especialidad',
        imageUrl: 'assets/especialidad.svg',
        permiso: ['SeccionEspecialidad'],
      },
      {
        name: 'Contratista',
        link: '/contratista',
        imageUrl: 'assets/contratista.svg',
        permiso: ['SeccionContratista'],
      },
      {
        name: 'Cliente',
        link: '/cliente',
        imageUrl: 'assets/clientes.svg',
        permiso: ['SeccionCliente'],
      },
    ],
    expanded: false,
  },
  {
    name: 'Contabilidad',
    link: '',
    imageUrl: 'assets/cuentaContable.svg',
    nestedPages: [
      {
        name: 'Rubro',
        link: '/rubro',
        imageUrl: 'assets/rubro.svg',
        permiso: ['SeccionRubro'],
      },
      {
        name: 'Tipo de Poliza',
        link: '/tipopoliza',
        imageUrl: 'assets/tipo-poliza.svg',
        permiso: ['SeccionTipoPoliza'],
      },
      {
        name: 'Cuenta Contable',
        link: '/cuentacontable',
        imageUrl: 'assets/cuentaContable.svg',
        permiso: ['SeccionCuentaContable'],
      },
      {
        name: 'Clientes',
        link: '/cliente',
        imageUrl: 'assets/clientes.svg',
        permiso: ['SeccionCliente'],
      },
      {
        name: 'Poliza',
        link: '/poliza',
        imageUrl: 'assets/Poliza.svg',
        permiso: ['SeccionPoliza'],
      },
      {
        name: 'Balanza de Comporación',
        link: '/balanza',
        imageUrl: 'assets/balanza-comprobacion.svg',
        permiso: ['SeccionBalanzaComprobacion'],
      },
      {
        name: 'Bancos',
        link: '/bancos',
        imageUrl: 'assets/facturas.svg',
        permiso: ['SeccionBancos'],
      },

      {
        name: 'Cuenta Bancaria',
        link: '/cuentabancaria',
        imageUrl: 'assets/cuenta-bancaria.svg',
        permiso: ['SeccionCuentaBancaria'],
      },
      {
        name: 'Movimiento Bancario',
        link: '/movimientobancario',
        imageUrl: 'assets/movimiento-bancario.png',
        permiso: ['SeccionMovimientoBancario'],
      },
      {
        name: 'Facturas',
        link: '/facturasTeckio',
        imageUrl: 'assets/facturas.svg',
        permiso: ['SeccionFacturas'],
      },
    ],
    expanded: false,
  },
  {
    name: 'Administración',
    link: '',
    imageUrl: 'assets/users-s.svg',

    nestedPages: [
      {
        name: 'Corporativo',
        link: '/corporativo',
        imageUrl: 'assets/corporativos.svg',
        permiso: ['Administrador'],
      },
      {
        name: 'Empresa',
        link: '/empresas',
        imageUrl: 'assets/empresas.svg',
        permiso: ['Administrador'],
      },
      {
        name: 'Usuarios corporativos',
        link: '/usuario-multiempresa',
        imageUrl: 'assets/usuario-corporativo.png',
        permiso: ['Administrador'],
      },
      {
        name: 'Usuarios',
        link: '/usuario-multiempresa-filtrado',
        imageUrl: 'assets/users-s.svg',
        permiso: ['Administrador', 'AdministradorRoles'],
      },
      {
        name: 'Roles',
        link: '/rol-multiempresa',
        imageUrl: 'assets/roles.png',
        permiso: ['Administrador'],
      },
      {
        name: 'Menus',
        link: '/menu-empresa',
        imageUrl: 'assets/menus.png',
        permiso: ['Administrador'],
      },
      {
        name: 'Empleados',
        link: '/empleado',
        imageUrl: 'assets/clientes.svg',
        permiso: ['Administrador'],
      },
    ],
    expanded: false,
  },
  {
    name: 'Documentación',
    link: '',
    imageUrl: 'assets/documentacion.svg',
    expanded: false,
    nestedPages: [
      {
        name: 'Glosario de términos',
        link: '/glosario',
        imageUrl: 'assets/glosario.svg',
        permiso: [''],
      },
    ],
  },
];
