FROM node:19.5.0-alpine
WORKDIR /adameds-farmasi
COPY . .
ENV APPLICATION_HOST=0.0.0.0
ENV APPLICATION_PORT=8084
RUN npm install
EXPOSE ${APPLICATION_PORT}/tcp
CMD ["npm", "run", "start"]