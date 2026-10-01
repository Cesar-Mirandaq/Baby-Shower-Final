# Baby Shower de Julian (Baby-Shower-Final)

Invitación web animada, responsive (celular y computadora), con música y cuenta regresiva.

## Estructura

```
Baby-Shower-Final/
├── index.html        <- la página (estructura y textos)
├── css/
│   └── styles.css    <- diseño, colores y animaciones
├── js/
│   ├── form.js       <- formulario de confirmación
│   ├── music.js      <- música (caja de música generada con Web Audio)
│   └── main.js       <- letras de JULIAN, cuenta regresiva, animaciones al hacer scroll, burbujas
├── img/
│   ├── stork.webp    <- cigüeña
│   ├── mama.webp     <- mamá elefante y bebé
│   └── raton.webp    <- ratón
├── apps-script/
│   └── Code.gs       <- script de Google (guarda las respuestas en la hoja)
├── audio/            <- (opcional) tu propia canción
└── .nojekyll
```

## Probarla en tu computadora
Abre la carpeta en VS Code y usa la extensión **Live Server** (clic derecho en `index.html`, *Open with Live Server*).
También funciona abriendo `index.html` con doble clic.

## Subirla a GitHub Pages (gratis)
1. Crea un repositorio nuevo en GitHub (por ejemplo `baby-shower-julian`).
2. Sube **el contenido** de la carpeta (que `index.html` quede en la raíz del repo).
3. En el repo: **Settings, Pages, Build and deployment**. En *Branch* elige `main` y carpeta `/ (root)`, y guarda.
4. En un par de minutos tu invitación estará en `https://TU-USUARIO.github.io/baby-shower-julian/`.

## Cosas que puedes cambiar
| Qué | Dónde |
|---|---|
| Nombre | `index.html` (busca `JULIAN` y `Julian`) y `js/main.js` (`[...'JULIAN']`) |
| Fecha del contador | `js/main.js`, línea `const target=new Date(2026,10,8,0,0,0)` (el mes empieza en 0: noviembre = 10) |
| Link de ubicación | `index.html`, busca `maps.app.goo.gl` |
| Colores | `css/styles.css`, al inicio en `:root` |
| Imágenes | reemplaza los archivos de `img/` conservando el nombre |

## Usar tu propia canción
Pon tu archivo MP3 en `audio/cancion.mp3` (ese nombre exacto) y súbelo a GitHub. La invitación lo reproduce en bucle.
Si el archivo no existe, suena la nana que genera `js/music.js`. Conviene que el MP3 pese menos de ~5 MB (un fragmento de 1 a 2 minutos en 128 kbps es suficiente).
Nota: los navegadores solo permiten reproducir música después de que la persona toca algo, por eso existe el botón "Abrir invitación".

## Formulario de confirmación (guarda en Google Sheets / Excel)

1. Entra a <https://sheets.google.com> y crea una hoja nueva (ponle "Confirmaciones Baby Shower Julian").
2. Menú **Extensiones, Apps Script**. Borra lo que haya y pega todo el contenido de `apps-script/Code.gs`. Guarda con el ícono del disquete.
3. Clic en **Implementar, Nueva implementación**. En el engrane elige **Aplicación web** y configura:
   - *Ejecutar como*: **Yo**
   - *Quién tiene acceso*: **Cualquier persona**
4. Presiona **Implementar** y acepta los permisos de Google (si sale "app no verificada": *Avanzado*, *Ir a ... (no seguro)*, *Permitir*; es tu propio script).
5. Copia la **URL de la aplicación web** (termina en `/exec`).
6. Abre `js/form.js` y reemplaza `PEGA_AQUI_LA_URL_DE_TU_APPS_SCRIPT` por esa URL. Sube el cambio a GitHub.
7. Prueba la invitación enviando una confirmación: debe aparecer una fila en la pestaña **Respuestas**.

Si cambias el código de Apps Script después, debes hacer **Implementar, Administrar implementaciones, editar, Nueva versión**; la URL sigue igual.

**Para tener el Excel:** en la hoja, *Archivo, Descargar, Microsoft Excel (.xlsx)*.
La hoja arma sola un resumen en F1:G3 con los "Sí", los "No" y el **total de personas**.

El máximo de personas se cambia en `js/form.js` (`MAX_PERSONAS`) y en `apps-script/Code.gs` (`MAX_PERSONAS`).
