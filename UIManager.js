export class UIManager {
    constructor(game, events) {
        this.game = game;
        this.events = events;
        this.activeTab = 1;
        this.dom = {
            app: document.getElementById('app-viewport'),
            caja: document.getElementById('val-caja'),
            energia: document.getElementById('bar-energia'),
            rango: document.getElementById('val-rango')
        };
    }

    init() {
        this.events.on('state:updated', (s) => { this.refreshHUD(s); this.draw(s); });
        this.events.on('ui:nav', (id) => { this.activeTab = id; this.draw(this.game.data); });
    }

    refreshHUD(s) {
        this.dom.caja.innerHTML = `${Math.floor(s.caja)}<span style="color:var(--accent)">€</span>`;
        this.dom.rango.innerText = `NIVEL ${s.nivel}`;
        const pEnergia = (s.energia / s.energiaMax) * 100;
        this.dom.energia.style.width = `${pEnergia}%`;
    }

    draw(s) {
        let html = `<div class="p-4 animate-fadeIn">`;
        if (s.eventoActivo) {
            const col = s.eventoActivo.tipo === 'malo' ? '#ff4d4d' : '#00ff88';
            html += `<div class="alert mb-4 border-0 shadow" style="background:#111; border-left:8px solid ${col} !important; color:${col}">
                <h5 class="fw-900 m-0">${s.eventoActivo.titulo}</h5>
                <small class="text-white">${s.eventoActivo.desc}</small>
            </div>`;
        }

        switch (this.activeTab) {
            case 1: html += this.renderTaller(s); break;
            case 2: html += this.renderVentas(s); break;
            case 3: html += this.renderMercado(s); break;
            case 4: html += this.renderFabrica(s); break;
            case 7: html += this.renderHitos(s); break;
            case 8: html += this.renderStats(s); break;
        }
        this.dom.app.innerHTML = html + `</div>`;
    }

    renderTaller(s) {
        return `<h1 class="fw-900 text-white mb-4">🧵 TALLER</h1>
        <div class="row g-3">
            ${Object.entries(this.game.config.RECETAS).map(([id, r]) => `
                <div class="col-12">
                    <div class="card p-4 bg-surface border-warning shadow">
                        <h2 class="text-white fw-900">${r.n}</h2>
                        <button onclick="gameActions.dispatch('CRAFT', {id:'${id}'})" class="btn btn-warning btn-lg w-100 fw-900 py-3 mt-2">COSER (-${r.energia}⚡)</button>
                    </div>
                </div>`).join('')}
        </div>`;
    }

    renderVentas(s) {
        const tendencia = s.tendenciaHoy;
        let h = `<h1 class="fw-900 text-white mb-4 text-center">🏪 VENTAS</h1>`;
        if (tendencia) h += `<div class="card p-2 mb-3 bg-warning text-dark text-center fw-900">🔥 TENDENCIA: ${tendencia.nombre}</div>`;
        
        Object.entries(s.kits).forEach(([id, cant]) => {
            if (cant > 0) {
                let p = this.game.config.RECETAS[id].p;
                if (tendencia && tendencia.id === id) p = Math.floor(p * tendencia.multiplicador);
                h += `<div class="card p-3 mb-2 bg-dark border-success d-flex flex-row justify-content-between align-items-center">
                    <div><b class="text-white">${this.game.config.RECETAS[id].n}</b><br><span class="text-success">${p}€</span></div>
                    <button onclick="gameActions.dispatch('SELL', {id:'${id}', amount:'ALL'})" class="btn btn-success fw-900">VENDER TODO</button>
                </div>`;
            }
        });
        h += `<div class="mt-4"><h5 class="text-white-50">HISTORIAL</h5><div class="p-2 bg-black border border-secondary" style="font-family:monospace; font-size:0.8rem">
            ${s.historialVentas.map(v => `<div class="d-flex justify-content-between"><span class="text-info">${v.item}</span><span class="text-success">+${v.total}€</span></div>`).join('')}
        </div></div>`;
        return h;
    }

    renderMercado(s) {
        let h = `<h1 class="fw-900 text-white mb-4">📦 MERCADO</h1>`;
        Object.keys(s.tendencias).forEach(m => {
            const hist = s.tendencias[m];
            const actual = hist[hist.length - 1];
            h += `<div class="card p-4 mb-3 bg-dark border-secondary">
                <div class="d-flex justify-content-between">
                    <div><h3 class="text-white mb-0 uppercase">${m}</h3><span class="fs-1 fw-900 text-success">${actual}€</span></div>
                    <div class="text-end"><small class="text-white-50">STOCK</small><br><b class="text-warning fs-2">${s.inventario[m] || 0}</b></div>
                </div>
                <button onclick="gameActions.dispatch('BUY_MARKET', {id:'${m}'})" class="btn btn-warning w-100 mt-3 fw-900">COMPRAR LOTE x10</button>
            </div>`;
        });
        return h;
    }

    renderFabrica(s) {
        return `<h1 class="fw-900 text-white mb-4">🏭 FÁBRICA</h1>
        <div class="card p-4 mb-4 bg-black border-info text-center">
            <div class="progress bg-dark mb-2" style="height:20px"><div class="progress-bar bg-info" style="width: ${s.fabrica.progreso}%"></div></div>
            <b class="text-white">${Math.floor(s.fabrica.progreso)}% AUTO-PRODUCCIÓN</b>
        </div>
        <div class="row g-2">${Object.entries(this.game.config.ROLES_EMPLEADOS).map(([id, r]) => `
            <div class="col-4"><button onclick="gameActions.dispatch('HIRE_EMPLOYEE', {roleId:'${id}'})" class="btn btn-outline-info w-100 py-3">
                <div class="fs-2">${r.icon}</div><b class="text-white">${r.coste}€</b>
            </button></div>`).join('')}</div>`;
    }

    renderHitos(s) {
        return `<h1 class="fw-900 text-white mb-4">🏆 HITOS</h1>
        <div class="row g-2">${Object.values(this.game.config.LOGROS).map(l => {
            const ok = s.logrosObtenidos.includes(l.id);
            return `<div class="col-6"><div class="card p-3 text-center ${ok ? 'border-warning' : 'opacity-25'}" style="background:#111">
                <div class="fs-1">${l.icon}</div><b class="text-white small">${l.n}</b>
            </div></div>`;
        }).join('')}</div>`;
    }

    renderStats(s) {
        const st = s.statsGlobales;
        return `<h1 class="fw-900 text-white mb-4">📊 STATS</h1>
        <div class="card p-3 bg-dark border-success mb-3 text-center"><small class="text-success">TOTAL GANADO</small><div class="fs-2 fw-900 text-white">${st.dineroTotalGanado}€</div></div>
        <div class="row g-2 text-center">
            <div class="col-6"><div class="card p-2 bg-dark">Prendas: ${st.prendasCosidas}</div></div>
            <div class="col-6"><div class="card p-2 bg-dark">VIPs: ${st.vipsSatisfechos}</div></div>
        </div>`;
    }
} // <--- ESTA LLAVE CIERRA LA CLASE. NO LA QUITES.