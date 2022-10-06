FROM node:16.17.1-alpine

WORKDIR /app

COPY ./package.json ./package.json

RUN yarn

COPY . .

CMD ["yarn", "start"]