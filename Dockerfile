FROM node:19.5.0-alpine
WORKDIR /adameds-farmasi
COPY . .
ENV APPLICATION_HOST=0.0.0.0
ENV APPLICATION_PORT=8086
RUN npm install
EXPOSE ${APPLICATION_PORT}/tcp
CMD ["sh", "-c", "infisical run --env=development -- npm run start"]
# CMD ["npm", "run", "start"]