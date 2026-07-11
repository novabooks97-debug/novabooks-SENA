# Sistema de Chatbot AI Avanzado - Novabook

## 🚀 Características

✅ **RAG (Recuperación Aumentada por Generación)**
- Indexación automática de contenido web (HTML, PHP, JS, Markdown)
- Búsqueda inteligente por relevancia
- Contexto dinámico en cada respuesta

✅ **Integración OpenAI GPT-4o**
- Modelo más avanzado disponible
- Respuestas naturales y contextuales
- Soporte para historial de conversación

✅ **Captura de Leads**
- Detección automática de intención de contacto
- Formulario dinámico para recopilar datos
- Almacenamiento en base de datos

✅ **Historial de Usuario**
- Memoria de conversación con SQLite
- Sincronización entre sesiones
- Persistencia automática

✅ **Redirección Automática**
- Detecta intención del usuario
- Ofrece botones para ir a páginas relevantes
- Navegación inteligente

---

## 📋 Requisitos Previos

- **Node.js** 16+ ([Descargar aquí](https://nodejs.org/))
- **npm** (viene con Node.js)
- **Clave API de OpenAI** ([Obtener aquí](https://platform.openai.com/api-keys))
- **XAMPP** con PHP (ya tienes esto)

---

## 🔧 Instalación

### 1. Instalar Dependencias

```bash
cd "c:\xampp\htdocs\pagina web"
npm install
```

### 2. Configurar Variables de Entorno

Edita el archivo `.env` y reemplaza:

```env
OPENAI_API_KEY=sk_test_123456789_tu_clave_aqui
OPENAI_MODEL=gpt-4o
DB_PATH=./database/novabook.db
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:8080
```

**Obtener tu clave API de OpenAI:**
1. Ve a https://platform.openai.com/account/api-keys
2. Crea una nueva clave
3. Cópiala en el archivo `.env`

### 3. Iniciar el Servidor

```bash
npm start
```

O en modo desarrollo con auto-reload:

```bash
npm run dev
```

Verás algo como:

```
🚀 Servidor chatbot ejecutándose en http://localhost:5000
📡 CORS habilitado para: http://localhost:8080
🤖 Modelo: gpt-4o
✅ Base de datos: lista

📑 Indexando contenido web...
  ✓ index.php
  ✓ libros.html
  ✓ comentarios.html
  ...
✅ Indexación completa
```

---

## 📡 API REST Endpoints

### 1. `POST /api/chat`
Enviar mensaje al chatbot

```javascript
{
  "message": "¿Qué libros de terror tienes?",
  "userId": "user_123",
  "sessionId": "session_456"
}
```

**Respuesta:**
```javascript
{
  "reply": "Tenemos varios libros de terror...",
  "redirect": "libros.html",
  "isLeadCapture": false,
  "sources": ["/libros.html", "/index.php"]
}
```

---

### 2. `POST /api/lead`
Guardar datos de contacto

```javascript
{
  "name": "Juan Pérez",
  "email": "juan@example.com",
  "phone": "+34 600 123 456",
  "userId": "user_123",
  "message": "Me interesa una propuesta comercial"
}
```

**Respuesta:**
```javascript
{
  "success": true,
  "leadId": "lead_uuid",
  "message": "Datos guardados correctamente"
}
```

---

### 3. `GET /api/history/:userId`
Obtener historial de conversación

```javascript
GET /api/history/user_123
```

**Respuesta:**
```javascript
{
  "userId": "user_123",
  "history": [
    {
      "id": "msg_id",
      "role": "user",
      "content": "¿Qué libros recomiendas?",
      "timestamp": "2026-05-27T10:30:00Z"
    },
    {
      "id": "msg_id",
      "role": "assistant",
      "content": "Te recomiendo...",
      "timestamp": "2026-05-27T10:30:05Z"
    }
  ],
  "count": 2
}
```

---

### 4. `POST /api/session/new`
Crear nueva sesión

```javascript
{
  "userId": "user_123"
}
```

**Respuesta:**
```javascript
{
  "sessionId": "session_uuid",
  "userId": "user_123",
  "timestamp": "2026-05-27T10:30:00Z"
}
```

---

### 5. `GET /api/health`
Verificar estado del servidor

```javascript
GET /api/health
```

**Respuesta:**
```javascript
{
  "status": "ok",
  "timestamp": "2026-05-27T10:30:00Z",
  "uptime": 125.432
}
```

---

## 🎯 Flujo de Funcionamiento

```
┌─────────────┐
│ Usuario     │
│ escribe     │
└──────┬──────┘
       │
       ▼
┌──────────────────────┐
│ Frontend JS          │
│ (chatbot.js)         │
└──────┬───────────────┘
       │
       ▼ POST /api/chat
┌──────────────────────┐
│ Server Node.js       │
│ (server.js)          │
└──────┬───────────────┘
       │
       ├─► RAG Search    ◄────────────── BD SQLite (índice)
       │   (ai-service)
       │
       ├─► GPT-4o        ◄────────────── OpenAI API
       │   (OpenAI API)
       │
       └─► Save History  ──────────────► BD SQLite
           (database)
       │
       ▼ Respuesta JSON
┌──────────────────────┐
│ Frontend JS          │
│ Mostrar respuesta    │
│ + Opcional redirect  │
└──────────────────────┘
```

---

## 💾 Estructura de Base de Datos

### Tabla: `messages`
```sql
id (UUID)           -- Identificador único
userId (TEXT)       -- ID del usuario
role (TEXT)         -- 'user' o 'assistant'
content (TEXT)      -- Contenido del mensaje
timestamp (DATE)    -- Cuándo se envió
sessionId (TEXT)    -- ID de sesión
```

### Tabla: `leads`
```sql
id (UUID)           -- Identificador único
userId (TEXT)       -- ID del usuario
name (TEXT)         -- Nombre del contacto
email (TEXT)        -- Email
phone (TEXT)        -- Teléfono
message (TEXT)      -- Mensaje adicional
status (TEXT)       -- 'new', 'contacted', etc.
createdAt (DATE)    -- Fecha de creación
```

### Tabla: `rag_index`
```sql
id (UUID)           -- Identificador único
source (TEXT)       -- Archivo fuente
content (TEXT)      -- Contenido indexado
embedding (TEXT)    -- Para futuras mejoras
lastUpdated (DATE)  -- Última actualización
category (TEXT)     -- 'pages', 'docs', etc.
```

---

## 🎨 Integración Frontend

El chatbot frontend ya tiene integración lista en `chatbot.js`. Simplemente asegúrate de que:

1. **La URL del servidor es correcta:**

```javascript
const API_URL = 'http://localhost:5000/api';
```

2. **El usuario tiene un ID único:**

```javascript
let userId = localStorage.getItem('userId');
if (!userId) {
  userId = 'user_' + Date.now();
  localStorage.setItem('userId', userId);
}
```

3. **El chatbot envía mensajes al servidor:**

```javascript
// Ver en chatbot-frontend.js
fetch(`${API_URL}/chat`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    message: userMessage,
    userId: userId,
    sessionId: sessionId
  })
})
```

---

## 🔄 Sincronización en Tiempo Real

El sistema re-indexa automáticamente cada:
- **Al iniciar el servidor** (completo)
- **Cada 30 minutos** (incremental)

Para forzar re-indexación:

```bash
curl -X POST http://localhost:5000/api/reindex
```

---

## 🛡️ Seguridad

### Mejores Prácticas Implementadas:

1. **Variables de entorno** - Las claves sensibles no se comiten
2. **CORS configurado** - Solo origen autorizado
3. **Validación de entrada** - Todos los datos se validan
4. **Rate limiting** - Preparado para futuros límites
5. **Sanitización** - Contenido limpio antes de indexar

### Recomendaciones Adicionales:

1. Usa HTTPS en producción
2. Implementa autenticación (JWT)
3. Agrega rate limiting con `express-rate-limit`
4. Usa variables de entorno diferentes para desarrollo/producción

---

## 🚀 Escalabilidad Futura

El sistema está preparado para:

- **Embeddings avanzados** (OpenAI Embeddings API)
- **Búsqueda vectorial** (Pinecone, Weaviate)
- **Cache de respuestas** (Redis)
- **WebSockets** (respuestas en tiempo real)
- **Análisis de sentimiento** (detectar frustración)
- **Integración con CRM** (Salesforce, Hubspot)
- **Multi-idiomas** (traducción automática)

---

## 📞 Soporte

Si tienes problemas:

1. Verifica que Node.js está instalado: `node --version`
2. Verifica que npm está actualizado: `npm --version`
3. Revisa los logs del servidor para errores
4. Asegúrate que el puerto 5000 está disponible
5. Verifica que la clave de OpenAI es válida

---

## 📄 Licencia

Uso exclusivo para Novabook - Plataforma de Libros

---

**Creado con ❤️ para Novabook**
