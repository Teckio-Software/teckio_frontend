import { proyectoDTO } from 'src/app/proyectos/proyecto/tsProyecto';
import { precioUnitarioDTO } from '../../../tsPrecioUnitario';
import { precioUnitarioDetalleDTO } from 'src/app/proyectos/precio-unitario-detalle/tsPrecioUnitarioDetalle';
import { ConjuntoIndirectosDTO } from 'src/app/proyectos/conjunto-indirectos/conjunto-indirectos';
import { IndirectosDTO } from 'src/app/proyectos/indirectos/indirectos';

export interface Reporte {
  precioUnitario: precioUnitarioDTO[];
  detallesPrecioUnitario: precioUnitarioDetalleDTO[];
  titulo: string;
  encabezadoIzq: string;
  encabezadoCentro: string;
  encabezadoDerecha: string;
  margenSuperior: number;
  margenInferior: number;
  margenIzquierdo: number;
  margenDerecho: number;
  importeConLetra: boolean;
  totalConIVA: string;
  totalSinFormato: number;
  totalSinIva: string;
  total: number;
  proyecto: proyectoDTO;
  totalIva: string;
  imprimirImpuesto: boolean;
  imprimirConCostoDirecto: boolean;
  imprimirConPrecioUnitario: boolean;
  imprimirConPrecioUnitarioIVA: boolean;
  imprimirConPUMasIva: boolean;
  indirectos: IndirectosDTO[];
}