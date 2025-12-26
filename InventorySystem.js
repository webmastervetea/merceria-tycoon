export class InventorySystem {
    constructor(state, events) { this.state = state; this.events = events; }
    craftItem(itemId, receta) {
        if (!receta) return false;
        for (const [m, q] of Object.entries(receta.materiales)) {
            if ((this.state.inventario[m.toLowerCase()] || 0) < q) return false;
        }
        for (const [m, q] of Object.entries(receta.materiales)) {
            this.state.inventario[m.toLowerCase()] -= q;
        }
        this.state.kits[itemId] = (this.state.kits[itemId] || 0) + 1;
        return true;
    }
}