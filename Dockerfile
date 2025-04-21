# Stage 1: install deps
FROM node:18-alpine as deps
WORKDIR /app
COPY package*.json yarn.lock ./
RUN yarn install

# Stage 2: build app
FROM node:18-alpine as build
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN yarn build

# Stage 3: run app
FROM node:18-alpine as runner
WORKDIR /app
COPY --from=build /app/public ./public
COPY --from=build /app/.next/standalone ./
COPY --from=build /app/.next/static ./.next/static

ENV PORT=4352

EXPOSE 4352

CMD ["node", "server.js"]