# 🍔 Life2Food - Panel de Administración

Panel administrativo para gestionar productos, usuarios y compras de Life2Food.

## 📋 Descripción

Este es el frontend del panel administrativo de Life2Food, que se conecta directamente a la API de producción para gestionar:

- 🍕 **Productos**: CRUD completo de productos
- 👥 **Usuarios**: Gestión de usuarios del sistema
- 🛒 **Compras**: Administración de carritos y pedidos
- 📊 **Dashboard**: Estadísticas y métricas del negocio

## 🔗 Configuración de la API

El sistema se conecta directamente a:
```
https://api.life2food.com
```

### CORS Configurado

El backend tiene configuración CORS que permite:
- ✅ Métodos: GET, POST, PUT, DELETE, PATCH, OPTIONS
- ✅ Headers: Todos (*)
- ✅ Credentials: Incluidas
- ✅ Max Age: 3600 segundos

## 🚀 Cómo Usar

### 1️⃣ Probar la Conexión

Abre el archivo de prueba para verificar que todo funciona:

```
test-api.html
```

Este archivo te permite:
- Probar la conexión con la API
- Verificar que CORS está funcionando
- Ver si puedes obtener productos y usuarios

### 2️⃣ Acceder al Dashboard

Una vez confirmado que la API responde, abre:

```
index.html
```

Desde ahí podrás acceder a:
- **Dashboard** - Vista general
- **Productos** - Gestión de productos
- **Usuarios** - Administración de usuarios
- **Compras** - Gestión de pedidos

## 📁 Estructura del Proyecto

```
life2food-admin/
├── index.html              # Página principal (login/inicio)
├── dashboard.html          # Dashboard administrativo
├── productos.html          # Gestión de productos
├── usuarios.html           # Gestión de usuarios
├── compras.html            # Gestión de compras
├── test-api.html          # ⭐ Pruebas de conexión API
│
├── css/
│   └── styles.css          # Estilos globales
│
└── js/
    ├── api.js              # ⭐ Configuración y conexión API
    ├── auth.js             # Autenticación
    ├── dashboard.js        # Lógica del dashboard
    ├── productos.js        # Gestión de productos
    ├── usuarios.js         # Gestión de usuarios
    └── compras.js          # Gestión de compras
```

## 🔧 Configuración Técnica

### API Configuration (js/api.js)

```javascript
const API_BASE_URL = 'https://api.life2food.com';

// Configuración con credentials para CORS
const response = await fetch(url, {
    credentials: 'include',
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
});
```

### Endpoints Disponibles

#### Productos
- `GET /products` - Listar todos los productos
- `GET /products/{id}` - Obtener un producto
- `POST /products` - Crear producto
- `PATCH /products/{id}` - Actualizar producto
- `DELETE /products/{id}` - Eliminar producto

#### Usuarios
- `GET /users` - Listar todos los usuarios
- `GET /users/{id}` - Obtener un usuario
- `POST /users` - Crear usuario
- `PATCH /users/{id}` - Actualizar usuario
- `DELETE /users/{id}` - Eliminar usuario

#### Carrito
- `GET /cart/{userId}` - Obtener carrito
- `POST /cart/{userId}/items` - Agregar item
- `PUT /cart/{userId}/items/{productId}` - Actualizar item
- `DELETE /cart/{userId}/items/{productId}` - Eliminar item

## 🛠️ Solución de Problemas

### Error de CORS

Si ves un error como:
```
Access to fetch at 'https://api.life2food.com/products' from origin '...' 
has been blocked by CORS policy
```

**Solución**: Verifica que el backend tenga la configuración CORS correcta (ver ejemplo en el código).

### Error de Conexión

Si no puedes conectar a la API:

1. ✅ Verifica que el backend esté en línea
2. ✅ Confirma que la URL es `https://api.life2food.com`
3. ✅ Abre `test-api.html` para diagnóstico
4. ✅ Revisa la consola del navegador (F12)

### No se cargan los datos

Si la conexión funciona pero no se muestran datos:

1. ✅ Verifica que hay datos en la base de datos
2. ✅ Revisa la consola para ver qué responde la API
3. ✅ Confirma que los endpoints devuelven el formato esperado

## 📝 Notas Importantes

- ⚠️ **No uses proxy**: La conexión es directa a `https://api.life2food.com`
- ⚠️ **HTTPS requerido**: Asegúrate de usar HTTPS en producción
- ⚠️ **Credentials**: Las peticiones incluyen `credentials: 'include'`
- ⚠️ **Test primero**: Siempre prueba con `test-api.html` antes de usar el panel

## 🎯 Próximos Pasos

1. Abrir `test-api.html` y verificar conexión
2. Si funciona, proceder a `index.html`
3. Implementar autenticación si es necesaria
4. Agregar validaciones de formularios
5. Mejorar el manejo de errores

## 👥 Equipo

Desarrollado para Life2Food

---

**Última actualización**: Enero 2026
