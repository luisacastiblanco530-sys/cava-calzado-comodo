// ================================
// PRODUCTOS DE CAVA
// ================================

const productos = [

    {
        id: 1,
        nombre: "CAVA Casual Blanco",
        categoria: "casual",
        precio: 89900
    },

    {
        id: 2,
        nombre: "CAVA Deportivo Negro",
        categoria: "deportivo",
        precio: 119900
    },

    {
        id: 3,
        nombre: "CAVA Elegante Café",
        categoria: "elegante",
        precio: 139900
    },

    {
        id: 4,
        nombre: "CAVA Casual Beige",
        categoria: "casual",
        precio: 94900
    },

    {
        id: 5,
        nombre: "CAVA Deportivo Blanco",
        categoria: "deportivo",
        precio: 124900
    },

    {
        id: 6,
        nombre: "CAVA Elegante Negro",
        categoria: "elegante",
        precio: 149900
    }

];


// ================================
// CARRITO
// ================================

let carrito = [];


// Mostrar productos al abrir la página

mostrarProductos(productos);


// ================================
// MOSTRAR PRODUCTOS
// ================================

function mostrarProductos(lista) {

    const contenedor =
        document.getElementById("productos");

    contenedor.innerHTML = "";


    if (lista.length === 0) {

        contenedor.innerHTML =
            "<p>No encontramos productos.</p>";

        return;

    }


    lista.forEach(producto => {

        const tarjeta =
            document.createElement("div");

        tarjeta.className = "producto";


        tarjeta.innerHTML = `

            <div class="producto-imagen"></div>

            <div class="producto-info">

                <h3>
                    ${producto.nombre}
                </h3>

                <p>
                    Calzado CAVA de excelente calidad.
                </p>

                <div class="precio">
                    $${producto.precio.toLocaleString("es-CO")}
                </div>

                <button
                    onclick="agregarCarrito(${producto.id})"
                >
                    Agregar al carrito
                </button>

            </div>

        `;


        contenedor.appendChild(tarjeta);

    });

}


// ================================
// AGREGAR AL CARRITO
// ================================

function agregarCarrito(id) {

    const producto =
        productos.find(p => p.id === id);


    carrito.push(producto);


    actualizarCarrito();


    alert(
        producto.nombre +
        " fue agregado al carrito."
    );

}


// ================================
// ACTUALIZAR CARRITO
// ================================

function actualizarCarrito() {

    const lista =
        document.getElementById("lista-carrito");

    const contador =
        document.getElementById("contador-carrito");

    const total =
        document.getElementById("total-carrito");


    contador.textContent =
        carrito.length;


    lista.innerHTML = "";


    if (carrito.length === 0) {

        lista.innerHTML =
            "<p>Tu carrito está vacío.</p>";

        total.textContent = "$0";

        return;

    }


    let suma = 0;


    carrito.forEach((producto, index) => {

        suma += producto.precio;


        const item =
            document.createElement("div");


        item.style.padding = "15px 0";

        item.style.borderBottom =
            "1px solid #ddd";


        item.innerHTML = `

            <strong>
                ${producto.nombre}
            </strong>

            <p>
                $${producto.precio.toLocaleString("es-CO")}
            </p>

            <button
                onclick="eliminarProducto(${index})"
            >
                Eliminar
            </button>

        `;


        lista.appendChild(item);

    });


    total.textContent =
        "$" + suma.toLocaleString("es-CO");

}


// ================================
// ELIMINAR PRODUCTO
// ================================

function eliminarProducto(index) {

    carrito.splice(index, 1);

    actualizarCarrito();

}


// ================================
// ABRIR CARRITO
// ================================

function abrirCarrito() {

    document
        .getElementById("carrito")
        .classList
        .add("activo");

}


// ================================
// CERRAR CARRITO
// ================================

function cerrarCarrito() {

    document
        .getElementById("carrito")
        .classList
        .remove("activo");

}


// ================================
// FILTRAR CATEGORÍAS
// ================================

function filtrarCategoria(categoria) {

    const resultado =
        productos.filter(
            producto =>
                producto.categoria === categoria
        );


    mostrarProductos(resultado);


    document
        .getElementById("productos")
        .scrollIntoView({
            behavior: "smooth"
        });

}


// ================================
// BUSCADOR
// ================================

function buscarProducto() {

    const texto =
        document
            .getElementById("buscador")
            .value
            .toLowerCase();


    const resultado =
        productos.filter(producto =>

            producto.nombre
                .toLowerCase()
                .includes(texto)

        );


    mostrarProductos(resultado);

}


// ================================
// PERSONALIZACIÓN
// ================================

function agregarPersonalizado() {

    const modelo =
        document.getElementById("modelo").value;

    const talla =
        document.getElementById("talla").value;

    const color =
        document.getElementById("color").value;

    const material =
        document.getElementById("material").value;


    const personalizado = {

        id: Date.now(),

        nombre:
            "Zapato personalizado",

        categoria:
            "personalizado",

        precio:
            159900,

        detalles:
            `Modelo: ${modelo} | Talla: ${talla} | Color: ${color} | Material: ${material}`

    };


    carrito.push(personalizado);


    actualizarCarrito();


    alert(
        "¡Tu diseño personalizado fue agregado al carrito!"
    );


    abrirCarrito();

}
// ==================== FORMULARIO DE PEDIDO ====================

function mostrarPedido() {
    document.getElementById("carrito").style.display = "none";
    document.getElementById("pedido").style.display = "flex";
}

function cerrarPedido() {
    document.getElementById("pedido").style.display = "none";
    document.getElementById("carrito").style.display = "flex";
}

function confirmarPedido() {

    const nombre = document.getElementById("nombrePedido").value;
    const telefono = document.getElementById("telefonoPedido").value;
    const direccion = document.getElementById("direccionPedido").value;
    const pago = document.getElementById("pagoPedido").value;

    if (!nombre || !telefono || !direccion || !pago) {
        alert("Por favor completa todos los datos del pedido.");
        return;
    }

    alert(
        "¡Pedido recibido, " + nombre + "!\n\n" +
        "Gracias por comprar en CAVA.\n" +
        "Nos comunicaremos contigo al " + telefono +
        " para confirmar tu pedido."
    );
}