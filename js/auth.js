// ============================================
// SISTEMA DE AUTENTICACIÓN SEGURO - LIFE2FOOD
// ============================================
// Autenticación con backend real y tokens JWT + Verificación 2FA

// Configuración de seguridad
const AUTH_CONFIG = {
    TOKEN_EXPIRY: 8 * 60 * 60 * 1000, // 8 horas en milisegundos
    REFRESH_INTERVAL: 30 * 60 * 1000, // Renovar cada 30 minutos
    MAX_LOGIN_ATTEMPTS: 3,
    LOCKOUT_TIME: 15 * 60 * 1000, // 15 minutos de bloqueo
    ENABLE_LOCKOUT: false
};

// Variable temporal para almacenar el email durante la verificación
let pendingVerificationEmail = null;

// ============================================
// GESTIÓN DE TOKENS SEGUROS
// ============================================
class TokenManager {
    static setToken(token, userData) {
        const tokenData = {
            token,
            user: userData,
            issuedAt: Date.now(),
            expiresAt: Date.now() + AUTH_CONFIG.TOKEN_EXPIRY
        };
        
        // Almacenar de forma segura
        localStorage.setItem('authToken', token);
        localStorage.setItem('tokenData', JSON.stringify(tokenData));
        localStorage.setItem('userName', userData.name);
        localStorage.setItem('userEmail', userData.email);
        
        // Iniciar renovación automática
        this.scheduleTokenRefresh();
    }
    
    static getToken() {
        const tokenDataStr = localStorage.getItem('tokenData');
        if (!tokenDataStr) return null;
        
        try {
            const tokenData = JSON.parse(tokenDataStr);
            
            // Verificar expiración
            if (Date.now() > tokenData.expiresAt) {
                console.warn('Token expirado');
                this.clearToken();
                return null;
            }
            
            return tokenData.token;
        } catch (error) {
            console.error('Error al leer token:', error);
            this.clearToken();
            return null;
        }
    }
    
    static clearToken() {
        localStorage.removeItem('authToken');
        localStorage.removeItem('tokenData');
        localStorage.removeItem('userName');
        localStorage.removeItem('userEmail');
        localStorage.removeItem('userRole');
    }
    
    static isValid() {
        return this.getToken() !== null;
    }
    
    static scheduleTokenRefresh() {
        // Renovar token automáticamente
        setInterval(() => {
            if (this.isValid()) {
                this.refreshToken();
            }
        }, AUTH_CONFIG.REFRESH_INTERVAL);
    }
    
    static async refreshToken() {
        try {
            const token = this.getToken();
            if (!token) return;
            
            const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                credentials: 'include'
            });
            
            if (response.ok) {
                const data = await response.json();
                this.setToken(data.token, data.user);
                console.log('Token renovado exitosamente');
            }
        } catch (error) {
            console.warn('No se pudo renovar el token:', error.message);
        }
    }
}

// ============================================
// PROTECCIÓN CONTRA ATAQUES DE FUERZA BRUTA
// ============================================
class LoginAttemptManager {
    static getAttempts() {
        const data = localStorage.getItem('loginAttempts');
        if (!data) return { count: 0, lastAttempt: 0 };
        return JSON.parse(data);
    }
    
    static recordAttempt() {
        if (!AUTH_CONFIG.ENABLE_LOCKOUT) return 0;
        const attempts = this.getAttempts();
        attempts.count++;
        attempts.lastAttempt = Date.now();
        localStorage.setItem('loginAttempts', JSON.stringify(attempts));
        return attempts.count;
    }
    
    static resetAttempts() {
        localStorage.removeItem('loginAttempts');
    }
    
    static isLocked() {
        if (!AUTH_CONFIG.ENABLE_LOCKOUT) return { locked: false };
        const attempts = this.getAttempts();
        if (attempts.count >= AUTH_CONFIG.MAX_LOGIN_ATTEMPTS) {
            const timeSinceLastAttempt = Date.now() - attempts.lastAttempt;
            if (timeSinceLastAttempt < AUTH_CONFIG.LOCKOUT_TIME) {
                const remainingTime = Math.ceil((AUTH_CONFIG.LOCKOUT_TIME - timeSinceLastAttempt) / 60000);
                return { locked: true, remainingMinutes: remainingTime };
            } else {
                this.resetAttempts();
                return { locked: false };
            }
        }
        return { locked: false };
    }
}

// Limpiar bloqueos locales mientras está desactivado
LoginAttemptManager.resetAttempts();
localStorage.removeItem('lockoutUntil');

