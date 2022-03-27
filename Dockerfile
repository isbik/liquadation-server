FROM node:16.8-alpine3.11 as builder

WORKDIR /app

COPY package*.json ./

RUN npm i

COPY . . 



RUN npm run build

EXPOSE 4200

CMD ["node", "dist/main.js"]