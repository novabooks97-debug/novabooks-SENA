# 📚 Chatbot Inteligente Novabook

## Descripción
Un chatbot asistente flotante que ayuda a los usuarios a navegar por tu sitio web de libros, buscar títulos, obtener información de contacto y responder preguntas frecuentes sobre la plataforma.

## Características

✅ **Búsqueda de Libros Inteligente**
- Busca por título, autor o género
- Sugiere libros automáticamente
- Muestra sinopsis y enlaces directos

✅ **Respuestas IA Contextual**
- Reconoce preguntas comunes
- Responde sobre secciones del sitio
- Proporciona información de contacto

✅ **Interfaz Amigable**
- Widget flotante con botón 💬
- Chat en tiempo real
- Indicadores visuales de escritura
- Responsive en móviles

✅ **Integración Completa**
- Funciona en todas las páginas del sitio
- Acceso a toda la base de datos de libros
- Sin dependencias externas

---

## Archivos del Chatbot

### 1. **chatbot-data.js**
Contiene la base de datos con:
- Lista completa de libros con metadatos
- Información de todas las páginas
- Respuestas IA predefinidas
- Funciones de búsqueda

### 2. **chatbot.js**
Lógica principal del chatbot:
- Clase `ChatbotNovabook`
- Gestión de eventos
- Procesamiento de consultas
- Comunicación con el DOM

### 3. **chatbot.css**
Estilos completos:
- Tema con colores del sitio (#39ff14, negro)
- Animaciones fluidas
- Diseño responsive
- Scrollbar personalizado

---

## Instalación

### ✅ Ya está integrado en tu sitio

El chatbot está incluido en todas las páginas:
- `index.html`
- `libros.html`
- `contactanos.html`
- `comentarios.html`
- `favoritos.html`
- `iniciar sesion.html`
- `registrarse.php`

### Referencias necesarias en el `<head>`:
```html
<link rel="stylesheet" href="chatbot.css">
```

### Scripts necesarios antes del `</body>`:
```html
<script src="./chatbot-data.js"></script>
<script src="./chatbot.js"></script>
```

---

## Cómo Personalizar

### 1. Agregar más libros

En `chatbot-data.js`, agrega a `LIBROS_BASE_DATOS`:

```javascript
{
  id: 9,
  titulo: "Tu Libro",
  autor: "Autor",
  genero: "Género",
  sinopsis: "Descripción...",
  url: "libros.html",
  keywords: ["palabra1", "palabra2"]
}
```

### 2. Cambiar el idioma

En `chatbot.js`, línea 41:
```javascript
recognition.lang = "es-MX"; // Cambiar según tu región
// Opciones: es-ES, es-AR, es-MX, es-CO, etc.
```

### 3. Agregar respuestas personalizadas

En `chatbot-data.js`, en `RESPUESTAS_IA`:

```javascript
mi_tema: {
  preguntas: ["pregunta1", "pregunta2", "pregunta3"],
  respuesta: "Mi respuesta personalizada aquí"
}
```

### 4. Cambiar colores

En `chatbot.css`:
```css
/* Cambiar #39ff14 por tu color primario */
.chatbot-toggle { background: linear-gradient(135deg, #TU_COLOR 0%, #TU_COLOR_CLARO 100%); }
```

---

## Funcionalidades Avanzadas

### Búsqueda Fuzzy
El chatbot busca coincidencias parciales:
- "soledad" → "Cien años de soledad"
- "márquez" → "Cien años de soledad"
- "novela" → Todos los libros del género novela

### Manejo de Errores
El bot responde inteligentemente a:
- Preguntas no relacionadas
- Faltas de ortografía
- Consultas incompletas

### Responsivo
- 📱 Móviles: Full screen
- 💻 Desktop: Widget flotante 380x550px

---

## Ejemplos de Preguntas

Prueba estas consultas en el chatbot:

```
1. "Buscar Cien años de soledad"
2. "¿Qué libros de terror tienes?"
3. "Quiero contactar con soporte"
4. "¿Cómo guardo favoritos?"
5. "¿Quién es Gabriel García Márquez?"
6. "Hola, ¿qué puedes hacer?"
```

---

## Estructura de Datos

### Libro
```javascript
{
  id: number,
  titulo: string,
  autor: string,
  genero: string,
  sinopsis: string,
  url: string,
  keywords: string[]
}
```

### Respuesta IA
```javascript
{
  preguntas: string[],    // Variaciones de la pregunta
  respuesta: string       // Respuesta del bot
}
```

---

## Tips de Uso

🎯 **Para mejores búsquedas:**
- Agrega múltiples palabras clave por libro
- Incluye variaciones de nombres
- Usa palabras descriptivas

💡 **Para buenas respuestas:**
- Define las preguntas más comunes primero
- Usa un lenguaje amigable
- Incluye emojis para mayor claridad

📊 **Para monitoreo:**
- El localStorage almacena mensajes
- Puedes acceder a través de DevTools
- Los datos persisten entre sesiones

---

## Soporte Navegadores

| Navegador | Soporte |
|-----------|---------|
| Chrome    | ✅ Full |
| Firefox   | ✅ Full |
| Safari    | ✅ Full |
| Edge      | ✅ Full |
| IE 11     | ❌ No   |

---

## Próximas Mejoras Posibles

- [ ] Integración con API de IA (ChatGPT)
- [ ] Historial de conversaciones
- [ ] Analytics de consultas
- [ ] Múltiples idiomas
- [ ] Recomendaciones basadas en usuario
- [ ] Integración con carrito de compras

---

## Soporte

Para problemas o sugerencias:
- 📧 novabooks97@gmail.com
- 📱 WhatsApp: +57 3208957256

---

**Creado con ❤️ para Novabook - Plataforma de lectura digital**
