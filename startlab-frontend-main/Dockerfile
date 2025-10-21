# ---------- Build stage ----------
FROM node:20-alpine AS builder
WORKDIR /app

# Ускоряем npm и отключаем лишнее
ENV NPM_CONFIG_FUND=false \
    NPM_CONFIG_AUDIT=false

# 1) Ставим зависимости (включая dev)
COPY package.json package-lock.json* ./
RUN if [ -f package-lock.json ]; then \
      npm ci --include=dev; \
    else \
      npm i; \
    fi

# 2) Копируем исходники и конфиги
#    (убедитесь, что .dockerignore исключает node_modules и dist)
COPY . .

# 3) Сборка
RUN npm run build

# ---------- Runtime stage ----------
FROM node:20-alpine AS runner
WORKDIR /app

# Лёгкий сервер для статики
RUN npm i -g serve

# Копируем собранную статику
COPY --from=builder /app/dist ./dist

ENV NODE_ENV=production
ENV PORT=8081
EXPOSE 8081

# Запускаем под непривилегированным пользователем
USER node

# Раздача /dist
CMD ["serve", "-s", "dist", "-l", "8081"]
