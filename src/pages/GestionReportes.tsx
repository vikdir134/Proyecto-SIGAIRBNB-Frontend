import { useMemo, useState } from 'react';

import SidebarGestion from '../components/SidebarGestion';

import {
  obtenerDetalleMovimientosMensuales,
  obtenerReporteFinancieroMensual
} from '../services/reporteService';

import type {
  MovimientoMensual,
  ReporteFinancieroMensualFiltros,
  ResumenFinancieroMensual
} from '../types/reporte';

import '../styles/pages/GestionReporte.css';

const meses = [
  { value: 1, label: 'Enero' },
  { value: 2, label: 'Febrero' },
  { value: 3, label: 'Marzo' },
  { value: 4, label: 'Abril' },
  { value: 5, label: 'Mayo' },
  { value: 6, label: 'Junio' },
  { value: 7, label: 'Julio' },
  { value: 8, label: 'Agosto' },
  { value: 9, label: 'Septiembre' },
  { value: 10, label: 'Octubre' },
  { value: 11, label: 'Noviembre' },
  { value: 12, label: 'Diciembre' }
];

const formatearMoneda = (monto: number) => {
  return new Intl.NumberFormat('es-PE', {
    style: 'currency',
    currency: 'PEN'
  }).format(monto || 0);
};

const formatearFecha = (fecha: string) => {
  if (!fecha) return '-';

  return new Intl.DateTimeFormat('es-PE', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  }).format(new Date(fecha));
};

const obtenerMensajeBalance = (balance: number) => {
  if (balance > 0) return 'Balance positivo';
  if (balance < 0) return 'Balance negativo';
  return 'Balance neutro';
};

