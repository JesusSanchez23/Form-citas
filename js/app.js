// selectores html interfaz del usuario
const formulario = document.querySelector("#nueva-cita");
const citasListado = document.querySelector("#citas");

// campos del formulario
const MascotaInput = document.querySelector("#mascota");
const PropietarioInput = document.querySelector("#propietario");
const telefonoInput = document.querySelector("#telefono");
const fechaInput = document.querySelector("#fecha");
const horaInput = document.querySelector("#hora");
const sintomasInput = document.querySelector("#sintomas");

let editando;

// classes

class Citas {
  constructor() {
    this.citas = [];
  }

  agregarCita(cita) {
    this.citas = [...this.citas, cita];
    // console.log(this.citas);
  }

  eliminarCita(id) {
    console.log(id);

    this.citas = this.citas.filter((cita) => cita.id !== id);
  }

  editarCita(citaActualizada) {
    // const { mascota, propietario, telefono, fecha, hora, sintomas, id } = cita;

    this.citas = this.citas.map((cita) =>
      cita.id === citaActualizada.id ? citaActualizada : cita
    );
  }
}

class UI {
  imprimirAlerta(mensaje, tipo) {
    const divMensaje = document.createElement("div");
    divMensaje.classList.add("text-center", "alert", "d-block", "col-12");

    //agregar clas dado el etipo

    if (tipo == "error") {
      divMensaje.classList.add("alert-danger");
    } else {
      divMensaje.classList.add("alert-success");
    }

    divMensaje.textContent = mensaje;

    // agregar al DOM
    // formulario.appendChild(divMensaje);

    document
      .querySelector("#contenido")
      .insertBefore(divMensaje, document.querySelector("#agregar-cita"));

    // quitar la alerta tras 3 segundos

    setTimeout(() => {
      divMensaje.remove();
    }, 3000);
  }

  imprimirCitas({ citas }) {
    this.limpiarHTML();
    citas.forEach((cita) => {
      console.log(cita);

      const { mascota, propietario, telefono, fecha, hora, sintomas, id } =
        cita;
      const divCita = document.createElement("div");
      divCita.classList.add("cita", "p-3");
      divCita.dataset.id = id;

      const parrafoMascota = document.createElement("h2");
      parrafoMascota.classList.add("card-title", "font-weight-bolder");
      parrafoMascota.textContent = mascota;

      const propietarioParrafo = document.createElement("p");
      propietarioParrafo.innerHTML = `
      <span class="font-weight-bolder">Propietario: </span> ${propietario}
      `;

      const telefonoParrafo = document.createElement("p");
      telefonoParrafo.innerHTML = `
      <span class="font-weight-bolder">Propietario: </span> ${telefono}
      `;

      const fechaParrafo = document.createElement("p");
      fechaParrafo.innerHTML = `
      <span class="font-weight-bolder">Propietario: </span> ${fecha}
      `;

      const horaParrafo = document.createElement("p");
      horaParrafo.innerHTML = `
      <span class="font-weight-bolder">Propietario: </span> ${hora}
      `;

      const sintomasParrafo = document.createElement("p");
      sintomasParrafo.innerHTML = `
      <span class="font-weight-bolder">Propietario: </span> ${sintomas}
      `;

      // agregar boton para eliminar cita

      const btnEliminar = document.createElement("button");
      btnEliminar.classList.add("btn", "btn-danger", "mr-2");
      btnEliminar.textContent = "Eliminar";

      btnEliminar.onclick = () => eliminarCita(id);

      // agregar boton para editar la cita

      const btnEditar = document.createElement("button");
      btnEditar.classList.add("btn", "btn-info");
      btnEditar.textContent = "Editar";

      btnEditar.onclick = () => cargarEdicion(cita);

      // sagregar los parrafos al divcita

      divCita.appendChild(parrafoMascota);
      divCita.appendChild(propietarioParrafo);
      divCita.appendChild(telefonoParrafo);
      divCita.appendChild(fechaParrafo);
      divCita.appendChild(horaParrafo);
      divCita.appendChild(sintomasParrafo);
      divCita.appendChild(btnEliminar);
      divCita.appendChild(btnEditar);

      citasListado.appendChild(divCita);
    });
  }

