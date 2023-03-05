FROM node:latest

# Папка приложения
# ARG APP_DIR=app
# RUN mkdir -p ${APP_DIR}
WORKDIR /.

# Установка зависимостей
COPY package*.json ./
RUN npm install
# Для использования в продакшне
# RUN npm install --production

# Копирование файлов проекта
COPY . .

# Уведомление о порте, который будет прослушивать работающее приложение
EXPOSE 3000

# Запуск проекта
RUN npm run test:build

CMD ["npm", "start"]