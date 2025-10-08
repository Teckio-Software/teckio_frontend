export interface RequisicionDTO {
  id: number;
  idProyecto: number | null;
  noRequisicion: string;
  personaSolicitante: string;
  observaciones: string | null;
  fechaRegistro: string;
  estatusRequisicion: number;
  estatusInsumosComprados: number;
  estatusInsumosCompradosDescripcion: string;
  estatusInsumosSurtIdos: number;
  estatusInsumosSurtIdosDescripcion: string;
  residente: string | null;
  idProduccion: number | null;
}
