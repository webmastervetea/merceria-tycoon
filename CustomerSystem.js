/**
 * CustomerSystem.js - Refactorizado para eliminar tiempos muertos
 */
export class CustomerSystem {
    constructor(state, events, config) {
        this.state = state;
        this.events = events;
        this.config = config;
        this.nombres = ["Sra. García", "Modas Lola", "Sastre Juan", "Doña Elvira", "Tejidos Paco", "Elena M."];
    }

    init() {
        // Intento de generación cada 5 segundos
        setInterval(() => this.generateCustomer(), 5000);
    }

    generateCustomer() {
        if (this.state.cliente) return;

        // DINÁMICA DE ENGAGEMENT:
        // Si tienes stock, la probabilidad de cliente es del 85% (Venta casi segura)
        // Si no tienes stock, baja al 30% (Visita casual)
        const tieneStock = Object.values(this.state.kits).some(cantidad => cantidad > 0);
        const probabilidad = tieneStock ? 0.85 : 0.30;

        if (Math.random() > probabilidad) return;

        const productosDisponibles = Object.keys(this.config.RECETAS).filter(id => {
            return this.state.nivel >= this.config.RECETAS[id].nivel;
        });

        if (productosDisponibles.length === 0) return;

        // PRIORIDAD: Intentar que el cliente pida lo que YA tienes fabricado
        let pedidoId = productosDisponibles.find(id => this.state.kits[id] > 0) || 
                       productosDisponibles[Math.floor(Math.random() * productosDisponibles.length)];

        const nombreCliente = this.nombres[Math.floor(Math.random() * this.nombres.length)];

        this.state.cliente = {
            nombre: nombreCliente,
            pedido: pedidoId,
            timestamp: Date.now()
        };

        this.events.emit('ui:notify', { 
            msg: `¡${nombreCliente} quiere un ${this.config.RECETAS[pedidoId].n}!`, 
            type: 'success', 
            icon: '👤' 
        });
    }
}