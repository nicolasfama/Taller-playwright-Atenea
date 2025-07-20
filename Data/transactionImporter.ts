import * as fs from 'fs';
import * as path from 'path';

// Interfaces para definir la estructura de datos
export interface Usuario {
    nombre: string;
    apellido: string;
    email: string;
    cuentaBancaria: string;
    saldoAnterior: number;
}

export interface Transaccion {
    monto: number;
    moneda: string;
    fecha: string;
    concepto: string;
    estado: 'completada' | 'pendiente' | 'cancelada';
    comision: number;
}

export interface TransaccionCompleta {
    id: string;
    usuarioEnvia: Usuario;
    usuarioRecibe: Usuario;
    transaccion: Transaccion;
}

export interface ConfiguracionTransacciones {
    comisionMinima: number;
    comisionMaxima: number;
    porcentajeComision: number;
    montoMinimoTransferencia: number;
    montoMaximoTransferencia: number;
}

export interface DatosTransacciones {
    transacciones: TransaccionCompleta[];
    configuracion: ConfiguracionTransacciones;
}

export class TransactionImporter {
    private dataPath: string;

    constructor(dataPath: string = './Data/transactionData.json') {
        this.dataPath = dataPath;
    }

    /**
     * Importa todos los datos de transacciones desde el archivo JSON
     */
    public importarDatosTransacciones(): DatosTransacciones {
        try {
            const fullPath = path.resolve(this.dataPath);
            const rawData = fs.readFileSync(fullPath, 'utf8');
            const datos: DatosTransacciones = JSON.parse(rawData);
            return datos;
        } catch (error) {
            throw new Error(`Error al importar datos de transacciones: ${error}`);
        }
    }

    /**
     * Obtiene todas las transacciones
     */
    public obtenerTransacciones(): TransaccionCompleta[] {
        const datos = this.importarDatosTransacciones();
        return datos.transacciones;
    }

    /**
     * Obtiene transacciones por estado
     */
    public obtenerTransaccionesPorEstado(estado: 'completada' | 'pendiente' | 'cancelada'): TransaccionCompleta[] {
        const transacciones = this.obtenerTransacciones();
        return transacciones.filter(t => t.transaccion.estado === estado);
    }

    /**
     * Obtiene transacciones de un usuario específico (como remitente)
     */
    public obtenerTransaccionesEnviadas(email: string): TransaccionCompleta[] {
        const transacciones = this.obtenerTransacciones();
        return transacciones.filter(t => t.usuarioEnvia.email === email);
    }

    /**
     * Obtiene transacciones de un usuario específico (como receptor)
     */
    public obtenerTransaccionesRecibidas(email: string): TransaccionCompleta[] {
        const transacciones = this.obtenerTransacciones();
        return transacciones.filter(t => t.usuarioRecibe.email === email);
    }

    /**
     * Obtiene una transacción específica por ID
     */
    public obtenerTransaccionPorId(id: string): TransaccionCompleta | undefined {
        const transacciones = this.obtenerTransacciones();
        return transacciones.find(t => t.id === id);
    }

    /**
     * Obtiene la configuración de transacciones
     */
    public obtenerConfiguracion(): ConfiguracionTransacciones {
        const datos = this.importarDatosTransacciones();
        return datos.configuracion;
    }

    /**
     * Valida si una transacción cumple con los límites configurados
     */
    public validarTransaccion(monto: number): { esValida: boolean; mensaje: string } {
        const config = this.obtenerConfiguracion();
        
        if (monto < config.montoMinimoTransferencia) {
            return {
                esValida: false,
                mensaje: `El monto mínimo de transferencia es $${config.montoMinimoTransferencia}`
            };
        }
        
        if (monto > config.montoMaximoTransferencia) {
            return {
                esValida: false,
                mensaje: `El monto máximo de transferencia es $${config.montoMaximoTransferencia}`
            };
        }
        
        return {
            esValida: true,
            mensaje: 'Transacción válida'
        };
    }

    /**
     * Calcula la comisión para una transacción
     */
    public calcularComision(monto: number): number {
        const config = this.obtenerConfiguracion();
        const comisionCalculada = monto * config.porcentajeComision;
        
        // Aplicar límites mínimos y máximos
        if (comisionCalculada < config.comisionMinima) {
            return config.comisionMinima;
        }
        
        if (comisionCalculada > config.comisionMaxima) {
            return config.comisionMaxima;
        }
        
        return Math.round(comisionCalculada * 100) / 100; // Redondear a 2 decimales
    }

    /**
     * Obtiene estadísticas de transacciones
     */
    public obtenerEstadisticas(): {
        totalTransacciones: number;
        transaccionesCompletadas: number;
        transaccionesPendientes: number;
        montoTotalTransferido: number;
        comisionesTotales: number;
    } {
        const transacciones = this.obtenerTransacciones();
        const completadas = transacciones.filter(t => t.transaccion.estado === 'completada');
        
        return {
            totalTransacciones: transacciones.length,
            transaccionesCompletadas: completadas.length,
            transaccionesPendientes: transacciones.filter(t => t.transaccion.estado === 'pendiente').length,
            montoTotalTransferido: completadas.reduce((total, t) => total + t.transaccion.monto, 0),
            comisionesTotales: completadas.reduce((total, t) => total + t.transaccion.comision, 0)
        };
    }
}

// Ejemplo de uso
export function ejemploDeUso() {
    const importer = new TransactionImporter();
    
    console.log('=== DATOS DE TRANSACCIONES ===');
    
    // Importar todas las transacciones
    const todasLasTransacciones = importer.obtenerTransacciones();
    console.log(`Total de transacciones: ${todasLasTransacciones.length}`);
    
    // Obtener transacciones completadas
    const completadas = importer.obtenerTransaccionesPorEstado('completada');
    console.log(`Transacciones completadas: ${completadas.length}`);
    
    // Obtener transacciones de un usuario específico
    const transaccionesJuan = importer.obtenerTransaccionesEnviadas('juan.perez@email.com');
    console.log(`Transacciones enviadas por Juan: ${transaccionesJuan.length}`);
    
    // Obtener estadísticas
    const estadisticas = importer.obtenerEstadisticas();
    console.log('Estadísticas:', estadisticas);
    
    // Validar una transacción
    const validacion = importer.validarTransaccion(500);
    console.log('Validación de transacción de $500:', validacion);
    
    // Calcular comisión
    const comision = importer.calcularComision(500);
    console.log(`Comisión para $500: $${comision}`);
}
