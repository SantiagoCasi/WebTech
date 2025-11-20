// Estado global de la aplicación
const AppState = {
    articles: [],
    filteredArticles: [],
    currentFilter: 'all',
    searchTerm: '',
    articlesPerPage: 6,
    currentPage: 1,
    youtubeApiKey: '', // Se puede configurar con una API key real
    isLoading: false
};

// Configuración de la API de YouTube
const YOUTUBE_API_BASE = 'https://www.googleapis.com/youtube/v3';

// Inicialización de la aplicación
document.addEventListener('DOMContentLoaded', async () => {
    console.log('🚀 Inicializando aplicación...');
    try {
        showLoading(true);
        console.log('📥 Cargando artículos...');
        await loadArticles();
        console.log('🎯 Inicializando event listeners...');
        initializeEventListeners();
        console.log('🎨 Filtrando y renderizando artículos...');
        filterAndRenderArticles();
        showLoading(false);
        console.log('✅ Aplicación inicializada correctamente');
    } catch (error) {
        console.error('❌ Error inicializando la aplicación:', error);
        showError('Error cargando los artículos. Por favor, recarga la página.');
        showLoading(false);
    }
});

// Cargar artículos desde el archivo JSON
async function loadArticles() {
    console.log('🔄 Intentando cargar articles.json...');
    try {
        const response = await fetch('articles.json');
        console.log('📡 Respuesta del fetch:', response.status, response.statusText);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log('📄 Datos recibidos:', data);
        AppState.articles = data.articles || [];
        AppState.filteredArticles = [...AppState.articles];
        console.log(`✅ Cargados ${AppState.articles.length} artículos exitosamente`);
        console.log('📝 Primeros 3 artículos:', AppState.articles.slice(0, 3));
    } catch (error) {
        console.error('❌ Error cargando artículos:', error);
        // Datos de respaldo en caso de error
        AppState.articles = [];
        AppState.filteredArticles = [];
        throw error;
    }
}

// Inicializar event listeners
function initializeEventListeners() {
    // Navegación
    initializeNavigation();
    
    // Búsqueda
    initializeSearch();
    
    // Filtros
    initializeFilters();
    
    // Categorías
    initializeCategoryCards();
    
    // Cargar más artículos
    initializeLoadMore();
    
    // Modal
    initializeModal();
    
    // Scroll suave para navegación
    initializeSmoothScrolling();
    
    // Menú móvil
    initializeMobileMenu();
}

// Navegación
function initializeNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
}

// Búsqueda
function initializeSearch() {
    const searchInput = document.getElementById('searchInput');
    const searchBtn = document.getElementById('searchBtn');
    
    if (searchInput && searchBtn) {
        // Búsqueda en tiempo real
        searchInput.addEventListener('input', debounce((e) => {
            AppState.searchTerm = e.target.value.toLowerCase();
            AppState.currentPage = 1;
            filterAndRenderArticles();
        }, 300));
        
        // Búsqueda al hacer clic en el botón
        searchBtn.addEventListener('click', () => {
            AppState.searchTerm = searchInput.value.toLowerCase();
            AppState.currentPage = 1;
            filterAndRenderArticles();
        });
        
        // Búsqueda al presionar Enter
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                AppState.searchTerm = searchInput.value.toLowerCase();
                AppState.currentPage = 1;
                filterAndRenderArticles();
            }
        });
    }
}

// Filtros
function initializeFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const filterValue = btn.dataset.filter;
            
            // Mapeo de categorías a sus páginas especializadas
            const categoryPages = {
                'programacion': 'programacion.html',
                'sistemas': 'sistemas.html',
                'ia': 'ia.html',
                'web': 'web.html',
                'ciberseguridad': 'ciberseguridad.html',
                'bases-datos': 'bases-datos.html',
                'historia': 'historia.html'
            };
            
            // Si el filtro corresponde a una categoría con página especializada
            if (categoryPages[filterValue]) {
                // Confirmar navegación a página especializada
                if (confirm(`¿Quieres ver la página completa de ${btn.textContent}? Tiene contenido especializado y recursos adicionales.`)) {
                    window.location.href = categoryPages[filterValue];
                    return;
                }
            }
            
            // Comportamiento normal de filtrado para "Todos" u otras categorías
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            // Aplicar filtro
            AppState.currentFilter = filterValue;
            AppState.currentPage = 1;
            filterAndRenderArticles();
        });
    });
}

