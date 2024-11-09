# 构建阶段
FROM node:18-alpine as builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# 运行阶段
FROM node:18-alpine

WORKDIR /app

COPY --from=builder /app/.output /app/.output
COPY --from=builder /app/.nuxt /app/.nuxt
COPY --from=builder /app/package*.json ./

RUN npm install --production

EXPOSE 3000

CMD ["node", ".output/server/index.mjs"] 