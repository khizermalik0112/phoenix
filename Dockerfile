# Stage 1
FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./

RUN npm install --no-audit --no-fund

COPY . .

RUN npm run build
 
RUN npm prune --production && npm cache clean --force
 
# Stage 2: PRODUCTION
FROM alpine:3.19

WORKDIR /app

RUN apk add --no-cache nodejs

RUN addgroup -S node && adduser -S node -G node

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/index.js ./index.js
COPY --from=builder /app/dist ./dist

ENV NODE_ENV=production
EXPOSE 5000

RUN chown -R node:node /app

USER node

CMD ["node", "index.js"]