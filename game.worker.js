import { config } from './config.js';

let state = null;

const sync = () => {
    if (state) self.postMessage({ type: 'STATE_UPDATE', state: state });
};

self.onmessage = (e) => {
    const { type, payload } = e.data;

    if (type === 'BOOT') {
        state = payload.state;
        setInterval(tick, 1000);
        sync();
        return;
    }

    if (type === 'ACTION') {
        const { action, params } = payload;
        state.statsGlobales.clicsTotales += 1;

        switch (action) {
            case 'CRAFT': ejecutarCoser(params.id); break;
            case 'SELL': ejecutarVenta(params.id, params.amount); break;
            case 'BUY_MARKET': ejecutarCompra(params.id); break;
            case 'HIRE_EMPLOYEE': ejecutarContratacion(params.roleId); break;
        }
        sync();
    }
};

function ejecutarCoser(id) {
    const r = config.RECETAS[id];
    if (state.energia >= r.energia) {
        state.energia -= r.energia;
        state.kits[id] = (state.kits[id] || 0) + 1;
        state.xp += r.xp;
        state.statsGlobales.prendasCosidas += 1;
        comprobarSubidaNivel();
    }
}

function ejecutarVenta(id, amount) {
    const stock = state.kits[id] || 0;
    if (stock <= 0) return;

    let precioBase = config.RECETAS[id].p;
    const esTendencia = state.tendenciaHoy && state.tendenciaHoy.id === id;
    if (esTendencia) precioBase = Math.floor(precioBase * state.tendenciaHoy.multiplicador);

    const cantidad = (amount === 'ALL') ? stock : Math.min(stock, amount);
    const esVip = Math.random() < (0.05 * state.prestigio.nivel);
    const bonoVip = esVip ? 3.0 : 1.0;
    const total = Math.floor(precioBase * cantidad * bonoVip);

    state.caja += total;
    state.kits[id] -= cantidad;
    state.prestigio.puntos += (cantidad * 5);
    
    // Stats y Historial
    state.statsGlobales.dineroTotalGanado += total;
    state.statsGlobales.clientesAtendidos += 1;
    if (esVip) state.statsGlobales.vipsSatisfechos += 1;

    state.historialVentas.unshift({
        item: config.RECETAS[id].n, cantidad, total, esVip, esTendencia,
        fecha: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    });
    if (state.historialVentas.length > 8) state.historialVentas.pop();
    
    comprobarPrestigio();
}

function ejecutarCompra(id) {
    const hist = state.tendencias[id];
    const precio = hist[hist.length - 1];
    let coste = precio * 10;
    if (state.eventoActivo && state.eventoActivo.efecto === "COSTE_MERCADO") coste *= 1.5;

    if (state.caja >= coste) {
        state.caja -= coste;
        state.inventario[id] = (state.inventario[id] || 0) + 10;
        state.statsGlobales.dineroGastadoMercado += coste;
    }
}

function ejecutarContratacion(id) {
    const rol = config.ROLES_EMPLEADOS[id];
    if (state.caja >= rol.coste) {
        state.caja -= rol.coste;
        state.empleados.push({ ...rol, idInstancia: Date.now() });
    }
}

function tick() {
    if (!state) return;
    state.statsGlobales.tiempoJuegoSegundos += 1;
    let changed = false;

    // Energía
    let recuperacion = 2.5;
    if (state.eventoActivo && state.eventoActivo.efecto === "SLOW_ENERGY") recuperacion /= 2;
    if (state.energia < state.energiaMax) {
        state.energia = Math.min(state.energiaMax, state.energia + recuperacion);
        changed = true;
    }

    // Producción Auto
    if (state.empleados.length > 0) {
        const poder = state.empleados.reduce((acc, emp) => acc + emp.velocidad, 0);
        state.fabrica.progreso += poder;
        if (state.fabrica.progreso >= 100) {
            state.fabrica.progreso = 0;
            const prod = state.fabrica.idProduccionAuto || 'camisa_slim';
            state.kits[prod] = (state.kits[prod] || 0) + 1;
        }
        changed = true;
    }

    // Eventos y Tendencias
    if (Math.random() > 0.98 && !state.eventoActivo) { lanzarEvento(); changed = true; }
    if (state.eventoActivo && Date.now() > state.eventoActivo.fin) { state.eventoActivo = null; changed = true; }
    if (Math.random() > 0.95) { actualizarTendencia(); changed = true; }

    if (changed) sync();
}

function actualizarTendencia() {
    const ids = Object.keys(config.RECETAS);
    const elegido = ids[Math.floor(Math.random() * ids.length)];
    state.tendenciaHoy = { id: elegido, multiplicador: (1.2 + Math.random() * 0.8).toFixed(2), nombre: config.RECETAS[elegido].n };
}

function lanzarEvento() {
    const evs = [
        { titulo: "📸 VIRAL", desc: "Prestigio x2", tipo: "bueno", duracion: 30000, efecto: "BONUS_PRESTIGIO" },
        { titulo: "🚚 HUELGA", desc: "Mercado +50% coste", tipo: "malo", duracion: 40000, efecto: "COSTE_MERCADO" }
    ];
    const ev = evs[Math.floor(Math.random() * evs.length)];
    state.eventoActivo = { ...ev, fin: Date.now() + ev.duracion };
}

function comprobarSubidaNivel() {
    const next = config.NIVELES[state.nivel + 1];
    if (next && state.xp >= next.xp) { state.nivel++; state.energiaMax += 25; }
}

function comprobarPrestigio() {
    const hitos = [0, 500, 1500, 5000, 15000];
    const nombres = ["Tienda Local", "Boutique Reconocida", "Atelier de Lujo", "Imperio Textil", "Leyenda"];
    hitos.forEach((p, i) => { if (state.prestigio.puntos >= p) { state.prestigio.nivel = i + 1; state.prestigio.nombre = nombres[i]; } });
}