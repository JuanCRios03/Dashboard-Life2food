# 🔐 Sistema de Seguridad - Life2Food Admin Panel

## Resumen del Sistema Implementado

Se ha implementado un **sistema de autenticación robusto y seguro** para proteger el acceso al panel administrativo de Life2Food.

---

## 🛡️ Características de Seguridad

### 1. **Autenticación con Backend**
- ✅ Conexión directa a `https://api.life2food.com/auth/login`
- ✅ Tokens JWT seguros con expiración automática
- ✅ Renovación automática de tokens cada 30 minutos
- ✅ Validación del token en cada petición

### 2. **Control de Acceso Restringido**
- ✅ **SOLO** el email `noreply@life2food.com` puede acceder
- ✅ Validación exacta del email (case-insensitive)
- ✅ Contraseña de 32 caracteres con nivel extremo de seguridad
- ✅ Cualquier otro email es rechazado automáticamente

### 3. **Protección contra Ataques**
- ✅ **Anti Fuerza Bruta**: Máximo 3 intentos de login fallidos
- ✅ **Bloqueo Temporal**: 15 minutos después de 3 intentos fallidos
- ✅ **Contador de Intentos**: Muestra intentos restantes
- ✅ **Sesión de Inactividad**: Cierre automático después de 1 hora sin actividad

### 4. **Gestión de Sesiones**
- ✅ Tokens con duración de 8 horas
- ✅ Renovación automática cada 30 minutos
- ✅ Logout seguro que invalida el token en el servidor
- ✅ Verificación de autenticación en cada página

### 5. **Experiencia de Usuario Mejorada**
- ✅ Mensajes de error claros y específicos
- ✅ Notificaciones visuales de estado
- ✅ Indicador de carga durante autenticación
- ✅ Limpieza automática de contraseñas después de error

---

## 👥 Usuarios Autorizados

**SOLO 1 USUARIO AUTORIZADO** - Máxima Seguridad

### Usuario Único:
```
Email: noreply@life2food.com
Nombre: Administrador Life2Food
Rol: super_admin
```

⚠️ **IMPORTANTE**: 
- Solo este email específico puede acceder al sistema
- Cualquier otro email será rechazado inmediatamente
- La contraseña está en el archivo `CREDENCIALES_SEGURAS.txt`
- Después de guardarla, ELIMINA ese archivo

### Configuración en Backend:
```json
{
  "email": "noreply@life2food.com",
  "password": "[HASH de la contraseña - Ver CREDENCIALES_SEGURAS.txt]",
  "name": "Administrador Life2Food",
  "role": "super_admin"
}
```

**⚠️ NUNCA guardes la contraseña en texto plano en el backend**
Usa bcrypt, argon2, o scrypt para hashear la contraseña.

---

## 🔑 Flujo de Autenticación

### 1. **Login**
```javascript
Usuario ingresa email y password
    ↓
Validación: ¿Email termina en @life2food.com?
    ↓ SÍ
Envío de credenciales a: POST /auth/login
    ↓
Backend valida credenciales
    ↓
Backend retorna: { token: "JWT_TOKEN", user: {...} }
    ↓
Token se guarda en localStorage con expiración
    ↓
Usuario redirigido al dashboard
```

### 2. **Verificación en Cada Página**
```javascript
Usuario accede a una página
    ↓
checkAuth() verifica token
    ↓
¿Token existe y es válido?
    ↓ NO
Redirigir a login
    ↓ SÍ
Permitir acceso
```

### 3. **Renovación Automática**
```javascript
Cada 30 minutos:
    ↓
POST /auth/refresh con token actual
    ↓
Backend retorna nuevo token
    ↓
Token actualizado en localStorage
```

### 4. **Logout Seguro**
```javascript
Usuario cierra sesión
    ↓
POST /auth/logout con token
    ↓
Backend invalida el token
    ↓
localStorage limpiado
    ↓
Redirigir a login
```

---

## 🚨 Protecciones Implementadas

### Anti Fuerza Bruta
```javascript
Intento 1 fallido → "Te quedan 2 intentos"
Intento 2 fallido → "Te quedan 1 intento"
Intento 3 fallido → "Cuenta bloqueada 15 minutos"
```

### Validación de Dominio
```javascript
email = "juan@gmail.com" → ❌ Rechazado
email = "admin@life2food.com" → ❌ Rechazado
email = "noreply@life2food.com" → ✅ ÚNICO PERMITIDO
```

