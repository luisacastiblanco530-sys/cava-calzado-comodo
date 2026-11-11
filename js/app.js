"use strict";

// =====================================================
// CONFIGURACIÓN GENERAL
// =====================================================

// IMPORTANTE: poner aquí el WhatsApp real de CAVA
// (57 = código de Colombia, sin espacios ni signos).
const WHATSAPP_CAVA = "573130000000";

const CLAVE_CARRITO = "cava-carrito";


// =====================================================
// DATOS: COLORES, OPCIONES Y PRECIOS
// Todo el precio sale de aquí: si cambia un precio,
// solo se cambia en un lugar.
// =====================================================

const COLORES = {
    negro:  { nombre: "Negro",       hex: "#1f1a17" },
    blanco: { nombre: "Blanco",      hex: "#f4f1ec" },
    rojo:   { nombre: "Rojo",        hex: "#a8262b" },
    azul:   { nombre: "Azul",        hex: "#1f4e8c" },
    beige:  { nombre: "Beige",       hex: "#d9c4a3" },
    cafe:   { nombre: "Café",        hex: "#6b4226" },
    oliva:  { nombre: "Verde oliva", hex: "#5d6a3b" },
    miel:   { nombre: "Miel",        hex: "#c69c6d" }
};

const OPCIONES = {
    modelos: {
        casual:    { nombre: "Casual",    precio: 129900 },
        deportivo: { nombre: "Deportivo", precio: 149900 },
        elegante:  { nombre: "Elegante",  precio: 169900 }
    },
    capellada: ["negro", "blanco", "rojo", "azul", "beige", "cafe", "oliva"],
    suela:     ["blanco", "negro", "miel", "cafe"],
    cordones:  ["blanco", "negro", "beige", "cafe", "rojo"],
    materiales: {
        sintetico: { nombre: "Sintético", precio: 0 },
        tela:      { nombre: "Tela",      precio: 0 },
        cuero:     { nombre: "Cuero",     precio: 30000 }
    },
    tallas: [34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44],
    precioTexto: 15000,
    precioPlantilla: 12000,
    maxTexto: 10
};

const DISENO_INICIAL = {
    modelo: "casual",
    capellada: "negro",
    suela: "blanco",
    cordones: "blanco",
    material: "sintetico",
    talla: "",
    texto: "",
    plantilla: false
};


// =====================================================
// PRODUCTOS DEL CATÁLOGO
// Cada producto tiene un "diseno" para dibujarlo
// y para poder abrirlo en el configurador.
// =====================================================

const productos = [
    { id: 1, nombre: "CAVA Casual Blanco",    categoria: "casual",    precio: 89900,
      diseno: { modelo: "casual",    capellada: "blanco", suela: "miel",   cordones: "blanco", material: "cuero" } },
    { id: 2, nombre: "CAVA Deportivo Negro",  categoria: "deportivo", precio: 119900,
      diseno: { modelo: "deportivo", capellada: "negro",  suela: "blanco", cordones: "negro",  material: "sintetico" } },
    { id: 3, nombre: "CAVA Elegante Café",    categoria: "elegante",  precio: 139900,
      diseno: { modelo: "elegante",  capellada: "cafe",   suela: "negro",  cordones: "cafe",   material: "cuero" } },
    { id: 4, nombre: "CAVA Casual Beige",     categoria: "casual",    precio: 94900,
      diseno: { modelo: "casual",    capellada: "beige",  suela: "blanco", cordones: "beige",  material: "tela" } },
    { id: 5, nombre: "CAVA Deportivo Blanco", categoria: "deportivo", precio: 124900,
      diseno: { modelo: "deportivo", capellada: "blanco", suela: "miel",   cordones: "blanco", material: "sintetico" } },
    { id: 6, nombre: "CAVA Elegante Negro",   categoria: "elegante",  precio: 149900,
      diseno: { modelo: "elegante",  capellada: "negro",  suela: "negro",  cordones: "negro",  material: "cuero" } }
];


// =====================================================
// UTILIDADES
// =====================================================

function $(id) {
    return document.getElementById(id);
}

function formatoPrecio(valor) {
    return "$" + valor.toLocaleString("es-CO");
}

// Evita que un texto escrito por el usuario se convierta en HTML.
// (Sin esto, alguien podría escribir <script> en sus iniciales.)
function escaparHTML(texto) {
    return String(texto)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");
}

