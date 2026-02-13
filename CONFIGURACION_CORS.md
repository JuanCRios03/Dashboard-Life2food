# 🔧 Configuración CORS del Backend

Este documento explica cómo debe estar configurado el backend de Life2Food para que funcione correctamente con este frontend.

## ✅ Configuración Actual

El backend ya tiene la siguiente configuración CORS en:
```
life2food.backend.config.CorsConfig
```

### Código de Configuración

```java
@Configuration
public class CorsConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
                .allowedOrigins(
                    "http://localhost:3000",
                    "http://localhost:4200",
                    "https://api.life2food.com"
                )
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH")
                .allowedHeaders("*")
                .allowCredentials(true)
                .maxAge(3600);
    }
}
```

## 🌐 Dominios Permitidos

**IMPORTANTE**: Debes agregar `http://localhost:3000` a los orígenes permitidos en el backend:

```java
.allowedOrigins(
    "http://localhost:3000",      // ⭐ NECESARIO para desarrollo local
    "http://localhost:4200",
    "https://api.life2food.com"
)
```

### ¿Por qué localhost:3000?

Los navegadores **NO permiten** hacer peticiones AJAX desde archivos locales (`file://`). Por eso necesitas:

1. Ejecutar un servidor HTTP local (puerto 3000)
2. Abrir la app desde `http://localhost:3000`
3. Que el backend permita este origen en CORS

### Si usas otro puerto

Si usas Live Server u otro servidor en diferente puerto, agrégalo también:

```java
.allowedOrigins(
    "http://localhost:3000",
    "http://127.0.0.1:5500",  // Live Server
    "http://localhost:3001",   // Otro servidor
    "https://api.life2food.com"
)
```

## 🔑 Características CORS Habilitadas

- ✅ **Credenciales**: `allowCredentials(true)` - Permite cookies y autenticación
- ✅ **Métodos**: GET, POST, PUT, DELETE, OPTIONS, PATCH
- ✅ **Headers**: `*` (todos los headers permitidos)
- ✅ **Max Age**: 3600 segundos (1 hora de cache)

## 📡 Endpoints Necesarios

El frontend espera estos endpoints en el backend:

### Productos
- `GET /products` - Lista de productos
- `GET /products/{id}` - Detalle de producto
- `POST /products` - Crear producto
- `PATCH /products/{id}` - Actualizar producto
- `DELETE /products/{id}` - Eliminar producto

### Usuarios
- `GET /users` - Lista de usuarios
- `GET /users/{id}` - Detalle de usuario
- `POST /users` - Crear usuario
- `PATCH /users/{id}` - Actualizar usuario
- `DELETE /users/{id}` - Eliminar usuario

### Carrito
- `GET /cart/{userId}` - Carrito del usuario
- `POST /cart/{userId}/items` - Agregar al carrito
- `PUT /cart/{userId}/items/{productId}` - Actualizar cantidad
- `DELETE /cart/{userId}/items/{productId}` - Eliminar del carrito

## 🧪 Probar la Configuración

1. Asegúrate de que el backend esté corriendo en `https://api.life2food.com`
2. Abre `test-api.html` en el navegador
3. Haz clic en los botones de prueba
4. Si ves errores de CORS, verifica que:
   - El backend está en línea
   - La configuración CORS incluye tu dominio
   - El backend está respondiendo correctamente

## ❌ Errores Comunes

### Error: "No 'Access-Control-Allow-Origin' header"

**Causa**: El dominio desde donde estás accediendo no está en `allowedOrigins`

**Solución**: Agrega tu dominio a la lista de `allowedOrigins`

### Error: "Credentials flag is true, but Access-Control-Allow-Credentials is not"

**Causa**: El backend no tiene `allowCredentials(true)`

**Solución**: Verifica que `allowCredentials(true)` esté en la configuración

### Error: "Method X is not allowed by Access-Control-Allow-Methods"

**Causa**: El método HTTP no está permitido

**Solución**: Agrega el método a `allowedMethods`

## 📝 Notas

- El frontend siempre envía `credentials: 'include'` en las peticiones
- No es necesario ningún proxy
- La conexión es directa a `https://api.life2food.com`
- CORS debe estar configurado en el backend, no en el frontend
