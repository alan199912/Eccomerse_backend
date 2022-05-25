FROM node:14-alpine

# update apk repo
RUN echo "http://dl-4.alpinelinux.org/alpine/v3.10/main" >> /etc/apk/repositories && \
  echo "http://dl-4.alpinelinux.org/alpine/v3.10/community" >> /etc/apk/repositories

RUN apk update && apk add tzdata &&\
  cp /usr/share/zoneinfo/America/New_York /etc/localtime &&\
  echo "America/New_York" > /etc/timezone &&\
  apk del tzdata && rm -rf /var/cache/apk/*

RUN apk update

WORKDIR /home/node/app

COPY ./src/package*.json ./

RUN npm install --production

COPY ./src ./

EXPOSE 5000

CMD [ "node", "index.js" ]