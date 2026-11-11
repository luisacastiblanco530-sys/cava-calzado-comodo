

// =====================================
// PRODUCTOS CAVA
// =====================================

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

// =====================================
// MOSTRAR PRODUCTOS EN EL CATÁLOGO
// =====================================

function mostrarProductos(lista) {

    const contenedor = document.getElementById("productos");

    if (!contenedor) {
        return;
    }

    contenedor.innerHTML = "";

    lista.forEach(function(producto) {

        const tarjeta = document.createElement("div");

        tarjeta.className = "producto";

        tarjeta.innerHTML = `
            <img
                src="img/zapatos-cava.jpg"
                alt="${producto.nombre}"
                class="producto-imagen"
            >

            <h3>${producto.nombre}</h3>

            <p>Precio: $${producto.precio.toLocaleString("es-CO")}</p>

            <button
                type="button"
                onclick="agregarCarrito(${producto.id})"
            >
                Agregar al carrito
            </button>
        `;

        contenedor.appendChild(tarjeta);

    });
}


// Mostrar los seis productos al abrir la página
mostrarProductos(productos);


// =====================================
// CONFIGURACIÓN
// =====================================

// IMPORTANTE:
// Cambia este número por el WhatsApp real de CAVA.
// Debe llevar 57 y el número completo, sin espacios.

const WHATSAPP_CAVA = "3134902922";


// =====================================
// CARRITO
// =====================================

let carrito = [];

let personalizacionActual = null;


// =====================================
// SELECCIONAR MODELO DEL CATÁLOGO
// =====================================

function seleccionarModelo(modelo) {

    const campoModelo = document.getElementById("modelo");
    const campoPedido = document.getElementById("pedidoModelo");

    if (campoModelo) {
        campoModelo.value = modelo;
    }

    if (campoPedido) {
        campoPedido.value = modelo;
    }

    document.getElementById("personalizar")
        .scrollIntoView({ behavior: "smooth" });

    actualizarPersonalizacion();
}


// =====================================
// ACTUALIZAR VISTA PREVIA
// =====================================

function actualizarPersonalizacion() {

    const modelo = document.getElementById("modelo").value;
    const color = document.getElementById("color").value;
    const talla = document.getElementById("talla").value;
    const material = document.getElementById("material").value;

    const imagen = document.getElementById("imagenZapato");
    const texto = document.getElementById("textoPersonalizacion");

    if (!modelo || !color || !talla || !material) {

        texto.textContent =
            "Selecciona modelo, color, talla y material para ver tu diseño.";

        return;
    }

    // Mostrar características seleccionadas

    texto.textContent =
        modelo + " | Color: " + color +
        " | Talla: " + talla +
        " | Material: " + material;

    // Efectos aproximados para la vista previa.
    // No generan una imagen nueva ni recolorean
    // perfectamente el zapato.

    const filtros = {
        "Beige": "sepia(0.35) saturate(0.65) brightness(1.12)",
        "Café": "sepia(0.8) saturate(1.2) brightness(0.8)",
        "Negro": "grayscale(0.8) brightness(0.55)",
        "Blanco": "grayscale(0.5) brightness(1.25)"
    };

    imagen.style.filter = filtros[color] || "none";

    personalizacionActual = {
        modelo: modelo,
        color: color,
        talla: talla,
        material: material
    };
}


// =====================================
// AGREGAR PERSONALIZADO AL CARRITO
// =====================================

function agregarPersonalizado() {

    const modelo = document.getElementById("modelo").value;
    const color = document.getElementById("color").value;
    const talla = document.getElementById("talla").value;
    const material = document.getElementById("material").value;

    if (!modelo || !color || !talla || !material) {

        alert("Selecciona el modelo, color, talla y material.");

        return;
    }

    const personalizado = {

        id: Date.now(),

        nombre: "Zapato personalizado CAVA",

        categoria: "personalizado",

        precio: 159900,

        detalles:
            "Modelo: " + modelo +
            ", Color: " + color +
            ", Talla: " + talla +
            ", Material: " + material
    };

    carrito.push(personalizado);

    actualizarCarrito();

    // Pasar modelo y talla al formulario

    document.getElementById("pedidoModelo").value = modelo;
    document.getElementById("pedidoTalla").value = talla;

    // Añadir detalles al pedido

    personalizacionActual = {
        modelo: modelo,
        color: color,
        talla: talla,
        material: material
    };

    alert("¡Tu diseño fue agregado al pedido!");

    document.getElementById("pedido")
        .scrollIntoView({ behavior: "smooth" });
}