// ============================================
// VERIFICAR AUTENTICACIÓN
// ============================================
function checkAuth() {
    const token = TokenManager.getToken();
    const currentPage = window.location.pathname.split('/').pop();
    
    // Si no hay token y no estamos en la página de login, redirigir
    if (!token && currentPage !== 'index.html' && currentPage !== '') {
        console.warn('No autenticado, redirigiendo al login');
        window.location.href = 'index.html';
        return false;
    }
    
    // Si hay token y estamos en login, redirigir al dashboard
    if (token && (currentPage === 'index.html' || currentPage === '')) {
        window.location.href = 'dashboard.html';
        return true;
    }
    
    // Mostrar información del usuario
    updateUserDisplay();
    
    return !!token;
}

function updateUserDisplay() {
    const userName = localStorage.getItem('userName');
    const userEmail = localStorage.getItem('userEmail');
    
    const userNameElement = document.getElementById('userName');
    if (userNameElement && userName) {
        userNameElement.textContent = userName;
    }
    
    const userEmailElement = document.getElementById('userEmail');
    if (userEmailElement && userEmail) {
        userEmailElement.textContent = userEmail;
    }
}

// ============================================
// CONFIGURACIÓN DE MODO DE DESARROLLO
// ============================================
const DEV_MODE = {
    enabled: false, // Cambiar a false cuando el backend esté listo
    credentials: {
        email: 'noreply@life2food.com',
        password: 'L2f#9Kp$xR7mN@2vQ5wT!8dF&3hB%6jY'
    }
};