### Expiración de Sesión
```javascript
Login → Token válido por 8 horas
Sin actividad 1 hora → Logout automático
Cada 30 min → Renovación automática
```

---

## 📧 Configuración del Backend (API)

### Endpoints Requeridos

#### 1. Login
```http
POST /auth/login
Content-Type: application/json

{
  "email": "admin@life2food.com",
  "password": "contraseña"
}

Response 200:
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "123",
    "name": "Administrador",
    "email": "admin@life2food.com",
    "role": "admin"
  }
}
```

#### 2. Logout
```http
POST /auth/logout
Authorization: Bearer {token}

Response 200:
{
  "message": "Logout exitoso"
}
```

#### 3. Refresh Token
```http
POST /auth/refresh
Authorization: Bearer {token}

Response 200:
{
  "token": "nuevo_token_jwt",
  "user": {...}
}
```

#### 4. Validate Token
```http
GET /auth/validate
Authorization: Bearer {token}

Response 200:
{
  "valid": true,
  "user": {...}
}
```

---

## 🔒 Configuración CORS en Backend

El backend debe permitir las siguientes URLs:

```javascript
// Configuración CORS recomendada
const corsOptions = {
  origin: [
    'http://localhost:3000',
    'https://admin.life2food.com'  // Producción
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
};
```

---

## 💡 Próximos Pasos

### Para Activar el Sistema:

1. **Configurar usuario en el backend**
   - Crear el usuario `noreply@life2food.com`
   - Usar la contraseña del archivo `CREDENCIALES_SEGURAS.txt`
   - Hashear la contraseña con bcrypt (saltRounds: 12)

2. **Implementar endpoints de autenticación**
   - `/auth/login`
   - `/auth/logout`
   - `/auth/refresh`
   - `/auth/validate`

3. **Configurar CORS**
  - Permitir `http://localhost:3000` para desarrollo
   - Permitir dominio de producción cuando esté listo

4. **Probar el sistema**
   - Intentar login con usuario válido
   - Verificar protección contra intentos fallidos
   - Validar expiración de token
   - Probar logout

---

## 🔮 Mejoras Futuras Planificadas

### 1. **Autenticación de Dos Pasos (2FA) por Email** 🎯 PRÓXIMAMENTE

**Flujo propuesto:**
```
Usuario ingresa email y contraseña
  ↓
Credenciales válidas → Generar código de 6 dígitos
  ↓
Enviar código a noreply@life2food.com
  ↓
Usuario ingresa código recibido
  ↓
¿Código válido? → SÍ → Acceso concedido
  ↓ NO
Solicitar código nuevamente
```

**Características:**
- ✅ Código de 6 dígitos aleatorio
- ✅ Válido por 5 minutos
- ✅ Un solo uso
- ✅ Envío desde `noreply@life2food.com`
- ✅ Máximo 3 intentos de verificación

**Endpoint necesario:**
```
POST /auth/send-verification-code
POST /auth/verify-code
```

### 2. **Gestión de Usuarios Adicionales**

Una vez probado el sistema, podrás:
- Agregar más usuarios desde el dashboard
- Cada usuario recibirá código de verificación por email
- Sistema de roles (admin, supervisor, visor)
- Aprobación de nuevos usuarios por administrador
   - `/auth/refresh`
   - `/auth/validate`

3. **Configurar CORS**
  - Permitir `http://localhost:3000` para desarrollo
   - Permitir dominio de producción cuando esté listo

4. **Probar el sistema**
   - Intentar login con usuario válido
   - Verificar protección contra intentos fallidos
   - Validar expiración de token
   - Probar logout

---

## 📞 Soporte

Si necesitas ayuda con:
- Configuración del backend
- Creación de usuarios
- Problemas de autenticación
- Ajustes de seguridad

Contáctame con los detalles específicos.

---

## ⚠️ Importante

- **Nunca compartas las contraseñas** de los usuarios autorizados
- **Usa contraseñas fuertes** (mínimo 12 caracteres, mayúsculas, minúsculas, números y símbolos)
- **Cambia las contraseñas regularmente** (cada 3 meses recomendado)
- **Habilita 2FA** si es posible en el futuro
- **Monitorea los logs de acceso** en el backend

---

**Sistema implementado el 30 de enero de 2026**  
**Versión**: 1.0.0  
**Estado**: ✅ Listo para producción (pendiente configuración backend)
