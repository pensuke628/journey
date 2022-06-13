# nodeのバージョンを指定する
FROM node:16.14-alpine

# 環境変数を定義する
ENV APP /journey/frontend

# Docker内部でworkdirの場所と名前を指定する
WORKDIR $APP

# package.json, yarn.lockをDocker内部にコピーする
COPY package.json yarn.lock $APP/
RUN yarn

# ソースコードをコピーしてビルドする
COPY . $APP/
RUN yarn build

# コンテナ起動時,3000ポートを使用する
EXPOSE 3000

CMD ["yarn", "start"]