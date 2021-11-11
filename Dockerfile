FROM node:lts-alpine

RUN mkdir -p /home/node/app/node_modules

WORKDIR /home/node/app

COPY package.json yarn.* ./

RUN apk add --no-cache git

# RUN apk update && apk add python3
RUN apk add --update --no-cache build-base python3-dev python3 libffi-dev libressl-dev bash git gettext curl \
 && curl -O https://bootstrap.pypa.io/get-pip.py \
 && python3 get-pip.py \
 && pip install --upgrade six awscli awsebcli

COPY . /home/node/app/

RUN chown -R node:node /home/node

RUN yarn cache clean --force

RUN yarn

USER node

EXPOSE 3333

CMD ["node", "ace", "serve", "--watch"]
