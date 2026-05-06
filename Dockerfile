# Multi-stage build für Next.js static export
FROM node:22-alpine AS builder

# Build arguments für Supabase
ARG NEXT_PUBLIC_SUPABASE_URL
ARG NEXT_PUBLIC_SUPABASE_ANON_KEY

WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .

# Build mit Env-Variablen
ENV NEXT_PUBLIC_SUPABASE_URL=${NEXT_PUBLIC_SUPABASE_URL}
ENV NEXT_PUBLIC_SUPABASE_ANON_KEY=${NEXT_PUBLIC_SUPABASE_ANON_KEY}
RUN npm run build

# Debug: Static export liegt in out/
RUN echo "=== OUT CONTENTS ===" && ls -la out/ && echo "=== HTML ===" && find out/ -name "*.html" | wc -l

# Production nginx server
FROM nginx:alpine
COPY --from=builder /app/out /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
