#!/bin/bash

# Script para desplegar actualizaciones en el servidor Life2Food
# Autor: Dashboard Life2Food
# Fecha: 2026-02-01

# Colores para output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # Sin color

# Configuración del servidor
SSH_KEY="$HOME/.ssh/life2food.pem"
SERVER_USER="ec2-user"
SERVER_IP="3.149.164.235"
PROJECT_PATH="/var/www/Dashboard-Life2food"

echo -e "${BLUE}================================================${NC}"
echo -e "${BLUE}  Desplegando Dashboard Life2Food${NC}"
echo -e "${BLUE}================================================${NC}"
echo ""

# Verificar que existe la clave SSH
if [ ! -f "$SSH_KEY" ]; then
    echo -e "${RED}Error: No se encuentra la clave SSH en $SSH_KEY${NC}"
    exit 1
fi

# Verificar permisos de la clave SSH
chmod 400 "$SSH_KEY"

echo -e "${GREEN}✓${NC} Conectando al servidor ${SERVER_IP}..."
echo ""

# Conectar al servidor y ejecutar git pull
ssh -i "$SSH_KEY" "${SERVER_USER}@${SERVER_IP}" << 'EOF'
    # Colores para el servidor
    GREEN='\033[0;32m'
    BLUE='\033[0;34m'
    YELLOW='\033[1;33m'
    NC='\033[0m'
    
    echo -e "${BLUE}→${NC} Navegando al directorio del proyecto..."
    cd /var/www/Dashboard-Life2food
    
    echo -e "${BLUE}→${NC} Obteniendo actualizaciones del repositorio..."
    git pull
    
    echo ""
    echo -e "${GREEN}✓${NC} Despliegue completado exitosamente!"
    echo -e "${YELLOW}ℹ${NC}  El sitio está disponible en: https://owners.life2food.com"
EOF

# Verificar el resultado
if [ $? -eq 0 ]; then
    echo ""
    echo -e "${GREEN}================================================${NC}"
    echo -e "${GREEN}  ✓ Despliegue completado con éxito${NC}"
    echo -e "${GREEN}================================================${NC}"
else
    echo ""
    echo -e "${RED}================================================${NC}"
    echo -e "${RED}  ✗ Error durante el despliegue${NC}"
    echo -e "${RED}================================================${NC}"
    exit 1
fi