const GestionReportes = () => {
  const anioActual = new Date().getFullYear();

  const [filtros, setFiltros] = useState<ReporteFinancieroMensualFiltros>({
    anio: anioActual,
    mes: ''
  });

  const [resumen, setResumen] = useState<ResumenFinancieroMensual | null>(null);
  const [movimientos, setMovimientos] = useState<MovimientoMensual[]>([]);

  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState('');
  const [consultado, setConsultado] = useState(false);

  const filtrosValidos = useMemo(() => {
    if (!filtros.anio || !filtros.mes) return false;

    const anio = Number(filtros.anio);
    const mes = Number(filtros.mes);

    return !Number.isNaN(anio) && !Number.isNaN(mes) && mes >= 1 && mes <= 12;
  }, [filtros]);

  const hayInformacion = useMemo(() => {
    if (!resumen) return false;

    return (
      resumen.total_ingresos > 0 ||
      resumen.total_gastos > 0 ||
      resumen.balance_neto !== 0 ||
      movimientos.length > 0
    );
  }, [resumen, movimientos]);

  const handleFiltroChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = event.target;

    setFiltros((prev) => ({
      ...prev,
      [name]: value === '' ? '' : Number(value)
    }));
  };

  const consultarReporte = async () => {
    if (!filtrosValidos) {
      setError('Complete el año y el mes antes de consultar.');
      return;
    }

    try {
      setCargando(true);
      setError('');
      setConsultado(true);

      const [resumenResponse, detalleResponse] = await Promise.all([
        obtenerReporteFinancieroMensual(filtros),
        obtenerDetalleMovimientosMensuales(filtros)
      ]);

      setResumen(resumenResponse);
      setMovimientos(detalleResponse.movimientos || []);
    } catch (err) {
      console.error('Error al consultar reporte financiero:', err);

      setResumen(null);
      setMovimientos([]);
      setError('No se pudo consultar el reporte financiero mensual.');
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="gestion-reportes-layout">
      <SidebarGestion />

      <main className="gestion-reportes-main">
        <section className="gestion-reportes-header">
          <div>
            <h1>Reporte financiero mensual</h1>
            <p>
              Consulta el resumen consolidado de ingresos, gastos y balance neto
              de un periodo mensual.
            </p>
          </div>
        </section>

        <section className="reportes-card filtros-card">
          <div className="filtros-header">
            <div>
              <h2>Filtros de consulta</h2>
              <p>Seleccione el año y mes que desea revisar.</p>
            </div>
          </div>

          <div className="filtros-grid">
            <div className="form-group">
              <label htmlFor="anio">Año</label>
              <input
                id="anio"
                name="anio"
                type="number"
                min="2000"
                max="2100"
                value={filtros.anio}
                onChange={handleFiltroChange}
                placeholder="Ej. 2026"
              />
            </div>

            <div className="form-group">
              <label htmlFor="mes">Mes</label>
              <select
                id="mes"
                name="mes"
                value={filtros.mes}
                onChange={handleFiltroChange}
              >
                <option value="">Seleccione un mes</option>
                {meses.map((mes) => (
                  <option key={mes.value} value={mes.value}>
                    {mes.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="filtros-actions">
              <button
                type="button"
                className="btn-consultar"
                onClick={consultarReporte}
                disabled={!filtrosValidos || cargando}
              >
                {cargando ? 'Consultando...' : 'Consultar'}
              </button>
            </div>
          </div>

          {!filtrosValidos && (
            <p className="validacion-filtros">
              Complete el año y seleccione un mes válido para consultar.
            </p>
          )}

          {error && <p className="mensaje-error">{error}</p>}
        </section>

        {cargando && (
          <section className="reportes-card estado-card">
            <p>Cargando reporte financiero mensual...</p>
          </section>
        )}

        {!cargando && resumen && (
          <section className="resumen-grid">
            <article className="resumen-card ingresos-card">
              <p>Total de ingresos</p>
              <h3>{formatearMoneda(resumen.total_ingresos)}</h3>
            </article>

            <article className="resumen-card gastos-card">
              <p>Total de gastos</p>
              <h3>{formatearMoneda(resumen.total_gastos)}</h3>
            </article>

            <article
              className={`resumen-card balance-card ${
                resumen.balance_neto > 0
                  ? 'balance-positivo'
                  : resumen.balance_neto < 0
                    ? 'balance-negativo'
                    : 'balance-neutro'
              }`}
            >
              <p>{obtenerMensajeBalance(resumen.balance_neto)}</p>
              <h3>{formatearMoneda(resumen.balance_neto)}</h3>
            </article>
          </section>
        )}

        {!cargando && consultado && resumen && !hayInformacion && (
          <section className="reportes-card estado-card">
            <h3>No hay información para el periodo seleccionado</h3>
            <p>
              No se encontraron movimientos bancarios para el año y mes
              consultados. El sistema muestra los valores consolidados en cero.
            </p>
          </section>
        )}

        {!cargando && resumen && (
          <section className="reportes-card tabla-card">
            <div className="tabla-header">
              <div>
                <h2>Tabla de movimientos del mes</h2>
                <p>
                  Detalle de ingresos y gastos registrados en movimientos
                  bancarios.
                </p>
              </div>
            </div>

            {movimientos.length === 0 ? (
              <div className="tabla-vacia">
                No existen movimientos para el periodo seleccionado.
              </div>
            ) : (
              <div className="tabla-responsive">
                <table className="tabla-movimientos">
                  <thead>
                    <tr>
                      <th>Fecha</th>
                      <th>Tipo</th>
                      <th>Categoría</th>
                      <th>Concepto</th>
                      <th>Cuenta</th>
                      <th>Inmueble</th>
                      <th className="text-right">Importe</th>
                    </tr>
                  </thead>

                  <tbody>
                    {movimientos.map((movimiento) => (
                      <tr key={movimiento.movimiento_bancario_id}>
                        <td>{formatearFecha(movimiento.fecha_movimiento)}</td>

                        <td>
                          <span
                            className={`badge-movimiento ${
                              movimiento.tipo_movimiento === 'INGRESO'
                                ? 'badge-ingreso'
                                : 'badge-gasto'
                            }`}
                          >
                            {movimiento.tipo_movimiento}
                          </span>
                        </td>

                        <td>{movimiento.categoria}</td>

                        <td>
                          <strong>{movimiento.concepto}</strong>
                          {movimiento.descripcion && (
                            <span className="descripcion-movimiento">
                              {movimiento.descripcion}
                            </span>
                          )}
                        </td>

                        <td>
                          <span>{movimiento.banco}</span>
                          <small>{movimiento.nombre_cuenta}</small>
                        </td>

                        <td>
                          {movimiento.inmueble ? (
                            <>
                              <span>{movimiento.inmueble}</span>
                              <small>{movimiento.codigo_inmueble}</small>
                            </>
                          ) : (
                            '-'
                          )}
                        </td>

                        <td className="text-right">
                          {formatearMoneda(Number(movimiento.importe))}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        )}
      </main>
    </div>
  );
};

export default GestionReportes;