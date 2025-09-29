# 🐳 Docker Deployment Guide

## Million Test Properties - Containerized Deployment

Esta guía te permite ejecutar toda la aplicación Million Test Properties usando Docker y Docker Compose, facilitando la instalación y el trabajo en equipo.

## 📋 Prerrequisitos

- **Docker Desktop** instalado y ejecutándose
  - Windows/Mac: [Docker Desktop](https://www.docker.com/products/docker-desktop/)
  - Linux: [Docker Engine](https://docs.docker.com/engine/install/)
- **Docker Compose** (incluido con Docker Desktop)
- **Git** para clonar el repositorio

## 🚀 Inicio Rápido (Un Solo Comando)

```bash
# Clonar el repositorio
git clone <repository-url>
cd million-test

# Ejecutar toda la aplicación
docker compose up -d
```

¡Eso es todo! La aplicación estará disponible en:
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5001
- **MongoDB**: localhost:27017

## 🏗️ Arquitectura de Contenedores

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Frontend      │    │    Backend       │    │    MongoDB      │
│   (Next.js)     │───▶│   (.NET API)     │───▶│   (Database)    │
│   Port: 3000    │    │   Port: 5000     │    │   Port: 27017   │
└─────────────────┘    └──────────────────┘    └─────────────────┘
                              │
                              ▼
                       ┌──────────────────┐
                       │   Data Seeder    │
                       │   (Run once)     │
                       └──────────────────┘
```

## 📦 Servicios Incluidos

### 🗄️ **MongoDB Database**
- **Imagen**: `mongo:7.0`
- **Puerto**: 27017
- **Credenciales**: admin/million123
- **Volumen persistente**: Los datos se mantienen entre reinicios

### 🔧 **Backend API (.NET)**
- **Puerto**: 5000
- **Health Check**: http://localhost:5001/health
- **Swagger UI**: http://localhost:5001/swagger (en desarrollo)

### 🌐 **Frontend (Next.js)**
- **Puerto**: 3000
- **Optimizado para producción**
- **Health Check**: http://localhost:3000

### 🌱 **Data Seeder**
- **Ejecuta una vez** para poblar la base de datos
- **2,500 propiedades** con datos realistas
- **1,000 owners** con avatares personalizados
- **8,000+ imágenes** de propiedades

## 🛠️ Comandos Útiles

### Ejecutar la aplicación
```bash
# Construir y ejecutar todos los servicios
docker compose up -d

# Ver logs en tiempo real
docker compose logs -f

# Ver logs de un servicio específico
docker compose logs -f frontend
docker compose logs -f backend
docker compose logs -f mongodb
```

### Gestión de servicios
```bash
# Detener todos los servicios
docker compose down

# Detener y eliminar volúmenes (CUIDADO: borra la base de datos)
docker compose down -v

# Reconstruir imágenes
docker compose build

# Reconstruir y ejecutar
docker compose up -d --build
```

### Troubleshooting
```bash
# Ver estado de contenedores
docker compose ps

# Acceder a un contenedor
docker compose exec backend bash
docker compose exec frontend sh
docker compose exec mongodb mongosh

# Ver uso de recursos
docker stats
```

## 🔧 Configuración Avanzada

### Variables de Entorno

Puedes personalizar la configuración creando un archivo `.env`:

```bash
# .env
MONGO_ROOT_PASSWORD=tu_password_seguro
API_PORT=5000
FRONTEND_PORT=3000
MONGO_PORT=27017
```

### Perfiles de Docker Compose

```bash
# Solo base de datos y backend (para desarrollo frontend)
docker compose --profile api up -d

# Solo base de datos (para desarrollo completo local)
docker compose --profile db up -d
```

### Configuración de Red

Todos los servicios están en la red `million-test-network` y pueden comunicarse entre sí usando sus nombres de servicio:

- `mongodb`: Base de datos
- `backend`: API .NET
- `frontend`: Aplicación Next.js

## 📊 Monitoreo y Health Checks

### Status de Servicios
```bash
# Verificar que todos los servicios estén saludables
docker compose ps

# Debería mostrar:
# - mongodb: Up (healthy)
# - backend: Up (healthy) 
# - frontend: Up (healthy)
# - data-seeder: Exit 0
```

### Endpoints de Health Check
- **Backend**: http://localhost:5001/health
- **Frontend**: http://localhost:3000 (responde con la página principal)
- **MongoDB**: Health check interno de Docker

## 🗂️ Estructura de Archivos Docker

```
million-test/
├── docker-compose.yml           # Orquestación principal
├── DOCKER.md                   # Esta documentación
│
├── backend/
│   ├── MillionTestApi/
│   │   ├── Dockerfile          # Backend API
│   │   └── .dockerignore
│   ├── DataSeeder/
│   │   └── Dockerfile          # Seeder de datos
│   └── scripts/
│       └── init-mongo.js       # Inicialización de MongoDB
│
└── frontend/
    ├── Dockerfile              # Frontend Next.js
    └── .dockerignore
```

## 🚨 Solución de Problemas

### Problema: Puerto en uso
```bash
# Error: Port 3000 is already in use
docker compose down
# O cambiar puerto en docker-compose.yml
ports:
  - "3001:3000"  # Usar puerto 3001 externamente
```

### Problema: Base de datos vacía
```bash
# Reiniciar el data seeder
docker compose up data-seeder --force-recreate
```

### Problema: Problemas de construcción
```bash
# Limpiar y reconstruir todo
docker compose down -v
docker system prune -f
docker compose build --no-cache
docker compose up -d
```

### Problema: Permisos en Linux
```bash
# Agregar usuario al grupo docker
sudo usermod -aG docker $USER
# Reiniciar sesión
```

## 🔐 Seguridad

### Para Producción
1. **Cambiar contraseñas por defecto**
2. **Usar HTTPS** con certificados SSL
3. **Configurar firewall** para exponer solo puertos necesarios
4. **Actualizar imágenes** regularmente
5. **Usar secrets** de Docker para credenciales

### Configuración de Producción
```bash
# Crear archivo docker-compose.prod.yml con:
# - Variables de entorno seguras
# - Volúmenes externos
# - Configuración SSL
# - Restricciones de recursos
```

## 📈 Rendimiento

### Recursos Recomendados
- **Desarrollo**: 4GB RAM, 2 CPU cores
- **Producción**: 8GB RAM, 4 CPU cores
- **Almacenamiento**: 20GB para datos y logs

### Optimizaciones
- Los contenedores usan usuarios no-root
- Imágenes optimizadas con multi-stage builds
- Health checks configurados
- Volúmenes persistentes para datos

## 🤝 Contribuir

Para desarrollar con Docker:

1. **Desarrollo local**: Usa solo MongoDB en Docker
   ```bash
   docker compose up mongodb -d
   # Ejecuta frontend y backend localmente
   ```

2. **Testing completo**: Usa toda la stack
   ```bash
   docker compose up -d
   ```

3. **Debugging**: Accede a los contenedores
   ```bash
   docker compose exec backend bash
   ```

---

¡Con Docker, Million Test Properties se ejecuta de manera consistente en cualquier máquina! 🚀