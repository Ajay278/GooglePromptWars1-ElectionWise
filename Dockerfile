FROM node:20-slim AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-slim
WORKDIR /app
COPY --from=build /app/dist ./dist
COPY server ./server
WORKDIR /app/server
RUN npm ci --omit=dev
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=8080
ENV GOOGLE_CLOUD_PROJECT=electionwise-2026
EXPOSE 8080
CMD ["node", "server/index.js"]
