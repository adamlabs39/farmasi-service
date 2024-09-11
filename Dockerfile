FROM node:16-alpine

WORKDIR /adameds-farmasi
COPY package.json .
RUN npm install
COPY . .
CMD npm start
