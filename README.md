# TechBlog - Blog de Informática

Un blog moderno y responsivo dedicado a temas de informática y tecnología, desarrollado con HTML5, CSS3, JavaScript ES6+ y JSON.

## 🚀 Características

### ✨ Funcionalidades Principales
- **Diseño Responsive**: Adaptable a todos los dispositivos (móvil, tablet, desktop)
- **Búsqueda en Tiempo Real**: Busca artículos por título, contenido o etiquetas
- **Filtros por Categoría**: Organiza el contenido por temas específicos
- **Modal de Artículos**: Visualización completa sin cambiar de página
- **Integración con YouTube**: Videos relacionados embebidos
- **Compartir en Redes Sociales**: Twitter, LinkedIn y Email
- **Navegación Suave**: Scroll animado entre secciones
- **Carga Progresiva**: Sistema de paginación para mejor rendimiento

### 🎨 Diseño y UX
- **Interfaz Moderna**: Colores profesionales y tipografía legible
- **Animaciones CSS**: Transiciones suaves y efectos visuales
- **Iconos FontAwesome**: Elementos visuales consistentes
- **Cards Interactivas**: Hover effects y feedback visual
- **Loading States**: Indicadores de carga para mejor UX

### 📱 Compatibilidad
- **Navegadores Modernos**: Chrome, Firefox, Safari, Edge
- **Dispositivos Móviles**: iOS y Android
- **Responsive Breakpoints**: 480px, 768px, 1024px+

## 🛠️ Tecnologías Utilizadas

### Frontend
- **HTML5**: Estructura semántica moderna
- **CSS3**: Grid, Flexbox, Variables CSS, Animaciones
- **JavaScript ES6+**: Async/Await, Modules, Arrow Functions
- **JSON**: Base de datos de artículos
- **FontAwesome**: Iconografía

### APIs Integradas
- **YouTube Data API**: Para videos relacionados (opcional)
- **Web APIs**: Fetch, LocalStorage, Intersection Observer

## 📁 Estructura del Proyecto

```
Blog/
├── index.html          # Página principal
├── article.html        # Página de artículo individual
├── estilo.css         # Estilos principales
├── script.js          # Funcionalidad JavaScript
├── articles.json      # Base de datos de artículos
└── README.md         # Documentación
```

## 🎯 Categorías de Contenido

### 💻 Programación
- Lenguajes de programación
- Frameworks y librerías
- Mejores prácticas
- Tutoriales paso a paso

### 🔒 Ciberseguridad
- Protección de datos
- Mejores prácticas
- Herramientas de seguridad
- Amenazas actuales

### 🧠 Inteligencia Artificial
- Machine Learning
- Deep Learning
- Aplicaciones prácticas
- Herramientas y frameworks

### 🌐 Desarrollo Web
- Frontend y Backend
- HTML5, CSS3, JavaScript
- Frameworks modernos
- Responsive Design

### 🗄️ Bases de Datos
- SQL y NoSQL
- Diseño de esquemas
- Optimización
- Herramientas populares

### ⚙️ Administración de Sistemas
- Linux y Windows
- Comandos esenciales
- Automatización
- DevOps

## 🚀 Cómo Ejecutar el Proyecto

### Método 1: Servidor Local con Python
```bash
# Navegar al directorio del proyecto
cd Blog

# Iniciar servidor (Python 3)
python -m http.server 3000

# Abrir en navegador
http://localhost:3000
```

### Método 2: Live Server (VS Code)
1. Instalar extensión "Live Server"
2. Clic derecho en `index.html`
3. Seleccionar "Open with Live Server"

### Método 3: Servidor Local (Node.js)
```bash
# Instalar http-server globalmente
npm install -g http-server

# Ejecutar en el directorio del proyecto
http-server -p 3000

# Abrir en navegador
http://localhost:3000
```

## 📝 Personalización

### Agregar Nuevos Artículos
Editar el archivo `articles.json`:

