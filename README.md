# Life2Food - Panel Administrativo

Panel de administración web para Life2Food, diseñado para gestionar usuarios, compras y productos de la aplicación móvil.

## 🌐 Demo en Vivo

Una vez desplegado en GitHub Pages, tu aplicación estará disponible en:
`https://TU_USUARIO.github.io/life2food-admin/`

## 🚀 Características

- **Dashboard Interactivo**: Visualiza estadísticas clave en tiempo real
- **Gestión de Usuarios**: Ve y administra todos los usuarios registrados
- **Historial de Compras**: Monitorea todas las transacciones y ventas
- **Catálogo de Productos**: Visualiza y analiza el inventario y productos más vendidos
- **Seguridad**: Sistema de autenticación preparado para JWT
- **Responsive**: Diseño adaptable a diferentes dispositivos
- **Conectado a API en Producción**: `https://api.life2food.com`

## 📋 Credenciales de Prueba

Para probar el sistema, puedes usar estas credenciales (DEMO):

- **Admin 1**: `admin@life2food.com` / `admin123`
- **Admin 2**: `admin2@life2food.com` / `admin123`
- **Admin 3**: `admin3@life2food.com` / `admin123`

⚠️ **IMPORTANTE**: Estas son credenciales de prueba. Cambiarlas cuando se conecte con el backend real.

## � Despliegue a GitHub Pages

**Sigue la guía completa en:** [DEPLOY.md](DEPLOY.md)

**Resumen rápido:**
1. Crea repositorio en GitHub
2. Informa a tu compañero tu dominio de GitHub Pages
3. Espera que actualice CORS
4. Sube el código con Git
5. Activa GitHub Pages

**Mensaje para tu compañero:** Ver [MENSAJE_PARA_BACKEND.md](MENSAJE_PARA_BACKEND.md)

---

## �🛠️ Tecnologías

- HTML5
- CSS3 (Diseño moderno con variables CSS)
- JavaScript Vanilla (ES6+)
- Sistema preparado para JWT Authentication

## 📁 Estructura del Proyecto

```
life2food-admin/
│
├── index.html              # Página de login
├── dashboard.html          # Dashboard principal
├── usuarios.html           # Gestión de usuarios
├── compras.html           # Historial de compras
├── productos.html         # Catálogo de productos
│
├── css/
│   └── styles.css         # Estilos globales
│
└── js/
    ├── auth.js            # Autenticación y JWT
    ├── dashboard.js       # Lógica del dashboard
    ├── usuarios.js        # Lógica de usuarios
    ├── compras.js         # Lógica de compras
    └── productos.js       # Lógica de productos
```

## � Despliegue a GitHub Pages

### Opción 1: Subir a GitHub y Desplegar Automáticamente

1. **Crear repositorio en GitHub:**
   - Ve a https://github.com/new
   - Nombra tu repositorio `life2food-admin`
   - No inicialices con README (ya tienes uno)

2. **Subir tu código:**
   ```bash
   cd "c:\Users\JUAN  CARLOS RIOS\OneDrive\Data Life2food\life2food-admin"
   git init
   git add .
   git commit -m "Initial commit - Panel administrativo Life2Food"
   git branch -M main
   git remote add origin https://github.com/TU_USUARIO/life2food-admin.git
   git push -u origin main
   ```

3. **Activar GitHub Pages:**
   - Ve a tu repositorio en GitHub
   - Settings → Pages
   - Source: GitHub Actions
   - El despliegue será automático con cada push

### Opción 2: Desplegar en Netlify/Vercel

**Netlify:**
1. Ve a https://app.netlify.com
2. Arrastra la carpeta del proyecto
3. Tu sitio estará listo en segundos

**Vercel:**
1. Ve a https://vercel.com
2. Importa tu repositorio de GitHub
3. Deploy automático

## 🔄 Actualizar el Despliegue

Cada vez que hagas cambios:
```bash
git add .
git commit -m "Descripción de cambios"
git push
```

GitHub Pages se actualizará automáticamente.

## 🌐 URL de Acceso

