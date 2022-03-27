#  Liquadation server

You need install **[docker](https://docs.docker.com/get-docker/)**  and  need `docker-compose` to launch backend

**Steps for production**
1. Execute `cp .env.example .env` and then fill in empty values
2. Change   `MONGO_INITDB_HOST` to `mongodb` in `.env` file
3. Execute `docker-compose up --build` 

**Steps for development**

1. Execute  `cp .env.example env` and then fill in empty values
2. Change   `MONGO_INITDB_HOST` to `localhost` in `.env` file
3. Launch any mongodb client locally 
4. Run `npm i`  and `npm run start:dev`