// tutorial.js
const tutorialData = [
  {
    "id": 1,
    "texto": "Bienvenido a Merceria Tycoon!",
    "imagen": "tutorial1.png"
  },
  {
    "id": 2,
    "texto": "Compra y vende productos para ganar dinero",
    "imagen": "tutorial2.png"
  },
  // ...
];

function mostrarTutorial() {
  const tutorialContainer = document.getElementById("tutorial-container");
  let currentStep = 0;

  function mostrarPaso() {
    const paso = tutorialData[currentStep];
    tutorialContainer.innerHTML = `
      <img src="${paso.imagen}" alt="${paso.texto}" class="tutorial-imagen">
      <p class="tutorial-texto">${paso.texto}</p>
      <div class="tutorial-botones">
        <button id="anterior-btn" class="tutorial-btn">Anterior</button>
        <button id="siguiente-btn" class="tutorial-btn">Siguiente</button>
      </div>
      <div class="tutorial-progreso">
        ${getProgreso(currentStep)}
      </div>
    `;
    document.getElementById("siguiente-btn").addEventListener("click", () => {
      currentStep++;
      if (currentStep < tutorialData.length) {
        mostrarPaso();
      } else {
        tutorialContainer.style.display = "none";
      }
    });
    document.getElementById("anterior-btn").addEventListener("click", () => {
      currentStep--;
      if (currentStep >= 0) {
        mostrarPaso();
      }
    });
  }

  function getProgreso(step) {
    let progreso = "";
    for (let i = 0; i < tutorialData.length; i++) {
      if (i === step) {
        progreso += `<span class="progreso-activo"></span>`;
      } else {
        progreso += `<span class="progreso-inactivo"></span>`;
      }
    }
    return progreso;
  }

  mostrarPaso();
}

// CSS
.tutorial-container {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: #fff;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
}

.tutorial-imagen {
  width: 100%;
  height: 200px;
  object-fit: cover;
  border-radius: 10px;
}

.tutorial-texto {
  font-size: 18px;
  margin-bottom: 20px;
}

.tutorial-botones {
  display: flex;
  justify-content: space-between;
}

.tutorial-btn {
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  background-color: #4CAF50;
  color: #fff;
  cursor: pointer;
}

.tutorial-btn:hover {
  background-color: #3e8e41;
}

.tutorial-progreso {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}

.progreso-activo {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: #4CAF50;
  margin: 0 5px;
}

.progreso-inactivo {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: #ccc;
  margin: 0 5px;
}
