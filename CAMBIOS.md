# Revisión del código – cambios realizados

## Personalización (lo más importante)

1. **La vista previa ahora cambia.** Antes era un emoji fijo 👟. Ahora el zapato se dibuja con SVG desde JavaScript (`dibujarZapato`) y cada pieza (cuerpo, suela, cordones) se pinta con el color elegido. Hay tres formas distintas: casual, deportivo y elegante. El material cambia la textura (tela con trama, cuero con brillo suave).
2. **Se agregó lo que la página prometía:** iniciales o nombre (máximo 10 caracteres, se ven dibujados en el zapato) y "detalles" (plantilla ergonómica).
3. **Colores de suela y cordones**, además del color principal.
4. **El precio ya no es fijo** ($159.900 para todo). Ahora se calcula según modelo, material y extras, con desglose visible. Todos los precios están en el objeto `OPCIONES` de `app.js`: si cambia un precio, se cambia en un solo lugar.
5. **Validación:** no deja agregar sin talla y muestra el error junto al formulario.
6. **Seguridad:** el texto que escribe el cliente pasa por `escaparHTML` y `limpiarTextoPersonal`. Antes, cualquier texto insertado con `innerHTML` podía convertirse en código.
7. **Los detalles del diseño se ven en el carrito** (antes se guardaban pero nunca se mostraban), con un dibujo pequeño del zapato.
8. Botón **"Personalizar este modelo"** en cada producto del catálogo: abre ese zapato en el configurador.
9. Las etiquetas `<label>` ahora están conectadas a sus campos (`for` / `id`) y los grupos usan `<fieldset>`, lo que mejora la accesibilidad.

## Errores de lógica corregidos

- El catálogo permitía comprar zapatos **sin talla**. Ahora cada producto tiene su selector.
- "Continuar pedido" funcionaba con el **carrito vacío**.
- El pedido confirmado **no se enviaba a ningún lado ni vaciaba el carrito**. Ahora arma un mensaje y abre WhatsApp con el resumen.
- `mostrarPedido` / `cerrarPedido` dejaban estilos `display` escritos en línea que rompían la animación del carrito. Ahora se usan clases (`.activo`).
- El carrito se perdía al recargar. Ahora se guarda en `localStorage`.
- Productos repetidos se mostraban como líneas separadas. Ahora hay cantidades (+ / −).
- El buscador no encontraba "cafe" en "Café". Ahora ignora tildes y mayúsculas.
- No había forma de quitar el filtro de categoría: se agregó "Ver todos".
- Los `alert()` se cambiaron por un aviso que no interrumpe.
- El teléfono del pedido ahora se valida (10 dígitos).

## CSS

- Había reglas **duplicadas** (`.hero`, `body`, `.logo img`) y un bloque al final que pisaba los colores de los botones (texto blanco sobre miel, casi ilegible). Se unificó todo con variables de color tomadas del logo (`:root`).
- El botón "Personalizar" del inicio era **blanco sobre fondo beige**: invisible.
- La sección **Ofertas no tenía estilos**.
- En celular el **menú desaparecía** sin alternativa. Se agregó el botón ☰.
- Se agregó foco visible con teclado y respeto por quienes desactivan animaciones.

## HTML e imágenes

- La página no tenía `<h1>` (el título principal era `<h2>`).
- `zapatos-cava.jpg` era en realidad un PNG de 1,7 MB. Se convirtió a JPG real. Las tres imágenes pasaron de 2 MB a 255 KB, importante para conexiones lentas.
- Se quitaron las dobles extensiones (`logo-cava.jpg.jpeg` → `logo-cava.jpg`).
- Las imágenes externas de Unsplash se reemplazaron por los dibujos SVG, así la página funciona aunque falle internet.
- Teléfono, WhatsApp y correo ahora son enlaces que se pueden tocar.

## Pendiente (requiere datos reales de CAVA)

- Cambiar `313 000 0000` por el número real en `index.html` y en `WHATSAPP_CAVA` (al inicio de `app.js`).
- Poner los enlaces reales de Facebook e Instagram (ahora están en `#`).
- Revisar el correo `contacto@cava.com`.
