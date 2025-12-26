export const gameActions = {
    game: null, events: null,
    
    init(game, events) {
        this.game = game; this.events = events;
        window.gameActions = this;
        this.loadGame(); // CARGA INMEDIATA AL INICIAR
        this.startEngine();
    },

    startEngine() {
        // Ciclo de vida: Energía y Clientes
        setInterval(() => {
            const s = this.game.data;
            let upd = false;
            if(s.energia < s.energiaMax) { s.energia += 1; upd = true; }
            if(!s.cliente && Math.random() > 0.8) {
                const ids = Object.keys(this.game.config.RECETAS);
                s.cliente = { pedido: ids[Math.floor(Math.random() * ids.length)] };
                upd = true;
            }
            if(upd) this.events.emit('state:updated', s);
        }, 5000);
    },

    saveGame() {
        localStorage.setItem(this.game.config.SAVE_KEY, JSON.stringify(this.game.data));
    },

    loadGame() {
        const saved = localStorage.getItem(this.game.config.SAVE_KEY);
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                // Deep merge para no perder nuevas propiedades
                this.game.data = { ...this.game.data, ...parsed };
                this.events.emit('state:updated', this.game.data);
            } catch(e) { console.error("Error critico en lectura de datos."); }
        }
    },

    navigate(id) { this.events.emit('ui:nav', id); },

    dispatch(action, payload) {
        const s = this.game.data; const c = this.game.config;

        switch (action) {
            case 'CRAFT':
                const r = c.RECETAS[payload.id];
                const tieneMat = Object.entries(r.materiales).every(([m, q]) => (s.inventario[m.toLowerCase()] || 0) >= q);
                if (tieneMat && s.energia >= 10) {
                    Object.entries(r.materiales).forEach(([m, q]) => s.inventario[m.toLowerCase()] -= q);
                    s.kits[payload.id]++;
                    s.energia -= 10;
                    if(Math.random() > 0.7) s.investigacion.puntos++;
                }
                break;

            case 'SELL':
                if (s.cliente && s.kits[s.cliente.pedido] > 0) {
                    const id = s.cliente.pedido;
                    let precio = c.RECETAS[id].p;
                    if(s.investigacion.proyectos[2].unlocked) precio *= 1.15;
                    s.caja += precio;
                    s.kits[id]--;
                    s.estadisticas.exp += c.RECETAS[id].exp;
                    if(s.estadisticas.exp >= s.estadisticas.expSiguienteNivel) {
                        s.estadisticas.nivel++;
                        s.estadisticas.exp = 0;
                        s.estadisticas.expSiguienteNivel = Math.floor(s.estadisticas.expSiguienteNivel * 1.6);
                    }
                    s.estadisticas.historial.push({ n: c.RECETAS[id].n, v: Math.floor(precio), t: new Date().toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'}) });
                    if(s.estadisticas.historial.length > 6) s.estadisticas.historial.shift();
                    s.cliente = null;
                }
                break;

            case 'BUY':
                const itm = s.marketCatalog[payload.id];
                if (s.caja >= itm.pActual) { s.caja -= itm.pActual; s.inventario[payload.id.toLowerCase()] += 10; }
                break;

            case 'RESEARCH':
                const p = s.investigacion.proyectos.find(x => x.id === payload.id);
                if (p && s.investigacion.puntos >= p.coste && !p.unlocked) {
                    s.investigacion.puntos -= p.coste;
                    p.unlocked = true;
                }
                break;

            case 'RESET':
                if(confirm("¿Eliminar progreso?")) { localStorage.removeItem(c.SAVE_KEY); location.reload(); }
                break;
        }
        this.saveGame();
        this.events.emit('state:updated', s);
    }
};