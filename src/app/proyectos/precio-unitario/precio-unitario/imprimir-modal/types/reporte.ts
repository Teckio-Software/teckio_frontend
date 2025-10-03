import { proyectoDTO } from 'src/app/proyectos/proyecto/tsProyecto';
import { precioUnitarioDTO } from '../../../tsPrecioUnitario';
import { precioUnitarioDetalleDTO } from 'src/app/proyectos/precio-unitario-detalle/tsPrecioUnitarioDetalle';

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
  proyecto: proyectoDTO;
  totalIva: string;
  imprimirImpuesto: boolean;
  imprimirConCostoDirecto: boolean;
  imprimirConPrecioUnitario: boolean;
  imprimirConPUMasIva: boolean;
}
