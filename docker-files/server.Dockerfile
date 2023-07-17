FROM node:16 AS builder

WORKDIR /app

COPY package*.json ./
COPY server/package*.json ./server/
COPY server/prisma ./server/prisma/

RUN npm install

COPY server/ ./server/

RUN npm run build -w server

FROM node:16

WORKDIR /app

COPY server/.env ./server/
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/server/package*.json ./server
RUN mkdir -p ./server/dist
COPY --from=builder /app/server/dist ./server/dist

WORKDIR /