// Quita tildes y pasa a minúsculas: "Café" → "cafe"
function normalizar(texto) {
    return texto.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
}

// Deja solo letras, números, espacios, punto, guion y &
function limpiarTextoPersonal(texto) {
    return texto
        .replace(/[^A-Za-zÁÉÍÓÚÜÑáéíóúüñ0-9 .&-]/g, "")
        .slice(0, OPCIONES.maxTexto);
}

function colorHex(id) {
    return (COLORES[id] || COLORES.negro).hex;
}

function nombreColor(id) {
    return (COLORES[id] || COLORES.negro).nombre;
}

// ¿El color es claro? Sirve para elegir texto oscuro o claro encima.
function esClaro(hex) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return (0.299 * r + 0.587 * g + 0.114 * b) / 255 > 0.6;
}

let temporizadorAviso;

// Mensaje corto en pantalla (reemplaza alert)
function mostrarAviso(mensaje) {
    const aviso = $("aviso");
    aviso.textContent = mensaje;
    aviso.classList.add("visible");
    clearTimeout(temporizadorAviso);
    temporizadorAviso = setTimeout(() => aviso.classList.remove("visible"), 3000);
}


// =====================================================
// DIBUJO DEL ZAPATO (SVG)
// Cada modelo tiene sus piezas: capellada (cuerpo),
// talón, puntera, suela y cordones. Cada pieza se
// pinta con el color que elige el cliente.
// =====================================================

const FORMAS = {
    casual: {
        capellada: "M46 176 C42 140 48 110 64 98 C80 92 100 100 130 110 C150 100 165 82 186 76 C200 74 210 84 222 96 C260 128 312 138 356 146 C386 152 402 162 404 178 Z",
        cuello:    "M64 98 C80 92 100 100 130 110 C110 114 82 112 64 98 Z",
        talon:     "M46 176 C42 140 48 110 64 98 L84 104 C76 128 76 154 86 176 Z",
        puntera:   "M340 143 C374 149 402 160 404 178 L332 178 C328 164 330 152 340 143 Z",
        detalle:   "",
        suela:     "M36 176 L410 176 C414 190 404 204 386 206 L58 206 C42 206 34 192 36 176 Z",
        lineaSuela: "M44 190 L404 190",
        cordones:  { desde: [198, 88], hasta: [290, 134], cantidad: 5 },
        texto:     { x: 215, y: 158, tamano: 17 },
        sombraY:   210
    },
    deportivo: {
        capellada: "M50 170 C44 130 50 96 70 82 C86 76 104 86 128 98 C146 84 162 66 184 62 C200 60 210 72 222 86 C262 120 316 132 358 140 C388 146 402 156 404 172 Z",
        cuello:    "M70 82 C86 76 104 86 128 98 C108 102 84 96 70 82 Z",
        talon:     "M50 170 C44 130 50 96 70 82 L88 88 C80 116 80 146 90 170 Z",
        puntera:   "M352 140 C386 146 402 156 404 172 L346 172 C344 160 346 148 352 140 Z",
        detalle:   "M112 168 C170 148 246 126 336 120 C304 140 232 158 172 170 Z",
        suela:     "M38 170 L410 170 C416 190 408 210 386 214 L60 214 C40 214 32 192 38 170 Z",
        lineaSuela: "M70 202 L90 214 M110 202 L130 214 M150 202 L170 214 M190 202 L210 214 M230 202 L250 214 M270 202 L290 214 M310 202 L330 214 M350 202 L370 214",
        cordones:  { desde: [192, 74], hasta: [292, 126], cantidad: 5 },
        texto:     { x: 200, y: 140, tamano: 16 },
        sombraY:   218
    },
    elegante: {
        capellada: "M52 168 C48 140 54 120 70 112 C96 116 130 122 160 116 C176 110 190 106 206 108 C250 118 320 136 366 150 C392 158 404 164 406 172 Z",
        cuello:    "M70 112 C96 116 130 122 160 116 C130 128 96 126 70 112 Z",
        talon:     "M52 168 C48 140 54 120 70 112 L92 118 C84 136 86 152 94 168 Z",
        puntera:   "M330 141 C372 152 404 164 406 172 L326 172 C322 160 324 150 330 141 Z",
        detalle:   "",
        suela:     "M44 168 L412 168 C416 176 412 184 400 186 L150 186 C136 186 128 188 124 191 L120 200 L58 200 L52 184 C46 180 43 174 44 168 Z",
        lineaSuela: "",
        cordones:  { desde: [192, 108], hasta: [246, 120], cantidad: 3 },
        texto:     { x: 230, y: 152, tamano: 14 },
        sombraY:   203
    }
};