Después del despliegue, tu panel estará disponible en:
- **GitHub Pages**: `https://TU_USUARIO.github.io/life2food-admin/`
- **Netlify**: `https://TU_SITIO.netlify.app`
- **Vercel**: `https://TU_SITIO.vercel.app`

## �🚦 Cómo Usar

1. **Abrir el proyecto**: Simplemente abre `index.html` en tu navegador web
2. **Login**: Usa las credenciales de prueba mencionadas arriba
3. **Navegar**: Usa el menú lateral para acceder a las diferentes secciones

## 🔐 Seguridad

El sistema está preparado para implementar JWT (JSON Web Tokens) tanto en el frontend como en el backend:

- **Frontend**: El archivo `auth.js` tiene toda la estructura para manejar tokens JWT
- **LocalStorage**: Los tokens se almacenan de forma segura
- **Verificación de Sesión**: Cada página verifica la autenticación
- **Logout Seguro**: Limpia completamente la sesión

## 🔄 Siguiente Pasos (Backend)

Cuando tengas el backend listo, necesitarás:

1. **Actualizar las URLs de API**: Modificar las funciones en los archivos JS para apuntar a tu backend
2. **Implementar JWT real**: Conectar con tu sistema de autenticación
3. **Conectar con Firebase/Base de Datos**: Reemplazar los datos de prueba con datos reales
4. **CORS**: Configurar CORS en tu backend para permitir peticiones desde el frontend
5. **Variables de Entorno**: Crear un archivo de configuración para las URLs del API

### Ejemplo de integración con API:

```javascript
// En auth.js
async function login(email, password) {
    const response = await fetch('https://tu-api.com/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
    });
    
    const data = await response.json();
    
    if (data.token) {
        localStorage.setItem('authToken', data.token);
        localStorage.setItem('userName', data.user.name);
        return { success: true };
    }
    
    return { success: false, message: data.error };
}
```

## 📊 Funcionalidades Preparadas para Backend

Todas las páginas tienen funciones preparadas que solo necesitan conectarse con tu API:

- `authenticatedFetch()`: Para hacer peticiones autenticadas
- Filtros y búsquedas listas para recibir datos
- Paginación preparada
- Exportación a CSV (estructura lista)
- Actualización en tiempo real (intervalos configurados)

## 🎨 Personalización

Puedes personalizar fácilmente los colores editando las variables CSS en `styles.css`:

```css
:root {
    --primary-color: #FF6B35;      /* Color principal */
    --secondary-color: #F7931E;    /* Color secundario */
    --dark-bg: #1a1a2e;           /* Fondo oscuro */
    --light-bg: #16213e;          /* Fondo claro */
    /* ... más variables ... */
}
```

## 📝 Notas Importantes

- Los datos mostrados son **datos de prueba/DEMO**
- El sistema de autenticación es **simulado** hasta que conectes el backend
- Las gráficas necesitarán una librería como **Chart.js** para visualizaciones reales
- Recuerda implementar validaciones y sanitización en el backend

## 👥 Acceso Restringido

Este panel está diseñado para **solo 3 administradores**. Cuando conectes el backend, asegúrate de:

1. Limitar las cuentas de administrador a 3 usuarios
2. Implementar roles y permisos
3. Registrar todas las acciones en logs de auditoría
4. Usar HTTPS en producción
5. Implementar rate limiting para prevenir ataques

## 🛡️ Recomendaciones de Seguridad

1. **Nunca** expongas las credenciales en el código en producción
2. Usa **variables de entorno** para configuraciones sensibles
3. Implementa **autenticación de dos factores (2FA)** para mayor seguridad
4. Configura **tokens de expiración** apropiados
5. Usa **HTTPS** siempre en producción
6. Implementa **logging** de todas las acciones administrativas

## 📱 Responsive Design

El panel es completamente responsive y se adapta a:
- 💻 Desktop (1920px+)
- 💻 Laptop (1024px+)
- 📱 Tablet (768px+)
- 📱 Mobile (320px+)

---

**Desarrollado para Life2Food** 🍔🍕
*Panel de Administración v1.0*
