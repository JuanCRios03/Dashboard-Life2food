# 🚀 Guía de Inicio Rápido

## ⚡ Pasos para Empezar

### 1. Iniciar el Servidor Local

⚠️ **IMPORTANTE**: No abras los archivos HTML directamente (doble clic). Los navegadores bloquean peticiones desde `file://`

**Opción A: Usando INICIAR.bat**
```
Doble clic en INICIAR.bat
```

**Opción B: Usando Python**
```bash
python servidor.py
```

**Opción C: Usando comando directo**
```bash
python -m http.server 3000
```

Esto abrirá un servidor en: `http://localhost:3000`

### 2. Configurar CORS en el Backend

El backend **DEBE permitir** `http://localhost:3000`:

```java
.allowedOrigins(
    "http://localhost:3000",  // ⭐ NECESARIO
    "http://localhost:4200",
    "https://api.life2food.com"
)
```

### 3. Probar la Conexión

Ve a: `http://localhost:3000/test-api.html`

Haz clic en los botones para verificar:
- ✅ Conexión con la API
- ✅ Productos se cargan correctamente
- ✅ Usuarios se cargan correctamente

### 4. Si Funciona el Test

¡Perfecto! Ahora ve a:

```
http://localhost:3000/index.html
```

Y empieza a usar el panel administrativo.

### 5. Si NO Funciona el Test

**Error de CORS**: 
- Verifica que el backend tenga la configuración CORS correcta
- Ver archivo `CONFIGURACION_CORS.md` para más detalles

**Error de Conexión**:
- Verifica que el backend esté en línea
- Abre la consola del navegador (F12) para ver el error exacto

**No hay datos**:
- Verifica que la base de datos tenga datos
- Revisa que los endpoints devuelvan el formato correcto

## 📂 Archivos Importantes

- `test-api.html` → Pruebas de conexión
- `js/api.js` → Configuración de la API
- `README.md` → Documentación completa
- `CONFIGURACION_CORS.md` → Ayuda con CORS

## 🔍 Consola del Navegador

Presiona **F12** para abrir la consola y ver:
- 🔄 Peticiones que se están haciendo
- ✅ Respuestas exitosas
- ❌ Errores detallados

## 💡 Tips

1. **Siempre prueba primero** con `test-api.html`
2. **Revisa la consola** si algo no funciona
3. **CORS debe estar en el backend**, no en el frontend
4. **No uses proxy**, la conexión es directa

## 📞 ¿Necesitas Ayuda?

Si algo no funciona:
1. Abre la consola del navegador (F12)
2. Copia el error que aparece
3. Busca en `CONFIGURACION_CORS.md` si es un error de CORS
4. Verifica que el backend esté en línea

---

**¡Listo! Ahora puedes empezar a usar el panel administrativo.**
