FROM mhart/alpine-node-auto

RUN apk update\
    && apk add git openssh-client \
    && npm install -g yarn \
    && npm install -g istanbul \
    && npm install -g mocha

RUN mkdir -p /languagepack-git
WORKDIR /languagepack-git

COPY package.json .
RUN yarn

COPY . .

CMD ["yarn", "start"]