```json
{
  "id": 7,
  "title": "Título del nuevo artículo",
  "category": "categoria",
  "excerpt": "Breve descripción...",
  "content": "Contenido completo en markdown...",
  "author": "Nombre del autor",
  "date": "2025-10-31",
  "readTime": "10 min",
  "views": 0,
  "likes": 0,
  "image": "url_opcional_imagen",
  "tags": ["tag1", "tag2"],
  "youtubeVideos": ["video_id_opcional"],
  "resources": [
    {
      "title": "Recurso útil",
      "url": "https://ejemplo.com"
    }
  ]
}
```

### Personalizar Colores
Modificar variables CSS en `estilo.css`:

```css
:root {
    --primary-color: #2563eb;      /* Color principal */
    --secondary-color: #1e40af;    /* Color secundario */
    --accent-color: #3b82f6;       /* Color de acento */
    --background-color: #f8fafc;   /* Fondo general */
    --card-background: #ffffff;    /* Fondo de tarjetas */
    --text-primary: #1e293b;       /* Texto principal */
    --text-secondary: #64748b;     /* Texto secundario */
}
```

### Configurar API de YouTube
En `script.js`, agregar tu API key:

```javascript
const AppState = {
    youtubeApiKey: 'TU_API_KEY_AQUI'
};
```

## 🔧 Características Técnicas

### Rendimiento
- **Lazy Loading**: Imágenes y videos se cargan bajo demanda
- **Debounced Search**: Búsqueda optimizada con retraso
- **Paginación**: Carga progresiva de artículos
- **CSS Minificado**: Estilos optimizados
- **Compresión de Imágenes**: Formatos optimizados

### Accesibilidad
- **Navegación por Teclado**: Accesible via keyboard
- **Screen Readers**: Etiquetas ARIA apropiadas
- **Contraste de Color**: Cumple estándares WCAG
- **Texto Alternativo**: Imágenes con alt descriptivo

### SEO
- **Meta Tags**: Descripción y keywords
- **Estructura Semántica**: HTML5 semántico
- **URLs Amigables**: Enlaces descriptivos
- **Open Graph**: Meta datos para redes sociales

## 🐛 Solución de Problemas

### Problemas Comunes

#### Los artículos no cargan
1. Verificar que `articles.json` existe
2. Comprobar sintaxis JSON válida
3. Revisar consola del navegador para errores

#### Videos de YouTube no aparecen
1. Verificar IDs de video correctos
2. Comprobar conexión a internet
3. Verificar configuración de API key (opcional)

#### Estilos no se aplican
1. Verificar que `estilo.css` está enlazado
2. Comprobar rutas de archivos
3. Revisar cache del navegador (Ctrl+F5)

#### Búsqueda no funciona
1. Verificar que JavaScript está habilitado
2. Comprobar errores en consola
3. Verificar estructura de datos JSON

### Debugging
```javascript
// Habilitar logs detallados
localStorage.setItem('debug', 'true');

// Ver estado de la aplicación
console.log(AppState);

// Verificar artículos cargados
console.log('Artículos:', AppState.articles.length);
```

## 🔮 Futuras Mejoras

### Funcionalidades Planificadas
- [ ] Comentarios en artículos
- [ ] Sistema de usuarios y autenticación
- [ ] Modo oscuro/claro
- [ ] PWA (Progressive Web App)
- [ ] Búsqueda avanzada con filtros
- [ ] Sistema de favoritos
- [ ] Newsletter subscription
- [ ] Análisis de estadísticas

### Mejoras Técnicas
- [ ] Service Workers para cache
- [ ] Optimización de imágenes WebP
- [ ] Lazy loading mejorado
- [ ] Bundle optimization
- [ ] TypeScript migration
- [ ] Testing automatizado

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Puedes usarlo, modificarlo y distribuirlo libremente.

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Para contribuir:

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/NuevaFuncionalidad`)
3. Commit tus cambios (`git commit -m 'Agregar nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/NuevaFuncionalidad`)
5. Abre un Pull Request

## 📞 Soporte

Si tienes preguntas o encuentras problemas:

1. Revisa la documentación
2. Busca en issues existentes
3. Crea un nuevo issue si es necesario

## 🙏 Agradecimientos

- FontAwesome por los iconos
- YouTube API por la integración de videos
- Comunidad de desarrolladores por la inspiración

---

**TechBlog** - Tu fuente de conocimiento en informática y tecnología 🚀

*Desarrollado con ❤️ para la comunidad tech*