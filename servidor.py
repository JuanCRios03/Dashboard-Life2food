#!/usr/bin/env python3
"""
Servidor HTTP simple para desarrollo local
Sirve archivos estáticos en el puerto 8080 (permitido por CORS)
SIN proxy - Conexión directa a la API
"""
from http.server import HTTPServer, SimpleHTTPRequestHandler
import os

class NoCacheHTTPRequestHandler(SimpleHTTPRequestHandler):
    def end_headers(self):
        # Prevenir cache del navegador
        self.send_header('Cache-Control', 'no-store, no-cache, must-revalidate')
        self.send_header('Expires', '0')
        super().end_headers()

if __name__ == '__main__':
    os.chdir(os.path.dirname(os.path.abspath(__file__)))
    
    print('=' * 60)
    print('  Life2Food - Servidor de Desarrollo')
    print('=' * 60)
    print()
    print('🚀 Servidor iniciado en: http://localhost:8080')
    print('📱 Abrir aplicación: http://localhost:8080/index.html')
    print('🔍 Diagnóstico: http://localhost:8080/diagnostico-api.html')
    print()
    print('✅ Puerto 8080 permitido por CORS del backend')
    print('🔗 API: https://api.life2food.com')
    print()
    print('⚠️  Presiona Ctrl+C para detener el servidor')
    print('=' * 60)
    print()
    
    server = HTTPServer(('', 8080), NoCacheHTTPRequestHandler)
    server.serve_forever()