// Tarjetas de categorías
function initializeCategoryCards() {
    const categoryCards = document.querySelectorAll('.category-card');
    categoryCards.forEach(card => {
        card.addEventListener('click', () => {
            const category = card.dataset.category;
            
            // Mapeo de categorías a sus páginas especializadas
            const categoryPages = {
                'programacion': 'programacion.html',
                'sistemas': 'sistemas.html',
                'ia': 'ia.html',
                'web': 'web.html',
                'ciberseguridad': 'ciberseguridad.html',
                'bases-datos': 'bases-datos.html',
                'historia': 'historia.html'
            };
            
            // Si la categoría tiene página especializada, navegar a ella
            if (categoryPages[category]) {
                window.location.href = categoryPages[category];
                return;
            }
            
            // Para categorías sin página especializada (fallback)
            // Actualizar filtro activo
            const filterButtons = document.querySelectorAll('.filter-btn');
            filterButtons.forEach(btn => {
                btn.classList.toggle('active', btn.dataset.filter === category);
            });
            
            // Aplicar filtro y navegar a artículos
            AppState.currentFilter = category;
            AppState.currentPage = 1;
            filterAndRenderArticles();
            
            // Navegar a sección de artículos
            document.getElementById('articles').scrollIntoView({ behavior: 'smooth' });
        });
    });
}

// Cargar más artículos
function initializeLoadMore() {
    const loadMoreBtn = document.getElementById('loadMoreBtn');
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', () => {
            AppState.currentPage++;
            renderArticles(true); // append = true
        });
    }
}

// Modal
function initializeModal() {
    const modal = document.getElementById('articleModal');
    const closeBtn = modal?.querySelector('.close');
    
    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            closeModal();
        });
    }
    
    if (modal) {
        window.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeModal();
            }
        });
    }
}

// Menú móvil
function initializeMobileMenu() {
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
        });
        
        // Cerrar menú al hacer clic en un enlace
        const navLinks = navMenu.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
            });
        });
    }
}

// Scroll suave
function initializeSmoothScrolling() {
    // Ya implementado en initializeNavigation()
}

// Filtrar y renderizar artículos
function filterAndRenderArticles() {
    // Aplicar filtros
    AppState.filteredArticles = AppState.articles.filter(article => {
        const matchesCategory = AppState.currentFilter === 'all' || article.category === AppState.currentFilter;
        const matchesSearch = AppState.searchTerm === '' || 
                             article.title.toLowerCase().includes(AppState.searchTerm) ||
                             article.excerpt.toLowerCase().includes(AppState.searchTerm) ||
                             article.content.toLowerCase().includes(AppState.searchTerm) ||
                             article.tags.some(tag => tag.toLowerCase().includes(AppState.searchTerm));
        
        return matchesCategory && matchesSearch;
    });
    
    renderArticles();
}

// Renderizar artículos
function renderArticles(append = false) {
    console.log('🎨 Renderizando artículos...');
    console.log('📊 Estado actual:', {
        totalArticles: AppState.articles.length,
        filteredArticles: AppState.filteredArticles.length,
        currentPage: AppState.currentPage,
        currentFilter: AppState.currentFilter
    });
    
    const container = document.getElementById('articlesContainer');
    const loadMoreBtn = document.getElementById('loadMoreBtn');
    
    if (!container) {
        console.error('❌ No se encontró el contenedor de artículos');
        return;
    }
    
    const startIndex = (AppState.currentPage - 1) * AppState.articlesPerPage;
    const endIndex = startIndex + AppState.articlesPerPage;
    const articlesToShow = AppState.filteredArticles.slice(
        append ? 0 : startIndex, 
        endIndex
    );
    
    console.log('📋 Artículos a mostrar:', articlesToShow.length, 'de', AppState.filteredArticles.length);
    
    if (!append) {
        container.innerHTML = '';
    }
    
    if (articlesToShow.length === 0 && !append) {
        console.log('⚠️ No hay artículos para mostrar');
        container.innerHTML = `
            <div class="no-articles">
                <i class="fas fa-search"></i>
                <h3>No se encontraron artículos</h3>
                <p>Intenta con otros términos de búsqueda o filtros.</p>
            </div>
        `;
        if (loadMoreBtn) loadMoreBtn.style.display = 'none';
        return;
    }
    
    articlesToShow.forEach((article, index) => {
        console.log(`📄 Creando tarjeta para: ${article.title}`);
        const articleElement = createArticleCard(article);
        articleElement.style.animationDelay = `${index * 0.1}s`;
        container.appendChild(articleElement);
    });
    
    // Mostrar/ocultar botón "Cargar más"
    if (loadMoreBtn) {
        const hasMore = endIndex < AppState.filteredArticles.length;
        loadMoreBtn.style.display = hasMore ? 'block' : 'none';
        console.log('🔄 Botón "Cargar más":', hasMore ? 'visible' : 'oculto');
    }
    
    console.log('✅ Renderizado completado');
}

