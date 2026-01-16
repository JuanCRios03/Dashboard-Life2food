# ⚠️ Configuración CORS Necesaria

## El Problema

Tu navegador bloquea las peticiones directas a `https://api.life2food.com` por seguridad (CORS - Cross-Origin Resource Sharing).

**Error típico en consola:**
```
Access to fetch at 'https://api.life2food.com/users' from origin 'http://127.0.0.1:5500' 
has been blocked by CORS policy: No 'Access-Control-Allow-Origin' header is present
```

## Soluciones

### ✅ Solución 1: Usar Proxy Local (DESARROLLO)

**Para trabajar localmente:**

1. Abre una terminal PowerShell
2. Ejecuta el servidor proxy:
   ```powershell
   cd "c:\Users\JUAN  CARLOS RIOS\OneDrive\Data Life2food\life2food-admin"
   python proxy-server.py
   ```
3. Deja la terminal abierta (verás: `🚀 Servidor proxy iniciado en http://localhost:8000`)
4. Abre tu aplicación en el navegador: `http://localhost:8000/index.html`

El proxy redirige las peticiones a la API real evitando problemas de CORS.

---

### ✅ Solución 2: Configurar CORS en el Servidor (PRODUCCIÓN)

**Tu compañero debe agregar estos headers en la API:**

#### Si usa Express.js (Node.js):
```javascript
const cors = require('cors');

// Opción 1: Permitir todos los orígenes (solo desarrollo)
app.use(cors());

// Opción 2: Permitir orígenes específicos (producción)
app.use(cors({
  origin: [
    'http://localhost:8000',
    'http://127.0.0.1:5500',
    'https://TU_USUARIO.github.io'
  ],
  credentials: true
}));
```

#### Si usa Python Flask:
```python
from flask_cors import CORS

app = Flask(__name__)

# Opción 1: Permitir todos
CORS(app)

# Opción 2: Permitir orígenes específicos
CORS(app, origins=[
    "http://localhost:8000",
    "http://127.0.0.1:5500", 
    "https://TU_USUARIO.github.io"
])
```

#### Si usa Python FastAPI:
```python
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:8000",
        "http://127.0.0.1:5500",
        "https://TU_USUARIO.github.io"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

#### Configuración Manual (cualquier servidor):
```
Access-Control-Allow-Origin: https://TU_USUARIO.github.io
Access-Control-Allow-Methods: GET, POST, PUT, PATCH, DELETE, OPTIONS
Access-Control-Allow-Headers: Content-Type, Authorization
Access-Control-Allow-Credentials: true
```

---

## 📝 Pasos Recomendados

### Para Desarrollo Local:
1. ✅ Usar el proxy local (`python proxy-server.py`)
2. ✅ Configuración actual en `api.js`: `http://localhost:8000/api`

### Para Desplegar en GitHub Pages:
1. ❌ **NO funcionará** sin configurar CORS en el servidor
2. ✅ Tu compañero debe agregar tu dominio a la lista permitida
3. ✅ Cambiar `api.js` a: `const API_BASE_URL = 'https://api.life2food.com';`

---

## 🔧 Archivo de Configuración Dual

Puedes crear un archivo `config.js` para cambiar fácilmente:

```javascript
// config.js
const CONFIG = {
    development: {
        API_URL: 'http://localhost:8000/api'
    },
    production: {
        API_URL: 'https://api.life2food.com'
    }
};

// Detectar automáticamente
const IS_PRODUCTION = window.location.hostname !== 'localhost' && 
                      window.location.hostname !== '127.0.0.1';

const API_BASE_URL = IS_PRODUCTION 
    ? CONFIG.production.API_URL 
    : CONFIG.development.API_URL;

console.log('🌍 Modo:', IS_PRODUCTION ? 'PRODUCCIÓN' : 'DESARROLLO');
console.log('🔗 API URL:', API_BASE_URL);
```

---

## 🆘 Verificar CORS

Abre la consola del navegador (F12) y busca:
- ✅ **Sin error CORS**: La API tiene CORS configurado
- ❌ **Error CORS**: Necesitas el proxy local o pedir configuración

---

## 📞 Para tu Compañero

"Hola, necesito que configures CORS en la API para permitir peticiones desde:
- `http://localhost:8000` (desarrollo local)
- `http://127.0.0.1:5500` (Live Server)
- `https://MI_USUARIO.github.io` (producción)

Los headers necesarios son:
- Access-Control-Allow-Origin
- Access-Control-Allow-Methods
- Access-Control-Allow-Headers

Gracias!"