let contadorSvg = 0;

function dibujarCordones(forma, color) {
    const { desde, hasta, cantidad } = forma.cordones;
    const dx = hasta[0] - desde[0];
    const dy = hasta[1] - desde[1];
    const largo = Math.hypot(dx, dy);
    // Dirección perpendicular a la línea de los cordones
    const px = dy / largo;
    const py = -dx / largo;
    const medida = 9;      // medio largo de cada cordón
    const adentro = 12;    // los cordones se bajan para quedar sobre el zapato

    let lineas = "";

    for (let i = 0; i < cantidad; i++) {
        const t = cantidad === 1 ? 0 : i / (cantidad - 1);
        const x = desde[0] + dx * t - px * adentro;
        const y = desde[1] + dy * t - py * adentro;
        const x1 = (x - px * medida).toFixed(1);
        const y1 = (y - py * medida).toFixed(1);
        const x2 = (x + px * medida).toFixed(1);
        const y2 = (y + py * medida).toFixed(1);

        lineas += `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="rgba(0,0,0,.35)" stroke-width="7" stroke-linecap="round"/>`;
        lineas += `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${color}" stroke-width="4.5" stroke-linecap="round"/>`;
    }

    return lineas;
}

function dibujarZapato(diseno) {
    const id = "z" + (++contadorSvg); // id único por si hay varios dibujos en la página
    const forma = FORMAS[diseno.modelo] || FORMAS.casual;

    const capellada = colorHex(diseno.capellada);
    const suela = colorHex(diseno.suela);
    const cordones = colorHex(diseno.cordones);
    const contraste = esClaro(capellada) ? "#2f1b0c" : "#fffaf3";
    const borde = "rgba(0,0,0,.35)";

    const texturas = {
        tela:      `url(#${id}-tela)`,
        cuero:     `url(#${id}-cuero)`,
        sintetico: `url(#${id}-brillo)`
    };
    const textura = texturas[diseno.material] || texturas.sintetico;

    const texto = diseno.texto ? escaparHTML(diseno.texto) : "";
    const tamanoTexto = diseno.texto && diseno.texto.length > 7
        ? forma.texto.tamano * 0.8
        : forma.texto.tamano;

    return `
<svg viewBox="0 0 440 230" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
  <defs>
    <linearGradient id="${id}-volumen" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#fff" stop-opacity=".18"/>
      <stop offset=".55" stop-color="#fff" stop-opacity="0"/>
      <stop offset="1" stop-color="#000" stop-opacity=".22"/>
    </linearGradient>
    <pattern id="${id}-tela" width="5" height="5" patternUnits="userSpaceOnUse">
      <path d="M0 5 L5 0" stroke="#000" stroke-opacity=".16" stroke-width="1"/>
      <path d="M0 0 L5 5" stroke="#fff" stroke-opacity=".12" stroke-width="1"/>
    </pattern>
    <radialGradient id="${id}-cuero" cx=".35" cy=".25" r=".8">
      <stop offset="0" stop-color="#fff" stop-opacity=".38"/>
      <stop offset=".45" stop-color="#fff" stop-opacity=".04"/>
      <stop offset="1" stop-color="#000" stop-opacity=".12"/>
    </radialGradient>
    <linearGradient id="${id}-brillo" x1="0" y1="0" x2="1" y2=".3">
      <stop offset=".3" stop-color="#fff" stop-opacity="0"/>
      <stop offset=".45" stop-color="#fff" stop-opacity=".2"/>
      <stop offset=".6" stop-color="#fff" stop-opacity="0"/>
    </linearGradient>
  </defs>

  <ellipse cx="222" cy="${forma.sombraY}" rx="190" ry="9" fill="#000" opacity=".14"/>

  <path d="${forma.suela}" fill="${suela}" stroke="${borde}" stroke-width="1.5"/>
  ${forma.lineaSuela ? `<path d="${forma.lineaSuela}" stroke="rgba(0,0,0,.25)" stroke-width="2" fill="none"/>` : ""}

  <path d="${forma.capellada}" fill="${capellada}" stroke="${borde}" stroke-width="1.5"/>
  <path d="${forma.capellada}" fill="${textura}"/>

  <path d="${forma.talon}" fill="${capellada}" stroke="${borde}" stroke-width="1.2"/>
  <path d="${forma.talon}" fill="#000" opacity=".1"/>
  <path d="${forma.talon}" fill="none" stroke="${contraste}" stroke-opacity=".45" stroke-width="1" stroke-dasharray="4 3" transform="translate(3 0)"/>

  <path d="${forma.puntera}" fill="${capellada}" stroke="${borde}" stroke-width="1.2"/>
  <path d="${forma.puntera}" fill="#000" opacity=".1"/>
  <path d="${forma.puntera}" fill="none" stroke="${contraste}" stroke-opacity=".45" stroke-width="1" stroke-dasharray="4 3" transform="translate(-3 0)"/>

  ${forma.detalle ? `<path d="${forma.detalle}" fill="${suela}" stroke="${borde}" stroke-width="1.2"/>` : ""}

  <path d="${forma.capellada}" fill="url(#${id}-volumen)"/>
  <path d="${forma.cuello}" fill="#2b211b"/>

  ${dibujarCordones(forma, cordones)}

  ${texto ? `<text x="${forma.texto.x}" y="${forma.texto.y}" text-anchor="middle"
        font-family="Georgia, serif" font-style="italic" font-weight="bold"
        font-size="${tamanoTexto}" letter-spacing="1.5" fill="${contraste}">${texto}</text>` : ""}
</svg>`;
}


