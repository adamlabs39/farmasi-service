FROM node:19.5.0-alpine
WORKDIR /adameds-farmasi
ENV APPLICATION_PORT=8086
ENV APPLICATION_HOST=0.0.0.0
COPY . .
RUN npm install
CMD ["npm", "run", "start"]
