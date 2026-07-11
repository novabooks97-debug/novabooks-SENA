// Base de datos de LIBROS
const LIBROS_BASE_DATOS = [
  {
    id: 1,
    titulo: "Cien años de soledad",
    autor: "Gabriel García Márquez",
    genero: "Novela",
    sinopsis: "La saga extraordinaria de la familia Buendía en Macondo, donde la memoria y el realismo mágico se entrelazan.",
    url: "libros.html",
    keywords: ["cien años", "soledad", "macondo", "buendía", "garcía márquez"]
  },
  {
    id: 2,
    titulo: "Orgullo y Prejuicio",
    autor: "Jane Austen",
    genero: "Novela Rosa",
    sinopsis: "Una comedia romántica sobre el orgullo, los prejuicios sociales y el amor verdadero entre Elizabeth Bennet y el señor Darcy.",
    url: "libros.html",
    keywords: ["orgullo", "prejuicio", "elizabeth bennet", "darcy", "jane austen", "romance"]
  },
  {
    id: 3,
    titulo: "Don Quijote de la Mancha",
    autor: "Miguel de Cervantes",
    genero: "Aventura",
    sinopsis: "La aventura del ingenioso hidalgo que confunde molinos con gigantes y busca hacer justicia junto a su fiel escudero Sancho Panza.",
    url: "libros.html",
    keywords: ["don quijote", "cervantes", "sancho panza", "molinos", "aventura"]
  },
  {
    id: 4,
    titulo: "El Principito",
    autor: "Antoine de Saint-Exupéry",
    genero: "Novela",
    sinopsis: "Un niño de otro planeta viaja por el universo y deja lecciones profundas sobre la infancia, el amor y la soledad.",
    url: "libros.html",
    keywords: ["principito", "planeta", "rosa", "zorro", "saint-exupéry"]
  },
  {
    id: 5,
    titulo: "1984",
    autor: "George Orwell",
    genero: "Ficción",
    sinopsis: "Un thriller distópico donde el Gran Hermano vigila cada movimiento y la verdad se reescribe para controlar a la sociedad.",
    url: "libros.html",
    keywords: ["1984", "george orwell", "gran hermano", "distopia", "totalitario"]
  },
  {
    id: 6,
    titulo: "Drácula",
    autor: "Bram Stoker",
    genero: "Terror",
    sinopsis: "El conde Drácula llega a Inglaterra para expandir su reino de terror mientras un pequeño grupo se une para detenerlo.",
    url: "libros.html",
    keywords: ["dracula", "vampiro", "stoker", "terror", "conde"]
  },
  {
    id: 7,
    titulo: "Frankenstein",
    autor: "Mary Shelley",
    genero: "Ficción",
    sinopsis: "Un científico desafía los límites de la vida y crea una criatura incomprendida que lo obliga a enfrentar sus propias responsabilidades.",
    url: "libros.html",
    keywords: ["frankenstein", "criatura", "víctor", "shelley", "ciencia"]
  },
  {
    id: 8,
    titulo: "Moby Dick",
    autor: "Herman Melville",
    genero: "Aventura",
    sinopsis: "El capitán Ahab persigue obsesivamente a la gran ballena blanca en una travesía peligrosa llena de fanatismo y destino.",
    url: "libros.html",
    keywords: ["moby dick", "ballena", "ahab", "melville", "mar"]
  }
];

// Base de datos de PÁGINAS
const PAGINAS_SITIO = [
  {
    nombre: "Inicio",
    url: "index.html",
    descripcion: "Página principal del sitio con libros destacados",
    palabras_clave: ["inicio", "home", "principal", "portada"]
  },
  {
    nombre: "Libros",
    url: "libros.html",
    descripcion: "Catálogo completo de libros con búsqueda y filtros",
    palabras_clave: ["libros", "catálogo", "búsqueda", "lecturas"]
  },
  {
    nombre: "Comentarios",
    url: "comentarios.html",
    descripcion: "Sección de comentarios y opiniones de lectores",
    palabras_clave: ["comentarios", "opiniones", "reseñas", "feedback"]
  },
  {
    nombre: "Contacto",
    url: "contactanos.html",
    descripcion: "Formulario de contacto y información de la plataforma",
    palabras_clave: ["contacto", "ayuda", "soporte", "información", "correo"]
  },
  {
    nombre: "Favoritos",
    url: "favoritos.html",
    descripcion: "Tu lista personal de libros favoritos",
    palabras_clave: ["favoritos", "mis libros", "guardados", "colección"]
  },
  {
    nombre: "Iniciar Sesión",
    url: "iniciar_sesion.html",
    descripcion: "Acceso a tu cuenta de usuario",
    palabras_clave: ["login", "iniciar sesión", "acceso", "cuenta"]
  },
  {
    nombre: "Registrarse",
    url: "registrarse.html",
    descripcion: "Crear una nueva cuenta en Novabook",
    palabras_clave: ["registro", "registrarse", "nueva cuenta", "sign up"]
  },
  {
    nombre: "Para Leer Después",
    url: "para_leer_despues.html",
    descripcion: "Libros marcados para leer más tarde",
    palabras_clave: ["para leer", "después", "leer después", "recordar", "lista lectura"]
  }
];