// =====================================================
// CARRITO (se guarda en el navegador para no perderlo
// si la persona recarga la página)
// =====================================================

let carrito = cargarCarrito();

function cargarCarrito() {
    try {
        const guardado = JSON.parse(localStorage.getItem(CLAVE_CARRITO));
        return Array.isArray(guardado) ? guardado : [];
    } catch (error) {
        return [];
    }
}

function guardarCarrito() {
    try {
        localStorage.setItem(CLAVE_CARRITO, JSON.stringify(carrito));
    } catch (error) {
        // Si el navegador no deja guardar, el carrito igual funciona
    }
}

function agregarItem(item) {
    const existente = carrito.find(p => p.clave === item.clave);

    if (existente) {
        existente.cantidad++;
    } else {
        carrito.push({ ...item, cantidad: 1 });
    }

    guardarCarrito();
    actualizarCarrito();
}

function cambiarCantidad(clave, cambio) {
    const item = carrito.find(p => p.clave === clave);
    if (!item) return;

    item.cantidad += cambio;

    if (item.cantidad <= 0) {
        carrito = carrito.filter(p => p.clave !== clave);
    }

    guardarCarrito();
    actualizarCarrito();
}

function eliminarProducto(clave) {
    carrito = carrito.filter(p => p.clave !== clave);
    guardarCarrito();
    actualizarCarrito();
}

function totalCarrito() {
    return carrito.reduce((suma, p) => suma + p.precio * p.cantidad, 0);
}

function actualizarCarrito() {
    const lista = $("lista-carrito");
    const unidades = carrito.reduce((suma, p) => suma + p.cantidad, 0);

    $("contador-carrito").textContent = unidades;
    $("total-carrito").textContent = formatoPrecio(totalCarrito());

    if (carrito.length === 0) {
        lista.innerHTML = `<p class="vacio">Tu carrito está vacío.<br>Agrega un modelo del catálogo o diseña el tuyo.</p>`;
        return;
    }

    lista.innerHTML = carrito.map(p => `
        <div class="item-carrito">
            <div class="item-imagen">${dibujarZapato(p.diseno)}</div>
            <div class="item-info">
                <strong>${escaparHTML(p.nombre)}</strong>
                <small>${escaparHTML(p.detalles)}</small>
                <span class="item-precio">${formatoPrecio(p.precio * p.cantidad)}</span>
                <div class="item-cantidad">
                    <button data-accion="menos" data-clave="${p.clave}" aria-label="Quitar uno">−</button>
                    <span>${p.cantidad}</span>
                    <button data-accion="mas" data-clave="${p.clave}" aria-label="Agregar uno">+</button>
                    <button data-accion="eliminar" data-clave="${p.clave}" class="eliminar">Eliminar</button>
                </div>
            </div>
        </div>
    `).join("");
}

function abrirCarrito() {
    $("carrito").classList.add("activo");
    $("carrito").setAttribute("aria-hidden", "false");
    $("fondo-oscuro").classList.add("activo");
    document.body.classList.add("sin-scroll");
    $("cerrar-carrito").focus();
}

