FROM node:20-alpine

WORKDIR /app

# Copy root and sub-package files
COPY package*.json ./
COPY CMS/package*.json ./CMS/
COPY SERVER/package*.json ./SERVER/

# Install dependencies
RUN npm run install:all

# Copy all source files
COPY . .

# Build frontend and Prisma client
RUN npm run build

EXPOSE 5000

ENV PORT=5000
ENV NODE_ENV=production
ENV DATABASE_URL="file:./dev.db"

CMD ["npm", "start"]