// Crear tarjeta de artículo
function createArticleCard(article) {
    console.log('🏗️ Creando tarjeta para artículo:', article.title);
    const card = document.createElement('div');
    card.className = 'article-card';
    card.onclick = () => openArticleModal(article);
    
    const categoryNames = {
        'programacion': 'Programación',
        'ciberseguridad': 'Ciberseguridad',
        'ia': 'Inteligencia Artificial',
        'web': 'Desarrollo Web',
        'bases-datos': 'Bases de Datos',
        'sistemas': 'Sistemas',
        'historia': 'Historia'
    };
    
    card.innerHTML = `
        <div class="article-image">
            ${article.image ? 
                `<img src="${article.image}" alt="${article.title}" loading="lazy">` : 
                `<i class="fas ${getCategoryIcon(article.category)}"></i>`
            }
        </div>
        <div class="article-content">
            <div class="article-meta">
                <span class="article-category">${categoryNames[article.category] || article.category}</span>
                <span class="article-date">${formatDate(article.date)}</span>
            </div>
            <h3 class="article-title">${article.title}</h3>
            <p class="article-excerpt">${article.excerpt}</p>
            <div class="article-footer">
                <a href="#" class="read-more">
                    Leer más <i class="fas fa-arrow-right"></i>
                </a>
                <div class="article-stats">
                    <span><i class="fas fa-eye"></i> ${article.views}</span>
                    <span><i class="fas fa-heart"></i> ${article.likes}</span>
                    <span><i class="fas fa-clock"></i> ${article.readTime}</span>
                </div>
            </div>
        </div>
    `;
    
    return card;
}

// Obtener icono de categoría
function getCategoryIcon(category) {
    const icons = {
        'programacion': 'fa-code',
        'ciberseguridad': 'fa-shield-alt',
        'ia': 'fa-brain',
        'web': 'fa-globe',
        'bases-datos': 'fa-database',
        'sistemas': 'fa-server'
    };
    return icons[category] || 'fa-file-alt';
}

// Formatear fecha
function formatDate(dateString) {
    const date = new Date(dateString);
    const options = { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    };
    return date.toLocaleDateString('es-ES', options);
}

// Abrir modal de artículo
function openArticleModal(article) {
    const modal = document.getElementById('articleModal');
    const modalContent = document.getElementById('modalContent');
    
    if (!modal || !modalContent) return;
    
    // Renderizar contenido del modal
    modalContent.innerHTML = renderArticleContent(article);
    
    // Mostrar modal
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
    
    // Cargar videos de YouTube si están disponibles
    if (article.youtubeVideos && article.youtubeVideos.length > 0) {
        loadYouTubeVideos(article.youtubeVideos);
    }
    
    // Aplicar syntax highlighting si hay código
    highlightCode();
}

// Cerrar modal
function closeModal() {
    const modal = document.getElementById('articleModal');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}

// Renderizar contenido del artículo
function renderArticleContent(article) {
    const categoryNames = {
        'programacion': 'Programación',
        'ciberseguridad': 'Ciberseguridad',
        'ia': 'Inteligencia Artificial',
        'web': 'Desarrollo Web',
        'bases-datos': 'Bases de Datos',
        'sistemas': 'Sistemas'
    };
    
    return `
        <article class="modal-article">
            <header class="modal-header">
                <div class="article-meta">
                    <span class="article-category">${categoryNames[article.category] || article.category}</span>
                    <span class="article-date">${formatDate(article.date)}</span>
                </div>
                <h1>${article.title}</h1>
                <div class="article-info">
                    <span><i class="fas fa-user"></i> ${article.author}</span>
                    <span><i class="fas fa-clock"></i> ${article.readTime}</span>
                    <span><i class="fas fa-eye"></i> ${article.views} visualizaciones</span>
                    <span><i class="fas fa-heart"></i> ${article.likes} me gusta</span>
                </div>
                ${article.tags ? `
                    <div class="article-tags">
                        ${article.tags.map(tag => `<span class="tag">#${tag}</span>`).join('')}
                    </div>
                ` : ''}
            </header>
            
            <div class="modal-body">
                <div class="article-content-text">
                    ${formatArticleContent(article.content)}
                </div>
                
                ${article.youtubeVideos && article.youtubeVideos.length > 0 ? `
                    <section class="youtube-videos">
                        <h3><i class="fab fa-youtube"></i> Videos Relacionados</h3>
                        <div id="youtubeContainer" class="youtube-container">
                            <div class="loading-videos">
                                <i class="fas fa-spinner fa-spin"></i>
                                <p>Cargando videos...</p>
                            </div>
                        </div>
                    </section>
                ` : ''}
                
                ${article.resources && article.resources.length > 0 ? `
                    <section class="article-resources">
                        <h3><i class="fas fa-link"></i> Recursos Adicionales</h3>
                        <ul>
                            ${article.resources.map(resource => `
                                <li>
                                    <a href="${resource.url}" target="_blank" rel="noopener">
                                        ${resource.title}
                                        <i class="fas fa-external-link-alt"></i>
                                    </a>
                                </li>
                            `).join('')}
                        </ul>
                    </section>
                ` : ''}
            </div>
            
            <footer class="modal-footer">
                <div class="share-buttons">
                    <h4>Compartir artículo:</h4>
                    <a href="https://twitter.com/intent/tweet?text=${encodeURIComponent(article.title)}&url=${encodeURIComponent(window.location.href)}" 
                       target="_blank" class="share-btn twitter">
                        <i class="fab fa-twitter"></i> Twitter
                    </a>
                    <a href="https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}" 
                       target="_blank" class="share-btn linkedin">
                        <i class="fab fa-linkedin"></i> LinkedIn
                    </a>
                    <a href="mailto:?subject=${encodeURIComponent(article.title)}&body=${encodeURIComponent('Te comparto este interesante artículo: ' + window.location.href)}" 
                       class="share-btn email">
                        <i class="fas fa-envelope"></i> Email
                    </a>
                </div>
            </footer>
        </article>
    `;
}

