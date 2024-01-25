FROM node
ENV DuetIP="http://duet.local"
ENV DuetPassword="reprap"
ENV SpoolmanIP="http://192.168.178.41:7912"
ENV Timer=10000
WORKDIR /src
COPY package.json package.json
RUN npm install
COPY . .
CMD [ "node", "index.js" ]