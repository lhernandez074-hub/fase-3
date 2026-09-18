const API_URL = "https://makeup-api.herokuapp.com/api/v1/products.json";

const contenedorProductos = document.getElementById("productos");
const buscador = document.getElementById("buscador");
const categoria = document.getElementById("categoria");

let productos = [];

const imagenes = [
    "labial.jpg",
    "base.jpg",
    "sombra.jpg",
    "rubor.jpg",
    "rimel.jpg"
];

async function obtenerProductos() {
    try {
        const respuesta = await fetch(API_URL);

        if (!respuesta.ok) {
            throw new Error("Error al conectar con la API");
        }

        productos = await respuesta.json();

        mostrarProductos(productos);

    } catch (error) {
        console.error(error);

        contenedorProductos.innerHTML = `
            <p class="text-center text-danger">
                No se pudieron cargar los productos.
            </p>
        `;
    }
}

function mostrarProductos(lista) {

    contenedorProductos.innerHTML = "";

    lista.slice(0, 30).forEach((producto, indice) => {

        const tarjeta = document.createElement("div");

        tarjeta.className = "col-md-4 col-lg-3 mb-4";

        // Utiliza nuestras imágenes locales
        const imagen = imagenes[indice % imagenes.length];

        tarjeta.innerHTML = `
            <div class="card h-100 shadow-sm">

                <img
                    src="${imagen}"
                    class="card-img-top"
                    alt="Producto de maquillaje"
                    style="height:250px; object-fit:contain; padding:15px;"
                >

                <div class="card-body">

                    <h3 class="card-title fs-5">
                        ${producto.name || "Sin nombre"}
                    </h3>

                    <p class="card-text">
                        Marca: ${producto.brand || "No disponible"}
                    </p>

                    <p class="card-text">
                        Categoría:
                        ${producto.product_type || "No disponible"}
                    </p>

                    <p class="card-text fw-bold">
                        Precio:
                        ${producto.price
                            ? "$" + producto.price
                            : "No disponible"}
                    </p>

                    <button
                        class="btn btn-primary"
                        onclick="verDetalles(${producto.id})">
                        Ver detalles
                    </button>

                </div>
            </div>
        `;

        contenedorProductos.appendChild(tarjeta);
    });
}

function filtrarProductos() {

    const texto = buscador.value.toLowerCase();
    const tipo = categoria.value;

    const resultado = productos.filter(producto => {

        const nombre =
            (producto.name || "").toLowerCase();

        const marca =
            (producto.brand || "").toLowerCase();

        const tipoProducto =
            (producto.product_type || "").toLowerCase();

        const coincideTexto =
            nombre.includes(texto) ||
            marca.includes(texto);

        const coincideCategoria =
            tipo === "todos" ||
            tipoProducto === tipo;

        return coincideTexto && coincideCategoria;
    });

    mostrarProductos(resultado);
}

function verDetalles(id) {

    const producto =
        productos.find(item => item.id === id);

    if (!producto) return;

    localStorage.setItem(
        "productoSeleccionado",
        JSON.stringify(producto)
    );

    window.location.href = "detalle.html";
}

function cargarDetalle() {

    const datos =
        localStorage.getItem("productoSeleccionado");

    if (!datos) return;

    const producto = JSON.parse(datos);

    document.getElementById("nombreProducto").textContent =
        producto.name || "Sin nombre";

    document.getElementById("marcaProducto").textContent =
        "Marca: " + (producto.brand || "No disponible");

    document.getElementById("categoriaProducto").textContent =
        "Categoría: " + (producto.product_type || "No disponible");

    document.getElementById("precioProducto").textContent =
        producto.price
            ? "Precio: $" + producto.price
            : "Precio: No disponible";

    document.getElementById("descripcionProducto").textContent =
        producto.description ||
        "No hay descripción disponible.";

    const imagen =
        document.getElementById("imagenProducto");

    imagen.src = "labial.jpg";
}

if (contenedorProductos) {
    obtenerProductos();
}

if (buscador) {
    buscador.addEventListener("input", filtrarProductos);
}

if (categoria) {
    categoria.addEventListener("change", filtrarProductos);
}

if (document.getElementById("detalleProducto")) {
    cargarDetalle();
}
