export class EventManager {
    constructor(state, events) {
        this.state = state;
        this.events = events;
        this.eventosPosibles = [
            { n: "Boda Real", efecto: () => state.modificadorVenta = 2.5, desc: "¡Demanda de Seda por las nubes!", duracion: 120 },
            { n: "Huelga de Transportes", efecto: () => state.marketCatalog.tela.pActual *= 3, desc: "El precio de la tela se triplica", duracion: 60 },
            { n: "Black Friday", efecto: () => state.modificadorVenta = 0.5, desc: "Precios de venta bajos, pero mucha XP", duracion: 180 }
        ];
    }

    lanzarEventoAleatorio() {
        if (Math.random() > 0.95) { // 5% de probabilidad por tick
            const ev = this.eventosPosibles[Math.floor(Math.random() * this.eventosPosibles.length)];
            ev.efecto();
            this.events.emit('ui:notify', { msg: `📢 EVENTO: ${ev.n}. ${ev.desc}`, type: 'warning' });
        }
    }
}