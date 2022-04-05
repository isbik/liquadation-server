#  Liquadation server

You need install **[docker](https://docs.docker.com/get-docker/)**  and  need `docker-compose` to launch backend

**Steps for production**
1. Execute `cp .env.example .env` and then fill in empty values
2. Execute `npm run migrate-up`
3. Execute `docker-compose up --build` 

**Steps for development**

1. Execute  `cp .env.example env` and then fill in empty values
2. Execute `docker-compose up --build` 
3. Execute `npm run migrate-up`
4. Run `npm i`  and `npm run start:dev`