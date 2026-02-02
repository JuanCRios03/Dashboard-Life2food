// ============================================
// CONFIGURACIÓN DE LA API - LIFE2FOOD
// ============================================
// Backend Spring Boot local (puerto 8080)
const LOCAL_API_URL = 'http://localhost:8080';
// API productiva (datos reales de la app)
const REMOTE_API_URL = 'https://api.life2food.com';

// Detectar si estamos ejecutando la UI desde un entorno local
const isBrowser = typeof window !== 'undefined';
const hostname = isBrowser ? window.location.hostname : 'localhost';
const isLocalEnvironment = (
    hostname === 'localhost' ||
    hostname === '127.0.0.1' ||
    hostname === '0.0.0.0' ||
    hostname.endsWith('.local')
);

// Si estamos en localhost usamos el backend local; de lo contrario consumimos la API remota
const API_BASE_URL = isLocalEnvironment ? LOCAL_API_URL : REMOTE_API_URL;

console.log('[API] Entorno detectado:', hostname);
console.log('[API] Base local (Spring Boot):', LOCAL_API_URL);
console.log('[API] Base remota (Life2Food):', REMOTE_API_URL);
console.log('[API] Base activa:', API_BASE_URL);

// ============================================
// FUNCIÓN PRINCIPAL DE PETICIONES
// ============================================
async function apiRequest(endpoint, options = {}, baseUrl = API_BASE_URL) {
    try {
        const url = `${baseUrl}${endpoint}`;
        console.log('Petición:', options.method || 'GET', url);
        const shouldSendCredentials = baseUrl.startsWith('http://localhost') || baseUrl.includes('127.0.0.1');
        
        const defaultHeaders = {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        };

        const headers = {
            ...defaultHeaders,
            ...options.headers
        };

        const authToken = getStoredAuthToken();
        if (authToken && baseUrl === API_BASE_URL) {
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
    getAll: () => apiRequest('/products', {}, REMOTE_API_URL),
    getById: (id) => apiRequest(`/products/${id}`, {}, REMOTE_API_URL),
    create: (data) => apiRequest('/products', {
        method: 'POST',
        body: JSON.stringify(data)
    }, API_BASE_URL),
    update: (id, data) => apiRequest(`/products/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(data)
    }, API_BASE_URL),
    delete: (id) => apiRequest(`/products/${id}`, {
        method: 'DELETE'
    }, API_BASE_URL)
};

// ============================================
// API DE USUARIOS
// ============================================
const UsersAPI = {
    getAll: () => apiRequest('/users', {}, REMOTE_API_URL),
    getById: (id) => apiRequest(`/users/${id}`, {}, REMOTE_API_URL),
    create: (data) => apiRequest('/users', {
        method: 'POST',
        body: JSON.stringify(data)
    }, API_BASE_URL),
    update: (id, data) => apiRequest(`/users/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(data)
    }, API_BASE_URL),
    delete: (id) => apiRequest(`/users/${id}`, {
        method: 'DELETE'
    }, API_BASE_URL)
};

// ============================================
// API DE CARRITO (COMPRAS)
// ============================================
const CartAPI = {
    getCart: (userId) => apiRequest(`/cart/${userId}`, {}, API_BASE_URL),
    addItem: (userId, data) => apiRequest(`/cart/${userId}/items`, {
        method: 'POST',
        body: JSON.stringify(data)
    }, API_BASE_URL),
    updateItem: (userId, productId, data) => apiRequest(`/cart/${userId}/items/${productId}`, {
        method: 'PUT',
        body: JSON.stringify(data)
    }, API_BASE_URL),
    removeItem: (userId, productId) => apiRequest(`/cart/${userId}/items/${productId}`, {
        method: 'DELETE'
    }, API_BASE_URL)
};

// ============================================
// API DE AUTENTICACIÓN (NUEVO)
// ============================================
const AuthAPI = {
    login: (email, password) => apiRequest('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password })
    }, API_BASE_URL),
    logout: (token) => apiRequest('/auth/logout', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    }, API_BASE_URL),
    refresh: (token) => apiRequest('/auth/refresh', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    }, API_BASE_URL),
    validateToken: (token) => apiRequest('/auth/validate', {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    }, API_BASE_URL)
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
