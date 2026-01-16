// ============================================
// CONFIGURACIÓN DE LA API - LIFE2FOOD
// ============================================
// Conexión directa a la API de producción
// El backend tiene CORS configurado para permitir esta conexión
const API_BASE_URL = 'https://api.life2food.com';

console.log('🔗 API configurada:', API_BASE_URL);

// ============================================
// FUNCIÓN PRINCIPAL DE PETICIONES
// ============================================
async function apiRequest(endpoint, options = {}) {
    try {
        const url = `${API_BASE_URL}${endpoint}`;
        console.log('🔄 Petición:', options.method || 'GET', url);
        
        const defaultHeaders = {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        };
        
        // Configuración de fetch con credentials para CORS
        const response = await fetch(url, {
            credentials: 'include', // Permite cookies y autenticación
            headers: {
                ...defaultHeaders,
                ...options.headers
            },
            ...options
        });
        
        console.log('✅ Respuesta:', response.status, response.statusText);
        
        if (!response.ok) {
            const errorText = await response.text();
            console.error('❌ Error del servidor:', errorText);
            throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
        
        const data = await response.json();
        console.log('📦 Datos:', data);
        return data;
    } catch (error) {
        console.error('❌ Error en petición:', error.message);
        console.error('📍 URL:', `${API_BASE_URL}${endpoint}`);
        throw new Error(`No se pudo conectar a la API: ${error.message}`);
    }
}

// ============================================
// API DE PRODUCTOS
// ============================================
const ProductsAPI = {
    getAll: () => apiRequest('/products'),
    getById: (id) => apiRequest(`/products/${id}`),
    create: (data) => apiRequest('/products', {
        method: 'POST',
        body: JSON.stringify(data)
    }),
    update: (id, data) => apiRequest(`/products/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(data)
    }),
    delete: (id) => apiRequest(`/products/${id}`, {
        method: 'DELETE'
    })
};

// ============================================
// API DE USUARIOS
// ============================================
const UsersAPI = {
    getAll: () => apiRequest('/users'),
    getById: (id) => apiRequest(`/users/${id}`),
    create: (data) => apiRequest('/users', {
        method: 'POST',
        body: JSON.stringify(data)
    }),
    update: (id, data) => apiRequest(`/users/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(data)
    }),
    delete: (id) => apiRequest(`/users/${id}`, {
        method: 'DELETE'
    })
};

// ============================================
// API DE CARRITO (COMPRAS)
// ============================================
const CartAPI = {
    getCart: (userId) => apiRequest(`/cart/${userId}`),
    addItem: (userId, data) => apiRequest(`/cart/${userId}/items`, {
        method: 'POST',
        body: JSON.stringify(data)
    }),
    updateItem: (userId, productId, data) => apiRequest(`/cart/${userId}/items/${productId}`, {
        method: 'PUT',
        body: JSON.stringify(data)
    }),
    removeItem: (userId, productId) => apiRequest(`/cart/${userId}/items/${productId}`, {
        method: 'DELETE'
    })
};

// ============================================
// FUNCIONES HELPER
// ============================================
function showError(message) {
    alert(`❌ Error: ${message}`);
}

function showSuccess(message) {
    alert(`✅ ${message}`);
}
