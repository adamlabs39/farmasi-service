FROM node:19.5.0-alpine
WORKDIR /adameds-farmasi
COPY . .
RUN npm install
CMD npm start