// ============================================
// FUNCIÓN DE LOGIN CON BACKEND REAL
// ============================================
async function login(email, password) {
    try {
        // Validación básica
        if (!email || !password) {
            return { success: false, message: 'Por favor ingresa email y contraseña' };
        }
        
        const normalizedEmail = email.toLowerCase().trim();
        
        // ============================================
        // MODO DESARROLLO: Login sin backend
        // ============================================
        if (DEV_MODE.enabled) {
            console.log('Modo desarrollo activo');
            
            // Validar credenciales localmente
            if (email.toLowerCase() === DEV_MODE.credentials.email && 
                password === DEV_MODE.credentials.password) {
                
                // Login exitoso en modo desarrollo
                LoginAttemptManager.resetAttempts();
                
                // Crear token simulado
                const fakeToken = btoa(JSON.stringify({
                    email: email,
                    name: 'Administrador Life2Food',
                    role: 'super_admin',
                    timestamp: Date.now()
                }));
                
                const userData = {
                    email: email,
                    name: 'Administrador Life2Food',
                    role: 'super_admin'
                };
                
                // Guardar token
                TokenManager.setToken(fakeToken, userData);
                
                console.log('Login exitoso (modo desarrollo)');
                return { 
                    success: true, 
                    message: '¡Bienvenido Administrador! (Modo Desarrollo)',
                    user: userData
                };
            } else {
                // Credenciales incorrectas
                let message = 'Credenciales inválidas';
                return { success: false, message };
            }
        }
        
        // ============================================
        // MODO PRODUCCIÓN: Login con backend real (Paso 1: Email y Contraseña)
        // ============================================
        console.log('Intentando login con backend...');
        
        // Llamada al backend real
        const response = await fetch(`${API_BASE_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify({ email, password })
        });
        
        const data = await response.json();
        
        // Verificar si se requiere código de verificación (2FA)
        if (response.ok && data.status === 'verification_required') {
            // Resetear intentos de login fallidos
            LoginAttemptManager.resetAttempts();
            
            // Guardar email temporalmente para la verificación
            pendingVerificationEmail = email;
            
            // Mostrar formulario de verificación
            showVerificationForm(email);
            
            console.log('Código de verificación enviado a:', email);
            return { 
                success: true, 
                requiresVerification: true,
                message: data.message || 'Código enviado a tu correo'
            };
        }
        
        // Si el backend aún retorna token directamente (legacy)
        if (response.ok && data.token) {
            // Login exitoso sin 2FA
            LoginAttemptManager.resetAttempts();
            TokenManager.setToken(data.token, data.user);
            
            console.log('Login exitoso:', data.user.name);
            return { 
                success: true, 
                message: `¡Bienvenido ${data.user.name}!`,
                user: data.user
            };
        } else {
            // Login fallido
            let message = data.message || 'Credenciales inválidas';
            return { success: false, message };
        }
    } catch (error) {
        console.error('Error en login:', error);
        return { 
            success: false, 
            message: 'Error de conexión. Verifica tu conexión a internet.' 
        };
    }
}

// ============================================
// VERIFICACIÓN DE CÓDIGO 2FA
// ============================================
async function verifyCode(email, code) {
    try {
        console.log('Verificando código...');
        
        const response = await fetch(`${API_BASE_URL}/auth/verify-code`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify({ email, code: code.toUpperCase() })
        });
        
        const data = await response.json();
        
        if (response.ok && data.token) {
            // Verificación exitosa
            TokenManager.setToken(data.token, data.user);
            
            // Limpiar email temporal
            pendingVerificationEmail = null;
            
            console.log('Código verificado. Login exitoso:', data.user.name);
            return { 
                success: true, 
                message: `¡Bienvenido ${data.user.name}!`,
                user: data.user
            };
        } else {
            return { 
                success: false, 
                message: data.message || 'Código inválido o expirado' 
            };
        }
    } catch (error) {
        console.error('Error en verificación:', error);
        return { 
            success: false, 
            message: 'Error de conexión. Intenta de nuevo.' 
        };
    }
}

// ============================================
// MOSTRAR/OCULTAR FORMULARIOS
// ============================================
function showVerificationForm(email) {
    // Ocultar formulario de login
    const loginForm = document.getElementById('loginForm');
    const verificationForm = document.getElementById('verificationForm');
    const emailDisplay = document.getElementById('verificationEmail');
    
    if (loginForm) loginForm.style.display = 'none';
    if (verificationForm) verificationForm.style.display = 'block';
    if (emailDisplay) emailDisplay.textContent = email;
    
    // Enfocar campo de código
    const codeInput = document.getElementById('verificationCode');
    if (codeInput) {
        codeInput.value = '';
        codeInput.focus();
    }
}

function showLoginForm() {
    // Ocultar formulario de verificación
    const loginForm = document.getElementById('loginForm');
    const verificationForm = document.getElementById('verificationForm');
    
    if (loginForm) loginForm.style.display = 'block';
    if (verificationForm) verificationForm.style.display = 'none';
    
    // Limpiar email temporal
    pendingVerificationEmail = null;
    
    // Limpiar campos
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const codeInput = document.getElementById('verificationCode');
    
    if (emailInput) emailInput.value = '';
    if (passwordInput) passwordInput.value = '';
    if (codeInput) codeInput.value = '';
}

// ============================================
// FUNCIÓN DE LOGOUT SEGURO
// ============================================
async function logout() {
    try {
        const token = TokenManager.getToken();
        
        // Notificar al backend para invalidar el token
        if (token) {
            await fetch(`${API_BASE_URL}/auth/logout`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                credentials: 'include'
            }).catch(() => {});
        }
    } catch (error) {
        console.warn('Error al cerrar sesión en el servidor:', error);
    } finally {
        // Limpiar datos locales siempre
        TokenManager.clearToken();
        console.log('Sesión cerrada');
        window.location.href = 'index.html';
    }
}

// ============================================
// MOSTRAR MENSAJES AL USUARIO
// ============================================
function showMessage(message, type = 'info') {
    // Buscar contenedor de mensajes o crearlo
    let messageContainer = document.getElementById('messageContainer');
    if (!messageContainer) {
        messageContainer = document.createElement('div');
        messageContainer.id = 'messageContainer';
        messageContainer.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 10000;
            max-width: 400px;
        `;
        document.body.appendChild(messageContainer);
    }
    
    const messageDiv = document.createElement('div');
    messageDiv.className = `alert alert-${type}`;
    messageDiv.style.cssText = `
        padding: 15px 20px;
        margin-bottom: 10px;
        border-radius: 8px;
        background: ${type === 'success' ? '#d4edda' : type === 'error' ? '#f8d7da' : '#d1ecf1'};
        color: ${type === 'success' ? '#155724' : type === 'error' ? '#721c24' : '#0c5460'};
        border: 1px solid ${type === 'success' ? '#c3e6cb' : type === 'error' ? '#f5c6cb' : '#bee5eb'};
        box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        animation: slideIn 0.3s ease-out;
    `;
    messageDiv.textContent = message;
    
    messageContainer.appendChild(messageDiv);
    
    // Remover después de 5 segundos
    setTimeout(() => {
        messageDiv.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => messageDiv.remove(), 300);
    }, 5000);
}

// Agregar animaciones CSS
if (!document.getElementById('authAnimations')) {
    const style = document.createElement('style');
    style.id = 'authAnimations';
    style.textContent = `
        @keyframes slideIn {
            from { transform: translateX(400px); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        @keyframes slideOut {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(400px); opacity: 0; }
        }
    `;
    document.head.appendChild(style);
}

// ============================================
// EVENT LISTENERS
// ============================================

