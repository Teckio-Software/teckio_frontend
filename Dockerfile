
# ====== Build Angular ======
# Angular 16 soporta Node 18; evita problemas usando esta versión
FROM node:18-bullseye AS build
WORKDIR /app

# Instala dependencias con caché eficiente
COPY package*.json ./
RUN npm ci

# Copia el resto del código
COPY . .

# Permite ajustar config/baseHref en tiempo de build (opcional)
ARG NG_CONFIG=development
ARG BASE_HREF=/
RUN npm run build -- --configuration ${NG_CONFIG} --base-href ${BASE_HREF} --source-map=false

# ====== Runtime con NGINX ======
FROM nginx:alpine

# Copia el build. Para Angular 16, suele quedar en /app/dist/<APP>
# Usamos wildcard para no depender del nombre exacto:
COPY --from=build /app/dist/* /usr/share/nginx/html

# (Opcional) Si luego montas un nginx.conf desde docker-compose, no toques nada aquí.
EXPOSE 80

# Healthcheck simple
HEALTHCHECK --interval=30s --timeout=3s --retries=3 CMD wget -qO- http://localhost/ > /dev/null || exit 1
