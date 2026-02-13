// ============================================
// CONFIGURACIÓN DE LA API - LIFE2FOOD
// ============================================
// API productiva (datos reales de la app)
const DATA_API_URL = 'https://api.life2food.com';
// Backend de autenticacion (login + 2FA)
const isBrowser = typeof window !== 'undefined';
const hostname = isBrowser ? window.location.hostname : 'localhost';
const AUTH_API_URL = (typeof window !== 'undefined' && window.AUTH_API_URL)
    ? window.AUTH_API_URL
    : (hostname === 'localhost' || hostname === '127.0.0.1')
        ? 'http://localhost:8080'
        : 'https://owners.life2food.com';

console.log('[API] Datos (Life2Food):', DATA_API_URL);
console.log('[API] Auth (Admin):', AUTH_API_URL);

// ============================================
// FUNCIÓN PRINCIPAL DE PETICIONES
// ============================================
async function apiRequest(endpoint, options = {}, baseUrl = DATA_API_URL) {
    try {
        const url = `${baseUrl}${endpoint}`;
        console.log('Petición:', options.method || 'GET', url);
        const shouldSendCredentials = baseUrl === AUTH_API_URL;
        
        const defaultHeaders = {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        };

        const headers = {
            ...defaultHeaders,
            ...options.headers
        };

        const authToken = getStoredAuthToken();
        if (authToken && baseUrl === AUTH_API_URL) {
            headers['Authorization'] = `Bearer ${authToken}`;
        }
        
        // Configuración de fetch con credentials para CORS
        const response = await fetch(url, {
            credentials: shouldSendCredentials ? 'include' : 'omit',
            headers,
            ...options
        });
        
        console.log('Respuesta:', response.status, response.statusText);
        
        if (!response.ok) {
            const errorText = await response.text();
            console.error('Error del servidor:', errorText);
            throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
        
        const data = await response.json();
        console.log('Datos:', data);
        return data;
    } catch (error) {
        console.error('Error en petición:', error.message);
        console.error('URL:', `${baseUrl}${endpoint}`);
        throw new Error(`No se pudo conectar a la API: ${error.message}`);
    }
}

// ============================================
// API DE PRODUCTOS
// ============================================
const ProductsAPI = {
    getAll: () => apiRequest('/products', {}, DATA_API_URL),
    getById: (id) => apiRequest(`/products/${id}`, {}, DATA_API_URL),
    create: (data) => apiRequest('/products', {
        method: 'POST',
        body: JSON.stringify(data)
    }, DATA_API_URL),
    update: (id, data) => apiRequest(`/products/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(data)
    }, DATA_API_URL),
    delete: (id) => apiRequest(`/products/${id}`, {
        method: 'DELETE'
    }, DATA_API_URL)
};

// ============================================
// API DE USUARIOS
// ============================================
const UsersAPI = {
    getAll: () => apiRequest('/users', {}, DATA_API_URL),
    getById: (id) => apiRequest(`/users/${id}`, {}, DATA_API_URL),
    create: (data) => apiRequest('/users', {
        method: 'POST',
        body: JSON.stringify(data)
    }, DATA_API_URL),
    update: (id, data) => apiRequest(`/users/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(data)
    }, DATA_API_URL),
    delete: (id) => apiRequest(`/users/${id}`, {
        method: 'DELETE'
    }, DATA_API_URL)
};

// ============================================
// API DE CARRITO (COMPRAS)
// ============================================
const CartAPI = {
    getCart: (userId) => apiRequest(`/cart/${userId}`, {}, DATA_API_URL),
    addItem: (userId, data) => apiRequest(`/cart/${userId}/items`, {
        method: 'POST',
        body: JSON.stringify(data)
    }, DATA_API_URL),
    updateItem: (userId, productId, data) => apiRequest(`/cart/${userId}/items/${productId}`, {
        method: 'PUT',
        body: JSON.stringify(data)
    }, DATA_API_URL),
    removeItem: (userId, productId) => apiRequest(`/cart/${userId}/items/${productId}`, {
        method: 'DELETE'
    }, DATA_API_URL)
};

// ============================================
// API DE AUTENTICACIÓN (NUEVO)
// ============================================
const AuthAPI = {
    login: (email, password) => apiRequest('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password })
    }, AUTH_API_URL),
    logout: (token) => apiRequest('/auth/logout', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    }, AUTH_API_URL),
    refresh: (token) => apiRequest('/auth/refresh', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    }, AUTH_API_URL),
    validateToken: (token) => apiRequest('/auth/validate', {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    }, AUTH_API_URL)
};

// ============================================
// FUNCIONES HELPER
// ============================================
function getStoredAuthToken() {
    try {
        if (typeof TokenManager !== 'undefined' && typeof TokenManager.getToken === 'function') {
            return TokenManager.getToken();
        }

        const raw = localStorage.getItem('tokenData');
        if (raw) {
            const parsed = JSON.parse(raw);
            if (!parsed.expiresAt || Date.now() < parsed.expiresAt) {
                return parsed.token;
            }
            localStorage.removeItem('tokenData');
            localStorage.removeItem('authToken');
            return null;
        }

        return localStorage.getItem('authToken');
    } catch (error) {
        console.warn('No se pudo recuperar el token almacenado:', error.message);
        return null;
    }
}

function showError(message) {
    alert(`Error: ${message}`);
}

function showSuccess(message) {
    alert(`${message}`);
}
