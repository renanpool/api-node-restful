FROM node:20

WORKDIR /app

COPY /app/server.js .
COPY /app/index.js .
COPY /app/public/index.html ./public/
COPY /app/public/app.js ./public/
COPY /app/public/style.css ./public/

RUN npm init -y
RUN npm install express dotenv knex pg bcryptjs jsonwebtoken cors --save
RUN npm install apicache
RUN npm install -g nodemon
RUN npm install crypto
RUN npm install uuid


EXPOSE 3000

# Comando para iniciar o aplicativo quando o contêiner for iniciado
CMD ["nodemon", "/app/index.js"]