// RESPUESTAS INTELIGENTES EXPANDIDAS
const RESPUESTAS_IA = {
  bienvenida: {
    preguntas: ["hola", "buenos días", "buenas noches", "qué haces", "quién eres", "ayuda", "bienvenido"],
    respuesta: "¡Hola! 👋 Soy tu asistente de Novabook. Estoy aquí para ayudarte con:📚 Búsqueda de libros\n⭐ Tus favoritos\n⏱ Lista de lectura\n💬 Responder tus preguntas\n\n¿Qué necesitas?",
    redirect: null
  },
  buscar_libros: {
    preguntas: ["buscar", "libro", "quiero leer", "recomienda", "qué libro", "dónde está", "encontrar"],
    respuesta: "Puedo ayudarte a buscar libros. Cuéntame qué tipo de libro te interesa (por título, autor o género) y te lo muestro.",
    redirect: "libros.html"
  },
  favoritos: {
    preguntas: ["favoritos", "mis favoritos", "guardados", "colección", "ver mis libros"],
    respuesta: "Te llevo a tu sección de favoritos donde puedes ver todos los libros que has marcado con ⭐",
    redirect: "favoritos.html"
  },
  leer_despues: {
    preguntas: ["para leer", "después", "recordar", "leer más tarde", "guardar para después"],
    respuesta: "Te muestro los libros que has marcado para leer después. Puedes verlos y organizarlos aquí.",
    redirect: "para_leer_despues.html"
  },
  libros_catalogo: {
    preguntas: ["catálogo", "todos los libros", "ver libros", "ir a libros", "explorar"],
    respuesta: "Te llevo al catálogo completo de libros donde puedes explorar todo lo que tenemos disponible.",
    redirect: "libros.html"
  },
  comentarios: {
    preguntas: ["comentarios", "opiniones", "reseñas", "dejar comentario", "ver comentarios"],
    respuesta: "Vamos a la sección de comentarios donde puedes ver las opiniones de otros lectores o dejar la tuya.",
    redirect: "comentarios.html"
  },
  contacto: {
    preguntas: ["contacto", "ayuda", "soporte", "comunicarse", "email", "whatsapp", "teléfono", "formulario"],
    respuesta: "Te llevo a la página de contacto donde puedes comunicarte con nosotros por email, WhatsApp o formulario.",
    redirect: "contactanos.html"
  },
  generos: {
    preguntas: ["géneros", "qué géneros", "tipos de libros", "categorías"],
    respuesta: "Tenemos libros en estos géneros:\n📖 Novela\n💕 Novela Rosa\n👻 Terror\n⚔️ Aventura\n🚀 Ciencia Ficción\n📕 Drama\n\n¿Cuál te interesa?",
    redirect: null
  },
  login: {
    preguntas: ["iniciar sesión", "login", "crear cuenta", "registrarse", "cuenta", "usuario"],
    respuesta: "Puedes iniciar sesión o crear una cuenta nueva en la página de autenticación.",
    redirect: "iniciar sesion.html"
  },
  inicio: {
    preguntas: ["inicio", "home", "página principal", "portada", "volver inicio"],
    respuesta: "Te llevo a la página principal.",
    redirect: "index.php"
  }
};

// RESPUESTAS PARA PREGUNTAS GENERALES
const RESPUESTAS_GENERALES = [
  "Eso es interesante, cuéntame más sobre qué tipo de libros te gustan 📚",
  "Entiendo. ¿Hay algo específico que pueda ayudarte? Puedo buscar libros, mostrar favoritos o guiarte por el sitio.",
  "¡Buena pregunta! ¿Necesitas que te ayude a encontrar algo?",
  "Me alegra tu interés. ¿Qué más quieres saber sobre Novabook?",
  "Estoy aquí para ayudarte. ¿Hay algún libro que busques o algo que necesites?"
];

// Función para buscar libro similar
function buscarLibroSimilar(query) {
  const textoLower = query.toLowerCase().trim();
  
  return LIBROS_BASE_DATOS.filter(libro => {
    return libro.titulo.toLowerCase().includes(textoLower) ||
           libro.autor.toLowerCase().includes(textoLower) ||
           libro.genero.toLowerCase().includes(textoLower) ||
           libro.keywords.some(kw => kw.includes(textoLower));
  });
}

// Función para buscar respuesta e intención con redirección
function buscarRespuestaIA(pregunta) {
  const preguntaLower = pregunta.toLowerCase();
  
  for (const [key, data] of Object.entries(RESPUESTAS_IA)) {
    if (data.preguntas.some(p => preguntaLower.includes(p))) {
      return {
        respuesta: data.respuesta,
        redirect: data.redirect,
        encontrado: true
      };
    }
  }
  
  // Si no encuentra coincidencia exacta, devuelve una respuesta general
  return {
    respuesta: RESPUESTAS_GENERALES[Math.floor(Math.random() * RESPUESTAS_GENERALES.length)],
    redirect: null,
    encontrado: false
  };
}

// Función para buscar página por palabra clave
function buscarPaginaPorKeyword(query) {
  const textoLower = query.toLowerCase().trim();
  
  for (const pagina of PAGINAS_SITIO) {
    if (pagina.palabras_clave.some(kw => textoLower.includes(kw))) {
      return pagina.url;
    }
  }
  
  return null;
}

// Función para formatear respuesta de libro
function formatearLibro(libro) {
  return `
📖 <strong>${libro.titulo}</strong>
👤 Autor: ${libro.autor}
📂 Género: ${libro.genero}
📝 ${libro.sinopsis}
<a href="${libro.url}" class="link-libro">Ver en catálogo →</a>
  `.trim();
}