function cerrarCarrito() {
    $("carrito").classList.remove("activo");
    $("carrito").setAttribute("aria-hidden", "true");
    $("fondo-oscuro").classList.remove("activo");
    document.body.classList.remove("sin-scroll");
}


// =====================================================
// CATÁLOGO: MOSTRAR, FILTRAR Y BUSCAR
// =====================================================

let categoriaActiva = "";

function mostrarProductos(lista) {
    const contenedor = $("productos");

    if (lista.length === 0) {
        contenedor.innerHTML = `<p class="vacio">No encontramos productos con esa búsqueda. Prueba con otra palabra o pulsa “Ver todos”.</p>`;
        return;
    }

    const opcionesTalla = OPCIONES.tallas.map(t => `<option>${t}</option>`).join("");

    contenedor.innerHTML = lista.map(producto => `
        <div class="producto">
            <div class="producto-imagen">${dibujarZapato(producto.diseno)}</div>
            <div class="producto-info">
                <h3>${producto.nombre}</h3>
                <p>${OPCIONES.materiales[producto.diseno.material].nombre} · Calzado CAVA de excelente calidad.</p>
                <div class="precio">${formatoPrecio(producto.precio)}</div>

                <label class="sr-only" for="talla-${producto.id}">Talla</label>
                <select id="talla-${producto.id}" class="talla-producto">
                    <option value="">Talla</option>
                    ${opcionesTalla}
                </select>

                <button data-agregar="${producto.id}">Agregar al carrito</button>
                <button class="personalizar-este" data-personalizar="${producto.id}">Personalizar este modelo</button>
            </div>
        </div>
    `).join("");
}

function aplicarFiltros() {
    const texto = normalizar($("buscador").value.trim());

    const resultado = productos.filter(p =>
        (!categoriaActiva || p.categoria === categoriaActiva) &&
        normalizar(p.nombre).includes(texto)
    );

    mostrarProductos(resultado);

    document.querySelectorAll(".btn-categoria").forEach(boton => {
        boton.classList.toggle("activa", boton.dataset.categoria === categoriaActiva);
    });

    $("filtro-activo").textContent = categoriaActiva
        ? `Mostrando: ${OPCIONES.modelos[categoriaActiva].nombre} (${resultado.length})`
        : "";
}

function filtrarCategoria(categoria) {
    categoriaActiva = categoria;
    aplicarFiltros();
    $("productos").scrollIntoView({ behavior: "smooth", block: "start" });
}

function verTodos() {
    categoriaActiva = "";
    $("buscador").value = "";
    aplicarFiltros();
}

function agregarDelCatalogo(id) {
    const producto = productos.find(p => p.id === id);
    const selectTalla = $("talla-" + id);
    const talla = selectTalla.value;

    if (!talla) {
        selectTalla.classList.add("con-error");
        selectTalla.focus();
        mostrarAviso("Elige una talla antes de agregar el zapato.");
        return;
    }

    selectTalla.classList.remove("con-error");

    agregarItem({
        clave: `c-${id}-${talla}`,
        nombre: producto.nombre,
        precio: producto.precio,
        detalles: `Talla ${talla}`,
        diseno: producto.diseno
    });

    mostrarAviso(`${producto.nombre} (talla ${talla}) se agregó al carrito.`);
}


// =====================================================
// CONFIGURADOR DE PERSONALIZACIÓN
// =====================================================

let diseno = { ...DISENO_INICIAL };

function crearOpcionesConfigurador() {

    // Modelos (con un dibujo pequeño de cada uno)
    $("opcion-modelo").innerHTML = Object.entries(OPCIONES.modelos).map(([clave, modelo]) => `
        <label class="opcion-modelo">
            <input type="radio" name="modelo" value="${clave}">
            <span class="tarjeta">
                <span class="mini">${dibujarZapato({ modelo: clave, capellada: "cafe", suela: "miel", cordones: "beige", material: "cuero" })}</span>
                <span class="nombre">${modelo.nombre}</span>
                <span class="desde">desde ${formatoPrecio(modelo.precio)}</span>
            </span>
        </label>
    `).join("");

    // Muestras de color para capellada, suela y cordones
    ["capellada", "suela", "cordones"].forEach(parte => {
        $("opcion-" + parte).innerHTML = OPCIONES[parte].map(color => `
            <label class="muestra" title="${nombreColor(color)}">
                <input type="radio" name="${parte}" value="${color}">
                <span class="circulo" style="--muestra:${colorHex(color)}"></span>
                <span class="sr-only">${nombreColor(color)}</span>
            </label>
        `).join("");
    });

    // Materiales
    $("opcion-material").innerHTML = Object.entries(OPCIONES.materiales).map(([clave, material]) => `
        <label class="opcion-material">
            <input type="radio" name="material" value="${clave}">
            <span>${material.nombre}${material.precio ? ` <small>+${formatoPrecio(material.precio)}</small>` : ""}</span>
        </label>
    `).join("");

    // Tallas
    $("talla").insertAdjacentHTML("beforeend",
        OPCIONES.tallas.map(t => `<option value="${t}">${t}</option>`).join(""));
}

