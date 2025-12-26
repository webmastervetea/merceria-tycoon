// niveles.js
const niveles = [
  {
    "nivel": 1,
    "experiencia": 0,
    "recompensa": "Monedas: 100"
  },
  {
    "nivel": 2,
    "experiencia": 100,
    "recompensa": "Producto exclusivo: Hilo de Oro"
  },
  // ...
];

function subirNivel() {
  const jugador = getJugador();
  const nivelActual = jugador.nivel;
  const experienciaActual = jugador.experiencia;
  const nivelSiguiente = niveles[nivelActual + 1];

  if (experienciaActual >= nivelSiguiente.experiencia) {
    jugador.nivel++;
    jugador.experiencia -= nivelSiguiente.experiencia;
    jugador.recompensa = nivelSiguiente.recompensa;
    setJugador(jugador);
    mostrarRecompensa(nivelSiguiente.recompensa);
  }
}

function mostrarRecompensa(recompensa) {
  const recompensaContainer = document.getElementById("recompensa-container");
  recompensaContainer.innerHTML = `
    <p>¡Felicidades! Has subido de nivel y has ganado:</p>
    <p>${recompensa}</p>
  `;
  recompensaContainer.style.display = "block";
  setTimeout(() => {
    recompensaContainer.style.display = "none";
  }, 5000);
}