// =====================================
// AGREGAR PRODUCTO DEL CATÁLOGO
// =====================================

function agregarCarrito(id) {

    const producto = productos.find(p => p.id === id);

    if (!producto) {
        alert("No encontramos este producto.");
        return;
    }

    carrito.push(producto);

    actualizarCarrito();

    alert(producto.nombre + " fue agregado al carrito.");
}


// =====================================
// ACTUALIZAR CONTADOR DEL CARRITO
// =====================================

function actualizarCarrito() {

    const contador = document.getElementById("contador");

    if (contador) {
        contador.textContent = carrito.length;
    }

}


// =====================================
// ELIMINAR PRODUCTO
// =====================================

function eliminarProducto(index) {

    if (index < 0 || index >= carrito.length) {
        return;
    }

    carrito.splice(index, 1);

    actualizarCarrito();
}


// =====================================
// FILTRAR PRODUCTOS
// =====================================

function filtrarCategoria(categoria) {

    const resultado = productos.filter(
        producto => producto.categoria === categoria
    );

    mostrarProductos(resultado);
}


// =====================================
// BUSCADOR
// =====================================

function buscarProducto() {

    const campo = document.getElementById("buscador");

    if (!campo) {
        return;
    }

    const texto = campo.value.toLowerCase();

    const resultado = productos.filter(
        producto => producto.nombre.toLowerCase().includes(texto)
    );

    mostrarProductos(resultado);
}


// =====================================
// ENVIAR PEDIDO POR WHATSAPP
// =====================================

document.getElementById("formPedido").addEventListener("submit", function(event) {

    event.preventDefault();

    const nombre = document.getElementById("nombre").value.trim();
    const telefono = document.getElementById("telefono").value.trim();
    const modelo = document.getElementById("pedidoModelo").value;
    const talla = document.getElementById("pedidoTalla").value;
    const cantidad = document.getElementById("cantidad").value;
    const pago = document.getElementById("pago").value;
    const envio = document.getElementById("envio").value;
    const direccion = document.getElementById("direccion").value.trim();
    const observaciones = document.getElementById("observaciones").value.trim();

    if (!nombre || !telefono || !modelo || !talla ||
        !cantidad || !pago || !envio || !direccion) {

        alert("Completa todos los campos obligatorios.");

        return;
    }

    if (Number(cantidad) < 1) {

        alert("La cantidad debe ser de al menos un par.");

        return;
    }

    // Crear resumen del pedido

    let mensaje =
        "¡Hola CAVA! Quiero realizar un pedido.%0A%0A" +
        "*DATOS DEL CLIENTE*%0A" +
        "Nombre: " + encodeURIComponent(nombre) + "%0A" +
        "Teléfono: " + encodeURIComponent(telefono) + "%0A%0A" +
        "*DATOS DEL CALZADO*%0A" +
        "Modelo: " + encodeURIComponent(modelo) + "%0A" +
        "Talla: " + encodeURIComponent(talla) + "%0A" +
        "Cantidad: " + encodeURIComponent(cantidad) + "%0A";

    // Incluir detalles de personalización si existen

    if (personalizacionActual) {

        mensaje +=
            "Color: " + encodeURIComponent(personalizacionActual.color) + "%0A" +
            "Material: " + encodeURIComponent(personalizacionActual.material) + "%0A";
    }

    mensaje +=
        "%0A*MÉTODO DE PAGO Y ENVÍO*%0A" +
        "Pago: " + encodeURIComponent(pago) + "%0A" +
        "Envío: " + encodeURIComponent(envio) + "%0A" +
        "Dirección: " + encodeURIComponent(direccion) + "%0A";

    if (observaciones) {

        mensaje +=
            "%0A*OBSERVACIONES*%0A" +
            encodeURIComponent(observaciones);
    }

    // Abrir WhatsApp con el pedido listo

    const enlace =
        "https://wa.me/" + WHATSAPP_CAVA +
        "?text=" + mensaje;

    window.open(enlace, "_blank");

});
