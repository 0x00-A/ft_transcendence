FROM node:20-alpine

WORKDIR /app/frontend/

COPY package.json /app/frontend/
RUN npm i

COPY . .

EXPOSE 3000

CMD ["npm", "run", "dev"]


# FROM node:18-alpine

# WORKDIR /app

# COPY package.json .

# RUN npm install

# RUN npm i -g serve

# COPY . .

# RUN npm run build

# EXPOSE 3000

# CMD [ "serve", "-s", "dist" ]