// Formulario de login
if (document.getElementById('loginForm')) {
    const form = document.getElementById('loginForm');
    const submitButton = form.querySelector('button[type="submit"]');
    const originalButtonText = submitButton.textContent;
    
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Deshabilitar botón mientras se procesa
        submitButton.disabled = true;
        submitButton.textContent = 'Autenticando...';
        
        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value;
        
        try {
            const result = await login(email, password);
            
            if (result.success) {
                showMessage(result.message, 'success');
                
                // Si requiere verificación, no redirigir
                if (result.requiresVerification) {
                    submitButton.disabled = false;
                    submitButton.textContent = originalButtonText;
                } else {
                    // Esperar un momento antes de redirigir
                    setTimeout(() => {
                        window.location.href = 'dashboard.html';
                    }, 500);
                }
            } else {
                showMessage(result.message, 'error');
                submitButton.disabled = false;
                submitButton.textContent = originalButtonText;
                // Limpiar contraseña por seguridad
                document.getElementById('password').value = '';
            }
        } catch (error) {
            showMessage('Error inesperado. Intenta de nuevo.', 'error');
            submitButton.disabled = false;
            submitButton.textContent = originalButtonText;
        }
    });
}

// Botón de verificar código
if (document.getElementById('btnVerifyCode')) {
    document.getElementById('btnVerifyCode').addEventListener('click', async function() {
        const codeInput = document.getElementById('verificationCode');
        const code = codeInput.value.trim().toUpperCase();
        
        if (code.length !== 6) {
            showMessage('El código debe tener 6 caracteres', 'error');
            return;
        }
        
        if (!pendingVerificationEmail) {
            showMessage('Error: No hay email pendiente de verificación', 'error');
            showLoginForm();
            return;
        }
        
        this.disabled = true;
        this.textContent = 'Verificando...';
        
        try {
            const result = await verifyCode(pendingVerificationEmail, code);
            
            if (result.success) {
                showMessage(result.message, 'success');
                setTimeout(() => {
                    window.location.href = 'dashboard.html';
                }, 500);
            } else {
                showMessage(result.message, 'error');
                this.disabled = false;
                this.textContent = 'Verificar Código';
                codeInput.value = '';
                codeInput.focus();
            }
        } catch (error) {
            showMessage('Error inesperado. Intenta de nuevo.', 'error');
            this.disabled = false;
            this.textContent = 'Verificar Código';
        }
    });
}

// Botón de volver al login
if (document.getElementById('btnBackToLogin')) {
    document.getElementById('btnBackToLogin').addEventListener('click', function() {
        showLoginForm();
    });
}

// Permitir envío del código con Enter
if (document.getElementById('verificationCode')) {
    document.getElementById('verificationCode').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            document.getElementById('btnVerifyCode').click();
        }
    });
    
    // Convertir a mayúsculas automáticamente
    document.getElementById('verificationCode').addEventListener('input', function(e) {
        this.value = this.value.toUpperCase();
    });
}

// Botón de logout
document.addEventListener('DOMContentLoaded', function() {
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            if (confirm('¿Seguro que deseas cerrar sesión?')) {
                logout();
            }
        });
    }
    
    // Verificar autenticación en cada carga de página
    checkAuth();
    
    // Mostrar información de sesión en consola (solo desarrollo)
    if (TokenManager.isValid()) {
        const userEmail = localStorage.getItem('userEmail');
        console.log('Usuario autenticado:', userEmail);
    }
});

// ============================================
// PROTECCIÓN CONTRA INACTIVIDAD
// ============================================
let inactivityTimer;
const INACTIVITY_TIMEOUT = 60 * 60 * 1000; // 1 hora

function resetInactivityTimer() {
    clearTimeout(inactivityTimer);
    inactivityTimer = setTimeout(() => {
        if (TokenManager.isValid()) {
            showMessage('Sesión cerrada por inactividad', 'info');
            setTimeout(() => logout(), 2000);
        }
    }, INACTIVITY_TIMEOUT);
}

// Detectar actividad del usuario
if (TokenManager.isValid()) {
    ['mousedown', 'keydown', 'scroll', 'touchstart'].forEach(event => {
        document.addEventListener(event, resetInactivityTimer, true);
    });
    resetInactivityTimer();
}

// Función para hacer peticiones autenticadas (para usar en el futuro)
async function authenticatedFetch(url, options = {}) {
    const token = localStorage.getItem('authToken');
    
    if (!token) {
        logout();
        return;
    }
    
    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        ...options.headers
    };
    
    try {
        const response = await fetch(url, { ...options, headers });
        
        // Si el token expiró o es inválido
        if (response.status === 401) {
            logout();
            return;
        }
        
        return response;
    } catch (error) {
        console.error('Error en la petición:', error);
        throw error;
    }
}

// Exportar funciones para uso en otros archivos
window.auth = {
    checkAuth,
    login,
    logout,
    authenticatedFetch
};
