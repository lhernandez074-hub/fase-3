const API_URL = "https://makeup-api.herokuapp.com/api/v1/products.json";

const contenedorProductos = document.getElementById("productos");
const buscador = document.getElementById("buscador");
const categoria = document.getElementById("categoria");

let productos = [];

async function obtenerProductos() {
    try {
        const respuesta = await fetch(API_URL);

        if (!respuesta.ok) {
            throw new Error("No se pudo conectar con la API");
        }

        productos = await respuesta.json();

        mostrarProductos(productos);

    } catch (error) {
        console.error("Error:", error);

        if (contenedorProductos) {
            contenedorProductos.innerHTML = `
                <p class="text-center text-danger">
                    No se pudieron cargar los productos.
                </p>
            `;
        }
    }
}

function mostrarProductos(lista) {

    if (!contenedorProductos) return;

    contenedorProductos.innerHTML = "";

    if (lista.length === 0) {
        contenedorProductos.innerHTML = `
            <p class="text-center">
                No se encontraron productos.
            </p>
        `;
        return;
    }

    lista.slice(0, 50).forEach(producto => {

        const tarjeta = document.createElement("div");

        tarjeta.className = "col-md-4 col-lg-3 mb-4";

        const imagen =
            producto.image_link &&
            producto.image_link.trim() !== ""
                ? producto.image_link
                : "https://via.placeholder.com/300x250?text=Sin+imagen";

        tarjeta.innerHTML = `
            <div class="card h-100 shadow-sm">

                <img
                    src="${imagen}"
                    class="card-img-top"
                    alt="${producto.name || "Producto"}"
                    onerror="this.src='https://via.placeholder.com/300x250?text=Sin+imagen'"
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
                        ${producto.price ? "$" + producto.price : "No disponible"}
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

    const texto = buscador
        ? buscador.value.toLowerCase()
        : "";

    const tipo = categoria
        ? categoria.value
        : "todos";

    const resultado = productos.filter(producto => {

        const nombre =
            (producto.name || "").toLowerCase();

        const marca =
            (producto.brand || "").toLowerCase();

        const categoriaProducto =
            producto.product_type || "";

        const coincideTexto =
            nombre.includes(texto) ||
            marca.includes(texto);

        const coincideCategoria =
            tipo === "todos" ||
            categoriaProducto === tipo;

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

    const producto =
        JSON.parse(datos);

    const imagen =
        document.getElementById("imagenProducto");

    const nombre =
        document.getElementById("nombreProducto");

    const marca =
        document.getElementById("marcaProducto");

    const categoriaProducto =
        document.getElementById("categoriaProducto");

    const precio =
        document.getElementById("precioProducto");

    const descripcion =
        document.getElementById("descripcionProducto");

    if (imagen) {

        imagen.src =
            producto.image_link &&
            producto.image_link.trim() !== ""
                ? producto.image_link
                : "https://via.placeholder.com/400x400?text=Sin+imagen";

        imagen.onerror = function() {
            this.src =
                "https://via.placeholder.com/400x400?text=Sin+imagen";
        };
    }

    if (nombre) {
        nombre.textContent =
            producto.name || "Sin nombre";
    }

    if (marca) {
        marca.textContent =
            "Marca: " +
            (producto.brand || "No disponible");
    }

    if (categoriaProducto) {
        categoriaProducto.textContent =
            "Categoría: " +
            (producto.product_type || "No disponible");
    }

    if (precio) {
        precio.textContent =
            producto.price
                ? "Precio: $" + producto.price
                : "Precio: No disponible";
    }

    if (descripcion) {
        descripcion.textContent =
            producto.description ||
            "No hay descripción disponible.";
    }
}

if (contenedorProductos) {
    obtenerProductos();
}

if (buscador) {
    buscador.addEventListener(
        "input",
        filtrarProductos
    );
}

if (categoria) {
    categoria.addEventListener(
        "change",
        filtrarProductos
    );
}

if (document.getElementById("detalleProducto")) {
    cargarDetalle();
}