// Pone en el formulario lo que tenga el objeto "diseno"
function sincronizarFormulario() {
    const form = $("form-configurador");

    ["modelo", "capellada", "suela", "cordones", "material"].forEach(campo => {
        const opcion = form.querySelector(`input[name="${campo}"][value="${diseno[campo]}"]`);
        if (opcion) opcion.checked = true;
    });

    $("talla").value = diseno.talla;
    $("texto-personal").value = diseno.texto;
    $("plantilla").checked = diseno.plantilla;
}

// Lee el formulario y guarda los valores en "diseno"
function leerFormulario() {
    const form = $("form-configurador");
    const valor = campo => {
        const marcado = form.querySelector(`input[name="${campo}"]:checked`);
        return marcado ? marcado.value : diseno[campo];
    };

    const campoTexto = $("texto-personal");
    const limpio = limpiarTextoPersonal(campoTexto.value);
    if (campoTexto.value !== limpio) campoTexto.value = limpio;

    diseno = {
        modelo: valor("modelo"),
        capellada: valor("capellada"),
        suela: valor("suela"),
        cordones: valor("cordones"),
        material: valor("material"),
        talla: $("talla").value,
        texto: limpio.trim(),
        plantilla: $("plantilla").checked
    };
}

function calcularPrecio(d) {
    const modelo = OPCIONES.modelos[d.modelo];
    const material = OPCIONES.materiales[d.material];

    const lineas = [[`Modelo ${modelo.nombre}`, modelo.precio]];
    if (material.precio) lineas.push([`Material ${material.nombre}`, material.precio]);
    if (d.texto) lineas.push([`Texto “${d.texto}”`, OPCIONES.precioTexto]);
    if (d.plantilla) lineas.push(["Plantilla ergonómica", OPCIONES.precioPlantilla]);

    const total = lineas.reduce((suma, linea) => suma + linea[1], 0);
    return { lineas, total };
}

function describirDiseno(d) {
    let texto = `${OPCIONES.modelos[d.modelo].nombre} en ${OPCIONES.materiales[d.material].nombre.toLowerCase()} ` +
        `color ${nombreColor(d.capellada).toLowerCase()}, suela color ${nombreColor(d.suela).toLowerCase()} ` +
        `y cordones color ${nombreColor(d.cordones).toLowerCase()}`;
    if (d.talla) texto += `, talla ${d.talla}`;
    if (d.texto) texto += `, con el texto “${d.texto}”`;
    if (d.plantilla) texto += ", con plantilla ergonómica";
    return texto + ".";
}

function actualizarVistaPrevia() {
    const preview = $("zapato-preview");
    preview.innerHTML = dibujarZapato(diseno);

    const descripcion = describirDiseno(diseno);
    preview.setAttribute("aria-label", "Vista previa: " + descripcion);
    $("resumen-diseno").textContent = descripcion;

    // Nombre del color elegido al lado de cada título
    ["capellada", "suela", "cordones"].forEach(parte => {
        document.querySelector(`[data-nombre="${parte}"]`).textContent = nombreColor(diseno[parte]);
    });

    const { lineas, total } = calcularPrecio(diseno);
    $("desglose-precio").innerHTML = lineas.map(([concepto, valor]) =>
        `<li><span>${escaparHTML(concepto)}</span><span>${formatoPrecio(valor)}</span></li>`
    ).join("");
    $("precio-personalizado").textContent = formatoPrecio(total);

    $("contador-texto").textContent = `${$("texto-personal").value.length} / ${OPCIONES.maxTexto} caracteres`;
}

function alCambiarConfigurador(evento) {
    leerFormulario();
    actualizarVistaPrevia();

    if (evento && evento.target.id === "talla" && diseno.talla) {
        $("error-configurador").textContent = "";
        $("talla").classList.remove("con-error");
    }
}

