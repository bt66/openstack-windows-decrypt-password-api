FROM node:lts-alpine

RUN apk update
RUN apk add openssl
WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install
COPY . .

EXPOSE 3000

CMD [ "node", "index.js" ]
