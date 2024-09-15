# Используем базовый образ Node.js версии 16 для сборки React-приложения
FROM node:16 AS build

# Устанавливаем dos2unix для преобразования файлов
RUN apt-get update && apt-get install -y dos2unix

# Создаем рабочую директорию в контейнере
WORKDIR /app

# Копируем файлы проекта
COPY . .

# Преобразуем все файлы в формат LF
RUN find . -type f -print0 | xargs -0 dos2unix

# Устанавливаем зависимости
RUN npm install

# Собираем production версию приложения
RUN npm run build

# Используем Nginx для сервировки статических файлов
FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
