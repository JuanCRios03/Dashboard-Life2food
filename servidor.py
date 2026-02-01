#!/usr/bin/env python3
"""
Servidor HTTP simple para Life2Food Admin Panel
Ejecuta este script para servir los archivos HTML en http://localhost:3000
"""
import http.server
import socketserver
import os
import sys

PORT = 3000

class MyHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        # Agregar headers para desarrollo local
        self.send_header('Cache-Control', 'no-store, no-cache, must-revalidate')
        self.send_header('Expires', '0')
        super().end_headers()

    def log_message(self, format, *args):
        # Log más limpio
        sys.stdout.write("%s - %s\n" % (self.address_string(), format % args))

def main():
    # Cambiar al directorio del script
    os.chdir(os.path.dirname(os.path.abspath(__file__)))
    
    with socketserver.TCPServer(("", PORT), MyHTTPRequestHandler) as httpd:
        print("=" * 60)
        print("  🍔 Life2Food - Panel Administrativo")
        print("=" * 60)
        print()
        print(f"✅ Servidor iniciado en: http://localhost:{PORT}")
        print()
        print("📂 Archivos disponibles:")
        print(f"   • http://localhost:{PORT}/test-api.html     (Pruebas)")
        print(f"   • http://localhost:{PORT}/index.html        (Principal)")
        print(f"   • http://localhost:{PORT}/dashboard.html    (Dashboard)")
        print()
        print("🔗 API configurada: http://localhost:8080")
        print()
        print("⚠️  IMPORTANTE:")
        print("   El backend Spring Boot debe estar corriendo en puerto 8080")
        print()
        print("💡 Para detener el servidor: Presiona Ctrl+C")
        print("=" * 60)
        print()
        
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\n\n👋 Servidor detenido")
            sys.exit(0)

if __name__ == "__main__":
    main()
