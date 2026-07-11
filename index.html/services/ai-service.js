const OpenAI = require('openai');
const fs = require('fs-extra');
const path = require('path');
const { saveRAGIndex, getRAGIndex } = require('./database');

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

const MODEL = process.env.OPENAI_MODEL || 'gpt-4o';

/**
 * SISTEMA RAG: Indexar contenido web
 */
async function indexWebContent(projectPath) {
  try {
    const contentPath = path.join(projectPath, '../index.html');
    const files = await getWebFiles(contentPath);

    console.log(`\n📑 Indexando ${files.length} archivos...`);

    for (const file of files) {
      try {
        const content = await fs.readFile(file.path, 'utf-8');
        const category = getFileCategory(file.extension);

        // Procesar contenido (limpiar HTML, extraer texto relevante)
        const cleanContent = cleanAndExtractContent(content, file.extension);

        // Guardar en índice
        await saveRAGIndex(
          file.path.replace(projectPath, ''),
          cleanContent,
          category
        );

        console.log(`  ✓ ${file.name}`);
      } catch (error) {
        console.error(`  ✗ Error procesando ${file.name}:`, error.message);
      }
    }

    console.log('✅ Indexación completa\n');

  } catch (error) {
    console.error('❌ Error indexando contenido:', error);
  }
}

/**
 * Buscar archivos del proyecto
 */
async function getWebFiles(basePath) {
  const files = [];
  const extensions = ['.html', '.php', '.js', '.md', '.txt'];

  try {
    const items = await fs.readdir(path.dirname(basePath));

    for (const item of items) {
      const fullPath = path.join(path.dirname(basePath), item);
      const stats = await fs.stat(fullPath);
      const ext = path.extname(item).toLowerCase();

      if (stats.isFile() && extensions.includes(ext)) {
        files.push({
          name: item,
          path: fullPath,
          extension: ext
        });
      }
    }
  } catch (error) {
    console.error('Error leyendo archivos:', error);
  }

  return files;
}

/**
 * Limpiar y extraer contenido de archivos
 */
function cleanAndExtractContent(content, fileType) {
  let cleaned = content;

  if (fileType === '.html') {
    // Remover scripts y estilos
    cleaned = content
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
      .replace(/<[^>]+>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  if (fileType === '.php') {
    cleaned = content
      .replace(/<\?php[\s\S]*?\?>/g, '')
      .trim();
  }

  return cleaned.substring(0, 5000); // Limitar a 5000 caracteres
}

/**
 * Obtener categoría de archivo
 */
function getFileCategory(extension) {
  const categories = {
    '.html': 'pages',
    '.php': 'backend',
    '.js': 'scripts',
    '.md': 'docs',
    '.txt': 'content'
  };
  return categories[extension] || 'other';
}

/**
 * BÚSQUEDA RAG: Encontrar contexto relevante
 */
function searchRAG(query) {
  try {
    const index = getRAGIndex();
    const queryTerms = query.toLowerCase().split(/\s+/);

    // Simple búsqueda por relevancia
    const results = index
      .map((item) => ({
        ...item,
        score: calculateRelevance(item.content, queryTerms)
      }))
      .filter(item => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 3);

    const contextText = results
      .map(r => `[${r.source}]\n${r.content}`)
      .join('\n\n');

    return {
      context: contextText,
      sources: results.map(r => r.source),
      found: results.length > 0
    };

  } catch (error) {
    console.error('Error en búsqueda RAG:', error);
    return { context: '', sources: [], found: false };
  }
}

/**
 * Calcular relevancia de documento
 */
function calculateRelevance(content, queryTerms) {
  const lowerContent = content.toLowerCase();
  let score = 0;

  queryTerms.forEach(term => {
    const regex = new RegExp(term, 'gi');
    const matches = (lowerContent.match(regex) || []).length;
    score += matches * 10;
  });

  return score;
}

/**
 * OBTENER RESPUESTA DE GPT-4o CON CONTEXTO RAG
 */
async function getGPTResponse(userMessage, ragContext, history, userId) {
  try {
    // Construir contexto del sistema
    const systemPrompt = buildSystemPrompt(ragContext);

    // Construir historial de conversación
    const messages = [
      ...history.map(msg => ({
        role: msg.role,
        content: msg.content
      })),
      {
        role: 'user',
        content: userMessage
      }
    ];

    // Solicitar respuesta a GPT-4o
    const response = await client.chat.completions.create({
      model: MODEL,
      messages: [
        { role: 'system', content: systemPrompt },
        ...messages
      ],
      temperature: 0.7,
      max_tokens: 1000,
      presence_penalty: 0.1,
      frequency_penalty: 0.1
    });

    const reply = response.choices[0].message.content;

    // Detectar si el usuario quiere información de contacto
    const isLeadCapture = detectLeadIntent(userMessage, reply);

    // Detectar redirección automática
    const redirect = detectRedirect(userMessage);

    return {
      reply,
      isLeadCapture,
      redirect
    };

  } catch (error) {
    console.error('Error con OpenAI:', error);
    return {
      reply: '❌ Ocurrió un error procesando tu pregunta. Por favor, intenta de nuevo.',
      isLeadCapture: false,
      redirect: null
    };
  }
}

/**
 * Construir prompt del sistema con contexto RAG
 */
function buildSystemPrompt(ragContext) {
  return `Eres un asistente experto de Novabook, una plataforma de libros digitales.

Tu rol:
- Responder preguntas sobre los libros, géneros y funcionalidades del sitio
- Ser amable, profesional y servicial
- Si el usuario pregunta por contacto/información, ofrécete a guardar sus datos
- Proporcionar recomendaciones personalizadas

Contexto de la plataforma (información actualizada):
${ragContext.context || 'Base de datos de plataforma cargada'}

Instrucciones:
1. Responde basándote en el contexto proporcionado
2. Si no tienes información, sé honesto
3. Ofrece redirecciones a páginas relevantes cuando sea apropiado
4. Mantén un tono conversacional y amigable
5. Usa emojis cuando sea relevante

Responde de manera concisa pero completa.`;
}

/**
 * Detectar intención de captura de lead
 */
function detectLeadIntent(userMessage, botResponse) {
  const leadKeywords = [
    'contacto', 'contactar', 'llamar', 'llamada', 'teléfono', 'email',
    'correo', 'información', 'propuesta', 'oferta', 'empresa', 'trabajo'
  ];

  const userLower = userMessage.toLowerCase();
  return leadKeywords.some(keyword => userLower.includes(keyword));
}

/**
 * Detectar redirección automática
 */
function detectRedirect(userMessage) {
  const redirects = {
    libros: 'libros.html',
    favoritos: 'favoritos.html',
    comentarios: 'comentarios.html',
    contacto: 'contactanos.html',
    'leer después': 'para_leer_despues.html',
    registro: 'registrarse.html',
    sesión: 'iniciar sesion.html'
  };

  const messageLower = userMessage.toLowerCase();

  for (const [key, value] of Object.entries(redirects)) {
    if (messageLower.includes(key)) {
      return value;
    }
  }

  return null;
}

module.exports = {
  indexWebContent,
  searchRAG,
  getGPTResponse
};
