import apiClient from './apiClient';

import type {
  ReporteFinancieroMensualFiltros,
  ReporteResumenResponse,
  ReporteDetalleResponse
} from '../types/reporte';

const validarFiltros = (filtros: ReporteFinancieroMensualFiltros) => {
  if (!filtros.anio) {
    throw new Error('El año es obligatorio.');
  }

  if (!filtros.mes) {
    throw new Error('El mes es obligatorio.');
  }

  const anio = Number(filtros.anio);
  const mes = Number(filtros.mes);

  if (Number.isNaN(anio)) {
    throw new Error('El año debe ser numérico.');
  }

  if (Number.isNaN(mes)) {
    throw new Error('El mes debe ser numérico.');
  }

  if (mes < 1 || mes > 12) {
    throw new Error('El mes debe estar entre 1 y 12.');
  }

  return {
    anio,
    mes
  };
};

export const obtenerReporteFinancieroMensual = async (
  filtros: ReporteFinancieroMensualFiltros
) => {
  const filtrosValidados = validarFiltros(filtros);

  const response = await apiClient.get<ReporteResumenResponse>(
    '/reportes/financiero-mensual',
    {
      params: filtrosValidados
    }
  );

  return response.data.data;
};

export const obtenerDetalleMovimientosMensuales = async (
  filtros: ReporteFinancieroMensualFiltros
) => {
  const filtrosValidados = validarFiltros(filtros);

  const response = await apiClient.get<ReporteDetalleResponse>(
    '/reportes/financiero-mensual/detalle',
    {
      params: filtrosValidados
    }
  );

  return response.data.data;
};