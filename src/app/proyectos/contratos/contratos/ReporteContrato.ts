import { contratoDTO, detalleXContratoParaTablaDTO } from "../tsContratos";

export interface ReporteContratoDTO {
  contrato: contratoDTO;
  detallesContrato: detalleXContratoParaTablaDTO[];
  titulo: string;
  encabezadoIzq: string;
  encabezadoCentro: string;
  encabezadoDerecha: string;
  margenSuperior: number;
  margenInferior: number;
  margenIzquierdo: number;
  margenDerecho: number;
  tipoContrato : string;
  contratista : string;
}
