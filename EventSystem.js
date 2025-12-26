// EventSystem.js
export class EventSystem {
    constructor(state, events) {
        this.state = state;
        this.events = events;
        
        // Asegurar que la estructura de misiones existe en el estado
        if (!this.state.misiones) {
            this.state.misiones = [];
        }
    }

    /**
     * Actualiza el progreso de las misiones
     * @param {string} tipo - 'VENTA', 'CRAFT' o 'CAJA'
     * @param {number} cantidad - Valor a sumar o actualizar
     */
    updateMission(tipo, cantidad = 1) {
        if (!this.state.misiones || !Array.isArray(this.state.misiones)) return false;
        
        let changed = false;

        this.state.misiones.forEach(m => {
            if (m.reclamada) return;

            // Lógica por tipo de misión
            if (tipo === 'VENTA' && m.id === 'm1') { 
                m.progreso += cantidad; 
                changed = true; 
            }
            if (tipo === 'CRAFT' && m.id === 'm2') { 
                m.progreso += cantidad; 
                changed = true; 
            }
            if (tipo === 'CAJA' && m.id === 'm3') { 
                // En misiones de dinero, el progreso suele ser el valor actual de la caja
                m.progreso = this.state.caja; 
                changed = true; 
            }

            // Verificar si se ha completado
            if (m.progreso >= m.meta && !m.completada) {
                m.completada = true;
                this.events.emit('ui:notify', { 
                    msg: `⭐ Misión cumplida: ${m.n}`, 
                    type: 'success' 
                });
                changed = true;
            }
        });

        return changed;
    }

    triggerRandomEvent() {
        // Probabilidad de evento (0.5% por segundo)
        if (Math.random() > 0.005) return false;
        
        // ... lógica de eventos (opcional)
        return false;
    }
}