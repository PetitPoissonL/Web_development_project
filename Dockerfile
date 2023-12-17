FROM alpine:3.16.2

WORKDIR /usr/src/app

COPY package*.json ./

RUN apk add nodejs npm
RUN npm install

COPY src ./src

COPY *.json ./

RUN npm run build

CMD ["node", "/usr/src/app/dist/main"]
