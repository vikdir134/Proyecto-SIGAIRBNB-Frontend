import { describe, test, expect, vi, beforeEach } from 'vitest';
import apiClient from './apiClient';
import {
    confirmarCheckinReservaGestion,
    confirmarCheckoutReservaGestion
} from './reservaService';

vi.mock('./apiClient', () => ({
    default: {
        patch: vi.fn()
    }
}));

describe('HU12 - reservaService', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    test('HU12-FE-SERVICE-01: Debe llamar al endpoint de check-in', async () => {
        vi.mocked(apiClient.patch).mockResolvedValue({
            data: {
                mensaje: 'Check-in confirmado correctamente',
                reserva: {
                    reserva_id: 15,
                    estado_reserva: 'ACTIVA'
                },
                evento: {
                    reserva_evento_id: 100,
                    reserva_id: 15,
                    usuario_id: 1,
                    tipo_evento: 'CHECKIN',
                    descripcion: 'El gestor confirmó el check-in del inquilino.',
                    fecha_evento: '2026-06-28T00:00:00.000Z'
                }
            }
        });

        const response = await confirmarCheckinReservaGestion(15);

        expect(apiClient.patch).toHaveBeenCalledWith(
            '/reservas/gestion/solicitudes/15/checkin',
            {}
        );

        expect(response.mensaje).toBe('Check-in confirmado correctamente');
        expect(response.reserva.estado_reserva).toBe('ACTIVA');
        expect(response.evento.tipo_evento).toBe('CHECKIN');
    });

    test('HU12-FE-SERVICE-02: Debe llamar al endpoint de check-out', async () => {
        vi.mocked(apiClient.patch).mockResolvedValue({
            data: {
                mensaje: 'Check-out confirmado correctamente',
                reserva: {
                    reserva_id: 15,
                    estado_reserva: 'FINALIZADA'
                },
                evento: {
                    reserva_evento_id: 101,
                    reserva_id: 15,
                    usuario_id: 1,
                    tipo_evento: 'CHECKOUT',
                    descripcion: 'El gestor confirmó el check-out del inquilino.',
                    fecha_evento: '2026-06-28T00:00:00.000Z'
                }
            }
        });

        const response = await confirmarCheckoutReservaGestion(15);

        expect(apiClient.patch).toHaveBeenCalledWith(
            '/reservas/gestion/solicitudes/15/checkout',
            {}
        );

        expect(response.mensaje).toBe('Check-out confirmado correctamente');
        expect(response.reserva.estado_reserva).toBe('FINALIZADA');
        expect(response.evento.tipo_evento).toBe('CHECKOUT');
    });
});