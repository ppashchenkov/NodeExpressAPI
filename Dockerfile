FROM node
WORKDIR /server
COPY package.json /server
RUN npm install
COPY . /server
CMD ["node","server.js"]