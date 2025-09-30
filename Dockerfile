FROM node:alpine

WORKDIR /src

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3000

RUN npm run build:swc

CMD [ "npm", "run", "start" ]