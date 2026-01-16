# 📧 Mensaje para Enviar a tu Compañero del Backend

Copia y pega este mensaje a tu compañero:

---

Hola,

Voy a desplegar el **dashboard administrativo de Life2Food** en GitHub Pages.

**Necesito que agregues este dominio al CORS del backend:**

```
https://MI_USUARIO.github.io
```

*(Reemplaza `MI_USUARIO` con mi usuario real de GitHub cuando lo cree)*

---

### 📝 Cambio en CorsConfig.java

En el archivo: `src/main/java/life2food/backend/config/CorsConfig.java`

**Cambia esto:**
```java
.allowedOrigins(
    "http://localhost:8080",
    "http://localhost:4200",
    "https://api.life2food.com"
)
```

**Por esto:**
```java
.allowedOrigins(
    "http://localhost:8080",
    "http://localhost:4200",
    "https://api.life2food.com",
    "https://MI_USUARIO.github.io"  // ← AGREGAR ESTA LÍNEA
)
```

---

### 🔄 Después del cambio:

1. Guarda el archivo
2. Reinicia el servidor Spring Boot:
   ```bash
   mvn clean spring-boot:run
   ```

---

### ✅ Confirmación

Cuando lo hayas actualizado, avísame para verificar que funcione.

Gracias!

---

## 📌 Nota Adicional

Si prefieres algo más flexible durante el desarrollo, puedes usar temporalmente:

```java
.allowedOriginPatterns("*")  // Permite todos los orígenes
```

Pero para producción es mejor especificar los dominios exactos como te indiqué arriba.
