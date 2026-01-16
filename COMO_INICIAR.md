# ⚡ Cómo Iniciar - Life2Food Admin

## 🎯 Proceso Correcto

### Paso 1: Ejecuta INICIAR.bat
```
📁 Doble clic en: INICIAR.bat
```

Esto va a:
1. ✅ Iniciar servidor en `http://localhost:8080`
2. ✅ Abrir automáticamente `test-api.html`

### Paso 2: Configura CORS en Backend

**Dile a tu compañero que agregue esto al CORS:**

```java
.allowedOrigins(
    "http://localhost:8080",      // ⭐ AGREGAR ESTA LÍNEA
    "http://localhost:4200",
    "https://api.life2food.com"
)
```

**Ubicación del archivo:**
```
life2food.backend.config.CorsConfig.java
```

### Paso 3: Prueba la Conexión

En el navegador verás: `http://localhost:8080/test-api.html`

Haz clic en: **🔍 Test Conexión**

#### ✅ Si funciona:
- Verás un mensaje verde con los datos
- Puedes ir a `http://localhost:8080/index.html`

#### ❌ Si NO funciona:
- Error de CORS → Falta agregar localhost:8080 al backend
- Error de conexión → Backend no está corriendo
- Failed to fetch → Revisa la consola (F12)

---

## 🚫 Lo que NO debes hacer

❌ **NO abras los archivos directamente** (doble clic en test-api.html)
- Esto abre como `file://` y los navegadores bloquean las peticiones

❌ **NO uses GitHub Pages** (ya no es necesario)
- Conexión directa al backend

❌ **NO uses proxy**
- Ya no se necesita

---

## 🔧 Solución de Problemas

### Error: "Failed to fetch"

**Causa**: El backend no permite tu origen en CORS

**Solución**:
1. Verifica que el backend esté corriendo
2. Pide que agreguen `http://localhost:8080` al CORS
3. Reinicia el backend después de cambiar CORS

### Error: "Origen: file://"

**Causa**: Abriste el HTML directamente

**Solución**: Ejecuta `INICIAR.bat` para usar el servidor HTTP

### El servidor no inicia

**Causa**: Python no está instalado o no está en PATH

**Solución**:
```bash
# Verifica Python:
python --version

# Si no funciona, instala Python 3.x
```

---

## 📋 Resumen

1. **Ejecuta**: `INICIAR.bat`
2. **Pide**: Agregar `http://localhost:8080` al CORS del backend
3. **Prueba**: En `http://localhost:8080/test-api.html`
4. **Usa**: `http://localhost:8080/index.html`

¡Eso es todo! 🚀
