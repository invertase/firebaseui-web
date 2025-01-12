FROM node:20-alpine

WORKDIR /app

COPY package.json ./

RUN npm i

COPY src/ ./src
COPY stencil.config.ts ./stencil.config.ts
COPY tailwind.config.js ./tailwind.config.js
COPY tsconfig.json ./tsconfig.json

RUN npm run build

CMD ["npx", "serve", "./www"]
