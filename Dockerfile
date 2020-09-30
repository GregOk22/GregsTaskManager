FROM node:8

COPY package.json .
RUN npm install && npm cache clean --force

COPY . .

CMD [ "npm", "start" ]