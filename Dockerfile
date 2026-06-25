FROM node:22-alpine AS builder

WORKDIR /app

COPY package*.json .
COPY tsconfig.json .
COPY postcss.config.mjs .
COPY next.config.ts .
COPY next-env.d.ts .
COPY eslint.config.mjs .
COPY vite.config.ts .
COPY .prettierrc .

RUN npm ci

COPY src ./src
COPY public ./public

RUN npm run build

FROM node:22-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=8080

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

EXPOSE 8080
CMD ["node", "server.js"]
