export interface InsumoDTO{
  id: number;
  idProyecto: number;
  descripcion: string;
  unidad: string;
  codigo: string;
  idTipoInsumo: number;
  idFamiliaInsumo: number;
  descripcionTipoInsumo: string;
  descripcionFamiliaInsumo: string;
  costoUnitario: number;
  costoBase: number;
  esFsrGlobal : boolean
}

export interface InsumoFormDTO{
  id: number;
  idProyecto: number;
  descripcion: string;
  unidad: string;
  codigo: string;
  idTipoInsumo: number;
  idFamiliaInsumo: number;
  costoUnitario: number;
}

export interface InsumoCreacionDTO{
  idProyecto: number;
  descripcion: string;
  unidad: string;
  codigo: string;
  idTipoInsumo: number;
  idFamiliaInsumo: number;
  costoUnitario: number;
}

export interface InsumoParaExplosionDTO extends InsumoDTO{
  cantidad: number;
  importe: number;
  costoUnitarioConFormato: string;
  costoBaseConFormato: string;
  seEstaEditandoCostoBase: boolean;
  cantidadConFormato: string;
  importeConFormato: string;
}