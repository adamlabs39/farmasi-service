FROM node:16-alpine

WORKDIR /adameds-farmasi
COPY . .
RUN npm install
CMD npm start
