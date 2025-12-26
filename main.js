import { config } from './config.js';
import { EventEmitter } from './EventEmitter.js';
import { UIManager } from './UIManager.js';

// 1. CREAR EL PUENTE GLOBAL ANTES DE NADA
window.gameActions = {
    dispatch: (action, params = {}) => {
        if (window.gameWorker) {
            window.gameWorker.postMessage({ type: 'ACTION', payload: { action, params } });
            console.log("Acción enviada:", action, params); // Debug para confirmar clic
        } else {
            console.error("Worker no inicializado");
        }
    },
    navigate: (id) => {
        document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));
        if (window.gameEvents) {
            window.gameEvents.emit('ui:nav', id);
        }
    }
};

const events = new EventEmitter();
window.gameEvents = events;

const game = {
    data: null,
    config: config,
    ui: null,
    worker: null,

    init() {
        // Carga de datos
        const saved = localStorage.getItem(config.SAVE_KEY);
        this.data = saved ? { ...config.DEFAULT_STATE, ...JSON.parse(saved) } : JSON.parse(JSON.stringify(config.DEFAULT_STATE));

        // UI
        this.ui = new UIManager(this, events);
        this.ui.init();

        // Worker
        this.setupWorker();
    },

    setupWorker() {
        this.worker = new Worker(new URL('./game.worker.js', import.meta.url), { type: 'module' });
        window.gameWorker = this.worker; // Anclaje vital

        this.worker.onmessage = (e) => {
            const { type, state } = e.data;
            if (type === 'STATE_UPDATE') {
                this.data = state;
                events.emit('state:updated', state);
                localStorage.setItem(config.SAVE_KEY, JSON.stringify(this.data));
            }
        };

        this.worker.postMessage({ type: 'BOOT', payload: { state: this.data } });
    }
};

// Iniciar al cargar el DOM
document.addEventListener('DOMContentLoaded', () => {
    game.init();
    window.gameInstance = game;
});