export class TaxSystem {
    constructor(state, events, config) {
        this.state = state;
        this.events = events;
        this.config = config;
        if (this.state.timerImpuestos === undefined) this.state.timerImpuestos = 300;
        if (this.state.deuda === undefined) this.state.deuda = 0;
    }

    update() {
        if (this.state.nivel < 2) return false;
        this.state.timerImpuestos--;
        if (this.state.timerImpuestos <= 0) {
            this.executeTaxCollection();
            this.state.timerImpuestos = 300;
            return true;
        }
        return false;
    }

    executeTaxCollection() {
        const cuota = Math.floor(this.state.caja * 0.12) + (this.state.nivel * 20);
        if (this.state.caja >= cuota) {
            this.state.caja -= cuota;
            this.events.emit('ui:notify', { msg: `🏛️ Impuestos pagados: -${cuota}€`, type: 'warning' });
        } else {
            const faltante = cuota - this.state.caja;
            this.state.caja = 0;
            // INTERÉS BALANCEADO: 1.15 (15% de recargo en lugar de 25%)
            this.state.deuda += Math.floor(faltante * 1.15);
            this.events.emit('ui:notify', { msg: `⚠️ Deuda con Hacienda: ${this.state.deuda}€`, type: 'danger' });
        }
    }
}