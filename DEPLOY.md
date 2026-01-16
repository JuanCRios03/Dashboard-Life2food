# 🚀 Guía de Despliegue - Life2Food Admin

## ⚙️ Configuración

- **API:** Conexión directa a `https://api.life2food.com`
- **Sin proxy:** Configurado para producción
- **Listo para:** GitHub Pages, Netlify, Vercel

---

## ⚠️ IMPORTANTE: Configuración CORS Requerida

**ANTES de desplegar**, tu compañero del backend DEBE agregar tu dominio a CORS.

Actualmente el CORS solo permite:
- `http://localhost:8080`
- `http://localhost:4200`
- `https://api.life2food.com`

**Debe agregar:**
- Tu dominio de GitHub Pages: `https://TU_USUARIO.github.io`

Ver archivo [INSTRUCCIONES_PARA_BACKEND.md](INSTRUCCIONES_PARA_BACKEND.md) para enviar a tu compañero.

---

## 📋 Paso 1: Crear Repositorio en GitHub

1. Ve a https://github.com/new
2. **Nombre:** `life2food-admin`
3. **Descripción:** "Panel administrativo Life2Food"
4. **Público** (para usar GitHub Pages gratis)
5. **NO** marques "Initialize with README"
6. Click **"Create repository"**

---

## 📋 Paso 2: Informar a tu Compañero del Backend

**ANTES de subir el código a GitHub**, envía este mensaje a tu compañero:

> "Hola, voy a desplegar el dashboard admin. Necesito que agregues este dominio al CORS:
> 
> **Dominio a agregar:** `https://TU_USUARIO.github.io`
> (Reemplaza TU_USUARIO con tu usuario real de GitHub)
> 
> En tu archivo `CorsConfig.java`, dentro de `allowedOrigins`, agrega:
> ```java
> "https://TU_USUARIO.github.io"
> ```
> 
> Después reinicia el servidor. Gracias!"

**Ejemplo:** Si tu usuario de GitHub es `juanrios123`, el dominio será: `https://juanrios123.github.io`

---

## 📋 Paso 3: Subir tu Código a GitHub

Abre PowerShell y ejecuta estos comandos:

```powershell
# Ir a la carpeta del proyecto
cd "c:\Users\JUAN  CARLOS RIOS\OneDrive\Data Life2food\life2food-admin"

# Inicializar Git
git init

# Agregar todos los archivos
git add .

# Hacer el primer commit
git commit -m "Initial commit - Panel administrativo Life2Food"

# Cambiar a la rama main
git branch -M main

# Agregar tu repositorio (CAMBIA TU_USUARIO por tu usuario real)
git remote add origin https://github.com/TU_USUARIO/life2food-admin.git

# Subir el código
git push -u origin main
```

---

## 📋 Paso 4: Activar GitHub Pages

1. Ve a tu repositorio en GitHub: `https://github.com/TU_USUARIO/life2food-admin`
2. Click en **Settings** (⚙️ Configuración)
3. En el menú lateral izquierdo, click en **Pages**
4. En **Source**, selecciona **GitHub Actions**
5. Espera 1-2 minutos

Tu sitio estará listo en:
```
https://TU_USUARIO.github.io/life2food-admin/
```

---

## 🧪 Paso 5: Verificar que Funcione

1. Abre tu sitio: `https://TU_USUARIO.github.io/life2food-admin/`
2. Deberías ver la página de login
3. Abre la consola del navegador (F12)
4. Login con: `admin@life2food.com` / `admin123`

**Si funciona:**
✅ Verás el dashboard con los datos reales

**Si ves error CORS:**
❌ Tu compañero aún no agregó el dominio
📧 Recuérdale que agregue: `https://TU_USUARIO.github.io`

---

## 🔄 Actualizar el Sitio (Después del Despliegue)

Cada vez que hagas cambios:

```powershell
cd "c:\Users\JUAN  CARLOS RIOS\OneDrive\Data Life2food\life2food-admin"
git add .
git commit -m "Descripción de los cambios"
git push
```

GitHub Pages se actualizará automáticamente en 1-2 minutos.

---

## 🎯 Resumen Rápido

1. ✅ Crear repositorio en GitHub
2. ✅ **Informar a tu compañero tu dominio:** `https://TU_USUARIO.github.io`
3. ✅ Esperar que tu compañero actualice CORS y reinicie el servidor
4. ✅ Subir código con git
5. ✅ Activar GitHub Pages
6. ✅ Probar que funcione

---

## 🆘 Solución de Problemas

### Error: "has been blocked by CORS policy"

## 🎯 Alternativas a GitHub Pages

### Netlify (Más Fácil)

1. Ve a https://app.netlify.com
2. Click en "Add new site" → "Deploy manually"
3. Arrastra la carpeta completa del proyecto
4. ¡Listo! Te da una URL inmediatamente

### Vercel

1. Ve a https://vercel.com
2. Conecta tu cuenta de GitHub
3. Importa el repositorio `life2food-admin`
4. Click en "Deploy"

## ⚠️ Importante: CORS

Si al desplegar ves errores de CORS, tu compañero necesita configurar el servidor API para permitir peticiones desde tu dominio:

```javascript
// En el servidor API (backend)
Access-Control-Allow-Origin: https://TU_USUARIO.github.io
// O para desarrollo:
Access-Control-Allow-Origin: *
```

## 🔧 Verificar que Todo Funcione

1. Abre tu sitio desplegado
2. Ve a la página de diagnóstico: `/diagnostico-api.html`
3. Click en "Probar Conexión a API"
4. Deberías ver los datos de la API de producción

## 📱 Compartir con tu Equipo

Una vez desplegado, comparte la URL:
- Con tus compañeros administradores
- Para acceder desde cualquier dispositivo
- Para probar desde celulares y tablets

## 🆘 Solución de Problemas

### Error: "Cannot connect to API"
- Verifica que la API esté corriendo en `https://api.life2food.com`
- Verifica configuración CORS en el servidor

### Error: "404 Page not found"
- Asegúrate de tener `index.html` en la raíz del proyecto
- Verifica que GitHub Pages esté activado correctamente

### Error: "Git command not found"
- Instala Git desde https://git-scm.com/download/win
- Reinicia PowerShell después de instalar

## 📞 Contacto

Si tienes problemas, verifica:
1. Que la API de tu compañero esté funcionando
2. Que tengas Git instalado
3. Que tengas una cuenta de GitHub

---

✨ ¡Tu panel administrativo estará en línea y accesible para todos los administradores!