  limpiarHTML() {
    while (citasListado.firstChild) {
      citasListado.removeChild(citasListado.firstChild);
    }
  }
}

const ui = new UI();

const administrarCitas = new Citas();
// registrar eventos
eventListeners();
function eventListeners() {
  MascotaInput.addEventListener("input", datosCita);
  PropietarioInput.addEventListener("input", datosCita);
  telefonoInput.addEventListener("input", datosCita);
  fechaInput.addEventListener("input", datosCita);
  horaInput.addEventListener("input", datosCita);
  sintomasInput.addEventListener("input", datosCita);

  formulario.addEventListener("submit", nuevaCita);
}

// objeto principal con la informacion d ela cita
const citaObj = {
  mascota: "",
  propietario: "",
  telefono: "",
  fecha: "",
  hora: "",
  sintomas: "",
};

// agrega lo que ingreses al input a cada propiedad de la citaObj
function datosCita(e) {
  citaObj[e.target.name] = e.target.value;
}

// valida y agrega una nueva cita a la clase de citas

function nuevaCita(e) {
  e.preventDefault();
  // extraer la informacio
  const { mascota, propietario, telefono, fecha, hora, sintomas } = citaObj;

  // validar
  if (
    mascota == "" ||
    propietario == "" ||
    telefono == "" ||
    fecha == "" ||
    hora == "" ||
    sintomas == ""
  ) {
    ui.imprimirAlerta("todos los campos son obligatorios", "error");
    return;
  }

  if (editando) {
    // console.log("edition");
    ui.imprimirAlerta("Cita editada", "exito");

    // pasar el objeto de la cita a edicion
    administrarCitas.editarCita({ ...citaObj });

    // cambiar el texto del boton
    formulario.querySelector('button[type="submit"]').textContent =
      "Crear Cita";

    // quitar modo edicion
    editando = false;
  } else {
    // console.log("new cita");
    // generar un ID
    citaObj.id = Date.now();

    // crear una nueva cita
    administrarCitas.agregarCita({ ...citaObj });
    ui.imprimirAlerta("Cita confirmada", "exito");
  }

  // reiniciar objeto para validación
  reiniciarObj();
  // reiniciar formulario
  formulario.reset();

  // mostrar HTML
  ui.imprimirCitas(administrarCitas);
}

function reiniciarObj() {
  citaObj.mascota = "";
  citaObj.propietario = "";
  citaObj.telefono = "";
  citaObj.fecha = "";
  citaObj.hora = "";
  citaObj.sintomas = "";
  citaObj.id = "";
}

function eliminarCita(id) {
  // eliminar la cita
  administrarCitas.eliminarCita(id);

  // mostrar un mensaje
  ui.imprimirAlerta("Cita Eliminada", "exito");

  // refrescar Citas
  ui.imprimirCitas(administrarCitas);
}

// carga los datos y el modo edición

function editarCita(cita) {
  administrarCitas.editarCita(cita);
}

function cargarEdicion(cita) {
  const { mascota, propietario, telefono, fecha, hora, sintomas, id } = cita;

  // llenar los input
  MascotaInput.value = mascota;
  PropietarioInput.value = propietario;
  telefonoInput.value = telefono;
  fechaInput.value = fecha;
  horaInput.value = hora;
  sintomasInput.value = sintomas;

  // llenar el objeto

  citaObj.mascota = mascota;
  citaObj.propietario = propietario;
  citaObj.telefono = telefono;
  citaObj.fecha = fecha;
  citaObj.hora = hora;
  citaObj.sintomas = sintomas;
  citaObj.id = id;

  // cambiar el texto del boton
  formulario.querySelector('button[type="submit"]').textContent =
    "guardar Cambios";

  editando = true;
}
