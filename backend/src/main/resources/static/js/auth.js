// ============================================
// LOGIN DESDE CERO - LIFE2FOOD
// ============================================
const AUTH_CONFIG = {
    TOKEN_EXPIRY: 8 * 60 * 60 * 1000
};

let pendingVerificationEmail = null;

const resolveApiBaseUrl = () => {
    if (typeof AUTH_API_URL !== 'undefined' && AUTH_API_URL) return AUTH_API_URL;
    return '';
};

const AUTH_STORAGE_KEYS = {
    token: 'authToken',
    tokenData: 'tokenData',
    userName: 'userName',
    userEmail: 'userEmail',
    userRole: 'userRole'
};

class TokenManager {
    static setToken(token, userData) {
        const tokenData = {
            token,
            user: userData,
            issuedAt: Date.now(),
            expiresAt: Date.now() + AUTH_CONFIG.TOKEN_EXPIRY
        };

        localStorage.setItem(AUTH_STORAGE_KEYS.token, token);
        localStorage.setItem(AUTH_STORAGE_KEYS.tokenData, JSON.stringify(tokenData));
        localStorage.setItem(AUTH_STORAGE_KEYS.userName, userData?.name || 'Administrador');
        localStorage.setItem(AUTH_STORAGE_KEYS.userEmail, userData?.email || '');
        if (userData?.role) {
            localStorage.setItem(AUTH_STORAGE_KEYS.userRole, userData.role);
        }
    }

    static getToken() {
        const tokenDataStr = localStorage.getItem(AUTH_STORAGE_KEYS.tokenData);
        if (!tokenDataStr) return null;

        try {
            const tokenData = JSON.parse(tokenDataStr);
            if (Date.now() > tokenData.expiresAt) {
                this.clearToken();
                return null;
            }
            return tokenData.token;
        } catch (error) {
            console.warn('No se pudo leer el token:', error.message);
            this.clearToken();
            return null;
        }
    }

    static clearToken() {
        localStorage.removeItem(AUTH_STORAGE_KEYS.token);
        localStorage.removeItem(AUTH_STORAGE_KEYS.tokenData);
        localStorage.removeItem(AUTH_STORAGE_KEYS.userName);
        localStorage.removeItem(AUTH_STORAGE_KEYS.userEmail);
        localStorage.removeItem(AUTH_STORAGE_KEYS.userRole);
    }

    static isValid() {
        return this.getToken() !== null;
    }
}

function updateUserDisplay() {
    const userName = localStorage.getItem(AUTH_STORAGE_KEYS.userName);
    const userEmail = localStorage.getItem(AUTH_STORAGE_KEYS.userEmail);

    const userNameElement = document.getElementById('userName');
    if (userNameElement && userName) {
        userNameElement.textContent = userName;
    }

    const userEmailElement = document.getElementById('userEmail');
    if (userEmailElement && userEmail) {
        userEmailElement.textContent = userEmail;
    }
}

function checkAuth() {
    const token = TokenManager.getToken();
    const currentPage = window.location.pathname.split('/').pop();

    if (!token && currentPage !== 'index.html' && currentPage !== '') {
        window.location.href = 'index.html';
        return false;
    }

    if (token && (currentPage === 'index.html' || currentPage === '')) {
        window.location.href = 'dashboard.html';
        return true;
    }

    updateUserDisplay();
    return !!token;
}

async function login(email, password) {
    try {
        if (!email || !password) {
            return { success: false, message: 'Ingresa correo y contrasena.' };
        }

        const apiBase = resolveApiBaseUrl();
        if (!apiBase) {
            return { success: false, message: 'No hay API configurada.' };
        }

        const response = await fetch(`${apiBase}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (response.ok && (data.status === 'verification_required' || data.requiresVerification)) {
            pendingVerificationEmail = email;
            showVerificationForm(email);
            return {
                success: true,
                requiresVerification: true,
                message: data.message || 'Codigo enviado a tu correo.'
            };
        }

        if (response.ok && data.token) {
            TokenManager.setToken(data.token, data.user);
            return {
                success: true,
                message: data.message || `Bienvenido ${data.user?.name || ''}`.trim(),
                user: data.user
            };
        }

        return { success: false, message: data.message || 'Credenciales invalidas.' };
    } catch (error) {
        console.error('Error en login:', error);
        return { success: false, message: 'Error de conexion.' };
    }
}

// ============================================
// VERIFICACIÓN DE CÓDIGO 2FA
// ============================================
async function verifyCode(email, code) {
    try {
        const apiBase = resolveApiBaseUrl();
        if (!apiBase) {
            return { success: false, message: 'No hay API configurada.' };
        }

        const response = await fetch(`${apiBase}/auth/verify-code`, {
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
            TokenManager.setToken(data.token, data.user);
            pendingVerificationEmail = null;
            return {
                success: true,
                message: data.message || `Bienvenido ${data.user?.name || ''}`.trim(),
                user: data.user
            };
        }

        return { success: false, message: data.message || 'Codigo invalido o expirado.' };
    } catch (error) {
        console.error('Error en verificacion:', error);
        return { success: false, message: 'Error de conexion.' };
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
        const apiBase = resolveApiBaseUrl();

        if (token && apiBase) {
            await fetch(`${apiBase}/auth/logout`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                credentials: 'include'
            }).catch(() => {});
        }
    } catch (error) {
        console.warn('Error al cerrar sesion:', error.message);
    } finally {
        TokenManager.clearToken();
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
    const token = TokenManager.getToken();
    
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
