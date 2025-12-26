let empleados = [];

function contratarEmpleado(empleado) {
  if (dinero >= empleado.costo) {
    dinero -= empleado.costo;
    empleados.push(empleado);
    console.log(`Has contratado a ${empleado.nombre}!`);
  } else {
    console.log("No tienes suficiente dinero para contratar a este empleado.");
  }
}

function despedirEmpleado(empleado) {
  let indice = empleados.indexOf(empleado);
  if (indice !== -1) {
    empleados.splice(indice, 1);
    console.log(`Has despedido a ${empleado.nombre}!`);
  } else {
    console.log("No puedes despedir a un empleado que no está contratado.");
  }
}

function actualizarSalario() {
  for (let i = 0; i < empleados.length; i++) {
    let empleado = empleados[i];
    if (dinero >= empleado.salario) {
      dinero -= empleado.salario;
      console.log(`Día ${diaActual}: Se ha pagado ${empleado.salario} monedas a ${empleado.nombre}.`);
    } else {
      console.log(`Día ${diaActual}: No tienes suficiente dinero para pagar el salario de ${empleado.nombre}.`);
      despedirEmpleado(empleado);
      console.log(`Día ${diaActual}: ${empleado.nombre} ha sido despedido debido a falta de pago.`);
    }
  }
  diaActual++;
}

let diaActual = 1;
let dinero = 1000;

let empleado1 = {
  nombre: "Juan",
  habilidad: "Vendedor",
  costo: 100,
  salario: 50
};

let empleado2 = {
  nombre: "María",
  habilidad: "Gerente",
  costo: 150,
  salario: 75
};

contratarEmpleado(empleado1);
contratarEmpleado(empleado2);

function pasarDia() {
  actualizarSalario();
  console.log(`Día ${diaActual}: Dinero: ${dinero} monedas.`);
  if (dinero < 0) {
    console.log("¡Has quebrado! El juego ha terminado.");
    return;
  }
}

pasarDia();
pasarDia();
pasarDia();
