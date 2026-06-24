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

RUN npm install

COPY src ./src
COPY public ./public

RUN npm run build

EXPOSE 8080
CMD ["npm", "run", "start8080"]