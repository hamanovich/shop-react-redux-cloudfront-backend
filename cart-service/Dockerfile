FROM node:14-alpine as base

WORKDIR /app
COPY package*.json ./
RUN npm install

WORKDIR /app
COPY . .
RUN npm run build

FROM node:14-alpine as application

ENV NODE_ENV=production

WORKDIR /app
COPY --from=base /app/package*.json ./
RUN npm install --only=production
COPY --from=base /app/dist ./dist

USER node
ENV PORT=8080
EXPOSE 8080
CMD ["node", "/app/dist/main.js"]