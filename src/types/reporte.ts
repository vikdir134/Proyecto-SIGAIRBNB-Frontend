export interface ReporteFinancieroMensualFiltros {
  anio: number | '';
  mes: number | '';
}

export interface ResumenFinancieroMensual {
  anio: number;
  mes: number;
  total_ingresos: number;
  total_gastos: number;
  balance_neto: number;
  estado_balance: 'POSITIVO' | 'NEGATIVO' | 'NEUTRO';
}

export interface MovimientoMensual {
  movimiento_bancario_id: number;
  fecha_movimiento: string;
  tipo_movimiento: 'INGRESO' | 'GASTO';
  concepto: string;
  descripcion: string | null;
  importe: number;
  referencia_externa: string | null;
  observaciones: string | null;

  categoria: string;
  naturaleza: 'INGRESO' | 'GASTO';

  cuenta_bancaria_id: number;
  nombre_cuenta: string;
  numero_cuenta: string;
  moneda: string;

  banco: string;

  inmueble_id: number | null;
  codigo_inmueble: string | null;
  inmueble: string | null;
}

export interface DetalleMovimientosMensuales {
  anio: number;
  mes: number;
  total_movimientos: number;
  movimientos: MovimientoMensual[];
}

export interface ReporteResumenResponse {
  message: string;
  data: ResumenFinancieroMensual;
}

export interface ReporteDetalleResponse {
  message: string;
  data: DetalleMovimientosMensuales;
}