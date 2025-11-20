// Script de depuración para probar los artículos
console.log('🔧 Iniciando script de depuración...');

// Datos de prueba
const testArticles = [
    {
        id: 1,
        title: "Artículo de prueba 1",
        category: "programacion",
        excerpt: "Este es un artículo de prueba para verificar que el sistema funciona correctamente.",
        author: "Test Author",
        date: "2025-11-20",
        readTime: "5 min",
        views: 100,
        likes: 10,
        image: "",
        tags: ["test", "debug"]
    },
    {
        id: 2,
        title: "Artículo de prueba 2", 
        category: "web",
        excerpt: "Segundo artículo de prueba para el sistema de renderizado.",
        author: "Test Author",
        date: "2025-11-20",
        readTime: "3 min",
        views: 75,
        likes: 5,
        image: "",
        tags: ["test", "debug", "web"]
    }
];

// Función para inyectar artículos de prueba
function injectTestArticles() {
    console.log('💉 Inyectando artículos de prueba...');
    
    const container = document.getElementById('articlesContainer');
    if (!container) {
        console.error('❌ No se encontró el contenedor articlesContainer');
        return;
    }
    
    console.log('✅ Contenedor encontrado:', container);
    
    // Limpiar contenedor
    container.innerHTML = '';
    
    // Crear y añadir artículos de prueba
    testArticles.forEach((article, index) => {
        console.log(`🔧 Creando artículo ${index + 1}:`, article.title);
        
        const card = document.createElement('div');
        card.className = 'article-card';
        card.style.border = '2px solid red'; // Para visualización
        card.innerHTML = `
            <div class="article-content" style="padding: 1rem;">
                <h3>${article.title}</h3>
                <p>${article.excerpt}</p>
                <div class="article-footer">
                    <span>Categoría: ${article.category}</span>
                    <span>Fecha: ${article.date}</span>
                </div>
            </div>
        `;
        
        container.appendChild(card);
        console.log(`✅ Artículo ${index + 1} añadido al DOM`);
    });
    
    console.log('🎉 Artículos de prueba inyectados exitosamente');
}

// Esperar a que el DOM esté listo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', injectTestArticles);
} else {
    injectTestArticles();
}

// También hacer disponible la función globalmente
window.injectTestArticles = injectTestArticles;