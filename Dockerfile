# Stage 1: Build
FROM node:20-alpine as build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
# Ensure VITE_SECRET_KEY is available during build if needed, 
# or strictly rely on runtime env if the code supports it.
# However, Vite embeds VITE_ vars at build time. 
# Since we want to inject it at runtime or build time in Coolify, 
# we usually declare ARG.
ARG VITE_SECRET_KEY
ENV VITE_SECRET_KEY=$VITE_SECRET_KEY

RUN npm run build

# Stage 2: Serve
FROM nginx:alpine

COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]