function agregarPersonalizado(evento) {
    evento.preventDefault();
    leerFormulario();

    if (!diseno.talla) {
        $("error-configurador").textContent = "Elige una talla para poder agregar tu diseño.";
        $("talla").classList.add("con-error");
        $("talla").focus();
        return;
    }

    const { total } = calcularPrecio(diseno);
    const modelo = OPCIONES.modelos[diseno.modelo].nombre;

    const detalles = [
        `Talla ${diseno.talla}`,
        OPCIONES.materiales[diseno.material].nombre,
        `Color ${nombreColor(diseno.capellada)}`,
        `Suela ${nombreColor(diseno.suela)}`,
        `Cordones ${nombreColor(diseno.cordones)}`,
        diseno.texto ? `Texto: ${diseno.texto}` : "",
        diseno.plantilla ? "Plantilla ergonómica" : ""
    ].filter(Boolean).join(" · ");

    agregarItem({
        clave: "p-" + Date.now(),
        nombre: `Zapato personalizado ${modelo}`,
        precio: total,
        detalles: detalles,
        diseno: { ...diseno }
    });

    mostrarAviso("¡Tu diseño personalizado se agregó al carrito!");
    abrirCarrito();
}

function restablecerConfigurador() {
    diseno = { ...DISENO_INICIAL };
    sincronizarFormulario();
    $("error-configurador").textContent = "";
    $("talla").classList.remove("con-error");
    actualizarVistaPrevia();
}

// Abre un modelo del catálogo en el configurador
function personalizarProducto(id) {
    const producto = productos.find(p => p.id === id);
    diseno = { ...DISENO_INICIAL, ...producto.diseno };
    sincronizarFormulario();
    actualizarVistaPrevia();
    $("configurador").scrollIntoView({ behavior: "smooth", block: "start" });
    mostrarAviso(`Ahora puedes personalizar el ${producto.nombre}.`);
}


// =====================================================
// FORMULARIO DE PEDIDO
// =====================================================

function mostrarPedido() {
    if (carrito.length === 0) {
        mostrarAviso("Tu carrito está vacío. Agrega al menos un zapato.");
        return;
    }

    $("resumen-pedido").innerHTML = `
        <ul>
            ${carrito.map(p => `<li><span>${p.cantidad} × ${escaparHTML(p.nombre)}</span><span>${formatoPrecio(p.precio * p.cantidad)}</span></li>`).join("")}
        </ul>
        <p class="resumen-total"><strong>Total: ${formatoPrecio(totalCarrito())}</strong></p>
    `;

    $("carrito").classList.remove("activo");
    $("carrito").setAttribute("aria-hidden", "true");
    $("fondo-oscuro").classList.remove("activo");

    $("pedido").classList.add("activo");
    $("pedido").setAttribute("aria-hidden", "false");
    document.body.classList.add("sin-scroll");
    $("nombrePedido").focus();
}

function cerrarPedido() {
    $("pedido").classList.remove("activo");
    $("pedido").setAttribute("aria-hidden", "true");
    document.body.classList.remove("sin-scroll");
}

function volverAlCarrito() {
    cerrarPedido();
    abrirCarrito();
}

function confirmarPedido(evento) {
    evento.preventDefault();

    const nombre = $("nombrePedido").value.trim();
    const telefono = $("telefonoPedido").value.replace(/\D/g, "");
    const direccion = $("direccionPedido").value.trim();
    const pago = $("pagoPedido").value;
    const observaciones = $("observacionesPedido").value.trim();

    let error = "";
    if (nombre.length < 3) error = "Escribe tu nombre completo.";
    else if (telefono.length !== 10) error = "El teléfono debe tener 10 dígitos (ej: 313 000 0000).";
    else if (direccion.length < 8) error = "Escribe la dirección completa: ciudad, barrio y dirección.";
    else if (!pago) error = "Selecciona un método de pago.";

    $("error-pedido").textContent = error;
    if (error) return;

    const lineas = carrito.map(p =>
        `• ${p.cantidad} × ${p.nombre} (${p.detalles}) — ${formatoPrecio(p.precio * p.cantidad)}`
    );

    const mensaje = [
        "Hola CAVA, quiero hacer este pedido:",
        "",
        ...lineas,
        "",
        `Total: ${formatoPrecio(totalCarrito())}`,
        "",
        `Nombre: ${nombre}`,
        `Teléfono: ${telefono}`,
        `Dirección: ${direccion}`,
        `Pago: ${pago}`
    ];
    if (observaciones) mensaje.push(`Observaciones: ${observaciones}`);

    window.open(`https://wa.me/${WHATSAPP_CAVA}?text=${encodeURIComponent(mensaje.join("\n"))}`, "_blank", "noopener");

    carrito = [];
    guardarCarrito();
    actualizarCarrito();
    $("form-pedido").reset();
    cerrarPedido();
    mostrarAviso(`¡Gracias, ${nombre}! Envía el mensaje de WhatsApp para confirmar tu pedido.`);
}


