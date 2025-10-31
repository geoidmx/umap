# uMap CoMapper

**Plataforma de mapas colaborativa para gobiernos locales**

> Instancia especializada de uMap para la gestión territorial y participación ciudadana en administraciones municipales

## 🚀 Instalación Rápida

### Requisitos Previos
- Docker y Docker Compose
- PostgreSQL 12+ con PostGIS
- Python 3.8+

### Instalación en 5 minutos

```bash
# 1. Clonar repositorio
git clone https://github.com/geoidmx/umap.git
cd umap

# 2. Configurar entorno
cp .env.example .env
# Editar .env con la configuración del municipio

# 3. Desplegar con Docker
docker-compose up -d

# 4. Cargar datos iniciales
docker-compose exec web python manage.py migrate

# 5. Acceder a la aplicación
# http://localhost:8000