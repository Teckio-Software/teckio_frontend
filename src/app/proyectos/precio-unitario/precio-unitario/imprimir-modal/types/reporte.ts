import { proyectoDTO } from 'src/app/proyectos/proyecto/tsProyecto';
import { precioUnitarioDTO } from '../../../tsPrecioUnitario';

export interface Reporte {
  precioUnitario: precioUnitarioDTO[];
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
}
