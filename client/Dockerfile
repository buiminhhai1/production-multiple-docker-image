FROM node:alpine

WORKDIR /app

COPY package*.json ./

RUN chmod 777 /usr/local/bin/docker-entrypoint.sh \ && ln -s /usr/local/bin/docker-entrypoint.sh /
RUN npm install

COPY ./ ./

RUN npm run build
FROM nginx

EXPOSE 3000

COPY ./nginx/default.conf /etc/nginx/conf.d/default.conf

COPY --from=0 /app/build /usr/share/nginx/html

CMD ["npm", "run", "start"]