// =====================================================
// MENÚ EN CELULAR
// =====================================================

function alternarMenu(abrir) {
    const menu = $("menu");
    const abierto = typeof abrir === "boolean" ? abrir : !menu.classList.contains("abierto");
    menu.classList.toggle("abierto", abierto);
    $("menu-toggle").setAttribute("aria-expanded", abierto);
    $("menu-toggle").textContent = abierto ? "✕" : "☰";
}


// =====================================================
// EVENTOS (todo se conecta aquí)
// =====================================================

function iniciar() {
    // Catálogo
    document.querySelectorAll(".imagen-producto[data-modelo]").forEach(caja => {
        const producto = productos.find(p => p.categoria === caja.dataset.modelo);
        caja.innerHTML = dibujarZapato(producto.diseno);
    });

    mostrarProductos(productos);

    document.querySelectorAll(".btn-categoria").forEach(boton => {
        boton.addEventListener("click", () => filtrarCategoria(boton.dataset.categoria));
    });

    $("buscador").addEventListener("input", aplicarFiltros);
    $("ver-todos").addEventListener("click", verTodos);

    $("productos").addEventListener("click", evento => {
        const agregar = evento.target.closest("[data-agregar]");
        const personalizar = evento.target.closest("[data-personalizar]");
        if (agregar) agregarDelCatalogo(Number(agregar.dataset.agregar));
        if (personalizar) personalizarProducto(Number(personalizar.dataset.personalizar));
    });

    $("productos").addEventListener("change", evento => {
        if (evento.target.classList.contains("talla-producto")) {
            evento.target.classList.remove("con-error");
        }
    });

    // Configurador
    crearOpcionesConfigurador();
    sincronizarFormulario();
    actualizarVistaPrevia();

    const formConfig = $("form-configurador");
    formConfig.addEventListener("input", alCambiarConfigurador);
    formConfig.addEventListener("change", alCambiarConfigurador);
    formConfig.addEventListener("submit", agregarPersonalizado);
    $("restablecer").addEventListener("click", restablecerConfigurador);

    // Carrito
    actualizarCarrito();
    $("abrir-carrito").addEventListener("click", abrirCarrito);
    $("cerrar-carrito").addEventListener("click", cerrarCarrito);
    $("fondo-oscuro").addEventListener("click", cerrarCarrito);
    $("continuar-pedido").addEventListener("click", mostrarPedido);

    $("lista-carrito").addEventListener("click", evento => {
        const boton = evento.target.closest("[data-accion]");
        if (!boton) return;
        const clave = boton.dataset.clave;
        if (boton.dataset.accion === "mas") cambiarCantidad(clave, 1);
        if (boton.dataset.accion === "menos") cambiarCantidad(clave, -1);
        if (boton.dataset.accion === "eliminar") eliminarProducto(clave);
    });

    // Pedido
    $("form-pedido").addEventListener("submit", confirmarPedido);
    $("cerrar-pedido").addEventListener("click", cerrarPedido);
    $("volver-carrito").addEventListener("click", volverAlCarrito);
    $("pedido").addEventListener("click", evento => {
        if (evento.target.id === "pedido") cerrarPedido(); // clic fuera del formulario
    });

    // Menú celular
    $("menu-toggle").addEventListener("click", () => alternarMenu());
    $("menu").addEventListener("click", evento => {
        if (evento.target.tagName === "A") alternarMenu(false);
    });

    // Tecla Escape cierra lo que esté abierto
    document.addEventListener("keydown", evento => {
        if (evento.key !== "Escape") return;
        if ($("pedido").classList.contains("activo")) cerrarPedido();
        else if ($("carrito").classList.contains("activo")) cerrarCarrito();
        else alternarMenu(false);
    });
}

iniciar();
