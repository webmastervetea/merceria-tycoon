export const initialData = {
    caja: 500,
    energia: 150,
    energiaMax: 150,
    inventario: { hilo: 20, tela: 10 },
    kits: { VESTIDO: 0, CAMISA: 0 },
    empleados: {
        cantidad: 0,
        costeContratacion: 2000,
        idProduccionAuto: "CAMISA",
        salarioPorUnidad: 15
    },
    investigacion: { 
        puntos: 5,
        proyectos: [
            { id: "opt_hilo", n: "Corte Láser", desc: "-10% consumo materiales", coste: 10, unlocked: false },
            { id: "form_personal", n: "Lean Manufacturing", desc: "-20% coste salarios", coste: 25, unlocked: false },
            { id: "marketing", n: "E-Commerce Luxe", desc: "+15% valor de mercado", coste: 50, unlocked: false }
        ] 
    },
    estadisticas: { 
        historial: [],
        exp: 0,
        expSiguienteNivel: 1000,
        nivel: 1
    },
    cliente: null,
    marketCatalog: {
        "HILO": { n: "Hilo Egipcio", pActual: 10 },
        "TELA": { n: "Seda Natural", pActual: 25 }
    }
};

export const config = {
    SAVE_KEY: "MERCERIA_ELITE_PRO",
    RECETAS: {
        "VESTIDO": { n: "Vestido Gala", p: 150, materiales: { hilo: 2, tela: 2 }, exp: 120 },
        "CAMISA": { n: "Camisa Slim", p: 80, materiales: { hilo: 1, tela: 1 }, exp: 60 }
    }
};