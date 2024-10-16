window.onload = function() {
    listarPeliculas();

    // Añadimos el listener cuando el documento esté completamente cargado
    document.getElementById("btnModificar").addEventListener("click", function (evento) {
        evento.preventDefault(); // Prevenir el comportamiento por defecto del formulario
        aplicarActualizacion(idEditar);
    });
}

let listarPeliculas = async () => {
    try {
        const peticion = await fetch("http://localhost:8080/api/peliculas", {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        });

        if (!peticion.ok) {
            throw new Error(`Error en la petición: ${peticion.status}`);
        }

        const peliculas = await peticion.json();
        let contenidoTabla = "";
        for (let pelicula of peliculas) {
            let contenidoFila = `
                <tr>
                    <td>${pelicula.id}</td>
                    <td>${pelicula.titulo}</td>
                    <td>${pelicula.autor}</td>
                    <td>${pelicula.genero}</td>
                    <td>
                        <i onClick="editarPelicula(${pelicula.id})" class="material-icons button edit">edit</i>
                        <i onClick="borrarPelicula(${pelicula.id})" class="material-icons button delete">delete</i>
                    </td>
                </tr>`;
            contenidoTabla += contenidoFila;
        }
        document.querySelector("#tabla tbody").innerHTML = contenidoTabla;

    } catch (error) {
        console.error("Error al listar las películas:", error);
    }
}

let borrarPelicula = async (id) => {
    try {
        const peticion = await fetch(`http://localhost:8080/api/pelicula/${id}`, {
            method: 'DELETE',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        });

        if (!peticion.ok) {
            throw new Error(`Error en la petición: ${peticion.status}`);
        }

        listarPeliculas(); // Volver a listar las películas después de borrar
    } catch (error) {
        console.error("Error al borrar la película:", error);
    }
}

let idEditar;

let editarPelicula = async (id) => {
    mostrarFormulario();
    idEditar = id;

    const peticion = await fetch(`http://localhost:8080/api/pelicula/${id}`, {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    });

    const pelicula = await peticion.json();

    document.getElementById("titulo").value = pelicula.titulo;
    document.getElementById("autor").value = pelicula.autor;
    document.getElementById("genero").value = pelicula.genero;
}

let aplicarActualizacion = async (id) => {
    let campos = {
        id: id,
        titulo: document.getElementById("titulo").value,
        autor: document.getElementById("autor").value,
        genero: document.getElementById("genero").value
    };

    const peticion = await fetch(`http://localhost:8080/api/peliculas`, {
        method: 'PUT',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(campos)
    });

    listarPeliculas(); // Volver a listar las películas después de actualizar
}

function mostrarFormulario() {
    document.getElementById("formulario").style.visibility = "visible";
}

function volverAPeliculas() {
    window.location.href = 'peliculas.html';
}
