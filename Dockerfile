FROM node:12.5.0-alpine

WORKDIR /app/

COPY . /app/

RUN yarn

EXPOSE 3000