// Formatear contenido del artículo (convertir markdown básico a HTML)
function formatArticleContent(content) {
    return content
        // Títulos
        .replace(/^## (.*$)/gm, '<h2>$1</h2>')
        .replace(/^### (.*$)/gm, '<h3>$1</h3>')
        .replace(/^#### (.*$)/gm, '<h4>$1</h4>')
        
        // Código
        .replace(/```(\w+)?\n([\s\S]*?)```/g, '<pre><code class="language-$1">$2</code></pre>')
        .replace(/`([^`]+)`/g, '<code>$1</code>')
        
        // Listas
        .replace(/^- (.*$)/gm, '<li>$1</li>')
        .replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>')
        
        // Checkboxes
        .replace(/^✅ (.*$)/gm, '<div class="checkbox checked"><i class="fas fa-check"></i> $1</div>')
        .replace(/^❌ (.*$)/gm, '<div class="checkbox unchecked"><i class="fas fa-times"></i> $1</div>')
        
        // Enlaces
        .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>')
        
        // Negritas
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        
        // Párrafos
        .replace(/\n\n/g, '</p><p>')
        .replace(/^/, '<p>')
        .replace(/$/, '</p>')
        
        // Limpiar párrafos vacíos
        .replace(/<p><\/p>/g, '')
        .replace(/<p>(<h[1-6]>)/g, '$1')
        .replace(/(<\/h[1-6]>)<\/p>/g, '$1');
}

// Cargar videos de YouTube
async function loadYouTubeVideos(videoIds) {
    const container = document.getElementById('youtubeContainer');
    if (!container) return;
    
    try {
        // Si no hay API key, mostrar videos embebidos directamente
        if (!AppState.youtubeApiKey) {
            renderEmbeddedVideos(videoIds, container);
            return;
        }
        
        // Si hay API key, obtener información detallada
        const videoInfos = await Promise.all(
            videoIds.map(id => fetchYouTubeVideoInfo(id))
        );
        
        renderYouTubeVideos(videoInfos, container);
        
    } catch (error) {
        console.error('Error cargando videos:', error);
        renderEmbeddedVideos(videoIds, container);
    }
}

// Renderizar videos embebidos (sin API)
function renderEmbeddedVideos(videoIds, container) {
    container.innerHTML = videoIds.map(videoId => `
        <div class="youtube-video">
            <div class="video-embed">
                <iframe 
                    src="https://www.youtube.com/embed/${videoId}" 
                    frameborder="0" 
                    allowfullscreen
                    loading="lazy">
                </iframe>
            </div>
            <div class="video-info">
                <h4>Video relacionado</h4>
                <a href="https://www.youtube.com/watch?v=${videoId}" target="_blank" rel="noopener">
                    Ver en YouTube <i class="fas fa-external-link-alt"></i>
                </a>
            </div>
        </div>
    `).join('');
}

// Obtener información del video de YouTube (con API)
async function fetchYouTubeVideoInfo(videoId) {
    const url = `${YOUTUBE_API_BASE}/videos?part=snippet,statistics&id=${videoId}&key=${AppState.youtubeApiKey}`;
    
    try {
        const response = await fetch(url);
        const data = await response.json();
        
        if (data.items && data.items.length > 0) {
            return data.items[0];
        }
        throw new Error('Video no encontrado');
    } catch (error) {
        console.error('Error obteniendo info del video:', error);
        return { id: videoId, snippet: { title: 'Video relacionado' } };
    }
}

// Renderizar videos con información (con API)
function renderYouTubeVideos(videoInfos, container) {
    container.innerHTML = videoInfos.map(video => `
        <div class="youtube-video">
            <div class="video-embed">
                <iframe 
                    src="https://www.youtube.com/embed/${video.id}" 
                    frameborder="0" 
                    allowfullscreen
                    loading="lazy">
                </iframe>
            </div>
            <div class="video-info">
                <h4>${video.snippet.title}</h4>
                <p>${video.snippet.description ? video.snippet.description.substring(0, 100) + '...' : ''}</p>
                ${video.statistics ? `
                    <div class="video-stats">
                        <span><i class="fas fa-eye"></i> ${formatNumber(video.statistics.viewCount)}</span>
                        <span><i class="fas fa-thumbs-up"></i> ${formatNumber(video.statistics.likeCount)}</span>
                    </div>
                ` : ''}
                <a href="https://www.youtube.com/watch?v=${video.id}" target="_blank" rel="noopener">
                    Ver en YouTube <i class="fas fa-external-link-alt"></i>
                </a>
            </div>
        </div>
    `).join('');
}

// Formatear números
function formatNumber(num) {
    if (num >= 1000000) {
        return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
}

// Resaltar código (básico)
function highlightCode() {
    const codeBlocks = document.querySelectorAll('pre code');
    codeBlocks.forEach(block => {
        block.classList.add('highlighted');
        // Aquí se podría integrar una librería como Prism.js o highlight.js
    });
}

// Utilidades
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function showLoading(show) {
    AppState.isLoading = show;
    const container = document.getElementById('articlesContainer');
    if (!container) return;
    
    if (show) {
        container.innerHTML = `
            <div class="loading-articles">
                <i class="fas fa-spinner fa-spin"></i>
                <p>Cargando artículos...</p>
            </div>
        `;
    } else {
        // Limpiar el contenedor cuando no se está cargando
        // Solo si actualmente está mostrando el loading
        if (container.querySelector('.loading-articles')) {
            container.innerHTML = '';
        }
    }
}

function showError(message) {
    const container = document.getElementById('articlesContainer');
    if (!container) return;
    
    container.innerHTML = `
        <div class="error-message">
            <i class="fas fa-exclamation-triangle"></i>
            <h3>¡Oops! Algo salió mal</h3>
            <p>${message}</p>
            <button onclick="location.reload()" class="retry-btn">
                <i class="fas fa-redo"></i> Intentar de nuevo
            </button>
        </div>
    `;
}

// Agregar estilos adicionales para elementos dinámicos
const additionalStyles = `
<style>
.no-articles, .loading-articles, .error-message {
    grid-column: 1 / -1;
    text-align: center;
    padding: 4rem 2rem;
    color: var(--text-secondary);
}

.no-articles i, .loading-articles i, .error-message i {
    font-size: 4rem;
    margin-bottom: 1rem;
    color: var(--primary-color);
}

.error-message {
    color: #dc3545;
}

.retry-btn {
    background: var(--primary-color);
    color: white;
    border: none;
    padding: 0.75rem 1.5rem;
    border-radius: 6px;
    cursor: pointer;
    margin-top: 1rem;
    transition: var(--transition);
}

.retry-btn:hover {
    background: var(--secondary-color);
}

.modal-article {
    line-height: 1.8;
}

.modal-header {
    margin-bottom: 2rem;
    padding-bottom: 1rem;
    border-bottom: 2px solid var(--border-color);
}

.modal-header h1 {
    font-size: 2.5rem;
    margin: 1rem 0;
    color: var(--text-primary);
}

.article-info {
    display: flex;
    gap: 1.5rem;
    margin: 1rem 0;
    flex-wrap: wrap;
    font-size: 0.9rem;
    color: var(--text-secondary);
}

.article-tags {
    margin-top: 1rem;
}

.tag {
    background: var(--primary-color);
    color: white;
    padding: 0.25rem 0.75rem;
    border-radius: 20px;
    font-size: 0.8rem;
    margin-right: 0.5rem;
    margin-bottom: 0.5rem;
    display: inline-block;
}

.article-content-text {
    margin-bottom: 3rem;
}

.article-content-text h2 {
    color: var(--primary-color);
    margin: 2rem 0 1rem 0;
    padding-bottom: 0.5rem;
    border-bottom: 2px solid var(--border-color);
}

.article-content-text h3 {
    color: var(--text-primary);
    margin: 1.5rem 0 1rem 0;
}

.article-content-text pre {
    background: #f8f9fa;
    border: 1px solid var(--border-color);
    border-radius: 8px;
    padding: 1.5rem;
    overflow-x: auto;
    margin: 1.5rem 0;
}

.article-content-text code {
    background: #f8f9fa;
    padding: 0.25rem 0.5rem;
    border-radius: 4px;
    font-family: 'Courier New', monospace;
    font-size: 0.9em;
}

.article-content-text pre code {
    background: none;
    padding: 0;
    border-radius: 0;
}

.checkbox {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin: 0.5rem 0;
    padding: 0.5rem;
    border-radius: 6px;
}

.checkbox.checked {
    background: #d4edda;
    color: #155724;
}

.checkbox.unchecked {
    background: #f8d7da;
    color: #721c24;
}

.youtube-videos {
    margin: 3rem 0;
    padding: 2rem;
    background: var(--background-color);
    border-radius: 12px;
}

.youtube-videos h3 {
    color: #ff0000;
    margin-bottom: 1.5rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

.youtube-container {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 1.5rem;
}

.youtube-video {
    background: white;
    border-radius: 8px;
    overflow: hidden;
    box-shadow: var(--shadow);
}

.video-embed {
    position: relative;
    width: 100%;
    height: 0;
    padding-bottom: 56.25%; /* 16:9 aspect ratio */
}

.video-embed iframe {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
}

.video-info {
    padding: 1rem;
}

.video-info h4 {
    margin-bottom: 0.5rem;
    color: var(--text-primary);
}

.video-stats {
    display: flex;
    gap: 1rem;
    margin: 0.5rem 0;
    font-size: 0.9rem;
    color: var(--text-secondary);
}

.article-resources {
    margin: 3rem 0;
    padding: 2rem;
    background: var(--background-color);
    border-radius: 12px;
}

.article-resources h3 {
    color: var(--primary-color);
    margin-bottom: 1rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

.article-resources ul {
    list-style: none;
    padding: 0;
}

.article-resources li {
    margin-bottom: 0.75rem;
}

.article-resources a {
    color: var(--primary-color);
    text-decoration: none;
    padding: 0.5rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-radius: 6px;
    transition: var(--transition);
}

.article-resources a:hover {
    background: white;
    box-shadow: var(--shadow);
}

.modal-footer {
    margin-top: 3rem;
    padding-top: 2rem;
    border-top: 2px solid var(--border-color);
}

.share-buttons h4 {
    margin-bottom: 1rem;
    color: var(--text-primary);
}

.share-buttons {
    display: flex;
    gap: 1rem;
    align-items: center;
    flex-wrap: wrap;
}

.share-btn {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 1rem;
    border-radius: 6px;
    text-decoration: none;
    color: white;
    font-size: 0.9rem;
    transition: var(--transition);
}

.share-btn.twitter {
    background: #1da1f2;
}

.share-btn.linkedin {
    background: #0077b5;
}

.share-btn.email {
    background: #6c757d;
}

.share-btn:hover {
    transform: translateY(-2px);
    box-shadow: var(--shadow);
}

.loading-videos {
    text-align: center;
    padding: 2rem;
    color: var(--text-secondary);
}

.loading-videos i {
    font-size: 2rem;
    margin-bottom: 1rem;
    color: var(--primary-color);
}

@media (max-width: 768px) {
    .article-info {
        flex-direction: column;
        gap: 0.5rem;
    }
    
    .modal-header h1 {
        font-size: 2rem;
    }
    
    .youtube-container {
        grid-template-columns: 1fr;
    }
    
    .share-buttons {
        flex-direction: column;
        align-items: flex-start;
    }
}
</style>
`;

// Insertar estilos adicionales
document.head.insertAdjacentHTML('beforeend', additionalStyles);

console.log('TechBlog inicializado correctamente ✅');

// ===== PARTÍCULAS MÁGICAS DEL CURSOR =====
class CursorParticles {
    constructor() {
        this.container = document.getElementById('cursor-particles');
        this.particles = [];
        this.maxParticles = 50;
        this.init();
    }

    init() {
        document.addEventListener('mousemove', (e) => {
            this.createParticle(e.clientX, e.clientY);
        });

        // Limpieza automática de partículas
        setInterval(() => {
            this.cleanupParticles();
        }, 100);
    }

    createParticle(x, y) {
        if (this.particles.length >= this.maxParticles) {
            this.removeOldestParticle();
        }

        const particle = document.createElement('div');
        const isStarParticle = Math.random() < 0.3; // 30% chance de estrella
        
        particle.className = `cursor-particle ${isStarParticle ? 'star' : ''}`;
        
        // Posición con pequeña variación aleatoria
        const offsetX = (Math.random() - 0.5) * 20;
        const offsetY = (Math.random() - 0.5) * 20;
        
        particle.style.left = `${x + offsetX}px`;
        particle.style.top = `${y + offsetY}px`;
        
        this.container.appendChild(particle);
        this.particles.push({
            element: particle,
            timestamp: Date.now()
        });

        // Remover partícula después de la animación
        setTimeout(() => {
            if (particle.parentNode) {
                particle.parentNode.removeChild(particle);
                this.particles = this.particles.filter(p => p.element !== particle);
            }
        }, isStarParticle ? 2000 : 1500);
    }

    removeOldestParticle() {
        if (this.particles.length > 0) {
            const oldest = this.particles.shift();
            if (oldest.element.parentNode) {
                oldest.element.parentNode.removeChild(oldest.element);
            }
        }
    }

    cleanupParticles() {
        const now = Date.now();
        this.particles = this.particles.filter(particle => {
            if (now - particle.timestamp > 3000 || !particle.element.parentNode) {
                if (particle.element.parentNode) {
                    particle.element.parentNode.removeChild(particle.element);
                }
                return false;
            }
            return true;
        });
    }
}

// ===== SISTEMA DE METEORITOS =====
class MeteoriteSystem {
    constructor() {
        this.container = document.getElementById('meteorites-container');
        this.init();
    }

    init() {
        this.spawnMeteorite();
        // Spawn meteorito cada 8-15 segundos
        setInterval(() => {
            if (Math.random() < 0.7) { // 70% chance
                this.spawnMeteorite();
            }
        }, Math.random() * 7000 + 8000);
    }

    spawnMeteorite() {
        const meteorite = document.createElement('div');
        meteorite.className = 'meteorite';
        
        // Posición inicial aleatoria en el borde superior-izquierdo
        const startX = Math.random() * 200 - 100; // -100 a 100
        const startY = Math.random() * 200 - 100; // -100 a 100
        
        meteorite.style.left = `${startX}px`;
        meteorite.style.top = `${startY}px`;
        
        // Velocidad aleatoria
        const duration = Math.random() * 2000 + 2000; // 2-4 segundos
        meteorite.style.animationDuration = `${duration}ms`;
        
        this.container.appendChild(meteorite);
        
        // Remover después de la animación
        setTimeout(() => {
            if (meteorite.parentNode) {
                meteorite.parentNode.removeChild(meteorite);
            }
        }, duration);
    }
}
/*

// ===== MINI-JUEGO ESPACIAL
class SpaceGame {
    constructor() {
        this.gameContainer = document.getElementById('space-game');
        this.spaceship = document.getElementById('spaceship');
        this.asteroidsContainer = document.getElementById('asteroids-container');
        this.scoreElement = document.getElementById('score');
        
        this.isActive = false;
        this.score = 0;
        this.playerPos = { x: 50, y: 80 }; // Porcentaje de la pantalla
        this.asteroids = [];
        this.gameSpeed = 100; // ms entre frames
        
        this.keys = {
            w: false, a: false, s: false, d: false,
            ArrowUp: false, ArrowLeft: false, ArrowDown: false, ArrowRight: false
        };
        
        this.init();
    }

    init() {
        // Listener para activar/desactivar juego con 'G'
        document.addEventListener('keydown', (e) => {
            if (e.key.toLowerCase() === 'g') {
                this.toggle();
            }
            
            if (this.isActive && this.keys.hasOwnProperty(e.key)) {
                this.keys[e.key] = true;
            }
        });

        document.addEventListener('keyup', (e) => {
            if (this.isActive && this.keys.hasOwnProperty(e.key)) {
                this.keys[e.key] = false;
            }
        });

        // Soporte táctil para móviles
        this.addTouchControls();
    }

    addTouchControls() {
        let touchStartX = 0;
        let touchStartY = 0;
        
        document.addEventListener('touchstart', (e) => {
            if (!this.isActive) return;
            touchStartX = e.touches[0].clientX;
            touchStartY = e.touches[0].clientY;
        }, { passive: true });
        
        document.addEventListener('touchmove', (e) => {
            if (!this.isActive) return;
            e.preventDefault();
            
            const touchX = e.touches[0].clientX;
            const touchY = e.touches[0].clientY;
            
            const deltaX = touchX - touchStartX;
            const deltaY = touchY - touchStartY;
            
            // Convertir movimiento táctil a posición del jugador
            const sensitivity = 0.1;
            this.playerPos.x = Math.max(0, Math.min(95, this.playerPos.x + deltaX * sensitivity));
            this.playerPos.y = Math.max(0, Math.min(95, this.playerPos.y + deltaY * sensitivity));
            
            touchStartX = touchX;
            touchStartY = touchY;
        }, { passive: false });
    }

    toggle() {
        this.isActive = !this.isActive;
        
        if (this.isActive) {
            this.start();
        } else {
            this.stop();
        }
    }

    start() {
        this.gameContainer.classList.remove('hidden');
        this.score = 0;
        this.updateScore();
        this.resetPlayer();
        this.clearAsteroids();
        
        // Iniciar loops del juego
        this.gameLoop = setInterval(() => this.update(), this.gameSpeed);
        this.asteroidSpawner = setInterval(() => this.spawnAsteroid(), 1500);
    }

    stop() {
        this.gameContainer.classList.add('hidden');
        clearInterval(this.gameLoop);
        clearInterval(this.asteroidSpawner);
        this.clearAsteroids();
    }

    update() {
        this.updatePlayerMovement();
        this.updateAsteroids();
        this.checkCollisions();
    }

    updatePlayerMovement() {
        const speed = 2; // Velocidad de movimiento
        
        if (this.keys.w || this.keys.ArrowUp) {
            this.playerPos.y = Math.max(0, this.playerPos.y - speed);
        }
        if (this.keys.s || this.keys.ArrowDown) {
            this.playerPos.y = Math.min(95, this.playerPos.y + speed);
        }
        if (this.keys.a || this.keys.ArrowLeft) {
            this.playerPos.x = Math.max(0, this.playerPos.x - speed);
        }
        if (this.keys.d || this.keys.ArrowRight) {
            this.playerPos.x = Math.min(95, this.playerPos.x + speed);
        }
        
        this.spaceship.style.left = `${this.playerPos.x}%`;
        this.spaceship.style.top = `${this.playerPos.y}%`;
    }

    spawnAsteroid() {
        if (!this.isActive) return;
        
        const asteroid = document.createElement('div');
        asteroid.className = 'asteroid';
        asteroid.textContent = ['☄️', '🪨', '💫'][Math.floor(Math.random() * 3)];
        
        const startX = Math.random() * 90; // 0-90% del ancho
        asteroid.style.left = `${startX}%`;
        asteroid.style.top = '-50px';
        
        this.asteroidsContainer.appendChild(asteroid);
        this.asteroids.push({
            element: asteroid,
            x: startX,
            y: -5
        });
        
        // Remover después de 4 segundos
        setTimeout(() => {
            if (asteroid.parentNode) {
                asteroid.parentNode.removeChild(asteroid);
                this.asteroids = this.asteroids.filter(a => a.element !== asteroid);
            }
        }, 4000);
    }

    updateAsteroids() {
        this.asteroids.forEach(asteroid => {
            asteroid.y += 1; // Velocidad de caída
            if (asteroid.y > 100) {
                this.score += 10; // Puntos por esquivar
                this.updateScore();
            }
        });
        
        // Limpiar asteroides fuera de pantalla
        this.asteroids = this.asteroids.filter(asteroid => {
            if (asteroid.y > 100) {
                if (asteroid.element.parentNode) {
                    asteroid.element.parentNode.removeChild(asteroid.element);
                }
                return false;
            }
            return true;
        });
    }

    checkCollisions() {
        this.asteroids.forEach(asteroid => {
            const distance = Math.sqrt(
                Math.pow(asteroid.x - this.playerPos.x, 2) + 
                Math.pow(asteroid.y - this.playerPos.y, 2)
            );
            
            if (distance < 8) { // Colisión detectada
                this.gameOver();
            }
        });
    }

    gameOver() {
        alert(`¡Game Over! 🚀\nPuntuación final: ${this.score}\n\nPresiona G para jugar de nuevo!`);
        this.stop();
    }

    resetPlayer() {
        this.playerPos = { x: 50, y: 80 };
        this.spaceship.style.left = '50%';
        this.spaceship.style.top = '80%';
    }

    clearAsteroids() {
        this.asteroids.forEach(asteroid => {
            if (asteroid.element.parentNode) {
                asteroid.element.parentNode.removeChild(asteroid.element);
            }
        });
        this.asteroids = [];
    }

    updateScore() {
        this.scoreElement.textContent = this.score;
    }
}
*/
/*
// ===== SISTEMA DE TEMAS =====
class ThemeManager {
    constructor() {
        this.currentTheme = localStorage.getItem('blog-theme') || 'default';
        this.init();
    }

    init() {
        this.applyTheme(this.currentTheme);
        
        // Event listeners para botones de tema
        document.querySelectorAll('.theme-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const theme = btn.dataset.theme;
                this.switchTheme(theme);
            });
        });
    }

    switchTheme(theme) {
        this.currentTheme = theme;
        this.applyTheme(theme);
        localStorage.setItem('blog-theme', theme);
        
        // Actualizar botones activos
        document.querySelectorAll('.theme-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.theme === theme);
        });
    }

    applyTheme(theme) {
        document.body.className = theme === 'galaxy' ? 'galaxy-mode' : '';
        
        // Actualizar botón activo
        document.querySelectorAll('.theme-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.theme === theme);
        });
    }
}
/*
// ===== INICIALIZACIÓN DE SISTEMAS INTERACTIVOS =====
let cursorParticles, meteoriteSystem, spaceGame, themeManager;

// Inicializar sistemas después de que el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    // Pequeño delay para asegurar que todos los elementos están listos
    setTimeout(() => {
        cursorParticles = new CursorParticles();
        meteoriteSystem = new MeteoriteSystem();
        spaceGame = new SpaceGame();
        themeManager = new ThemeManager();
        
        console.log('🌌 Sistemas interactivos inicializados:');
        console.log('✨ Partículas del cursor activadas');
        console.log('☄️ Sistema de meteoritos iniciado');
        console.log('🚀 Mini-juego espacial listo (presiona G)');
        console.log('🎨 Selector de temas disponible');
    }, 500);
});

// Mensaje de bienvenida con instrucciones
setTimeout(() => {
    if (!localStorage.getItem('welcome-shown')) {
        alert(`🌌 ¡Bienvenido al TechBlog Espacial! ✨

🎮 Presiona 'G' para activar el mini-juego espacial
🎨 Usa el selector de temas en la esquina derecha
✨ Mueve el cursor para crear partículas mágicas
☄️ Observa los meteoritos que cruzan ocasionalmente

¡Disfruta la experiencia intergaláctica!`);
        localStorage.setItem('welcome-shown', 'true');
    }
}, 2000);

*/