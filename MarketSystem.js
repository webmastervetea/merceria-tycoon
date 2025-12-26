export class MarketSystem {
    constructor(state, config) {
        this.state = state;
        this.config = config;
        this.catalog = {
            tela: { n: 'Tela Algodón', pBase: 20, pActual: 20 },
            hilo: { n: 'Hilo Reforzado', pBase: 10, pActual: 10 },
            seda: { n: 'Seda Natural', pBase: 80, pActual: 80 },
            oro: { n: 'Filamento Oro', pBase: 250, pActual: 250 }
        };
        // Cargar precios guardados si existen
        if (Object.keys(state.marketCatalog || {}).length > 0) {
            this.catalog = state.marketCatalog;
        }
    }

    updatePrices() {
        Object.keys(this.catalog).forEach(id => {
            const item = this.catalog[id];
            const variacion = 0.8 + Math.random() * 0.4; // +/- 20%
            item.pActual = Math.floor(item.pBase * variacion);
        });
        this.state.marketCatalog = this.catalog;
    }

    buy(id) {
        const item = this.catalog[id];
        if (item && this.state.caja >= item.pActual) {
            this.state.caja -= item.pActual;
            this.state.inventario[id] = (this.state.inventario[id] || 0) + 1;
            return true;
        }
        return false;
    }
}