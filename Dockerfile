FROM node:12.12-alpine as builder

WORKDIR /app

COPY package*.json ./

RUN npm i

COPY . . 



RUN npm run build

EXPOSE 4200

CMD ["node", "dist/main.js"]