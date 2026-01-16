// Simulación de autenticación con JWT
// En producción, esto se conectará con tu backend

// Verificar si el usuario está autenticado
function checkAuth() {
    const token = localStorage.getItem('authToken');
    const currentPage = window.location.pathname.split('/').pop();
    
    // Si no hay token y no estamos en la página de login, redirigir
    if (!token && currentPage !== 'index.html' && currentPage !== '') {
        window.location.href = 'index.html';
        return false;
    }
    
    // Si hay token y estamos en login, redirigir al dashboard
    if (token && (currentPage === 'index.html' || currentPage === '')) {
        window.location.href = 'dashboard.html';
        return true;
    }
    
    // Mostrar nombre del usuario si existe
    const userName = localStorage.getItem('userName');
    const userNameElement = document.getElementById('userName');
    if (userNameElement && userName) {
        userNameElement.textContent = userName;
    }
    
    return !!token;
}

// Función de login
function login(email, password) {
    // DEMO: Credenciales hardcodeadas para pruebas
    // En producción, esto hará una llamada a tu API
    const validUsers = [
        { email: 'admin@life2food.com', password: 'admin123', name: 'Admin 1' },
        { email: 'admin2@life2food.com', password: 'admin123', name: 'Admin 2' },
        { email: 'admin3@life2food.com', password: 'admin123', name: 'Admin 3' }
    ];
    
    const user = validUsers.find(u => u.email === email && u.password === password);
    
    if (user) {
        // Simular JWT token
        const fakeToken = btoa(JSON.stringify({
            email: user.email,
            name: user.name,
            timestamp: Date.now()
        }));
        
        localStorage.setItem('authToken', fakeToken);
        localStorage.setItem('userName', user.name);
        
        return { success: true, message: 'Login exitoso' };
    } else {
        return { success: false, message: 'Credenciales inválidas' };
    }
}

// Función de logout
function logout() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userName');
    window.location.href = 'index.html';
}

// Event listener para el formulario de login
if (document.getElementById('loginForm')) {
    document.getElementById('loginForm').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        
        const result = login(email, password);
        
        if (result.success) {
            window.location.href = 'dashboard.html';
        } else {
            alert(result.message);
        }
    });
}

// Event listener para logout
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
});

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
