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

export interface DashboardKpisResumen {
  total_ingresos: number;
  total_gastos: number;
  balance_neto: number;
  margen_rentabilidad: number;
  ocupacion_general: number;
  dias_ocupados: number;
  dias_disponibles: number;
  recibos_pendientes: number;
  cantidad_recibos_pendientes: number;
  recibos_vencidos: number;
  reservas_activas: number;
}

export interface RentabilidadMensual {
  anio: number;
  mes: number;
  periodo: string;
  ingresos: number;
  gastos: number;
  utilidad: number;
}

export interface UtilidadPorInmueble {
  inmueble_id: number;
  codigo_inmueble: string;
  inmueble: string;
  ingresos: number;
  gastos: number;
  utilidad: number;
}

export interface OcupacionPorInmueble {
  inmueble_id: number;
  codigo_inmueble: string;
  inmueble: string;
  dias_ocupados: number;
  dias_disponibles: number;
  ocupacion: number;
}

export interface ReciboPendientePorInmueble {
  inmueble_id: number;
  codigo_inmueble: string;
  inmueble: string;
  cantidad_recibos_pendientes: number;
  monto_pendiente: number;
}

export interface DistribucionIngresosGastos {
  categoria: string;
  monto: number;
}

export interface AlertaDashboardKpis {
tipo: 'INFO' | 'ADVERTENCIA' | 'CRITICO';
  mensaje: string;
}

export interface DashboardKpisData {
  anio: number;
  mes: number;
  periodo_nombre: string;
  fecha_ultima_actualizacion: string;
estado_dashboard: 'SALUDABLE' | 'ATENCION' | 'CRITICO' | 'NEUTRO';
  tiene_datos: boolean;
  resumen: DashboardKpisResumen;
  rentabilidad_mensual: RentabilidadMensual[];
  utilidad_por_inmueble: UtilidadPorInmueble[];
  ocupacion_por_inmueble: OcupacionPorInmueble[];
  recibos_pendientes_por_inmueble: ReciboPendientePorInmueble[];
  distribucion_ingresos_gastos: DistribucionIngresosGastos[];
  alertas: AlertaDashboardKpis[];
}

export interface DashboardKpisResponse {
  message: string;
  data: DashboardKpisData;
}