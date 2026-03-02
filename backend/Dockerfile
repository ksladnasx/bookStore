FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY src ./src
COPY db ./db
EXPOSE 3000
CMD node db/seed.js 2>/dev/null; node src/index.js
