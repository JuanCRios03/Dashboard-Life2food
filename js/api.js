// Configuración de la API - Conexión directa a producción
const API_BASE_URL = 'https://api.life2food.com';

console.log('🔗 API URL:', API_BASE_URL);

// Función helper para hacer peticiones a la API
async function apiRequest(endpoint, options = {}) {
    try {
        const url = `${API_BASE_URL}${endpoint}`;
        console.log('🔄 Haciendo petición a:', url);
        
        const defaultHeaders = {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        };
        
        const response = await fetch(url, {
            headers: {
                ...defaultHeaders,
                ...options.headers
            },
            ...options
        });
        
        console.log('✅ Respuesta recibida:', response.status, response.statusText);
        
        if (!response.ok) {
            const errorText = await response.text();
            console.error('❌ Error en respuesta:', errorText);
            throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
        
        const data = await response.json();
        console.log('📦 Datos recibidos:', data);
        return data;
    } catch (error) {
        console.error('❌ Error en la petición API:', error.message);
        console.error('🔗 URL intentada:', `${API_BASE_URL}${endpoint}`);
        throw new Error(`No se pudo conectar a la API: ${error.message}`);
    }
}

// API de Productos
const ProductsAPI = {
    // Obtener todos los productos
    getAll: () => apiRequest('/products'),
    
    // Obtener un producto por ID
    getById: (id) => apiRequest(`/products/${id}`),
    
    // Crear nuevo producto
    create: (data) => apiRequest('/products', {
        method: 'POST',
        body: JSON.stringify(data)
    }),
    
    // Actualizar producto
    update: (id, data) => apiRequest(`/products/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(data)
    }),
    
    // Eliminar producto
    delete: (id) => apiRequest(`/products/${id}`, {
        method: 'DELETE'
    })
};

// API de Usuarios
const UsersAPI = {
    // Obtener todos los usuarios
    getAll: () => apiRequest('/users'),
    
    // Obtener un usuario por ID
    getById: (id) => apiRequest(`/users/${id}`),
    
    // Crear nuevo usuario
    create: (data) => apiRequest('/users', {
        method: 'POST',
        body: JSON.stringify(data)
    }),
    
    // Actualizar usuario
    update: (id, data) => apiRequest(`/users/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(data)
    }),
    
    // Eliminar usuario
    delete: (id) => apiRequest(`/users/${id}`, {
        method: 'DELETE'
    })
};

// API de Carrito (Compras)
const CartAPI = {
    // Obtener carrito de un usuario
    getCart: (userId) => apiRequest(`/cart/${userId}`),
    
    // Agregar item al carrito
    addItem: (userId, data) => apiRequest(`/cart/${userId}/items`, {
        method: 'POST',
        body: JSON.stringify(data)
    }),
    
    // Actualizar item del carrito
    updateItem: (userId, productId, data) => apiRequest(`/cart/${userId}/items/${productId}`, {
        method: 'PUT',
        body: JSON.stringify(data)
    }),
    
    // Eliminar item del carrito
    removeItem: (userId, productId) => apiRequest(`/cart/${userId}/items/${productId}`, {
        method: 'DELETE'
    })
};

// Función helper para mostrar mensajes de error
function showError(message) {
    alert(`Error: ${message}`);
}

// Función helper para mostrar mensajes de éxito
function showSuccess(message) {
    alert(`Éxito: ${message}`);
}
