FROM mhart/alpine-node-auto

RUN apk update\
    && apk add git openssh-client \
    && apk add build-base gcc abuild binutils binutils-doc gcc-doc \
    && apk add python \
    && npm install -g yarn\
    && npm install -g istanbul\
    && npm install -g mocha\
    && npm install -g babel-istanbul\
    && npm install -g eslint\
    && npm install -g eslint-config-eslint\
    && npm install -g eslint-plugin-node\
    && npm install -g eslint-config-node\
    && npm install -g eslint-config-babel\
    && npm install -g eslint-plugin-flowtype\
    && npm install -g eslint-config-gulp\
    && npm install -g eslint-plugin-import\
    && npm install -g eslint-plugin-no-async-without-await\
    && npm install -g babel-eslint\
    && npm install -g eslint-plugin-react\
    && npm install -g eslint-config-airbnb\
    && npm install -g eslint-plugin-jsx-a11y\
    && npm install -g eslint-config-grunt\
    && npm install -g eslint-plugin-pabigot\
    && npm install -g gulp\
    && npm install -g eslint-config-grunt\
    && npm install -g grunt\
    && npm install -g grunt-cli\
    && npm install -g gzip-js\
    && npm install -g eslint-config-jquery\
    && npm install -g grunt-babel\
    && npm install -g grunt-compare-size\
    && npm install -g grunt-contrib-uglify\
    && npm install -g grunt-contrib-watch\
    && npm install -g grunt-eslint\
    && npm install -g grunt-git-authors\
    && npm install -g grunt-jsonlint\
    && npm install -g grunt-newer\
    && npm install -g grunt-npmcopy\
    && npm install -g husky\
    && npm install -g insight\
    && npm install -g jsdom\
    && npm install -g jquery\
    && npm install -g karma


















  


RUN mkdir -p /languagepack-languagepack
WORKDIR /languagepack-languagepack



COPY package.json .
RUN yarn
RUN npm link eslint-config-grunt
RUN npm link eslint-plugin-pabigot
RUN npm link eslint-plugin-node
RUN npm link eslint-config-node
RUN npm link eslint-plugin-jsx-a11y
RUN npm link eslint-config-airbnb
RUN npm link eslint-plugin-react
RUN npm link babel-eslint 
RUN npm link eslint-plugin-import
RUN npm link eslint-config-babel
RUN npm link eslint-config-gulp
RUN npm link eslint-plugin-flowtype
RUN npm link eslint-plugin-no-async-without-await
RUN npm link gulp
RUN npm link eslint-config-grunt
RUN npm link grunt
RUN npm link grunt-cli
RUN npm link gzip-js
RUN npm link grunt-compare-size
RUN npm link grunt-babel
RUN npm link grunt-contrib-uglify
RUN npm link grunt-contrib-watch
RUN npm link grunt-git-authors
RUN npm link grunt-newer
RUN npm link grunt-jsonlint
RUN npm link grunt-npmcopy
RUN npm link husky
RUN npm link insight
RUN npm link jsdom
RUN npm link jquery
RUN npm link karma















COPY . .

CMD ["yarn", "start"]
