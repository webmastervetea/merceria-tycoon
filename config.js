export const config = {
    SAVE_KEY: 'merceria_elite_save_v1',
    
    // Configuración de niveles
    NIVELES: {
        1: { xp: 0, titulo: 'Aprendiz' },
        2: { xp: 100, titulo: 'Sastre Jr.' },
        3: { xp: 300, titulo: 'Sastre Pro' },
        4: { xp: 800, titulo: 'Maestro Textil' },
        5: { xp: 2000, titulo: 'Magnate de la Moda' }
    },

    // Definición de prendas
    RECETAS: {
        camisa_slim: { n: 'Camisa Slim', p: 45, energia: 15, xp: 10, materiales: { tela: 2, hilo: 1 } },
        pantalon_chino: { n: 'Pantalón Chino', p: 80, energia: 25, xp: 20, materiales: { tela: 3, hilo: 2 } },
        vestido_gala: { n: 'Vestido Gala', p: 250, energia: 50, xp: 50, materiales: { seda: 4, hilo: 3 } }
    },

    // Definición de empleados para la fábrica
    ROLES_EMPLEADOS: {
        aprendiz: { n: 'Aprendiz', coste: 1000, velocidad: 0.5, icon: '👨‍🎓' },
        oficial: { n: 'Oficial', coste: 5000, velocidad: 1.5, icon: '👔' },
        maestro: { n: 'Maestro', coste: 15000, velocidad: 4.0, icon: '👑' }
    },

    // Logros del juego
    LOGROS: {
        'SAVER': { id: 'SAVER', n: 'Ahorrador', desc: 'Acumula 10.000€', icon: '💰' },
        'FAST_FASHION': { id: 'FAST_FASHION', n: 'Moda Rápida', desc: 'Cose 100 prendas', icon: '⚡' },
        'VIP_ONLY': { id: 'VIP_ONLY', n: 'Club Elite', desc: 'Atiende a 10 VIPs', icon: '💎' }
    },

    // ESTADO INICIAL DEL JUEGO
    DEFAULT_STATE: {
        caja: 500,
        nivel: 1,
        xp: 0,
        energia: 150,
        energiaMax: 150,
        inventario: {
            tela: 20,
            hilo: 20,
            seda: 0
        },
        kits: {
            camisa_slim: 0,
            pantalon_chino: 0,
            vestido_gala: 0
        },
        empleados: [],
        fabrica: {
            progreso: 0,
            idProduccionAuto: 'camisa_slim'
        },
        tendencias: {
            tela: [10, 12, 11],
            hilo: [5, 6, 5],
            seda: [50, 55, 48]
        },
        logrosObtenidos: [],
        tendenciaHoy: {
            id: 'camisa_slim',
            multiplicador: 1.0,
            nombre: 'Normal'
        },
        historialVentas: [],
        prestigio: {
            puntos: 0,
            nivel: 1,
            multiplicadorVip: 1.0,
            nombre: "Tienda Local"
        },
        eventoActivo: null,
        statsGlobales: {
            dineroTotalGanado: 0,
            prendasCosidas: 0,
            clientesAtendidos: 0,
            vipsSatisfechos: 0,
            dineroGastadoMercado: 0,
            tiempoJuegoSegundos: 0,
            clicsTotales: 0
        }
    }
};